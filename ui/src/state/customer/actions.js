import axios from 'axios';

export function submitForm ({ state, commit }, payload) {
  commit('submitFormStart');

  const { slug } = state.form;

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
      commit('submitFormFailure');
    });
}

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
    .catch(() => {
      commit('fetchFormFailure');
    });
}
