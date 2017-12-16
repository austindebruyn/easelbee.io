<template lang="pug">
  .loading-container
    img(
      src='./spinner.svg'
      alt='Loading...'
      :class='size'
    )
</template>

<script>
import VueTypes from 'vue-types';

export default {
  name: 'loading-spinner',
  props: {
    /* eslint-disable vue/require-default-prop */
    size: VueTypes.oneOf(['sm', 'xl']).def('sm')
  }
};
</script>

<style lang="scss" scoped>
  .loading-container {
    text-align: center;
    margin: 0 auto;

    img {
      &.sm {
        width: 60px;
      }
      &.xl {
        width: 200px;
      }
    }
  }
</style>
