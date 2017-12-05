import LoadingSpinner from '.';
import { shallow } from 'avoriaz';

describe('LoadingSpinner', function () {
  it('should render image', function () {
    const wrapper = shallow(LoadingSpinner);
    expect(wrapper.first('img').getAttribute('src')).to.match(/\.svg$/);
  });

  it('should be centered', function () {
    const wrapper = shallow(LoadingSpinner);
    expect(wrapper.hasStyle('text-align', 'center')).to.be.true;
  });

  it('should pass size to img', function () {
    const wrapper = shallow(LoadingSpinner, { propsData: { size: 'xl' } });
    expect(wrapper.first('img').hasClass('xl')).to.be.true;
  });

  it('should default to sm', function () {
    const wrapper = shallow(LoadingSpinner);
    expect(wrapper.first('img').hasClass('sm')).to.be.true;
  });
});
