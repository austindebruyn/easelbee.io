import FormsList from './FormsList';
import FormsListItem from './FormsListItem';
import { shallow } from 'avoriaz';
import formsFixture from 'fixtures/forms';

describe('FormsList', function () {
  it('should render zero data', function () {
    const wrapper = shallow(FormsList, { propsData: {
      forms: []
    }});

    expect(wrapper.find('.forms-list ul')).to.have.length(0);
    expect(wrapper.first('.forms-list > p').text()).to.eql(
      'No forms yet :)'
    );
  });

  it('should render list', function () {
    const wrapper = shallow(FormsList, { propsData: {
      forms: [ formsFixture.basic, formsFixture.basic2 ]
    }});

    expect(wrapper.find('.forms-list ul')).to.have.length(1);
    expect(wrapper.find(FormsListItem)).to.have.length(2);

    const listItems = wrapper.find(FormsListItem);
    expect(listItems[0].propsData().form).to.eql(formsFixture.basic);
    expect(listItems[1].propsData().form).to.eql(formsFixture.basic2);
  });
});
