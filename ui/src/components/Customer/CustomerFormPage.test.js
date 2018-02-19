import CustomerFormPage from './CustomerFormPage';
import { shallow } from 'avoriaz';
import Vuex from 'vuex';
import sinon from 'sinon';
import Resource, { STATUS } from 'state/Resource';
import LoadingSpinner from 'components/LoadingSpinner';
import CustomerFormQuestionCard from 'components/Customer/CustomerFormQuestionCard';
import CustomerFormCompletedCard from 'components/Customer/CustomerFormCompletedCard';
import formsFixture from 'fixtures/forms';
import { nextTick } from 'vue';

describe('CustomerFormPage', function () {
  beforeEach(function () {
    this.actions = {
      fetchForm: sinon.spy()
    };
  });

  afterEach(function () {
    this.actions.fetchForm.reset();
  });

  function storeFactory (resourceOpts = {}) {
    this.store = new Vuex.Store({
      state: {
        form: new Resource(resourceOpts)
      },
      actions: this.actions
    });
  }

  function factory (opts) {
    return shallow(CustomerFormPage, {
      store: this.store,
      i18n: this.i18n,
      globals: {
        $route: {
          params: { slug: 'untitled-form-1' }
        }
      }
    });
  }

  describe('when not loaded', function () {
    beforeEach(function () {
      storeFactory.call(this);
    });

    it('should fetch', function () {
      factory.call(this);

      expect(this.actions.fetchForm).to.have.been.calledWith(
        sinon.match.object,
        'untitled-form-1'
      );
    });

    it('should render spinner', function () {
      const wrapper = factory.call(this);

      expect(wrapper.contains(LoadingSpinner)).to.be.true;
      expect(wrapper.contains(CustomerFormQuestionCard)).to.be.false;
    });
  });

  describe('when loaded', function () {
    beforeEach(function () {
      storeFactory.call(this, {
        status: STATUS.LOADED,
        value: formsFixture.basic
      });
    });

    it('should not render spinner', function () {
      const wrapper = factory.call(this);

      expect(wrapper.contains(LoadingSpinner)).to.be.false;
      expect(wrapper.contains(CustomerFormQuestionCard)).to.be.true;
      expect(wrapper.contains('.not-found')).to.be.false;

      const child = wrapper.first(CustomerFormQuestionCard);
      expect(child.propsData()).to.eql({
        form: formsFixture.basic
      });
    });
  });

  describe('when form is completed', function () {
    beforeEach(function () {
      storeFactory.call(this, {
        status: STATUS.LOADED,
        value: formsFixture.basic
      });
      this.wrapper = factory.call(this);
      this.wrapper.vm.completed = true;
      return nextTick();
    });

    it('should render completed card and not question card', function () {
      expect(this.wrapper.find(CustomerFormQuestionCard)).to.have.length(0);
      expect(this.wrapper.find(CustomerFormCompletedCard)).to.have.length(1);
    });
  });
});
