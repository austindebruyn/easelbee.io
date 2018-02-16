<template lang="pug">
  .app
    router-view(v-if='ready')
    .error-state(v-else-if='errored', size='xl')
      h1 Whoops!
    loading-spinner(v-else=true, size='xl')
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import { STATUS } from 'state/Resource';
import LoadingSpinner from 'components/LoadingSpinner';

export default Vue.component('the-customer-root', {
  components: {
    'loading-spinner': LoadingSpinner
  },
  computed: {
    ...mapState(['i18n']),
    ready: function () {
      return this.i18n.status === STATUS.LOADED;
    },
    errored: function () {
      return this.i18n.status === STATUS.ERRORED;
    }
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
