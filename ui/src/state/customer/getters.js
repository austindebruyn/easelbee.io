export function isCompleted (state) {
  return !state.meta.formSubmission.mutating && state.formSubmission;
};

export function isFormLoaded (state) {
  return !state.meta.form.mutating && state.form;
}

export function isUserArtist (state) {
  return isFormLoaded(state) && state.artist && state.user && state.user.id === state.artist.id;
};

export * from '../common/getters';
