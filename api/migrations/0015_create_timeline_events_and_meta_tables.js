module.exports = {
  up: function (q, Sequelize) {
    return q.createTable('timeline_events', {
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
      key: {
        type: Sequelize.STRING,
        allowNull: false
      },
      commissionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'commissions',
          key: 'id'
        }
      }
    }).then(function () {
      return q.createTable('timeline_event_metas', {
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
        key: {
          type: Sequelize.STRING,
          allowNull: false
        },
        value: {
          type: Sequelize.STRING
        },
        timelineEventId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'timeline_events',
            key: 'id'
          }
        }
      });
    });
  },
  down: function (q, Sequelize) {
    return q.dropTable('timeline_event_metas').then(function () {
      return q.dropTable('timeline_events');
    });
  }
};
