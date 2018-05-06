import CString from '../controls/CString';
import SGatherUserDetails from './SGatherUserDetails';
import { shallow, mount } from 'avoriaz';

describe('SGatherUserDetails', function () {
  it('should render two inputs', function () {
    const wrapper = shallow(SGatherUserDetails, { i18n: this.i18n });
    expect(wrapper.find(CString)).to.have.length(2);
    expect(wrapper.find(CString)[0].propsData().id).to.eql('email');
    expect(wrapper.find(CString)[1].propsData().id).to.eql('nickname');
  });

  describe('#getValues', function () {
    it('should return values', function () {
      const wrapper = mount(SGatherUserDetails, { i18n: this.i18n });
      wrapper.find(CString)[0].vm.setValue('guy@ok.com');
      wrapper.find(CString)[1].vm.setValue('Guy OK');
      expect(wrapper.vm.getValues()).to.eql({
        email: 'guy@ok.com',
        nickname: 'Guy OK'
      });
    });
  });
});
