import { isLoaded } from 'state/Resource';

export function isCompleted (state) {
  return isLoaded(state.formSubmission);
};

export function isUserArtist ({ form, artist }) {
  return artist && isLoaded(form) && artist.id === form.value.userId;
};

export function areFormsLoaded (state) {
  return state.forms && !state.meta.forms.mutating;
};

export function areCommissionsLoaded (state) {
  return state.commissions && !state.meta.commissions.mutating;
};

export function isi18nLoaded (state) {
  return state.i18n && !state.meta.i18n.mutating;
};

export function isi18nErrored (state) {
  return state.meta.i18n.errored;
};
