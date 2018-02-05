import VLink from './VLink';
import { shallow } from 'avoriaz';

describe('VLink', function () {
  describe('when `to` prop', function () {
    it('should render a RouterLink', function () {
      const wrapper = shallow(VLink, { propsData: { to: '/apple' } });
      expect(wrapper.find('a')).to.be.empty;

      const routerLink = wrapper.first(RouterLink);
      expect(routerLink.propsData()).to.include({
        to: '/apple'
      });
      expect(routerLink.hasClass('disabled')).to.be.false;
      expect(routerLink.hasAttribute('event')).to.be.false;
    });

    it('should render a disabled RouterLink', function () {
      const wrapper = shallow(VLink, {
        propsData: { to: '/apple', disabled: true }
      });

      const routerLink = wrapper.first(RouterLink);
      expect(routerLink.propsData()).to.include({
        to: '/apple'
      });
      expect(routerLink.hasClass('disabled')).to.be.true;
      expect(routerLink.getAttribute('event')).to.eql('');
    });
  });

  describe('when `href` prop', function () {
    it('should render an <a />', function () {
      const wrapper = shallow(VLink, { propsData: { href: 'apple.com' } });
      expect(wrapper.find(RouterLink)).to.be.empty;

      const anchor = wrapper.first('a');
      expect(anchor.getAttribute('href')).to.eql('javascript:;');
    });
  });
});
