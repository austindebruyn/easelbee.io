<template lang="pug">
  .commission-timeline
    timeline-item(:date='commission.createdAt')
      span(slot='label') {{ commission.nickname }} filled out your form.
      .card(slot='content')
        .card-body
          timeline-fillout(v-if='isFilloutLoaded', :fillout='fillout')
          loading-spinner(v-else=true)
    .timeline-event-items(v-if='areEventsLoaded')
      timeline-item(
        v-for='event in events'
        key='event.id'
        :date='event.createdAt'
        bubble=false
      )
        span(slot='label') {{ labelFor(event) }}
    loading-spinner(v-else=true)
</template>

<script>
import { commissionShape } from 'components/shapes';
import { isLoaded } from 'state/Resource';
import find from 'lodash.find';
import LoadingSpinner from 'components/LoadingSpinner';
import TimelineFillout from './TimelineFillout';
import TimelineItem from './TimelineItem';

export default {
  name: 'timeline',
  components: {
    'loading-spinner': LoadingSpinner,
    'timeline-fillout': TimelineFillout,
    'timeline-item': TimelineItem
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
    },
    events: function () {
      const resource = this.$store.state.events[this.commission.id];
      return resource && resource.value;
    },
    areEventsLoaded: function () {
      const resource = this.$store.state.events[this.commission.id];
      return resource && isLoaded(resource);
    }
  },
  methods: {
    labelFor: function (event) {
      switch (event.key) {
        case 'status-change':
          return this.$t('events.status-change', {
            old: this.$t(`commissions.statuses.${find(event.metas, { key: 'old' }).value}`),
            new: this.$t(`commissions.statuses.${find(event.metas, { key: 'new' }).value}`)
          });
        default:
          return this.$t('events.unknown');
      }
    }
  },
  mounted: function () {
    this.$store.dispatch('fetchFillout', this.commission.id);
    this.$store.dispatch('fetchEvents', this.commission.id);
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
