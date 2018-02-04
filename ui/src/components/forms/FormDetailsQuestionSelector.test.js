import FormDetailsQuestionSelector from './FormDetailsQuestionSelector';
import { shallow } from 'avoriaz';
import sinon from 'sinon';

describe('FormDetailsQuestionSelector', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('should render bubbles', function () {
    const wrapper = shallow(FormDetailsQuestionSelector, {
      propsData: { current: 2, total: 3 }
    });
    const bubbles = wrapper.find('.bubble');
    expect(bubbles.length).to.eql(4);
    expect(bubbles[0].text()).to.eql('1');
    expect(bubbles[0].hasClass('selected')).to.be.false;
    expect(bubbles[1].text()).to.eql('2');
    expect(bubbles[1].hasClass('selected')).to.be.true;
    expect(bubbles[2].text()).to.eql('3');
    expect(bubbles[2].hasClass('selected')).to.be.false;
    expect(bubbles[3].text()).to.eql('+');
    expect(bubbles[2].hasClass('selected')).to.be.false;
  });

  it('fires event when bubble clicked', function () {
    const wrapper = shallow(FormDetailsQuestionSelector, {
      propsData: { current: 2, total: 3 }
    });
    this.sandbox.spy(wrapper.vm, '$emit');

    wrapper.find('.bubble')[2].trigger('click');
    expect(wrapper.vm.$emit).to.have.been.calledWith('click', 3);
  });

  it('fires event when new question clicked', function () {
    const wrapper = shallow(FormDetailsQuestionSelector, {
      propsData: { current: 0, total: 0 }
    });
    this.sandbox.spy(wrapper.vm, '$emit');

    wrapper.first('.bubble').trigger('click');
    expect(wrapper.vm.$emit).to.have.been.calledWith('createClick');
  });
});
