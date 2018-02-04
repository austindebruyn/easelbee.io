<template lang="pug">
  select.form-control(
    :name='name'
    :disabled='disabled'
    @change='handleChange'
  )
    option(
      v-for='opt in options'
      :key='opt.value'
      :value='opt.value'
      :selected='value === opt.value ? "selected" : ""'
    ) {{ opt.label }}
</template>

<script>
import VueTypes from 'vue-types';

export default {
  name: 'v-dropdown',
  props: {
    name: {
      type: String,
      default: void 0
    },
    options: VueTypes.arrayOf(
      VueTypes.shape({
        label: VueTypes.string.isRequired,
        value: VueTypes.string.isRequired
      })
    ).isRequired,
    disabled: {
      type: Boolean,
      default: null
    },
    defaultValue: {
      type: String,
      default: void 0
    }
  },
  data: function () {
    return {
      value: this.defaultValue || this.options[0].value
    };
  },
  methods: {
    handleChange: function (e) {
      this.value = e.target.value;
      this.$emit('change');
    },
    getValue: function () {
      return this.value;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  select.form-control {
    border-radius: 0;

    &:hover {
      cursor: pointer;
    }

    &:focus {
      box-shadow: none;
      border: 1px solid black;
    }
  }
</style>
