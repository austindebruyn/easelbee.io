import FormsList from './FormsList';
import FormsListItem from './FormsListItem';
import { shallow } from 'avoriaz';
import formsFixture from 'fixtures/forms';
import Vuex from 'vuex';
import sinon from 'sinon';

describe('FormsList', function () {
  it('should render zero data', function () {
    const wrapper = shallow(FormsList, {
      propsData: { forms: [] },
      i18n: this.i18n
    });

    expect(wrapper.find('.forms-list ul')).to.have.length(0);
    expect(wrapper.first('.forms-list .forms-zero-data-state').text()).to.eql(
      'Nothing here!'
    );
  });

  it('should render list', function () {
    const wrapper = shallow(FormsList, {
      propsData: { forms: [ formsFixture.basic, formsFixture.basic2 ] },
      i18n: this.i18n
    });

    expect(wrapper.find('.forms-list ul')).to.have.length(1);
    expect(wrapper.find(FormsListItem)).to.have.length(2);

    const listItems = wrapper.find(FormsListItem);
    expect(listItems[0].propsData().form).to.eql(formsFixture.basic);
    expect(listItems[1].propsData().form).to.eql(formsFixture.basic2);
  });

  it('should dispatch create form when button clicked', function () {
    const actions = { createForm: sinon.spy() };
    const store = new Vuex.Store({ actions });

    const wrapper = shallow(FormsList, {
      propsData: { forms: [] },
      i18n: this.i18n,
      store
    });

    wrapper.first('button').trigger('click');

    expect(actions.createForm).to.have.been.called;
  });
});
