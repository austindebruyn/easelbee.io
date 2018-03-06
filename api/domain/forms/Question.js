const db = require('../../services/db');
const Form = require('./Form');
const invert = require('lodash.invert');

const Question = db.define('questions', {
  title: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  type: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    default: 0
  },
  required: {
    type: db.Sequelize.BOOLEAN,
    allowNull: false,
    default: false
  },
  order: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  deletedAt: {
    type: db.Sequelize.DATE
  }
});

Question.TYPES = {
  radio: 0,
  checkbox: 1,
  string: 2,
  text: 3,
  madlib: 4,
  images: 5
};

/**
 * Returns whether or not this question has associated Option models.
 * @returns {Boolean}
 */
Question.prototype.isMultipleChoice = function () {
  return [Question.TYPES.checkbox, Question.TYPES.radio].includes(this.type);
};

/**
 * Promises to ensure that `form` is eager loaded on this instance.
 * @returns {Promise}
 */
Question.prototype.ensureForm = function () {
  return new Promise((resolve, reject) => {
    if (this.form) return resolve(this);

    return this.getForm()
      .then(form => {
        this.form = form;
        return resolve(this);
      })
      .catch(reject);
  });
};

/**
 * Promises to ensure that `options` are eager loaded on this instance.
 * @returns {Promise}
 */
Question.prototype.ensureOptions = function () {
  return new Promise((resolve, reject) => {
    if (this.options) return resolve(this);

    return this.getOptions()
      .then(options => {
        this.options = options;
        return resolve(this);
      })
      .catch(reject);
  });
};

/**
 * Promises to serialize this Form instance as a JSON.
 * @returns {Promise}
 */
Question.prototype.toJSON = function () {
  return new Promise((resolve, reject) => {
    const {
      id,
      formId,
      createdAt,
      updatedAt,
      title,
      type,
      required,
      order
    } = this.get();

    const attrs = {
      id,
      formId,
      title,
      required,
      order,
      type: invert(Question.TYPES)[type],
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString()
    };

    // If this question can include `options`, like a radio or checkbox
    // question would, then eager load those before serializing.
    if ([ Question.TYPES.radio, Question.TYPES.checkbox ].includes(type)) {
      return this.ensureOptions()
        .then(() => Promise.all(this.options.map(r => r.toJSON())))
        .then(optionJsons => {
          return resolve({
            ...attrs,
            options: optionJsons
          });
        })
        .catch(reject);
    }

    return resolve(attrs);
  });
};

Question.belongsTo(Form);
Form.hasMany(Question);

Question.belongsTo(Question, {
  as: 'originalQuestion',
  foreignKey: 'originalQuestionId'
});

module.exports = Question;
