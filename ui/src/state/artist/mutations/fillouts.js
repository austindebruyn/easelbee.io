// ----------------------------------------------------------- //
// fetchFillout
// ----------------------------------------------------------- //

export function fetchFilloutStart (state, id) {
  state.meta.fillouts = {
    mutating: true,
    errored: false
  };
};

export function fetchFilloutSuccess (state, { id, json }) {
  state.meta.fillouts = {
    mutating: false,
    errored: false
  };
  state.fillouts = {
    ...state.fillouts,
    [id]: json
  };
};

export function fetchFilloutFailure (state, { id, errors }) {
  state.meta.fillouts = {
    mutating: false,
    errored: true
  };
};
