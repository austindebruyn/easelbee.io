export function areFormsLoaded (state) {
  return state.forms && !state.meta.forms.mutating;
};

export function areCommissionsLoaded (state) {
  return state.commissions && !state.meta.commissions.mutating;
};

export const getQuestionsByFormId = state => formId => Object.values(state.questions).filter(q => q.formId === formId);

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

export const getFilloutByCommissionId = state => commissionId => {
  return state.fillouts[commissionId] || null;
};

export const getEventsByCommissionId = state => commissionId => {
  return state.events[commissionId] || null;
};

export * from '../common/getters';
