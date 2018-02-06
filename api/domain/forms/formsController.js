const Form = require('./Form');
const Question = require('./Question');
const QuestionOption = require('./QuestionOption');
const User = require('../users/User');
const FormSubmitter = require('./FormSubmitter');
const {
  NotFoundError,
  UnauthorizedError
} = require('../../core/errors');
const { Op } = require('../../services/db').Sequelize;

module.exports.get = function (req, res, next) {
  const { slug } = req.params;

  if (!req.accepts('html')) {
    return res.sendStatus(406);
  }

  async function handle() {
    const form = await Form.findOne({
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
    });

    if (!form) throw new NotFoundError();

    return res.render('forms/get', {
      form: await form.toJSON(),
      user: form.user,
      isOwnerView: req.user && req.user.id === form.userId
    });
  }

  handle().catch(function (err) {
    if (err.name === 'NotFoundError') {
      return res.status(404).render('notFound');
    }
    return next(err);
  });
};

module.exports.submit = function (req, res, next) {
  const { slug } = req.params;

  if (!req.accepts('html')) {
    return res.sendStatus(406);
  }

  async function handle() {
    const form = await Form.findOne({ where: { slug }, include: [User] });

    if (!form) {
      return res.status(404).render('notFound');
    }
    const submitter = new FormSubmitter(form);
    await submitter.submit(req.body);

    return res.render('forms/submit', {
      user: form.user
    });
  }

  handle().catch(next);
};

module.exports.index = function (req, res, next) {
  async function handle() {
    const forms = await Form.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Question,
        where: { deletedAt: { [Op.eq]: null } },
        include: [QuestionOption],
        required: false
      }]
    });

    const formJsons = await Promise.all(forms.map(r => r.toJSON()));
    return res.json({
      ok: true,
      records: formJsons
    });
  }

  handle().catch(next);
};

module.exports.create = function (req, res, next) {
  const {
    slug,
    name
  } = req.body;

  async function handle() {
    const form = await Form.create({ userId: req.user.id, slug, name });
    return res.json({
      ok: true,
      record: await form.toJSON()
    });
  }

  handle().catch(next);
};

module.exports.update = function (req, res, next) {
  const { id } = req.params;

  async function handle() {
    const form = await Form.findById(id);

    if (!form) throw new NotFoundError();

    if (form.userId !== req.user.id) throw new UnauthorizedError();

    for (let key in req.body) {
      if (['name'].includes(key)) {
        Object.assign(form, { [key]: req.body[key] });
      }
    }

    await form.save();

    return res.json({
      ok: true,
      record: await form.toJSON()
    });
  }

  handle().catch(next);
};

module.exports.createQuestion = function (req, res, next) {
  async function handle() {
    const form = await Form.findById(req.params.id, {
      include: [
        {
          model: Question,
          where: { deletedAt: { [Op.eq]: null } },
          required: false
        }
      ]
    });

    if (!form) throw new NotFoundError();

    if (form.userId !== req.user.id) throw new UnauthorizedError();

    const order = form.questions.length + 1;

    const question = await Question.create({
      formId: form.id,
      order,
      type: Question.TYPES.string,
      title: `Question #${order}`,
      required: false
    });

    return res.json({
      ok: true,
      record: await question.toJSON()
    });
  }

  handle().catch(next);
};
