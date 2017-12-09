const signIn = require('../../tests/signIn');
const agent = require('../../tests/agent');
const factory = require('../../tests/factory');
const clock = require('../../tests/clock');
const LynbotAPI = require('../../lib/LynbotAPI');
const { expect } = require('chai');
const sinon = require('sinon');

describe('sessionsController', function () {
  clock();

  beforeEach(function () {
    sinon.stub(LynbotAPI.prototype, 'send');
  });

  afterEach(function () {
    LynbotAPI.prototype.send.restore();
  });

  describe('POST /login', function () {
    it('should error for wrong displayName', function () {
      return agent()
        .post('/login')
        .send({ email: 'apples@heb.com', password: 'bananas' })
        .expect(400, {
          ok: false,
          errors: [{ code: 'WRONG_EMAIL_OR_PASSWORD' }]
        });
    });

    describe('when email is right', function () {
      beforeEach(function () {
        return factory.create('user', {
          displayName: 'Renes',
          password: 'politics87',
          email: 'descarte@gov.gov'
        });
      });

      it('should error', function () {
        return agent()
          .post('/login')
          .send({ email: 'descarte@gov.gov', password: 'banana' })
          .expect(400, {
            ok: false,
            errors: [{ code: 'WRONG_EMAIL_OR_PASSWORD' }]
          });
      });

      it('should sign in', function () {
        return agent()
          .post('/login')
          .send({ email: 'descarte@gov.gov', password: 'politics87' })
          .expect(200, {
            ok: true,
            user: {
              id: 1,
              displayName: 'Renes',
              email: 'descarte@gov.gov',
              createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
              updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT'
            }
          });
      });

      it('should tell lynbot', function () {
        return agent()
          .post('/login')
          .send({ email: 'descarte@gov.gov', password: 'politics87' })
          .expect(200)
          .then(function () {
            const message = '__descarte@gov.gov__ just signed in.';
            expect(LynbotAPI.prototype.send)
              .to.have.been.calledWith(message);
          });
      });
    });
  });

  describe('POST /logout', function () {
    beforeEach(function () {
      return signIn();
    });

    it('should sign user out', function () {
      return agent()
        .post('/logout')
        .expect(200);
    });
  });
});
