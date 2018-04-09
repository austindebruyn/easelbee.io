const agent = require('../../tests/agent');
const signIn = require('../../tests/signIn');
const clock = require('../../tests/clock');
const factory = require('../../tests/factory');
const expect = require('chai').expect;
const Form = require('./Form');
const Question = require('./Question');
const Commission = require('../commissions/Commission');
const sinon = require('sinon');

describe('formsController', function () {
  clock();

  describe('GET /forms/:slug', function () {
    it('should return customer app', async function () {
      const resp = await agent()
        .get('/forms/some-form')
        .cookiejar()
        .accept('text/html')
        .expect(200);

      expect(resp.header['content-type']).to.include('text/html');
    });
  });

  describe('GET /api/forms/:slug', function () {
    describe('when exists', function () {
      beforeEach(async function () {
        this.user = await factory.create('user', {
          displayName: 'Abraham'
        });
        this.form = await factory.create('form', {
          name: 'Some Form',
          slug: 'some-form',
          userId: this.user.id
        });
      });

      it('should return form and artist json', function () {
        return agent()
          .get('/api/forms/some-form')
          .accept('application/json')
          .expect(200, {
            ok: true,
            record: {
              id: 1,
              userId: this.user.id,
              name: 'Some Form',
              publicUrl: 'http://test-easelbee.io:8000/forms/some-form',
              questions: [],
              slug: 'some-form',
              submitUrl: 'http://test-easelbee.io:8000/forms/some-form/submit',
              submittedAt: null,
              createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
              updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT'
            },
            user: {
              id: this.user.id,
              displayName: 'Abraham'
            }
          });
      });

      it('should 404 if deleted', async function () {
        this.form.deletedAt = new Date();
        await this.form.save();
        await agent()
          .get('/api/forms/some-form')
          .accept('application/json')
          .expect(404);
      });
    });
  });

  describe('GET /api/users/me/forms', function () {
    it('should 403 if signed out', function () {
      return agent()
        .get('/api/users/me/forms')
        .cookiejar()
        .accept('application/json')
        .expect(403);
    });

    describe('when signed in', function () {
      beforeEach(function () {
        return factory.create('user')
          .then(user => {
            this.user = user;
            return signIn(user);
          });
      });

      it('should return empty set', function () {
        return agent()
          .get('/api/users/me/forms')
          .cookiejar()
          .accept('application/json')
          .expect(200, {
            ok: true,
            records: []
          });
      });

      describe('when records', function () {
        beforeEach(async function () {
          this.form = await factory.create('form', {
            userId: this.user.id
          });
          this.formJson = await this.form.toJSON();
        });

        it('should return records', function () {
          return agent()
            .get('/api/users/me/forms')
            .cookiejar()
            .accept('application/json')
            .expect(200)
            .then(res => {
              expect(res.body.ok).to.be.true;
              expect(res.body.records).to.have.length(1);
              expect(res.body.records[0]).to.eql(this.formJson);
              expect(res.body.records[0]).to.have.property('questions');
            });
        });

        it('should should not return deleted forms', async function () {
          await factory.create('form', {
            userId: this.user.id,
            deletedAt: new Date()
          });
          const notDeletedForm = await factory.create('form', {
            userId: this.user.id
          });
          await agent()
            .get('/api/users/me/forms')
            .cookiejar()
            .accept('application/json')
            .expect(200)
            .then(res => {
              expect(res.body.ok).to.be.true;
              expect(res.body.records).to.have.length(2);
              expect(res.body.records[0].id).to.eql(this.form.id);
              expect(res.body.records[1].id).to.eql(notDeletedForm.id);
            });
        });

        it('should not return deleted questions', async function () {
          const deletedQuestion = await factory.create('question', {
            formId: this.form.id,
            deletedAt: new Date()
          });
          await agent()
            .get('/api/users/me/forms')
            .cookiejar()
            .accept('application/json')
            .expect(200)
            .then(res => {
              const { questions } = res.body.records[0];
              expect(questions.map(q => q.id))
                .to.not.include(deletedQuestion.id);
            });
        });
      });
    });
  });

  describe('POST /api/users/me/forms', function () {
    it('should 403 if signed out', function () {
      return agent()
        .post('/api/users/me/forms')
        .send({ slug: 'some-form', name: 'Some Form' })
        .cookiejar()
        .accept('application/json')
        .expect(403);
    });

    describe('when signed in', function () {
      beforeEach(function () {
        return factory.create('user')
          .then(user => {
            this.user = user;
            return signIn(user);
          });
      });

      describe('on error', function () {
        beforeEach(function () {
          sinon.stub(Form, 'create').rejects();
        });

        afterEach(function () {
          Form.create.restore();
        });

        it('should return 500', function () {
          return agent()
            .post('/api/users/me/forms')
            .send({ slug: 'some-form', name: 'Some Form' })
            .cookiejar()
            .accept('application/json')
            .expect(500, { ok: false });
        });
      });

      describe('on success', function () {
        it('should return 200', async function () {
          const res = await agent()
            .post('/api/users/me/forms')
            .cookiejar()
            .accept('application/json')
            .expect(200);
          expect(res.body.ok).to.be.true;
          expect(res.body.record).to.deep.include({
            id: 1,
            publicUrl: 'http://test-easelbee.io:8000/forms/untitled-form-1',
            name: 'Untitled Form #1',
            userId: signIn.user.id,
            questions: []
          });
          expect(res.body.record.slug).to.be.a('string');
        });

        it('should pick the next available `Untitled` name', async function () {
          await factory.create('form', {
            userId: signIn.user.id,
            name: 'Untitled Form #1'
          });
          await factory.create('form', {
            userId: signIn.user.id,
            name: 'Untitled Form #2'
          });
          await factory.create('form', {
            slug: 'untitled-form-3'
          });
          const res = await agent()
            .post('/api/users/me/forms')
            .cookiejar()
            .accept('application/json')
            .expect(200);
          expect(res.body.record).to.deep.include({
            name: 'Untitled Form #4'
          });
        });
      });
    });
  });

  describe('POST /users/me/forms/submit', function () {
    beforeEach(function () {
      return factory.create('form', { slug: 'some-form' }).then(record => {
        this.form = record;
      });
    });

    it('should 404', function () {
      return agent()
        .post('/forms/not-existing-form/submit')
        .send({ email: 'whatever@email.com' })
        .accept('text/html')
        .expect(404);
    });

    it('should create models after submitting', async function () {
      await agent()
        .post('/forms/some-form/submit')
        .send({ email: 'tinker@bell.com', nickname: 'Peter Pan' })
        .accept('application/json')
        .expect(200, {
          ok: true,
          record: {
            id: 1,
            userId: 1,
            email: 'tinker@bell.com',
            nickname: 'Peter Pan',
            status: 'incoming',
            price: 0,
            adjustedPrice: null,
            createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
            updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT'
          }
        });
      const commission = await Commission.findOne({
        where: { formId: this.form.id }
      });
      expect(commission).to.include({
        id: 1,
        userId: 1,
        email: 'tinker@bell.com',
        nickname: 'Peter Pan',
        status: Commission.STATUS.incoming
      });
    });

    describe('when creating fails', function () {
      beforeEach(function () {
        sinon.stub(Commission, 'create').rejects();
      });

      afterEach(function () {
        Commission.create.restore();
      });

      it('should 500', function () {
        return agent()
          .post('/forms/some-form/submit')
          .send({ email: 'whatever@email.com', body: 'Please draw this.' })
          .accept('text/html')
          .expect(500)
          .then(res => {
            expect(res.text).to.include('<title>Error</title>');
          });
      });
    });
  });

  describe('PATCH /api/forms/:id', function () {
    beforeEach(async function () {
      this.user = await factory.create('user');
      this.form = await factory.create('form', { id: 1, userId: this.user.id });
      this.otherForm = await factory.create('form', { id: 2 });
    });

    it('should 403 if signed out', function () {
      return agent()
        .patch('/api/forms/1')
        .send({ title: 'Big New Form' })
        .cookiejar()
        .accept('application/json')
        .expect(403);
    });

    describe('when signed in', function () {
      beforeEach(async function () {
        await signIn(this.user);
      });

      it('should 404 when no record', function () {
        return agent()
          .patch('/api/forms/9999')
          .send({ title: 'Big New Form' })
          .cookiejar()
          .accept('application/json')
          .expect(404);
      });

      it('should 403 when not owned', function () {
        return agent()
          .patch('/api/forms/2')
          .send({ title: 'Big New Form' })
          .cookiejar()
          .accept('application/json')
          .expect(403);
      });

      describe('when saving fails', function () {
        beforeEach(function () {
          sinon.stub(Form.prototype, 'save').rejects();
        });

        afterEach(function () {
          Form.prototype.save.restore();
        });

        it('should 500', async function () {
          await agent()
            .patch('/api/forms/1')
            .send({ title: 'Big New Form' })
            .cookiejar()
            .accept('application/json')
            .expect(500);
        });
      });

      describe('on success', function () {
        it('should return 200', async function () {
          await agent()
            .patch('/api/forms/1')
            .send({ name: 'Big New Form' })
            .cookiejar()
            .accept('application/json')
            .expect(200)
            .then(res => {
              expect(res.body.ok).to.be.true;
              expect(res.body.record).to.include({
                id: 1,
                userId: 1,
                name: 'Big New Form',
                createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
                updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT'
              });
            });
        });
      });
    });
  });

  describe('POST /api/forms/:id/questions', function () {
    beforeEach(async function () {
      this.user = await factory.create('user');
      this.form = await factory.create('form', { id: 1, userId: this.user.id });
      this.otherForm = await factory.create('form', { id: 2 });
    });

    it('should 403 if signed out', function () {
      return agent()
        .post('/api/forms/1/questions')
        .cookiejar()
        .accept('application/json')
        .expect(403);
    });

    describe('when signed in', function () {
      beforeEach(async function () {
        await signIn(this.user);
      });

      it('should 404 when no record', function () {
        return agent()
          .post('/api/forms/9999/questions')
          .cookiejar()
          .accept('application/json')
          .expect(404);
      });

      it('should 403 when not owned', function () {
        return agent()
          .post('/api/forms/2/questions')
          .cookiejar()
          .accept('application/json')
          .expect(403);
      });

      describe('when creating fails', function () {
        beforeEach(function () {
          sinon.stub(Question, 'create').rejects();
        });

        afterEach(function () {
          Question.create.restore();
        });

        it('should 500', async function () {
          await agent()
            .post('/api/forms/1/questions')
            .cookiejar()
            .accept('application/json')
            .expect(500);
        });
      });

      describe('on success', function () {
        it('should return 200', async function () {
          await agent()
            .post('/api/forms/1/questions')
            .cookiejar()
            .accept('application/json')
            .expect(200, {
              ok: true,
              record: {
                id: 1,
                formId: 1,
                order: 1,
                required: false,
                title: 'Question #1',
                type: 'string',
                createdAt: 'Thu, 31 Aug 2017 00:00:00 GMT',
                updatedAt: 'Thu, 31 Aug 2017 00:00:00 GMT'
              }
            });
        });

        it('should create multiple questions in order', async function () {
          await agent()
            .post('/api/forms/1/questions')
            .cookiejar()
            .accept('application/json');
          await agent()
            .post('/api/forms/1/questions')
            .cookiejar()
            .accept('application/json');

          const questions = await this.form.getQuestions();
          expect(questions.length).to.eql(2);
          expect(questions[0].order).to.eql(1);
          expect(questions[1].order).to.eql(2);
        });

        it('should ignore deleted questions', async function () {
          await factory.create('question', {
            formId: this.form.id,
            order: 1
          });
          await factory.create('question', {
            formId: this.form.id,
            order: 2,
            deletedAt: new Date()
          });

          await agent()
            .post('/api/forms/1/questions')
            .cookiejar()
            .accept('application/json');

          const questions = await this.form.getQuestions();
          expect(questions.length).to.eql(3);
          expect(questions[0].order).to.eql(1);
          expect(questions[1].order).to.eql(2);
          expect(questions[1].deletedAt).to.eql(new Date());
          expect(questions[2].order).to.eql(2);
        });
      });
    });
  });

  describe('DELETE /api/forms/:id', function () {
    beforeEach(async function () {
      this.user = await factory.create('user');
      this.form = await factory.create('form', { id: 1, userId: this.user.id });
      this.otherForm = await factory.create('form', { id: 2 });
    });

    it('should 403 if signed out', function () {
      return agent()
        .delete('/api/forms/1')
        .cookiejar()
        .accept('application/json')
        .expect(403);
    });

    describe('when signed in', function () {
      beforeEach(async function () {
        await signIn(this.user);
      });

      it('should 404 when no record', function () {
        return agent()
          .delete('/api/forms/9999')
          .cookiejar()
          .accept('application/json')
          .expect(404);
      });

      it('should 403 when not owned', function () {
        return agent()
          .delete('/api/forms/2')
          .cookiejar()
          .accept('application/json')
          .expect(403);
      });

      describe('when updating fails', function () {
        beforeEach(function () {
          sinon.stub(Form.prototype, 'save').rejects();
        });

        afterEach(function () {
          Form.prototype.save.restore();
        });

        it('should 500', async function () {
          await agent()
            .delete('/api/forms/1')
            .cookiejar()
            .accept('application/json')
            .expect(500);
        });
      });

      describe('on success', function () {
        it('should return 200', async function () {
          await agent()
            .delete('/api/forms/1')
            .cookiejar()
            .accept('application/json')
            .expect(200, {
              ok: true
            });
        });
      });
    });
  });
});
