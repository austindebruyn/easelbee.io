import TimelineFilloutItem from 'components/commissions/timeline/TimelineFilloutItem';
import { shallow } from 'avoriaz';
import questionsFixture from 'fixtures/questions';

describe('TimelineFilloutItem', function () {
  describe('string question', function () {
    beforeEach(function () {
      this.wrapper = shallow(TimelineFilloutItem, {
        propsData: {
          question: questionsFixture.basic,
          value: 'Sketch'
        },
        i18n: this.i18n
      });
    });

    it('should render text', function () {
      const titleText = this.wrapper.first('.question .title').text();
      expect(titleText).to.eql('What kind of drawing?');
      expect(this.wrapper.first('.question .value').text()).to.eql('Sketch');
    });
  });

  describe('radio question', function () {
    beforeEach(function () {
      this.wrapper = shallow(TimelineFilloutItem, {
        propsData: {
          question: questionsFixture.basicRadio,
          value: 1
        },
        i18n: this.i18n
      });
    });

    it('should render text', function () {
      const titleText = this.wrapper.first('.question .title').text();
      expect(titleText).to.eql('What best fruit?');
      expect(this.wrapper.first('.question .value').text()).to.eql('Banana');
    });
  });
});
