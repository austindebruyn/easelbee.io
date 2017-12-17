<template lang="pug">
  .commission-details
    h1 {{ title }}
    p From: {{ commission.email }}
    q {{ commission.body }}
    hr
    section
      commission-details-status(
        :commissionId='this.commission.id'
        :status='this.commission.status'
      )
</template>

<script>
import { commissionShape } from 'components/shapes';
import CommissionDetailsStatus from 'components/commissions/CommissionDetailsStatus';

export default {
  name: 'commissions-details',
  components: {
    'commission-details-status': CommissionDetailsStatus
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
  }
</style>
