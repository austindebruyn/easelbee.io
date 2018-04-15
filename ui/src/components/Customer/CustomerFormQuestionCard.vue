<template lang="pug">
  .customer-form-question-card
    .row
      .col-2
        .card
          commission-price-counter(
            :values='values'
            :form='form'
          )
      .col-10
        .card
          .progress-bar
          .card-body
            question-form(
              :key='index'
              :question='currentQuestion'
              :isFinalQuestion='isFinalQuestion'
              @submit='handleSubmit'
            )
</template>

<script>
import clone from 'lib/clone';
import { formShape } from 'components/shapes';
import QuestionForm from 'components/Customer/QuestionForm/QuestionForm';
import CommissionPriceCounter from './CommissionPriceCounter';

export default {
  name: 'customer-form-question-card',
  components: {
    'question-form': QuestionForm,
    'commission-price-counter': CommissionPriceCounter
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    form: formShape.isRequired
  },
  data: function () {
    return {
      values: {},
      index: 0
    };
  },
  computed: {
    isFinalQuestion: function () {
      return this.index === this.form.questions.length - 1;
    },
    price: function () {
      return 0;
    },
    currentQuestion: function () {
      const id = this.form.questions[this.index];
      return this.$store.state.questions[id];
    }
  },
  methods: {
    handleSubmit: function (value) {
      this.values = clone(this.values);
      const key = `question_${this.currentQuestion.id}`;
      this.values[key] = value;

      if (this.isFinalQuestion) {
        this.$emit('complete', this.values);
      } else {
        this.index = this.index + 1;
      }
    }
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
