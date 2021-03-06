const clock = require('../../tests/clock');
const factory = require('../../tests/factory');
const expect = require('chai').expect;
const QuestionUpdater = require('./QuestionUpdater');
const Question = require('./Question');
const Delta = require('./Delta');
const OptionAttachment = require('../attachments/OptionAttachment');
const Option = require('./Option');

describe('QuestionUpdater', function () {
  clock();

  beforeEach(async function () {
    this.form = await factory.create('form');
    this.question = await factory.create('question', {
      type: Question.TYPES.radio,
      formId: this.form.id,
      title: 'What is your favorite movie?'
    });
    this.option = await factory.create('option', {
      questionId: this.question.id,
      value: 'James Bond'
    });
  });

  describe('#update', function () {
    it('should update title', async function () {
      const updater = new QuestionUpdater(this.question);

      const result = await updater.update({
        title: 'Having a good time',
        options: []
      });
      expect(result.title).to.eql('Having a good time');
    });

    it('should update type', async function () {
      const updater = new QuestionUpdater(this.question);

      const result = await updater.update({
        type: Question.TYPES.string,
        options: []
      });
      expect(result.type).to.eql(Question.TYPES.string);
    });

    it('should keep the same id', async function () {
      const updater = new QuestionUpdater(this.question);

      const result = await updater.update({
        title: 'Having a good time',
        options: []
      });
      expect(result.id).to.eql(this.question.id);
    });

    describe('multiple choice question', function () {
      it('should error if options missing', function () {
        const updater = new QuestionUpdater(this.question);
        return expect(updater.update({ type: Question.TYPES.radio }))
          .to.eventually.be.rejected.and.include({ code: 'options-not-array' });
      });

      it('should error if options not an array', function () {
        return expect(new QuestionUpdater(this.question).update({
          type: Question.TYPES.radio,
          options: 'hahahaha'
        }))
          .to.eventually.be.rejected.and.include({ code: 'options-not-array' });
      });

      it('should build new options that are missing', async function () {
        const updater = new QuestionUpdater(this.question);

        const result = await updater.update({
          options: [
            { id: this.option.id, value: 'James Bond' },
            { value: 'Star Wars' }
          ]
        });
        expect(result.options[0]).to.be.an.instanceof(Option);
        expect(result.options[1]).to.be.an.instanceof(Option);

        await result.ensureOptions();
        expect(result.options).to.have.length(2);
        expect(result.options.map(q => q.value)).to.eql([
          'James Bond', 'Star Wars'
        ]);
      });

      it('should remove options that shouldnt exist anymore', async function () {
        const updater = new QuestionUpdater(this.question);

        const result = await updater.update({
          options: [
            { value: 'Star Wars' },
            { value: 'Not James Bond' }
          ]
        });

        await result.ensureOptions();
        expect(result.options).to.have.length(2);
        expect(result.options.map(q => q.value)).to.eql([
          'Star Wars', 'Not James Bond'
        ]);

        const optionExists = await Option.count({ where: { id: this.option.id } });
        expect(optionExists).to.eql(0);
      });

      it('should update options in place', async function () {
        const updater = new QuestionUpdater(this.question);

        const result = await updater.update({
          options: [
            { id: this.option.id, value: 'Jemes Bondy' }
          ]
        });

        await result.ensureOptions();
        expect(result.options).to.have.length(1);
        expect(result.options.map(q => q.value)).to.eql(['Jemes Bondy']);

        await this.option.reload();
        expect(this.option.value).to.eql('Jemes Bondy');
      });

      it('should remove all options when changing to non-radio type', async function () {
        const updater = new QuestionUpdater(this.question);

        const result = await updater.update({ type: 'string' });

        await result.ensureOptions();
        expect(result.options).to.have.length(0);
      });

      describe('when options have deltas', function () {
        beforeEach(async function () {
          await this.question.ensureOptions();
          this.delta = await this.question.options[0].createDelta({
            type: Delta.TYPES.base,
            amount: 5
          });
        });

        it('should remove options that have deltas', async function () {
          const updater = new QuestionUpdater(this.question);

          const result = await updater.update({
            options: []
          });

          await result.ensureOptions();
          expect(result.options).to.have.length(0);
          expect(await Delta.count()).to.eql(0);
        });
      });

      describe('when options have attachments', function () {
        beforeEach(async function () {
          await this.question.ensureOptions();
          const firstOption = this.question.options[0];

          this.attachment = await firstOption.createOptionAttachment({
            engine: OptionAttachment.TYPES.local,
            objectKey: 'whatever.png'
          });
        });

        it('should remove options that have attachments', async function () {
          const updater = new QuestionUpdater(this.question);

          const result = await updater.update({
            options: []
          });

          await result.ensureOptions();
          expect(result.options).to.have.length(0);
          await this.attachment.reload();
          expect(this.attachment.optionId).to.eql(null);
        });
      });
    });

    describe('when answers already exist', function () {
      beforeEach(async function () {
        this.commission = await factory.create('commission', {
          formId: this.form.id
        });

        this.answer = await factory.create('answer', {
          questionId: this.question.id,
          commissionId: this.commission.id
        });
      });

      it('should create a new model', async function () {
        const updater = new QuestionUpdater(this.question);

        const result = await updater.update({
          title: 'Having a good time',
          options: []
        });
        // New question should be a clone more or less.
        expect(result.id).to.not.eql(this.question.id);
        expect(result).to.include({
          originalQuestionId: this.question.id,
          formId: this.question.formId
        });
        expect(result.options).to.have.length(0);

        // Original question should be intact with all question options.
        const originalQuestion = await Question.findOne({
          where: { id: this.answer.questionId },
          include: [Option]
        });
        await expect(originalQuestion).to.deep.include({
          deletedAt: new Date('2017-08-31T00:00:00.001Z'),
          title: 'What is your favorite movie?'
        });
        expect(originalQuestion.options).to.have.length(1);
        expect(originalQuestion.options[0]).to.include({
          value: 'James Bond'
        });
      });

      it('should clone Deltas', async function () {
        const question = await factory.create('question', {
          type: Question.TYPES.radio
        });
        const option = await factory.create('option', {
          questionId: question.id,
          value: 'Oil Painting'
        });
        const delta = await factory.create('delta', {
          optionId: option.id,
          type: Delta.TYPES.base,
          amount: 14.44
        });

        await factory.create('answer', {
          questionId: question.id
        });

        const updater = new QuestionUpdater(question);
        const result = await updater.update({
          title: 'Having a good time',
          options: [{ id: option.id, value: 'Oil Painting' }]
        });

        expect(result.id).to.not.eql(this.question.id);
        const newOption = result.options[0];
        expect(newOption.id).to.not.eql(option.id);
        expect(newOption.delta.id).to.not.eql(delta.id);
        expect(newOption.delta).to.include({
          type: Delta.TYPES.base,
          amount: 14.44
        });
      });

      it('should clone OptionAttachments', async function () {
        const question = await factory.create('question', {
          type: Question.TYPES.radio
        });
        const option = await factory.create('option', {
          questionId: question.id,
          value: 'Oil Painting'
        });
        const attachment = await factory.create('optionAttachment', {
          optionId: option.id,
          engine: OptionAttachment.TYPES.local,
          objectKey: 'heyladies.png'
        });

        await factory.create('answer', { questionId: question.id });

        const updater = new QuestionUpdater(question);
        const result = await updater.update({
          title: 'Having a good time',
          options: [{ id: option.id, value: 'Oil Painting' }]
        });

        expect(result.id).to.not.eql(this.question.id);
        const newOption = result.options[0];
        expect(newOption.id).to.not.eql(option.id);
        expect(newOption.originalId).to.eql(option.id);
        expect(newOption.optionAttachment.id).to.not.eql(attachment.id);
        expect(newOption.optionAttachment).to.include({
          engine: OptionAttachment.TYPES.local,
          objectKey: 'heyladies.png'
        });
      });
    });
  });

  describe('#setDelta', function () {
    it('should create Delta', async function () {
      const updater = new QuestionUpdater(this.question);
      const result = await updater.setDelta(
        this.option.id,
        'add',
        15.55
      );
      await this.option.ensureDelta();
      expect(result.id).to.eql(this.option.delta.id);
      expect(result).to.include({
        type: Delta.TYPES.add,
        amount: 15.55
      });
    });

    it('should update Delta', async function () {
      const updater = new QuestionUpdater(this.question);
      const oldDelta = await factory.create(
        'delta',
        {
          optionId: this.option.id,
          type: Delta.TYPES.base,
          amount: 20.0
        }
      );
      const result = await updater.setDelta(
        this.option.id,
        'add',
        15.55
      );
      await this.option.ensureDelta();
      expect(result.id).to.eql(oldDelta.id);
      expect(result).to.include({
        type: Delta.TYPES.add,
        amount: 15.55
      });
    });

    describe('when answer exists', function () {
      beforeEach(async function () {
        await factory.create('answer', {
          questionId: this.question.id
        });
      });

      it('should clone the question first', async function () {
        const updater = new QuestionUpdater(this.question);
        const result = await updater.setDelta(
          this.option.id,
          'add',
          15.55
        );

        expect(result.optionId).to.not.eql(this.option.id);
        expect(result).to.include({
          type: Delta.TYPES.add,
          amount: 15.55
        });
      });
    });
  });
});
