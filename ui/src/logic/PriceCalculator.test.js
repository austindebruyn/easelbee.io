import { buildForm } from 'fixtures/forms';
import { buildQuestion } from 'fixtures/questions';
import PriceCalculator from './PriceCalculator';
const { expect } = require('chai');

describe('PriceCalculator', function () {
  beforeEach(function () {
    this.form = buildForm();
    this.values = {};

    this.subject = () => new PriceCalculator().calculate(this.form, this.values);
  });

  it('should render 0 when no questions', function () {
    expect(this.subject()).to.eql(0);
  });

  describe('with one text question', function () {
    beforeEach(function () {
      this.form.questions.push(buildQuestion({ id: 10, type: 'string' }));
    });

    it('should render 0 when no answer', function () {
      expect(this.subject()).to.eql(0);
    });

    it('should render 0 with answer', function () {
      this.values = { question_10: 'Hey' };
      expect(this.subject()).to.eql(0);
    });
  });
});
