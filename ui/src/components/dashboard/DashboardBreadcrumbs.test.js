import DashboardBreadcrumbs from './DashboardBreadcrumbs';
import { shallow } from 'avoriaz';

describe('DashboardBreadcrumbs', function () {
  function factory (breadcrumbs) {
    return shallow(DashboardBreadcrumbs, {
      propsData: { breadcrumbs }
    });
  }

  it('should render span if no link', function () {
    const wrapper = factory([
      { name: 'Hey' }
    ]);

    expect(wrapper.find('ol li')).to.have.length(1);
    expect(wrapper.first('ol li').text()).to.eql('Hey');
    expect(wrapper.contains(RouterLink)).to.be.false;
  });

  it('should render router-link if link', function () {
    const wrapper = factory([
      { name: 'Hey', to: '/hey' }
    ]);

    expect(wrapper.find('ol li')).to.have.length(1);
    expect(wrapper.first('ol li').text()).to.eql('Hey');
    expect(wrapper.contains(RouterLink)).to.be.true;
    expect(wrapper.first(RouterLink).propsData()).to.include({ to: '/hey' });
  });

  it('should mix', function () {
    const wrapper = factory([
      { name: 'Root', to: '/' },
      { name: 'Index' },
      { name: 'Hey', to: '/hey', active: true }
    ]);

    expect(wrapper.find('ol li')).to.have.length(3);
    expect(wrapper.find('ol li')[0].text()).to.eql('Root');
    expect(wrapper.find('ol li')[1].text()).to.eql('Index');
    expect(wrapper.find('ol li')[2].text()).to.eql('Hey');
    expect(wrapper.find(RouterLink)[0].propsData()).to.include({ to: '/' });
    expect(wrapper.find(RouterLink)[1].propsData()).to.include({ to: '/hey' });
  });
});
