<template lang="pug">
  .commission-details-status
    .status-actions
      button.btn.btn-lg.btn-block.btn-primary(
        v-if='this.status === "incoming"'
        type='button'
        @click='handlePromote("inprogress")'
      ) Accept
      button.btn.btn-lg.btn-block.btn-primary(
        v-if='this.status === "inprogress"'
        type='button'
        @click='handlePromote("inreview")'
      ) Mark In Review
      button.btn.btn-lg.btn-block.btn-primary(
        v-if='this.status === "inreview"'
        type='button'
        @click='handlePromote("finished")'
      ) Mark Finished
      button.btn.btn-lg.btn-block.btn-secondary(
        v-if='this.status === "canceled"'
        type='button'
        @click='handlePromote("inprogress")'
      ) Un-cancel

      v-link(
        v-if='this.status === "inprogress"'
        @click='handleDemote("incoming")'
      ) Un-accept (move back to incoming)
      v-link(
        v-if='this.status === "inreview"'
        @click='handleDemote("inprogress")'
      ) Move back to In Progress
      v-link(
        v-if='this.status === "finished"'
        @click='handleDemote("inreview")'
      ) Move back to In Review
    .secondary-actions
      v-link(to='', disabled=true) Export to Trello
      v-link(to='', disabled=true) Send an update
      v-link(to='', disabled=true) Send an invoice
      v-link(to='', disabled=true) Some other action
      v-link.danger-link(
        disabled=true
        v-if='this.status !== "canceled"'
        @click='handleCancel'
      ) Cancel
</template>

<script>
import VueTypes from 'vue-types';
import VLink from 'components/controls/VLink';

export default {
  name: 'commissions-details-actions',
  components: {
    'v-link': VLink
  },
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

    a {
      text-decoration: underline;
    }

    .status-actions {
      padding-bottom: 3rem;

      .btn-block {
        margin-bottom: 1rem;
      }
    }

    .secondary-actions {
      a {
        color: $blue-dark;
        text-decoration: underline;
        font-size: 1.2rem;
        display: block;
      }

      .danger-link {
        color: $red;

        &:hover {
          color: $red-dark;
        }
      }
    }
  }
</style>
