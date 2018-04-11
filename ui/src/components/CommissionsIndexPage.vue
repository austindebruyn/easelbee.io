<template lang="pug">
  dashboard-layout(:breadcrumbs='breadcrumbs')
    .container
      .row(v-if='!areCommissionsLoaded')
        .col-12
          loading-spinner(size='xl')
      .row(v-else=true)
        .col-8
          h2 In Progress
          hr
          commissions-list(
            :commissions='commissionsByStatus("inprogress")'
          )
        .col-4
          h2 Incoming
          hr
          commissions-list(
            :commissions='commissionsByStatus("incoming")'
          )
</template>

<script>
import { mapGetters, mapState } from 'vuex';

import LoadingSpinner from 'components/LoadingSpinner';
import CommissionsList from 'components/commissions/CommissionsList';
import DashboardLayout from 'components/dashboard/DashboardLayout';

export default {
  name: 'commissions-index-page',
  components: {
    'dashboard-layout': DashboardLayout,
    'loading-spinner': LoadingSpinner,
    'commissions-list': CommissionsList
  },
  computed: {
    ...mapGetters(['areCommissionsLoaded']),
    ...mapState(['commissions']),
    breadcrumbs: function () {
      return [
        { name: this.$t('commissions.index.title') }
      ];
    }
  },
  mounted: function () {
    this.$store.dispatch('fetchCommissions');
  },
  methods: {
    commissionsByStatus: function (status) {
      return this.commissions.filter(function (commission) {
        return commission.status === status;
      });
    }
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';

  h2 {
    font-size: 1.6rem;
  }
</style>
