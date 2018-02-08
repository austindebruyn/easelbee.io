module.exports = {
  up: function (q, Sequelize) {
    return q.addColumn('forms', 'deletedAt', Sequelize.DATE);
  },
  down: function (q, Sequelize) {
    return q.removeColumn('forms', 'deletedAt');
  }
};
