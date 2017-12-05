// import SettingsPageUserForm from './SettingsPageUserForm';
// import { mount } from 'avoriaz';
// import Vue, { nextTick } from 'vue';
// import Vuex from 'vuex';
// import sinon from 'sinon';
// import users_fixture from 'fixtures/users';
// import emailPreferencesFixture from 'fixtures/emailPreferences';

// Vue.use(Vuex);

// describe('SettingsPageUserForm', function() {
//   beforeEach(function() {
//     sinon.stub(Toaster, 'create');
//     this.mutations =
//       {set_user: sinon.spy()};
//     return this.store = new Vuex.Store({
//       state: {},
//       mutations: this.mutations
//     });
//   });

//   afterEach(() => Toaster.create.restore());

//   const form_submission_on_success = () =>
//     describe('on success', function() {
//       beforeEach(function(done) {
//         this.new_user = Object.assign({}, users_fixture.austin, {username: 'jeffrey'});
//         this.fetches.first.respond_with({
//           body: {
//             ok: true,
//             user: this.new_user
//           }
//         });
//         return setImmediate(done);
//       });

//       it('should commit to store', function() {
//         const { set_user } = this.mutations;
//         return expect(set_user).to.have.been.calledWith(sinon.match.object, this.new_user);
//       });

//       it('should create toast', () =>
//         expect(Toaster.create)
//           .to.have.been.calledWith('success', 'You’ve been updated.', 'Great!')
//       );

//       return it('should clear loading state', function() {
//         return expect(this.wrapper.vm.loading).to.be.false;
//       });
//     })
//   ;

//   const form_submission_on_server_error = () =>
//     describe('on server error', function() {
//       beforeEach(function(done) {
//         this.fetches.first.respond_with({
//           body: {
//             ok: false
//           }
//         });
//         return setImmediate(done);
//       });

//       it('should not commit to store', function() {
//         return expect(this.mutations.set_user).to.not.have.been.called;
//       });

//       it('should create toast', () =>
//         expect(Toaster.create).to.have.been
//           .calledWith('danger', 'Please try again later.', 'Server Error!')
//       );

//       return it('should clear loading state', function() {
//         return expect(this.wrapper.vm.loading).to.be.false;
//       });
//     })
//   ;

//   const form_submission_on_client_error = () =>
//     describe('on client error', function() {
//       beforeEach(function(done) {
//         this.fetches.first.respond_with({
//           body: {
//             ok: false,
//             errors: [({ code: 'WRONG_PASSWORD' })]
//           }});
//         return setImmediate(done);
//       });

//       it('should not commit to store', function() {
//         return expect(this.mutations.set_user).to.not.have.been.called;
//       });

//       it('should create toast', () =>
//         expect(Toaster.create).to.have.been
//           .calledWith('warn', 'The current password wasn’t correct.')
//       );

//       return it('should clear loading state', function() {
//         return expect(this.wrapper.vm.loading).to.be.false;
//       });
//     })
//   ;

//   describe('loading state', function() {
//     beforeEach(function() {
//       this.wrapper = mount(SettingsPageUserForm, { store: this.store, propsData: {
//         user: users_fixture.austin,
//         email_preferences: emailPreferencesFixture.verified
//       }
//     }
//       );
//       this.wrapper.vm.loading = true;
//       return nextTick();
//     });

//     return it('should disable inputs', function() {
//       this.wrapper.find('input').forEach(input => expect(input.element.getAttribute('disabled')).to.eql('disabled'));
//       return this.wrapper.find('button').forEach(input => expect(input.element.getAttribute('disabled')).to.eql('disabled'));
//     });
//   });

//   describe('behavior', function() {
//     beforeEach(function() {
//       return this.wrapper = mount(SettingsPageUserForm, { store: this.store, propsData: {
//         user: users_fixture.austin,
//         email_preferences: emailPreferencesFixture.verified
//       }
//     }
//       );
//     });

//     describe('setting username', function() {
//       beforeEach(function() {
//         const input_username = this.wrapper.first('input[name=username]');
//         this.fill_in(input_username).with('jeffrey');
//         expect(this.wrapper.vm.username).to.eql('jeffrey');
//         return this.wrapper.first('form').trigger('submit');
//       });

//       it('should be in loading state', function() {
//         return expect(this.wrapper.vm.loading).to.be.true;
//       });

//       it('should update record', function() {
//         expect(this.fetches.first).to.include({
//           method: 'PUT',
//           url: '/api/users/me',
//           credentials: 'same-origin'
//         });
//         return expect(this.fetches.first.body).to.eql({
//           email: 'austin@makes.audio',
//           username: 'jeffrey'
//         });
//       });

//       form_submission_on_success();
//       form_submission_on_server_error();
//       return form_submission_on_client_error();
//     });

