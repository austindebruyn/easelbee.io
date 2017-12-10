const Form = require('./Form');
const User = require('../users/User');

module.exports.get = function (req, res, next) {
  const { slug } = req.params;

  return Form.findOne({ where: { slug }, include: [User] })
    .then(function (record) {
      if (req.accepts('html')) {
        if (!record) {
          return res.status(404).render('notFound');
        }
        return res.render('forms/get', {
          form: record,
          isOwnerView: req.user && req.user.id === record.user.id
        });
      }
    })
    .catch(next);
};

module.exports.index = function (req, res, next) {
  return Form.findAll({ where: { userId: req.user.id } })
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
    slug,
    name
  } = req.body;

  return Form.create({ userId: req.user.id, slug, name })
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
