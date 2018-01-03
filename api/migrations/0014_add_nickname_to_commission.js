module.exports = {
  up: function (q, Sequelize) {
    return q.addColumn('commissions', 'nickname', Sequelize.STRING);
  },
  down: function (q, Sequelize) {
    return q.removeColumn('commissions', 'nickname');
  }
};
