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

/**
 * Promises to ensure that `attachment` is eager loaded on this
 * instance.
 * @returns {Promise}
 */
Option.prototype.ensureOptionAttachment = function () {
  return new Promise((resolve, reject) => {
    if (this.optionAttachment) return resolve(this);

    return this.getOptionAttachment()
      .then(optionAttachment => {
        this.optionAttachment = optionAttachment;
        return resolve(this);
      })
      .catch(reject);
  });
};

Option.prototype.toJSON = async function () {
  const {
    id,
    questionId,
    value,
    createdAt,
    updatedAt
  } = this.get();

  await this.ensureDelta();
  await this.ensureOptionAttachment();

  return {
    id,
    questionId,
    value,
    createdAt: createdAt && createdAt.toUTCString(),
    updatedAt: updatedAt && updatedAt.toUTCString(),
    delta: this.delta ? await this.delta.toJSON() : null,
    optionAttachment: this.optionAttachment ? await this.optionAttachment.toJSON() : null
  };
};

Option.belongsTo(Question);
Question.hasMany(Option);

Option.belongsTo(Option, {
  as: 'originalOption',
  foreignKey: 'originalId'
});

module.exports = Option;
