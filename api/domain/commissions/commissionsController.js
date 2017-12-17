const Commission = require('./Commission');
const _ = require('lodash');

class CommissionsControllerError extends Error {
  constructor(code, data = {}) {
    super();
    this.name = 'CommissionsControllerError';
    this.code = code;
    Object.assign(this, data);
  }

  toJSON() {
    if (this.fields) {
      return { code: this.code, fields: this.fields };
    }
    return { code: this.code };
  }
}

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

module.exports.create = function (req, res, next) {
  const {
    email,
    body
  } = req.body;

  return Commission.create({ userId: req.user.id, email, body })
    .then(record => record.toJSON())
    .then(function (record) {
      return res.json({
        ok: true,
        record
      });
    })
    .catch(function () {
      return res.status(422).json({
        ok: false
      });
    });
};

module.exports.update = function (req, res, next) {
  const { id } = req.params;

  return new Promise(function (resolve, reject) {
    return Commission.findOne({ where: { id } })
      .then(function (record) {
        if (!record) {
          throw new CommissionsControllerError('not-found');
        }
        if (record.userId !== req.user.id) {
          throw new CommissionsControllerError('unauthorized');
        }

        const attributeKeys = Object.keys(req.body);
        const allowedAttributes = [ 'status' ];
        const forbiddenAttributes = _.difference(attributeKeys, allowedAttributes);
        if (forbiddenAttributes.length > 0) {
          return reject(new CommissionsControllerError('bad-attributes', {
            fields: forbiddenAttributes
          }));
        }
        const { body } = req;
        if ('status' in body) {
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
      .catch(function (err) {
        if (err.name === 'CommissionsControllerError') {
          return res.status(422).json({ ok: false, errors: [err.toJSON()] });
        }
        return next(err);
      });
  });
};
