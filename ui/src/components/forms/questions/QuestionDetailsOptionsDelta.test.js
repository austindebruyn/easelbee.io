import QuestionDetailsOptionsDelta from './QuestionDetailsOptionsDelta';
import VInputText from 'components/controls/VInputText';
import { shallow, mount } from 'avoriaz';
import { buildQuestion } from 'fixtures/questions';
import { nextTick } from 'vue';
import sinon from 'sinon';

describe('QuestionDetailsOptionsDelta', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();

    this.wrapper = shallow(QuestionDetailsOptionsDelta, {
      propsData: { type: 'base', amount: 5 },
      i18n: this.i18n
    });

    this.sandbox.spy(this.wrapper.vm, '$emit');
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('should render input number', function () {
    const input = this.wrapper.first('input');
    expect(input.value()).to.eql('5');
  });

  it('should fire event when input changes', function () {
    const input = this.wrapper.first('input');

    // this.fillIn(input).with(33);
    input.element.value = 33;
    input.trigger('change');

    expect(this.wrapper.vm.$emit).to.have.been.calledOnce;
    expect(this.wrapper.vm.$emit.args[0][0]).to.eql('change');
    expect(this.wrapper.vm.$emit.args[0][1]).to.eql({ type: 'base', amount: 33 });
  });

  describe('type: base', function () {
    beforeEach(function () {
      this.wrapper.setProps({ type: 'base' });
    });

    it('should render text', function () {
      expect(this.wrapper.first('.text-muted').text()).to.include(
        'Choosing this option sets the price of the commission to:'
      );
      expect(this.wrapper.first('a').text()).to.include(
        'Make this an extra cost instead.'
      );
    });

    it('should fire event when clicked', async function () {
      expect(this.wrapper.first('a').trigger('click'));
      await nextTick();
      expect(this.wrapper.vm.$emit).to.have.been.calledOnce;
      expect(this.wrapper.vm.$emit.args[0]).to.eql(['change', {
        type: 'add', amount: 5
      }]);
    });
  });

  describe('type: add', function () {
    beforeEach(function () {
      this.wrapper.setProps({ type: 'add' });
    });

    it('should render text', function () {
      expect(this.wrapper.first('.text-muted').text()).to.include(
        'Choosing this option is an extra cost of:'
      );
      expect(this.wrapper.first('a').text()).to.include(
        'Remove this price change.'
      );
    });

    it('should fire event when clicked', async function () {
      expect(this.wrapper.first('a').trigger('click'));
      await nextTick();
      expect(this.wrapper.vm.$emit).to.have.been.called.once;
      expect(this.wrapper.vm.$emit.args[0]).to.eql(['change', null]);
    });
  });

  describe('type: none', function () {
    beforeEach(function () {
      this.wrapper.setProps({ type: null });
    });

    it('should render text', function () {
      expect(this.wrapper.first('.text-muted').text()).to.include(
        'Choosing this option does not affect the commission’s price.'
      );
      expect(this.wrapper.first('a').text()).to.include('Set price.');
    });

    it('should fire event when clicked', async function () {
      expect(this.wrapper.first('a').trigger('click'));
      await nextTick();
      expect(this.wrapper.vm.$emit).to.have.been.called.once;
      expect(this.wrapper.vm.$emit.args[0]).to.eql(['change', {
        type: 'base', amount: 5
      }]);
    });
  });
});
