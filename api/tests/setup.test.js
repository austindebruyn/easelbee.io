const db = require('../services/db');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const queue = require('kue').createQueue();
chai.use(sinonChai);
chai.use(chaiAsPromised);

beforeEach(async function () {
  await db.sync({ force: true });
});

afterEach(function () {
  queue.testMode.clear();
});

before(function () {
  queue.testMode.enter();
});

after(function () {
  queue.testMode.exit();
});
