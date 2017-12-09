module.exports = {
  up: function (q, Sequelize) {
    return q.renameColumn('users', 'username', 'displayName')
      .then(function () {
        q.changeColumn('users', 'displayName', {
          type: Sequelize.STRING,
          allowNull: false,
          unique: false,
          validate: {
            len: [1, 64]
          }
        });
      });
  },
  down: function (q, Sequelize) {
    return q.changeColumn('users', 'displayName', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 64],
        is: {
          args: /^[\w-]*$/i,
          msg: 'Only use letters and numbers!'
        }
      }
    }).then(function () {
      renameColumn('users', 'displayName', 'username');
    });
  }
}
