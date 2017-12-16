<template lang="pug">
  .commission-details
    h1 {{ title }}
    p From: {{ commission.email }}
    q {{ commission.body }}
    hr
    section
      strong {{ $t('commissions.details.status') }}:&nbsp;
      span {{ statusLabel }}
      div
        small.text-muted {{ statusLabelDescription }}
</template>

<script>
import { commissionShape } from 'components/shapes';

export default {
  name: 'commissions-details',
  props: {
    /* eslint-disable vue/require-default-prop */
    commission: commissionShape.isRequired
  },
  computed: {
    title: function () {
      return this.$t('commissions.details.title', { id: this.commission.id });
    },
    statusLabel: function () {
      const prefix = 'commissions.details.statuses';
      return this.$t(`${prefix}.${this.commission.status}`);
    },
    statusLabelDescription: function () {
      const prefix = 'commissions.details.statuses';
      return this.$t(`${prefix}.${this.commission.status}-description`);
    }
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';
</style>
