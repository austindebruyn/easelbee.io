import { isLoaded } from 'state/Resource';

export function isCompleted (state) {
  return isLoaded(state.formSubmission);
};

export function isUserArtist ({ form, artist }) {
  return artist && isLoaded(form) && artist.id === form.value.userId;
};
