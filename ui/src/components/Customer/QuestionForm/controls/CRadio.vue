<template lang="pug">
  .c-radio
    .form-group
      label(:for='htmlId') fill me out
      span.required.ml-1 *
      .form-check(
        v-for='option in options'
      )
        input.form-check-input(
          v-model='selected'
          :id='option.id',
          :name='htmlId',
          type='radio',
          :value='option.id'
        )
        label.form-check-label(
          :for='option.id'
        ) {{ option.value }}
</template>

<script>
import VueTypes from 'vue-types';
import { optionShape } from 'components/shapes';

export default {
  name: 'c-radio',
  props: {
    /* eslint-disable vue/require-default-prop */
    id: VueTypes.number.isRequired,
    required: VueTypes.bool,
    options: VueTypes.arrayOf(optionShape).isRequired
  },
  data: function () {
    return { selected: null };
  },
  computed: {
    htmlId: function () {
      return `input-${this.id}`;
    },
    value: function () {
      return this.selected;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .c-radio {
  }
</style>
