<template lang="pug">
  dashboard-layout(:breadcrumbs='breadcrumbs')
    .container
      .row
        .col-12
          loading-spinner(v-if='!areCommissionsLoaded', size='xl')
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
import _find from 'lodash.find';
import { mapGetters } from 'vuex';

import LoadingSpinner from 'components/LoadingSpinner';
import CommissionDetails from 'components/commissions/CommissionDetails';
import DashboardLayout from 'components/dashboard/DashboardLayout';

export default {
  name: 'commissions-details-page',
  components: {
    'dashboard-layout': DashboardLayout,
    'loading-spinner': LoadingSpinner,
    'commissions-details': CommissionDetails
  },
  computed: {
    ...mapGetters(['areCommissionsLoaded']),
    id: function () {
      return parseInt(this.$route.params.id);
    },
    commission: function () {
      if (!this.areCommissionsLoaded) return null;

      return _find(this.$store.state.commissions, {
        id: this.id
      });
    },
    breadcrumbs: function () {
      return [
        { name: this.$t('commissions.index.title'), to: '/commissions' },
        { name: this.$t('commissions.details.title', { id: this.id }) }
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
