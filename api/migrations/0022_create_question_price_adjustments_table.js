module.exports = {
  up: function (q, Sequelize) {
    return q.createTable('deltas', {
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
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0
      },
      optionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'options',
          key: 'id'
        }
      }
    });
  },
  down: function (q, Sequelize) {
    return q.dropTable('deltas');
  }
};
