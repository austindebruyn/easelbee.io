const db = require('../../services/db');

const User = db.define('user', {
  email: {
    type: db.Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  displayName: {
    type: db.Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [1, 64]
    }
  },
  password: {
    type: db.Sequelize.STRING,
    allowNull: false
  }
});

User.prototype.toJSON = function () {
  return new Promise(resolve => {
    return resolve({
      id: this.get('id'),
      displayName: this.get('displayName'),
      email: this.get('email'),
      createdAt: this.get('createdAt').toUTCString(),
      updatedAt: this.get('updatedAt').toUTCString()
    });
  });
};

module.exports = User;
