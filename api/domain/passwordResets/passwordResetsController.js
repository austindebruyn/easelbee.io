const User = require('../users/User');
const PasswordReset = require('./PasswordReset');
const uid = require('uid-safe');
const passwordUtils = require('../users/passwords');
const sendEmail = require('../../jobs/sendEmail');
const buildUrl = require('../../lib/buildUrl');

class PasswordResetCreationError extends Error {
  constructor(code, data = {}) {
    super();
    this.name = 'PasswordResetCreationError';
    this.code = code;
    Object.assign(this, data);
  }

  toJSON() {
    if (this.fields) {
      return { code: this.code, fields: this.fields };
    }
    return { code: this.code };
  }
}

module.exports.create = function (req, res, next) {
  const { email } = req.body;
  const state = {};

  return new Promise(function (resolve, reject) {
    if (typeof email !== 'string' || email.length < 1) {
      return reject(new PasswordResetCreationError('missing-email'));
    }

    return User.findOne({ where: { email } })
      .then(function (user) {
        if (!user) {
          throw new PasswordResetCreationError('invalid-email');
        }
        state.user = user;
        return uid(24);
      })
      .then(function (code) {
        return PasswordReset.create({ code, userId: state.user.id });
      })
      .then(resolve)
      .catch(reject);
  })
    .then(function (model) {
      const href = buildUrl(`/passwordResets/complete?code=${model.code}`);

      return sendEmail({
        to: email,
        subject: 'Reset your easelbee.io account',
        template: 'password-reset',
        values: {
          displayName: state.user.displayName,
          href
        }
      });
    })
    .then(function () {
      return res.json({ ok: true });
    })
    .catch(function (err) {
      if (err.name === 'PasswordResetCreationError') {
        return res.status(422).json({ ok: false, errors: [err.toJSON()] });
      }
      return next(err);
    });
};

module.exports.complete = function (req, res, next) {
  const { code, password, password2 } = req.body;

  const state = {};

  return new Promise(function (resolve, reject) {
    if (!code) {
      return reject(new PasswordResetCreationError('missing-code'));
    }
    if (!password) {
      return reject(new PasswordResetCreationError('missing-password'));
    }
    if (password !== password2) {
      return reject(new PasswordResetCreationError('passwords-dont-match'));
    }

    return PasswordReset.findOne({ where: { code }, include: [User] })
      .then(function (model) {
        state.passwordReset = model;
        if (!model) {
          throw new PasswordResetCreationError('invalid-code');
        }
        if (model.claimedAt) {
          throw new PasswordResetCreationError('code-already-used');
        }
        return model.user;
      })
      .then(resolve)
      .catch(reject);
  })
    .then(function (user) {
      state.user = user;
      return new Promise(function (resolve, reject) {
        req.login(user, function (err) {
          if (err) return reject(err);
          return resolve();
        });
      });
    })
    .then(function () {
      state.passwordReset.claimedAt = new Date();
      return state.passwordReset.save();
    })
    .then(function () {
      return passwordUtils.hash(password);
    })
    .then(function (hash) {
      state.user.password = hash;
      return state.user.save();
    })
    .then(() => state.user.toJSON())
    .then(function (json) {
      return res.json({ ok: true, user: json });
    })
    .catch(function (err) {
      if (err.name === 'PasswordResetCreationError') {
        return res.status(422).json({ ok: false, errors: [err.toJSON()] });
      }
      return next(err);
    });
};
