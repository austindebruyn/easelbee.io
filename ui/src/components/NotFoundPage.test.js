import NotFoundPage from './NotFoundPage';
import { shallow } from 'avoriaz';

describe('NotFoundPage', function () {
  it('should render text', function () {
    const wrapper = shallow(NotFoundPage, { i18n: this.i18n });

    expect(wrapper.text()).to.contain('Error 404');
    expect(wrapper.text()).to.contain("That page wasn't found!");
  });
});
