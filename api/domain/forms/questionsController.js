const _ = require('lodash');
const Question = require('./Question');
const {
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError
} = require('../../core/errors');
const QuestionUpdater = require('./QuestionUpdater');

module.exports.update = function (req, res, next) {
  let question;

  return Question.findById(req.params.id)
    .then(function (record) {
      question = record;

      if (!question) {
        throw new NotFoundError();
      }
      if (question.userId !== req.user.id) {
        throw new UnauthorizedError();
      }

      const attributeKeys = Object.keys(req.body);

      if (attributeKeys.length < 1) {
        throw new UnprocessableEntityError('no-attributes');
      }

      const allowedAttributes = [ 'title' ];
      const forbiddenAttributes = _.difference(
        attributeKeys,
        allowedAttributes
      );
      if (forbiddenAttributes.length > 0) {
        throw new UnprocessableEntityError('bad-attributes', {
          fields: forbiddenAttributes
        });
      }

      return new QuestionUpdater(question).update(req.body);
    })
    .then(() => question.toJSON())
    .then(function (record) {
      return res.json({ ok: true, record });
    })
    .catch(function (err) {
      return next(err);
    });
};
