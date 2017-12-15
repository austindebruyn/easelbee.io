import CompletePasswordResetPage from './CompletePasswordResetPage';
import { mount } from 'avoriaz';
import { nextTick } from 'vue';
import sinon from 'sinon';
import Vuex from 'vuex';
import Resource, { STATUS } from 'state/Resource';
import VErrorList from 'components/controls/VErrorList';

function factory (opts = {}) {
  this.mutations = {
    loginSuccess: sinon.spy(),
    completePasswordResetSuccess: function (state) {
      state.completePasswordReset.status = STATUS.LOADED;
    }
  };
  this.actions = {
    completePasswordReset: sinon.spy()
  };
  this.completePasswordReset = opts.completePasswordReset || new Resource();
  this.store = new Vuex.Store({
    state: { completePasswordReset: this.completePasswordReset },
    mutations: this.mutations,
    actions: this.actions
  });
  this.router = {
    query: '',
    push: sinon.spy()
  };
  this.wrapper = mount(CompletePasswordResetPage, {
    store: this.store,
    i18n: this.i18n,
    globals: {
      $route: {
        path: '/passwordResets/complete',
        query: { code: 'apples' }
      },
      $router: this.router
    }
  });
}

describe('CompletePasswordResetPage', function () {
  beforeEach(function () {
    factory.call(this);
  });

  it('should render element with code from query param', function () {
    expect(this.wrapper.vm.code).to.eql('apples');

    nextTick().then(() => {
      const { value } = this.wrapper.first('input[name=code]').element;
      expect(value).to.eql('apples');
    });
  });

  it('should render error list', function () {
    expect(this.wrapper.first(VErrorList).propsData()).to.include({
      resource: this.completePasswordReset,
      prefix: 'forgot-password.complete.errors'
    });
  });

  describe('loading state', function () {
    beforeEach(function () {
      factory.call(this, {
        completePasswordReset: new Resource({ status: STATUS.MUTATING })
      });
    });

    it('disabled all inputs', function () {
      function shouldBeDisabled(input) {
        expect(input.element.getAttribute('disabled')).to.eql('disabled');
      }
      this.wrapper.find('input').forEach(shouldBeDisabled);
      this.wrapper.find('button').forEach(shouldBeDisabled);
      this.wrapper.find('a').forEach(shouldBeDisabled);
    });
  });

  it('should dispatch on form submit', function () {
    this.fillIn(this.wrapper.first('input[name=code]')).with('ksdjflsadfj');
    this.fillIn(this.wrapper.first('input[name=password]')).with('naples2');
    this.fillIn(this.wrapper.first('input[name=password2]')).with('naples2');
    this.wrapper.first('form').trigger('submit');

    expect(this.actions.completePasswordReset).to.have.been.calledOnce;
    expect(this.actions.completePasswordReset).to.have.been.calledWith(
      sinon.match.object,
      {
        code: 'ksdjflsadfj',
        password: 'naples2',
        password2: 'naples2'
      }
    );
  });

  describe('success state', function () {
    beforeEach(function () {
      factory.call(this, {
        completePasswordReset: new Resource({ status: STATUS.UNLOADED })
      });
    });

    it('should redirect', function (done) {
      expect(this.router.push).to.not.have.been.called;

      this.wrapper = mount(CompletePasswordResetPage, {
        i18n: this.i18n,
        store: this.store,
        globals: {
          $router: this.router
        }
      });

      this.store.commit('completePasswordResetSuccess');

      nextTick(() => {
        expect(this.router.push).to.have.been.calledWith('/commissions');
        done();
      });
    });
  });
});
