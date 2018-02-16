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
    it('should render form with error for wrong email', async function () {
      const resp = await agent()
        .post('/login')
        .send({ email: 'apples@heb.com', password: 'bananas' })
        .expect(400);
      expect(resp.header['content-type']).to.include('text/html');
      expect(resp.text).to.include('Wrong email or password.');
    });

    describe('when email is right', function () {
      beforeEach(async function () {
        await factory.create('user', {
          displayName: 'Renes',
          password: 'politics87',
          email: 'descarte@gov.gov'
        });
      });

      it('should error', async function () {
        const resp = await agent()
          .post('/login')
          .send({ email: 'descarte@gov.gov', password: 'banana' })
          .expect(400);
        expect(resp.header['content-type']).to.include('text/html');
        expect(resp.text).to.include('Wrong email or password.');
      });

      it('should sign in', async function () {
        const resp = await agent()
          .post('/login')
          .send({ email: 'descarte@gov.gov', password: 'politics87' })
          .expect(200);
        expect(resp.text).to.include('You are now logged in.');
      });

      it('should tell lynbot', async function () {
        await agent()
          .post('/login')
          .send({ email: 'descarte@gov.gov', password: 'politics87' })
          .expect(200);
        const message = '__descarte@gov.gov__ just signed in.';
        expect(LynbotAPI.prototype.send).to.have.been.calledWith(message);
      });
    });
  });

  describe('POST /signout', function () {
    beforeEach(async function () {
      await signIn();
    });

    it('should sign user out', async function () {
      await agent()
        .post('/signout')
        .accept('application/json')
        .expect(200, {
          ok: true
        });
    });

    it('should sign user out and redirect if using form', async function () {
      await agent()
        .post('/signout')
        .accept('text/html')
        .expect(200, 'You are now logged out.');
    });
  });
});
