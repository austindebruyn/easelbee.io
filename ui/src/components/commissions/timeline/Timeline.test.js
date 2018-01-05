import sinon from 'sinon';
import questionsFixture from 'fixtures/questions';
import commissionsFixture from 'fixtures/commissions';
import Timeline from './Timeline';
import TimelineFillout from './TimelineFillout';
import Vuex from 'vuex';
import Resource, { STATUS } from 'state/Resource';
import { mount } from 'avoriaz';

function storeFactory (fillouts = {}) {
  this.store = new Vuex.Store({
    state: {
      fillouts
    },
    actions: this.actions
  });
}

describe('Timeline', function () {
  beforeEach(function () {
    this.actions = {
      fetchFillout: sinon.spy()
    };
  });

  describe('when not loaded', function () {
    beforeEach(function () {
      storeFactory.call(this);
      this.wrapper = mount(Timeline, {
        propsData: {
          commission: commissionsFixture.basic
        },
        i18n: this.i18n,
        store: this.store
      });
    });

    it('should fetch fillout', function () {
      expect(this.actions.fetchFillout).to.have.been.calledWith(
        sinon.match.object,
        commissionsFixture.basic.id
      );
    });

    it('should render spinner', function () {
      const selector = '.card-body > .loading-container';
      expect(this.wrapper.contains(selector)).to.be.true;
    });
  });

  describe('when loaded', function () {
    beforeEach(function () {
      this.fillout = {
        commission: commissionsFixture.basic,
        pairs: [
          { question: questionsFixture.basic, value: 'Sketch' }
        ]
      };

      storeFactory.call(this, {
        [commissionsFixture.basic.id]: new Resource({
          value: this.fillout,
          status: STATUS.LOADED
        })
      });

      this.wrapper = mount(Timeline, {
        propsData: {
          commission: commissionsFixture.basic
        },
        i18n: this.i18n,
        store: this.store
      });
    });

    it('should not render spinner', function () {
      const selector = '.card-body > .loading-container';
      expect(this.wrapper.contains(selector)).to.be.false;
    });

    it('should render fillout', function () {
      const child = this.wrapper.first(TimelineFillout);
      expect(child.propsData()).to.eql({ fillout: this.fillout });
    });
  });
});
