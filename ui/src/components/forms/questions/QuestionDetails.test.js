import QuestionDetails from './QuestionDetails';
import VInputText from 'components/controls/VInputText';
import { shallow } from 'avoriaz';
import { buildQuestion } from 'fixtures/questions';

describe('QuestionDetails', function () {
  beforeEach(function () {
    this.question = buildQuestion();

    this.wrapper = shallow(QuestionDetails, {
      propsData: { question: this.question },
      i18n: this.i18n
    });
  });

  it('should render editable title', function () {
    const input = this.wrapper.first(VInputText);
    expect(input.propsData()).to.include({
      kind: 'madlibs',
      size: 'lg',
      defaultValue: this.question.title
    });
  });
});
