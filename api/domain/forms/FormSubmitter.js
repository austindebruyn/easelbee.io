const _ = require('lodash');
const { UnprocessableEntityError } = require('../../core/errors');
const Question = require('./Question');
const Option = require('./Option');
const Form = require('./Form');
const Commission = require('../commissions/Commission');
const Answer = require('./Answer');
const AnswerTextValue = require('./AnswerTextValue');
const AnswerOptionValue = require('./AnswerOptionValue');
const db = require('../../services/db');
const Price = require('../commissions/Price');
const PriceCalculator = require('./PriceCalculator');

/**
 * Returns a question id parsed from a string like `question_7`.
 * @param {String} key
 * @returns {Number}
 */
function getIdFromQuestionKey(key) {
  const number = key.match(/^question_(\d+)$/);
  if (!number || !number[1] || !parseInt(number[1])) {
    const error = new UnprocessableEntityError('bad-attribute', {
      fields: [key]
    });
    throw error;
  }

  return parseInt(number[1]);
}

class FormSubmitter {
  /**
   * @param {Form} form 
   */
  constructor(form) {
    this.form = form;
  }

  /**
   * Promises to return an uncommitted Answer model for the Question provided
   * by searching in the body for the user input.
   * @param {Object} t transaction
   * @param {Commission} commission
   * @param {Object} body
   * @param {Question} question 
   * @returns {Promise}
   * @private 
   */
  createAnswerForQuestion(t, commission, body, question) {
    const key = `question_${question.id}`;

    return Answer.create(
      { questionId: question.id, commissionId: commission.id },
      { transaction: t }
    ).then(function (answer) {
      if (!(key in body)) {
        if (question.required) {
          throw new UnprocessableEntityError('missing-required-question', {
            id: question.id
          });
        }

        return Promise.resolve(answer);
      }

      switch (question.type) {
        case Question.TYPES.radio:
          const id = body[key];
          return Option.findOne({ where: { id } })
            .then(option => {
              if (!option) {
                throw new UnprocessableEntityError('invalid-question-option', {
                  id
                });
              }

              return AnswerOptionValue.create(
                { optionId: option.id, answerId: answer.id },
                { transaction: t }
              );
            }).then(() => answer);
        case Question.TYPES.string:
          return AnswerTextValue.create(
            { value: body[key], answerId: answer.id },
            { transaction: t }
          ).then(() => answer);
        default:
          throw new Error(`Unknown question type ${question.type}`);
      }
    });
  }

  /**
   * Returns a list of questions that coorespond to the form and are interesting
   * to us.
   * @returns {Question[]}
   * @private
   */
  getQuestions() {
    return this.form.questions.filter(q => !q.deletedAt);
  }

  /**
   * Matches the keys present in the request body inputs with questions. Will
   * reject if it finds something funny:
   *  - questions that don't exist
   *  - questions that don't belong to the form's user
   * @param {Object} body
   * @returns {Promise}
   * @private 
   */
  findQuestionsForInputs(body) {
    const keys = Object.keys(body).filter(function (key) {
      return !['email', 'nickname'].includes(key);
    });

    return Promise.all(keys.map(key => {
      return new Promise((resolve, reject) => {
        const id = getIdFromQuestionKey(key);

        const formQuestion = _.find(this.getQuestions(), { id });
        if (formQuestion) {
          return resolve(formQuestion);
        }

        return Question.findOne({ where: { id }, include: [Form] })
          .then(question => {
            if (!question || question.form.userId !== this.form.userId) {
              return reject(new UnprocessableEntityError('question-not-found', {
                fields: [key]
              }));
            }

            return resolve(question);
          })
          .catch(reject);
      });
    })).then(questions => {
      // Always concat and dedupe the required questions.
      return _([
        ..._.filter(this.getQuestions(), 'required'),
        ...questions
      ]).uniqBy('id').compact().value();
    });
  }

  /**
   * Promises to create a commission attached to the given form. The POST body
   * is passed in.
   * @param {Object} body
   * @param {Commission} commission
   * @returns {Promise}
   */
  async submit(body) {
    let commission;

    await db.transaction(t => {
      return (async () => {
        await this.form.ensureQuestions();

        commission = await Commission.create({
          formId: this.form.id,
          userId: this.form.userId,
          email: body.email,
          nickname: body.nickname
        }, { transaction: t });

        const questions = await this.findQuestionsForInputs(body);
        await Promise.all(questions.map(q => {
          return this.createAnswerForQuestion(t, commission, body, q);
        }));

        this.form.submittedAt = new Date();
        await this.form.save({ transaction: t });
        return commission;
      })();
    });

    const price = await Price.create({
      commissionId: commission.id,
      amount: await new PriceCalculator(commission).calculate()
    });
    commission.prices = [price];
    await commission.ensureAnswers();

    return commission;
  }
}

module.exports = FormSubmitter;
