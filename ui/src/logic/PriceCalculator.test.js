import { buildQuestion, buildOption } from 'fixtures/questions';
import PriceCalculator from './PriceCalculator';
const { expect } = require('chai');

describe('PriceCalculator', function () {
  beforeEach(function () {
    this.questions = {};
    this.options = {};
    this.values = {};

    this.subject = function () {
      return new PriceCalculator().calculate(
        this.questions,
        this.options,
        this.values
      );
    };
  });

  it('should return 0 when no questions', function () {
    expect(this.subject()).to.eql(0);
  });

  describe('with one text question', function () {
    beforeEach(function () {
      this.questions[10] = buildQuestion({ id: 10, type: 'string' });
    });

    it('should return 0 when no answer', function () {
      expect(this.subject()).to.eql(0);
    });

    it('should return 0 with answer', function () {
      this.values = { question_10: 'Hey' };
      expect(this.subject()).to.eql(0);
    });
  });

  describe('with one radio question with no deltas', function () {
    beforeEach(function () {
      this.questions[10] = buildQuestion({
        id: 10,
        type: 'radio',
        options: [{ value: 'Spanish' }, { value: 'English' }]
      });
    });

    it('should return 0 when no answer', function () {
      expect(this.subject()).to.eql(0);
    });

    it('should return 0 with answer', function () {
      this.values = { question_10: 'Hey' };
      expect(this.subject()).to.eql(0);
    });
  });

  describe('with one radio question with deltas', function () {
    beforeEach(function () {
      this.questions[10] = buildQuestion({
        id: 10,
        type: 'radio',
        options: [ 1, 2, 3 ]
      });
      this.options[1] = buildOption({
        id: 1,
        value: 'Spanish',
        delta: { type: 'base', amount: 11 }
      });
      this.options[2] = buildOption({
        id: 2,
        value: 'English',
        delta: { type: 'base', amount: 24 }
      });
      this.options[3] = buildOption({ id: 3, value: 'Russian' });
    });

    it('should return 0 when no answer', function () {
      expect(this.subject()).to.eql(0);
    });

    it('should return base value with answer', function () {
      this.values = { question_10: 1 }; // Spanish
      expect(this.subject()).to.eql(11);
      this.values = { question_10: 2 }; // English
      expect(this.subject()).to.eql(24);
      this.values = { question_10: 3 }; // Russian
      expect(this.subject()).to.eql(0);
    });

    describe('with second radio question that has add delta', function () {
      beforeEach(function () {
        this.questions[99] = buildQuestion({
          id: 99,
          type: 'radio',
          options: [ 4, 5, 6 ]
        });
        this.options[4] = buildOption({ id: 4, value: 'No Extra Money' });
        this.options[5] = buildOption({
          id: 5,
          value: 'Medium Extra',
          delta: { type: 'add', amount: 5 }
        });
        this.options[6] = buildOption({
          id: 6,
          value: 'Big Extra',
          delta: { type: 'add', amount: 50 }
        });
      });

      it('should return 0 when no answer', function () {
        expect(this.subject()).to.eql(0);
      });

      it('should return just base if no extra', function () {
        this.values = { question_10: 1, question_99: 4 }; // Spanish, No Extra
        expect(this.subject()).to.eql(11);
      });

      it('should add `base` and `add` delta', function () {
        this.values = { question_10: 1, question_99: 5 }; // Spanish, Meduim
        expect(this.subject()).to.eql(11 + 5);
        this.values = { question_10: 2, question_99: 6 }; // English, Big
        expect(this.subject()).to.eql(24 + 50);
        this.values = { question_10: 3, question_99: 6 }; // Russian, Big
        expect(this.subject()).to.eql(0 + 50);
      });
    });
  });

  it('should return 0 if no such question', function () {
    this.vaues = { question_123: 'Hey' };
    expect(this.subject()).to.eql(0);
  });

  it('should return 0 if no such option', function () {
    this.questions[99] = buildQuestion({ id: 99, type: 'radio', options: [] });
    this.vaues = { question_99: 'Hey' };
    expect(this.subject()).to.eql(0);
  });
});
