import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import omit from 'lodash.omit';
import flatten from 'lodash.flatten';
import Resource, { STATUS } from 'state/Resource';
import clone from '../lib/clone';

Vue.use(Vuex);

const initialState = {
  user: new Resource(),
  passwordReset: new Resource(),
  completePasswordReset: new Resource(),
  emailPreferences: new Resource(),
  commissions: new Resource(),
  fillouts: {},
  events: {},
  forms: new Resource(),
  questions: {},
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

    fetchFilloutStart: function (state, id) {
      const fillouts = { ...state.fillouts };
      if (!fillouts[id]) {
        fillouts[id] = new Resource();
      }
      fillouts[id].status = STATUS.MUTATING;
      state.fillouts = fillouts;
    },
    fetchFilloutSuccess: function (state, { id, json }) {
      const fillouts = { ...state.fillouts };
      fillouts[id].status = STATUS.LOADED;
      fillouts[id].value = json;
      state.fillouts = fillouts;
    },
    fetchFilloutFailure: function (state, { id, errors }) {
      const fillouts = { ...state.fillouts };
      fillouts[id].status = STATUS.ERRORED;
      fillouts[id].errors = errors;
      state.fillouts = fillouts;
    },

    fetchEventsStart: function (state, id) {
      const events = { ...state.events };
      if (!events[id]) {
        events[id] = new Resource();
      }
      events[id].status = STATUS.MUTATING;
      state.events = events;
    },
    fetchEventsSuccess: function (state, { id, json }) {
      const events = { ...state.events };
      events[id].status = STATUS.LOADED;
      events[id].value = json;
      state.events = events;
    },
    fetchEventsFailure: function (state, { id, errors }) {
      const events = { ...state.events };
      events[id].status = STATUS.ERRORED;
      events[id].errors = errors;
      state.events = events;
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

    updateCommissionStart: function (state) {
      state.commissions.status = STATUS.MUTATING;
    },
    updateCommissionSuccess: function (state, json) {
      state.commissions.status = STATUS.LOADED;

      const newValue = [];
      state.commissions.value.forEach(function (existing) {
        if (existing.id === json.id) {
          newValue.push(json);
        } else {
          newValue.push({ ...existing });
        }
      });

      state.commissions.value = newValue;
    },
    updateCommissionFailure: function (state, errors) {
      state.commissions.status = STATUS.ERRORED;
      state.commissions.errors = errors;
    },

    fetchFormsStart: function (state) {
      state.forms.status = STATUS.MUTATING;
    },
    fetchFormsSuccess: function (state, json) {
      state.forms.status = STATUS.LOADED;
      state.forms.value = json;

      flatten(json.map(f => f.questions)).forEach(function (question) {
        state.questions[question.id] = new Resource({
          value: question,
          status: STATUS.LOADED
        });
      });
    },
    fetchFormsFailure: function (state, errors) {
      state.forms.status = STATUS.ERRORED;
      state.forms.errors = errors;
    },

    updateQuestionStart: function (state, id) {
      state.questions[id].status = STATUS.MUTATING;
    },
    updateQuestionSuccess: function (state, { id, json }) {
      state.questions[id].status = STATUS.LOADED;
      state.questions[id].value = json;

      state.forms.value = state.forms.value.map(function (form) {
        if (form.id === json.formId) {
          const newForm = clone(form);
          newForm.questions = form.questions.map(function (q) {
            if (q.id === id) {
              return json;
            }
            return q;
          });
          return newForm;
        }
        return clone(form);
      });
    },
    updateQuestionFailure: function (state, { id, errors }) {
      state.questions[id].status = STATUS.ERRORED;
      state.questions[id].errors = errors;
    },

    createQuestionStart: function (state) {
      state.forms.status = STATUS.MUTATING;
    },
    createQuestionSuccess: function (state, { formId, json }) {
      const forms = clone(state.forms);

      forms.status = STATUS.LOADED;

      forms.value.forEach(function (form) {
        if (form.id === formId) {
          form.questions.push(json);
        }
      });

      const newQuestions = clone(state.questions);
      newQuestions[json.id] = json;

      state.forms = forms;
      state.questions = newQuestions;
    },
    createQuestionFailure: function (state, errors) {
      state.forms.status = STATUS.ERRORED;
      state.forms.errors = errors;
    },

    destroyQuestionStart: function (state) {
      state.forms.status = STATUS.MUTATING;
    },
    destroyQuestionFailure: function (state, errors) {
      state.forms.status = STATUS.ERRORED;
      state.forms.errors = errors;
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
      commit('fetchCommissionsStart');

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
          commit('fetchCommissionsFailure', data.errors);
        });
    },
    fetchFillout ({ state, commit }, id) {
      commit('fetchFilloutStart', id);

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      const url = `/api/commissions/${id}/fillout`;

      return axios.get(url, { credentials: 'same-origin', headers })
        .then(({ data }) => {
          commit('fetchFilloutSuccess', { id, json: data.record });
        })
        .catch(({ response }) => {
          const errors = response && response.data && response.data.errors;
          commit('fetchFilloutFailure', { id, errors });
        });
    },
    fetchEvents ({ state, commit }, id) {
      commit('fetchEventsStart', id);

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      const url = `/api/commissions/${id}/events`;

      return axios.get(url, { credentials: 'same-origin', headers })
        .then(({ data }) => {
          commit('fetchEventsSuccess', { id, json: data.records });
        })
        .catch(({ response }) => {
          const errors = response && response.data && response.data.errors;
          commit('fetchEventsFailure', { id, errors });
        });
    },
    fetchForms ({ state, commit }) {
      commit('fetchFormsStart');

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      const url = '/api/users/me/forms';

      return axios.get(url, { credentials: 'same-origin', headers })
        .then(({ data }) => {
          commit('fetchFormsSuccess', data.records);
        })
        .catch(({ response }) => {
          commit('fetchFormsFailure', response && response.data.errors);
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
    },
    updateCommission ({ state, commit }, payload) {
      const body = omit(payload, 'id');
      commit('updateCommissionStart');

      return axios.patch(`/api/commissions/${payload.id}`, body, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(function ({ data }) {
          commit('updateCommissionSuccess', data.record);
        })
        .catch(function (err) {
          const errors = err.response
            ? err.response.data.errors
            : [];
          commit('updateCommissionFailure', errors);
        });
    },
    updateQuestion ({ state, commit }, payload) {
      const body = omit(payload, 'id');
      commit('updateQuestionStart', payload.id);

      return axios.patch(`/api/questions/${payload.id}`, body, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(function ({ data }) {
          commit('updateQuestionSuccess', { id: payload.id, json: data.record });
        })
        .catch(function (err) {
          const errors = err.response
            ? err.response.data.errors
            : [];
          commit('updateQuestionFailure', { id: payload.id, errors });
        });
    },
    createQuestion ({ state, commit }, payload) {
      const { formId } = payload;
      commit('createQuestionStart');

      return axios.post(`/api/forms/${formId}/questions`, {}, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(({ data }) => {
          commit('createQuestionSuccess', { formId, json: data.record });
        })
        .catch(({ response }) => {
          commit('createQuestionFailure', response && response.data.errors);
        });
    },
    destroyQuestion ({ state, commit, dispatch }, payload) {
      const { id } = payload;
      commit('destroyQuestionStart');

      return axios.delete(`/api/questions/${id}`, {}, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(({ data }) => {
          dispatch('fetchForms');
        })
        .catch(({ response }) => {
          commit('destroyQuestionFailure', response && response.data.errors);
        });
    }
  }
});
