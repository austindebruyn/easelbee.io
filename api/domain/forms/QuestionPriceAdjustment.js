const db = require('../../services/db');
const QuestionOption = require('./QuestionOption');
const invert = require('lodash.invert');

const QuestionPriceAdjustment = db.define('questionPriceAdjustments', {
  amount: {
    type: db.Sequelize.FLOAT,
    allowNull: false
  },
  type: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    default: 0
  }
}, {
  tableName: 'question_price_adjustments',
  freezeTableName: true,
  name: {
    singular: 'questionPriceAdjustment'
  }
});

QuestionPriceAdjustment.TYPES = {
  base: 0,
  add: 1
};

/**
 * Promises to serialize this QuestionPriceAdjustment instance as a JSON.
 * @returns {Promise}
 */
QuestionPriceAdjustment.prototype.toJSON = function () {
  return new Promise((resolve, reject) => {
    const {
      id,
      createdAt,
      updatedAt,
      amount,
      type,
      questionOptionId
    } = this.get();

    return resolve({
      id,
      questionOptionId,
      amount,
      type: invert(QuestionPriceAdjustment.TYPES)[type],
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString()
    });
  });
};

QuestionPriceAdjustment.belongsTo(QuestionOption, { as: 'questionPriceAdjustment' });
QuestionOption.hasOne(QuestionPriceAdjustment);

module.exports = QuestionPriceAdjustment;
