import VInputText from './VInputText';
import { mount } from 'avoriaz';
import sinon from 'sinon';

describe('VInputText', function () {
  it('should not render an icon', function () {
    const wrapper = mount(VInputText, { propsData: {} });
    expect(wrapper.contains('.fa')).to.be.false;
  });

  it('should render an icon if there is one', function () {
    const wrapper = mount(VInputText, { propsData: { icon: 'user' } });
    expect(wrapper.first('.fa').hasClass('fa-user')).to.be.true;
  });

  it('should disable', function () {
    let wrapper = mount(VInputText, { propsData: { disabled: false } });
    expect(wrapper.contains('input:disabled')).to.be.false;
    wrapper = mount(VInputText, { propsData: { disabled: true } });
    expect(wrapper.contains('input:disabled')).to.be.true;
  });

  it('should render correct input', function () {
    const wrapper = mount(VInputText, { propsData: {
      name: 'username',
      placeholder: 'Enter Username'
    }
    });
    const input = wrapper.first('input').element;

    expect(input.getAttribute('name')).to.eql('username');
    expect(input.getAttribute('placeholder')).to.eql('Enter Username');
    expect(input.getAttribute('type')).to.eql('text');
  });

  it('should store focus', function () {
    const wrapper = mount(VInputText);

    expect(wrapper.vm.focus).to.be.false;
    wrapper.vm.handleFocus();
    expect(wrapper.vm.focus).to.be.true;
    wrapper.vm.handleBlur();
    expect(wrapper.vm.focus).to.be.false;
  });

  it('should fire change', function () {
    const wrapper = mount(VInputText);
    sinon.spy(wrapper.vm, '$emit');

    wrapper.first('input').trigger('keyup');
    expect(wrapper.vm.$emit).to.have.been.called;
  });

  describe('#getValue', function () {
    it('should return value of input', function () {
      const wrapper = mount(VInputText);
      this.fillIn(wrapper.first('input')).with('bath time!');
      expect(wrapper.vm.getValue()).to.eql('bath time!');
    });
  });

  describe('#setValue', function () {
    it('should set value', function () {
      const wrapper = mount(VInputText);
      wrapper.vm.setValue('squeaky clean');
      expect(wrapper.vm.getValue()).to.eql('squeaky clean');
    });
  });
});
