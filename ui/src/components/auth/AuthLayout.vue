<template lang="pug">
  .container
    .row
      .col-12.col-lg-6.offset-lg-3
        slot
</template>

<script>
  import Vue from 'vue';

  export default {
    name: 'auth-layout'
  };
</script>

<style lang="scss">
</style>
