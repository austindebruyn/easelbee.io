import CommissionDetails from './CommissionDetails';
import { shallow } from 'avoriaz';
import commissionsFixture from 'fixtures/commissions';

describe('CommissionDetails', function () {
  it('should render text', function () {
    const wrapper = shallow(CommissionDetails, {
      propsData: {
        commission: commissionsFixture.basic
      },
      i18n: this.i18n
    });

    const titleText = wrapper.first('.commission-details > h1').text();
    expect(titleText).to.contain('Commission #1');

    const cardText = wrapper.first('.commission-details').text();
    expect(cardText).to.contain('From: elon@musk.com');
    expect(cardText).to.contain('Draw me a tesla.');
  });
});
