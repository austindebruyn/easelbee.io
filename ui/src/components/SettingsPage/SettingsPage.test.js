// import SettingsPage from './SettingsPage';
// import { mount } from 'avoriaz'
// import Vue, { nextTick } from 'vue'
// import Vuex from 'vuex'
// import sinon from 'sinon'
// import LoadingSpinner from 'components/LoadingSpinner'
// import SettingsPageUserForm from 'components/SettingsPage/SettingsPageUserForm'
// import users_fixture from 'fixtures/users'
// import emailPreferencesFixture from 'fixtures/emailPreferences'

// Vue.use(Vuex);

// describe('SettingsPage', function() {
//   beforeEach(function() {
//     this.actions =
//       {fetch_email_preferences: sinon.spy()};
//     return this.store = new Vuex.Store({
//       state: {
//         user: users_fixture.austin,
//         email_preferences: null
//       },
//       actions: this.actions
//     });
//   });

//   it('should show username', function() {
//     const wrapper = mount(settings, {store: this.store});
//     return expect(wrapper.first('h2').text()).to.eql('austin');
//   });

//   it('should show spinner if loading', function() {
//     const wrapper = mount(settings, {store: this.store});
//     return expect(wrapper.contains(loading)).to.be.true;
//   });

//   it('should show not spinner after loading', function() {
//     const wrapper = mount(settings, {store: this.store});
//     this.store.state.email_preferences = emailPreferencesFixture.verified;
//     return nextTick().then(() => expect(wrapper.contains(loading)).to.be.false);
//   });

//   return it('should show user form after loading', function() {
//     const wrapper = mount(settings, {store: this.store});
//     expect(wrapper.contains(user_form)).to.be.false;
//     this.store.state.email_preferences = emailPreferencesFixture.verified;
//     return nextTick().then(() => expect(wrapper.contains(user_form)).to.be.true);
//   });
// });
