const db = require('../../services/db');
const Commission = require('./Commission');

const TimelineEvent = db.define('timelineEvents', {
  key: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  value: {
    type: db.Sequelize.STRING
  }
}, {
  tableName: 'timeline_events',
  freezeTableName: true,
  name: {
    singular: 'timelineEvent'
  }
});

/**
 * Promises to ensure that `timelineEventMetas` area eager loaded on this
 * instance.
 * @returns {Promise}
 */
TimelineEvent.prototype.ensureTimelineEventMetas = function () {
  return new Promise((resolve, reject) => {
    if (this.timelineEventMetas) return resolve(this);

    return this.getTimelineEventMetas()
      .then(timelineEventMetas => {
        this.timelineEventMetas = timelineEventMetas;
        return resolve(this);
      })
      .catch(reject);
  });
};

TimelineEvent.prototype.toJSON = function () {
  return this.ensureTimelineEventMetas()
    .then(() => {
      return Promise.all(this.timelineEventMetas.map(e => e.toJSON()));
    })
    .then(metas => {
      const {
        id,
        commissionId,
        createdAt,
        updatedAt,
        key
      } = this.get();

      return {
        id,
        commissionId,
        key,
        metas,
        createdAt: createdAt && createdAt.toUTCString(),
        updatedAt: updatedAt && updatedAt.toUTCString()
      };
    });
};

TimelineEvent.belongsTo(Commission);
Commission.hasMany(TimelineEvent);

module.exports = TimelineEvent;
