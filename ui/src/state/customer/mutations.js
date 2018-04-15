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
  state.form = record;
  state.artist = user;
};

export function fetchFormFailure (state, errors) {
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
