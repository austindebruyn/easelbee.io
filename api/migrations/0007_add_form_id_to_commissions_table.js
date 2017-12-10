module.exports = {
  up: function (q, Sequelize) {
    return q.addColumn('commissions', 'formId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'forms',
        key: 'id'
      }
    });
  },
  down: function (q, Sequelize) {
    return q.removeColumn('commissions', 'formId');
  }
};
