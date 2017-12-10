module.exports = {
  up: function (q, Sequelize) {
    return q.addColumn('audios', 'column_name', Sequelize.STRING);
  },
  down: function (q, Sequelize) {
    return q.removeColumn('audios', 'column_name');
  }
};
module.exports = {
  up: function (q, Sequelize) {
    return q.createTable('commissions', {
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
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      email: {
        type: Sequelize.STRING
      },
      body: {
        type: Sequelize.STRING
      }
    });
  },
  down: function (q, Sequelize) {
    return q.dropTable('commissions');
  }
};
