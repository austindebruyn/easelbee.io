export function areFormsLoaded (state) {
  return state.forms && !state.meta.forms.mutating;
};

export function areCommissionsLoaded (state) {
  return state.commissions && !state.meta.commissions.mutating;
};

export const getQuestionsByFormId = state => formId => Object.values(state.questions).filter(q => q.formId === formId);

export const getFilloutByCommissionId = state => commissionId => {
  return state.fillouts[commissionId] || null;
};

export const getEventsByCommissionId = state => commissionId => {
  return state.events[commissionId] || null;
};

export * from '../common/getters';
