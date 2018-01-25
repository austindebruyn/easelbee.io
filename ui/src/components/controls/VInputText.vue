<template lang="pug">
  .input-group(:class='classes')
    span.input-group-addon(v-if='icon')
      i.fa(:class='iconClass')
    input.form-control(
      v-model='value'
      type='text'
      autocomplete='off'
      :name='name'
      :placeholder='placeholder'
      :disabled='disabled'
      :class='inputClasses'
      @focus='handleFocus'
      @blur='handleBlur'
      @keyup='handleKeyup'
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
    },
    kind: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: 'md'
    }
  },
  data: function () {
    return {
      focus: false,
      value: this.defaultValue
    };
  },
  computed: {
    classes: function () {
      return {
        'input-group-focus': this.focus,
        'kind-madlibs': this.kind && this.kind === 'madlibs'
      };
    },
    inputClasses: function () {
      return {
        'input-lg': this.size === 'lg'
      };
    },
    iconClass: function () {
      return `fa-${this.icon}`;
    }
  },
  methods: {
    handleFocus: function () {
      this.focus = true;
    },
    handleBlur: function () {
      this.focus = false;
    },
    handleKeyup: function () {
      this.$emit('keyup');
    },
    getValue: function () {
      return this.value;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .kind-madlibs {
    input {
      border: none;
      background: none;
      border-bottom: 2px dashed $gray;

      &:focus {
        // border: none;
        box-shadow: none;
      }
    }
  }

  .input-lg {
    font-size: 1.4rem;
  }
</style>
