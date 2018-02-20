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

User.prototype.toJSON = function (viewer = null) {
  return (async () => {
    const json = {
      id: this.get('id'),
      displayName: this.get('displayName')
    };
    if (viewer && viewer.id === this.id) {
      Object.assign(json, {
        email: this.get('email'),
        createdAt: this.get('createdAt').toUTCString(),
        updatedAt: this.get('updatedAt').toUTCString()
      });
    }
    return json;
  })();
};

module.exports = User;
