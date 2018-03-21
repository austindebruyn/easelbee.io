import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import omit from 'lodash.omit';
import flatten from 'lodash.flatten';
import _find from 'lodash.find';
import pull from 'lodash.pull';
import Resource, { STATUS, isLoaded } from 'state/Resource';
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
  i18n: new Resource(),
  // Customer
  form: new Resource(),
  formSubmission: new Resource()
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: initialState,

  mutations: {
    fetchI18nSuccess: function (state, locale) {
      state.i18n.status = STATUS.LOADED;
      state.i18n.value = locale;
    },

    setUser: function (state, json) {
      state.user.status = STATUS.LOADED;
      state.user.value = json;
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

    updateFormStart: function (state, id) {
      state.forms.status = STATUS.MUTATING;
    },
    updateFormSuccess: function (state, { id, json }) {
      const forms = clone(state.forms);
      forms.status = STATUS.LOADED;
      forms.value.forEach(function (form) {
        if (form.id === id) {
          Object.assign(form, json);
        }
      });
      state.forms = forms;
    },
    updateFormFailure: function (state, { id, errors }) {
      state.forms.status = STATUS.ERRORED;
      state.forms.errors = errors;
    },

    updateOptionDeltaStart: function (state, { questionId }) {
      const questions = clone(state.questions);
      questions[questionId].status = STATUS.MUTATING;
      state.questions = questions;
    },
    updateOptionDeltaSuccess: function (state, payload) {
      const questions = clone(state.questions);
      const { questionId, id, amount, type } = payload;
      questions[questionId].status = STATUS.LOADED;

      const option = _find(questions[questionId].value.options, { id: payload.optionId });
      option.delta = { type, amount };

      state.questions = questions;

      // update form
      state.forms = clone(state.forms);
      state.forms.value.forEach(function (form) {
        for (let i = 0; i < form.questions.length; i++) {
          if (form.questions[i].id === questionId) {
            form.questions[i] = state.questions[questionId].value;
            break;
          }
        }
      });
    },
    updateOptionDeltaFailure: function (state, { questionId, errors }) {
      const questions = clone(state.questions);
      questions[questionId].status = STATUS.ERRORED;
      questions[questionId].errors = errors;
      state.questions = questions;
    },

    destroyOptionDeltaStart: function (state, { questionId }) {
      const questions = clone(state.questions);
      questions[questionId].status = STATUS.MUTATING;
      state.questions = questions;
    },
    destroyOptionDeltaSuccess: function (state, payload) {
      const questions = clone(state.questions);
      const { questionId, optionId, id, amount, type } = payload;
      questions[questionId].status = STATUS.LOADED;

      const option = _find(questions[questionId].value.options, { id: optionId });
      option.delta = null;

      state.questions = questions;

      // update form
      state.forms = clone(state.forms);
      state.forms.value.forEach(function (form) {
        for (let i = 0; i < form.questions.length; i++) {
          if (form.questions[i].id === questionId) {
            form.questions[i] = state.questions[questionId].value;
            break;
          }
        }
      });
    },
    destroyOptionDeltaFailure: function (state, { questionId, errors }) {
      const questions = clone(state.questions);
      questions[questionId].status = STATUS.ERRORED;
      questions[questionId].errors = errors;
      state.questions = questions;
    },

    createFormStart: function (state) {
      state.forms.status = STATUS.MUTATING;
    },
    createFormSuccess: function (state, json) {
      const forms = clone(state.forms);
      forms.status = STATUS.LOADED;
      forms.value.push(json);
      state.forms = forms;
    },
    createFormFailure: function (state, errors) {
      state.forms.status = STATUS.ERRORED;
      state.forms.errors = errors;
    },

    destroyFormStart: function (state) {
      state.forms.status = STATUS.MUTATING;
    },
    destroyFormSuccess: function (state, id) {
      const forms = clone(state.forms);
      forms.status = STATUS.LOADED;

      for (let i = 0; i < forms.value.length; i++) {
        const form = forms.value[i];
        if (form.id === id) {
          pull(forms.value, form);
          break;
        }
      }

      state.forms = forms;
    },
    destroyFormFailure: function (state, errors) {
      state.forms.status = STATUS.ERRORED;
      state.forms.errors = errors;
    },

    updateQuestionStart: function (state, id) {
      const questions = clone(state.questions);
      questions[id].status = STATUS.MUTATING;
      state.questions = questions;
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

    // customer
    fetchFormStart: function (state) {
      state.form.status = STATUS.MUTATING;
    },
    fetchFormSuccess: function (state, { record, user }) {
      state.form.status = STATUS.LOADED;
      state.form.value = record;
      state.form = clone(state.form);
      state.artist = user;
    },
    fetchFormFailure: function (state, errors) {
      state.form.status = STATUS.ERRORED;
      state.form.errors = errors;
    },
    submitFormStart: function (state) {
      state.formSubmission.status = STATUS.MUTATING;
    },
    submitFormSuccess: function (state, json) {
      state.formSubmission.status = STATUS.LOADED;
      state.formSubmission.value = json;
    },
    submitFormFailure: function (state, errors) {
      state.formSubmission.status = STATUS.ERRORED;
      state.form.errors = errors;
    }
  },

  getters: {
    isCompleted (state) {
      return isLoaded(state.formSubmission);
    },
    isUserArtist ({ form, artist }) {
      return artist && isLoaded(form) && artist.id === form.value.userId;
    }
  },

  actions: {
    fetchForm ({ state, commit }, slug) {
      commit('fetchFormStart');

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      const url = `/api/forms/${slug}`;

      return axios.get(url, { credentials: 'same-origin', headers })
        .then(({ data }) => {
          commit('fetchFormSuccess', data);
        })
        .catch(({ response }) => {
          const errors = response && response.data && response.data.errors;
          commit('fetchFormFailure', errors);
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
    createForm ({ state, commit }) {
      commit('createFormStart');

      return axios.post('/api/users/me/forms', {}, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(({ data }) => {
          commit('createFormSuccess', data.record);
        })
        .catch(({ response }) => {
          commit('createFormFailure', response && response.data.errors);
        });
    },
    destroyForm ({ state, commit }, { id }) {
      commit('destroyFormStart');

      return axios.delete(`/api/forms/${id}`, {}, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(() => {
          commit('destroyFormSuccess', id);
        })
        .catch(({ response }) => {
          commit('destroyFormFailure', response && response.data.errors);
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
    updateOptionDelta ({ state, commit }, payload) {
      const { questionId, id, type, amount } = payload;
      commit('updateOptionDeltaStart', { questionId });

      return axios.put(`/api/options/${id}/delta`, payload.delta, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(function ({ data }) {
          commit('updateOptionDeltaSuccess', {
            questionId,
            ...data.record
          });
        })
        .catch(function (err) {
          const errors = err.response
            ? err.response.data.errors
            : [];
          commit('updateOptionDeltaFailure', { questionId, errors });
        });
    },
    destroyOptionDelta ({ state, commit }, payload) {
      const { questionId, id, type } = payload;
      commit('destroyOptionDeltaStart', { questionId });

      return axios.delete(`/api/options/${id}/delta`, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(function () {
          commit('destroyOptionDeltaSuccess', {
            questionId,
            optionId: id
          });
        })
        .catch(function (err) {
          const errors = err.response
            ? err.response.data.errors
            : [];
          commit('destroyOptionDeltaFailure', { questionId, id, errors });
        });
    },
    updateForm ({ state, commit }, payload) {
      const body = omit(payload, 'id');
      commit('updateFormStart', payload.id);

      return axios.patch(`/api/forms/${payload.id}`, body, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(function ({ data }) {
          commit('updateFormSuccess', { id: payload.id, json: data.record });
        })
        .catch(function (err) {
          const errors = err.response
            ? err.response.data.errors
            : [];
          commit('updateFormFailure', { id: payload.id, errors });
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
    },
    submitForm ({ state, commit }, payload) {
      commit('submitFormStart');

      const { slug } = state.form.value;

      return axios.post(`/forms/${slug}/submit`, payload, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(({ data }) => {
          commit('submitFormSuccess', { json: data.record });
        })
        .catch(({ response }) => {
          commit('submitFormFailure', response && response.data.errors);
        });
    }
  }
});
