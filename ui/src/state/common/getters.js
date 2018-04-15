export function isi18nLoaded (state) {
  return state.i18n && !state.meta.i18n.mutating;
};

export function isi18nErrored (state) {
  return state.meta.i18n.errored;
};

export const getOptionsByQuestionId = state => questionId => {
  const optionIds = state.questions[questionId].options;

  if (!optionIds) return [];
  return optionIds.map(id => state.options[id]);
};

export const getOptionAttachmentByOptionId = function (state) {
  return function (optionId) {
    const attachmentId = state.options[optionId].optionAttachment;

    if (!attachmentId) return null;

    return state.optionAttachments[attachmentId];
  };
};
