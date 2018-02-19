import QuestionForm from './QuestionForm';
import { shallow } from 'avoriaz';
import { buildQuestion } from 'fixtures/questions';

describe('QuestionForm', function () {
  beforeEach(function () {
    this.question = buildQuestion();
    this.wrapper = shallow(QuestionForm, {
      propsData: { question: this.question }
    });
  });

  it('should render title', function () {
    expect(this.wrapper.first('h4').text()).to.eql(this.question.title);
  });
});
