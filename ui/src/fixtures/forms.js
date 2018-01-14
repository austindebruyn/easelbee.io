import Chance from 'chance';
const chance = new Chance();

export default {
  basic: {
    id: 1,
    userId: 1,
    name: 'Some Form',
    slug: 'some-form',
    publicUrl: 'http://local-easelbee.io:3000/forms/some-form',
    submitUrl: 'http://local-easelbee.io:3000/forms/some-form/submit',
    createdAt: 'Sun, 10 Dec 2017 22:00:09 GMT',
    updatedAt: 'Sun, 10 Dec 2017 22:00:09 GMT',
    submittedAt: null
  },
  basic2: {
    id: 2,
    userId: 2,
    name: 'Expensive Form',
    slug: 'expensive-form',
    publicUrl: 'http://local-easelbee.io:3000/forms/expensive-form',
    submitUrl: 'http://local-easelbee.io:3000/forms/expensive-form/submit',
    createdAt: 'Sun, 10 Dec 2017 22:00:09 GMT',
    updatedAt: 'Sun, 10 Dec 2017 22:00:09 GMT',
    submittedAt: null
  }
};

function buildForm (attrs = {}) {
  const record = {
    id: attrs.id || chance.integer({ min: 1, max: 1024 }),
    userId: attrs.userId || chance.integer({ min: 1, max: 1024 }),
    name: attrs.name || chance.word(),
    slug: attrs.name || chance.word(),
    createdAt: attrs.createdAt || new Date(chance.timestamp()).toUTCString(),
    updatedAt: attrs.updatedAt || new Date(chance.timestamp()).toUTCString(),
    submittedAt: 'submittedAt' in attrs ? attrs.submittedAt : new Date(chance.timestamp()).toUTCString()
  };

  record.publicUrl = `http://local-easelbee.io:3000/forms/${record.slug}`;
  record.submitUrl = `http://local-easelbee.io:3000/forms/${record.slug}/submit`;

  return record;
}

export { buildForm };
