const db = require('../../services/db');
const Question = require('./Question');

const Option = db.define('options', {
  value: {
    type: db.Sequelize.TEXT,
    allowNull: false
  }
});

/**
 * Promises to ensure that `deltas` are eager loaded on this
 * instance.
 * @returns {Promise}
 */
Option.prototype.ensureDelta = function () {
  return new Promise((resolve, reject) => {
    if (this.delta) return resolve(this);

    return this.getDelta()
      .then(delta => {
        this.delta = delta;
        return resolve(this);
      })
      .catch(reject);
  });
};

Option.prototype.toJSON = function () {
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

Option.belongsTo(Question);
Question.hasMany(Option);

Option.belongsTo(Option, {
  as: 'originalOption',
  foreignKey: 'originalId'
});

module.exports = Option;
