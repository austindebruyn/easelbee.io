import flatten from 'lodash.flatten';
import _find from 'lodash.find';
import pull from 'lodash.pull';
import Resource, { STATUS } from 'state/Resource';
import clone from '../lib/clone';

export function fetchI18nSuccess (state, locale) {
  state.i18n.status = STATUS.LOADED;
  state.i18n.value = locale;
};

export function setUser (state, json) {
  state.user.status = STATUS.LOADED;
  state.user.value = json;
};

export function fetchCommissionsStart (state) {
  // state.commissions.status = STATUS.MUTATING;
  state.meta.commissions.mutating = true;
};
export function fetchCommissionsSuccess (state, json) {
  state.meta.commissions.mutating = false;
  state.meta.commissions.errored = false;
  state.commissions = json;
  // state.commissions.status = STATUS.LOADED;
  // state.commissions.value = json;
};
export function fetchCommissionsFailure (state, errors) {
  state.meta.commissions.mutating = false;
  state.meta.commissions.errored = true;
  // state.commissions.status = STATUS.ERRORED;
  // state.commissions.errors = errors;
};

export function fetchFilloutStart (state, id) {
  const fillouts = { ...state.fillouts };
  if (!fillouts[id]) {
    fillouts[id] = new Resource();
  }
  fillouts[id].status = STATUS.MUTATING;
  state.fillouts = fillouts;
};
export function fetchFilloutSuccess (state, { id, json }) {
  const fillouts = { ...state.fillouts };
  fillouts[id].status = STATUS.LOADED;
  fillouts[id].value = json;
  state.fillouts = fillouts;
};
export function fetchFilloutFailure (state, { id, errors }) {
  const fillouts = { ...state.fillouts };
  fillouts[id].status = STATUS.ERRORED;
  fillouts[id].errors = errors;
  state.fillouts = fillouts;
};

export function fetchEventsStart (state, id) {
  const events = { ...state.events };
  if (!events[id]) {
    events[id] = new Resource();
  }
  events[id].status = STATUS.MUTATING;
  state.events = events;
};
export function fetchEventsSuccess (state, { id, json }) {
  const events = { ...state.events };
  events[id].status = STATUS.LOADED;
  events[id].value = json;
  state.events = events;
};
export function fetchEventsFailure (state, { id, errors }) {
  const events = { ...state.events };
  events[id].status = STATUS.ERRORED;
  events[id].errors = errors;
  state.events = events;
};

export function createCommissionStart (state) {
  // state.commissions.status = STATUS.MUTATING;
  state.meta.commissions.mutating = true;
};
export function createCommissionSuccess (state, json) {
  // state.commissions.status = STATUS.LOADED;
  // state.commissions.value.push(json);
  state.meta.commissions.mutating = false;
  state.meta.commissions.errored = false;
  const commissions = clone(state.commissions);
  commissions.push(json);
  state.commissions = commissions;
};
export function createCommissionFailure (state, errors) {
  // state.commissions.status = STATUS.ERRORED;
  // state.commissions.errors = errors;
  state.meta.commissions.mutating = false;
  state.meta.commissions.errored = true;
};

export function updateCommissionStart (state) {
  // state.commissions.status = STATUS.MUTATING;
  state.meta.commissions.mutating = true;
};
export function updateCommissionSuccess (state, json) {
  state.meta.commissions.mutating = false;
  state.meta.commissions.errored = false;

  const commissions = clone(state.commissions).filter(c => c.id !== json.id);
  commissions.push(json);

  state.commissions = commissions;
};
export function updateCommissionFailure (state, errors) {
  // state.commissions.status = STATUS.ERRORED;
  // state.commissions.errors = errors;
  state.meta.commissions.mutating = false;
  state.meta.commissions.errored = true;
};

