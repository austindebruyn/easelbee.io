<template lang="pug">
  .container
    .dashboard
      .row
        .col-12
          h1 Index
          p(v-if='user') Hello {{ user.username }}
          p This is where your commissions will go. :)
</template>

<script>
import LoadingSpinner from 'components/LoadingSpinner';

export default {
  name: 'home-index-page',
  components: {
    'loading-spinner': LoadingSpinner
  },
  computed: {
    user: function () {
      return this.$store.state.user;
    }
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .dashboard {
    padding-top: 40px;
  }
</style>
