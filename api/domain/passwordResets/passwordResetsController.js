const User = require('../users/User');
const PasswordReset = require('./PasswordReset');
const uid = require('uid-safe');
const passwordUtils = require('../users/passwords');
const sendEmail = require('../../jobs/sendEmail');
const buildUrl = require('../../lib/buildUrl');
const { APIError, UnprocessableEntityError } = require('../../core/errors');

module.exports.new = function (req, res, next) {
  return res.render('passwordResets/new');
};

module.exports.getComplete = function (req, res, next) {
  return res.render('passwordResets/complete');
};

module.exports.create = function (req, res, next) {
  async function handle() {
    const { email } = req.body;

    if (typeof email !== 'string' || email.length < 1) {
      throw new UnprocessableEntityError('missing-email');
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new UnprocessableEntityError('invalid-email');
    }
    const code = await uid(24);
    const model = await PasswordReset.create({ code, userId: user.id });
    const href = buildUrl(`/passwordResets/complete?code=${model.code}`);

    await sendEmail({
      to: email,
      subject: 'Reset your easelbee.io account',
      template: 'password-reset',
      values: {
        displayName: user.displayName,
        href
      }
    });

    return res.render('passwordResets/complete');
  }
  handle().catch(function (err) {
    if (err instanceof APIError) {
      return res.render('passwordResets/new', {
        errors: [err.code]
      });
    }
    return next(err);
  });
};

module.exports.complete = function (req, res, next) {
  async function handle() {
    const { code, password, password2 } = req.body;

    if (!code) {
      throw new UnprocessableEntityError('missing-code');
    }
    if (!password) {
      throw new UnprocessableEntityError('missing-password');
    }
    if (password !== password2) {
      throw new UnprocessableEntityError('passwords-dont-match');
    }

    const model = await PasswordReset.findOne({
      where: { code },
      include: [User]
    });

    if (!model) {
      throw new UnprocessableEntityError('invalid-code');
    }
    if (model.claimedAt) {
      throw new UnprocessableEntityError('code-already-used');
    }

    await new Promise(function (resolve, reject) {
      req.login(model.user, function (err) {
        if (err) return reject(err);
        return resolve();
      });
    });

    model.claimedAt = new Date();
    await model.save();

    const hash = await passwordUtils.hash(password);
    model.user.password = hash;
    model.user.save();

    return res.send('You are now logged in.');
  }
  handle().catch(function (err) {
    if (err instanceof APIError) {
      return res.render('passwordResets/complete', {
        errors: [err.code]
      });
    }
    return next(err);
  });
};
