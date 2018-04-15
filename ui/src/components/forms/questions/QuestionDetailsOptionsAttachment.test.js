import { shallow } from 'avoriaz';
import sinon from 'sinon';
import Vuex from 'vuex';

import * as getters from 'state/artist/getters';
import QuestionDetailsOptionsAttachment from './QuestionDetailsOptionsAttachment';
import { buildOption, buildOptionAttachment } from '../../../fixtures/questions';

describe('QuestionDetailsOptionsAttachment', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();

    this.optionAttachment = buildOptionAttachment({
      objectKey: 'whatever.png'
    });
    this.option = buildOption({
      value: 'whatever',
      optionAttachment: this.optionAttachment.id
    });

    this.store = new Vuex.Store({
      state: {
        options: {
          [this.option.id]: this.option
        },
        optionAttachments: {
          [this.optionAttachment.id]: this.optionAttachment
        }
      },
      getters
    });

    this.wrapper = shallow(QuestionDetailsOptionsAttachment, {
      propsData: { optionId: this.option.id },
      i18n: this.i18n,
      store: this.store
    });

    this.sandbox.spy(this.wrapper.vm, '$emit');
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('should render img', function () {
    const img = this.wrapper.first('img');
    expect(img.getAttribute('src')).to.eql(this.optionAttachment.url);
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
