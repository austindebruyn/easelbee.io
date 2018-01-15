import FormDetails from './FormDetails';
import { shallow } from 'avoriaz';
import { buildForm } from 'fixtures/forms';
import FormDetailsInfoCard from './FormDetailsInfoCard';
import QuestionDetails from './questions/QuestionDetails';
import { buildQuestion } from 'fixtures/questions';

describe('FormDetails', function () {
  beforeEach(function () {
    this.form = buildForm();
    this.form.questions.push(buildQuestion());

    this.wrapper = shallow(FormDetails, {
      propsData: { form: this.form },
      i18n: this.i18n
    });
  });

  // it('should render text', function () {
  //   const titleText = this.wrapper.first('.form-details > h1').text();
  //   expect(titleText).to.contain('Some Form');
  // });

  it('should render info card', function () {
    const infoCard = this.wrapper.first(FormDetailsInfoCard);
    expect(infoCard.propsData().form).to.eql(this.form);
  });

  it('should render question card', function () {
    const questionCard = this.wrapper.first(QuestionDetails);
    expect(questionCard.propsData().question).to.eql(this.form.questions[0]);
  });
});
