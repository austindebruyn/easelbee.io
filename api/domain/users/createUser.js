const _ = require('lodash');
const User = require('./User');
const EmailPreferences = require('../emailPreferences/EmailPreferences');
const hashPasswords = require('./passwords').hash;
const sendVerificationEmail = require('../emailPreferences/sendVerificationEmail');
const uid = require('uid-safe');
const LynbotAPI = require('../../lib/LynbotAPI');

class UserCreationError extends Error {
  constructor(code, data = {}) {
    super();
    this.name = 'UserCreationError';
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

module.exports.createUser = function createUser(data) {
  const {
    displayName,
    email,
    password,
    password2
  } = data;

  return new Promise(function (resolve, reject) {
    var state = {};

    return new Promise(function (resolve, reject) {
      if (password !== password2) {
        return reject(new UserCreationError('PASSWORDS_DONT_MATCH'));
      }
      if (!password) {
        return reject(new UserCreationError('MISSING_PASSWORD'));
      }
      if (!(email && email.match(/^.+@.+$/))) {
        return reject(new UserCreationError('BAD_EMAIL'));
      }
      return resolve();
    })
      .then(function () {
        return User.findAll({ where: { email } });
      })
      .then(function (records) {
        if (records.length > 0) {
          throw new UserCreationError('EMAIL_NOT_UNIQUE');
        }
        return hashPasswords(password);
      })
      .then(function (password) {
        return User.create({ displayName, email, password });
      })
      .then(function (user) {
        state.user = user;
        return uid(24);
      })
      .then(function (verificationCode) {
        return EmailPreferences.create({ userId: state.user.id, verificationCode });
      })
      .then(function (model) {
        model.user = state.user;
        return sendVerificationEmail.sendVerificationEmail(model);
      })
      .then(function () {
        return new LynbotAPI().send(`A new user __${email}__ just signed up!`);
      })
      .then(function () {
        return resolve(state.user);
      })
      .catch(function (err) {
        if (err.name === 'SequelizeValidationError') {
          return reject(new UserCreationError('VALIDATION', { fields: _.map(err.errors, 'path') }));
        }
        return reject(err);
      });
  });
};
