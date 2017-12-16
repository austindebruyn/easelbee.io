import FormsIndexPage from './FormsIndexPage';
import { mount } from 'avoriaz';
import Vuex from 'vuex';
import sinon from 'sinon';
import Resource, { STATUS } from 'state/Resource';
import LoadingSpinner from 'components/LoadingSpinner';
import FormsList from 'components/forms/FormsList';
import formsFixture from 'fixtures/forms';

describe('FormsIndexPage', function () {
  beforeEach(function () {
    this.actions = {
      fetchForms: sinon.spy()
    };
  });

  afterEach(function () {
    this.actions.fetchForms.reset();
  });

  function storeFactory (resourceOpts = {}) {
    this.store = new Vuex.Store({
      state: {
        forms: new Resource(resourceOpts)
      },
      actions: this.actions
    });
  }

  describe('when not loaded', function () {
    beforeEach(function () {
      storeFactory.call(this);
    });

    it('should fetch', function () {
      mount(FormsIndexPage, { store: this.store, i18n: this.i18n });

      expect(this.actions.fetchForms).to.have.been.called;
    });

    it('should render spinner', function () {
      const wrapper = mount(FormsIndexPage, {
        store: this.store,
        i18n: this.i18n
      });
      expect(wrapper.contains(LoadingSpinner)).to.be.true;
      expect(wrapper.contains(FormsList)).to.be.false;
    });

    it('should have breadcrumbs', function () {
      const wrapper = mount(FormsIndexPage, {
        store: this.store,
        i18n: this.i18n
      });

      expect(wrapper.vm.breadcrumbs).to.eql([
        { name: 'Your Forms' }
      ]);
    });
  });

  describe('when loaded', function () {
    beforeEach(function () {
      storeFactory.call(this, {
        status: STATUS.LOADED,
        value: [ formsFixture.basic ]
      });
    });

    it('should not render spinner', function () {
      const wrapper = mount(FormsIndexPage, {
        store: this.store,
        i18n: this.i18n
      });

      expect(wrapper.contains(LoadingSpinner)).to.be.false;
      expect(wrapper.contains(FormsList)).to.be.true;
      expect(wrapper.contains('.not-found')).to.be.false;

      const child = wrapper.first(FormsList);
      expect(child.propsData()).to.eql({
        forms: [ formsFixture.basic ]
      });
    });
  });
});
