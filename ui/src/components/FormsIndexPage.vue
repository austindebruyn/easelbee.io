<template lang="pug">
  dashboard-layout(:breadcrumbs='breadcrumbs')
    .container
      .row
        .col-12.col-md-8
          loading-spinner(v-if='loading', size='xl')
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
import { isLoaded } from 'state/Resource';

export default {
  name: 'forms-index-page',
  components: {
    'dashboard-layout': DashboardLayout,
    'loading-spinner': LoadingSpinner,
    'forms-list': FormsList
  },
  computed: {
    loading: function () {
      return !isLoaded(this.$store.state.forms);
    },
    forms: function () {
      return this.$store.state.forms.value;
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
