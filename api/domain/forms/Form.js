const db = require('../../services/db');
const User = require('../users/User');
const buildUrl = require('../../lib/buildUrl');

const Form = db.define('forms', {
  name: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: db.Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  submittedAt: {
    type: db.Sequelize.DATE,
    allowNull: true
  },
  deletedAt: {
    type: db.Sequelize.DATE
  }
}, {
  tableName: 'forms',
  freezeTableName: true,
  name: {
    singular: 'form'
  }
});

/**
 * Promises to ensure that `questions` are eager loaded on this instance.
 * @returns {Promise}
 */
Form.prototype.ensureQuestions = function () {
  return new Promise((resolve, reject) => {
    if (this.questions) return resolve(this);

    return this.getQuestions()
      .then(questions => {
        this.questions = questions;
        return resolve(this);
      })
      .catch(reject);
  });
};

/**
 * Promises to serialize this Form instance as a JSON.
 * @returns {Promise}
 */
Form.prototype.toJSON = function () {
  return new Promise((resolve, reject) => {
    const {
      id,
      userId,
      createdAt,
      updatedAt,
      submittedAt,
      name,
      slug
    } = this.get();

    return this.ensureQuestions().then(() => {
      this.questions.sort(function (a, b) {
        return a.order - b.order;
      });
      const jsons = this.questions
        .filter(q => !q.deletedAt)
        .map(q => q.toJSON());

      return Promise.all(jsons).then(questions => {
        return resolve({
          id,
          userId,
          name,
          slug,
          publicUrl: buildUrl(`forms/${slug}`),
          submitUrl: buildUrl(`forms/${slug}/submit`),
          createdAt: createdAt && createdAt.toUTCString(),
          updatedAt: updatedAt && updatedAt.toUTCString(),
          submittedAt: submittedAt ? submittedAt.toUTCString() : submittedAt,
          questions
        });
      });
    })
      .catch(reject);
  });
};

Form.belongsTo(User);
User.hasOne(Form);

module.exports = Form;
