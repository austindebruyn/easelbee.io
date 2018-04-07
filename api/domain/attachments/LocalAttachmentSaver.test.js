const LocalAttachmentSaver = require('./LocalAttachmentSaver');
const OptionAttachment = require('./OptionAttachment');
const { expect } = require('chai');
const factory = require('../../tests/factory');
const clock = require('../../tests/clock');
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');

describe('LocalAttachmentSaver', function () {
  clock();

  beforeEach(async function () {
    this.sandbox = sinon.sandbox.create();
    this.option = await factory.create('option');
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  describe('#save', function () {
    describe('when file move succeeds', function () {
      beforeEach(async function () {
        this.sandbox.stub(fs, 'rename').yields(null);
      });

      it('should move file', async function () {
        const saver = new LocalAttachmentSaver();
        await saver.save('tmp/uploads/tempfile.png', this.option.id);

        const appRoot = path.resolve(__dirname, '..', '..', '..');

        expect(fs.rename).to.have.been.calledWith(
          `${appRoot}/tmp/uploads/tempfile.png`,
          sinon.match.string
        );
        expect(path.dirname(fs.rename.args[0][1]))
          .to.eql(`${appRoot}/public/uploads`);
      });

      it('should create model', async function () {
        const saver = new LocalAttachmentSaver();
        const model = await saver.save('tmp/uploads/tempfile.png', this.option.id);

        model.reload();

        expect(model).to.include({
          objectKey: (+new Date()).toString(),
          engine: OptionAttachment.TYPES.local
        });
        expect(model.id).to.be.a('number');
      });
    });

    describe('when file move fails', function () {
      beforeEach(async function () {
        this.sandbox.stub(fs, 'rename').yields(new Error('whatever error'));
      });

      it('should return error', async function () {
        const saver = new LocalAttachmentSaver();
        await expect(saver.save('tmp/uploads/tempfile.png', this.option.id))
          .to.eventually.be.rejected.and.include({ message: 'whatever error' });
      });
    });
  });
});
