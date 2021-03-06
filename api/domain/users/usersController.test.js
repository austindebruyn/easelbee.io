const createUser = require('./createUser');
const agent = require('../../tests/agent');
const clock = require('../../tests/clock');
const signIn = require('../../tests/signIn');
const { expect } = require('chai');
const sinon = require('sinon');
const LynbotAPI = require('../../lib/LynbotAPI');

describe('usersController', function () {
  var sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    sinon.stub(LynbotAPI.prototype, 'send');
  });

  afterEach(function () {
    sandbox.restore();
    LynbotAPI.prototype.send.restore();
  });

  clock();

  describe('POST /api/users', function () {
    describe('when createUser succeeds', function () {
      beforeEach(function () {
        sandbox.spy(createUser, 'createUser');
      });

      it('should invoke createUser', function () {
        const postBody = {
          displayName: 'turkish',
          email: 'edgar@allen.poe',
          password: 'allegory',
          password2: 'fighter'
        };
        return agent()
          .post('/api/users')
          .accept('application/json')
          .send(postBody)
          .then(function () {
            expect(createUser.createUser).to.have.been.calledWith(postBody);
          });
      });

      it('should return user and sign me in', async function () {
        await agent()
          .post('/api/users')
          .accept('application/json')
          .send({
            displayName: 'turkish',
            email: 'austin@baustin.com',
            password: 'allegory',
            password2: 'allegory'
          })
          .expect(200, 'You are now signed in.');
      });
    });

    it('when createUser rejects should return 500', function () {
      sandbox.stub(createUser, 'createUser').rejects();

      return agent()
        .post('/api/users')
        .accept('application/json')
        .send({ displayName: 'hey', password: 'austin', password2: 'austin' })
        .expect(500, {
          ok: false
        });
    });
  });

  describe('GET /api/users/me', function () {
    it('when signed out should 403', function () {
      return agent()
        .get('/api/users/me')
        .accept('application/json')
        .redirects(0)
        .expect(403);
    });

    describe('when signed in', function () {
      beforeEach(function () {
        return signIn({ displayName: 'sasquatch', email: 'austin@baustin.com' });
      });

      it('should return my user on sign in', function () {
        return agent()
          .get('/api/users/me')
          .accept('application/json')
          .cookiejar()
          .redirects(0)
          .expect(200, {
            id: 1,
            displayName: 'sasquatch',
            email: 'austin@baustin.com',
            createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
            updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT'
          });
      });
    });
  });

  describe('PUT /api/users/me', function () {
    beforeEach(function () {
      return signIn();
    });

    it('should change displayName', function () {
      return agent()
        .put('/api/users/me')
        .accept('application/json')
        .cookiejar()
        .send({ displayName: 'elizabeth' })
        .expect(200, {
          ok: true,
          user: {
            id: 1,
            email: signIn.user.email,
            createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
            updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
            displayName: 'elizabeth'
          }
        });
    });
  });
});
