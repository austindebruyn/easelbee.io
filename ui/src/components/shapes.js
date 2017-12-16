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
