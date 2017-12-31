module.exports = {
  up: function (q, Sequelize) {
    return q.createTable('answers', {
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
      commissionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'commissions',
          key: 'id'
        }
      }
    });
  },
  down: function (q, Sequelize) {
    return q.dropTable('answers');
  }
};
