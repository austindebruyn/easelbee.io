import Vuex from 'vuex';
import sinon from 'sinon';
import questionsFixture from 'fixtures/questions';
import commissionsFixture from 'fixtures/commissions';
import eventsFixture, { buildEvent } from 'fixtures/events';
import { mount } from 'avoriaz';
import merge from 'lodash.merge';

import * as getters from 'state/artist/getters';
import Timeline from './Timeline';
import TimelineItem from './TimelineItem';
import TimelineFillout from './TimelineFillout';
import clock from '../../../../../api/tests/clock';

function storeFactory (state = {}) {
  const initialState = {
    meta: {
      fillouts: { mutating: false, errored: false },
      events: { mutating: false, errored: false }
    },
    fillouts: {},
    events: {}
  };

  this.store = new Vuex.Store({
    state: merge(initialState, state),
    actions: this.actions,
    getters
  });
}

function wrapperFactory () {
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
        fillouts: { [commissionsFixture.basic.id]: this.fillout }
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
      storeFactory.call(this, {
        events: { [commissionsFixture.basic.id]: [eventsFixture.basic] }
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
        fillouts: { [commissionsFixture.basic.id]: this.fillout },
        events: { [commissionsFixture.basic.id]: [eventsFixture.basic] }
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
        bubble: true
      });
      expect(child.text()).to.include('You moved this commission from Incoming to In Progress.');
    });
  });

  describe('when loaded with many events', function () {
    clock();

    beforeEach(function () {
      this.events = [
        buildEvent({ createdAt: 'Wed, 30 Aug 2017 06:00:00 GMT' }),
        buildEvent({ createdAt: 'Wed, 30 Aug 2017 06:01:00 GMT' }),
        buildEvent({ createdAt: 'Wed, 30 Aug 2017 06:10:00 GMT' }),
        buildEvent({ createdAt: 'Wed, 30 Aug 2017 07:00:00 GMT' }),
        buildEvent({ createdAt: 'Wed, 24 Aug 2017 00:00:00 GMT' })
      ];

      storeFactory.call(this, {
        fillouts: { [commissionsFixture.basic.id]: this.fillout },
        events: { [commissionsFixture.basic.id]: this.events }
      });

      this.wrapper = wrapperFactory.call(this);
    });

    it('should render events in order', function () {
      const timelineItems = this.wrapper.find(TimelineItem);
      expect(timelineItems[1].text()).to.include('1weeks ago');
      expect(timelineItems[2].text()).to.include('18hrs ago');
    });

    it('should bunch up events that happened within 15 minutes', function () {
      const timelineItems = this.wrapper.find(TimelineItem);
      expect(timelineItems[2].text()).to.include('18hrs ago');
      expect(timelineItems[2].propsData().bubble).to.be.true;
      expect(timelineItems[3].propsData().bubble).to.be.false;
      expect(timelineItems[3].contains('.date-bubble')).to.be.false;
      expect(timelineItems[4].propsData().bubble).to.be.false;
      expect(timelineItems[4].contains('.date-bubble')).to.be.false;

      expect(timelineItems[5].propsData().bubble).to.be.true;
      expect(timelineItems[5].contains('.date-bubble')).to.be.true;
      expect(timelineItems[5].text()).to.include('17hrs ago');
    });
  });
});
