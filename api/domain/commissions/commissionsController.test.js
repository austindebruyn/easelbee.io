const agent = require('../../tests/agent');
const signIn = require('../../tests/signIn');
const clock = require('../../tests/clock');
const factory = require('../../tests/factory');
const expect = require('chai').expect;
const Commission = require('./Commission');
const User = require('../users/User');
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

  describe('PATCH /api/users/me/commissions/:id', function () {
    beforeEach(function () {
      return factory.createMany('commission', 2).then(records => {
        this.commission1 = records[0];
        this.commission2 = records[1];
      });
    });

    it('should 403 if signed out', function () {
      return agent()
        .patch(`/api/users/me/commissions/${this.commission1.id}`)
        .send({ status: 'inprogress' })
        .cookiejar()
        .accept('application/json')
        .expect(403);
    });

    describe('when signed in', function () {
      beforeEach(function () {
        return User.findById(this.commission1.userId).then(signIn);
      });

      it('should 404 if not exists', function () {
        return agent()
          .patch(`/api/users/me/commissions/123456`)
          .send({ status: 'inprogress' })
          .cookiejar()
          .accept('application/json')
          .expect(404);
      });

      it('should 403 if not owned', function () {
        expect(this.commission1.userId).to.not.equal(this.commission2.userId);

        return agent()
          .patch(`/api/users/me/commissions/${this.commission2.id}`)
          .send({ status: 'inprogress' })
          .cookiejar()
          .accept('application/json')
          .expect(403);
      });

      describe('on error', function () {
        beforeEach(function () {
          sinon.stub(Commission.prototype, 'save').rejects();
        });

        afterEach(function () {
          Commission.prototype.save.restore();
        });

        it('should return 500', function () {
          return agent()
            .patch(`/api/users/me/commissions/${this.commission1.id}`)
            .send({ status: 'inprogress' })
            .cookiejar()
            .accept('application/json')
            .expect(500, { ok: false });
        });
      });

      describe('on success', function () {
        it('should return 422 when no status', function () {
          return agent()
            .patch(`/api/users/me/commissions/${this.commission1.id}`)
            .send({ status: 'whatever' })
            .cookiejar()
            .accept('application/json')
            .expect(422, {
              ok: false,
              code: 'no-such-status'
            });
        });

        it('should return 200', function () {
          return agent()
            .patch(`/api/users/me/commissions/${this.commission1.id}`)
            .send({ status: 'inprogress' })
            .cookiejar()
            .accept('application/json')
            .expect(200)
            .then(res => {
              expect(res.body.ok).to.be.true;
              expect(res.body.record).to.include({
                id: 1,
                status: 'inprogress'
              });
            });
        });
      });
    });
  });
});