export function fetchFormsStart (state) {
  // state.forms.status = STATUS.MUTATING;
  state.meta.forms.mutating = true;
};
export function fetchFormsSuccess (state, json) {
  state.meta.forms.mutating = false;
  state.meta.forms.errored = false;
  state.forms = json;
  // state.forms.status = STATUS.LOADED;
  // state.forms.value = json;

  flatten(json.map(f => f.questions)).forEach(function (question) {
    state.questions[question.id] = new Resource({
      value: question,
      status: STATUS.LOADED
    });
  });
};
export function fetchFormsFailure (state, errors) {
  state.meta.forms.mutating = false;
  state.meta.forms.errored = true;
  // state.forms.status = STATUS.ERRORED;
  // state.forms.errors = errors;
};

export function updateFormStart (state, id) {
  // state.forms.status = STATUS.MUTATING;
  state.meta.forms.mutating = true;
};
export function updateFormSuccess (state, { id, json }) {
  const forms = clone(state.forms);
  // forms.status = STATUS.LOADED;
  forms.forEach(function (form) {
    if (form.id === id) {
      Object.assign(form, json);
    }
  });
  state.forms = forms;
  state.meta.forms.mutating = false;
  state.meta.forms.errored = false;
};
export function updateFormFailure (state, { id, errors }) {
  // state.forms.status = STATUS.ERRORED;
  // state.forms.errors = errors;
  state.meta.forms.errored = true;
  state.meta.forms.mutating = false;
};

export function updateOptionDeltaStart (state, { questionId }) {
  const questions = clone(state.questions);
  questions[questionId].status = STATUS.MUTATING;
  state.questions = questions;
};
export function updateOptionDeltaSuccess (state, payload) {
  const questions = clone(state.questions);
  const { questionId, amount, type } = payload;
  questions[questionId].status = STATUS.LOADED;

  const option = _find(questions[questionId].value.options, { id: payload.optionId });
  option.delta = { type, amount };

  state.questions = questions;

  // update form
  state.forms = clone(state.forms);
  state.forms.forEach(function (form) {
    for (let i = 0; i < form.questions.length; i++) {
      if (form.questions[i].id === questionId) {
        form.questions[i] = state.questions[questionId].value;
        break;
      }
    }
  });
};
export function updateOptionDeltaFailure (state, { questionId, errors }) {
  const questions = clone(state.questions);
  questions[questionId].status = STATUS.ERRORED;
  questions[questionId].errors = errors;
  state.questions = questions;
};

export function destroyOptionDeltaStart (state, { questionId }) {
  const questions = clone(state.questions);
  questions[questionId].status = STATUS.MUTATING;
  state.questions = questions;
};
export function destroyOptionDeltaSuccess (state, payload) {
  const questions = clone(state.questions);
  const { questionId, optionId } = payload;
  questions[questionId].status = STATUS.LOADED;

  const option = _find(questions[questionId].value.options, { id: optionId });
  option.delta = null;

  state.questions = questions;

  // update form
  state.forms = clone(state.forms);
  state.forms.forEach(function (form) {
    for (let i = 0; i < form.questions.length; i++) {
      if (form.questions[i].id === questionId) {
        form.questions[i] = state.questions[questionId].value;
        break;
      }
    }
  });
};
export function destroyOptionDeltaFailure (state, { questionId, errors }) {
  const questions = clone(state.questions);
  questions[questionId].status = STATUS.ERRORED;
  questions[questionId].errors = errors;
  state.questions = questions;
};

export function attachFileToOptionStart (state, { questionId }) {
  const questions = clone(state.questions);
  questions[questionId].status = STATUS.MUTATING;
  state.questions = questions;
};
export function attachFileToOptionSuccess (state, payload) {
  const questions = clone(state.questions);
  const { questionId } = payload;
  questions[questionId].status = STATUS.LOADED;

  const option = _find(questions[questionId].value.options, {
    id: payload.option.id
  });
  Object.assign(option, payload.option);

  state.questions = questions;

  // update form
  state.forms = clone(state.forms);
  state.forms.forEach(function (form) {
    for (let i = 0; i < form.questions.length; i++) {
      if (form.questions[i].id === questionId) {
        form.questions[i] = state.questions[questionId].value;
        break;
      }
    }
  });
};
export function attachFileToOptionFailure (state, { questionId, errors }) {
  const questions = clone(state.questions);
  questions[questionId].status = STATUS.ERRORED;
  questions[questionId].errors = errors;
  state.questions = questions;
}

