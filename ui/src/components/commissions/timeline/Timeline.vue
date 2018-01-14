<template lang="pug">
  .commission-timeline
    .line
    timeline-item(:date='commission.createdAt', bubble=true)
      span(slot='label') {{ commission.nickname }} filled out your form.
      .card(slot='content')
        .card-body
          timeline-fillout(v-if='isFilloutLoaded', :fillout='fillout')
          loading-spinner(v-else=true)
    .timeline-event-items(v-if='areEventsLoaded')
      timeline-item(
        v-for='desc in eventDescriptors'
        key='desc.event.id'
        :date='desc.event.createdAt'
        :bubble='desc.bubble'
      )
        span(slot='label') {{ labelFor(desc.event) }}
    loading-spinner(v-else=true)
</template>

<script>
import { commissionShape } from 'components/shapes';
import { isLoaded } from 'state/Resource';
import find from 'lodash.find';
import sortBy from 'lodash.sortby';
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
    },
    eventDescriptors: function () {
      const sortedEvents = sortBy(this.events, e => new Date(e.createdAt));
      let lastSeenDate;

      return sortedEvents.map(function (event) {
        const desc = {
          event,
          bubble: !lastSeenDate || (+new Date(event.createdAt) - lastSeenDate >= 1000 * 60 * 15)
        };
        lastSeenDate = +new Date(event.createdAt);
        return desc;
      });
    }
  },
  mounted: function () {
    this.$store.dispatch('fetchFillout', this.commission.id);
    this.$store.dispatch('fetchEvents', this.commission.id);
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
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .commission-timeline {
    position: relative;

    & > .timeline-item,
    & > .timeline-event-items {
      position: relative;
    }

    .line {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 48px;
      width: 4px;
      background-color: $blue-dark;
    }

    .fillout-card {
      padding: 4rem;
    }
  }
</style>
