import QuestionDetails from './QuestionDetails';
import VInputText from 'components/controls/VInputText';
import VCardControl from 'components/controls/VCardControl';
import { mount } from 'avoriaz';
import { buildQuestion } from 'fixtures/questions';
import sinon from 'sinon';
import Vuex from 'vuex';

describe('QuestionDetails', function () {
  beforeEach(function () {
    this.question = buildQuestion();

    this.actions = {
      updateQuestion: sinon.spy(),
      destroyQuestion: sinon.spy()
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

  it('should dispatch when form is submitted', function () {
    this.fillIn(this.wrapper.first('input')).with('How old are you?');

    this.wrapper.first('form').trigger('submit');
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
});
