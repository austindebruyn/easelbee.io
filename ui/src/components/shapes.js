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
  body: VueTypes.string.isRequired,
  status: VueTypes.oneOf([
    'incoming',
    'inProgress',
    'inReview',
    'finished',
    'canceled'
  ]).isRequired,
  createdAt: VueTypes.string.isRequired,
  updatedAt: VueTypes.string.isRequired
});
