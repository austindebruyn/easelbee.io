const db = require('../../services/db');
const User = require('../users/User');

const Form = db.define('forms', {
  email: {
    type: db.Sequelize.STRING
  },
  body: {
    type: db.Sequelize.STRING
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