export default class PriceCalculator {
  /**
   * @param {Object} questions mapping of id to models
   * @param {Object} options mapping of id to models
   * @param {Object} values mapping of question_x key to value
   * @returns {Number}
   */
  calculate (questions, options, values) {
    return Object.keys(values).reduce(function (acc, key) {
      const matches = key.match(/^question_(\d+)$/);
      if (!matches) return acc;

      const id = parseInt(matches[1], 10);
      const question = questions[id];
      if (!question) return acc;

      const option = options[values[key]];
      if (!option || !option.delta) return acc;

      if (option.delta.type === 'base') {
        return option.delta.amount;
      }
      return acc + option.delta.amount;
    }, 0);
  }
}
