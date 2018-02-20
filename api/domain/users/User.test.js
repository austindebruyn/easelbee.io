const { expect } = require('chai');
const factory = require('../../tests/factory');

describe('User', function () {
  describe('#toJSON', function () {
    beforeEach(async function () {
      this.user = await factory.create('user');
    });

    it('hides email if user is anonymous', async function () {
      const json = await this.user.toJSON();
      expect(json).to.have.property('id');
      expect(json).to.have.property('displayName');
      expect(json).to.not.have.property('email');
    });

    it('hides email if user is someone else', async function () {
      const otherUser = await factory.create('user');
      const json = await this.user.toJSON(otherUser);
      expect(json).to.have.property('id');
      expect(json).to.have.property('displayName');
      expect(json).to.not.have.property('email');
    });

    it('shows email if user is themselves', async function () {
      const json = await this.user.toJSON(this.user);
      expect(json).to.have.property('id');
      expect(json).to.have.property('displayName');
      expect(json).to.have.property('email');
    });
  });
});
