<template lang="pug">
  .customer-form-page
    .container
      .row
        .col-12.col-sm-10.offset-sm-1
          div(v-if='isFormLoaded')
            artist-info(:name='artist.displayName')
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
import ArtistInfo from 'components/Customer/widgets/ArtistInfo';
import CustomerFormContainer from 'components/Customer/CustomerFormContainer';
import UserIsArtistWarningBanner from 'components/Customer/UserIsArtistWarningBanner';

/**
 * CustomerFormPage is the entry point for the route. Hides the fetch action
 * and the loading state.
 */
export default {
  name: 'customer-form-page',
  components: {
    'artist-info': ArtistInfo,
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

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .customer-form-page {
    padding-top: 40px;
  }
</style>
