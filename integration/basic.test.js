const { expect } = require('chai');
const User = require('../api/domain/users/User');
const createUser = require('../api/domain/users/createUser');

describe('login page', function () {
  afterEach(function () {
    browser.deleteCookie();
  });

  it('should error on bad login', function () {
    browser.url('/');
    expect(browser.getTitle()).to.eql('Easelbee');

    browser.waitForExist('input[name=email]');
    browser.element('input[name=email]').setValue('austin');
    browser.element('input[name=password]').setValue('austin');
    browser.click('button=Submit');

    browser.waitForEnabled('input[name=email]');
  });

  it('should create me an account', function () {
    browser.url('/');

    browser.waitForExist('input[name=email]');
    browser.click('a=Create an Account');
    browser.element('input[name=displayName]').setValue('Austin');
    browser.element('input[name=email]').setValue('austin@easelbee.io');
    browser.element('input[name=password]').setValue('austin');
    browser.element('input[name=password2]').setValue('austin');
    browser.click('button=Get Started');

    browser.waitForExist('.dashboard-layout');

    return expect(User.count({ where: { email: 'austin@easelbee.io' } }))
      .to.eventually.eql(1);
  });

  describe('logging into an existing account', function () {
    beforeEach(function () {
      return createUser.createUser({
        displayName: 'Jeremy',
        email: 'jeremy@man.com',
        password: 'hello',
        password2: 'hello'
      });
    });

    it('should work', function () {
      browser.url('/');

      browser.waitForExist('input[name=email]');
      browser.element('input[name=email]').setValue('jeremy@man.com');
      browser.element('input[name=password]').setValue('hello');
      browser.click('button=Submit');

      browser.waitForExist('.dashboard-layout');
    });
  });
});
