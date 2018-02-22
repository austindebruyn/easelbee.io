const db = require('../../services/db');
const Commission = require('./Commission');
const invert = require('lodash.invert');

const Price = db.define('prices', {
  type: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  amount: {
    type: db.Sequelize.FLOAT,
    allowNull: false
  }
});

Price.TYPES = {
  auto: 0,
  manual: 1
};
Object.assign(Price.TYPES, invert(Price.TYPES));

Price.prototype.toJSON = function () {
  return (async () => {
    const {
      id,
      createdAt,
      updatedAt,
      type,
      commissionId,
      amount
    } = this.get();

    return {
      id,
      commissionId,
      amount,
      status: Price.TYPES[type],
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString()
    };
  })();
};

Price.belongsTo(Commission);
Commission.hasMany(Price);

module.exports = Price;
