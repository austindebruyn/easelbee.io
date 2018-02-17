<template lang="pug">
  .question-form
    h4 {{ question.title }}
</template>

<script>
import { questionShape } from 'components/shapes';

export default {
  name: 'question-form',
  props: {
    /* eslint-disable vue/require-default-prop */
    question: questionShape.isRequired
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .question-form {

  }
</style>
