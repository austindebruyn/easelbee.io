import sinon from 'sinon';
import questionsFixture from 'fixtures/questions';
import commissionsFixture from 'fixtures/commissions';
import eventsFixture from 'fixtures/events';
import Timeline from './Timeline';
import TimelineItem from './TimelineItem';
import TimelineFillout from './TimelineFillout';
import Vuex from 'vuex';
import Resource, { STATUS } from 'state/Resource';
import { mount } from 'avoriaz';

function storeFactory (fillouts = {}, events = {}) {
  this.store = new Vuex.Store({
    state: {
      fillouts,
      events
    },
    actions: this.actions
  });
}

function wrapperFactory() {
  return mount(Timeline, {
    propsData: {
      commission: commissionsFixture.basic
    },
    i18n: this.i18n,
    store: this.store
  });
}

describe('Timeline', function () {
  beforeEach(function () {
    this.fillout = {
      commission: commissionsFixture.basic,
      pairs: [
        { question: questionsFixture.basic, value: 'Sketch' }
      ]
    };

    this.actions = {
      fetchFillout: sinon.spy(),
      fetchEvents: sinon.spy()
    };
  });

  describe('when neither loaded', function () {
    beforeEach(function () {
      storeFactory.call(this);
      this.wrapper = wrapperFactory.call(this);
    });
    
    it('should fetch fillout', function () {
      expect(this.actions.fetchFillout).to.have.been.calledWith(
        sinon.match.object,
        commissionsFixture.basic.id
      );
    });

    it('should fetch events', function () {
      expect(this.actions.fetchEvents).to.have.been.calledWith(
        sinon.match.object,
        commissionsFixture.basic.id
      );
    });

    it('should render spinner', function () {
      const selector = '.card-body > .loading-container';
      expect(this.wrapper.contains(selector)).to.be.true;
    });
  });

  describe('when only fillout loaded', function () {
    beforeEach(function () {
      storeFactory.call(this, {
        [commissionsFixture.basic.id]: new Resource({
          value: this.fillout,
          status: STATUS.LOADED
        })
      });
      this.wrapper = wrapperFactory.call(this);
    });

    it('should not render spinner on fillout card', function () {
      const selector = '.card-body > .loading-container';
      expect(this.wrapper.contains(selector)).to.be.false;
    });

    it('should render spinner in timeline list', function () {
      const selector = '.commission-timeline > .loading-container';
      expect(this.wrapper.contains(selector)).to.be.true;
      expect(this.wrapper.contains('.timeline-event-items')).to.be.false;
    });
  });

  describe('when only events loaded', function () {
    beforeEach(function () {
      storeFactory.call(this,
        {},
        {
        [commissionsFixture.basic.id]: new Resource({
          value: [ eventsFixture.basic ],
          status: STATUS.LOADED
        })
      });
      this.wrapper = wrapperFactory.call(this);
    });

    it('should render spinner on fillout card', function () {
      const selector = '.card-body > .loading-container';
      expect(this.wrapper.contains(selector)).to.be.true;
    });

    it('should not render spinner in timeline list', function () {
      const selector = '.commission-timeline > .loading-container';
      expect(this.wrapper.contains(selector)).to.be.false;
      expect(this.wrapper.contains('.timeline-event-items')).to.be.true;
    });
  });

  describe('when loaded', function () {
    beforeEach(function () {
      storeFactory.call(this, {
        [commissionsFixture.basic.id]: new Resource({
          value: this.fillout,
          status: STATUS.LOADED
        })
      }, {
        [commissionsFixture.basic.id]: new Resource({
          value: [ eventsFixture.basic ],
          status: STATUS.LOADED
        })
      });

      this.wrapper = wrapperFactory.call(this);
    });

    it('should not render spinner', function () {
      const selector = '.card-body > .loading-container';
      expect(this.wrapper.contains(selector)).to.be.false;
    });

    it('should render fillout', function () {
      const timelineItem = this.wrapper.first(TimelineItem);
      expect(timelineItem.propsData()).to.include({
        date: commissionsFixture.basic.createdAt,
        bubble: true
      });

      const child = this.wrapper.first(TimelineFillout);
      expect(child.propsData()).to.eql({ fillout: this.fillout });
    });

    it('should render events', function () {
      const child = this.wrapper.find(TimelineItem)[1];
      expect(child.propsData()).to.include({
        date: eventsFixture.basic.createdAt,
        bubble: false
      });
      expect(child.text()).to.eql('You moved this commission from Incoming to In Progress.');
    });
  });
});
