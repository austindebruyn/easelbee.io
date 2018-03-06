module.exports = {
  up: function (q, Sequelize) {
    return q.createTable('options', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      questionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id'
        }
      },
      value: {
        type: Sequelize.TEXT,
        allowNull: false
      }
    });
  },
  down: function (q, Sequelize) {
    return q.dropTable('options');
  }
};
