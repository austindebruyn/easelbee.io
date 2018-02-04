<template lang="pug">
  .form-details
    form-details-question-selector(
      :current='order'
      :total='this.form.questions.length'
      @click='handleSelectQuestion'
    )
    .row
      .col-12.col-md-9
        .card(
          v-if='selectedQuestion'
        )
          question-details(
            :question='selectedQuestion'
          )
      .col-12.col-md-3
        form-details-info-card(:form='form')
</template>

<script>
import { formShape } from 'components/shapes';
import FormDetailsInfoCard from './FormDetailsInfoCard';
import QuestionDetails from './questions/QuestionDetails';
import FormDetailsQuestionSelector from './FormDetailsQuestionSelector';
import find from 'lodash.find';

export default {
  name: 'form-details',
  components: {
    'form-details-info-card': FormDetailsInfoCard,
    'form-details-question-selector': FormDetailsQuestionSelector,
    'question-details': QuestionDetails
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    form: formShape.isRequired
  },
  data: function () {
    return {
      order: 1
    };
  },
  computed: {
    selectedQuestion: function () {
      return find(this.form.questions, { order: this.order });
    }
  },
  methods: {
    handleSelectQuestion: function (order) {
      this.order = order;
    }
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';
</style>
