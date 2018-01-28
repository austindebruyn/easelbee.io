const clock = require('../../tests/clock');
const factory = require('../../tests/factory');
const expect = require('chai').expect;
const QuestionUpdater = require('./QuestionUpdater');
const Question = require('./Question');
const QuestionOption = require('./QuestionOption');

describe('questionsController', function () {
  clock();

  beforeEach(async function () {
    this.form = await factory.create('form');
    this.question = await factory.create('question', {
      type: Question.TYPES.radio,
      formId: this.form.id,
      title: 'What is your favorite movie?'
    });
    await factory.create('questionOption', {
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
            { value: 'James Bond' },
            { value: 'Star Wars' }
          ]
        });

        await result.ensureQuestionOptions();
        expect(result.questionOptions).to.have.length(2);
        expect(result.questionOptions.map(q => q.value)).to.eql([
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

        await result.ensureQuestionOptions();
        expect(result.questionOptions).to.have.length(2);
        expect(result.questionOptions.map(q => q.value)).to.eql([
          'Star Wars', 'Not James Bond'
        ]);
      });

      it('should remove all options when changing to non-radio type', async function () {
        const updater = new QuestionUpdater(this.question);

        const result = await updater.update({ type: 'string' });

        await result.ensureQuestionOptions();
        expect(result.questionOptions).to.have.length(0);
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
        expect(result.questionOptions).to.have.length(0);

        // Original question should be intact with all question options.
        const originalQuestion = await Question.findOne({
          where: { id: this.answer.questionId },
          include: [QuestionOption]
        });
        await expect(originalQuestion).to.deep.include({
          deletedAt: new Date('2017-08-31T00:00:00.001Z'),
          title: 'What is your favorite movie?'
        });
        expect(originalQuestion.questionOptions).to.have.length(1);
        expect(originalQuestion.questionOptions[0]).to.include({
          value: 'James Bond'
        });
      });
    });
  });
});
