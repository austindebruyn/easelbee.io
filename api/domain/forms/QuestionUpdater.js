const _ = require('lodash');
const Question = require('./Question');
const Option = require('./Option');
const Delta = require('./Delta');
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
   * Duplicates the original question and all Options.
   * @private
   * @param {Object} extraProperties
   */
  async performDuplicate(extraProperties) {
    this.question.deletedAt = new Date();
    await this.question.save();
    await this.question.ensureOptions();

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

    // Duplicate options
    this.question.options = [];
    const originalOptions = this.originalQuestion.options;
    for (let i = 0; i < originalOptions.length; i++) {
      const originalOption = originalOptions[i];
      const newOption = await Option.create({
        questionId: this.question.id,
        originalId: originalOption.id,
        ..._.pick(originalOption, 'value')
      });

      // Duplicate deltas
      await originalOption.ensureDelta();
      if (originalOption.delta) {
        newOption.delta = await Delta.create({
          optionId: newOption.id,
          ..._.pick(originalOption.delta, 'type', 'amount')
        });
      }
      this.question.options.push(newOption);
    }
  }

  /**
   * @typedef Option
   * @property {String} value
   */
  /**
   * @private
   * @param {Option[]} options 
   */
  async createMissingOptions(options) {
    await this.question.ensureOptions();
    const values = this.question.options.map(o => o.value);

    for (let i = 0; i < options.length; i++) {
      const option = options[i];

      if (!values.includes(option.value)) {
        const newOption = await this.question.createOption({
          value: option.value
        });
        this.question.options.push(newOption);
      }
    }
  }

  /**
   * @private
   * @param {Option[]} expectedOptions
   */
  async destroyExtraOptions(expectedOptions = []) {
    await this.question.ensureOptions();
    const expectedValues = expectedOptions.map(o => o.value);

    for (let i = 0; i < this.question.options.length; i++) {
      const option = this.question.options[i];
      if (!expectedValues.includes(option.value)) {
        await option.destroy();
        _.pull(this.question.options, option);
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
   * Sets the delta.
   * @param {Number} id question option id
   * @param {String} type
   * @param {Number} amount
   */
  async setDelta(id, type, amount) {
    const needsDuplicate = await this.needsDuplicate();
    if (needsDuplicate) {
      await this.performDuplicate({});
    }
    await this.question.ensureOptions();

    // Select the question option by the _original_ id if we just duplicated
    // the models.
    const option = _.find(this.question.options, {
      [needsDuplicate ? 'originalId' : 'id']: id
    });
    await option.ensureDelta();

    const delta = option.delta
      ? option.delta
      : Delta.build({ optionId: option.id });

    Object.assign(delta, { type, amount });
    await delta.save();

    return delta;
  }
}

module.exports = QuestionUpdater;
