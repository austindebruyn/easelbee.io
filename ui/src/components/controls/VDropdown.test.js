import VDropdown from './VDropdown';
import { mount } from 'avoriaz';
import sinon from 'sinon';

describe('VDropdown', function () {
  beforeEach(function () {
    this.options = [
      { label: 'Crimson', value: 'red' },
      { label: 'Cerulean', value: 'blue' }
    ];
  });

  it('should render a dropdown', function () {
    const wrapper = mount(VDropdown, {
      propsData: { name: 'color', options: this.options }
    });

    const selectEl = wrapper.first('select');
    expect(selectEl.getAttribute('name')).to.eql('color');

    const optionsEl = wrapper.find('option');
    expect(optionsEl[0].getAttribute('value')).to.eql('red');
    expect(optionsEl[1].getAttribute('value')).to.eql('blue');
    expect(optionsEl[0].text()).to.eql('Crimson');
    expect(optionsEl[1].text()).to.eql('Cerulean');
  });

  it('should default to the first option', function () {
    const wrapper = mount(VDropdown, { propsData: { options: this.options } });
    expect(wrapper.vm.getValue()).to.eql('red');
  });

  it('should allow defaultValue', function () {
    const wrapper = mount(VDropdown, {
      propsData: { options: this.options, defaultValue: 'blue' }
    });
    expect(wrapper.vm.getValue()).to.eql('blue');
  });

  it('should disable', function () {
    let wrapper = mount(VDropdown, {
      propsData: { name: 'color', options: this.options, disabled: true }
    });
    expect(wrapper.first('select').hasAttribute('disabled')).to.be.true;
    wrapper = mount(VDropdown, {
      propsData: { name: 'color', options: this.options }
    });
    expect(wrapper.first('select').hasAttribute('disabled')).to.be.false;
  });

  it('should set data and fire change', function () {
    const wrapper = mount(VDropdown, { propsData: { options: this.options } });
    sinon.spy(wrapper.vm, '$emit');

    wrapper.first('select').element.value = 'blue';
    wrapper.first('select').trigger('change');
    expect(wrapper.vm.value).to.eql('blue');
    expect(wrapper.vm.$emit).to.have.been.calledWith('change');
  });

  describe('#getValue', function () {
    it('should return value of input', function () {
      const wrapper = mount(VDropdown, {
        propsData: { options: this.options }
      });
      expect(wrapper.vm.getValue()).to.eql('red');
      wrapper.vm.value = 'blue';
      expect(wrapper.vm.getValue()).to.eql('blue');
    });
  });
});
