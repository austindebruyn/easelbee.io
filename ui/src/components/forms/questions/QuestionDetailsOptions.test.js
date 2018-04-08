import QuestionDetailsOptions from './QuestionDetailsOptions';
import QuestionDetailsOptionsAttachment from './QuestionDetailsOptionsAttachment';
import UploadPhotoButton from './UploadPhotoButton';
import VInputText from 'components/controls/VInputText';
import { shallow, mount } from 'avoriaz';
import { buildQuestion } from 'fixtures/questions';
import sinon from 'sinon';

describe('QuestionDetailsOptions', function () {
  beforeEach(function () {
    this.question = buildQuestion({
      type: 'radio',
      options: [
        { value: 'Sketch' },
        { value: 'Painting' }
      ]
    });

    this.wrapper = shallow(QuestionDetailsOptions, {
      propsData: { question: this.question },
      i18n: this.i18n
    });

    this.sandbox = sinon.sandbox.create();
    this.sandbox.spy(this.wrapper.vm, '$emit');
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('should render an input for each option', function () {
    const inputs = this.wrapper.find(VInputText);
    expect(inputs).to.have.length(2);
    expect(inputs[0].propsData()).include({ defaultValue: 'Sketch' });
    expect(inputs[1].propsData()).include({ defaultValue: 'Painting' });
  });

  it('should render link to add an option', function () {
    const link = this.wrapper.first('.question-details-options > a');
    link.trigger('click');

    expect(this.wrapper.vm.$emit).to.have.been.calledWith('addOption');
  });

  it('should render a delete button for each option', function () {
    const buttons = this.wrapper.find('button.delete-option-button');
    expect(buttons).to.have.length(2);
  });

  it('should emit delete when delete button is clicked', function () {
    const buttons = this.wrapper.find('button.delete-option-button');

    buttons[0].trigger('click');
    expect(this.wrapper.vm.$emit).to.have.been.calledWith(
      'deleteOption',
      this.question.options[0].id
    );
    this.wrapper.vm.$emit.reset();

    buttons[1].trigger('click');
    expect(this.wrapper.vm.$emit).to.have.been.calledWith(
      'deleteOption',
      this.question.options[1].id
    );
  });

  it('should render an upload button for each option', function () {
    const buttons = this.wrapper.find(UploadPhotoButton);
    expect(buttons).to.have.length(2);
  });

  it('should emit attachFile when upload photo button is submitted', function () {
    const buttons = this.wrapper.find(UploadPhotoButton);

    buttons[0].vm.$emit('submit', { isFileObject: true });
    expect(this.wrapper.vm.$emit).to.have.been.calledWith(
      'attachFile',
      this.question.options[0].id,
      { isFileObject: true }
    );
    this.wrapper.vm.$emit.reset();

    buttons[1].vm.$emit('submit', { isFileObject: true });
    expect(this.wrapper.vm.$emit).to.have.been.calledWith(
      'attachFile',
      this.question.options[1].id,
      { isFileObject: true }
    );
  });

  it('should emit change when keys are typed', function () {
    const input = this.wrapper.first(VInputText);
    input.vm.$emit('keyup');
    expect(this.wrapper.vm.$emit).to.have.been.calledWith('change');
  });

  it('should render no attachment if not present', function () {
    const attachments = this.wrapper.find(QuestionDetailsOptionsAttachment);
    expect(attachments).to.have.length(0);
  });

  describe('when attachments are present', function () {
    beforeEach(function () {
      this.question = buildQuestion({
        type: 'radio',
        options: [
          { value: 'Sketch', optionAttachment: { objectKey: 'sketch-example.jpg' } },
          { value: 'Painting' },
          { value: 'Mona Lista', optionAttachment: { objectKey: 'mona-lista-ex.png' } }
        ]
      });

      this.wrapper = shallow(QuestionDetailsOptions, {
        propsData: { question: this.question },
        i18n: this.i18n
      });
    });

    it('should render attachment if present', function () {
      const attachments = this.wrapper.find(QuestionDetailsOptionsAttachment);
      expect(attachments).to.have.length(2);
      expect(attachments[0].propsData().option).to.eql(this.question.options[0]);
      expect(attachments[1].propsData().option).to.eql(this.question.options[2]);
    });

    it('should handle attachment replace link click as an upload', function () {
      const uploadPhotoButton = this.wrapper.find(UploadPhotoButton)[0];
      uploadPhotoButton.vm.handleClick = sinon.spy();

      const attachment = this.wrapper.find(QuestionDetailsOptionsAttachment)[0];

      expect(uploadPhotoButton.vm.handleClick).to.not.have.been.called;
      attachment.vm.$emit('replace');
      expect(uploadPhotoButton.vm.handleClick).to.have.been.called;
    });
  });

  describe('#getValues', function () {
    beforeEach(function () {
      this.wrapper = mount(QuestionDetailsOptions, {
        propsData: { question: this.question },
        i18n: this.i18n
      });
    });

    it('should return all inputs', function () {
      const inputs = this.wrapper.find(VInputText);
      this.fillIn(inputs[0].first('input')).with('banana');
      this.fillIn(inputs[1].first('input')).with('apple');

      expect(this.wrapper.vm.getValues()).to.eql([
        { value: 'banana' },
        { value: 'apple' }
      ]);
    });
  });

  describe('changing delta', function () {

  });
});
