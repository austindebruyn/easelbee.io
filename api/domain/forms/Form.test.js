const factory = require('../../tests/factory');
const Form = require('./Form');
const Question = require('./Question');
const { expect } = require('chai');

/**
 * Promises to fetch a form JSON by id.
 * @param {Number} id 
 * @param {Boolean} eagerLoad Question models
 * @returns {Promise} 
 */
function fetchFormJSONById(id, eagerLoad) {
  const queryOpts = eagerLoad ? { include: [Question] } : {};

  return Form.findById(id, queryOpts).then(form => form.toJSON());
}

describe('#toJSON', function () {
  describe('when no questions', function () {
    beforeEach(function () {
      return factory.create('form').then(record => {
        this.formId = record.id;
      });
    });

    it('should include empty set', function () {
      return fetchFormJSONById(this.formId, true)
        .then(function (json) {
          expect(json.questions).to.eql([]);
        });
    });

    it('should include empty set even when not eager loaded', function () {
      return fetchFormJSONById(this.formId, false)
        // this Form model does not have `.questions` preloaded
        .then(function (json) {
          expect(json.questions).to.eql([]);
        });
    });
  });

  describe('when there are questions', function () {
    beforeEach(function () {
      return factory.create('form').then(record => {
        this.formId = record.id;

        return factory.createMany('question', 3, {
          formId: record.id
        });
      });
    });

    it('should include objects', function () {
      return fetchFormJSONById(this.formId, true)
        .then(function (json) {
          expect(json.questions).to.have.length(3);
        });
    });
  });
});
