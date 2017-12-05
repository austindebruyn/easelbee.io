<template lang="pug">
  app-template
    .settings-page
      .row
        .col-12.col-md-3
          card.card-plain.user-info-card
            .profile-picture-container
              img(src='./profile-pic.png', alt='Default profile picture')
            h2 {{ user.username }}
            p.text-muted {{ relative_user_age }}
        .col-12.col-md-9
          loading(v-if='!loaded')
          card.card-plain(v-else=true)
            h1 Account
            user-form(:user='user', :email_preferences='email_preferences')
</template>

<script>
  import Vue from 'vue';
  import LoadingSpinner from 'components/LoadingSpinner';
  import SettingsPageUserForm from 'components/SettingsPage/SettingsPageUserForm';
  import moment from 'moment';

  export default {
    name: 'settings-page',
    components: {
      'loading-spinner': LoadingSpinner,
      'settings-page-user-form': SettingsPageUserForm
    },
    data() {
      return {username: this.user && this.user.username};
    },
    computed: {
      user: function () {
        return this.$store.state.user;
      },
      email_preferences: function () {
        return this.$store.state.email_preferences;
      },
      loaded: function () {
        return this.email_preferences && this.user;
      },
      relative_user_age: function () {
        return `Signed up ${moment(this.user.createdAt).fromNow()}`;
      }
    },
    mounted: function () {
      if (!this.email_preferences) {
        return this.$store.dispatch('fetch_email_preferences');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .settings-page {
    padding-top: 40px;
  }

  .profile-picture-container {
    img {
      width: 100%;
    }

    padding-bottom: 20px;
  }
</style>
