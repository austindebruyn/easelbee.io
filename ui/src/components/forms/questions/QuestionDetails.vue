<template lang="pug">
  .question-details
    .card-body
      form
        .form-group
          h4 question title
          v-input-text(
            :defaultValue='question.title'
            kind='madlibs'
            size='lg'
          )
        .form-group
          h4 type
          p coming soon...
        .form-group
          h4 options
          p coming soon...
</template>

<script>
import { questionShape } from 'components/shapes';
import VInputText from 'components/controls/VInputText';

export default {
  name: 'question-details',
  components: {
    'v-input-text': VInputText
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    question: questionShape.isRequired
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .card-body {
    padding: 3rem;
  }

  .form-group {
    padding-bottom: 40px;

    &:last-child {
      padding-bottom: 0;
    }
  }

  h4 {
    font-family: 'tensoregular', sans-serif;
    text-transform: uppercase;
    color: $gray;
    font-size: 1rem;
  }
</style>
