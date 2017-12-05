import NotFoundPage from './NotFoundPage';
import { shallow } from 'avoriaz';

describe('NotFoundPage', function () {
  it('should render text', function () {
    const wrapper = shallow(NotFoundPage);

    expect(wrapper.text()).to.contain('Error 404');
    expect(wrapper.text()).to.contain("This page doesn't exist!");
  });
});
