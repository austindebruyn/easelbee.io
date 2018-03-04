const PriceCalculator = require('./PriceCalculator');
const Question = require('./Question');
const Answer = require('./Answer');
const QuestionOption = require('./QuestionOption');
const QuestionPriceAdjustment = require('./QuestionPriceAdjustment');
const AnswerOptionValue = require('../forms/AnswerOptionValue');
const AnswerTextValue = require('../forms/AnswerTextValue');
const factory = require('../../tests/factory');
const { expect } = require('chai');

describe('PriceCalculator', function () {
  beforeEach(async function () {
    this.form = await factory.create('form');
    this.commission = await factory.create('commission', {
      formId: this.form.id
    });
    this.calculator = new PriceCalculator(this.commission);
  });

  describe('with no questions or answers', function () {
    it('should be 0$', async function () {
      expect(await this.calculator.calculate()).to.eql(0);
    });
  });

  describe('with one BASE question', function () {
    beforeEach(async function () {
      this.builder = new FormWithPriceAdjustmentsBuilder({
        formId: this.form.id,
        commissionId: this.commission.id
      });
      await this.builder.setUpForm([
        { type: 'base', amounts: [null, 20, 40] }
      ]);
    });

    it('should total 0$ for the first option', async function () {
      await this.builder.answerQuestion(1, null);
      expect(await this.calculator.calculate()).to.eql(0);
    });

    it('should total 20$ for the second option', async function () {
      await this.builder.answerQuestion(1, 20);
      expect(await this.calculator.calculate()).to.eql(20);
    });

    it('should total 40$ for the third option', async function () {
      await this.builder.answerQuestion(1, 40);
      expect(await this.calculator.calculate()).to.eql(40);
    });
  });

  describe('with one ADD question', function () {
    beforeEach(async function () {
      this.builder = new FormWithPriceAdjustmentsBuilder({
        formId: this.form.id,
        commissionId: this.commission.id
      });
      await this.builder.setUpForm([
        { type: 'add', amounts: [null, 5] }
      ]);
    });

    it('should total 0$ for the first option', async function () {
      await this.builder.answerQuestion(1, null);
      expect(await this.calculator.calculate()).to.eql(0);
    });

    it('should total 5$ for the second option', async function () {
      await this.builder.answerQuestion(1, 5);
      expect(await this.calculator.calculate()).to.eql(5);
    });
  });

  describe('with one normal, one BASE, and one ADD question', function () {
    beforeEach(async function () {
      this.builder = new FormWithPriceAdjustmentsBuilder({
        formId: this.form.id,
        commissionId: this.commission.id
      });
      await this.builder.setUpForm([
        { c: 'this is a non price-adjusting question' },
        { type: 'base', amounts: [null, 20] },
        { type: 'add', amounts: [10, 5, null] }
      ]);
    });

    [
      [null, 10, 10],
      [null, 5, 5],
      [null, null, 0],
      [20, 10, 30],
      [20, 5, 25],
      [20, null, 20]
    ].forEach(function (values) {
      const base = values[0];
      const add = values[1];
      const total = values[2];
      it(`should total $${total || 0} for the $${base || 0} base and adding $${add || 0}`, async function () {
        await this.builder.answerQuestion(1);
        await this.builder.answerQuestion(2, base);
        await this.builder.answerQuestion(3, add);
        expect(await this.calculator.calculate()).to.eql(total || 0);
      });
    });
  });
});

/**
 * For purposes of quickly automating test cases for PriceCalculator, an
 * instance of this class can spin up forms via a spec that defines the
 * questions tailored to have specific price adjustment options...
 *    ie. (build form with one question that set base price to $10 or 20$)
 * This class is also able to automate answering that question for a specific
 * commission...
 *   ie. (answer the first question in that form with the 20$ option)
 *
 * NOTE: This builder can't build questions with mixed QuestionPriceAdjustment
 * types, ie. a radio question with answers that can both set the BASE price OR
 * incur an ADD price. This isn't a feature so no point in testing.
 */
class FormWithPriceAdjustmentsBuilder {
  /**
   * @api
   * @param {Object} opts
   */
  constructor(opts = {}) {
    Object.assign(this, opts);
  }

  /**
   * Helper to build a a form with specific questions - tailored to have the price
   * adjustment properties described by `descs`.
   * @param {Array} questions
   */
  async setUpForm(descs) {
    if (!this.formId) throw new Error('missing formId');

    for (let i = 0; i < descs.length; i++) {
      const desc = descs[i];
      const isPriceAdjustingQuestion = ['base', 'add'].includes(desc.type);

      const question = await factory.create('question', {
        formId: this.formId,
        type: Question.TYPES[isPriceAdjustingQuestion ? 'radio' : 'string'],
        order: i + 1
      });

      if (isPriceAdjustingQuestion) {
        for (let j = 0; j < desc.amounts.length; j++) {
          const amount = desc.amounts[j];

          const questionOption = await factory.create('questionOption', {
            questionId: question.id
          });

          if (amount) {
            await factory.create('questionPriceAdjustment', {
              questionOptionId: questionOption.id,
              amount,
              type: QuestionPriceAdjustment.TYPES[desc.type]
            });
          }
        }
      }
    }
  }

  /**
   * Helper to answer the question indicated by formId and order with the answer
   * that cooresponds to the expected amount in terms of QuestionPriceAdjustment.
   * @param {Number} index
   * @param {Number?} amount
   */
  async answerQuestion(order, amount) {
    if (!this.formId) throw new Error('missing formId');
    if (!this.commissionId) throw new Error('missing commissionId');

    const question = await Question.findOne({
      where: { formId: this.formId, order },
      include: [{
        model: QuestionOption,
        required: false,
        include: [{ model: QuestionPriceAdjustment, required: false }]
      }]
    });
    if (!question) {
      throw new Error(`no such question with formId: ${this.formId} and order ${order}`);
    }

    const answer = await Answer.create({
      commissionId: this.commissionId,
      questionId: question.id
    });

    if (question.type !== Question.TYPES.radio) {
      await AnswerTextValue.create({
        answerId: answer.id,
        value: 'Some dummy answer'
      });
      return;
    }

    let questionOption;
    for (let i = 0; i < question.questionOptions.length; i++) {
      const record = question.questionOptions[i];
      if (record.questionPriceAdjustment) {
        if (record.questionPriceAdjustment.amount === amount) {
          questionOption = record;
        }
      } else if (amount === null) {
        questionOption = record;
      }
    }
    if (!questionOption) {
      throw new Error(`question with order ${order} has no answer with amount ${amount}`);
    }
    await AnswerOptionValue.create({
      answerId: answer.id,
      questionOptionId: questionOption.id
    });
  }
}
