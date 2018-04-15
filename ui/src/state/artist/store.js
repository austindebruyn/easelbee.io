import Vue from 'vue';
import Vuex from 'vuex';

import * as mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

Vue.use(Vuex);

const initialState = {
  meta: {
    fillouts: {
      errored: false,
      mutating: false
    },
    events: {
      errored: false,
      mutating: false
    },
    forms: {
      errored: false,
      mutating: false
    },
    commissions: {
      errored: false,
      mutating: false
    },
    i18n: {
      mutating: false
    },
    questions: {
      errored: false,
      mutating: false
    }
  },
  forms: null,
  commissions: null,
  i18n: null,
  user: null,
  fillouts: {},
  events: {},
  questions: {},
  options: {},
  optionAttachments: {}
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: initialState,

  mutations,

  getters,

  actions
});
