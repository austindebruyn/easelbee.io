const db = require('../../services/db');
const Question = require('./Question');

const QuestionOption = db.define('questionOptions', {
  value: {
    type: db.Sequelize.TEXT,
    allowNull: false
  }
}, {
  tableName: 'question_options',
  freezeTableName: true
});

QuestionOption.prototype.toJSON = function () {
  return new Promise(resolve => {
    const {
      id,
      questionId,
      value,
      createdAt,
      updatedAt
    } = this.get();

    return resolve({
      id,
      questionId,
      value,
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString()
    });
  });
};

QuestionOption.belongsTo(Question);
Question.hasMany(QuestionOption);

module.exports = QuestionOption;
