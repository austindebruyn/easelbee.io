const clock = require('../../tests/clock');
const factory = require('../../tests/factory');
const expect = require('chai').expect;
const QuestionUpdater = require('./QuestionUpdater');
const Question = require('./Question');

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

      const result = await updater.update({ title: 'Having a good time' });
      expect(result.title).to.eql('Having a good time');
    });

    it('should update type', async function () {
      const updater = new QuestionUpdater(this.question);

      const result = await updater.update({ type: Question.TYPES.string });
      expect(result.type).to.eql(Question.TYPES.string);
    });

    it('should keep the same id', async function () {
      const updater = new QuestionUpdater(this.question);

      const result = await updater.update({ title: 'Having a good time' });
      expect(result.id).to.eql(this.question.id);
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

        const result = await updater.update({ title: 'Having a good time' });
        expect(result.id).to.not.eql(this.question.id);
        expect(result.originalQuestionId).to.eql(this.question.id);

        const originalQuestion = Question.findById(this.answer.questionId);
        await expect(originalQuestion).to.eventually.deep.include({
          deletedAt: new Date('2017-08-31T00:00:00.001Z'),
          title: 'What is your favorite movie?'
        });
      });
    });
  });
});
