import { shallow } from 'avoriaz';
import sinon from 'sinon';
import Vuex from 'vuex';

import CommissionPriceCounter from 'components/Customer/CommissionPriceCounter';
import PriceCalculator from 'logic/PriceCalculator';
import { buildQuestion, buildOption } from 'fixtures/questions';

describe('CommissionPriceCounter', function () {
  function factory (props = {}) {
    return shallow(CommissionPriceCounter, {
      propsData: {
        values: props.values || {}
      },
      i18n: this.i18n,
      store: this.store
    });
  }

  beforeEach(function () {
    this.options = { 1: buildOption() };
    this.questions = { 1: buildQuestion() };
    this.store = new Vuex.Store({
      state: {
        options: this.options,
        questions: this.questions
      }
    });
    this.sandbox = sinon.sandbox.create();
    this.sandbox.stub(PriceCalculator.prototype, 'calculate')
      .onFirstCall().returns(17)
      .onSecondCall().returns(30);
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('should render 17', function () {
    const wrapper = factory.call(this);
    expect(wrapper.text()).to.eql('$17');
  });

  it('should call price calculator with options and questions', async function () {
    factory.call(this, { values: { question_1: 1 } });

    expect(PriceCalculator.prototype.calculate).to.have.been.calledWith(
      this.questions,
      this.options,
      { question_1: 1 }
    );
  });

  it('should call price calculator to update', async function () {
    expect(PriceCalculator.prototype.calculate).to.not.have.been.called;
    const wrapper = factory.call(this);

    wrapper.setProps({ values: { question_1: 'new value' } });
    expect(PriceCalculator.prototype.calculate).to.have.been.calledTwice;
    expect(wrapper.text()).to.eql('$30');
  });
});
