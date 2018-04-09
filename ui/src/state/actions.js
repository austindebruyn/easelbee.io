import axios from 'axios';
import omit from 'lodash.omit';

export function fetchForm ({ state, commit }, slug) {
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
}

export function fetchCommissions ({ state, commit }) {
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
}

export function fetchFillout ({ state, commit }, id) {
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
}

export function fetchEvents ({ state, commit }, id) {
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
}

export function fetchForms ({ state, commit }) {
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
}

export function createForm ({ state, commit }) {
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
}

export function destroyForm ({ state, commit }, { id }) {
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
}

export function createCommission ({ state, commit }, payload) {
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

export function updateCommission ({ state, commit }, payload) {
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
}

export function updateQuestion ({ state, commit, dispatch }, payload) {
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
}

export function updateOptionDelta ({ state, commit }, payload) {
  const { questionId, id } = payload;
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
}

export function destroyOptionDelta ({ state, commit }, payload) {
  const { questionId, id } = payload;
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
}

export function updateForm ({ state, commit }, payload) {
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
}

export function createQuestion ({ state, commit }, payload) {
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
}

export function destroyQuestion ({ state, commit, dispatch }, payload) {
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

export function submitForm ({ state, commit }, payload) {
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

export function attachFileToOption ({ state, commit }, payload) {
  const { questionId, id, file } = payload;
  commit('attachFileToOptionStart', { questionId });

  const data = new FormData();
  data.append('file', file);

  return axios.post(`/api/options/${id}/attachment`, data, {
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(function ({ data }) {
      commit('attachFileToOptionSuccess', {
        questionId,
        option: data.option
      });
    })
    .catch(function (err) {
      const errors = err.response
        ? err.response.data.errors
        : [];
      commit('attachFileToOptionFailure', { questionId, id, errors });
    });
}
