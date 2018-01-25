const agent = require('../../tests/agent');
const signIn = require('../../tests/signIn');
const clock = require('../../tests/clock');
const factory = require('../../tests/factory');
const expect = require('chai').expect;

describe('questionsController', function () {
  clock();

  describe('PATCH /api/questions/:id', function () {
    beforeEach(async function () {
      this.form = await factory.create('form');
      this.question = await factory.create('question', {
        formId: this.form.id
      });
      this.user = await this.question.getUser();
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

        it('should update title', function () {
          return agent()
            .patch(`/api/questions/${this.question.id}`)
            .send({ title: 'Have a good time?' })
            .cookiejar()
            .accept('application/json')
            .expect(200)
            .then(res => {
              expect(res.body.ok).to.be.true;
              expect(res.body.record).to.include({
                id: this.question.id,
                title: 'Have a good time?'
              });
            });
        });
      });
    });
  });
});
