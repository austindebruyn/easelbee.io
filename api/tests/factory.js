/* global afterEach */

const FactoryGirl = require('factory-girl');
const hashPassword = require('../domain/users/passwords').hash;
const User = require('../domain/users/User');
const EmailPreferences = require('../domain/emailPreferences/EmailPreferences');
const Commission = require('../domain/commissions/Commission');
const Form = require('../domain/forms/Form');
const Question = require('../domain/forms/Question');
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
  body: factory.chance('paragraph', { sentences: 2 }),
  userId: factory.assoc('user', 'id')
});

factory.define('form', Form, {
  slug: factory.chance('word'),
  name: factory.chance('word'),
  userId: factory.assoc('user', 'id')
});

factory.define('question', Question, {
  formId: factory.assoc('form', 'id'),
  title: factory.chance('sentence'),
  type: function () {
    const keys = Object.keys(Question.TYPES);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    return Question.TYPES[randomKey];
  }
});

factory.define('questionOption', QuestionOption, {
  questionId: factory.assoc('question', 'id'),
  text: factory.chance('word')
});

afterEach(function () {
  return factory.cleanUp();
});

module.exports = factory;
