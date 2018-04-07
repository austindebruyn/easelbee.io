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
});