export function createFormStart (state) {
  // state.forms.status = STATUS.MUTATING;
  state.meta.forms.mutating = true;
};
export function createFormSuccess (state, json) {
  const forms = clone(state.forms);
  // forms.status = STATUS.LOADED;
  forms.push(json);
  state.forms = forms;
  state.meta.forms.mutating = false;
  state.meta.forms.errored = false;
};
export function createFormFailure (state, errors) {
  // state.forms.status = STATUS.ERRORED;
  // state.forms.errors = errors;
  state.meta.forms.errored = true;
  state.meta.forms.mutating = false;
};

export function destroyFormStart (state) {
  // state.forms.status = STATUS.MUTATING;
  state.meta.forms.mutating = false;
};
export function destroyFormSuccess (state, id) {
  const forms = clone(state.forms);
  // forms.status = STATUS.LOADED;

  for (let i = 0; i < forms.length; i++) {
    const form = forms[i];
    if (form.id === id) {
      pull(forms, form);
      break;
    }
  }

  state.forms = forms;
  state.meta.forms.mutating = false;
  state.meta.forms.errored = false;
};
export function destroyFormFailure (state, errors) {
  // state.forms.status = STATUS.ERRORED;
  // state.forms.errors = errors;
  state.meta.forms.mutating = false;
  state.meta.forms.errored = true;
};

export function updateQuestionStart (state, id) {
  const questions = clone(state.questions);
  questions[id].status = STATUS.MUTATING;
  state.questions = questions;
};
export function updateQuestionSuccess (state, { id, json }) {
  delete state.questions[id];
  state.questions[json.id] = new Resource({
    status: Resource.LOADED,
    value: json
  });

  state.forms = state.forms.map(function (form) {
    if (form.id === json.formId) {
      const newForm = clone(form);
      newForm.questions = newForm.questions.filter(q => q.id !== id);
      newForm.questions.push(json);
      return newForm;
    }
    return clone(form);
  });
};
export function updateQuestionFailure (state, { id, errors }) {
  state.questions[id].status = STATUS.ERRORED;
  state.questions[id].errors = errors;
};

export function createQuestionStart (state) {
  state.meta.forms.mutating = false;
};
export function createQuestionSuccess (state, { formId, json }) {
  const forms = clone(state.forms);

  // forms.status = STATUS.LOADED;
  state.meta.forms.mutating = false;
  state.meta.forms.errored = false;

  forms.forEach(function (form) {
    if (form.id === formId) {
      form.questions.push(json);
    }
  });

  const newQuestions = clone(state.questions);
  newQuestions[json.id] = json;

  state.forms = forms;
  state.questions = newQuestions;
};
export function createQuestionFailure (state, errors) {
  // state.forms.status = STATUS.ERRORED;
  // state.forms.errors = errors;
  state.meta.forms.mutating = false;
  state.meta.forms.errored = true;
};

export function destroyQuestionStart (state) {
  state.meta.forms.mutating = false;
};
export function destroyQuestionFailure (state, errors) {
  // state.forms.status = STATUS.ERRORED;
  // state.forms.errors = errors;
  state.meta.forms.mutating = false;
  state.meta.forms.errored = true;
};

// customer
export function fetchFormStart (state) {
  state.form.status = STATUS.MUTATING;
};
export function fetchFormSuccess (state, { record, user }) {
  state.form.status = STATUS.LOADED;
  state.form.value = record;
  state.form = clone(state.form);
  state.artist = user;
};
export function fetchFormFailure (state, errors) {
  state.form.status = STATUS.ERRORED;
  state.form.errors = errors;
};
export function submitFormStart (state) {
  state.formSubmission.status = STATUS.MUTATING;
};
export function submitFormSuccess (state, json) {
  state.formSubmission.status = STATUS.LOADED;
  state.formSubmission.value = json;
};
export function submitFormFailure (state, errors) {
  state.formSubmission.status = STATUS.ERRORED;
  state.form.errors = errors;
};
