const _ = require('lodash');
const Commission = require('./Commission');
const TimelineEvent = require('./TimelineEvent');
const TimelineEventMeta = require('./TimelineEventMeta');
const { UnprocessableEntityError } = require('../../core/errors');

class CommissionUpdater {
  constructor(commission) {
    this.commission = commission;
    this.sanitizedInput = null;
  }

  /**
   * Promises to resolve with sanitized input.
   * @param {Object} input
   * @private
   */
  sanitize(input) {
    return new Promise((resolve, reject) => {
      const body = { ...input };

      const attributeKeys = Object.keys(body);
      const allowedAttributes = ['status'];
      const forbiddenAttributes = _.difference(
        attributeKeys,
        allowedAttributes
      );

      if (forbiddenAttributes.length > 0) {
        throw new UnprocessableEntityError('bad-attributes', {
          fields: forbiddenAttributes
        });
      }

      if ('status' in body) {
        if (!Object.keys(Commission.STATUS).includes(body.status)) {
          throw new UnprocessableEntityError('no-such-status', {
            status: body.status
          });
        }
        body.status = Commission.STATUS[body.status];
      }

      return resolve(body);
    });
  }

  /**
   * Build any event models needed based on previous and new state.
   * @param {Object} previous the old state
   * @param {Object} next the new values being written into the record
   * @private
   */
  async createTimelineEvents(previous, next) {
    if ('status' in next && previous.status !== next.status) {
      return TimelineEvent.create({
        commissionId: this.commission.id,
        key: 'status-change'
      }).then(event => {
        const metas = [
          new TimelineEventMeta({
            timelineEventId: event.id,
            key: 'old',
            value: _.invert(Commission.STATUS)[previous.status]
          }),
          new TimelineEventMeta({
            timelineEventId: event.id,
            key: 'new',
            value: _.invert(Commission.STATUS)[next.status]
          })
        ];
        return Promise.all(metas.map(m => m.save()));
      });
    }
    return Promise.resolve();
  }

  /**
   * Promises to update the commission model with the given input.
   * @param {Object} input 
   */
  update(input) {
    return this.sanitize(input)
      .then(sanitized => {
        this.sanitizedInput = sanitized;

        return this.createTimelineEvents(
          this.commission.get({ plain: true }),
          this.sanitizedInput
        );
      })
      .then(() => {
        Object.assign(this.commission, this.sanitizedInput);
        return this.commission.save();
      })
      .then(Promise.resolve(this.commission));
  }
}

module.exports = CommissionUpdater;
