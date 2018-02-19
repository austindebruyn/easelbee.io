import CustomerFormQuestionCard from './CustomerFormQuestionCard';
import QuestionForm from './QuestionForm/QuestionForm';
import { shallow } from 'avoriaz';
import { buildQuestion } from 'fixtures/questions';
import { buildForm } from 'fixtures/forms';
import { nextTick } from 'vue';

describe.only('CustomerFormQuestionCard', function () {
  beforeEach(function () {
    this.questions = [ buildQuestion(), buildQuestion() ];
    this.form = buildForm({
      questions: this.questions
    });
    this.wrapper = shallow(CustomerFormQuestionCard, {
      propsData: { form: this.form }
    });
  });

  it('should render a QuestionForm and pass first question', function () {
    const form = this.wrapper.first(QuestionForm);
    expect(form.propsData()).to.eql({ question: this.questions[0] });
  });
  
  it('should start on the first question', function () {
    expect(this.wrapper.vm.index).to.eql(0);
  });

  it('should save answer to question and move on when press enter', function () {
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
