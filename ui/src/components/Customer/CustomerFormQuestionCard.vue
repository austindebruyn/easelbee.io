<template lang="pug">
  .customer-form-question-card
    .card
      .progress-bar
      .card-body
        question-form(:question='form.questions[0]')
</template>

<script>
import { formShape } from 'components/shapes';
import QuestionForm from 'components/Customer/QuestionForm/QuestionForm';

export default {
  name: 'customer-form-question-card',
  components: {
    'question-form': QuestionForm
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    form: formShape.isRequired
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';

  h1 {
    font-size: 1.6rem;
  }

  h2 {
    font-size: 1rem;
    color: $gray;
  }
</style>
