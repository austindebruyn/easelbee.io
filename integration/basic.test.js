const { expect } = require('chai')
const User = require('../api/domain/users/User')
const createUser = require('../api/domain/users/createUser')

describe('home page', function () {
  afterEach(function () {
    browser.deleteCookie()
  })

  it('should error on bad login', function () {
    browser.url('/')
    expect(browser.getTitle()).to.eql('Easelbee')

    browser.waitForExist('input[name=username]')
    browser.element('input[name=username]').setValue('austin')
    browser.element('input[name=password]').setValue('austin')
    browser.click('button=Submit')

    browser.waitForEnabled('input[name=username]')
    browser.waitForExist('.error-list')
    expect(browser.element('.error-list').getText()).to.eql('Wrong username or password.')
  })
  
  it('should create me an account', function () {
    browser.url('/')

    browser.waitForExist('input[name=username]')
    browser.click('a=Create an Account')
    browser.element('input[name=username]').setValue('austin')
    browser.element('input[name=inviteCode]').setValue('polarbear')
    browser.element('input[name=password]').setValue('austin')
    browser.element('input[name=password2]').setValue('austin')
    browser.element('input[name=email]').setValue('austin.debruyn@gmail.com')
    browser.click('button=Get Started')

    browser.waitForExist('.dashboard')

    return expect(User.count({ where: { username: 'austin' } })).to.eventually.eql(1);
  })
  
  describe('logging into an existing account', function () {
    beforeEach(function () {
      return createUser.createUser({
        username: 'jeremy',
        password: 'hello',
        password2: 'hello',
        email: 'jeremy@man.com',
        inviteCode: 'polarbear'
      })
    })

    it('should work', function () {
      browser.url('/')

      browser.waitForExist('input[name=username]')
      browser.element('input[name=username]').setValue('jeremy')
      browser.element('input[name=password]').setValue('hello')
      browser.click('button=Submit')

      browser.waitForExist('.dashboard')
    })
  })
})
