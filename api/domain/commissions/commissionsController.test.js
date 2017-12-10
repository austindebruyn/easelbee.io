const agent = require('../../tests/agent');
const signIn = require('../../tests/signIn');
const clock = require('../../tests/clock');
const factory = require('../../tests/factory');
const expect = require('chai').expect;
const Commission = require('./Commission');
const sinon = require('sinon');

describe('commissionsController', function () {
  clock();

  describe('GET /api/users/me/commissions', function () {
    it('should 403 if signed out', function () {
      return agent()
        .get('/api/users/me/commissions')
        .cookiejar()
        .accept('application/json')
        .expect(403);
    });

    describe('when signed in', function () {
      beforeEach(function () {
        return factory.create('user')
          .then(user => {
            this.user = user;
            return signIn(user);
          });
      });

      it('should return empty set', function () {
        return agent()
          .get('/api/users/me/commissions')
          .cookiejar()
          .accept('application/json')
          .expect(200, {
            ok: true,
            records: []
          });
      });

      describe('when records', function () {
        beforeEach(function () {
          return factory.create('commission', {
            userId: this.user.id
          }).then(record => record.toJSON())
            .then(json => {
              this.commissionJson = json;
            });
        });

        it('should return records', function () {
          return agent()
            .get('/api/users/me/commissions')
            .cookiejar()
            .accept('application/json')
            .expect(200)
            .then(req => {
              expect(req.body.ok).to.be.true;
              expect(req.body.records).to.have.length(1);
              expect(req.body.records[0]).to.eql(this.commissionJson);
            });
        });
      });
    });
  });

  describe('POST /api/users/me/commissions', function () {
    it('should 403 if signed out', function () {
      return agent()
        .post('/api/users/me/commissions')
        .send({ email: 'some@client.com' })
        .cookiejar()
        .accept('application/json')
        .expect(403);
    });

    describe('when signed in', function () {
      beforeEach(function () {
        return factory.create('user')
          .then(user => {
            this.user = user;
            return signIn(user);
          });
      });

      describe('on error', function () {
        beforeEach(function () {
          sinon.stub(Commission, 'create').rejects();
        });

        afterEach(function () {
          Commission.create.restore();
        });

        it('should return 422', function () {
          return agent()
            .post('/api/users/me/commissions')
            .send({ email: 'some@client.com' })
            .cookiejar()
            .accept('application/json')
            .expect(422, { ok: false });
        });
      });

      describe('on success', function () {
        it('should return 200', function () {
          return agent()
            .post('/api/users/me/commissions')
            .send({ email: 'some@client.com', body: 'Hey.' })
            .cookiejar()
            .accept('application/json')
            .expect(200)
            .then(res => {
              expect(res.body.ok).to.be.true;
              expect(res.body.record).to.include({
                id: 1,
                email: 'some@client.com',
                body: 'Hey.'
              });
            });
        });
      });
    });
  });
});
