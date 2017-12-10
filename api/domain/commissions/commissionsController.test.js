const agent = require('../../tests/agent');
const signIn = require('../../tests/signIn');
const clock = require('../../tests/clock');
const factory = require('../../tests/factory');
const expect = require('chai').expect;

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
});
