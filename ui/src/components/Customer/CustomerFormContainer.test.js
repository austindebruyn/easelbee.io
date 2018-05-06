import { shallow } from 'avoriaz';
import { nextTick } from 'vue';
import sinon from 'sinon';
import Vuex from 'vuex';
import merge from 'lodash.merge';

import ArtistInfo from './widgets/ArtistInfo';
import CustomerFormContainer from './CustomerFormContainer';
import CustomerFormCompletedCard from './widgets/CustomerFormCompletedCard';
import QuestionForm from './QuestionForm/QuestionForm';
import { buildQuestion } from 'fixtures/questions';
import { buildForm } from 'fixtures/forms';

describe('CustomerFormContainer', function () {
  function storeFactory (state = {}) {
    return new Vuex.Store({
      state: merge({
        isCompleted: false,
        questions: {
          1: buildQuestion({ id: 1, order: 1 }),
          2: buildQuestion({ id: 2, order: 2 })
        }
      }, state),
      getters: {
        isCompleted: state => state.isCompleted
      }
    });
  }

  function factory () {
    return shallow(CustomerFormContainer, {
      propsData: { form: this.form, artist: this.artist },
      store: this.store
    });
  }

  beforeEach(function () {
    this.artist = { id: 1, displayName: 'Austin' };
  });

  describe('when form is in progress', function () {
    beforeEach(function () {
      this.store = storeFactory.call(this);
      this.form = buildForm({ questions: [1, 2] });
      this.wrapper = factory.call(this);
      sinon.spy(this.wrapper.vm, '$emit');
    });

    it('should render artist info', function () {
      const artistInfo = this.wrapper.first(ArtistInfo);
      expect(artistInfo.propsData().name).to.eql(this.artist.displayName);
    });

    it('should render a QuestionForm and pass first question', function () {
      const form = this.wrapper.first(QuestionForm);
      expect(form.propsData()).to.deep.include({
        question: this.store.state.questions[1],
        isFinalQuestion: false
      });
    });

    it('should start on the first question', function () {
      expect(this.wrapper.vm.index).to.eql(0);
    });

    describe('submitting form', function () {
      describe('when not on the final question', function () {
        it('should save answer to question and increment index', function () {
          this.wrapper.first(QuestionForm).vm.$emit('submit', 'Whatever!');
          expect(this.wrapper.vm).to.deep.include({
            index: 1,
            values: {
              [`question_${this.store.state.questions[1].id}`]: 'Whatever!'
            }
          });
          nextTick(() => {
            const formProps = this.wrapper.first(QuestionForm).propsData();
            expect(formProps.question).to.eql(this.store.state.questions[2]);
          });
        });
      });

      describe('when on the final question', function () {
        beforeEach(function () {
          this.wrapper.vm.index = 2;
          return nextTick();
        });

        it('should pass `isFinalQuestion`', function () {
          const form = this.wrapper.first(QuestionForm);
          expect(form.propsData()).to.deep.include({ isFinalQuestion: true });
        });

        it('should fire complete with all values', function () {
          const question1key = `question_${this.store.state.questions[1].id}`;
          const question2key = `question_${this.store.state.questions[2].id}`;
          this.wrapper.setData({
            values: {
              [question1key]: 'cool',
              [question2key]: 'beans'
            }
          });
          this.wrapper.first(QuestionForm).vm.$emit('submit', {
            nickname: 'Jason',
            email: 'whatever@jas.on'
          });
          expect(this.wrapper.vm.$emit).to.have.been.calledWith('complete', {
            nickname: 'Jason',
            email: 'whatever@jas.on',
            [question1key]: 'cool',
            [question2key]: 'beans'
          });
        });
      });
    });
  });

  describe('when form is completed', function () {
    beforeEach(function () {
      this.store = storeFactory.call(this, {
        isCompleted: true
      });
      this.wrapper = factory.call(this);
    });

    it('should render completed card', function () {
      const completedCard = this.wrapper.first(CustomerFormCompletedCard);
      expect(completedCard.propsData().name).to.eql(this.artist.displayName);
    });
  });
});
