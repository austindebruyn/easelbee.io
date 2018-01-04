import CommissionDetails from './CommissionDetails';
import commissionsFixture from 'fixtures/commissions';
import CommissionTimeline from './CommissionTimeline';
import CommissionDetailsActions from './CommissionDetailsActions';
import { shallow } from 'avoriaz';

describe('CommissionDetails', function () {
  beforeEach(function () {
    this.wrapper = shallow(CommissionDetails, {
      propsData: {
        commission: commissionsFixture.basic
      },
      i18n: this.i18n
    });
  });

  it('should render text', function () {
    const cardText = this.wrapper.first('.commission-details .card').text();
    expect(cardText).to.contain('elon@musk.com');
  });

  it('should render children', function () {
    const timelineComponent = this.wrapper.first(CommissionTimeline);
    expect(timelineComponent.propsData()).to.include({
      commission: commissionsFixture.basic
    });

    const actionsComponent = this.wrapper.first(CommissionDetailsActions);
    expect(actionsComponent.propsData()).to.include({
      commissionId: commissionsFixture.basic.id,
      status: commissionsFixture.basic.status
    });
  });
});
