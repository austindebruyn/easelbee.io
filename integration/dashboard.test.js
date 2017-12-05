const { expect } = require('chai')
const path = require('path')
const factory = require('../api/tests/factory')

describe('dashboard', function () {
  describe('when already logged in', function () {
    login()

    it('should show me dashboard', function () {
      browser.url('/')
      browser.waitForExist('.dashboard')

      console.log(browser.getText())
    })
  })
})
