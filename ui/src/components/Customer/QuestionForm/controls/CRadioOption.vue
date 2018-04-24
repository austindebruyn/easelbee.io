<template lang="pug">
  .c-radio-option
    label.form-check-label(
      :for='id'
      :class='classes'
    )
      input.form-check-input(
        type='radio'
        :id='id'
        :name='name'
        :checked='checked'
        hidden=true
        @change='handleChange'
      )
      .dot
        .dot-fill(v-if='checked')
      .label-text {{ label }}
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
    },
    classes: function () {
      return { checked: this.checked };
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
    .form-check-label {
      padding: 0;

      display: flex;
      align-items: center;

      &.checked {
        .label-text {
          font-weight: bold;
        }
      }
    }

    $dot-size: 36px;
    $padding-size: 6px;
    $border-width: 1px;

    .dot {
      width: $dot-size + ($border-width * 2);
      height: $dot-size + ($border-width * 2);
      border: $border-width solid $gray-light;
      border-radius: 50%;
    }

    .dot-fill {
      width: $dot-size - ($padding-size * 2);
      height: $dot-size - ($padding-size * 2);
      margin: $padding-size;
      background-color: $blue-dark;
      border-radius: 50%;
    }

    .label-text {
      font-size: 18px;
      font-family: tensoregular;
      padding-left: 20px;
    }
  }
</style>
