module.exports = {
  up: function (q, Sequelize) {
    return q.addColumn('commissions', 'status', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  },
  down: function (q, Sequelize) {
    return q.removeColumn('commissions', 'status');
  }
};
