const agent = require('../../tests/agent');
const signIn = require('../../tests/signIn');
const expect = require('chai').expect;

describe('homeController', function () {
  describe('GET /', function () {
    it('should show landing page', async function () {
      const resp = await agent().get('/').expect(200);
      expect(resp.header['content-type']).to.include('text/html');
      expect(resp.text).to.include('Easelbee is still in beta');
    });
  });

  describe('GET /app', function () {
    describe('when signed out', function () {
      it('should redirect to login', async function () {
        const resp = await agent()
          .get('/app')
          .expect(302);
        expect(resp.header.location).to.eql('/login');
      });
    });

    describe('when signed in', function () {
      beforeEach(function () {
        return signIn();
      });

      it('should render template with user', async function () {
        const resp = await agent()
          .get('/app')
          .cookiejar()
          .expect(200);
        expect(resp.text).to.include('data-user');
      });
    });
  });
});
