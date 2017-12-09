<template lang="pug">
  .loading-container
    img(
      src='./spinner.svg'
      alt='Loading...'
      :class='size'
    )
</template>

<script>
import oneOf from 'lib/oneOf';

export default {
  name: 'loading-spinner',
  props: {
    size: {
      type: String,
      validator: oneOf(['sm', 'xl']),
      default: 'sm'
    }
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
