import { shallow } from 'avoriaz';
import Vuex from 'vuex';
import sinon from 'sinon';

import CustomerFormPage from './CustomerFormPage';
import LoadingSpinner from 'components/LoadingSpinner';
import CustomerFormContainer from 'components/Customer/CustomerFormContainer';
import UserIsArtistWarningBanner from 'components/Customer/UserIsArtistWarningBanner';
import { buildForm } from 'fixtures/forms';

describe('CustomerFormPage', function () {
  beforeEach(function () {
    this.form = buildForm();
    this.actions = {
      fetchForm: sinon.spy(),
      submitForm: sinon.spy()
    };
  });

  afterEach(function () {
    this.actions.fetchForm.reset();
  });

  function storeFactory (state = {}) {
    this.artist = { id: 1, displayName: 'Austin' };
    this.store = new Vuex.Store({
      getters: {
        isUserArtist: state => state.isUserArtist,
        isFormLoaded: state => state.isFormLoaded
      },
      state: Object.assign({}, {
        meta: {
          form: { mutating: false, errored: false }
        },
        form: null,
        artist: this.artist,
        isUserArtist: false,
        isFormLoaded: false
      }, state),
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
      expect(wrapper.contains(CustomerFormContainer)).to.be.false;
    });
  });

  describe('when loaded', function () {
    beforeEach(function () {
      storeFactory.call(this, {
        form: this.form,
        isFormLoaded: true
      });
    });

    it('should not render spinner', function () {
      const wrapper = factory.call(this);

      expect(wrapper.contains(LoadingSpinner)).to.be.false;
      expect(wrapper.contains(CustomerFormContainer)).to.be.true;
      expect(wrapper.contains('.not-found')).to.be.false;

      const child = wrapper.first(CustomerFormContainer);
      expect(child.propsData()).to.eql({
        form: this.form,
        artist: this.artist
      });
    });

    it('should not show "This is your form" banner by default', function () {
      const wrapper = factory.call(this);
      expect(wrapper.find(UserIsArtistWarningBanner)).to.have.length(0);
    });

    it('should fire submitForm when question card is complete', function () {
      const values = { 'answer0': 'Hey', 'answer1': 'Hello' };
      this.wrapper = factory.call(this);
      const questionCard = this.wrapper.first(CustomerFormContainer);
      questionCard.vm.$emit('complete', values);
      expect(this.actions.submitForm).to.have.been.calledWith(
        sinon.match.object,
        { ...values, nickname: 'Anonymous', email: 'anonymous@guy.com' }
      );
    });

    describe('when user is the artist', function () {
      beforeEach(function () {
        storeFactory.call(this, {
          form: this.form,
          isFormLoaded: true,
          isUserArtist: true
        });
        this.wrapper = factory.call(this);
      });

      it('should show "This is your form" banner when user is artist', function () {
        expect(this.wrapper.find(UserIsArtistWarningBanner)).to.have.length(1);
      });
    });
  });
});
