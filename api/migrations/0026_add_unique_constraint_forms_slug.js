module.exports = {
  up: function (q, Sequelize) {
    return q.changeColumn('forms', 'slug', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  },
  down: function (q, Sequelize) {
    return q.changeColumn('forms', 'slug', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
