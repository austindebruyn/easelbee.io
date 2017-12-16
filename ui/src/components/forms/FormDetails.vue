<template lang="pug">
  .form-details
    h1 {{ form.name }}
</template>

<script>
import { formShape } from 'components/shapes';

export default {
  name: 'form-details',
  props: {
    /* eslint-disable vue/require-default-prop */
    form: formShape.isRequired
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';
</style>
