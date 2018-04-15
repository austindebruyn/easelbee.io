// ----------------------------------------------------------- //
// fetchEvents
// ----------------------------------------------------------- //

export function fetchEventsStart (state, id) {
  state.meta.events = {
    mutating: true,
    errored: false
  };
};

export function fetchEventsSuccess (state, { id, json }) {
  state.meta.events = {
    mutating: false,
    errored: false
  };
  state.events = {
    ...state.events,
    [id]: json
  };
};

export function fetchEventsFailure (state, { id, errors }) {
  state.meta.events = {
    mutating: false,
    errored: true
  };
};
