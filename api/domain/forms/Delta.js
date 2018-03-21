const db = require('../../services/db');
const Option = require('./Option');
const invert = require('lodash.invert');

const Delta = db.define('deltas', {
  amount: {
    type: db.Sequelize.FLOAT,
    allowNull: false
  },
  type: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    default: 0
  }
});

Delta.TYPES = {
  base: 0,
  add: 1
};

/**
 * Promises to serialize this Delta instance as a JSON.
 * @returns {Promise}
 */
Delta.prototype.toJSON = function () {
  return new Promise((resolve, reject) => {
    const {
      id,
      createdAt,
      updatedAt,
      amount,
      type,
      optionId
    } = this.get();

    return resolve({
      id,
      optionId,
      amount,
      type: invert(Delta.TYPES)[type],
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString()
    });
  });
};

Delta.belongsTo(Option);
Option.hasOne(Delta);

module.exports = Delta;
