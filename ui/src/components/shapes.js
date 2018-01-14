import VueTypes from 'vue-types';

export const formShape = VueTypes.shape({
  id: VueTypes.number.isRequired,
  userId: VueTypes.number.isRequired,
  name: VueTypes.string.isRequired,
  slug: VueTypes.string.isRequired,
  publicUrl: VueTypes.string.isRequired,
  submitUrl: VueTypes.string.isRequired,
  createdAt: VueTypes.string.isRequired,
  updatedAt: VueTypes.string.isRequired
});

export const commissionShape = VueTypes.shape({
  id: VueTypes.number.isRequired,
  userId: VueTypes.number.isRequired,
  email: VueTypes.string.isRequired,
  nickname: VueTypes.string.isRequired,
  status: VueTypes.oneOf([
    'incoming',
    'inprogress',
    'inreview',
    'finished',
    'canceled'
  ]).isRequired,
  createdAt: VueTypes.string.isRequired,
  updatedAt: VueTypes.string.isRequired
});

export const filloutShape = VueTypes.shape({
  commission: commissionShape.isRequired,
  pairs: VueTypes.arrayOf(VueTypes.shape({
    question: VueTypes.object.isRequired,
    value: VueTypes.any
  })).isRequired
});

export const questionShape = VueTypes.shape({
  id: VueTypes.number.isRequired,
  formId: VueTypes.number.isRequired,
  userId: VueTypes.number.isRequired,
  options: VueTypes.arrayOf(VueTypes.shape({
    id: VueTypes.number.isRequired,
    value: VueTypes.string.isRequired,
    createdAt: VueTypes.string.isRequired,
    updatedAt: VueTypes.string.isRequired
  })),
  required: VueTypes.bool,
  title: VueTypes.string.isRequired,
  type: VueTypes.oneOf(['radio', 'string']).isRequired,
  createdAt: VueTypes.string.isRequired,
  updatedAt: VueTypes.string.isRequired
});
