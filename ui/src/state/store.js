import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import Resource, { STATUS } from 'state/Resource';

Vue.use(Vuex);

const initialState = {
  user: new Resource(),
  passwordReset: new Resource(),
  completePasswordReset: new Resource(),
  emailPreferences: new Resource(),
  commissions: new Resource(),
  i18n: new Resource()
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: initialState,

  mutations: {
    fetchI18nSuccess: function (state, locale) {
      state.i18n.status = STATUS.LOADED;
      state.i18n.value = locale;
    },

    loginStart: function (state) {
      state.user.status = STATUS.MUTATING;
    },
    loginSuccess: function (state, json) {
      state.user.status = STATUS.LOADED;
      state.user.value = json;
    },
    loginFailure: function (state, errors) {
      state.user.status = STATUS.ERRORED;
      state.user.errors = errors;
    },

    createPasswordResetStart: function (state) {
      state.passwordReset.status = STATUS.MUTATING;
    },
    createPasswordResetSuccess: function (state, json) {
      state.passwordReset.status = STATUS.LOADED;
      state.passwordReset.value = json;
    },
    createPasswordResetFailure: function (state, errors) {
      state.passwordReset.status = STATUS.ERRORED;
      state.passwordReset.errors = errors;
    },

    completePasswordResetStart: function (state) {
      state.completePasswordReset.status = STATUS.MUTATING;
    },
    completePasswordResetSuccess: function (state) {
      state.completePasswordReset.status = STATUS.LOADED;
    },
    completePasswordResetFailure: function (state, errors) {
      state.completePasswordReset.status = STATUS.ERRORED;
      state.completePasswordReset.errors = errors;
    },

    fetchCommissionsStart: function (state) {
      state.commissions.status = STATUS.MUTATING;
    },
    fetchCommissionsSuccess: function (state, json) {
      state.commissions.status = STATUS.LOADED;
      state.commissions.value = json;
    },
    fetchCommissionsFailure: function (state, errors) {
      state.commissions.status = STATUS.ERRORED;
      state.commissions.errors = errors;
    },

    createCommissionStart: function (state) {
      state.commissions.status = STATUS.MUTATING;
    },
    createCommissionSuccess: function (state, json) {
      state.commissions.status = STATUS.LOADED;
      state.commissions.value.push(json);
    },
    createCommissionFailure: function (state, errors) {
      state.commissions.status = STATUS.ERRORED;
      state.commissions.errors = errors;
    },

    set_emailPreferences: function (state, emailPreferences) {
      return state.emailPreferences = emailPreferences;
    }
  },

  actions: {
    fetchEmailPreferences ({ state, commit }) {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      const url = '/api/users/me/emailPreferences';

      return axios.get(url, { credentials: 'same-origin', headers })
        .then(data => data.json())
        .then(function (json) {
          if (json.ok) {
            return commit('set_email_preferences', json.record);
          }
        });
    },
    fetchCommissions ({ state, commit }) {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      const url = '/api/users/me/commissions';

      return axios.get(url, { credentials: 'same-origin', headers })
        .then(({ data }) => {
          commit('fetchCommissionsSuccess', data.records);
        })
        .catch(({ response: { data } }) => {
          commit('fetchCommissionsError', data.errors);
        });
    },
    login: function ({ state, commit }, { email, password }) {
      commit('loginStart');

      return axios.post('/login', {
        email,
        password
      }, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(({ data }) => {
          commit('loginSuccess', data.user);
        })
        .catch(({ response: { data } }) => {
          commit('loginFailure', data.errors);
        });
    },
    createUser ({ state, commit }, payload) {
      const { displayName, email, password, password2 } = payload;
      commit('loginStart');

      return axios.post('/api/users', {
        displayName,
        email,
        password,
        password2
      }, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(({ data }) => {
          commit('loginSuccess', data.user);
        })
        .catch(({ response: { data } }) => {
          commit('loginFailure', data.errors);
        });
    },
    createPasswordReset ({ state, commit }, { email }) {
      commit('createPasswordResetStart');

      return axios.post('/api/passwordResets', { email }, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(() => {
          commit('createPasswordResetSuccess');
        })
        .catch(({ response: { data } }) => {
          commit('createPasswordResetFailure', data.errors);
        });
    },
    completePasswordReset ({ state, commit }, { code, password, password2 }) {
      commit('completePasswordResetStart');

      return axios.post('/api/passwordResets/complete', {
        code,
        password,
        password2
      }, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(function ({ data }) {
          commit('completePasswordResetSuccess', data.user);
          commit('loginSuccess', data.user);
        })
        .catch(function (err) {
          const errors = err.response && err.response.data.errors;
          commit('completePasswordResetFailure', errors);
        });
    },
    createCommission ({ state, commit }, payload) {
      const { email, body } = payload;
      commit('createCommissionStart');

      return axios.post('/api/users/me/commissions', {
        email,
        body
      }, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(({ data }) => {
          commit('createCommissionSuccess', data.record);
        })
        .catch(({ response: { data } }) => {
          commit('createCommissionFailure', data.errors);
        });
    }
  }
});
