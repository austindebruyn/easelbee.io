<template lang="pug">
  .app
    router-view(v-if='isi18nLoaded')
    .error-state(v-else-if='isi18nErrored', size='xl')
      h1 Whoops!
    loading-spinner(v-else=true, size='xl')
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';

import LoadingSpinner from 'components/LoadingSpinner';

export default Vue.component('the-artist-root', {
  components: {
    'loading-spinner': LoadingSpinner
  },
  computed: {
    ...mapGetters([
      'isi18nLoaded',
      'isi18nErrored'
    ])
  }
});
</script>

<style lang="scss">
  @import '~bootstrap/dist/css/bootstrap.css';
  @import '~font-awesome/scss/font-awesome.scss';
  @import 'src/styles/base';

  .app > .loading-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
