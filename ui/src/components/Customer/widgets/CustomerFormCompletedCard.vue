<template lang="pug">
  .customer-form-completed-card
    h2 {{ $t('customer.completed') }}
    p {{ $t('customer.completed-message', { name: name }) }}
    p {{ $t('customer.completed-message-2') }}
</template>

<script>
import VueTypes from 'vue-types';

export default {
  name: 'customer-form-completed-card',
  props: {
    /* eslint-disable vue/require-default-prop */
    name: VueTypes.string.isRequired
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';

  h2 {
    color: $black;
    padding-bottom: 2rem;
  }
</style>
