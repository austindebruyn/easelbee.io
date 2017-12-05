import sinon from 'sinon';

export default {
  stubDate: function () {
    this.clock = sinon.useFakeTimers({
      now: new Date('2017-08-31T00:00:00.001Z'),
      toFake: ['Date']
    });
  },
  restoreStubDate: function () {
    this.clock.restore();
  }
};
