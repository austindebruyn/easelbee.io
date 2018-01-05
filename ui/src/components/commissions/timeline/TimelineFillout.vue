<template lang="pug">
  .timeline-fillout
    timeline-fillout-item(
      v-for='pair in this.fillout.pairs'
      :key='pair.question.id'
      :question='pair.question'
      :value='pair.value'
    )
</template>

<script>
import { filloutShape } from 'components/shapes';
import TimelineFilloutItem from './TimelineFilloutItem';

export default {
  name: 'timeline-fillout',
  components: {
    /* eslint-disable vue/require-default-prop */
    'timeline-fillout-item': TimelineFilloutItem
  },
  props: {
    fillout: filloutShape.isRequired
  }
};
</script>
