import { normalize } from 'normalizr';
import * as models from '../artist/lib/models';

// ----------------------------------------------------------- //
// fetchForm
// ----------------------------------------------------------- //

export function fetchFormStart (state) {
  state.meta.form = {
    errored: false,
    mutating: true
  };
};

export function fetchFormSuccess (state, { record, user }) {
  state.meta.form = {
    mutating: false,
    errored: false
  };
  const flat = normalize(record, models.forms);

  state.form = flat.entities.forms[flat.result];
  state.questions = flat.entities.questions;
  state.options = flat.entities.options;
  state.optionAttachments = flat.entities.optionAttachments;
  state.artist = user;
};

export function fetchFormFailure (state) {
  state.meta.form = {
    mutating: false,
    errored: true
  };
};

// ----------------------------------------------------------- //
// submitForm
// ----------------------------------------------------------- //

export function submitFormStart (state) {
  state.meta.formSubmission = {
    errored: false,
    mutating: true
  };
};

export function submitFormSuccess (state, json) {
  state.meta.formSubmission = {
    mutating: false,
    errored: false
  };
  state.formSubmission = json;
};

export function submitFormFailure (state) {
  state.meta.formSubmission = {
    mutating: false,
    errored: true
  };
};

export * from '../common/mutations';
