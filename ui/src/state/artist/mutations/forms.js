import { normalize } from 'normalizr';
import * as models from '../lib/models';
import clone from 'lib/clone';

// ----------------------------------------------------------- //
// fetchForms
// ----------------------------------------------------------- //

export function fetchFormsStart (state) {
  state.meta.forms = {
    errored: false,
    mutating: true
  };
};

export function fetchFormsSuccess (state, json) {
  state.meta.forms = {
    mutating: false,
    errored: false
  };

  const flat = normalize(json, [models.forms]);
  state.forms = flat.entities.forms;
  state.questions = flat.entities.questions;
  state.options = flat.entities.options;
  state.optionAttachments = flat.entities.optionAttachments;
};

export function fetchFormsFailure (state, errors) {
  state.meta.forms = {
    mutating: false,
    errored: true
  };
};

// ----------------------------------------------------------- //
// updateForm
// ----------------------------------------------------------- //

export function updateFormStart (state, id) {
  state.meta.forms = {
    errored: false,
    mutating: true
  };
};

export function updateFormSuccess (state, { id, json }) {
  state.meta.forms = {
    errored: false,
    mutating: false
  };
  state.forms = {
    ...state.forms,
    [id]: json
  };
};

export function updateFormFailure (state, { id, errors }) {
  state.meta.forms = {
    mutating: false,
    errored: true
  };
};

// ----------------------------------------------------------- //
// createForm
// ----------------------------------------------------------- //

export function createFormStart (state) {
  state.meta.forms = {
    errored: false,
    mutating: true
  };
};

export function createFormSuccess (state, json) {
  state.meta.forms = {
    mutating: false,
    errored: false
  };
  state.forms = {
    ...state.forms,
    [json.id]: json
  };
};

export function createFormFailure (state) {
  state.meta.forms = {
    errored: true,
    mutating: false
  };
};

// ----------------------------------------------------------- //
// destroyForm
// ----------------------------------------------------------- //

export function destroyFormStart (state) {
  state.meta.forms = {
    errored: false,
    mutating: false
  };
};

export function destroyFormSuccess (state, id) {
  state.meta.forms = {
    mutating: false,
    errored: false
  };
  const forms = clone(state.forms);
  delete forms[id];
  state.forms = forms;
};

export function destroyFormFailure (state) {
  state.meta.forms = {
    mutating: false,
    errored: true
  };
};
