import CustomerFormQuestionCard from './CustomerFormQuestionCard';
import QuestionForm from './QuestionForm/QuestionForm';
import { shallow } from 'avoriaz';
import { buildQuestion } from 'fixtures/questions';
import { buildForm } from 'fixtures/forms';
import { nextTick } from 'vue';
import sinon from 'sinon';

describe('CustomerFormQuestionCard', function () {
  beforeEach(function () {
    this.questions = [ buildQuestion(), buildQuestion() ];
    this.form = buildForm({
      questions: this.questions
    });
    this.wrapper = shallow(CustomerFormQuestionCard, {
      propsData: { form: this.form }
    });
    sinon.spy(this.wrapper.vm, '$emit');
  });

  it('should render a QuestionForm and pass first question', function () {
    const form = this.wrapper.first(QuestionForm);
    expect(form.propsData()).to.deep.include({
      question: this.questions[0],
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
          values: { [this.questions[0].id]: 'Whatever!' }
        });
        nextTick(() => {
          const formProps = this.wrapper.first(QuestionForm).propsData();
          expect(formProps.question).to.eql(this.questions[1]);
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
          [this.questions[1].id]: 'All done!'
        });
      });
    });
  });
});
