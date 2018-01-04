const AnswerTextValue = require('./AnswerTextValue');
const AnswerOptionValue = require('./AnswerOptionValue');
const Question = require('./Question');
const { expect } = require('chai');
const factory = require('../../tests/factory');

describe('Answer', function () {
  describe('#getValue', function () {
    describe('type: string', function () {
      beforeEach(function () {
        return factory.create('question', { type: Question.TYPES.string })
          .then(question => this.question = question);
      });

      describe('one text value exists', function () {
        beforeEach(function () {
          return factory.create('answer',
            { questionId: this.question.id },
            { value: 'Taj Mahal' }
          ).then(record => this.answer = record);
        });

        it('should return the string value', function () {
          return expect(this.answer.getValue()).to.eventually.eql('Taj Mahal');
        });
      });

      describe('no text value exists', function () {
        beforeEach(function () {
          return factory.create('answer', { questionId: this.question.id })
            .then(record => {
              this.answer = record;
              return AnswerTextValue.destroy({
                where: { answerId: record.id }
              });
            });
        });

        it('should reject', function () {
          return expect(this.answer.getValue())
            .to.eventually.be.rejected
            .and.include({
              message: 'Expected 1 AnswerTextValue for <Answer #1>, found 0 ' +
                       'instead.'
            });
        });
      });
    });

    describe('type: radio', function () {
      beforeEach(function () {
        return factory.create('question', { type: Question.TYPES.radio })
          .then(question => {
            this.question = question;
            return factory.create('questionOption', {
              id: 222,
              questionId: question.id
            });
          });
      });

      describe('one value exists', function () {
        beforeEach(function () {
          return factory.create('answer',
            { questionId: this.question.id }
          ).then(record => this.answer = record);
        });

        it('should return the id', function () {
          return expect(this.answer.getValue()).to.eventually.eql(222);
        });
      });

      describe('no value exists', function () {
        beforeEach(function () {
          return factory.create('answer', { questionId: this.question.id })
            .then(record => {
              this.answer = record;
              return AnswerOptionValue.destroy({
                where: { answerId: record.id }
              });
            });
        });

        it('should reject', function () {
          return expect(this.answer.getValue())
            .to.eventually.be.rejected
            .and.include({
              message: 'Expected 1 AnswerOptionValue for <Answer #1>, found 0 ' +
                       'instead.'
            });
        });
      });
    });
  });
});
