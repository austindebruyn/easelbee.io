<template lang="pug">
  .commission-details-status
    strong {{ $t('commissions.details.status') }}:&nbsp;
    span {{ statusLabel }}
    .mb-2
      small.text-muted {{ statusLabelDescription }}
    .well
      button.btn.btn-sm.btn-primary(
        v-if='this.status === "incoming"'
        type='button'
        @click='handlePromote("inprogress")'
      ) Accept
      button.btn.btn-sm.btn-primary(
        v-if='this.status === "inprogress"'
        type='button'
        @click='handlePromote("inreview")'
      ) Mark In Review
      button.btn.btn-sm.btn-primary(
        v-if='this.status === "inreview"'
        type='button'
        @click='handlePromote("finished")'
      ) Mark Finished
      button.btn.btn-sm.btn-link(
        v-if='this.status !== "canceled" && this.status !== "finished"'
        type='button'
        @click='handleCancel'
      ) Cancel
      hr
      button.btn.btn-link(
        v-if='this.status === "inprogress"'
        type='button'
        @click='handleDemote("incoming")'
      ) Un-accept (move back to incoming)
      button.btn.btn-link(
        v-if='this.status === "inreview"'
        type='button'
        @click='handleDemote("inprogress")'
      ) Move back to In Progress
      button.btn.btn-link(
        v-if='this.status === "finished"'
        type='button'
        @click='handleDemote("inreview")'
      ) Move back to In Review
      button.btn.btn-link(
        v-if='this.status === "canceled"'
        type='button'
        @click='handlePromote("inprogress")'
      ) Un-cancel this commission and move back to In Progress
</template>

<script>
import VueTypes from 'vue-types';

export default {
  name: 'commissions-details-status',
  props: {
    /* eslint-disable vue/require-default-prop */
    status: VueTypes.string.isRequired,
    commissionId: VueTypes.number.isRequired
  },
  computed: {
    statusLabel: function () {
      const prefix = 'commissions.details.statuses';
      return this.$t(`${prefix}.${this.status}`);
    },
    statusLabelDescription: function () {
      const prefix = 'commissions.details.statuses';
      return this.$t(`${prefix}.${this.status}-description`);
    }
  },
  methods: {
    handlePromote: function (status) {
      this.$store.dispatch('updateCommission', {
        id: this.commissionId,
        status
      });
    },
    handleDemote: function (status) {
      this.$store.dispatch('updateCommission', {
        id: this.commissionId,
        status
      });
    },
    handleCancel: function () {
      this.$store.dispatch('updateCommission', {
        id: this.commissionId,
        status: 'canceled'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .commission-details-status {
    button {
      cursor: pointer;
    }
  }
</style>
