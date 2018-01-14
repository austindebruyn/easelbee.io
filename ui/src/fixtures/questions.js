export default {
  basic: {
    id: 1,
    userId: 1,
    formId: 1,
    title: 'What kind of drawing?',
    type: 'string',
    required: true,
    createdAt: 'Sun, 10 Dec 2017 22:00:09 GMT',
    updatedAt: 'Sun, 10 Dec 2017 22:00:09 GMT'
  },
  basic2: {
    id: 2,
    userId: 2,
    formId: 2,
    title: 'What is your name?',
    type: 'string',
    required: true,
    createdAt: 'Sun, 10 Dec 2017 22:00:09 GMT',
    updatedAt: 'Sun, 10 Dec 2017 22:00:09 GMT'
  },
  basicRadio: {
    id: 3,
    userId: 2,
    formId: 2,
    title: 'What best fruit?',
    type: 'radio',
    required: true,
    options: [
      {
        id: 0,
        value: 'Apple',
        createdAt: 'Sun, 10 Dec 2017 22:00:09 GMT',
        updatedAt: 'Sun, 10 Dec 2017 22:00:09 GMT'
      },
      {
        id: 1,
        value: 'Banana',
        createdAt: 'Sun, 10 Dec 2017 22:00:09 GMT',
        updatedAt: 'Sun, 10 Dec 2017 22:00:09 GMT'
      }
    ],
    createdAt: 'Sun, 10 Dec 2017 22:00:09 GMT',
    updatedAt: 'Sun, 10 Dec 2017 22:00:09 GMT'
  }
};
