import VueTypes from 'vue-types';

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
  price: [Number, null],
  adjustedPrice: [Number, null],
  createdAt: VueTypes.string.isRequired,
  updatedAt: VueTypes.string.isRequired
});

export const attachmentShape = VueTypes.shape({
  id: VueTypes.number.isRequired,
  optionId: VueTypes.number.isRequired,
  createdAt: VueTypes.string.isRequired,
  updatedAt: VueTypes.string.isRequired,
  objectKey: VueTypes.string.isRequired,
  url: VueTypes.string.isRequired
});

export const optionShape = VueTypes.shape({
  id: VueTypes.number.isRequired,
  questionId: VueTypes.number.isRequired,
  value: VueTypes.string.isRequired,
  createdAt: VueTypes.string.isRequired,
  updatedAt: VueTypes.string.isRequired,
  delta: [null, VueTypes.shape({
    type: VueTypes.string.isRequired,
    amount: VueTypes.number.isRequired
  })],
  optionAttachment: [null, attachmentShape]
});

export const questionShape = VueTypes.shape({
  id: VueTypes.number.isRequired,
  formId: VueTypes.number.isRequired,
  options: [null, VueTypes.arrayOf(optionShape)],
  required: VueTypes.bool,
  order: VueTypes.number.isRequired,
  title: VueTypes.string.isRequired,
  type: VueTypes.oneOf(['radio', 'string']).isRequired,
  createdAt: VueTypes.string.isRequired,
  updatedAt: VueTypes.string.isRequired
});

export const filloutShape = VueTypes.shape({
  commission: commissionShape.isRequired,
  pairs: VueTypes.arrayOf(VueTypes.shape({
    question: questionShape.isRequired,
    value: VueTypes.any
  })).isRequired
});

export const formShape = VueTypes.shape({
  id: VueTypes.number.isRequired,
  userId: VueTypes.number.isRequired,
  name: VueTypes.string.isRequired,
  slug: VueTypes.string.isRequired,
  publicUrl: VueTypes.string.isRequired,
  submitUrl: VueTypes.string.isRequired,
  createdAt: VueTypes.string.isRequired,
  updatedAt: VueTypes.string.isRequired,
  submittedAt: [ String, null ],
  questions: VueTypes.arrayOf(Number)
});
