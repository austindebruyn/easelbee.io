import Vue from 'vue';
import Vuex from 'vuex';
import Resource from 'state/Resource';

import * as mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

Vue.use(Vuex);

const initialState = {
  meta: {
    forms: {
      errored: false,
      mutating: false
    }
  },
  user: new Resource(),
  passwordReset: new Resource(),
  completePasswordReset: new Resource(),
  emailPreferences: new Resource(),
  commissions: new Resource(),
  fillouts: {},
  events: {},
  forms: null,
  questions: {},
  i18n: new Resource(),
  // Customer
  form: new Resource(),
  formSubmission: new Resource()
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: initialState,

  mutations,

  getters,

  actions
});
