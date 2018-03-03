const PriceCalculator = require('./PriceCalculator');
const Question = require('./Question');
const QuestionPriceAdjustment = require('./QuestionPriceAdjustment');
const factory = require('../../tests/factory');
const { expect } = require('chai');

describe('PriceCalculator', function () {
  beforeEach(async function () {
    this.commission = await factory.create('commission');
    this.calculator = new PriceCalculator(this.commission);
  });

  describe('with no questions or answers', function () {
    it('should be 0$', async function () {
      expect(await this.calculator.calculate()).to.eql(0);
    });
  });

  describe('with one BASE question', function () {
    beforeEach(async function () {
      this.question = await factory.create('question', {
        formId: this.commission.formId,
        type: Question.TYPES.radio
      });
      this.questionOption = await factory.create('questionOption', {
        questionId: this.question.id
      });
      await factory.create('questionPriceAdjustment', {
        questionOptionId: this.questionOption.id,
        amount: 20,
        type: QuestionPriceAdjustment.TYPES.base
      });
      this.answer = await factory.create('answer', {
        commissionId: this.commission.id,
        questionId: this.question.id
      });
    });

    it('should be ok', async function () {
      expect(await this.calculator.calculate()).to.eql(20);
    });
  });
});
