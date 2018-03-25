module.exports = {
  up: function (q, Sequelize) {
    return q.createTable('option_attachments', {
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
      objectKey: {
        type: Sequelize.STRING,
        allowNull: false
      },
      engine: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      optionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'options',
          key: 'id'
        }
      }
    });
  },
  down: function (q, Sequelize) {
    return q.dropTable('option_attachments');
  }
};
