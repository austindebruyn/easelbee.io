const { invert } = require('lodash');
const db = require('../../services/db');
const Option = require('../forms/Option');

const OptionAttachment = db.define('optionAttachments', {
  objectKey: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  engine: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'option_attachments'
});

OptionAttachment.TYPES = {
  local: 0,
  s3: 1
};

/**
 * Returns the engine as string enum key.
 * @returns {String}
 */
OptionAttachment.prototype.getEngine = function () {
  return invert(OptionAttachment.TYPES)[this.engine];
};

/**
 * Promises to serialize this OptionAttachment instance as a JSON.
 * @returns {Promise}
 */
OptionAttachment.prototype.toJSON = function () {
  return new Promise((resolve, reject) => {
    const {
      id,
      createdAt,
      updatedAt,
      objectKey,
      optionId
    } = this.get();

    return resolve({
      id,
      optionId,
      objectKey,
      engine: this.getEngine(),
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString()
    });
  });
};

OptionAttachment.belongsTo(Option);
Option.hasOne(OptionAttachment);

module.exports = OptionAttachment;
