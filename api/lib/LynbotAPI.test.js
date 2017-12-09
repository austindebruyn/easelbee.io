const LynbotAPI = require('./LynbotAPI');
const axios = require('axios');
const sinon = require('sinon');
const { expect } = require('chai');

describe('LynbotAPI', function () {
  describe('#send', function () {
    afterEach(function () {
      axios.post.restore();
    });

    describe('when request successful', function () {
      beforeEach(function () {
        sinon.stub(axios, 'post').resolves();
      });

      it('resolves', function () {
        const api = new LynbotAPI();
        return expect(api.send('Hey.')).to.eventually.be.undefined;
      });

      it('should request', function () {
        const api = new LynbotAPI();

        return api.send('Hey. :tada:')
          .then(function () {
            const url = 'http://localhost:3000/post';
            const body = { message: 'Hey. :tada:' };
            const opts = {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'password'
              }
            };
            expect(axios.post).to.have.been.calledWith(url, body, opts);
          });
      });
    });

    describe('when request fails', function () {
      beforeEach(function () {
        sinon.stub(axios, 'post').rejects();
      });

      it('resolves', function () {
        const api = new LynbotAPI();
        return expect(api.send('Hey.')).to.eventually.be.rejected;
      });
    });
  });
});
