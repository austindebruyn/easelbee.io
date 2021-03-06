const agent = require('../../tests/agent');
const signIn = require('../../tests/signIn');
const clock = require('../../tests/clock');
const factory = require('../../tests/factory');
const expect = require('chai').expect;
const sinon = require('sinon');
const Question = require('./Question');
const Delta = require('./Delta');
const QuestionUpdater = require('./QuestionUpdater');
const LocalAttachmentSaver = require('../attachments/LocalAttachmentSaver');

describe('questionsController', function () {
  clock();

  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  describe('PATCH /api/questions/:id', function () {
    beforeEach(async function () {
      this.form = await factory.create('form');
      this.question = await factory.create('question', {
        formId: this.form.id
      });
      this.user = await this.form.getUser();
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

  describe('PUT /api/options/:id/delta', function () {
    beforeEach(async function () {
      this.user = await factory.create('user');
      this.form = await factory.create('form', { userId: this.user.id });
      this.question = await factory.create('question', {
        formId: this.form.id,
        type: Question.TYPES.radio
      });
      this.option = await factory.create('option', {
        questionId: this.question.id
      });
    });

    it('should 403 if signed out', function () {
      return agent()
        .put(`/api/options/${this.option.id}/delta`)
        .send({})
        .accept('application/json')
        .expect(403);
    });

    describe('when signed in', function () {
      beforeEach(async function () {
        await signIn(this.user);
      });

      it('should 404 if not found', function () {
        return agent()
          .put('/api/options/999/delta')
          .cookiejar()
          .accept('application/json')
          .expect(404);
      });

      it('should 403 if not owner', async function () {
        const otherForm = await factory.create('form');
        const otherQuestion = await factory.create('question', {
          formId: otherForm.id,
          type: Question.TYPES.radio
        });
        const otherOption = await factory.create('option', {
          questionId: otherQuestion.id
        });
        return agent()
          .put(`/api/options/${otherOption.id}/delta`)
          .send({ type: 'base', amount: 10 })
          .cookiejar()
          .accept('application/json')
          .expect(403);
      });

      it('should error if no type', async function () {
        await agent()
          .put(`/api/options/${this.option.id}/delta`)
          .send({ amount: 10 })
          .cookiejar()
          .accept('application/json')
          .expect(422, {
            ok: false, code: 'bad-type', fields: {}
          });
      });

      it('should error if bad type', async function () {
        await agent()
          .put(`/api/options/${this.option.id}/delta`)
          .send({ type: 'potato' })
          .cookiejar()
          .accept('application/json')
          .expect(422, {
            ok: false, code: 'bad-type', fields: { type: 'potato' }
          });
      });

      it('should error if amount not a number', async function () {
        await agent()
          .put(`/api/options/${this.option.id}/delta`)
          .send({ type: 'add', amount: 'potato' })
          .cookiejar()
          .accept('application/json')
          .expect(422, {
            ok: false, code: 'bad-amount', fields: { amount: 'potato' }
          });
      });

      it('should error if amount out of range', async function () {
        await agent()
          .put(`/api/options/${this.option.id}/delta`)
          .send({ type: 'add', amount: -14 })
          .cookiejar()
          .accept('application/json')
          .expect(422, {
            ok: false, code: 'bad-amount', fields: { amount: -14 }
          });
      });

      it('should succeed and create model', async function () {
        await agent()
          .put(`/api/options/${this.option.id}/delta`)
          .send({ type: 'base', amount: 10.50 })
          .cookiejar()
          .accept('application/json')
          .expect(200);
        const delta = await Delta.findOne({
          where: { optionId: this.option.id } }
        );
        expect(delta.type).to.eql(Delta.TYPES.base);
        expect(delta.amount).to.eql(10.50);
      });

      it('should 500 if QuestionUpdater errors', async function () {
        this.sandbox.stub(QuestionUpdater.prototype, 'setDelta').rejects();
        await agent()
          .put(`/api/options/${this.option.id}/delta`)
          .send({ type: 'base', amount: 10.50 })
          .cookiejar()
          .accept('application/json')
          .expect(500);
      });
    });
  });

  describe('DELETE /api/options/:id/delta', function () {
    beforeEach(async function () {
      this.user = await factory.create('user');
      this.form = await factory.create('form', { userId: this.user.id });
      this.question = await factory.create('question', {
        formId: this.form.id,
        type: Question.TYPES.radio
      });
      this.option = await factory.create('option', {
        questionId: this.question.id
      });
    });

    it('should 403 if signed out', function () {
      return agent()
        .delete(`/api/options/${this.option.id}/delta`)
        .accept('application/json')
        .expect(403);
    });

    describe('when signed in', function () {
      beforeEach(async function () {
        await signIn(this.user);
      });

      it('should 404 if not found', async function () {
        await agent()
          .delete('/api/options/999/delta')
          .cookiejar()
          .accept('application/json')
          .expect(404);
        // A delta doesn't exist yet
        await agent()
          .delete(`/api/options/${this.option.id}/delta`)
          .cookiejar()
          .accept('application/json')
          .expect(404);
      });

      it('should 403 if not owner', async function () {
        const otherForm = await factory.create('form');
        const otherQuestion = await factory.create('question', {
          formId: otherForm.id,
          type: Question.TYPES.radio
        });
        const otherOption = await factory.create('option', {
          questionId: otherQuestion.id
        });
        await agent()
          .delete(`/api/options/${otherOption.id}/delta`)
          .cookiejar()
          .accept('application/json')
          .expect(403);
      });

      describe('when delta exists', function () {
        beforeEach(async function () {
          await factory.create('delta', {
            optionId: this.option.id
          });
        });

        it('should succeed and destroy model', async function () {
          await agent()
            .delete(`/api/options/${this.option.id}/delta`)
            .cookiejar()
            .accept('application/json')
            .expect(204);
          // expect(await Delta.count({ where: { optionId: this.option.id } }))
          //   .to.eql(0);
        });

        it('should 500 if QuestionUpdater errors', async function () {
          this.sandbox.stub(QuestionUpdater.prototype, 'destroyDelta').rejects();
          await agent()
            .delete(`/api/options/${this.option.id}/delta`)
            .cookiejar()
            .accept('application/json')
            .expect(500);
        });
      });
    });
  });

  describe('POST /api/options/:id/attachment', function () {
    beforeEach(async function () {
      this.user = await factory.create('user');
      this.form = await factory.create('form', { userId: this.user.id });
      this.question = await factory.create('question', {
        formId: this.form.id,
        type: Question.TYPES.radio
      });
      this.option = await factory.create('option', {
        questionId: this.question.id
      });
    });

    it('should 403 if signed out', function () {
      return agent()
        .post(`/api/options/${this.option.id}/attachment`)
        .attach('file', `${__dirname}/fixtures/mars.jpg`)
        .accept('application/json')
        .expect(403);
    });

    describe('when signed in', function () {
      beforeEach(async function () {
        await signIn(this.user);
      });

      it('should 404 if not found', async function () {
        await agent()
          .post('/api/options/999/attachment')
          .attach('file', `${__dirname}/fixtures/mars.jpg`)
          .cookiejar()
          .accept('application/json')
          .expect(404);
      });

      it('should 403 if not owner', async function () {
        const otherForm = await factory.create('form');
        const otherQuestion = await factory.create('question', {
          formId: otherForm.id,
          type: Question.TYPES.radio
        });
        const otherOption = await factory.create('option', {
          questionId: otherQuestion.id
        });
        await agent()
          .post(`/api/options/${otherOption.id}/attachment`)
          .attach('file', `${__dirname}/fixtures/mars.jpg`)
          .cookiejar()
          .accept('application/json')
          .expect(403);
      });

      it('should 422 if no uploaded file', async function () {
        await agent()
          .post(`/api/options/${this.option.id}/attachment`)
          .cookiejar()
          .accept('application/json')
          .expect(422, {
            ok: false,
            code: 'MISSING_ATTACHMENT'
          });
      });

      describe('when uploading succeeds', function () {
        beforeEach(async function () {
          this.attachmentModel = await factory.create('optionAttachment', {
            optionId: this.option.id
          });
          this.sandbox.stub(LocalAttachmentSaver.prototype, 'save')
            .resolves(this.attachmentModel);
        });

        it('should call save with the temporary file', async function () {
          await agent()
            .post(`/api/options/${this.option.id}/attachment`)
            .attach('file', `${__dirname}/fixtures/mars.jpg`)
            .cookiejar()
            .accept('application/json');
          expect(LocalAttachmentSaver.prototype.save).to.have.been
            .calledWith(sinon.match(/tmp\/uploads\/\w{32}/), this.option.id);
        });

        it('should work', async function () {
          await agent()
            .post(`/api/options/${this.option.id}/attachment`)
            .attach('file', `${__dirname}/fixtures/mars.jpg`)
            .cookiejar()
            .accept('application/json')
            .expect(200, {
              ok: true,
              record: await this.attachmentModel.toJSON(),
              option: await this.option.toJSON()
            });
        });
      });

      describe('when uploading succeeds and old attachments exist', function () {
        beforeEach(async function () {
          this.sandbox.stub(LocalAttachmentSaver.prototype, 'save').callsFake(() => {
            return factory.create('optionAttachment');
          });
        });

        it('should dissociate old attachments', async function () {
          const oldAttachment = await factory.create('optionAttachment', {
            optionId: this.option.id
          });
          await agent()
            .post(`/api/options/${this.option.id}/attachment`)
            .attach('file', `${__dirname}/fixtures/mars.jpg`)
            .cookiejar()
            .accept('application/json')
            .expect(200);
          await oldAttachment.reload();
          expect(oldAttachment.optionId).to.be.null;
        });
      });

      describe('when uploading failed', function () {
        beforeEach(async function () {
          this.sandbox.stub(LocalAttachmentSaver.prototype, 'save')
            .rejects(new Error());
        });

        it('should 500', async function () {
          await agent()
            .post(`/api/options/${this.option.id}/attachment`)
            .attach('file', `${__dirname}/fixtures/mars.jpg`)
            .cookiejar()
            .accept('application/json')
            .expect(500, {
              ok: false
            });
        });
      });
    });
  });
});
