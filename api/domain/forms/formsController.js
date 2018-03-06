const Form = require('./Form');
const Question = require('./Question');
const Option = require('./Option');
const User = require('../users/User');
const FormSubmitter = require('./FormSubmitter');
const {
  NotFoundError,
  UnauthorizedError
} = require('../../core/errors');
const { Op } = require('../../services/db').Sequelize;
const config = require('../../config');

module.exports.get = function (req, res, next) {
  if (!req.accepts('html')) {
    return res.sendStatus(406);
  }

  async function handle() {
    return res.render('forms/get', {
      user: req.user ? await req.user.toJSON(req.user) : null,
      context: {
        sentry: {
          public: config.app.sentry.public
        }
      }
    });
  }

  handle().catch(next);
};

module.exports.getJson = function (req, res, next) {
  async function handle() {
    const { slug } = req.params;
    const form = await Form.findOne({
      where: {
        slug,
        deletedAt: { [Op.eq]: null }
      },
      include: [User]
    });

    if (!form) throw new NotFoundError();

    return res.json({
      ok: true,
      record: await form.toJSON(),
      user: await form.user.toJSON(req.user)
    });
  }
  handle().catch(next);
};

module.exports.submit = function (req, res, next) {
  const { slug } = req.params;

  async function handle() {
    const form = await Form.findOne({ where: { slug }, include: [User] });

    if (!form) {
      return res.status(404).render('notFound');
    }
    const submitter = new FormSubmitter(form);
    const commission = await submitter.submit(req.body);

    return res.json({
      ok: true,
      record: await commission.toJSON()
    });
  }

  handle().catch(next);
};

module.exports.index = function (req, res, next) {
  async function handle() {
    const forms = await Form.findAll({
      where: {
        userId: req.user.id,
        deletedAt: { [Op.eq]: null }
      },
      include: [{
        model: Question,
        where: { deletedAt: { [Op.eq]: null } },
        include: [Option],
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
  async function handle() {
    let i;
    for (i = 1; i <= 1024; i++) {
      const count = await Form.count({
        where: {
          userId: req.user.id,
          [Op.or]: [
            { name: `Untitled Form #${i}` },
            { slug: `untitled-form-${i}` }
          ]
        }
      });

      if (count < 1) break;
    }

    const form = await Form.create({
      userId: req.user.id,
      slug: `untitled-form-${i}`,
      name: `Untitled Form #${i}`
    });

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

module.exports.destroy = function (req, res, next) {
  async function handle() {
    const form = await Form.findById(req.params.id);

    if (!form) throw new NotFoundError();

    if (form.userId !== req.user.id) throw new UnauthorizedError();

    form.deletedAt = new Date();
    await form.save();

    return res.json({
      ok: true
    });
  }

  handle().catch(next);
};
