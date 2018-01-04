const db = require('../../services/db');
const User = require('../users/User');
const Form = require('../forms/Form');
const invert = require('lodash.invert');

const Commission = db.define('commissions', {
  email: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  nickname: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'commissions',
  freezeTableName: true,
  name: {
    singular: 'commission'
  }
});

Commission.STATUS = {
  incoming: 0,
  inprogress: 10,
  inreview: 20,
  finished: 30,
  canceled: 2
};

/**
 * Promises to ensure that `form` is eager loaded on this instance.
 * @returns {Promise}
 */
Commission.prototype.ensureForm = function () {
  return new Promise((resolve, reject) => {
    if (this.form) return resolve(this);

    return this.getForm()
      .then(form => {
        this.form = form;
        return resolve(this);
      })
      .catch(reject);
  });
};

/**
 * Promises to ensure that `answers` are eager loaded on this instance.
 * @returns {Promise}
 */
Commission.prototype.ensureAnswers = function () {
  return new Promise((resolve, reject) => {
    if (this.answers) return resolve(this);

    return this.getAnswers()
      .then(answers => {
        this.answers = answers;
        return resolve(this);
      })
      .catch(reject);
  });
};

Commission.prototype.toJSON = function () {
  return new Promise(resolve => {
    const {
      id,
      userId,
      createdAt,
      updatedAt,
      email,
      nickname,
      status
    } = this.get();

    return resolve({
      id,
      userId,
      email,
      nickname,
      status: invert(Commission.STATUS)[status],
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString()
    });
  });
};

Commission.belongsTo(User);
Commission.belongsTo(Form);
User.hasOne(Commission);
Form.hasMany(Commission);

module.exports = Commission;
