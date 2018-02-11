import Chance from 'chance';

const chance = new Chance();

export default {
  basic: {
    id: 1,
    userId: 1,
    email: 'elon@musk.com',
    nickname: 'Elon Musk',
    status: 'incoming',
    createdAt: 'Sun, 10 Dec 2017 22:00:09 GMT',
    updatedAt: 'Sun, 10 Dec 2017 22:00:09 GMT'
  },
  inprogress: {
    id: 2,
    userId: 1,
    email: 'abraham@lincon.com',
    nickname: 'Abraham Lincoln',
    status: 'inprogress',
    createdAt: 'Sun, 10 Dec 2017 22:00:09 GMT',
    updatedAt: 'Sun, 10 Dec 2017 22:00:09 GMT'
  },
  long: {
    id: 4,
    userId: 1,
    email: 'austin@eslb.io',
    nickname: 'Austin',
    status: 'incoming',
    createdAt: 'Sun, 10 Dec 2017 22:00:09 GMT',
    updatedAt: 'Sun, 10 Dec 2017 22:00:09 GMT'
  }
};

export function buildCommission (attrs = {}) {
  const randomStatus = [
    'incoming',
    'inprogress',
    'inreview',
    'finished',
    'canceled'
  ][Math.random() * 5];

  return {
    id: attrs.id || chance.integer({ min: 1, max: 1024 }),
    userId: attrs.userId || chance.integer({ min: 1, max: 1024 }),
    email: attrs.email || chance.email(),
    nickname: attrs.nickname || chance.word(),
    status: attrs.status || randomStatus,
    createdAt: attrs.createdAt || new Date(chance.timestamp()).toUTCString(),
    updatedAt: attrs.updatedAt || new Date(chance.timestamp()).toUTCString()
  };
}
