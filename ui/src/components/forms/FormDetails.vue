<template lang="pug">
  .form-details
    .row
      .col-12.col-md-1
        p
      .col-12.col-md-8
        .card
          question-details(
            v-if='form.questions[0]'
            :question='form.questions[0]'
          )
      .col-12.col-md-3
        form-details-info-card(:form='form')
</template>

<script>
import { formShape } from 'components/shapes';
import FormDetailsInfoCard from './FormDetailsInfoCard';
import QuestionDetails from './questions/QuestionDetails';

export default {
  name: 'form-details',
  components: {
    'form-details-info-card': FormDetailsInfoCard,
    'question-details': QuestionDetails
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    form: formShape.isRequired
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';
</style>
