const factory = require('../../tests/factory');
const Question = require('./Question');
require('./Option');
const { expect } = require('chai');

describe('#toJSON', function () {
  describe('when a string type', function () {
    beforeEach(function () {
      return factory.create('question', {
        type: Question.TYPES.string
      }).then(record => {
        this.questionId = record.id;
      });
    });

    it('should include no options', function () {
      return Question.findById(this.questionId)
        .then(q => q.toJSON())
        .then(json => {
          expect(json).to.not.have.property('options');
        });
    });
  });

  describe('when a radio type', function () {
    beforeEach(function () {
      return factory.create('question', {
        type: Question.TYPES.radio
      }).then(record => {
        this.questionId = record.id;

        return factory.createMany('option', 4, {
          questionId: record.id,
          value: 'abc'
        });
      });
    });

    it('should include options', function () {
      return Question.findById(this.questionId)
        .then(q => q.toJSON())
        .then(json => {
          expect(json).to.have.property('options');
          expect(json.options).to.have.length(4);
        });
    });
  });
});
