<template lang="pug">
  .commission-details
    h1 {{ title }}
    p From: {{ commission.email }}
    q {{ commission.body }}
</template>

<script>
export default {
  name: 'commissions-details',
  props: {
    commission: {
      type: Object,
      required: true
    }
  },
  computed: {
    title: function () {
      return this.$t('commissions.details.title', { id: this.commission.id });
    }
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';
</style>
