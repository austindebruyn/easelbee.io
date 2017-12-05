import VerifyEmailPage from '.';
import { mount } from 'avoriaz';
import { nextTick } from 'vue';
import email_preferences_fixture from 'fixtures/email_preferences';
import users_fixture from 'fixtures/users';
import sinon from 'sinon';
import Vuex from 'vuex';

describe('verify-email-page', function () {
  beforeEach(function () {
    sinon.stub(Toaster, 'create');
    this.mutations = {
      set_email_preferences: sinon.spy(),
      set_user(state, user) { return state.user = user; }
    };
    return this.store = new Vuex.Store({
      state: {},
      mutations: this.mutations
    });
  });

  afterEach(() => Toaster.create.restore());

  it('should render element', function () {
    const wrapper = mount(VerifyEmailPage, { store: this.store, globals: {
      $route: {
        path: '/passwordResets/complete',
        query: ({verificationCode: 'apples'})
      }
    }
  }
    );
    expect(wrapper.vm.verificationCode).to.eql('apples');
    return nextTick().then(function () {
      const code_input = wrapper.first('input[name=verificationCode]');
      return expect(code_input.element.value).to.eql('apples');
    });
  });

  describe('loading state', function () {
    beforeEach(function () {
      this.wrapper = mount(VerifyEmailPage);
      this.wrapper.setData({loading: true});
      return nextTick();
    });
    
    return it('disabled all inputs', function () {
      this.wrapper.find('input').forEach(function (input) {
        if (input.element.getAttribute('type') === 'hidden') { return; }
        return expect(input.element.getAttribute('disabled')).to.eql('disabled');
      });
      this.wrapper.find('button').forEach(input => expect(input.element.getAttribute('disabled')).to.eql('disabled'));
      return this.wrapper.find('a').forEach(input => expect(input.element.getAttribute('disabled')).to.eql('disabled'));
    });
  });

  return describe('form submission', function () {
    beforeEach(function () {
      this.router = {
        query: '',
        push: sinon.spy()
      };
      this.wrapper = mount(VerifyEmailPage, { store: this.store, globals: {
        $router: this.router
      }
    }
      );
      this.fill_in(this.wrapper.first('input[name=verificationCode]')).with('blep');
      return this.wrapper.first('form').trigger('submit');
    });

    it('should submit', function () {
      expect(this.fetches.first).to.include({
        url: '/api/users/me/emailPreferences',
        method: 'PATCH'
      });
      expect(this.fetches.first.headers).to.eql({
        Accept: 'application/json',
        'Content-Type': 'application/json'
      });
      return expect(this.fetches.first.body).to.eql({
        action: 'verify',
        verificationCode: 'blep'
      });
    });
    
    it('should set loading state', function () {
      return expect(this.wrapper.vm.loading).to.be.true;
    });

    describe('on success', function () {
      const respond = () =>
        beforeEach(function (done) {
          this.fetches.first.respond_with({
            body: {
              ok: true,
              record: email_preferences_fixture.verified
            }
          });
          return setImmediate(done);
        })
      ;
      
      describe('when logged in', function () {
        beforeEach(function () {
          this.store.commit('set_user', users_fixture.austin);
          return nextTick();
        });
        
        respond();

        it('should turn off loading state', function () {
          return expect(this.wrapper.vm.loading).to.be.false;
        });

        it('should create toast', function () {
          const message = 'Thanks for verifying your email.';
          return expect(Toaster.create).to.have.been
            .calledWith('success', message, 'Success!');
        });

        return it('should redirect to dashboard', function () {
          return expect(this.router.push).to.have.been.calledWith('/dashboard');
        });
      });

      return describe('when not logged in', function () {
        respond();

        it('should turn off loading state', function () {
          return expect(this.wrapper.vm.loading).to.be.false;
        });

        it('should redirect to login', function () {
          return expect(this.router.push).to.have.been.calledWith('/');
        });

        return it('should create toast', function () {
          const message = 'Thanks for verifying your email. Please log in now.';
          return expect(Toaster.create).to.have.been
            .calledWith('success', message, 'Success!');
        });
      });
    });

    describe('on server error', function () {
      beforeEach(function (done) {
        this.fetches.first.respond_with({
          body: {
            ok: false
          }
        });
        return setImmediate(done);
      });

      it('should turn off loading state', function () {
        return expect(this.wrapper.vm.loading).to.be.false;
      });

      return it('should create toast', () =>
        expect(Toaster.create).to.have.been
          .calledWith('danger', 'Something went wrong!')
      );
    });

    return describe('on client error', function () {
      beforeEach(function (done) {
        this.fetches.first.respond_with({
          body: {
            ok: false,
            errors: [({ code: 'BAD_CODE' })]
          }});
        return setImmediate(done);
      });

      it('should turn off loading state', function () {
        return expect(this.wrapper.vm.loading).to.be.false;
      });

      return it('should create toast', () =>
        expect(Toaster.create).to.have.been
          .calledWith('danger', 'This link is invalid or has expired.')
      );
    });
  });
});
