import Chance from 'chance';

const chance = new Chance();

export default {
  basic: {
    id: 1,
    commissionId: 1,
    key: 'status-change',
    metas: [
      {
        id: 1,
        timelineEventId: 1,
        key: 'old',
        value: 'incoming',
        createdAt: 'Sun, 17 Dec 2017 22:00:09 GMT',
        updatedAt: 'Sun, 17 Dec 2017 22:00:09 GMT'
      },
      {
        id: 2,
        timelineEventId: 1,
        key: 'new',
        value: 'inprogress',
        createdAt: 'Sun, 17 Dec 2017 22:00:09 GMT',
        updatedAt: 'Sun, 17 Dec 2017 22:00:09 GMT'
      }
    ],
    createdAt: 'Sun, 17 Dec 2017 22:00:09 GMT',
    updatedAt: 'Sun, 17 Dec 2017 22:00:09 GMT'
  }
};

chance.mixin({
  id: function () {
    return chance.integer({ min: 1, max: 1024 });
  }
});

function buildEvent (attrs = {}) {
  const metas = attrs.metas || [];
  const id = attrs.id || chance.id();

  return {
    id,
    commissionId: attrs.commissionId || chance.id(),
    key: attrs.key || chance.word(),
    createdAt: attrs.createdAt || new Date(chance.timestamp()).toUTCString(),
    updatedAt: attrs.createdAt || new Date(chance.timestamp()).toUTCString(),
    metas: metas.map(function (metaAttrs) {
      return {
        id: metaAttrs.id || chance.id(),
        timelineEventId: id,
        key: metaAttrs.key || chance.word(),
        value: metaAttrs.value || chance.word(),
        createdAt: attrs.createdAt || new Date(chance.timestamp()).toUTCString(),
        updatedAt: attrs.createdAt || new Date(chance.timestamp()).toUTCString()
      };
    })
  };
}

export { buildEvent };
