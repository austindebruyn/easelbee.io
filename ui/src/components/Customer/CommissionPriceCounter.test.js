import { shallow } from 'avoriaz';
import { buildForm } from 'fixtures/forms';
import CommissionPriceCounter from 'components/Customer/CommissionPriceCounter';
import PriceCalculator from 'logic/PriceCalculator';
import sinon from 'sinon';

describe('CommissionPriceCounter', function () {
  function factory (props = {}) {
    return shallow(CommissionPriceCounter, {
      propsData: {
        form: props.form || buildForm(),
        values: props.values || {}
      },
      i18n: this.i18n
    });
  }

  beforeEach(function () {
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

  it('should call price calculator to update', async function () {
    expect(PriceCalculator.prototype.calculate).to.not.have.been.called;
    const wrapper = factory.call(this);

    wrapper.setProps({ values: { question_1: 'new value' } });
    expect(PriceCalculator.prototype.calculate).to.have.been.calledTwice;
    expect(wrapper.text()).to.eql('$30');
  });
});
