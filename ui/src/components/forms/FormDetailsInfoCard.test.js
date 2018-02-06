import { expect } from 'chai';
import { mount } from 'avoriaz';
import FormDetailsInfoCard from './FormDetailsInfoCard';
import VInputText from 'components/controls/VInputText';
import { buildForm } from 'fixtures/forms';
import clock from '../../../../api/tests/clock'; ;
import sinon from 'sinon';
import Vuex from 'vuex';

describe('FormDetailsInfoCard', function () {
  clock();

  beforeEach(function () {
    this.form = buildForm({ createdAt: '2017-08-21T00:00:00.001Z' });

    this.actions = { updateForm: sinon.spy() };
    this.store = new Vuex.Store({ actions: this.actions });

    this.wrapper = mount(FormDetailsInfoCard, {
      propsData: { form: this.form },
      i18n: this.i18n,
      store: this.store
    });
  });

  it('should render editable title', function () {
    const input = this.wrapper.first(VInputText);
    expect(input.propsData()).to.include({
      defaultValue: this.form.name,
      kind: 'madlibs'
    });
  });

  it('should dispatch form update when editable title submitted', function () {
    const input = this.wrapper.first(VInputText);
    input.vm.value = 'Cool Survey!';

    this.wrapper.first('form').trigger('submit');
    expect(this.actions.updateForm).to.have.been.calledWith(
      sinon.match.object,
      { id: this.form.id, name: 'Cool Survey!' }
    );
  });

  it('should render info', function () {
    const body = this.wrapper.first('.card-body');
    expect(body.text()).to.include('Created 10 days ago');
    expect(body.text()).to.include('Filled out 0 times');
    expect(body.text()).to.include('You’ve earned $0 from this form');
  });
});
