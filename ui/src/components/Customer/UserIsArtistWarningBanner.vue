<template lang="pug">
  .alert.alert-warning
    strong {{ $t('customer.user-is-artist.hey') }}
    |
    | {{ $t('customer.user-is-artist.message') }}
</template>

<script>
export default {
  name: 'user-is-artist-warning-banner'
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';
</style>
