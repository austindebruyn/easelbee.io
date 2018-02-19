<template lang="pug">
  .question-form
    h4 {{ question.title }}
    form(@submit='handleSubmit')
      .control
        c-string(
          ref='input'
          v-if='question.type === "string"'
          :id='question.id'
        )
      button.btn.btn-primary(type='submit') Next
</template>

<script>
import { questionShape } from 'components/shapes';
import CString from './controls/CString';

export default {
  name: 'question-form',
  components: {
    'c-string': CString
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    question: questionShape.isRequired
  },
  methods: {
    handleSubmit: function (e) {
      e.preventDefault();
      this.$emit('submit', this.$refs.input.value);
    }
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .question-form {
    h4 {
      padding-bottom: 40px;
    }

    .control {
      padding-bottom: 20px;
    }
  }
</style>
