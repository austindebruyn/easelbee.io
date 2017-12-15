// import FormsIndexPage from './FormsIndexPage';
// import { mount } from 'avoriaz';
// import Vuex from 'vuex';
// import sinon from 'sinon';
// import Resource, { STATUS } from 'state/Resource';
// import LoadingSpinner from 'components/LoadingSpinner';
// import FormsList from 'components/forms/FormsList';
// import commissionsFixture from 'fixtures/commissions';

// describe('FormsIndexPage', function () {
//   beforeEach(function () {
//     this.actions = {
//       fetchCommissions: sinon.spy()
//     };
//   });

//   afterEach(function () {
//     this.actions.fetchCommissions.reset();
//   });

//   function storeFactory (resourceOpts = {}) {
//     this.store = new Vuex.Store({
//       state: {
//         commissions: new Resource(resourceOpts)
//       },
//       actions: this.actions
//     });
//   }

//   describe('when not loaded', function () {
//     beforeEach(function () {
//       storeFactory.call(this);
//     });

//     it('should fetch', function () {
//       mount(FormsIndexPage, { store: this.store, i18n: this.i18n });

//       expect(this.actions.fetchCommissions).to.have.been.called;
//     });

//     it('should render spinner', function () {
//       const wrapper = mount(FormsIndexPage, {
//         store: this.store,
//         i18n: this.i18n
//       });
//       expect(wrapper.contains(LoadingSpinner)).to.be.true;
//       expect(wrapper.contains(FormsList)).to.be.false;
//     });

//     it('should have breadcrumbs', function () {
//       const wrapper = mount(FormsIndexPage, {
//         store: this.store,
//         i18n: this.i18n
//       });

//       expect(wrapper.vm.breadcrumbs).to.eql([
//         { name: 'Commissions', to: '/commissions' }
//       ]);
//     });
//   });

//   describe('when loaded', function () {
//     beforeEach(function () {
//       storeFactory.call(this, {
//         status: STATUS.LOADED,
//         value: [ commissionsFixture.basic, commissionsFixture.long ]
//       });
//     });

//     it('should not render spinner', function () {
//       const wrapper = mount(FormsIndexPage, {
//         store: this.store,
//         i18n: this.i18n
//       });

//       expect(wrapper.contains(LoadingSpinner)).to.be.false;
//       expect(wrapper.contains(FormsList)).to.be.true;
//       expect(wrapper.contains('.not-found')).to.be.false;

//       const child = wrapper.first(FormsList);
//       expect(child.propsData()).to.eql({
//         commissions: [commissionsFixture.basic, commissionsFixture.long]
//       });
//     });
//   });
// });
