<template lang="pug">
  .timeline-fillout-item
    .question
      .title {{ question.title }}
      .value
        | {{ displayValue }}
</template>

<script>
import { questionShape } from 'components/shapes';
import VueTypes from 'vue-types';
import find from 'lodash.find';

export default {
  name: 'timeline-fillout-item',
  props: {
    /* eslint-disable vue/require-default-prop */
    question: questionShape.isRequired,
    value: VueTypes.any.isRequired
  },
  computed: {
    displayValue: function () {
      if (this.question.type === 'radio') {
        return find(this.question.options, { id: this.value }).value;
      } else if (this.question.type === 'string') {
        return this.value;
      }
    }
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
