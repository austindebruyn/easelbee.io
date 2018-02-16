<template lang="pug">
  .customer-form-page
    h1 Customer Form
    p {{ formSlug }}
    div(v-if='loaded')
    loading-spinner(v-else=true)
</template>

<script>
import LoadingSpinner from 'components/LoadingSpinner';
import { isLoaded } from 'state/Resource';

export default {
  name: 'customer-form-page',
  components: {
    'loading-spinner': LoadingSpinner
  },
  computed: {
    formSlug: function () {
      return this.$route.params.slug;
    },
    loaded: function () {
      return isLoaded(this.$store.state.form);
    }
  },
  mounted: function () {
    this.$store.dispatch('fetchForm', this.formSlug);
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';
</style>
