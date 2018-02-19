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
    beforeEach(async function () {
      const record = await factory.create('form');
      this.formId = record.id;
    });

    it('should include empty set', async function () {
      const json = await fetchFormJSONById(this.formId, true);
      expect(json.questions).to.eql([]);
    });

    it('should include empty set even when not eager loaded', async function () {
      const json = await fetchFormJSONById(this.formId, false);
      // this Form model does not have `.questions` preloaded
      expect(json.questions).to.eql([]);
    });
  });

  describe('when there are questions', function () {
    beforeEach(async function () {
      const record = await factory.create('form');
      this.formId = record.id;

      this.questions = [];
      for (let order = 1; order <= 3; order++) {
        this.questions.push(await factory.create('question', {
          formId: record.id,
          order
        }));
      }
    });

    it('should include objects', async function () {
      const json = await fetchFormJSONById(this.formId, true);
      expect(json.questions).to.have.length(3);
    });

    it('should order them', async function () {
      const json = await fetchFormJSONById(this.formId, true);
      expect(json.questions[0].order).to.eql(1);
      expect(json.questions[1].order).to.eql(2);
      expect(json.questions[2].order).to.eql(3);
    });

    it('should not include deleted questions', async function () {
      this.questions[1].deletedAt = new Date();
      await this.questions[1].save();

      const json = await fetchFormJSONById(this.formId, false);
      expect(json.questions).to.have.length(2);
      expect(json.questions.map(q => q.id))
        .to.not.include(this.questions[1].id);
    });
  });
});
