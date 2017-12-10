<template lang="pug">
  .container
    .dashboard
      .row
        .col-12
          h1 Index
          p(v-if='user') Hello {{ user.displayName }}
          hr
          commissions-list
          forms-list
</template>

<script>
import LoadingSpinner from 'components/LoadingSpinner';
import CommissionsList from 'components/dashboard/CommissionsList';
import FormsList from 'components/dashboard/FormsList';
import { isLoaded } from 'state/Resource';

export default {
  name: 'home-index-page',
  components: {
    'loading-spinner': LoadingSpinner,
    'commissions-list': CommissionsList,
    'forms-list': FormsList
  },
  computed: {
    user: function () {
      if (!isLoaded(this.$store.state.user)) {
        return null;
      }
      return this.$store.state.user.value;
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
