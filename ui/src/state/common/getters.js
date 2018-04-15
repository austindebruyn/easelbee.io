export function isi18nLoaded (state) {
  return state.i18n && !state.meta.i18n.mutating;
};

export function isi18nErrored (state) {
  return state.meta.i18n.errored;
};
