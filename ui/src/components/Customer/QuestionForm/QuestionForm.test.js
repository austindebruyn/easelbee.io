import QuestionForm from './QuestionForm';
import { shallow } from 'avoriaz';
import { buildQuestion } from 'fixtures/questions';

describe('QuestionForm', function () {
  function factory (props = {}) {
    return shallow(QuestionForm, {
      propsData: Object.assign({}, {
        isFinalQuestion: true,
        question: this.question
      }, props),
      i18n: this.i18n
    });
  }

  beforeEach(function () {
    this.question = buildQuestion();
    this.wrapper = factory.call(this);
  });

  it('should render title', function () {
    expect(this.wrapper.first('h4').text()).to.eql(this.question.title);
  });

  it('should render submit button with correct text', function () {
    expect(this.wrapper.first('button').text()).to.eql('Finish');

    this.wrapper = factory.call(this, { isFinalQuestion: false });
    expect(this.wrapper.first('button').text()).to.eql('Next');
  });
});
