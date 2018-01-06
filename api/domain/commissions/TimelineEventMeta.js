const db = require('../../services/db');
const TimelineEvent = require('./TimelineEvent');

const TimelineEventMeta = db.define('timelineEventMetas', {
  key: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  value: {
    type: db.Sequelize.STRING
  }
}, {
  tableName: 'timeline_event_metas',
  freezeTableName: true,
  name: {
    singular: 'timelineEventMeta'
  }
});

TimelineEventMeta.prototype.toJSON = function () {
  return new Promise(resolve => {
    const {
      id,
      timelineEventId,
      createdAt,
      updatedAt,
      key,
      value
    } = this.get();

    return resolve({
      id,
      timelineEventId,
      key,
      value,
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString()
    });
  });
};

TimelineEventMeta.belongsTo(TimelineEvent);
TimelineEvent.hasMany(TimelineEventMeta);

module.exports = TimelineEventMeta;
