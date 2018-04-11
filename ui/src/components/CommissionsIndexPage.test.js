import { mount } from 'avoriaz';
import Vuex from 'vuex';
import sinon from 'sinon';

import * as getters from 'state/getters';
import CommissionsIndexPage from './CommissionsIndexPage';
import LoadingSpinner from 'components/LoadingSpinner';
import CommissionsList from 'components/commissions/CommissionsList';
import commissionsFixture from 'fixtures/commissions';

describe('CommissionsIndexPage', function () {
  beforeEach(function () {
    this.actions = {
      fetchCommissions: sinon.spy()
    };
  });

  afterEach(function () {
    this.actions.fetchCommissions.reset();
  });

  function storeFactory ({ mutating = false, errored = false, commissions = null } = {}) {
    this.store = new Vuex.Store({
      state: {
        meta: {
          commissions: { mutating, errored }
        },
        commissions
      },
      getters,
      actions: this.actions
    });
  }

  describe('when not loaded', function () {
    beforeEach(function () {
      storeFactory.call(this);
    });

    it('should fetch', function () {
      mount(CommissionsIndexPage, { store: this.store, i18n: this.i18n });

      expect(this.actions.fetchCommissions).to.have.been.called;
    });

    it('should render spinner', function () {
      storeFactory.call(this, { mutating: true });
      const wrapper = mount(CommissionsIndexPage, {
        store: this.store,
        i18n: this.i18n
      });
      expect(wrapper.contains(LoadingSpinner)).to.be.true;
      expect(wrapper.contains(CommissionsList)).to.be.false;
    });

    it('should have breadcrumbs', function () {
      const wrapper = mount(CommissionsIndexPage, {
        store: this.store,
        i18n: this.i18n
      });

      expect(wrapper.vm.breadcrumbs).to.eql([
        { name: 'All Commissions' }
      ]);
    });
  });

  describe('when loaded', function () {
    beforeEach(function () {
      storeFactory.call(this, {
        commissions: [
          commissionsFixture.inprogress,
          commissionsFixture.basic,
          commissionsFixture.long
        ]
      });
    });

    it('should not render spinner', function () {
      const wrapper = mount(CommissionsIndexPage, {
        store: this.store,
        i18n: this.i18n
      });

      expect(wrapper.contains(LoadingSpinner)).to.be.false;
      expect(wrapper.contains(CommissionsList)).to.be.true;
      expect(wrapper.contains('.not-found')).to.be.false;
    });

    it('should render lists by status', function () {
      const wrapper = mount(CommissionsIndexPage, {
        store: this.store,
        i18n: this.i18n
      });

      const lists = wrapper.find(CommissionsList);

      expect(lists).to.have.length(2);

      expect(lists[0].propsData()).to.eql({
        commissions: [commissionsFixture.inprogress]
      });

      expect(lists[1].propsData()).to.eql({
        commissions: [commissionsFixture.basic, commissionsFixture.long]
      });
    });
  });
});
