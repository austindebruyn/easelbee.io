const db = require('../../services/db');
const Answer = require('./Answer');
const QuestionOption = require('./QuestionOption');

const AnswerOptionValue = db.define('answerOptionValues', {
  questionOptionId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'question_options',
      key: 'id'
    }
  }
}, {
  tableName: 'answer_text_values',
  freezeTableName: true
});

AnswerOptionValue.prototype.toJSON = function () {
  return new Promise(resolve => {
    const {
      id,
      answerId,
      questionOptionId,
      createdAt,
      updatedAt
    } = this.get();

    return resolve({
      id,
      answerId,
      questionOptionId,
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString()
    });
  });
};

AnswerOptionValue.belongsTo(Answer);
Answer.hasMany(AnswerOptionValue);

AnswerOptionValue.belongsTo(QuestionOption);
QuestionOption.hasMany(AnswerOptionValue);

module.exports = AnswerOptionValue;
