module.exports = {
  up: function (q, Sequelize) {
    return q.addColumn('options', 'originalId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'options',
        key: 'id'
      }
    });
  },
  down: function (q, Sequelize) {
    return q.removeColumn('options', 'originalId');
  }
};
