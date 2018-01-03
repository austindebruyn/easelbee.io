const db = require('../../services/db');
const Question = require('./Question');
const Commission = require('../commissions/Commission');

/**
 * This model could be called CommisionAnswer.
 */
const Answer = db.define('answers', {
  /* */
}, {
  tableName: 'answers',
  freezeTableName: true,
  name: {
    singular: 'answer'
  }
});

/**
 * Promises to ensure that `question` is eager loaded on this instance.
 * @returns {Promise}
 */
Answer.prototype.ensureQuestion = function () {
  return new Promise((resolve, reject) => {
    if (this.question) return resolve(this);

    return this.getQuestion()
      .then(question => {
        this.question = question;
        return resolve(this);
      })
      .catch(reject);
  });
};

/**
 * A set of strategies for discovering scalar values from associated models
 * based on the question type. Dispatched from `getValue` below.
 */
const GET_VALUE_HANDLERS = {
  [Question.TYPES.string]: function () {
    return this.getAnswerTextValues()
      .then(answerTextValues => {
        if (answerTextValues.length !== 1) {
          throw new Error(
            `Expected 1 AnswerTextValue for <Answer #${this.id}>, found ` +
            `${answerTextValues.length} instead.`
          );
        }
        return answerTextValues[0].value;
      });
  }
};

/**
 * Promises to return the value of this answer model by querying related
 * `AnswerTextValue` and `AnswerOptionValue` models.
 * @returns {Promise}
 */
Answer.prototype.getValue = function () {
  return new Promise((resolve, reject) => {
    if (this._value) return resolve(this._value);

    return this.ensureQuestion()
      .then(() => {
        const handler = GET_VALUE_HANDLERS[this.question.type];
        if (!handler) {
          throw new Error(
            `Answer model cannot discover value for type ${this.question.type}`
          );
        }
        return handler.call(this);
      })
      .then(value => {
        // The handler pulled from GET_VALUE_HANDLERS above returns a scalar,
        // not an associated model.
        this._value = value;
        return resolve(value);
      })
      .catch(reject);
  });
};

Answer.prototype.toJSON = function () {
  return new Promise(resolve => {
    const {
      id,
      questionId,
      commissionId,
      createdAt,
      updatedAt
    } = this.get();

    return resolve({
      id,
      questionId,
      commissionId,
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString()
    });
  });
};

Answer.belongsTo(Question);
Question.hasMany(Answer);

Answer.belongsTo(Commission);
Commission.hasMany(Answer);

module.exports = Answer;
