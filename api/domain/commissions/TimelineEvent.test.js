const { expect } = require('chai');
const factory = require('../../tests/factory');

describe('TimelineEvent', function () {
  describe('#toJSON', function () {
    describe('when no metas preloaded', function () {
      beforeEach(function () {
        return factory.create('timelineEvent')
          .then(event => {
            this.event = event;
            return factory.createMany('timelineEventMeta', 3, {
              timelineEventId: event.id
            });
          });
      });

      it('should preload', function () {
        expect(this.event.timelineEventMetas).to.be.undefined;

        return this.event.toJSON()
          .then(json => {
            expect(json.id).to.eql(this.event.id);
            expect(json.metas).to.have.length(3);
            expect(json.metas[0].timelineEventId).to.eql(this.event.id);
            expect(this.event.timelineEventMetas).to.not.be.undefined;
          });
      });
    });
  });
});
