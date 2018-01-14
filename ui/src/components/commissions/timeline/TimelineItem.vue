<template lang="pug">
  .timeline-item
    .date-row
      .date-bubble(v-if='bubble')
        .count {{ relativeDate.count }}
        .span {{ relativeDate.units }}
      .date-small-bubble(v-else=true)
      .date-label
        slot(name='label')
    .date-content
      slot(name='content')
</template>

<script>
export default {
  name: 'timeline-item',
  components: {
  },
  props: {
    date: {
      type: String,
      required: true
    },
    bubble: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    relativeDate: function () {
      const now = new Date();
      const then = new Date(this.date);

      const differenceMs = now - then;

      if (differenceMs < 60 * 1000) {
        return {
          count: Math.floor(differenceMs / 1000),
          units: 'sec ago'
        };
      } else if (differenceMs < 60 * 60 * 1000) {
        return {
          count: Math.floor(differenceMs / (1000 * 60)),
          units: 'min ago'
        };
      } else if (differenceMs < 60 * 60 * 1000 * 24) {
        return {
          count: Math.floor(differenceMs / (1000 * 60 * 60)),
          units: 'hrs ago'
        };
      } else if (differenceMs < 60 * 60 * 1000 * 24 * 7) {
        return {
          count: Math.floor(differenceMs / (1000 * 60 * 60 * 24)),
          units: 'days ago'
        };
      } else if (differenceMs < 60 * 60 * 1000 * 24 * 30) {
        return {
          count: Math.floor(differenceMs / (1000 * 60 * 60 * 24 * 7)),
          units: 'weeks ago'
        };
      } else {
        return {
          count: Math.floor(differenceMs / (1000 * 60 * 60 * 24 * 30)),
          units: 'months ago'
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .timeline-item {
    .date-row {
      display: flex;
      align-items: center;
    }

    $date-content-gutter: 18px;

    .date-small-bubble {
      background-color: $blue-dark;
      color: $white;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      margin-left: 40px;
      margin-right: 40px + $date-content-gutter;
    }

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
      padding-left: 100px + $date-content-gutter;
      padding-bottom: 20px;
    }

    .date-label {
      font-size: 1.5rem;
      color: $blue-dark;
    }
  }
</style>
