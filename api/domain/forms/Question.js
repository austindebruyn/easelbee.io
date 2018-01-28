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
    default: false
  },
  order: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  deletedAt: {
    type: db.Sequelize.DATE
  }
}, {
  tableName: 'questions',
  freezeTableName: true,
  name: {
    singular: 'question'
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
 * Returns whether or not this question has associated QuestionOption models.
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
 * Promises to ensure that `questionOptions` are eager loaded on this instance.
 * @returns {Promise}
 */
Question.prototype.ensureQuestionOptions = function () {
  return new Promise((resolve, reject) => {
    if (this.questionOptions) return resolve(this);

    return this.getQuestionOptions()
      .then(questionOptions => {
        this.questionOptions = questionOptions;
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
      required
    } = this.get();

    const attrs = {
      id,
      formId,
      title,
      required,
      type: invert(Question.TYPES)[type],
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString()
    };

    // If this question can include `questionOptions`, like a radio or checkbox
    // question would, then eager load those before serializing.
    if ([ Question.TYPES.radio, Question.TYPES.checkbox ].includes(type)) {
      return this.ensureQuestionOptions()
        .then(() => Promise.all(this.questionOptions.map(r => r.toJSON())))
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
