const { createUser } = require('./createUser');
const EmailPreferences = require('../emailPreferences/EmailPreferences');
const User = require('../users/User');
const { expect } = require('chai');
const factory = require('../../tests/factory');
const clock = require('../../tests/clock');
const queue = require('kue').createQueue();
const LynbotAPI = require('../../lib/LynbotAPI');
const sinon = require('sinon');

describe('createUser', function () {
  beforeEach(function () {
    sinon.stub(LynbotAPI.prototype, 'send');
  });

  afterEach(function () {
    LynbotAPI.prototype.send.restore();
  });

  it('should reject non matching passwords', function () {
    return expect(createUser({ password: 'apples', password2: 'bananas' }))
      .to.eventually.be.rejected.and.have.property('code', 'PASSWORDS_DONT_MATCH');
  });

  it('should reject missing password', function () {
    return expect(createUser({ username: '' }))
      .to.eventually.be.rejected.and.have.property('code', 'MISSING_PASSWORD');
  });

  it('should reject missing email', function () {
    return expect(createUser({ username: '', password: 'hey', password2: 'hey', email: '' }))
      .to.eventually.be.rejected.and.have.property('code', 'BAD_EMAIL');
  });

  it('should reject bad format email', function () {
    return expect(createUser({ username: '', password: 'hey', password2: 'hey', email: '@kjsa' }))
      .to.eventually.be.rejected.and.have.property('code', 'BAD_EMAIL');
  });

  describe('when a user exists', function () {
    beforeEach(function () {
      return factory.create('user', { username: 'man' });
    });

    it('should reject used username', function () {
      return expect(createUser({
        username: 'man',
        email: 'apple@banana.com',
        password: 'a',
        password2: 'a'
      })).to.eventually.be.rejected.and.have.property('code', 'USERNAME_NOT_UNIQUE');
    });
  });

  describe('when user doesnt exist', function () {
    clock();

    it('should validate model', function () {
      return expect(createUser({
        username: 'm',
        email: 'apple@banana.com',
        password: 'b',
        password2: 'b'
      })).to.eventually.be.rejected.and.deep.include({
        code: 'VALIDATION',
        fields: ['username']
      });
    });

    it('should create email preferences model', function () {
      return createUser({
        username: 'man2',
        email: 'peter@pan.com',
        password: 'b',
        password2: 'b'
      })
        .then(user => {
          return User.findOne({ where: { id: user.id }, include: [EmailPreferences] });
        }).then(user => user.emailPreferences.toJSON())
        .then(emailPreferences => {
          expect(emailPreferences).to.include({
            id: 1,
            verifiedAt: null,
            optedOutAt: null,
            createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
            updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
            userId: 1
          });
        });
    });

    it('should tell lynbot', function () {
      return createUser({
        username: 'man2',
        email: 'peter@pan.com',
        password: 'b',
        password2: 'b'
      })
        .then(user => {
          const expected = 'A new user __peter@pan.com__ just signed up!';
          expect(LynbotAPI.prototype.send)
            .to.have.been.calledWith(expected);
        });
    });

    it('should send verify email', function () {
      return createUser({
        username: 'man2',
        email: 'peter@pan.com',
        password: 'b',
        password2: 'b'
      })
        .then(user => {
          return User.findOne({ where: { id: user.id }, include: [EmailPreferences] });
        })
        .then(function (user) {
          const job = queue.testMode.jobs[0];

          expect(job).to.have.property('type', 'email');
          expect(job.data).to.eql({
            to: 'peter@pan.com',
            subject: 'Please verify your email',
            template: 'verify-email',
            values: {
              username: 'man2',
              href: `http://test-easelbee.io:8000/users/me/emailPreferences/verify?verificationCode=${user.emailPreferences.verificationCode}`
            }
          });
        });
    });
  });
});
