import Chance from 'chance';

const chance = new Chance();

export default {
  basic: {
    id: 1,
    formId: 1,
    title: 'What kind of drawing?',
    type: 'string',
    required: true,
    order: 1,
    createdAt: 'Sun, 10 Dec 2017 22:00:09 GMT',
    updatedAt: 'Sun, 10 Dec 2017 22:00:09 GMT'
  },
  basic2: {
    id: 2,
    formId: 2,
    title: 'What is your name?',
    type: 'string',
    required: true,
    order: 2,
    createdAt: 'Sun, 10 Dec 2017 22:00:09 GMT',
    updatedAt: 'Sun, 10 Dec 2017 22:00:09 GMT'
  },
  basicRadio: {
    id: 3,
    formId: 2,
    title: 'What best fruit?',
    type: 'radio',
    required: true,
    order: 3,
    options: [
      {
        id: 0,
        questionId: 3,
        value: 'Apple',
        createdAt: 'Sun, 10 Dec 2017 22:00:09 GMT',
        updatedAt: 'Sun, 10 Dec 2017 22:00:09 GMT'
      },
      {
        id: 1,
        questionId: 3,
        value: 'Banana',
        createdAt: 'Sun, 10 Dec 2017 22:00:09 GMT',
        updatedAt: 'Sun, 10 Dec 2017 22:00:09 GMT'
      }
    ],
    createdAt: 'Sun, 10 Dec 2017 22:00:09 GMT',
    updatedAt: 'Sun, 10 Dec 2017 22:00:09 GMT'
  }
};

export function buildOption (attrs = {}) {
  const id = attrs.id || chance.integer({ min: 1, max: 1024 });
  const objectKey = attrs.optionAttachment
    ? attrs.optionAttachment.objectKey || chance.word()
    : null;
  const optionAttachment = attrs.optionAttachment
    ? {
      id: chance.integer({ min: 1, max: 1024 }),
      optionId: id,
      createdAt: attrs.optionAttachment.createdAt || new Date(chance.timestamp()).toUTCString(),
      updatedAt: attrs.optionAttachment.updatedAt || new Date(chance.timestamp()).toUTCString(),
      objectKey,
      url: `/uploads/${objectKey}`
    } : null;
  return {
    id,
    questionId: attrs.questionId || chance.integer({ min: 1, max: 1024 }),
    value: attrs.value,
    createdAt: attrs.createdAt || new Date(chance.timestamp()).toUTCString(),
    updatedAt: attrs.updatedAt || new Date(chance.timestamp()).toUTCString(),
    optionAttachment,
    delta: null
  };
}

export function buildQuestion (attrs = {}) {
  const question = {
    id: attrs.id || chance.integer({ min: 1, max: 1024 }),
    formId: attrs.formId || chance.integer({ min: 1, max: 1024 }),
    title: attrs.title || chance.sentence(),
    type: attrs.type || 'string',
    required: true,
    options: null,
    order: attrs.order || chance.integer({ min: 1, max: 99 }),
    createdAt: attrs.createdAt || new Date(chance.timestamp()).toUTCString(),
    updatedAt: attrs.updatedAt || new Date(chance.timestamp()).toUTCString()
  };

  if (question.type === 'radio') {
    question.options = attrs.options.map(function (optionAttrs) {
      return buildOption(Object.assign({ questionId: question.id }, optionAttrs));
    });
  }

  return question;
}
