const db = require('../../services/db');
const User = require('../users/User');

const Commission = db.define('commissions', {
  email: {
    type: db.Sequelize.STRING
  },
  body: {
    type: db.Sequelize.STRING
  }
}, {
  tableName: 'commissions',
  freezeTableName: true,
  name: {
    singular: 'commissions'
  }
});

Commission.prototype.toJSON = function () {
  return new Promise(resolve => {
    const {
      id,
      userId,
      createdAt,
      updatedAt,
      email,
      body
    } = this.get();

    return resolve({
      id,
      userId,
      email,
      body,
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString()
    });
  });
};

Commission.belongsTo(User);
User.hasOne(Commission);

module.exports = Commission;
