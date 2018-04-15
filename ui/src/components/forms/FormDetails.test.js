import sinon from 'sinon';
import Vuex from 'vuex';
import merge from 'lodash.merge';
import { shallow } from 'avoriaz';
import { nextTick } from 'vue';

import * as getters from 'state/artist/getters';
import FormDetails from './FormDetails';
import FormDetailsInfoCard from './FormDetailsInfoCard';
import QuestionDetails from './questions/QuestionDetails';
import FormDetailsQuestionSelector from './FormDetailsQuestionSelector';
import { buildQuestion } from 'fixtures/questions';
import { buildForm } from 'fixtures/forms';

describe('FormDetails', function () {
  function storeFactory (state = {}) {
    return new Vuex.Store({
      state: merge({
        questions: {}
      }, state),
      actions: this.actions,
      getters
    });
  }

  beforeEach(function () {
    this.form = buildForm();

    this.actions = { createQuestion: sinon.spy() };
    this.store = storeFactory.call(this);

    this.wrapper = shallow(FormDetails, {
      propsData: { form: this.form },
      i18n: this.i18n,
      store: this.store
    });
  });

  it('should render info card', function () {
    const infoCard = this.wrapper.first(FormDetailsInfoCard);
    expect(infoCard.propsData().form).to.eql(this.form);
  });

  describe('when form has no questions', function () {
    it('should not render question card', function () {
      const infoCards = this.wrapper.find(QuestionDetails);
      expect(infoCards).to.be.empty;
    });
  });

  describe('when form has questions', function () {
    beforeEach(function () {
      this.question1 = buildQuestion({ order: 1, formId: this.form.id });
      this.question2 = buildQuestion({ order: 2, formId: this.form.id });

      this.store = storeFactory.call(this, {
        questions: {
          1: this.question1,
          2: this.question2
        }
      });

      this.form.questions = [ 1, 2 ];

      this.wrapper = shallow(FormDetails, {
        propsData: { form: this.form },
        i18n: this.i18n,
        store: this.store
      });
    });

    it('should render question selector', function () {
      const questionSelector = this.wrapper.first(FormDetailsQuestionSelector);
      expect(questionSelector.propsData()).to.eql({
        current: 1,
        total: 2
      });
    });

    it('should render question card', function () {
      const questionCard = this.wrapper.first(QuestionDetails);
      expect(questionCard.propsData().question).to.eql(this.question1);
    });

    it('should change question when selector clicked', function (done) {
      const questionSelector = this.wrapper.first(FormDetailsQuestionSelector);

      expect(this.wrapper.first(QuestionDetails).propsData()).to.eql({
        question: this.question1
      });
      questionSelector.vm.$emit('click', 2);
      expect(this.wrapper.vm.order).to.eql(2);

      nextTick(() => {
        expect(this.wrapper.first(QuestionDetails).propsData()).to.eql({
          question: this.question2
        });
        done();
      });
    });

    it('should dispatch create new question when (+) clicked', function () {
      const questionSelector = this.wrapper.first(FormDetailsQuestionSelector);

      questionSelector.vm.$emit('createClick');
      expect(this.actions.createQuestion).to.have.been.calledWith(
        sinon.match.object,
        { formId: this.form.id }
      );
    });
  });
});
