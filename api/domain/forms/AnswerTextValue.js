const db = require('../../services/db');
const Answer = require('./Answer');

const AnswerTextValue = db.define('answerTextValues', {
  value: {
    type: db.Sequelize.TEXT
  }
}, {
  tableName: 'answer_text_values',
  freezeTableName: true
});

AnswerTextValue.prototype.toJSON = function () {
  return new Promise(resolve => {
    const {
      id,
      answerId,
      createdAt,
      updatedAt
    } = this.get();

    return resolve({
      id,
      answerId,
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString()
    });
  });
};

AnswerTextValue.belongsTo(Answer);
Answer.hasMany(AnswerTextValue);

module.exports = AnswerTextValue;
