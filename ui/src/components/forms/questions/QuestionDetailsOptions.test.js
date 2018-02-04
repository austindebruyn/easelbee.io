import QuestionDetailsOptions from './QuestionDetailsOptions';
import VInputText from 'components/controls/VInputText';
import { shallow, mount } from 'avoriaz';
import { buildQuestion } from 'fixtures/questions';
import sinon from 'sinon';
import Vuex from 'vuex';

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

  it('should emit change when keys are typed', function () {
    const input = this.wrapper.first(VInputText);
    input.vm.$emit('keyup');
    expect(this.wrapper.vm.$emit).to.have.been.calledWith('change');
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
  })
});
