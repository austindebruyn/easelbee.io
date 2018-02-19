<template lang="pug">
  .customer-form-question-card
    .card
      .progress-bar
      .card-body
        question-form(
          :key='index'
          :question='form.questions[this.index]'
          @submit='handleSubmit'
        )
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
  },
  data: function () {
    return {
      values: {},
      index: 0
    };
  },
  methods: {
    handleSubmit: function (value) {
      this.values[this.form.questions[this.index].id] = value;
      this.index = this.index + 1;
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
