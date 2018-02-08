const agent = require('../../tests/agent');
const signIn = require('../../tests/signIn');
const clock = require('../../tests/clock');
const factory = require('../../tests/factory');
const expect = require('chai').expect;
const Form = require('./Form');
const Question = require('./Question');
const Commission = require('../commissions/Commission');
const User = require('../users/User');
const sinon = require('sinon');

describe('formsController', function () {
  clock();

  describe('GET /forms/:slug', function () {
    it('should 404', function () {
      return agent()
        .get('/forms/some-form')
        .cookiejar()
        .accept('text/html')
        .expect(404)
        .then(function (res) {
          expect(res.text).to.include('<h1>Not Found 404</h1>');
        });
    });

    describe('when exists', function () {
      beforeEach(function () {
        return factory.create('form', {
          name: 'Some Form',
          slug: 'some-form'
        }).then(record => {
          this.form = record;
        });
      });

      it('should render', function () {
        return agent()
          .get('/forms/some-form')
          .cookiejar()
          .accept('text/html')
          .expect(200)
          .then(function (res) {
            expect(res.text).to.include('<h1>Some Form</h1>');
            expect(res.text).to.not.include('This is your form.');
          });
      });

      describe('when signed in as owner', function () {
        beforeEach(function () {
          return User.findById(this.form.userId).then(signIn);
        });

        it('should display banner', function () {
          return agent()
            .get('/forms/some-form')
            .cookiejar()
            .accept('text/html')
            .expect(200)
            .then(function (res) {
              expect(res.text).to.include('This is your form.');
            });
        });
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

      describe.only('on success', function () {
        it('should return 200', async function () {
          const res = await agent()
            .post('/api/users/me/forms')
            .cookiejar()
            .accept('application/json')
            .expect(200)
          expect(res.body.ok).to.be.true;
          expect(res.body.record).to.deep.include({
            id: 1,
            publicUrl: 'http://test-easelbee.io:8000/forms/untitled-form-1',
            name: 'Untitled Form #1',
            userId: signIn.user.id,
            questions: []
          });
          expect(res.body.record.slug).to.be.a(String);
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
          const res = await agent()
            .post('/api/users/me/forms')
            .cookiejar()
            .accept('application/json')
            .expect(200);
          expect(res.body.record).to.deep.include({
            name: 'Untitled Form #3'
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

    it('should submit', function () {
      return agent()
        .post('/forms/some-form/submit')
        .send({ email: 'tinker@bell.com', nickname: 'Peter Pan' })
        .accept('text/html')
        .expect(200)
        .then(res => {
          expect(res.text).to.include('<h1>Thanks for submitting!</h1>');

          return Commission.findOne({ where: { formId: this.form.id } });
        })
        .then(function (commission) {
          expect(commission).to.include({
          });
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

  describe.only('PATCH /api/forms/:id', function () {
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
});
