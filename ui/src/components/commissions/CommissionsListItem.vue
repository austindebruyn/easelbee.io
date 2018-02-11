<template lang="pug">
  li
    router-link(:to='url').card.commission-card
      .card-img-top(v-if='shouldShowImage')
      .card-body
        .card-text
          section.id
            .nickname {{ commission.nickname }}
            .email {{ commission.email }}
          section.answer-preview
            span {{ answerPreview }}
</template>

<script>
import { commissionShape } from 'components/shapes';

export default {
  name: 'commissions-list-item',
  props: {
    /* eslint-disable vue/require-default-prop */
    commission: commissionShape.isRequired
  },
  computed: {
    url: function () {
      return `/commissions/${this.commission.id}`;
    },
    shouldShowImage: function () {
      return this.commission.status !== 'incoming';
    },
    answerPreview: function () {
      return '...';
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .commission-card {
    border: 0;
    margin: 20px;
    width: 250px;
    color: black;
    text-decoration: inherit;

    section.id {
      padding-bottom: 2rem;
    }

    section.answer-preview {
      span {
        color: $gray;
      }
    }

    .nickname {
      font-weight: bold;
      font-family: tensoregular, serif;
      font-size: 1.4rem;
      line-height: 1.6rem;
    }

    .email {
      color: $purple;
      font-family: tensoregular, serif;
      font-size: 1.2rem;
      line-height: 1.4rem;
    }

    &:hover {
      border: 2px solid $blue-dark;
    }

    .card-img-top {
      height: 200px;
      background-color: #ade;
    }
  }
</style>
