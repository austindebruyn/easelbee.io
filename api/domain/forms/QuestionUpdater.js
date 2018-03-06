const _ = require('lodash');
const Question = require('./Question');
const QuestionOption = require('./QuestionOption');
const QuestionPriceAdjustment = require('./QuestionPriceAdjustment');
const Answer = require('./Answer');
const {
  UnprocessableEntityError
} = require('../../core/errors');

/**
 * The QuestionUpdater class takes an object of parameters and updates the
 * model. The original Question model must be left intact if there are any
 * Answers tied to it, so clone and write new properties out, including multiple
 * choice question options.
 */
class QuestionUpdater {
  /**
   * @param {Question} question 
   */
  constructor(question) {
    this.question = question;
  }

  /**
   * Returns whether or not any answers exist on the original question.
   * @returns {Boolean}
   * @private
   */
  async needsDuplicate() {
    return await Answer.count({ where: { questionId: this.question.id } }) > 0;
  }

  /**
   * Duplicates the original question and all QuestionOptions.
   * @private
   * @param {Object} extraProperties
   */
  async performDuplicate(extraProperties) {
    this.question.deletedAt = new Date();
    await this.question.save();
    await this.question.ensureQuestionOptions();

    this.originalQuestion = this.question;
    this.question = await Question.create({
      originalQuestionId: this.originalQuestion.id,
      ..._.pick(this.originalQuestion,
        'title',
        'type',
        'order',
        'formId',
        'required'
      ),
      ...extraProperties
    });

    // Duplicate questionOptions
    this.question.questionOptions = [];
    const originalQuestionOptions = this.originalQuestion.questionOptions;
    for (let i = 0; i < originalQuestionOptions.length; i++) {
      const originalOption = originalQuestionOptions[i];
      const newOption = await QuestionOption.create({
        questionId: this.question.id,
        originalQuestionOptionId: originalOption.id,
        ..._.pick(originalOption, 'value')
      });

      // Duplicate price adjustments
      await originalOption.ensureQuestionPriceAdjustment();
      if (originalOption.questionPriceAdjustment) {
        newOption.questionPriceAdjustment = await QuestionPriceAdjustment.create({
          questionOptionId: newOption.id,
          ..._.pick(originalOption.questionPriceAdjustment, 'type', 'amount')
        });
      }
      this.question.questionOptions.push(newOption);
    }
  }

  /**
   * @typedef QuestionOption
   * @property {String} value
   */
  /**
   * @private
   * @param {QuestionOption[]} options 
   */
  async createMissingOptions(options) {
    await this.question.ensureQuestionOptions();
    const values = this.question.questionOptions.map(o => o.value);

    for (let i = 0; i < options.length; i++) {
      const option = options[i];

      if (!values.includes(option.value)) {
        const newQuestionOption = await this.question.createQuestionOption({
          value: option.value
        });
        this.question.questionOptions.push(newQuestionOption);
      }
    }
  }

  /**
   * @private
   * @param {QuestionOption[]} options
   */
  async destroyExtraOptions(options = []) {
    await this.question.ensureQuestionOptions();
    const { questionOptions } = this.question;
    const expectedValues = options.map(o => o.value);

    for (let i = 0; i < questionOptions.length; i++) {
      const questionOption = questionOptions[i];
      if (!expectedValues.includes(questionOption.value)) {
        await questionOption.destroy();
        _.pull(this.question.questionOptions, questionOption);
      }
    }
  }

  /**
   * Promises to update the question with the new parameters provided. Resolves
   * with the new model.
   * @param {Object} body
   * @returns {Promise}
   */
  async update(body) {
    if (await this.needsDuplicate()) {
      await this.performDuplicate(body);
    } else {
      Object.assign(this.question, body);
      await this.question.save();
    }

    if (this.question.isMultipleChoice()) {
      if (!body.options || !Array.isArray(body.options)) {
        throw new UnprocessableEntityError('options-not-array');
      }

      await this.createMissingOptions(body.options);
    }
    // We should destroy missing options even for non-multiple-choice questions
    // because a Question that has changed type from `radio` to `string` should
    // have all options removed.
    await this.destroyExtraOptions(body.options);

    return this.question;
  }

  /**
   * Sets the price adjustment.
   * @param {Number} id question option id
   * @param {String} type
   * @param {Number} amount
   */
  async setPriceAdjustment(id, type, amount) {
    const needsDuplicate = await this.needsDuplicate();
    if (needsDuplicate) {
      await this.performDuplicate({});
    }
    await this.question.ensureQuestionOptions();

    // Select the question option by the _original_ id if we just duplicated
    // the models.
    const questionOption = _.find(this.question.questionOptions, {
      [needsDuplicate ? 'originalQuestionOptionId' : 'id']: id
    });
    await questionOption.ensureQuestionPriceAdjustment();

    const questionPriceAdjustment = questionOption.questionPriceAdjustment
      ? questionOption.questionPriceAdjustment
      : QuestionPriceAdjustment.build({ questionOptionId: questionOption.id });

    Object.assign(questionPriceAdjustment, { type, amount });
    await questionPriceAdjustment.save();

    return questionPriceAdjustment;
  }
}

module.exports = QuestionUpdater;
