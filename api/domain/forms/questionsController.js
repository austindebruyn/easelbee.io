const _ = require('lodash');
const Form = require('./Form');
const Question = require('./Question');
const Option = require('./Option');
const Delta = require('./Delta');
const {
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError
} = require('../../core/errors');
const QuestionUpdater = require('./QuestionUpdater');

module.exports.update = function (req, res, next) {
  async function handle() {
    const question = await Question.findById(req.params.id);
    if (!question) {
      throw new NotFoundError();
    }

    await question.ensureForm();
    if (question.form.userId !== req.user.id) {
      throw new UnauthorizedError();
    }

    const attributeKeys = Object.keys(req.body);

    if (attributeKeys.length < 1) {
      throw new UnprocessableEntityError('no-attributes');
    }

    const allowedAttributes = [ 'title', 'type', 'options' ];
    const forbiddenAttributes = _.difference(
      attributeKeys,
      allowedAttributes
    );
    if (forbiddenAttributes.length > 0) {
      throw new UnprocessableEntityError('bad-attributes', {
        fields: forbiddenAttributes
      });
    }

    if (!(req.body.type in Question.TYPES)) {
      throw new UnprocessableEntityError('bad-type', {
        fields: { type: req.body.type }
      });
    }
    req.body.type = Question.TYPES[req.body.type];

    const result = await new QuestionUpdater(question).update(req.body);
    return res.json({ ok: true, record: await result.toJSON() });
  }
  handle().catch(next);
};

module.exports.destroy = function (req, res, next) {
  async function handle() {
    const question = await Question.findById(req.params.id, {
      include: [Form]
    });

    if (!question) throw new NotFoundError();

    if (question.form.userId !== req.user.id) throw new UnauthorizedError();

    question.deletedAt = new Date();
    await question.save();

    const otherQuestions = await question.form.getQuestions();

    for (let i = 0; i < otherQuestions.length; i++) {
      const otherQuestion = otherQuestions[i];

      if (otherQuestion.order > question.order) {
        otherQuestion.order -= 1;
        await otherQuestion.save();
      }
    }

    return res.sendStatus(204);
  }

  handle().catch(next);
};

module.exports.setDelta = function (req, res, next) {
  async function handle() {
    const option = await Option.findById(req.params.id, {
      include: [{ model: Question, include: [Form] }]
    });
    if (!option) throw new NotFoundError();
    if (option.question.form.userId !== req.user.id) {
      throw new UnauthorizedError();
    }

    const { amount, type } = req.body;
    if (!(type in Delta.TYPES)) {
      throw new UnprocessableEntityError('bad-type', {
        fields: { type }
      });
    }
    if (!_.isFinite(amount) || amount < 0) {
      throw new UnprocessableEntityError('bad-amount', {
        fields: { amount }
      });
    }

    const updater = new QuestionUpdater(option.question);
    const result = await updater.setDelta(option.id, type, amount);
    return res.json({ ok: true, record: await result.toJSON() });
  }
  handle().catch(next);
};

module.exports.destroyDelta = function (req, res, next) {

};
