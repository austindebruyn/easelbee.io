<template lang="pug">
  dashboard-layout
    .container
      .row
        .col-12
          loading-spinner(v-if='loading', size='xl')
          commissions-details(v-else-if='commission', :commission='commission')
          .not-found(v-else=true)
            .col-12.col-lg-6.offset-lg-3
              .card.text-center
                .card-body
                  .card-title
                    h1 Not Found
                  .card-text
                    p Try again.
                  router-link(to='/commissions') Go back to your commissions
</template>

<script>
import LoadingSpinner from 'components/LoadingSpinner';
import CommissionDetails from 'components/commissions/CommissionDetails';
import DashboardLayout from 'components/dashboard/DashboardLayout';
import { isLoaded } from 'state/Resource';
import find from 'lodash.find';

export default {
  name: 'commissions-details-page',
  components: {
    'dashboard-layout': DashboardLayout,
    'loading-spinner': LoadingSpinner,
    'commissions-details': CommissionDetails
  },
  computed: {
    loading: function () {
      return !isLoaded(this.$store.state.commissions);
    },
    commission: function () {
      const id = parseInt(this.$route.params.id);

      if (this.loading) return null;

      return find(this.$store.state.commissions.value, { id });
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
