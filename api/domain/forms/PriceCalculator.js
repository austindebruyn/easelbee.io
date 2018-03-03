const QuestionOption = require('./QuestionOption');
const AnswerOptionValue = require('./AnswerOptionValue');
const QuestionPriceAdjustment = require('./QuestionPriceAdjustment');

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
          model: QuestionOption,
          include: [QuestionPriceAdjustment]
        }]
      }]
    });

    let total = 0;

    answers.forEach(function (answer) {
      answer.answerOptionValues.forEach(function (optionValue) {
        const adjustment = optionValue.questionOption.questionPriceAdjustment;
        if (adjustment) {
          total += adjustment.amount;
        }
      });
    });

    return total;
  }
}

module.exports = PriceCalculator;
