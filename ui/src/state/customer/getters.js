export function isCompleted (state) {
  return !state.meta.formSubmission.mutating && state.formSubmission;
};

export function isFormLoaded (state) {
  return !state.meta.form.mutating && state.form;
}

export function isUserArtist (state) {
  return isFormLoaded(state) && state.artist && state.artist.id === state.form.userId;
};

export * from '../common/getters';
