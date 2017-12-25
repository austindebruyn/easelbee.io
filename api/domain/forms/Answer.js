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
