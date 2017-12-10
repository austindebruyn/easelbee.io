<template lang="pug">
  .input-group(:class='classes')
    span.input-group-addon(v-if='icon')
      i.fa(:class='iconClass')
    input.form-control(
      v-model='value'
      type='text'
      @focus='handleFocus'
      @blur='handleBlur'
      autocomplete='off'
      :name='name'
      :placeholder='placeholder'
      :disabled='disabled'
    )
</template>

<script>
export default {
  name: 'v-input-text',
  props: {
    name: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    defaultValue: {
      type: String,
      default: void 0
    }
  },
  data: function () {
    return {
      focus: false,
      value: this.defaultValue
    };
  },
  computed: {
    classes () {
      return {
        'input-group-focus': this.focus
      };
    },
    iconClass () {
      return `fa-${this.icon}`;
    }
  },
  methods: {
    handleFocus () {
      this.focus = true;
    },
    handleBlur () {
      this.focus = false;
    }
  }
};
</script>

<style lang="scss">
</style>
