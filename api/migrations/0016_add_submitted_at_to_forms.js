module.exports = {
  up: function (q, Sequelize) {
    return q.addColumn('forms', 'submittedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },
  down: function (q, Sequelize) {
    return q.removeColumn('forms', 'submittedAt');
  }
};
