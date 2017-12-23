import DashboardNavbar from './DashboardNavbar';
import { shallow } from 'avoriaz';

describe('DashboardNavbar', function () {
  it('should render', function () {
    const wrapper = shallow(DashboardNavbar);

    expect(wrapper.find('.dashboard-navbar')).to.have.length(1);
  });
});
