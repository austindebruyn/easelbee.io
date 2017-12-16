import FormDetails from './FormDetails';
import { shallow } from 'avoriaz';
import formsFixture from 'fixtures/forms';

describe('FormDetails', function () {
  it('should render text', function () {
    const wrapper = shallow(FormDetails, {
      propsData: {
        form: formsFixture.basic
      },
      i18n: this.i18n
    });

    const titleText = wrapper.first('.form-details > h1').text();
    expect(titleText).to.contain('Some Form');
  });
});
