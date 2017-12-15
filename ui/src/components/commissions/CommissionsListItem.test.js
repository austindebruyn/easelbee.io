import CommissionsListItem from './CommissionsListItem';
import { mount } from 'avoriaz';

describe('CommissionsListItem', function () {
  it('should render text', function () {
    const wrapper = mount(CommissionsListItem, { propsData: {
      commission: {
        id: 145,
        email: 'austin@eslb.io',
        body: 'Hello there.'
      }
    }});

    expect(wrapper.first(RouterLink).propsData()).to.include({
      to: '/commissions/145'
    });

    expect(wrapper.first('.card-text h4').text()).to.include('austin@eslb.io');
    expect(wrapper.first('.card-text q').text()).to.include('Hello there.');
  });
});
