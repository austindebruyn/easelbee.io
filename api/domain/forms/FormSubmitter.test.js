const _ = require('lodash');
const { expect } = require('chai');
const FormSubmitter = require('./FormSubmitter');
const Commission = require('../commissions/Commission');
const Question = require('./Question');
const Answer = require('./Answer');
const AnswerTextValue = require('./AnswerTextValue');
const factory = require('../../tests/factory');

function reloadCommissionWithAssociations(commission) {
  return Commission.findOne({
    where: { id: commission.id },
    include: [{ model: Answer, include: [{ model: AnswerTextValue }] }]
  });
}

/**
 * Shared example for expecting not to create any records ie. transaction
 * rollback.
 */
function itShouldNotCreateAnyRecords(body = {}) {
  it('should not create commission or answers', function () {
    const submitter = new FormSubmitter(this.form);
    return submitter.submit(body).catch(_.noop)
      .then(function () {
        return expect(Commission.findAll()).to.eventually.have.length(0);
      })
      .then(function (commissions) {
        return expect(Answer.findAll()).to.eventually.have.length(0);
      })
      .then(function (commissions) {
        return expect(AnswerTextValue.findAll()).to.eventually.have.length(0);
      });
  });
}

describe('FormSubmitter', function () {
  describe('with no questions', function () {
    beforeEach(function () {
      return factory.create('form').then(record => {
        this.form = record;
      });
    });

    it('should create commission with no answers', function () {
      const submitter = new FormSubmitter(this.form);
      return submitter.submit({}).then(commission => {
        expect(commission.answers).to.eql([]);
        expect(commission.formId).to.eql(this.form.id);
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
        });
      }).then(question => {
        this.question = question;
      });
    });

    it('should create no answer', function () {
      const submitter = new FormSubmitter(this.form);
      const body = {};

      return submitter.submit(body)
        .then(reloadCommissionWithAssociations)
        .then(commission => {
          expect(commission.answers).to.have.length(0);
        });
    });

    it('should create answer with value', function () {
      const submitter = new FormSubmitter(this.form);
      const body = {
        [`question_${this.question.id}`]: 'Jiminy Cricket'
      };
      return submitter.submit(body)
        .then(reloadCommissionWithAssociations)
        .then(commission => {
          expect(commission.answers).to.have.length(1);
          const { answerTextValues } = commission.answers[0];
          expect(answerTextValues).to.have.length(1);
          expect(answerTextValues[0].value).to.eql('Jiminy Cricket');
        });
    });

    describe('when question is required', function () {
      beforeEach(function () {
        this.question.required = true;
        return this.question.save();
      });

      it('should reject', function () {
        const submitter = new FormSubmitter(this.form);
        return expect(submitter.submit({})).to.eventually.be.rejected
          .and.include({ code: 'missing-required-question' });
      });

      itShouldNotCreateAnyRecords();
    });

    describe('when question is not part of this form', function () {
      describe('malformed key', function () {
        it('should reject', function () {
          const submitter = new FormSubmitter(this.form);
          return expect(submitter.submit({ 'question_haha': 'Hey' }))
            .to.eventually.be.rejected
            .and.deep.include({
              code: 'bad-attribute',
              fields: [ 'question_haha' ]
            });
        });

        itShouldNotCreateAnyRecords({ 'question_haha': 'Hey' });
      });

      describe('and does not exist', function () {
        it('should reject', function () {
          const submitter = new FormSubmitter(this.form);
          return expect(submitter.submit({ 'question_777': 'Hey' }))
            .to.eventually.be.rejected
            .and.deep.include({
              code: 'question-not-found',
              fields: ['question_777']
            });
        });

        itShouldNotCreateAnyRecords({ 'question_777': 'Hey' });
      });

      describe('and belongs to someone else', function () {
        beforeEach(function () {
          return factory.create('question', {
            id: 800,
            type: Question.TYPES.string
          });
        });

        it('should reject', function () {
          const submitter = new FormSubmitter(this.form);
          return expect(submitter.submit({ question_800: 'Hey' }))
            .to.eventually.be.rejected
            .and.deep.include({
              code: 'question-not-found',
              fields: ['question_800']
            });
        });

        itShouldNotCreateAnyRecords({ 'question_800': 'Hey' });
      });
    });
  });

  describe('with many question', function () {
    beforeEach(function () {
      return factory.create('form').then(form => {
        this.form = form;

        return factory.createMany('question', 3, {
          formId: this.form.id,
          type: Question.TYPES.string
        });
      }).then(questions => {
        this.questions = questions;
      });
    });

    it('should create answers with value', function () {
      const submitter = new FormSubmitter(this.form);
      const body = {
        [`question_${this.questions[0].id}`]: 'Jiminy Cricket',
        [`question_${this.questions[1].id}`]: 'Donald Duck',
        [`question_${this.questions[2].id}`]: 'Abraham Lincoln'
      };
      return submitter.submit(body)
        .then(reloadCommissionWithAssociations)
        .then(commission => {
          expect(commission.answers).to.have.length(3);
          const answerTextValues = commission.answers
            .map(a => a.answerTextValues[0]);
          expect(answerTextValues[0].value).to.eql('Jiminy Cricket');
          expect(answerTextValues[1].value).to.eql('Donald Duck');
          expect(answerTextValues[2].value).to.eql('Abraham Lincoln');
        });
    });
  });
});
