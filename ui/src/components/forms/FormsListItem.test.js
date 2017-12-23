import FormsListItem from './FormsListItem';
import { mount } from 'avoriaz';
import formsFixture from 'fixtures/forms';

describe('FormsListItem', function () {
  it('should render correct link', function () {
    const wrapper = mount(FormsListItem, {
      propsData: {
        form: formsFixture.basic
      }
    });

    const href = wrapper.first('a').getAttribute('href');
    expect(href).to.eql(formsFixture.basic.publicUrl);

    expect(wrapper.first(RouterLink).propsData()).to.include({
      to: '/forms/1'
    });
  });
});
