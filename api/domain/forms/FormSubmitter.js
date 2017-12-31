// const Form = require('./Form');
const { UnprocessableEntityError } = require('../../core/errors');
const Question = require('./Question');
// const QuestionOption = require('./QuestionOption');
const Commission = require('../commissions/Commission');
const Answer = require('./Answer');
const AnswerTextValue = require('./AnswerTextValue');

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
   * @param {Question} question 
   * @param {Commission} commission
   * @param {Object} body
   * @returns {Promise}
   * @private 
   */
  createAnswerForQuestion(question, commission, body) {
    const key = `question_${question.id}`;

    return Answer.create({
      questionId: question.id,
      commissionId: commission.id
    }).then(function (answer) {
      if (!(key in body)) {
        if (question.required) {
          throw new UnprocessableEntityError('missing-required-question', {
            id: question.id
          });
        }
      }

      switch (question.type) {
        case Question.TYPES.string:
          return AnswerTextValue.create({
            value: body[key],
            answerId: answer.id
          }).then(() => answer);
        default:
          throw new Error(`Unknown question type ${question.type}`);
      }
    });
  }

  /**
   * Promises to create a commission attached to the given form. The POST body
   * is passed in.
   * @param {Object} body
   * @param {Commission} commission
   * @returns {Promise}
   */
  submit(body) {
    return this.form.ensureQuestions()
      .then(() => {
        return Commission.create({
          formId: this.form.id,
          userId: this.form.userId,
          email: body.email,
          body: body.body
        });
      })
      .then(commission => {
        this._commission = commission;
      })
      .then(() => {
        return Promise.all(this.form.questions.map(q => {
          return this.createAnswerForQuestion(q, this._commission, body);
        }));
      })
      .then(answers => {
        return this._commission.ensureAnswers();
      })
      .then(() => {
        return this._commission;
      });
  }
}

module.exports = FormSubmitter;
