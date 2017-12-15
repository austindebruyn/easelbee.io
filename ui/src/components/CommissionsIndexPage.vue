<template lang="pug">
  dashboard-layout(:breadcrumbs='breadcrumbs')
    .container
      .row
        .col-12
          h2 In progress
          loading-spinner(v-if='loading', size='xl')
          commissions-list(v-else=true, :commissions='commissions')
</template>

<script>
import LoadingSpinner from 'components/LoadingSpinner';
import CommissionsList from 'components/commissions/CommissionsList';
import DashboardLayout from 'components/dashboard/DashboardLayout';
import { isLoaded } from 'state/Resource';

export default {
  name: 'commissions-index-page',
  components: {
    'dashboard-layout': DashboardLayout,
    'loading-spinner': LoadingSpinner,
    'commissions-list': CommissionsList
  },
  computed: {
    loading: function () {
      return !isLoaded(this.$store.state.commissions);
    },
    commissions: function () {
      return this.$store.state.commissions.value;
    },
    breadcrumbs: function () {
      return [
        { name: this.$t('commissions.index.title') }
      ];
    }
  },
  mounted: function () {
    this.$store.dispatch('fetchCommissions');
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';
</style>
