<template lang="pug">
  .c-radio.option
    input.form-check-input(
      type='radio'
      :id='id'
      :name='name'
      :checked='checked'
      @change='handleChange'
    )
    label.form-check-label(
      :for='id'
    ) {{ label }}
</template>

<script>
import VueTypes from 'vue-types';

export default {
  name: 'c-radio-option',
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    id: VueTypes.number.isRequired,
    label: VueTypes.string.isRequired,
    name: VueTypes.string.isRequired,
    value: VueTypes.number.isRequired,
    modelValue: VueTypes.number
  },
  computed: {
    checked: function () {
      return this.value === this.modelValue;
    }
  },
  methods: {
    handleChange: function (e) {
      this.$emit('change', this.value);
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .c-radio-option {
  }
</style>
