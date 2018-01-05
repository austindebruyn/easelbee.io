<template lang="pug">
  .timeline-fillout-item
    .question
      .title {{ question.title }}
      .value
        | {{ value }}
</template>

<script>
import { questionShape } from 'components/shapes';
import VueTypes from 'vue-types';

export default {
  name: 'timeline-fillout-item',
  props: {
    /* eslint-disable vue/require-default-prop */
    question: questionShape.isRequired,
    value: VueTypes.any.isRequired
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .timeline-fillout-item {
    color: $blue-dark;

    .question {
      padding-bottom: 1rem;

      .title {
        font-size: 1rem;
        font-weight: bold;
      }

      .value {
        padding-left: 20px;
      }
    }

    &:last-child {
      .question {
        padding-bottom: 0;
      }
    }
  }
</style>
