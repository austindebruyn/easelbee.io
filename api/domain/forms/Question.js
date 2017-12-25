const db = require('../../services/db');
const Form = require('./Form');

const Question = db.define('questions', {
  title: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  type: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    default: 0
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
      type
    } = this.get();

    const attrs = {
      id,
      formId,
      title,
      type,
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

module.exports = Question;
