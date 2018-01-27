const _ = require('lodash');
const Question = require('./Question');
const Answer = require('./Answer');

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
   * Duplicates the original question.
   * @private
   */
  async performDuplicate() {
    this.question.deletedAt = new Date();
    await this.question.save();

    this.originalQuestion = this.question;
    this.question = await Question.build({
      originalQuestionId: this.originalQuestion.id,
      ..._.pick(this.originalQuestion, 'title', 'type', 'order')
    });
  }

  /**
   * Promises to update the question with the new parameters provided. Resolves
   * with the new model.
   * @param {Object} body
   * @returns {Promise}
   */
  async update(body) {
    if (await this.needsDuplicate()) {
      await this.performDuplicate();
    }

    Object.assign(this.question, body);
    await this.question.save();
    return this.question;
  }
}

module.exports = QuestionUpdater;
