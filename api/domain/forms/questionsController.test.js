const agent = require('../../tests/agent');
const signIn = require('../../tests/signIn');
const clock = require('../../tests/clock');
const factory = require('../../tests/factory');
const expect = require('chai').expect;
const sinon = require('sinon');
const Question = require('./Question');
const QuestionUpdater = require('./QuestionUpdater');

describe('questionsController', function () {
  clock();

  describe('PATCH /api/questions/:id', function () {
    beforeEach(async function () {
      this.form = await factory.create('form');
      this.question = await factory.create('question', {
        formId: this.form.id
      });
      this.user = await this.form.getUser();

      this.sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      this.sandbox.restore();
    });

    it('should 403', function () {
      return agent()
        .patch('/api/questions/999')
        .send({ title: 'Have a good time?' })
        .cookiejar()
        .accept('application/json')
        .expect(403);
    });

    describe('when signed in', function () {
      beforeEach(function () {
        return signIn(this.user);
      });

      it('should 404 when not exist', function () {
        return agent()
          .patch('/api/questions/999')
          .send({ title: 'Have a good time?' })
          .cookiejar()
          .accept('application/json')
          .expect(404);
      });

      describe('when form belongs to someone else', function () {
        beforeEach(async function () {
          this.otherForm = await factory.create('form');
          this.otherQuestion = await factory.create('question', {
            formId: this.otherForm.id
          });
        });

        it('should 403', function () {
          return agent()
            .patch(`/api/questions/${this.otherQuestion.id}`)
            .cookiejar()
            .accept('application/json')
            .expect(403);
        });
      });

      describe('when user owns question', function () {
        it('should 422 when empty body', function () {
          return agent()
            .patch(`/api/questions/${this.question.id}`)
            .send({ })
            .cookiejar()
            .accept('application/json')
            .expect(422, {
              ok: false,
              code: 'no-attributes'
            });
        });

        it('should 422 when bad attributes', function () {
          return agent()
            .patch(`/api/questions/${this.question.id}`)
            .send({ title: 'Hello!', id: -99, createdAt: 'haha hacked' })
            .cookiejar()
            .accept('application/json')
            .expect(422, {
              ok: false,
              code: 'bad-attributes',
              fields: [ 'id', 'createdAt' ]
            });
        });

        it('should error on bad type', function () {
          return agent()
            .patch(`/api/questions/${this.question.id}`)
            .send({ title: 'Hello!', type: 'banana' })
            .cookiejar()
            .accept('application/json')
            .expect(422, {
              ok: false,
              code: 'bad-type',
              fields: { type: 'banana' }
            });
        });

        it('should update model', function () {
          this.sandbox
            .stub(QuestionUpdater.prototype, 'update')
            .resolves(this.question);

          const body = {
            title: 'What kind of car do you drive?',
            options: [],
            type: 'string'
          };

          return agent()
            .patch(`/api/questions/${this.question.id}`)
            .send(body)
            .cookiejar()
            .accept('application/json')
            .expect(200)
            .then(res => {
              expect(res.body.ok).to.be.true;
              expect(res.body.record).to.include({ id: this.question.id });

              expect(QuestionUpdater.prototype.update)
                .to.have.been.calledWith({
                  title: 'What kind of car do you drive?',
                  options: [],
                  type: Question.TYPES.string
                });
            });
        });
      });
    });
  });

  describe('DELETE /api/questions/:id', function () {
    beforeEach(async function () {
      this.form = await factory.create('form');

      this.questions = [];
      for (let i = 1; i <= 3; i++) {
        this.questions.push(await factory.create('question', {
          order: i,
          formId: this.form.id
        }));
      }
      this.user = await this.form.getUser();

      this.sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      this.sandbox.restore();
    });

    it('should 403', function () {
      return agent()
        .delete('/api/questions/999')
        .cookiejar()
        .accept('application/json')
        .expect(403);
    });

    describe('when signed in', function () {
      beforeEach(function () {
        return signIn(this.user);
      });

      it('should 404 when not exist', function () {
        return agent()
          .delete('/api/questions/999')
          .cookiejar()
          .accept('application/json')
          .expect(404);
      });

      describe('when form belongs to someone else', function () {
        beforeEach(async function () {
          this.otherForm = await factory.create('form');
          this.otherQuestion = await factory.create('question', {
            formId: this.otherForm.id
          });
        });

        it('should 403', function () {
          return agent()
            .delete(`/api/questions/${this.otherQuestion.id}`)
            .cookiejar()
            .accept('application/json')
            .expect(403);
        });
      });

      describe('when user owns question', function () {
        it('should 204', async function () {
          await agent()
            .delete(`/api/questions/${this.questions[1].id}`)
            .cookiejar()
            .accept('application/json')
            .expect(204);
        });

        it('should set deletedAt', async function () {
          await agent()
            .delete(`/api/questions/${this.questions[1].id}`)
            .cookiejar()
            .accept('application/json');
          const questions = await this.form.getQuestions();
          expect(questions[0].deletedAt).to.be.null;
          expect(questions[1].deletedAt).to.eql(new Date());
          expect(questions[2].deletedAt).to.be.null;
        });

        it('should preserve order', async function () {
          await agent()
            .delete(`/api/questions/${this.questions[1].id}`)
            .cookiejar()
            .accept('application/json');
          const questions = await this.form.getQuestions();
          expect(questions[0].order).to.eql(1);
          expect(questions[1].order).to.eql(2);
          expect(questions[2].order).to.eql(2);
        });
      });
    });
  });
});
