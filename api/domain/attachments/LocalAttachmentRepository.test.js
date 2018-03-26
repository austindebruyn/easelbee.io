const LocalAttachmentRepository = require('./LocalAttachmentRepository');
const { expect } = require('chai');
const factory = require('../../tests/factory');
const clock = require('../../tests/clock');
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');

describe('LocalAttachmentRepository', function () {
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
        const repo = new LocalAttachmentRepository();
        await repo.save('tmp/uploads/tempfile.png', this.option.id);

        expect(fs.rename).to.have.been.calledWith(
          `${__dirname}/tmp/uploads/tempfile.png`,
          sinon.match.string
        );
        expect(path.dirname(fs.rename.args[0][1]))
          .to.eql(`${__dirname}/public/uploads`);
      });

      it('should create model', async function () {
        const repo = new LocalAttachmentRepository();
        const model = await repo.save('tmp/uploads/tempfile.png', this.option.id);

        expect(model).to.include({
          objectKey: (+new Date()).toString(),
          engine: 'local'
        });
        expect(model.id).to.be.a('number');
      });
    });

    describe('when file move fails', function () {
      beforeEach(async function () {
        this.sandbox.stub(fs, 'rename').yields(new Error('whatever error'));
      });

      it('should return error', async function () {
        const repo = new LocalAttachmentRepository();
        await expect(repo.save('tmp/uploads/tempfile.png', this.option.id))
          .to.eventually.be.rejected.and.include({ message: 'whatever error' });
      });
    });
  });

  describe('#getPublicURL', function () {
    beforeEach(async function () {
      this.attachment = await factory.create('optionAttachment', {
        objectKey: 'whatever.png'
      });
    });

    it('should build url', function () {
      const repo = new LocalAttachmentRepository();
      const actual = repo.getPublicURL(this.attachment);
      expect(actual).to.eql('/uploads/whatever.png');
    });
  });
});
