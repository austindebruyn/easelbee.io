<template lang="pug">
  .commission-timeline
    .date-row
      .date-bubble
        .count 1
        .span months ago
      .date-label
        | {{ commission.nickname }} filled out your form.
    .date-content
      .card
        .card-body
          timeline-fillout(v-if='isFilloutLoaded', :fillout='fillout')
          loading-spinner(v-else=true)
</template>

<script>
import { commissionShape } from 'components/shapes';
import { isLoaded } from 'state/Resource';
import LoadingSpinner from 'components/LoadingSpinner';
import TimelineFillout from './TimelineFillout';

export default {
  name: 'timeline',
  components: {
    'loading-spinner': LoadingSpinner,
    'timeline-fillout': TimelineFillout
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    commission: commissionShape.isRequired
  },
  computed: {
    fillout: function () {
      const resource = this.$store.state.fillouts[this.commission.id];
      return resource && resource.value;
    },
    isFilloutLoaded: function () {
      const resource = this.$store.state.fillouts[this.commission.id];
      return resource && isLoaded(resource);
    }
  },
  mounted: function () {
    this.$store.dispatch('fetchFillout', this.commission.id);
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .commission-timeline {
    .fillout-card {
      padding: 4rem;
    }

    .date-row {
      display: flex;
      align-items: center;
    }

    $date-content-gutter: 18px;

    .date-bubble {
      font-family: 'sinkinsans', sans-serif;
      background-color: $blue-dark;
      color: $white;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      margin-right: $date-content-gutter;

      .count {
        font-size: 2rem;
        line-height: 2rem;
        display: block;
      }

      .span {
        font-size: 0.75rem;
      }
    }

    .date-content {
      $border-thickness: 4px;

      margin-left: 50px - ($border-thickness/2);
      border-left: $border-thickness solid $blue-dark;
      padding-left: 50px - ($border-thickness/2) + $date-content-gutter;
      padding-bottom: 40px;
    }

    .date-label {
      font-size: 1.5rem;
      color: $blue-dark;
    }
  }
</style>
