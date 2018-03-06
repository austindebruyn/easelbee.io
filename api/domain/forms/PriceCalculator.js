const Option = require('./Option');
const AnswerOptionValue = require('./AnswerOptionValue');
const Delta = require('./Delta');

/**
 * Calculates the price of a commission from the submitted questions and
 * answers.
 */
class PriceCalculator {
  /**
   * @api
   */
  constructor(commission) {
    this.commission = commission;
  }

  /**
   * @api
   * @returns {Number}
   */
  async calculate() {
    const answers = await this.commission.getAnswers({
      include: [{
        model: AnswerOptionValue,
        required: false,
        include: [{
          model: Option,
          include: [Delta]
        }]
      }]
    });

    let total = 0;

    answers.forEach(function (answer) {
      answer.answerOptionValues.forEach(function (optionValue) {
        const { delta } = optionValue.option;
        if (delta) {
          total += delta.amount;
        }
      });
    });

    return total;
  }
}

module.exports = PriceCalculator;
