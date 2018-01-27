/* global afterEach */

const _ = require('lodash');
const FactoryGirl = require('factory-girl');
const hashPassword = require('../domain/users/passwords').hash;
const User = require('../domain/users/User');
const EmailPreferences = require('../domain/emailPreferences/EmailPreferences');
const Commission = require('../domain/commissions/Commission');
const TimelineEvent = require('../domain/commissions/TimelineEvent');
const TimelineEventMeta = require('../domain/commissions/TimelineEventMeta');
const Form = require('../domain/forms/Form');
const Question = require('../domain/forms/Question');
const Answer = require('../domain/forms/Answer');
const AnswerTextValue = require('../domain/forms/AnswerTextValue');
const AnswerOptionValue = require('../domain/forms/AnswerOptionValue');
const QuestionOption = require('../domain/forms/QuestionOption');
const adapter = new FactoryGirl.SequelizeAdapter();
const uid = require('uid-safe');

const { factory } = FactoryGirl;

factory.setAdapter(adapter);

factory.define('user', User, {
  displayName: () => uid(10),
  password: () => uid(24),
  email: factory.chance('email')
}, {
  afterBuild: function (model, attrs) {
    return hashPassword(attrs.password || model.password).then(function (hash) {
      model.password = hash;
      return model;
    });
  }
});

factory.define('emailPreferences', EmailPreferences, {
  verificationCode: () => uid(24),
  userId: factory.assoc('user', 'id')
});

factory.define('commission', Commission, {
  email: factory.chance('email'),
  nickname: factory.chance('word'),
  userId: factory.assoc('user', 'id'),
  formId: factory.assoc('form', 'id')
});

factory.define('timelineEvent', TimelineEvent, {
  key: factory.chance('word'),
  commissionId: factory.assoc('commission', 'id')
});

factory.define('timelineEventMeta', TimelineEventMeta, {
  key: factory.chance('word'),
  value: factory.chance('word'),
  timelineEventId: factory.assoc('timelineEvent', 'id')
});

factory.define('form', Form, {
  slug: factory.chance('word'),
  name: factory.chance('word'),
  userId: factory.assoc('user', 'id'),
  submittedAt: () => null
});

factory.define('question', Question, {
  formId: factory.assoc('form', 'id'),
  title: factory.chance('sentence'),
  order: factory.chance('integer'),
  type: function () {
    const keys = Object.keys(Question.TYPES);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    return Question.TYPES[randomKey];
  }
});

factory.define('questionOption', QuestionOption, {
  questionId: factory.assoc('question', 'id'),
  value: factory.chance('word')
});

factory.define('answer', Answer, {
  questionId: factory.assoc('question', 'id'),
  commissionId: factory.assoc('commission', 'id')
}, {
  afterCreate: function (model, attrs, buildOpts = {}) {
    return Question.findById(attrs.questionId).then(function (question) {
      switch (question.type) {
        case Question.TYPES.radio:
          return question.getQuestionOptions()
            .then(questionOptions => {
              return AnswerOptionValue.create({
                answerId: model.id,
                questionOptionId: buildOpts.value || _.sample(questionOptions).id
              });
            }).then(() => model);
        case Question.TYPES.string:
          return AnswerTextValue.create({
            answerId: model.id,
            value: buildOpts.value || factory.chance('word')()
          }).then(() => model);
        default:
          throw new Error(`need factory for question type ${question.type}.`);
      }
    });
  }
});

afterEach(function () {
  return AnswerOptionValue.destroy({ truncate: true })
    .then(() => factory.cleanUp());
});

module.exports = factory;
