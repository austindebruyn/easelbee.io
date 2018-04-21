<template lang="pug">
  .customer-form-page
    .polygon
    .container
      .row
        .col-12.col-sm-10.offset-sm-1
          div(v-if='isFormLoaded')
            user-is-artist-warning-banner(v-if='isUserArtist')
            customer-form-container(
              :form='form'
              :artist='artist'
              @complete='handleComplete'
            )
          loading-spinner(v-else=true)
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import LoadingSpinner from 'components/LoadingSpinner';
import CustomerFormContainer from 'components/Customer/CustomerFormContainer';
import UserIsArtistWarningBanner from 'components/Customer/UserIsArtistWarningBanner';

/**
 * CustomerFormPage is the entry point for the route. Hides the fetch action
 * and the loading state.
 */
export default {
  name: 'customer-form-page',
  components: {
    'loading-spinner': LoadingSpinner,
    'customer-form-container': CustomerFormContainer,
    'user-is-artist-warning-banner': UserIsArtistWarningBanner
  },
  computed: {
    ...mapState(['form', 'artist']),
    ...mapGetters(['isFormLoaded', 'isUserArtist']),
    formSlug: function () {
      return this.$route.params.slug;
    }
  },
  mounted: function () {
    this.$store.dispatch('fetchForm', this.formSlug);
  },
  methods: {
    handleComplete: function (values) {
      this.$store.dispatch('submitForm', {
        ...values,
        nickname: 'Anonymous',
        email: 'anonymous@guy.com'
      });
    }
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';

  body {
    background-color: white;
  }

  .customer-form-page {
    padding-top: 40px;
  }

  .polygon {
    position: fixed;
    width: 0;
    height: 0;
    border-bottom: 300px solid $blue;
    border-right: 600px solid transparent;
    bottom: 0;
  }
</style>
