module.exports = {
  up: function (q, Sequelize) {
    return q.changeColumn('questions', 'required', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      default: false
    });
  },
  down: function (q, Sequelize) {
    return q.changeColumn('questions', 'required', {
      type: Sequelize.BOOLEAN,
      default: false
    });
  }
};
