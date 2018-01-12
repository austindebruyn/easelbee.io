const CommissionUpdater = require('./CommissionUpdater');
const TimelineEvent = require('./TimelineEvent');
const TimelineEventMeta = require('./TimelineEventMeta');
const Commission = require('./Commission');
const factory = require('../../tests/factory');
const { expect } = require('chai');

describe('CommissionUpdater', function () {
  beforeEach(async function () {
    this.commission = await factory.create('commission');
    this.updater = new CommissionUpdater(this.commission);
  });

  describe('sanitizing', function () {
    it('should reject bad attribute', function () {
      return expect(this.updater.update({ id: 4 }))
        .to.eventually.rejected.and.deep.include({
          code: 'bad-attributes',
          fields: ['id']
        });
    });

    it('should reject bad status', function () {
      return expect(this.updater.update({ status: 'potato' }))
        .to.eventually.rejected.and.deep.include({
          code: 'no-such-status',
          status: 'potato'
        });
    });
  });

  it('should resolve with commission', function () {
    return expect(this.updater.update({ status: 'inprogress' }))
      .to.eventually.eql(this.commission);
  });

  describe('creating timeline events', function () {
    it('should create event for status change', function () {
      return this.updater.update({ status: 'inprogress' })
        .then(() => {
          expect(this.commission.status).to.eql(Commission.STATUS.inprogress);

          return TimelineEvent.findAll({
            where: { commissionId: this.commission.id },
            include: [TimelineEventMeta]
          });
        })
        .then(events => {
          expect(events).to.have.length(1);

          const event = events[0];
          expect(event.key).to.eql('status-change');

          const metas = event.timelineEventMetas;
          expect(metas).to.have.length(2);
          expect(metas[0]).to.include({ key: 'new', value: 'inprogress' });
          expect(metas[1]).to.include({ key: 'old', value: 'incoming' });
        });
    });

    it('doesnt create event if same status', async function () {
      await this.updater.update({ status: 'incoming' });
      expect(this.commission.status).to.eql(Commission.STATUS.incoming);
      expect(TimelineEvent.findAll({
        where: { commissionId: this.commission.id }
      })).to.eventually.have.length(0);
    });

    it('doesnt create event if no status', async function () {
      await this.updater.update({ });
      expect(this.commission.status).to.eql(Commission.STATUS.incoming);
      expect(TimelineEvent.findAll({
        where: { commissionId: this.commission.id }
      })).to.eventually.have.length(0);
    });
  });
});
