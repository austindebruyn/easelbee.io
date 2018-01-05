import { shallow } from 'avoriaz';
import questionsFixture from 'fixtures/questions';
import commissionsFixture from 'fixtures/commissions';
import TimelineFillout from 'components/commissions/timeline/TimelineFillout';
import TimelineFilloutItem from 'components/commissions/timeline/TimelineFilloutItem';

describe('TimelineFillout', function () {
  beforeEach(function () {
    this.wrapper = shallow(TimelineFillout, {
      propsData: {
        fillout: {
          commission: commissionsFixture.basic,
          pairs: [
            { question: questionsFixture.basic, value: 'Sketch' },
            { question: questionsFixture.basic2, value: 'Austin' }
          ]
        }
      },
      i18n: this.i18n
    });
  });

  it('should render items', function () {
    const itemChildren = this.wrapper.find(TimelineFilloutItem);
    expect(itemChildren).to.have.length(2);
    expect(itemChildren[0].propsData()).to.include({
      question: questionsFixture.basic,
      value: 'Sketch'
    });
    expect(itemChildren[1].propsData()).to.include({
      question: questionsFixture.basic2,
      value: 'Austin'
    });
  });
});
