const agent = require('../../tests/agent');
const signIn = require('../../tests/signIn');
const clock = require('../../tests/clock');
const factory = require('../../tests/factory');
const expect = require('chai').expect;
const Commission = require('./Commission');
const User = require('../users/User');
const sinon = require('sinon');
const FilloutFetcher = require('../forms/FilloutFetcher');
const CommissionUpdater = require('./CommissionUpdater');
const { UnprocessableEntityError } = require('../../core/errors');

describe('commissionsController', function () {
  clock();

  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

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

  describe('GET /api/commissions/:id/fillout', function () {
    it('should 403 if signed out', function () {
      return agent()
        .get('/api/commissions/1/fillout')
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

      it('should return not found', function () {
        return agent()
          .get('/api/commissions/1/fillout')
          .cookiejar()
          .accept('application/json')
          .expect(404);
      });

      describe('and commission exists', function () {
        beforeEach(function () {
          return factory.create('commission', { userId: signIn.user.id })
            .then(commission => {
              this.commission = commission;
            });
        });

        describe('success', function () {
          beforeEach(function () {
            this.sandbox.stub(FilloutFetcher.prototype, 'toJSON').resolves([
              { test: 'ok' }
            ]);
            return factory.create('commission', { userId: signIn.user.id })
              .then(commission => {
                this.commission = commission;
              });
          });

          it('should return', function () {
            return agent()
              .get('/api/commissions/1/fillout')
              .cookiejar()
              .accept('application/json')
              .expect(200, {
                ok: true,
                record: [{ test: 'ok' }]
              });
          });
        });

        describe('on error', function () {
          beforeEach(function () {
            this.sandbox.stub(FilloutFetcher.prototype, 'toJSON').rejects(
              new UnprocessableEntityError('some-error')
            );
          });

          it('should return', function () {
            return agent()
              .get('/api/commissions/1/fillout')
              .cookiejar()
              .accept('application/json')
              .expect(422, {
                ok: false,
                code: 'some-error'
              });
          });
        });
      });
    });
  });

  describe('GET /api/commissions/:id/events', function () {
    it('should 403 if signed out', function () {
      return agent()
        .get('/api/commissions/1/events')
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

      it('should return not found', function () {
        return agent()
          .get('/api/commissions/1/events')
          .cookiejar()
          .accept('application/json')
          .expect(404);
      });

      describe('and commission exists', function () {
        beforeEach(function () {
          return factory.create('commission', { userId: signIn.user.id })
            .then(commission => {
              this.commission = commission;
            });
        });

        it('should return empty set', function () {
          return agent()
            .get('/api/commissions/1/events')
            .cookiejar()
            .accept('application/json')
            .expect(200, {
              ok: true,
              records: []
            });
        });

        describe('and events exist', function () {
          beforeEach(function () {
            return factory.create('timelineEvent', {
              commissionId: this.commission.id,
              key: 'something-cool'
            });
          });

          it('should return records', function () {
            return agent()
              .get('/api/commissions/1/events')
              .cookiejar()
              .accept('application/json')
              .expect(200, {
                ok: true,
                records: [{
                  id: 1,
                  commissionId: 1,
                  key: 'something-cool',
                  metas: [],
                  createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
                  updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT'
                }]
              });
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
          this.sandbox.stub(Commission, 'create').rejects();
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
            .send({ email: 'some@client.com', nickname: 'Jeremy' })
            .cookiejar()
            .accept('application/json')
            .expect(200)
            .then(res => {
              expect(res.body.ok).to.be.true;
              expect(res.body.record).to.include({
                id: 1,
                email: 'some@client.com',
                nickname: 'Jeremy'
              });
            });
        });
      });
    });
  });

  describe('PATCH /api/commissions/:id', function () {
    beforeEach(function () {
      return factory.createMany('commission', 2).then(records => {
        this.commission1 = records[0];
        this.commission2 = records[1];
      });
    });

    it('should 403 if signed out', function () {
      return agent()
        .patch(`/api/commissions/${this.commission1.id}`)
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
          .patch(`/api/commissions/123456`)
          .send({ status: 'inprogress' })
          .cookiejar()
          .accept('application/json')
          .expect(404);
      });

      it('should 403 if not owned', function () {
        expect(this.commission1.userId).to.not.equal(this.commission2.userId);

        return agent()
          .patch(`/api/commissions/${this.commission2.id}`)
          .send({ status: 'inprogress' })
          .cookiejar()
          .accept('application/json')
          .expect(403);
      });

      describe('on error', function () {
        beforeEach(function () {
          this.sandbox.stub(CommissionUpdater.prototype, 'update').rejects();
        });

        it('should return 500', function () {
          return agent()
            .patch(`/api/commissions/${this.commission1.id}`)
            .send({ status: 'inprogress' })
            .cookiejar()
            .accept('application/json')
            .expect(500, { ok: false });
        });
      });

      describe('on success', function () {
        beforeEach(function () {
          this.sandbox.spy(CommissionUpdater.prototype, 'update');
        });

        it('should call update', function () {
          return agent()
            .patch(`/api/commissions/${this.commission1.id}`)
            .send({ status: 'whatever' })
            .cookiejar()
            .accept('application/json')
            .then(function () {
              expect(CommissionUpdater.prototype.update)
                .to.have.been.calledWith({ status: 'whatever' });
            });
        });

        it('should return 200', function () {
          return agent()
            .patch(`/api/commissions/${this.commission1.id}`)
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
