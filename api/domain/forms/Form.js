const db = require('../../services/db');
const User = require('../users/User');

const Form = db.define('forms', {
  name: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: db.Sequelize.STRING,
    allowNull: false
  }
}, {
  tableName: 'forms',
  freezeTableName: true,
  name: {
    singular: 'form'
  }
});

Form.prototype.toJSON = function () {
  return new Promise(resolve => {
    const {
      id,
      userId,
      createdAt,
      updatedAt,
      name,
      slug
    } = this.get();

    return resolve({
      id,
      userId,
      name,
      slug,
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString()
    });
  });
};

Form.belongsTo(User);
User.hasOne(Form);

module.exports = Form;
