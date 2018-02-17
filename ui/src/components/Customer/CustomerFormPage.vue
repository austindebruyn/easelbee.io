<template lang="pug">
  .customer-form-page
    .container
      .row
        .col-12.col-sm-10.offset-sm-1.col-lg-8.offset-lg-2.col-xl-6.offset-xl-3
          div(v-if='loaded')
            h1 {{ form.value.name }}
            //- h2 Artist's Name
            customer-form-question-card(:form='form.value')
          loading-spinner(v-else=true)
</template>

<script>
import LoadingSpinner from 'components/LoadingSpinner';
import CustomerFormQuestionCard from 'components/Customer/CustomerFormQuestionCard';
import { isLoaded } from 'state/Resource';
import { mapState } from 'vuex';

export default {
  name: 'customer-form-page',
  components: {
    'loading-spinner': LoadingSpinner,
    'customer-form-question-card': CustomerFormQuestionCard
  },
  computed: {
    ...mapState(['form']),
    formSlug: function () {
      return this.$route.params.slug;
    },
    loaded: function () {
      return isLoaded(this.form);
    }
  },
  mounted: function () {
    this.$store.dispatch('fetchForm', this.formSlug);
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .customer-form-page {
    padding-top: 40px;

    h1 {
      font-family: 'tensoregular';
      font-weight: normal;
      color: $blue-dark;
      padding-bottom: 40px;
    }
  }
</style>
