import CustomerFormPage from './CustomerFormPage';
import { shallow } from 'avoriaz';
import Vuex from 'vuex';
import sinon from 'sinon';
import Resource, { STATUS } from 'state/Resource';
import LoadingSpinner from 'components/LoadingSpinner';
import CustomerFormQuestionCard from 'components/Customer/CustomerFormQuestionCard';
import CustomerFormCompletedCard from 'components/Customer/CustomerFormCompletedCard';
import UserIsArtistWarningBanner from 'components/Customer/UserIsArtistWarningBanner';
import formsFixture from 'fixtures/forms';

describe('CustomerFormPage', function () {
  beforeEach(function () {
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
        isCompleted: state => state.isCompleted,
        isUserArtist: state => state.isUserArtist
      },
      state: Object.assign({}, {
        form: new Resource(),
        artist: this.artist,
        isCompleted: false,
        isUserArtist: false
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
      expect(wrapper.contains(CustomerFormQuestionCard)).to.be.false;
    });
  });

  describe('when loaded', function () {
    beforeEach(function () {
      storeFactory.call(this, {
        form: new Resource({
          status: STATUS.LOADED,
          value: formsFixture.basic
        })
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

    it('should not show "This is your form" banner by default', function () {
      const wrapper = factory.call(this);
      expect(wrapper.find(UserIsArtistWarningBanner)).to.have.length(0);
    });

    it('should fire submitForm when question card is complete', function () {
      const values = { 'answer0': 'Hey', 'answer1': 'Hello' };
      this.wrapper = factory.call(this);
      const questionCard = this.wrapper.first(CustomerFormQuestionCard);
      questionCard.vm.$emit('complete', values);
      expect(this.actions.submitForm).to.have.been.calledWith(
        sinon.match.object,
        { ...values, nickname: 'Anonymous', email: 'anonymous@guy.com' }
      );
    });

    describe('when user is the artist', function () {
      beforeEach(function () {
        storeFactory.call(this, {
          form: new Resource({
            status: STATUS.LOADED,
            value: formsFixture.basic
          }),
          isUserArtist: true
        });
        this.wrapper = factory.call(this);
      });

      it('should show "This is your form" banner when user is artist', function () {
        expect(this.wrapper.find(UserIsArtistWarningBanner)).to.have.length(1);
      });
    });
  });

  describe('when form is completed', function () {
    beforeEach(function () {
      storeFactory.call(this, {
        form: new Resource({
          status: STATUS.LOADED,
          value: formsFixture.basic
        }),
        isCompleted: true
      });
      this.wrapper = factory.call(this);
    });

    it('should render completed card and not question card', function () {
      expect(this.wrapper.find(CustomerFormQuestionCard)).to.have.length(0);
      const completedCard = this.wrapper.first(CustomerFormCompletedCard);
      expect(completedCard.propsData().name).to.eql(this.artist.displayName);
    });
  });
});
