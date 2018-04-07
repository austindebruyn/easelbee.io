import QuestionDetails from './QuestionDetails';
import QuestionDetailsOptions from './QuestionDetailsOptions';
import VInputText from 'components/controls/VInputText';
import VCardControl from 'components/controls/VCardControl';
import { mount } from 'avoriaz';
import { buildQuestion } from 'fixtures/questions';
import sinon from 'sinon';
import Vuex from 'vuex';
import { nextTick } from 'vue';

describe('QuestionDetails', function () {
  beforeEach(function () {
    this.question = buildQuestion();

    this.actions = {
      updateQuestion: sinon.spy(),
      destroyQuestion: sinon.spy(),
      attachFileToOption: sinon.spy()
    };
    this.store = new Vuex.Store({
      actions: this.actions
    });

    this.wrapper = mount(QuestionDetails, {
      propsData: { question: this.question },
      i18n: this.i18n,
      store: this.store
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

  it('should not render button until the form is dirty', async function () {
    expect(this.wrapper.find('button.btn.btn-primary')).to.have.length(0);
    this.wrapper.vm.dirty = true;
    await nextTick();
    expect(this.wrapper.find('button.btn.btn-primary')).to.have.length(1);
  });

  it('should dispatch when form is submitted', function () {
    this.fillIn(this.wrapper.first('input')).with('How old are you?');

    this.wrapper.first('button.btn.btn-primary').trigger('click');
    expect(this.actions.updateQuestion.args[0][1]).to.eql({
      id: this.question.id,
      title: 'How old are you?',
      type: 'string',
      options: []
    });
  });

  it('should dispatch when destroy is clicked', function () {
    const destroyButton = this.wrapper.first(VCardControl);
    destroyButton.trigger('click');

    expect(this.actions.destroyQuestion.args[0][1]).to.eql({
      id: this.question.id
    });
  });

  describe('radio questions', function () {
    beforeEach(function () {
      this.question = buildQuestion({
        title: 'Oreos?',
        type: 'radio',
        options: [{ id: 11, value: 'Cookies' }, { value: 'Creme' }]
      });
      this.wrapper = mount(QuestionDetails, {
        propsData: { question: this.question },
        i18n: this.i18n,
        store: this.store
      });
    });

    it('should render QuestionDetailsOptions', function () {
      expect(this.wrapper.find(QuestionDetailsOptions)).to.have.length(1);
    });

    it('should dispatch when add option is clicked', function () {
      this.wrapper.first(QuestionDetailsOptions).vm.$emit('addOption');

      expect(this.actions.updateQuestion.args[0][1]).to.eql({
        id: this.question.id,
        title: 'Oreos?',
        type: 'radio',
        options: [
          { value: 'Cookies' },
          { value: 'Creme' },
          { value: '' }
        ]
      });
    });

    it('should dispatch when delete option is clicked', function () {
      this.wrapper.first(QuestionDetailsOptions).vm.$emit('deleteOption', 11);

      expect(this.actions.updateQuestion.args[0][1]).to.eql({
        id: this.question.id,
        title: 'Oreos?',
        type: 'radio',
        options: [
          // Cookies is gone. It was option id 11
          { value: 'Creme' }
        ]
      });
    });

    it('should dispatch when file is attached', function () {
      const options = this.wrapper.first(QuestionDetailsOptions);
      options.vm.$emit('attachFile', 10, { isFileObject: true });
      expect(this.actions.attachFileToOption.args[0][1]).to.eql({
        id: 10,
        questionId: this.question.id,
        file: { isFileObject: true }
      });
    });
  });
});
