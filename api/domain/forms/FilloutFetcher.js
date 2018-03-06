const _ = require('lodash');
const Question = require('./Question');
const Option = require('./Option');

/**
 * Fetches all the questions and answers that were filled out for one
 * commission. The questions, options, and their orders may not match up with
 * the exact version of the form now.
 */
class FilloutFetcher {
  constructor(commission) {
    this.commission = commission;
  }

  /**
   * Promises to eager load all answers on the provided commission.
   * @returns {Promise}
   */
  ensureQuestions() {
    const ids = _.map(this.commission.answers, 'questionId');
    return Question.findAll({
      where: { id: ids },
      include: [Option]
    })
      .then(questions => {
        this._questions = questions;
      });
  }

  /**
   * @typedef QuestionAnswerPair
   * @property {Object} question
   * @property {?} value
   */
  /**
   * @typedef Fillout
   * @property {Object} commission
   * @property {Array<QuestionAnswerPair>} pairs
   */
  /**
   * Constructs the JSON after all models have been preloaded.
   * @returns {Fillout}
   * @private
   */
  build() {
    const output = {};

    return this.commission.toJSON()
      .then(json => {
        Object.assign(output, { commission: json });
        return Promise.all(this._questions.map(q => q.toJSON()));
      })
      .then(questions => {
        return Promise.all(this.commission.answers.map(function (answer) {
          return answer.getValue()
            .then(function (value) {
              return {
                question: _.find(questions, { id: answer.questionId }),
                value
              };
            });
        }));
      })
      .then(function (pairs) {
        output.pairs = pairs;
        return output;
      });
  }

  /**
   * Returns a list of all answers and the corresponding question.
   * @returns {Object}
   */
  toJSON() {
    return new Promise((resolve, reject) => {
      return this.commission.ensureForm()
        .then(() => this.commission.ensureAnswers())
        .then(() => this.ensureQuestions())
        .then(() => this.build())
        .then(resolve)
        .catch(reject);
    });
  }
}

module.exports = FilloutFetcher;
