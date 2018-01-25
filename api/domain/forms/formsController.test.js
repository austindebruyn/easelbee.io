const agent = require('../../tests/agent');
const signIn = require('../../tests/signIn');
const clock = require('../../tests/clock');
const factory = require('../../tests/factory');
const expect = require('chai').expect;
const Form = require('./Form');
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
        beforeEach(function () {
          return factory.create('form', {
            userId: this.user.id
          }).then(record => record.toJSON())
            .then(json => {
              this.formJson = json;
            });
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

        it('should return 422', function () {
          return agent()
            .post('/api/users/me/forms')
            .send({ slug: 'some-form', name: 'Some Form' })
            .cookiejar()
            .accept('application/json')
            .expect(422, { ok: false });
        });
      });

      describe('on success', function () {
        it('should return 200', function () {
          return agent()
            .post('/api/users/me/forms')
            .send({ slug: 'some-form', name: 'Some Form' })
            .cookiejar()
            .accept('application/json')
            .expect(200)
            .then(res => {
              expect(res.body.ok).to.be.true;
              expect(res.body.record).to.deep.include({
                id: 1,
                slug: 'some-form',
                publicUrl: 'http://test-easelbee.io:8000/forms/some-form',
                name: 'Some Form',
                userId: signIn.user.id,
                questions: []
              });
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
});
