import { shallow } from 'avoriaz';
import { nextTick } from 'vue';
import sinon from 'sinon';
import Vuex from 'vuex';

import CustomerFormQuestionCard from './CustomerFormQuestionCard';
import QuestionForm from './QuestionForm/QuestionForm';
import { buildQuestion } from 'fixtures/questions';
import { buildForm } from 'fixtures/forms';

describe('CustomerFormQuestionCard', function () {
  beforeEach(function () {
    this.store = new Vuex.Store({
      state: {
        questions: {
          1: buildQuestion({ id: 1, order: 1 }),
          2: buildQuestion({ id: 2, order: 2 })
        }
      }
    });
    this.form = buildForm({ questions: [1, 2] });
    this.wrapper = shallow(CustomerFormQuestionCard, {
      propsData: { form: this.form },
      store: this.store
    });
    sinon.spy(this.wrapper.vm, '$emit');
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
          values: { [`question_${this.store.state.questions[1].id}`]: 'Whatever!' }
        });
        nextTick(() => {
          const formProps = this.wrapper.first(QuestionForm).propsData();
          expect(formProps.question).to.eql(this.store.state.questions[2]);
        });
      });
    });

    describe('when on the final question', function () {
      beforeEach(function () {
        this.wrapper.vm.index = 1;
        return nextTick();
      });

      it('should pass `isFinalQuestion`', function () {
        const form = this.wrapper.first(QuestionForm);
        expect(form.propsData()).to.deep.include({ isFinalQuestion: true });
      });

      it('should fire complete with all values', function () {
        this.wrapper.first(QuestionForm).vm.$emit('submit', 'All done!');
        expect(this.wrapper.vm.$emit).to.have.been.calledWith('complete', {
          [`question_${this.store.state.questions[2].id}`]: 'All done!'
        });
      });
    });
  });
});
