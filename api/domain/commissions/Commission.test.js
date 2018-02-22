const Price = require('./Price');
const { expect } = require('chai');
const factory = require('../../tests/factory');
const clock = require('../../tests/clock');

describe('Commission', function () {
  clock();

  describe('#toJSON', function () {
    it('should return attributes', async function () {
      const commission = await factory.create('commission', {
        id: 1,
        userId: 1,
        email: 'jordan@claverr.life',
        nickname: 'Jordan Claverr'
      });

      const json = await commission.toJSON();
      expect(json).to.include({
        id: 1,
        userId: 1,
        createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
        updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
        email: 'jordan@claverr.life',
        nickname: 'Jordan Claverr',
        price: null,
        adjustedPrice: null
      });
    });

    it('should return price', async function () {
      const commission = await factory.create('commission');
      await factory.create('price', {
        commissionId: commission.id,
        amount: 15.75
      });
      const json = await commission.toJSON();
      expect(json.price).to.eql(15.75);
    });

    it('should return old price and adjusted price', async function () {
      const commission = await factory.create('commission');
      await factory.create('price', {
        commissionId: commission.id,
        amount: 15.75
      });
      await factory.create('price', {
        commissionId: commission.id,
        type: Price.TYPES.manual,
        amount: 299.99
      });
      const json = await commission.toJSON();
      expect(json.price).to.eql(15.75);
      expect(json.adjustedPrice).to.eql(299.99);
    });
  });
});
