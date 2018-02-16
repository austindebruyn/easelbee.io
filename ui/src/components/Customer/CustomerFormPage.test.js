import CustomerFormPage from './CustomerFormPage';
import { shallow } from 'avoriaz';
import Vuex from 'vuex';
import sinon from 'sinon';
import Resource, { STATUS } from 'state/Resource';
import LoadingSpinner from 'components/LoadingSpinner';
// import FormsList from 'components/forms/FormsList';

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
      // expect(wrapper.contains(FormsList)).to.be.false;
    });
  });

  describe('when loaded', function () {
    beforeEach(function () {
      storeFactory.call(this, {
        status: STATUS.LOADED,
        value: {}
      });
    });

    it('should not render spinner', function () {
      const wrapper = factory.call(this);

      expect(wrapper.contains(LoadingSpinner)).to.be.false;
      // expect(wrapper.contains(FormsList)).to.be.true;
      expect(wrapper.contains('.not-found')).to.be.false;

      // const child = wrapper.first(FormsList);
      // expect(child.propsData()).to.eql({
      //   forms: [ formsFixture.basic ]
      // });
    });
  });
});
