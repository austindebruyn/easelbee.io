const Question = require('../domain/forms/Question');

module.exports = {
  up: function (q, Sequelize) {
    return Question.findAll()
      .then(function (questions) {
        return Promise.all(questions.map(question => {
          if (!question.formId) {
            question.deletedAt = new Date();
            return question.save();
          }
        }));
      })
      .then(function () {
        return q.removeColumn('questions', 'userId');
      });
  },
  down: function (q, Sequelize) {
    return q.addColumn('questions', 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    })
      .then(function () {
        return Question.findAll();
      })
      .then(function (questions) {
        return Promise.all(questions.map(question => {
          return question.getForm()
            .then(function (form) {
              question.userId = form.userId;
              return question.save();
            });
        }));
      })
      .then(function () {
        return q.changeColumn('questions', 'userId', {
          type: Sequelize.INTEGER,
          allowNull: false
        });
      });
  }
};
