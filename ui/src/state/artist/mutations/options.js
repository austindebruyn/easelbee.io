import { normalize } from 'normalizr';
import * as models from '../lib/models';
import clone from 'lib/clone';

// ----------------------------------------------------------- //
// updateOptionDelta
// ----------------------------------------------------------- //

export function updateOptionDeltaStart (state, { questionId }) {
  state.meta.questions = {
    errored: false,
    mutating: true
  };
};

export function updateOptionDeltaSuccess (state, payload) {
  state.meta.questions = {
    mutating: false,
    errored: false
  };
  const { amount, type } = payload;

  const options = clone(state.options);
  options[payload.optionId].delta = { type, amount };
  state.options = options;
};

export function updateOptionDeltaFailure (state, { questionId, errors }) {
  state.meta.questions = {
    mutating: false,
    errored: true
  };
};

// ----------------------------------------------------------- //
// destroyOptionDelta
// ----------------------------------------------------------- //

export function destroyOptionDeltaStart (state) {
  state.meta.questions = {
    errored: false,
    mutating: true
  };
};

export function destroyOptionDeltaSuccess (state, { optionId }) {
  state.meta.questions = {
    errored: false,
    mutating: false
  };
  const options = clone(state.options);
  options[optionId].delta = null;
  state.options = options;
};

export function destroyOptionDeltaFailure (state) {
  state.meta.questions = {
    mutating: false,
    errored: true
  };
};

// ----------------------------------------------------------- //
// attachFileToOption
// ----------------------------------------------------------- //

export function attachFileToOptionStart (state, { questionId }) {
  state.meta.questions = {
    errored: false,
    mutating: true
  };
};

export function attachFileToOptionSuccess (state, payload) {
  state.meta.questions = {
    mutating: false,
    errored: false
  };

  const flat = normalize(payload.option, models.options);

  state.options = {
    ...state.options,
    ...flat.entities.options
  };
  state.optionAttachments = {
    ...state.optionAttachments,
    ...flat.entities.optionAttachments
  };
};

export function attachFileToOptionFailure (state, { questionId, errors }) {
  state.meta.questions = {
    mutating: false,
    errored: true
  };
}
