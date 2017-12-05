<template lang="pug">
  .input-group(:class='classes')
    span.input-group-addon(v-if='icon')
      i.fa(:class='iconClass')
    input.form-control(
      :type='type || "text"'
      @focus='handleFocus'
      @blur='handleBlur'
      autocomplete='off'
      :name='name'
      :placeholder='placeholder'
      :disabled='disabled'
      :value='value'
    )
</template>

<script>
  export default {
    name: 'v-input-text',
    props: {
      name: String,
      placeholder: String,
      disabled: Boolean,
      type: String,
      icon: String,
      value: String
    },
    data: function () {
      return {
        focus: false
      };
    },
    computed: {
      classes() {
        return {
          'input-group-focus': this.focus
        };
      },
      iconClass() {
        return `fa-${this.icon}`;
      }
    },
    methods: {
      handleFocus() {
        this.focus = true;
      },
      handleBlur() {
        this.focus = false;
      }
    }
  };
</script>

<style lang="scss">
</style>
