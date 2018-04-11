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
    },
    commissions: {
      errored: false,
      mutating: false
    },
    i18n: {
      errored: false,
      mutating: false
    }
  },
  forms: null,
  commissions: null,
  i18n: null,
  user: new Resource(),
  passwordReset: new Resource(),
  completePasswordReset: new Resource(),
  emailPreferences: new Resource(),
  fillouts: {},
  events: {},
  questions: {},
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
