const config = require('../config');
const buildUrl = require('./buildUrl');
const expect = require('chai').expect;

function stubConfig(key, val) {
  var oldValue;

  beforeEach(function () {
    oldValue = config.app[key];
    config.app[key] = val;
  });

  afterEach(function () {
    config.app[key] = oldValue;
  });
}

describe('buildUrl', function () {
  stubConfig('host', 'easelbee.io');
  stubConfig('protocol', 'https');
  stubConfig('port', null);

  it('should return root', function () {
    expect(buildUrl()).to.eql('https://easelbee.io');
  });

  it('should include path', function () {
    expect(buildUrl('/route')).to.eql('https://easelbee.io/route');
    expect(buildUrl('route')).to.eql('https://easelbee.io/route');
  });

  it('should include subdomain', function () {
    expect(buildUrl('/route.jpg', 'dallas')).to.eql('https://dallas.easelbee.io/route.jpg');
    expect(buildUrl('route/thing', 'dallas')).to.eql('https://dallas.easelbee.io/route/thing');
  });

  describe('when app listening on port', function () {
    stubConfig('port', 3000);

    it('should include port', function () {
      expect(buildUrl('route')).to.eql('https://easelbee.io:3000/route');
    });
  });
});
