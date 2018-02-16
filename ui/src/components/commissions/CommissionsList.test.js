import CommissionsList from './CommissionsList';
import CommissionsListItem from './CommissionsListItem';
import { buildCommission } from 'fixtures/commissions';
import { shallow } from 'avoriaz';

describe('CommissionsList', function () {
  it('should render zero data', function () {
    const wrapper = shallow(CommissionsList, { propsData: {
      commissions: []
    }});

    expect(wrapper.find('.commissions-list ul')).to.have.length(0);

    const zds = wrapper.first('.commissions-list .commissions-zero-data-state');
    expect(zds.text()).to.eql('Nothing here!');
  });

  it('should render list', function () {
    const commission1 = buildCommission();
    const commission2 = buildCommission();

    const wrapper = shallow(CommissionsList, { propsData: {
      commissions: [commission1, commission2]
    }});

    expect(wrapper.find('.commissions-list ul')).to.have.length(1);
    expect(wrapper.find(CommissionsListItem)).to.have.length(2);

    const listItems = wrapper.find(CommissionsListItem);
    expect(listItems[0].propsData().commission).to.eql(commission1);
    expect(listItems[1].propsData().commission).to.eql(commission2);
  });
});
