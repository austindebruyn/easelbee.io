const Form = require('./Form');
const Question = require('./Question');
const QuestionOption = require('./QuestionOption');
const User = require('../users/User');
const FormSubmitter = require('./FormSubmitter');
const { NotFoundError } = require('../../core/errors');
const { Op } = require('../../services/db').Sequelize;

module.exports.get = function (req, res, next) {
  const { slug } = req.params;
  const state = {};

  if (!req.accepts('html')) {
    return res.sendStatus(406);
  }

  return Form.findOne({
    where: { slug },
    include: [
      User,
      {
        model: Question,
        where: { deletedAt: { [Op.eq]: null } },
        required: false,
        include: [QuestionOption]
      }
    ]
  })
    .then(function (record) {
      if (!record) {
        throw new NotFoundError();
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
      if (err.name === 'NotFoundError') {
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
      const submitter = new FormSubmitter(state.form);
      return submitter.submit(req.body);
    })
    .then(function () {
      return res.render('forms/submit', {
        user: state.form.user
      });
    })
    .catch(next);
};

module.exports.index = function (req, res, next) {
  return Form.findAll({
    where: { userId: req.user.id },
    include: [{
      model: Question,
      where: { deletedAt: { [Op.eq]: null } },
      include: [QuestionOption],
      required: false
    }]
  })
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
