<template lang="pug">
  dashboard-layout(:breadcrumbs='breadcrums')
    .container
      .row
        .col-12
          h1 Forms
          forms-list
</template>

<script>
import LoadingSpinner from 'components/LoadingSpinner';
import FormsList from 'components/dashboard/FormsList';
import DashboardLayout from 'components/dashboard/DashboardLayout';

export default {
  name: 'forms-index-page',
  components: {
    'dashboard-layout': DashboardLayout,
    'loading-spinner': LoadingSpinner,
    'forms-list': FormsList
  },
  computed: {
    breadcrumbs: function () {
      return [
        { name: this.$t('forms.index.title') }
      ];
    }
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';
</style>
