const FormSubmitter = require('./FormSubmitter');
const Commission = require('../commissions/Commission');
const Question = require('./Question');
const Answer = require('./Answer');
const AnswerTextValue = require('./AnswerTextValue');
const factory = require('../../tests/factory');
const { expect } = require('chai');

describe.only('FormSubmitter', function () {
  describe('with no questions', function () {
    beforeEach(function () {
      return factory.create('form').then(record => {
        this.form = record;
      });
    });

    it('should create commission with no answers', function () {
      const submitter = new FormSubmitter(this.form);
      return submitter.submit({}).then(function (commission) {
        expect(commission.answers).to.eql([]);
      });
    });
  });

  describe('with one question', function () {
    beforeEach(function () {
      return factory.create('form').then(form => {
        this.form = form;

        return factory.create('question', {
          formId: this.form.id,
          type: Question.TYPES.string
        })
      }).then(question => {
        this.question = question;
      });
    });

    it('should create commission with one answer', function () {
      const submitter = new FormSubmitter(this.form);
      const body = {
        [`question_${this.question.id}`]: 'Jiminy Cricket'
      };
      return submitter.submit(body).then(commission => {
        return Commission.findOne({
          where: { id: commission.id },
          include: [{ model: Answer, include: [{ model: AnswerTextValue }] }]
        })
      }).then(commission => {
        expect(commission.answers).to.have.length(1);
        const { answerTextValues } = commission.answers[0];
        expect(answerTextValues).to.have.length(1);
        expect(answerTextValues[0].value).to.eql('Jiminy Cricket');
      });
    });
  });
});
