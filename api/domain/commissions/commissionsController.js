const Commission = require('./Commission');

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
