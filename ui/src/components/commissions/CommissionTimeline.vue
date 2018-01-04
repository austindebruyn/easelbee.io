<template lang="pug">
  .commission-timeline
    .card.fillout-card
      .card-content
        .fillout-content(v-if='isLoaded')
          div(v-for='pair in this.fillout.pairs')
            div
              strong {{ pair.question.title }}
            div
              span {{ pair.value }}
            hr
        loading-spinner(v-else=true)
</template>

<script>
import { commissionShape } from 'components/shapes';
import { isLoaded } from 'state/Resource';
import LoadingSpinner from 'components/LoadingSpinner';

export default {
  name: 'commission-timeline',
  components: {
    'loading-spinner': LoadingSpinner
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
    isLoaded: function () {
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
  }
</style>
