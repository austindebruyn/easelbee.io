import FormDetails from './FormDetails';
import { shallow } from 'avoriaz';
import { buildForm } from 'fixtures/forms';
import FormDetailsInfoCard from './FormDetailsInfoCard';
import QuestionDetails from './questions/QuestionDetails';
import FormDetailsQuestionSelector from './FormDetailsQuestionSelector';
import { buildQuestion } from 'fixtures/questions';
import { nextTick } from 'vue';

describe('FormDetails', function () {
  beforeEach(function () {
    this.form = buildForm();

    this.wrapper = shallow(FormDetails, {
      propsData: { form: this.form },
      i18n: this.i18n
    });
  });

  it('should render info card', function () {
    const infoCard = this.wrapper.first(FormDetailsInfoCard);
    expect(infoCard.propsData().form).to.eql(this.form);
  });

  describe('when form has no questions', function () {
    it('should not render question card', function () {
      const infoCards = this.wrapper.find(QuestionDetails);
      expect(infoCards).to.be.empty;
    });
  });

  describe('when form has questions', function () {
    beforeEach(function () {
      this.form.questions.push(buildQuestion({ order: 1 }));
      this.form.questions.push(buildQuestion({ order: 2 }));

      this.wrapper = shallow(FormDetails, {
        propsData: { form: this.form },
        i18n: this.i18n
      });
    });

    it('should render question selector', function () {
      const questionSelector = this.wrapper.first(FormDetailsQuestionSelector);
      expect(questionSelector.propsData()).to.eql({
        current: 1,
        total: 2
      });
    });

    it('should render question card', function () {
      const questionCard = this.wrapper.first(QuestionDetails);
      expect(questionCard.propsData().question).to.eql(this.form.questions[0]);
    });

    it('should change question when selector clicked', function (done) {
      const questionSelector = this.wrapper.first(FormDetailsQuestionSelector);

      const question1 = this.form.questions[0];
      const question2 = this.form.questions[1];

      expect(this.wrapper.first(QuestionDetails).propsData()).to.eql({
        question: question1
      });
      questionSelector.vm.$emit('click', 2);
      expect(this.wrapper.vm.order).to.eql(2);

      nextTick(() => {
        expect(this.wrapper.first(QuestionDetails).propsData()).to.eql({
          question: question2
        });
        done();
      });
    });
  });
});
