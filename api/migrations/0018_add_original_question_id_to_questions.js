module.exports = {
  up: function (q, Sequelize) {
    return q.addColumn('questions', 'originalQuestionId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'questions',
        key: 'id'
      }
    });
  },
  down: function (q, Sequelize) {
    return q.removeColumn('questions', 'originalQuestionId');
  }
};
