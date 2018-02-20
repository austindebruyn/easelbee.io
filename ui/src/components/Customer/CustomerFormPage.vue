<template lang="pug">
  .customer-form-page
    .container
      .row
        .col-12.col-sm-10.offset-sm-1.col-lg-8.offset-lg-2.col-xl-6.offset-xl-3
          div(v-if='loaded')
            .title
              h1 {{ artist.displayName }}
              h2 {{ form.value.name }}
            user-is-artist-warning-banner(v-if='isUserArtist')
            customer-form-completed-card(
              v-if='isCompleted'
              :name='artist.displayName'
            )
            customer-form-question-card(
              v-else=true
              :form='form.value'
              @complete='handleComplete'
            )
          loading-spinner(v-else=true)
</template>

<script>
import LoadingSpinner from 'components/LoadingSpinner';
import CustomerFormCompletedCard from 'components/Customer/CustomerFormCompletedCard';
import CustomerFormQuestionCard from 'components/Customer/CustomerFormQuestionCard';
import UserIsArtistWarningBanner from 'components/Customer/UserIsArtistWarningBanner';
import { isLoaded } from 'state/Resource';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'customer-form-page',
  components: {
    'loading-spinner': LoadingSpinner,
    'customer-form-completed-card': CustomerFormCompletedCard,
    'customer-form-question-card': CustomerFormQuestionCard,
    'user-is-artist-warning-banner': UserIsArtistWarningBanner
  },
  computed: {
    ...mapState(['form', 'artist']),
    ...mapGetters(['isCompleted', 'isUserArtist']),
    formSlug: function () {
      return this.$route.params.slug;
    },
    loaded: function () {
      return isLoaded(this.form);
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

  .customer-form-page {
    padding-top: 40px;

    .title {
      padding-bottom: 40px;
      h1 {
        font-family: 'tensoregular';
        font-weight: normal;
        color: $blue-dark;
      }
      h2 {
        font-family: 'sinkinsans';
        font-weight: normal;
        color: $gray;
      }
    }
  }
</style>
