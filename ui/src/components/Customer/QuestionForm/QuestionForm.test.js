import QuestionForm from './QuestionForm';
import CString from './controls/CString';
import { shallow } from 'avoriaz';
import { buildQuestion } from 'fixtures/questions';
import sinon from 'sinon';

describe('QuestionForm', function () {
  function factory (props = {}) {
    return shallow(QuestionForm, {
      propsData: {
        isFinalQuestion: true,
        question: this.question,
        ...props
      },
      i18n: this.i18n
    });
  }

  beforeEach(function () {
    this.question = buildQuestion();
    this.wrapper = factory.call(this);
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('should render title', function () {
    expect(this.wrapper.first('h4').text()).to.eql(this.question.title);
  });

  it('should render submit button with correct text', function () {
    expect(this.wrapper.first('button').text()).to.eql('Finish');

    this.wrapper = factory.call(this, { isFinalQuestion: false });
    expect(this.wrapper.first('button').text()).to.eql('Next');
  });

  it('should fire `submit` when form is submitted', function () {
    this.sandbox.spy(this.wrapper.vm, '$emit');
    this.wrapper.first(CString).vm.value = 'Canada';
    this.wrapper.first('form').trigger('submit');

    expect(this.wrapper.vm.$emit).to.have.been.calledWith('submit', 'Canada');
  });
});
