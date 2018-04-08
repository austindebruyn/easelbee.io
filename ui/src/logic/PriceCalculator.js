import _find from 'lodash.find';

export default class PriceCalculator {
  calculate (form, values) {
    return Object.keys(values).reduce(function (acc, key) {
      const matches = key.match(/^question_(\d+)$/);
      if (!matches) return acc;

      const id = parseInt(matches[1], 10);
      const question = _find(form.questions, { id });
      if (!question) return acc;

      const option = _find(question.options, { value: values[key] });
      if (!option || !option.delta) return acc;

      if (option.delta.type === 'base') {
        return option.delta.amount;
      }
      return acc + option.delta.amount;
    }, 0);
  }
}
