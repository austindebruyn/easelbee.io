const db = require('../../services/db');
const User = require('../users/User');
const Form = require('../forms/Form');
const invert = require('lodash.invert');

const Commission = db.define('commissions', {
  email: {
    type: db.Sequelize.STRING
  },
  body: {
    type: db.Sequelize.STRING
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
    singular: 'commissions'
  }
});

Commission.STATUS = {
  incoming: 0,
  inProgress: 10,
  inReview: 20,
  finished: 30,
  canceled: 2
};

Commission.prototype.toJSON = function () {
  return new Promise(resolve => {
    const {
      id,
      userId,
      createdAt,
      updatedAt,
      email,
      body,
      status
    } = this.get();

    return resolve({
      id,
      userId,
      email,
      body,
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