//     describe('setting email', function() {
//       beforeEach(function() {
//         const input_email = this.wrapper.first('input[name=email]');
//         this.fill_in(input_email).with('austin@bakes.audio');
//         expect(this.wrapper.vm.email).to.eql('austin@bakes.audio');
//         return this.wrapper.first('form').trigger('submit');
//       });

//       it('should be in loading state', function() {
//         return expect(this.wrapper.vm.loading).to.be.true;
//       });

//       it('should update record', function() {
//         expect(this.fetches.first).to.include({
//           method: 'PUT',
//           url: '/api/users/me',
//           credentials: 'same-origin'
//         });
//         return expect(this.fetches.first.body).to.eql({
//           email: 'austin@bakes.audio',
//           username: 'austin'
//         });
//       });

//       form_submission_on_success();
//       form_submission_on_server_error();
//       return form_submission_on_client_error();
//     });

//     return describe('setting password', function() {
//       beforeEach(function() {
//         let input_password = this.wrapper.first('input[name=password]');
//         this.fill_in(input_password).with('donkey7');
//         input_password = this.wrapper.first('input[name=currentPassword]');
//         this.fill_in(input_password).with('apple');

//         expect(this.wrapper.vm.password).to.eql('donkey7');
//         expect(this.wrapper.vm.currentPassword).to.eql('apple');

//         return this.wrapper.find('form')[1].trigger('submit');
//       });

//       it('should be in loading state', function() {
//         return expect(this.wrapper.vm.loading).to.be.true;
//       });

//       it('should update record', function() {
//         expect(this.fetches.first).to.include({
//           method: 'PUT',
//           url: '/api/users/me',
//           credentials: 'same-origin'
//         });
//         return expect(this.fetches.first.body).to.eql({
//           password: 'donkey7',
//           currentPassword: 'apple'
//         });
//       });

//       describe('on success', function() {
//         beforeEach(function(done) {
//           this.fetches.first.respond_with({
//             body: {
//               ok: true
//             }
//           });
//           return setImmediate(done);
//         });

//         it('should create toast', () => expect(Toaster.create).to.have.been.calledWith('success', 'Done!'));

//         it('should clear loading state', function() {
//           return expect(this.wrapper.vm.loading).to.be.false;
//         });

//         return it('should reset inputs', function() {
//           expect(this.wrapper.find('input[type=password]')[0].value()).to.be.false;
//           return expect(this.wrapper.find('input[type=password]')[1].value()).to.be.false;
//         });
//       });

//       form_submission_on_server_error();
//       return form_submission_on_client_error();
//     });
//   });

//   return describe('resending verification email', function() {
//     describe('when already verified', function() {
//       beforeEach(function() {
//         return this.wrapper = mount(SettingsPageUserForm, { store: this.store, propsData: {
//           user: users_fixture.austin,
//           email_preferences: emailPreferencesFixture.verified
//         }
//       }
//         );
//       });

//       return it('should not show link', function() {
//         return expect(this.wrapper.contains('.verify-email-warning a')).to.be.false;
//       });
//     });

//     return describe('when not verified', function() {
//       beforeEach(function() {
//         return this.wrapper = mount(SettingsPageUserForm, { store: this.store, propsData: {
//           user: users_fixture.austin,
//           email_preferences: emailPreferencesFixture.not_verified
//         }
//       }
//         );
//       });

//       it('should show link', function() {
//         return expect(this.wrapper.contains('.verify-email-warning a')).to.be.true;
//       });

//       return describe('clicking `resend`', function() {
//         beforeEach(function() {
//           return this.wrapper.first('.verify-email-warning a').trigger('click');
//         });

//         it('should set loading state', function() {
//           return expect(this.wrapper.vm.loading).to.be.true;
//         });

//         it('should make request', function() {
//           return expect(this.fetches.first).to.include({
//             url: '/api/users/me/emailPreferences/sendVerificationEmail',
//             method: 'POST',
//             credentials: 'same-origin'
//           });
//         });

//         describe('on success', function() {
//           beforeEach(function(done) {
//             this.fetches.first.respond_with({
//               body: {
//                 ok: true
//               }
//             });
//             return setImmediate(done);
//           });

//           it('should clear loading state', function() {
//             return expect(this.wrapper.vm.loading).to.be.false;
//           });

//           return it('should create toast', function() {
//             const message = 'Please check your email for a verification link.';
//             return expect(Toaster.create).to.have.been.calledWith('success', message);
//           });
//         });

//         return describe('on error', function() {
//           beforeEach(function(done) {
//             this.fetches.first.respond_with({
//               body: {
//                 ok: false
//               }
//             });
//             return setImmediate(done);
//           });

//           it('should clear loading state', function() {
//             return expect(this.wrapper.vm.loading).to.be.false;
//           });

//           return it('should create toast', function() {
//             const message = 'Something went wrong.';
//             return expect(Toaster.create).to.have.been.calledWith('danger', message);
//           });
//         });
//       });
//     });
//   });
// });
