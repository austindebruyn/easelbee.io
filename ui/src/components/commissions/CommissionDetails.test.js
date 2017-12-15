import CommissionDetails from './CommissionDetails';
import { shallow } from 'avoriaz';

describe('CommissionDetails', function () {
  it('should render text', function () {
    const wrapper = shallow(CommissionDetails, { propsData: {
      commission: {
        id: 1,
        email: 'austin@easelbee.io',
        body: 'Hello there.'
      }
    }});

    const titleText = wrapper.first('.commission-details > h1').text();
    expect(titleText).to.contain('Commission #1');

    const cardText = wrapper.first('.commission-details').text();
    expect(cardText).to.contain('From: austin@easelbee.io');
    expect(cardText).to.contain('Hello there.');
  });
});
