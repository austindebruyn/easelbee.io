module.exports = {
  up: function (q, Sequelize) {
    return q.addColumn('option_attachments', 'originalId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'option_attachments',
        key: 'id'
      }
    });
  },
  down: function (q, Sequelize) {
    return q.removeColumn('option_attachments', 'originalId');
  }
};
