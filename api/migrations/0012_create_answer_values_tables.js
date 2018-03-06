function buildCommonFields(Sequelize) {
  return {
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
    answerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'answers',
        key: 'id'
      }
    }
  };
}

module.exports = {
  up: function (q, Sequelize) {
    return Promise.all([
      q.createTable('answer_text_values', {
        ...buildCommonFields(Sequelize),
        value: {
          type: Sequelize.TEXT
        }
      }),
      q.createTable('answer_option_values', {
        ...buildCommonFields(Sequelize),
        optionId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'options',
            key: 'id'
          }
        }
      })
    ]);
  },
  down: function (q, Sequelize) {
    return Promise.all([
      q.dropTable('answer_text_values'),
      q.dropTable('answer_option_values')
    ]);
  }
};
