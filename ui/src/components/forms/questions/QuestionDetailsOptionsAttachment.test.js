import QuestionDetailsOptionsAttachment from './QuestionDetailsOptionsAttachment';
import { shallow } from 'avoriaz';
import { buildOption } from '../../../fixtures/questions';
import sinon from 'sinon';

describe('QuestionDetailsOptionsAttachment', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();

    this.option = buildOption({
      value: 'whatever',
      optionAttachment: {
        objectKey: 'whatever.png'
      }
    });
    this.attachment = this.option.optionAttachment;

    this.wrapper = shallow(QuestionDetailsOptionsAttachment, {
      propsData: { option: this.option },
      i18n: this.i18n
    });

    this.sandbox.spy(this.wrapper.vm, '$emit');
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('should render img', function () {
    const img = this.wrapper.first('img');
    expect(img.getAttribute('src')).to.eql(this.attachment.url);
  });

  it('should fire replace when link clicked', function () {
    const replaceLink = this.wrapper.find('.img-controls a')[0];
    expect(replaceLink.text()).to.eql('Replace Image');

    replaceLink.trigger('click');

    expect(this.wrapper.vm.$emit).to.have.been.calledWith('replace');
  });

  it('should fire delete when link clicked', function () {
    const deleteLink = this.wrapper.find('.img-controls a')[1];
    expect(deleteLink.text()).to.eql('Delete Image');

    deleteLink.trigger('click');

    expect(this.wrapper.vm.$emit).to.have.been.calledWith('delete');
  });
});
