module.exports = {
  up: function (q, Sequelize) {
    return q.removeColumn('commissions', 'body');
  },
  down: function (q, Sequelize) {
    return q.addColumn('commissions', 'body', {
      type: Sequelize.STRING
    });
  }
};
