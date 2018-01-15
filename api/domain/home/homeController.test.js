const agent = require('../../tests/agent');
const signIn = require('../../tests/signIn');
const expect = require('chai').expect;

describe('homeController', function () {
  describe('GET /', function () {
    it('should redirect', function () {
      return agent().get('/').expect(302).then(function (resp) {
        expect(resp.header.location).to.eql('/app/');
      });
    });
  });

  describe('GET /app/', function () {
    describe('when signed out', function () {
      it('should render template without', function () {
        return agent()
          .get('/app/')
          .expect(200)
          .then(function (resp) {
            expect(resp.text).not.to.include('data-user');
          });
      });
    });

    describe('when signed in', function () {
      beforeEach(function () {
        return signIn();
      });

      it('should render template with user', function () {
        return agent()
          .get('/app/')
          .cookiejar()
          .expect(200)
          .then(function (resp) {
            expect(resp.text).to.include('data-user');
          });
      });
    });
  });
});
