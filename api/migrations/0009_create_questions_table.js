module.exports = {
  up: function (q, Sequelize) {
    return q.createTable('questions', {
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
      deletedAt: {
        type: Sequelize.DATE
      },
      formId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'forms',
          key: 'id'
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      required: {
        type: Sequelize.BOOLEAN,
        default: false
      }
    });
  },
  down: function (q, Sequelize) {
    return q.dropTable('questions');
  }
};
