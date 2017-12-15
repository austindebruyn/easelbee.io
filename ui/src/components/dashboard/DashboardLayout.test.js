import DashboardLayout from './DashboardLayout';
import DashboardBreadcrumbs from './DashboardBreadcrumbs';
import { shallow } from 'avoriaz';

describe('DashboardLayout', function () {
  it('should pass breadcrumbs to dashboard-breadcrumbs', function () {
    const wrapper1 = shallow(DashboardLayout);
    expect(wrapper1.contains(DashboardBreadcrumbs)).to.be.false;

    const wrapper2 = shallow(DashboardLayout, {
      propsData: { breadcrumbs: [] }
    });
    expect(wrapper2.contains(DashboardBreadcrumbs)).to.be.true;
    expect(wrapper2.first(DashboardBreadcrumbs).propsData()).to.eql({
      breadcrumbs: []
    });
  });
});
