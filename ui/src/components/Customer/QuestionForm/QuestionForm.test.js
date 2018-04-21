import QuestionForm from './QuestionForm';
import CString from './controls/CString';
import CRadio from './controls/CRadio';
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
    expect(this.wrapper.first('h2').text()).to.eql(this.question.title);
  });

  it('should render submit button with correct text', function () {
    expect(this.wrapper.first('button').text()).to.eql('Finish');

    this.wrapper = factory.call(this, { isFinalQuestion: false });
    expect(this.wrapper.first('button').text()).to.eql('Next');
  });

  describe('when question is short text', function () {
    beforeEach(function () {
      this.question = buildQuestion({ type: 'string' });
      this.wrapper = factory.call(this);
    });

    it('should render CString', function () {
      expect(this.wrapper.find(CRadio)).to.have.length(0);
      expect(this.wrapper.find(CString)).to.have.length(1);
    });

    it('should fire `submit` when form is submitted', function () {
      this.sandbox.spy(this.wrapper.vm, '$emit');
      this.wrapper.first(CString).vm.value = 'Canada';
      this.wrapper.first('form').trigger('submit');

      expect(this.wrapper.vm.$emit).to.have.been.calledWith('submit', 'Canada');
    });
  });

  describe('when question is radio', function () {
    beforeEach(function () {
      this.question = buildQuestion({ type: 'radio', options: ['apples'] });
      this.wrapper = factory.call(this);
    });

    it('should render CRadio', function () {
      expect(this.wrapper.find(CRadio)).to.have.length(1);
      expect(this.wrapper.find(CString)).to.have.length(0);
    });
  });
});
