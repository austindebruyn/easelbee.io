import { shallow, mount } from 'avoriaz';
import sinon from 'sinon';

import { buildOption, buildOptionAttachment } from 'fixtures/questions';
import QuestionDetailsOptions from './QuestionDetailsOptions';
import QuestionDetailsOptionsAttachment from './QuestionDetailsOptionsAttachment';
import UploadPhotoButton from './UploadPhotoButton';
import VInputText from 'components/controls/VInputText';

describe('QuestionDetailsOptions', function () {
  beforeEach(function () {
    this.options = [
      buildOption({ value: 'Sketch' }),
      buildOption({ value: 'Painting' })
    ];

    this.wrapper = shallow(QuestionDetailsOptions, {
      propsData: { options: this.options },
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
      this.options[0].id
    );
    this.wrapper.vm.$emit.reset();

    buttons[1].trigger('click');
    expect(this.wrapper.vm.$emit).to.have.been.calledWith(
      'deleteOption',
      this.options[1].id
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
      this.options[0].id,
      { isFileObject: true }
    );
    this.wrapper.vm.$emit.reset();

    buttons[1].vm.$emit('submit', { isFileObject: true });
    expect(this.wrapper.vm.$emit).to.have.been.calledWith(
      'attachFile',
      this.options[1].id,
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
      this.options = [
        buildOption({ value: 'Sketch', optionAttachment: 17 }),
        buildOption({ value: 'Painting' }),
        buildOption({ value: 'Mona Lista', optionAttachment: 99 })
      ];
      this.optionAttachments = {
        17: buildOptionAttachment({ objectKey: 'sketch-example.jpg' }),
        99: buildOptionAttachment({ objectKey: 'mona-lista-ex.jpg' })
      };

      this.wrapper = shallow(QuestionDetailsOptions, {
        propsData: { options: this.options },
        i18n: this.i18n
      });
    });

    it('should render attachment if present', function () {
      const attachments = this.wrapper.find(QuestionDetailsOptionsAttachment);
      expect(attachments).to.have.length(2);
      expect(attachments[0].propsData().optionId).to.eql(this.options[0].id);
      expect(attachments[1].propsData().optionId).to.eql(this.options[2].id);
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
        propsData: { options: this.options },
        i18n: this.i18n
      });
    });

    it('should return all inputs', function () {
      const inputs = this.wrapper.find(VInputText);
      this.fillIn(inputs[0].first('input')).with('banana');
      this.fillIn(inputs[1].first('input')).with('apple');

      expect(this.wrapper.vm.getValues()).to.eql([
        { id: this.options[0].id, value: 'banana' },
        { id: this.options[1].id, value: 'apple' }
      ]);
    });
  });

  describe('changing delta', function () {

  });
});
