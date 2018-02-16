const PasswordReset = require('./PasswordReset');
const passwordUtils = require('../users/passwords');
const agent = require('../../tests/agent');
const clock = require('../../tests/clock');
const signIn = require('../../tests/signIn');
const factory = require('../../tests/factory');
const queue = require('kue').createQueue();
const expect = require('chai').expect;

describe('passwordResetsController', function () {
  clock();

  beforeEach(async function () {
    this.user = await factory.create('user', {
      displayName: 'jhoffy',
      email: 'jhoffy@gmail.com'
    });
  });

  describe('GET /passwordResets/new', function () {
    it('should render form', async function () {
      const resp = await agent().get('/passwordResets/new').expect(200);
      expect(resp.header['content-type']).to.include('text/html');
      expect(resp.text).to.include('Reset Your Password');
    });
  });

  describe('GET /passwordResets/complete', function () {
    it('should render form', async function () {
      const resp = await agent().get('/passwordResets/complete').expect(200);
      expect(resp.header['content-type']).to.include('text/html');
      expect(resp.text).to.include('Reset Your Password');
    });
  });

  describe('POST /passwordResets', function () {
    it('should 403 if signed in', function () {
      return signIn()
        .then(function () {
          return agent()
            .post('/passwordResets')
            .cookiejar()
            .accept('application/json')
            .expect(403);
        });
    });

    it('should render form with error if no email', async function () {
      const resp = await agent()
        .post('/passwordResets')
        .accept('application/json')
        .send({ email: '' });

      expect(resp.header['content-type']).to.include('text/html');
      expect(resp.text).to.include('Reset Your Password');
      expect(resp.text).to.include('missing-email');
    });

    it('should error if no user with that email', async function () {
      const resp = await agent()
        .post('/passwordResets')
        .accept('application/json')
        .send({ email: 'ahofek@gmail.com' });

      expect(resp.header['content-type']).to.include('text/html');
      expect(resp.text).to.include('Reset Your Password');
      expect(resp.text).to.include('invalid-email');
    });

    it('should render form and create model on success', async function () {
      const resp = await agent()
        .post('/passwordResets')
        .accept('application/json')
        .send({ email: 'jhoffy@gmail.com' })
        .expect(200);
      const ct = await PasswordReset.count({
        where: { userId: this.user.id, claimedAt: null }
      });
      expect(ct).to.eql(1);
      expect(resp.header['content-type']).to.include('text/html');
      expect(resp.text).to.include('Reset Your Password');
    });

    it('should send the email', async function () {
      await agent()
        .post('/passwordResets')
        .accept('application/json')
        .send({ email: 'jhoffy@gmail.com' })
        .expect(200);
      const model = await PasswordReset.findOne({ where: {} });
      expect(queue.testMode.jobs[0].data).to.eql({
        to: 'jhoffy@gmail.com',
        subject: 'Reset your easelbee.io account',
        template: 'password-reset',
        values: {
          displayName: 'jhoffy',
          href: `http://test-easelbee.io:8000/passwordResets/complete?code=${model.code}`
        }
      });
    });
  });

  describe('POST /passwordResets/complete', function () {
    it('should 403 if signed in', async function () {
      await signIn();
      await agent()
        .post('/passwordResets')
        .cookiejar()
        .accept('application/json')
        .expect(403);
    });

    it('should render form with error if no code', async function () {
      const resp = await agent()
        .post('/passwordResets/complete')
        .accept('application/json')
        .expect(200);

      expect(resp.header['content-type']).to.include('text/html');
      expect(resp.text).to.include('Reset Your Password');
      expect(resp.text).to.include('missing-code');
    });

    it('should error if missing password', async function () {
      const resp = await agent()
        .post('/passwordResets/complete')
        .accept('application/json')
        .send({ code: 'PANDA' })
        .expect(200);
      expect(resp.header['content-type']).to.include('text/html');
      expect(resp.text).to.include('Reset Your Password');
      expect(resp.text).to.include('missing-password');
    });

    it('should render form with error if passwords dont match', async function () {
      const resp = await agent()
        .post('/passwordResets/complete')
        .accept('application/json')
        .send({ code: 'PANDA', password: 'bananas88', password2: 'apricots!' })
        .expect(200);
      expect(resp.header['content-type']).to.include('text/html');
      expect(resp.text).to.include('Reset Your Password');
      expect(resp.text).to.include('passwords-dont-match');
    });

    it('should render form with error if no such code', async function () {
      const resp = await agent()
        .post('/passwordResets/complete')
        .accept('application/json')
        .send({ code: 'PANDA', password: 'bananas88', password2: 'bananas88' })
        .expect(200);
      expect(resp.header['content-type']).to.include('text/html');
      expect(resp.text).to.include('Reset Your Password');
      expect(resp.text).to.include('invalid-code');
    });

    describe('when code exists but is used', function () {
      beforeEach(async function () {
        await PasswordReset.create({
          code: 'PANDA',
          claimedAt: new Date()
        });
      });

      it('should render form with error if no such code', async function () {
        const resp = await agent()
          .post('/passwordResets/complete')
          .accept('application/json')
          .send({ code: 'PANDA', password: 'bananas88', password2: 'bananas88' })
          .expect(200);
        expect(resp.header['content-type']).to.include('text/html');
        expect(resp.text).to.include('Reset Your Password');
        expect(resp.text).to.include('code-already-used');
      });
    });

    describe('when code exists and hasnt been used', async function () {
      beforeEach(async function () {
        await PasswordReset.create({
          code: 'MARIO', userId: this.user.id
        });
      });

      it('should return user and claim the model', async function () {
        const resp = await agent()
          .post('/passwordResets/complete')
          .accept('application/json')
          .send({
            code: 'MARIO',
            password: 'bananas88',
            password2: 'bananas88'
          })
          .expect(200);
        expect(resp.text).to.include('You are now logged in.');
        const model = await PasswordReset.findOne({ where: { code: 'MARIO' } });
        expect(model.claimedAt).to.eql(new Date());
      });

      it('should set the new password', async function () {
        await agent()
          .post('/passwordResets/complete')
          .accept('application/json')
          .send({ code: 'MARIO', password: 'holidays', password2: 'holidays' })
          .expect(200);
        await this.user.reload();
        const success = await passwordUtils.verify(
          'holidays',
          this.user.password
        );
        expect(success).to.be.true;
      });

      it('should log me in', async function () {
        await agent()
          .post('/passwordResets/complete')
          .accept('application/json')
          .send({ code: 'MARIO', password: 'holidays', password2: 'holidays' })
          .expect('Set-Cookie', /^connect.sid=/);
      });
    });
  });
});
