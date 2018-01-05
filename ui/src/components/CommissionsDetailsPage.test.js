import CommissionsDetailsPage from './CommissionsDetailsPage';
import { mount } from 'avoriaz';
import Vuex from 'vuex';
import sinon from 'sinon';
import Resource, { STATUS } from 'state/Resource';
import CommissionDetails from 'components/commissions/CommissionDetails';
import commissionsFixture from 'fixtures/commissions';

describe('CommissionsDetailsPage', function () {
  beforeEach(function () {
    this.actions = {
      fetchCommissions: sinon.spy()
    };
  });

  afterEach(function () {
    this.actions.fetchCommissions.reset();
  });

  function storeFactory (resourceOpts = {}) {
    this.store = new Vuex.Store({
      state: {
        commissions: new Resource(resourceOpts),
        fillouts: {}
      },
      actions: this.actions
    });
  }

  describe('when not loaded', function () {
    beforeEach(function () {
      storeFactory.call(this);
    });

    it('should fetch', function () {
      mount(CommissionsDetailsPage, {
        store: this.store,
        i18n: this.i18n,
        globals: {
          $route: {
            path: '/commissions/1',
            params: { id: 1 }
          }
        }
      });

      expect(this.actions.fetchCommissions).to.have.been.called;
    });

    it('should render spinner', function () {
      const wrapper = mount(CommissionsDetailsPage, {
        store: this.store,
        i18n: this.i18n,
        globals: {
          $route: {
            path: '/commissions/1',
            params: { id: 1 }
          }
        }
      });
      expect(wrapper.find('.col-12 > .loading-container')).to.have.length(1);
      expect(wrapper.contains(CommissionDetails)).to.be.false;
      expect(wrapper.contains('.not-found')).to.be.false;
    });

    it('should have breadcrumbs', function () {
      const wrapper = mount(CommissionsDetailsPage, {
        store: this.store,
        i18n: this.i18n,
        globals: {
          $route: {
            path: '/commissions/1',
            params: { id: 1 }
          }
        }
      });

      expect(wrapper.vm.breadcrumbs).to.eql([
        { name: 'All Commissions', to: '/commissions' },
        { name: 'Commission #1' }
      ]);
    });
  });

  describe('when loaded', function () {
    beforeEach(function () {
      storeFactory.call(this, {
        status: STATUS.LOADED,
        value: [ commissionsFixture.basic ]
      });
    });

    it('should not render spinner', function () {
      const wrapper = mount(CommissionsDetailsPage, {
        store: this.store,
        i18n: this.i18n,
        globals: {
          $route: {
            path: '/commissions/1',
            params: { id: 1 }
          }
        }
      });

      expect(wrapper.find('.col-12 > .loading-container')).to.have.length(0);
      expect(wrapper.contains(CommissionDetails)).to.be.true;
      expect(wrapper.contains('.not-found')).to.be.false;

      const child = wrapper.first(CommissionDetails);
      expect(child.propsData()).to.include({
        commission: commissionsFixture.basic
      });
    });

    describe('but doesnt exist', function () {
      it('should render not found', function () {
        const wrapper = mount(CommissionsDetailsPage, {
          store: this.store,
          i18n: this.i18n,
          globals: {
            $route: {
              path: '/commissions/222',
              params: { id: 222 }
            }
          }
        });

        expect(wrapper.find('.col-12 > .loading-container')).to.have.length(0);
        expect(wrapper.contains(CommissionDetails)).to.be.false;
        expect(wrapper.contains('.not-found')).to.be.true;
      });
    });
  });
});
