import NewPasswordResetPage from './NewPasswordResetPage';
import { mount } from 'avoriaz';
import { nextTick } from 'vue';
import sinon from 'sinon';
import Vuex from 'vuex';
import Resource, { STATUS } from 'state/Resource';
import VErrorList from 'components/controls/VErrorList';

function factory(opts = {}) {
  this.actions = {
    createPasswordReset: sinon.spy()
  };
  this.mutations = {
    createPasswordResetSuccess: function (state) {
      state.passwordReset.status = STATUS.LOADED;
    }
  };

  this.passwordReset = opts.passwordReset || new Resource();

  this.store = new Vuex.Store({
    state: { passwordReset: this.passwordReset },
    actions: this.actions,
    mutations: this.mutations
  });

  this.router = {
    push: sinon.spy()
  };

  this.wrapper = mount(NewPasswordResetPage, {
    store: this.store,
    i18n: this.i18n,
    globals: {
      $router: this.router
    }
  });
}

describe('NewPasswordResetPage', function () {
  beforeEach(function () {
    factory.call(this);
  });

  it('should render error list', function () {
    expect(this.wrapper.first(VErrorList).propsData()).to.include({
      resource: this.passwordReset,
      prefix: 'forgot-password.new.errors'
    });
  });

  describe('loading state', function () {
    beforeEach(function () {
      factory.call(this, {
        passwordReset: new Resource({ status: STATUS.MUTATING })
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
    const emailInput = this.wrapper.first('input[name=email]');

    this.fillIn(emailInput).with('austin@texas.com');
    this.wrapper.first('form').trigger('submit');

    expect(this.actions.createPasswordReset).to.have.been.calledOnce;
    expect(this.actions.createPasswordReset).to.have.been.calledWith(
      sinon.match.object,
      { email: 'austin@texas.com' }
    );
  });

  describe('success state', function () {
    beforeEach(function () {
      factory.call(this, {
        passwordReset: new Resource({ status: STATUS.UNLOADED })
      });
    });

    it('should redirect', function (done) {
      expect(this.router.push).to.not.have.been.called;

      this.wrapper = mount(NewPasswordResetPage, {
        i18n: this.i18n,
        store: this.store,
        globals: {
          $router: this.router
        }
      });

      this.store.commit('createPasswordResetSuccess');

      nextTick(() => {
        expect(this.router.push)
          .to.have.been.calledWith('/passwordResets/complete');
        done();
      });
    });
  });
});
