class QuestionUpdater {
  /**
   * @param {Question} question 
   */
  constructor(question) {
    this.question = question;
  }

  /**
   * Promises to update the question with the new parameters provided.
   * @param {Object} body
   * @returns {Promise}
   */
  update(body) {
    Object.assign(this.question, body);
    return this.question.save();
  }
}

module.exports = QuestionUpdater;
