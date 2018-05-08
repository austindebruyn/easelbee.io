const _ = require('lodash');
const OptionAttachment = require('../attachments/OptionAttachment');
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
      ..._.pick(
        this.originalQuestion,
        'title',
        'type',
        'order',
        'formId',
        'required'
      ),
      ..._.omit(
        extraProperties,
        'options'
      )
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
      const optionParams = _.find(extraProperties.options, { id: originalOption.id });
      if (optionParams) {
        optionParams.id = newOption.id;
      }

      // Duplicate deltas
      await originalOption.ensureDelta();
      if (originalOption.delta) {
        newOption.delta = await Delta.create({
          optionId: newOption.id,
          ..._.pick(originalOption.delta, 'type', 'amount')
        });
      }

      // Duplicate attachments
      await originalOption.ensureOptionAttachment();
      if (originalOption.optionAttachment) {
        newOption.optionAttachment = await OptionAttachment.create({
          optionId: newOption.id,
          originalId: originalOption.optionAttachment.id,
          ..._.pick(originalOption.optionAttachment, 'engine', 'objectKey')
        });
      }

      this.question.options.push(newOption);
    }
  }

  /**
   * @typedef OptionParams
   * @property {String} value
   */
  /**
   * @private
   * @param {OptionParams[]} options 
   */
  async createMissingOptions(options) {
    await this.question.ensureOptions();
    const ids = _.map(this.question.options, 'id');

    for (let i = 0; i < options.length; i++) {
      const option = options[i];

      if (!option.id || !ids.includes(option.id)) {
        const newOption = await this.question.createOption({
          value: option.value
        });
        this.question.options.push(newOption);
        option.id = newOption.id;
      }
    }
  }

  /**
   * @private
   * @param {OptionParams[]} options 
   */
  async updateExistingOptions(options) {
    await this.question.ensureOptions();

    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const existingOption = _.find(this.question.options, { id: option.id });

      if (existingOption) {
        existingOption.value = option.value;
        await existingOption.save();
      }
    }
  }

  /**
   * @private
   * @param {OptionParams[]} expectedOptions
   */
  async destroyExtraOptions(expectedOptions = []) {
    await this.question.ensureOptions();
    const expectedIds = expectedOptions.map(o => o.id).filter(Boolean);

    for (let i = 0; i < this.question.options.length; i++) {
      const option = this.question.options[i];

      if (!expectedIds.includes(option.id)) {
        // Clear any attachments first. Deltas are cascade-delete.
        const attachment = await option.getOptionAttachment();
        if (attachment) {
          attachment.optionId = null;
          await attachment.save();
        }

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
    const needsDuplicate = await this.needsDuplicate();
    if (needsDuplicate) {
      await this.performDuplicate(body);
    } else {
      Object.assign(this.question, _.omit(body, 'options'));
      await this.question.save();
    }
    const expectedOptions = body.options;

    if (this.question.isMultipleChoice()) {
      if (!expectedOptions || !Array.isArray(expectedOptions)) {
        throw new UnprocessableEntityError('options-not-array');
      }

      await this.createMissingOptions(expectedOptions);
      if (!needsDuplicate) {
        await this.updateExistingOptions(expectedOptions);
      }
    }
    // We should destroy missing options even for non-multiple-choice questions
    // because a Question that has changed type from `radio` to `string` should
    // have all options removed.
    await this.destroyExtraOptions(expectedOptions);

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

    Object.assign(delta, { type: Delta.TYPES[type], amount });
    await delta.save();

    return delta;
  }

  /**
   * Destroys the delta.
   * @param {Number} id question option id
   */
  async destroyDelta(id) {
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
    await option.delta.destroy();
  }
}

module.exports = QuestionUpdater;
