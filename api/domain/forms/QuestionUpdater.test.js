const agent = require('../../tests/agent');
const signIn = require('../../tests/signIn');
const clock = require('../../tests/clock');
const factory = require('../../tests/factory');
const expect = require('chai').expect;
const QuestionUpdater = require('./QuestionUpdater');

describe('questionsController', function () {
  clock();

  beforeEach(async function () {
    this.question = await factory.create('question');
  })

  describe('#update', function () {
    it('should assign properties and save', function () {
      const updater = new QuestionUpdater(this.question);
      
      return updater.update({ title: 'Having a good time' })
        .then(function (result) {
          expect(result.title).to.eql('Having a good time');
        });
    })
  });
});
