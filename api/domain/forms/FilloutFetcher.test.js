const { expect } = require('chai');
const FilloutFetcher = require('./FilloutFetcher');
const factory = require('../../tests/factory');
const clock = require('../../tests/clock');
const Question = require('./Question');

describe('FilloutFetcher', function () {
  clock();

  beforeEach(function () {
    return factory.create('form')
      .then(form => {
        this.form = form;
        return factory.create('commission', {
          email: 'happy@customer.com',
          nickname: 'Happy Customer',
          userId: form.userId
        });
      })
      .then(commission => {
        this.commission = commission;
        return factory.createMany('question', 2, {
          formId: this.form.id,
          title: 'Whatever',
          type: Question.TYPES.string,
          order: 1
        });
      })
      .then(questions => {
        return Promise.all(questions.map(q => {
          return factory.create('answer', {
            questionId: q.id,
            commissionId: this.commission.id
          }, { value: `answer for question ${q.id}` });
        }));
      });
  });

  describe('#toJSON', function () {
    it('should return entire set', function () {
      const fetcher = new FilloutFetcher(this.commission);
      return expect(fetcher.toJSON()).to.eventually.eql({
        commission: {
          id: 1,
          userId: 1,
          nickname: 'Happy Customer',
          email: 'happy@customer.com',
          status: 'incoming',
          createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
          updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT'
        },
        pairs: [
          {
            question: {
              id: 1,
              formId: 1,
              title: 'Whatever',
              type: 'string',
              required: false,
              order: 1,
              createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
              updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT'
            },
            value: 'answer for question 1'
          },
          {
            question: {
              id: 2,
              formId: 1,
              title: 'Whatever',
              type: 'string',
              required: false,
              order: 1,
              createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
              updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT'
            },
            value: 'answer for question 2'
          }
        ]
      });
    });
  });
});
