const _ = require('lodash');
const Commission = require('./Commission');
const FilloutFetcher = require('../forms/FilloutFetcher');
const {
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError
} = require('../../core/errors');

module.exports.index = function (req, res, next) {
  return Commission.findAll({ where: { userId: req.user.id } })
    .then(function (records) {
      return Promise.all(records.map(r => r.toJSON()));
    })
    .then(function (json) {
      return res.json({
        ok: true,
        records: json
      });
    })
    .catch(next);
};

module.exports.getFillout = function (req, res, next) {
  return Commission.findById(req.params.id)
    .then(function (commission) {
      if (!commission) {
        throw new NotFoundError();
      }

      const fetcher = new FilloutFetcher(commission);
      return fetcher.toJSON();
    })
    .then(function (record) {
      return res.json({ ok: true, record });
    })
    .catch(next);
};

module.exports.create = function (req, res, next) {
  const {
    email,
    nickname
  } = req.body;

  return Commission.create({ userId: req.user.id, email, nickname })
    .then(record => record.toJSON())
    .then(function (record) {
      return res.json({
        ok: true,
        record
      });
    })
    .catch(function () {
      return next(new UnprocessableEntityError());
    });
};

module.exports.update = function (req, res, next) {
  const { id } = req.params;

  return Commission.findOne({ where: { id } })
    .then(function (record) {
      if (!record) {
        throw new NotFoundError();
      }
      if (record.userId !== req.user.id) {
        throw new UnauthorizedError();
      }

      const attributeKeys = Object.keys(req.body);
      const allowedAttributes = [ 'status' ];
      const forbiddenAttributes = _.difference(attributeKeys, allowedAttributes);
      if (forbiddenAttributes.length > 0) {
        throw new UnprocessableEntityError('bad-attributes', {
          fields: forbiddenAttributes
        });
      }
      const { body } = req;
      if ('status' in body) {
        if (!Object.keys(Commission.STATUS).includes(body.status)) {
          throw new UnprocessableEntityError('no-such-status', {
            status: body.status
          });
        }
        body.status = Commission.STATUS[body.status];
      }

      Object.assign(record, body);
      return record.save();
    })
    .then(function (record) {
      return record.toJSON();
    })
    .then(function (json) {
      return res.json({ ok: true, record: json });
    })
    .catch(next);
};
