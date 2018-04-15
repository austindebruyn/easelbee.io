<template lang="pug">
  .form-details
    form-details-question-selector(
      :current='order'
      :total='this.form.questions.length'
      @click='handleSelectQuestion'
      @createClick='handleCreateQuestionClick'
    )
    .row
      .col-12.col-md-9
        .card(
          v-if='selectedQuestion'
        )
          question-details(
            :key='selectedQuestion.id'
            :question='selectedQuestion'
          )
      .col-12.col-md-3
        form-details-info-card(:form='form')
</template>

<script>
import find from 'lodash.find';

import { formShape } from 'components/shapes';
import FormDetailsInfoCard from './FormDetailsInfoCard';
import QuestionDetails from './questions/QuestionDetails';
import FormDetailsQuestionSelector from './FormDetailsQuestionSelector';

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
    questions: function () {
      return this.$store.getters.getQuestionsByFormId(this.form.id);
    },
    selectedQuestion: function () {
      return find(this.questions, { order: this.order });
    }
  },
  methods: {
    handleSelectQuestion: function (order) {
      this.order = order;
    },
    handleCreateQuestionClick: function () {
      this.$store.dispatch('createQuestion', { formId: this.form.id });
    }
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';
</style>
