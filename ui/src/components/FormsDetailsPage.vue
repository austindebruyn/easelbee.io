<template lang="pug">
  dashboard-layout(:breadcrumbs='breadcrumbs')
    .container
      .row
        .col-12
          loading-spinner(v-if='!areFormsLoaded', size='xl')
          form-details(v-else-if='form', :form='form')
          .not-found(v-else=true)
            .col-12.col-lg-6.offset-lg-3
              .card.text-center
                .card-body
                  .card-title
                    h1 Not Found
                  .card-text
                    p Try again.
                  router-link(to='/forms') Go back to your forms
</template>

<script>
import LoadingSpinner from 'components/LoadingSpinner';
import FormDetails from 'components/forms/FormDetails';
import DashboardLayout from 'components/dashboard/DashboardLayout';
import find from 'lodash.find';
import { mapGetters } from 'vuex';

export default {
  name: 'forms-details-page',
  components: {
    'dashboard-layout': DashboardLayout,
    'loading-spinner': LoadingSpinner,
    'form-details': FormDetails
  },
  computed: {
    ...mapGetters(['areFormsLoaded']),
    id: function () {
      return parseInt(this.$route.params.id);
    },
    form: function () {
      if (!this.areFormsLoaded) return null;

      return find(this.$store.state.forms, {
        id: this.id
      });
    },
    breadcrumbs: function () {
      const crumbs = [
        { name: this.$t('forms.index.title'), to: '/forms' }
      ];
      if (this.form) {
        crumbs.push({ name: this.form.name });
      }
      return crumbs;
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
