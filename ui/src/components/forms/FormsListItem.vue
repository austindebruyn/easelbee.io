<template lang="pug">
  li
    strong {{ form.name }}:
    |
    a(:href='form.publicUrl') {{ form.publicUrl }}
    router-link(:to='editUrl') Edit
</template>

<script>
import { formShape } from 'components/shapes';

export default {
  name: 'forms-list-item',
  props: {
    /* eslint-disable vue/require-default-prop */
    form: formShape.isRequired
  },
  computed: {
    editUrl: function () {
      return `/forms/${this.form.id}`;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';
</style>
