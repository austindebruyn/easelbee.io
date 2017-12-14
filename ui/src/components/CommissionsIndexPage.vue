<template lang="pug">
  dashboard-layout
    .container
      .row
        .col-12
          h1 Index
          p(v-if='user') Hello {{ user.displayName }}
          hr
          commissions-list
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
    user: function () {
      if (!isLoaded(this.$store.state.user)) {
        return null;
      }
      return this.$store.state.user.value;
    }
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';
</style>
