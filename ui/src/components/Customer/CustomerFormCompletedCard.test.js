import { shallow } from 'avoriaz';
import CustomerFormCompletedCard from 'components/Customer/CustomerFormCompletedCard';

describe('CustomerFormPage', function () {
  it('should render text', function () {
    const wrapper = shallow(CustomerFormCompletedCard, {
      propsData: { name: 'Austin' },
      i18n: this.i18n
    });
    expect(wrapper.text()).to.include('You’re all done!');
    expect(wrapper.text()).to.include('We’ve sent in your answers! Austin will take it from here.');
  });
});
