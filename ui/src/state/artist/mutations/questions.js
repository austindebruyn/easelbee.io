import { normalize } from 'normalizr';
import * as models from '../lib/models';

// ----------------------------------------------------------- //
// updateQuestion
// ----------------------------------------------------------- //

export function updateQuestionStart (state, id) {
  state.meta.questions = {
    mutating: true,
    errored: false
  };
};

export function updateQuestionSuccess (state, { id, json }) {
  state.meta.questions = {
    mutating: false,
    errored: false
  };

  const flat = normalize(json, models.questions);

  state.questions = {
    ...state.questions,
    ...flat.entities.questions
  };
  state.options = {
    ...state.options,
    ...flat.entities.options
  };
  state.optionAttachments = {
    ...state.optionAttachments,
    ...flat.entities.optionAttachments
  };

  // somehow update list of question ids for form?
  // json.formId
};

export function updateQuestionFailure (state, { id, errors }) {
  state.meta.questions = {
    mutating: false,
    errored: true
  };
};

// ----------------------------------------------------------- //
// createQuestion
// ----------------------------------------------------------- //

export function createQuestionStart (state) {
  state.meta.forms = {
    errored: false,
    mutating: false
  };
};

export function createQuestionSuccess (state, { json }) {
  state.meta.forms = {
    mutating: false,
    errored: false
  };

  const flat = normalize(json, models.questions);

  state.questions = {
    ...state.questions,
    ...flat.entities.questions
  };
  state.options = {
    ...state.options,
    ...flat.entities.options
  };
  state.optionAttachments = {
    ...state.optionAttachments,
    ...flat.entities.optionAttachments
  };

  state.forms[json.formId].questions.push(json.id);
};

export function createQuestionFailure (state) {
  state.meta.forms = {
    mutating: false,
    errored: true
  };
};

// ----------------------------------------------------------- //
// destroyQuestion
// ----------------------------------------------------------- //

export function destroyQuestionStart (state) {
  state.meta.forms = {
    errored: false,
    mutating: false
  };
};

export function destroyQuestionFailure (state) {
  state.meta.forms = {
    mutating: false,
    errored: true
  };
};
