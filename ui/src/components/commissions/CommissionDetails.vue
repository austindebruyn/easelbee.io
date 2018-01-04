<template lang="pug">
  .commission-details
    .row
      .col-12.col-md-5.col-xl-3.order-md-2
        .card.mb-4
          .card-img-top
          .card-body
            .nickname {{ commission.nickname }}
            .email {{ commission.email }}
        commission-details-actions(
          :commissionId='this.commission.id'
          :status='this.commission.status'
        )
      .col-12.col-md-7.col-xl-9
        commission-timeline(:commission='commission')
</template>

<script>
import { commissionShape } from 'components/shapes';
import CommissionDetailsActions from './CommissionDetailsActions';
import CommissionTimeline from './CommissionTimeline';
import LoadingSpinner from 'components/LoadingSpinner';

export default {
  name: 'commissions-details',
  components: {
    'commission-details-actions': CommissionDetailsActions,
    'commission-timeline': CommissionTimeline,
    'loading-spinner': LoadingSpinner
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    commission: commissionShape.isRequired
  },
  computed: {
    title: function () {
      return this.$t('commissions.details.title', { id: this.commission.id });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .commission-details {
    .card {
      font-size: 1.4rem;
      border: none;
      border-radius: 0;

      .nickname {
        color: $black;
        font-weight: bold;
      }

      .email {
        color: $purple;
      }

      .card-img-top {
        height: 240px;
        background-color: $gray-light;
        border-radius: 0;
      }
    }
  }
</style>
