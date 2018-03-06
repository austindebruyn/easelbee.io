const db = require('../../services/db');
const Answer = require('./Answer');
const Option = require('./Option');

const AnswerOptionValue = db.define('answerOptionValues', {
  optionId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'options',
      key: 'id'
    }
  }
}, {
  tableName: 'answer_option_values',
  freezeTableName: true
});

AnswerOptionValue.prototype.toJSON = function () {
  return new Promise(resolve => {
    const {
      id,
      answerId,
      optionId,
      createdAt,
      updatedAt
    } = this.get();

    return resolve({
      id,
      answerId,
      optionId,
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString()
    });
  });
};

AnswerOptionValue.belongsTo(Answer);
Answer.hasMany(AnswerOptionValue);

AnswerOptionValue.belongsTo(Option);
Option.hasMany(AnswerOptionValue);

module.exports = AnswerOptionValue;
