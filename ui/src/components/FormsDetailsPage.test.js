import { mount } from 'avoriaz';
import Vuex from 'vuex';
import sinon from 'sinon';
import merge from 'lodash.merge';

import * as getters from 'state/artist/getters';
import FormsDetailsPage from './FormsDetailsPage';
import LoadingSpinner from 'components/LoadingSpinner';
import FormDetails from 'components/forms/FormDetails';
import { buildForm } from 'fixtures/forms';

describe('FormsDetailsPage', function () {
  beforeEach(function () {
    this.actions = {
      fetchForms: sinon.spy()
    };
  });

  afterEach(function () {
    this.actions.fetchForms.reset();
  });

  function storeFactory (state = {}) {
    const initialState = merge({
      meta: {
        forms: { errored: false, mutating: false }
      },
      forms: null,
      questions: {},
      areFormsLoaded: false
    }, state);

    this.store = new Vuex.Store({
      state: initialState,
      getters: {
        ...getters,
        areFormsLoaded: state => state.areFormsLoaded
      },
      actions: this.actions
    });
  }

  describe('when not loaded', function () {
    beforeEach(function () {
      storeFactory.call(this);
    });

    it('should fetch', function () {
      mount(FormsDetailsPage, {
        store: this.store,
        i18n: this.i18n,
        globals: {
          $route: {
            path: '/forms/1',
            params: { id: 1 }
          }
        }
      });

      expect(this.actions.fetchForms).to.have.been.called;
    });

    it('should render spinner', function () {
      const wrapper = mount(FormsDetailsPage, {
        store: this.store,
        i18n: this.i18n,
        globals: {
          $route: {
            path: '/forms/1',
            params: { id: 1 }
          }
        }
      });
      expect(wrapper.contains(LoadingSpinner)).to.be.true;
      expect(wrapper.contains(FormDetails)).to.be.false;
      expect(wrapper.contains('.not-found')).to.be.false;
    });

    it('should have breadcrumbs but not include form title', function () {
      const wrapper = mount(FormsDetailsPage, {
        propsData: {
          form: buildForm({ id: 1 })
        },
        store: this.store,
        i18n: this.i18n,
        globals: {
          $route: {
            path: '/forms/1',
            params: { id: 1 }
          }
        }
      });

      expect(wrapper.vm.breadcrumbs).to.eql([
        { name: 'Your Forms', to: '/forms' }
      ]);
    });
  });

  describe('when loaded', function () {
    beforeEach(function () {
      this.form = buildForm({ id: 1, name: 'Some Form' });

      storeFactory.call(this, {
        areFormsLoaded: true,
        forms: { 1: this.form }
      });
    });

    it('should not render spinner', function () {
      const wrapper = mount(FormsDetailsPage, {
        store: this.store,
        i18n: this.i18n,
        globals: {
          $route: {
            path: '/forms/1',
            params: { id: 1 }
          }
        }
      });

      expect(wrapper.contains(LoadingSpinner)).to.be.false;
      expect(wrapper.contains(FormDetails)).to.be.true;
      expect(wrapper.contains('.not-found')).to.be.false;

      const child = wrapper.first(FormDetails);
      expect(child.propsData()).to.deep.include({ form: this.form });
    });

    it('should have breadcrumbs but and include form title', function () {
      const wrapper = mount(FormsDetailsPage, {
        store: this.store,
        i18n: this.i18n,
        globals: {
          $route: {
            path: '/forms/1',
            params: { id: 1 }
          }
        }
      });

      expect(wrapper.vm.breadcrumbs).to.eql([
        { name: 'Your Forms', to: '/forms' },
        { name: 'Some Form' }
      ]);
    });

    describe('but doesnt exist', function () {
      it('should render not found', function () {
        const wrapper = mount(FormsDetailsPage, {
          store: this.store,
          i18n: this.i18n,
          globals: {
            $route: {
              path: '/forms/222',
              params: { id: 222 }
            }
          }
        });

        expect(wrapper.contains(LoadingSpinner)).to.be.false;
        expect(wrapper.contains(FormDetails)).to.be.false;
        expect(wrapper.contains('.not-found')).to.be.true;
      });

      it('should have breadcrumbs but not include form title', function () {
        const wrapper = mount(FormsDetailsPage, {
          store: this.store,
          i18n: this.i18n,
          globals: {
            $route: {
              path: '/forms/222',
              params: { id: 222 }
            }
          }
        });

        expect(wrapper.vm.breadcrumbs).to.eql([
          { name: 'Your Forms', to: '/forms' }
        ]);
      });
    });
  });
});
