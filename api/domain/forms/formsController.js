const Form = require('./Form');
const User = require('../users/User');
const Commission = require('../commissions/Commission');

class FormsControllerError extends Error {
  constructor(code, data = {}) {
    super();
    this.name = 'FormsControllerError';
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

module.exports.get = function (req, res, next) {
  const { slug } = req.params;
  const state = {};

  if (!req.accepts('html')) {
    return res.sendStatus(406);
  }

  return Form.findOne({ where: { slug }, include: [User] })
    .then(function (record) {
      if (!record) {
        throw new FormsControllerError('NOT_FOUND');
      }
      state.form = record;
      state.user = record.user;
      return record;
    })
    .then(record => record.toJSON())
    .then(function (record) {
      return res.render('forms/get', {
        form: record,
        user: state.user,
        isOwnerView: req.user && req.user.id === record.userId
      });
    })
    .catch(function (err) {
      if (err.code === 'NOT_FOUND') {
        return res.status(404).render('notFound');
      }
      return next(err);
    });
};

module.exports.submit = function (req, res, next) {
  const { slug } = req.params;
  const state = {};

  if (!req.accepts('html')) {
    return res.sendStatus(406);
  }

  return Form.findOne({ where: { slug }, include: [User] })
    .then(function (record) {
      state.form = record;

      if (!record) {
        return res.status(404).render('notFound');
      }
      return record;
    })
    .then(function (record) {
      const { email, body } = req.body;

      return Commission.create({
        formId: record.id,
        userId: record.userId,
        email,
        body
      });
    })
    .then(function () {
      return res.render('forms/submit', {
        user: state.form.user
      });
    })
    .catch(function () {
      return res.status(500).render('forms/error');
    });
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
