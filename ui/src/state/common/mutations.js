export function fetchI18nSuccess (state) {
  state.meta.i18n = {
    mutating: false
  };
  state.i18n = true;
};

export function setUser (state, json) {
  state.user = json;
};
