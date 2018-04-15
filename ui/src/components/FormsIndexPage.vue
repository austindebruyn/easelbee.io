<template lang="pug">
  dashboard-layout(:breadcrumbs='breadcrumbs')
    .container
      .row
        .col-12.col-md-8
          loading-spinner(v-if='!areFormsLoaded', size='xl')
          forms-list(v-else=true, :forms='forms')
        .col-12.col-md-4
          .card
            .card-body
              h5.card-title {{ $t('forms.index.help-card.title') }}
              p.card-text {{ $t('forms.index.help-card.text-1') }}
              p.card-text {{ $t('forms.index.help-card.text-2') }}
</template>

<script>
import DashboardLayout from 'components/dashboard/DashboardLayout';
import LoadingSpinner from 'components/LoadingSpinner';
import FormsList from 'components/forms/FormsList';
import { mapGetters } from 'vuex';

export default {
  name: 'forms-index-page',
  components: {
    'dashboard-layout': DashboardLayout,
    'loading-spinner': LoadingSpinner,
    'forms-list': FormsList
  },
  computed: {
    ...mapGetters(['areFormsLoaded']),
    forms: function () {
      return Object.values(this.$store.state.forms);
    },
    breadcrumbs: function () {
      return [
        { name: this.$t('forms.index.title') }
      ];
    }
  },
  mounted: function () {
    this.$store.dispatch('fetchForms');
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';
</style>
