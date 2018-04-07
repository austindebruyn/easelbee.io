const LocalAttachmentURLBuilder = require('./LocalAttachmentURLBuilder');
const factory = require('../../tests/factory');
const { expect } = require('chai');

describe('LocalAttachmentURLBuilder', function () {
  describe('#getPublicURL', function () {
    beforeEach(async function () {
      this.attachment = await factory.create('optionAttachment', {
        objectKey: 'whatever.png'
      });
    });

    it('should build url', function () {
      const builder = new LocalAttachmentURLBuilder();
      const actual = builder.getPublicURL(this.attachment);
      expect(actual).to.eql('/uploads/whatever.png');
    });
  });
});
