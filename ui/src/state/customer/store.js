import Vue from 'vue';
import Vuex from 'vuex';

import * as mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

Vue.use(Vuex);

const initialState = {
  meta: {
    form: {
      errored: false,
      mutating: false
    },
    formSubmission: {
      errored: false,
      mutating: false
    },
    i18n: {
      mutating: false
    }
  },
  i18n: null,
  form: null,
  formSubmission: null
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: initialState,

  mutations,

  getters,

  actions
});
