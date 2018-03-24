<template lang="pug">
  .c-text
    .form-group
      label(:for='htmlId') fill me out
      span.required.ml-1 *
      v-input-text(:id='htmlId', ref='input')
</template>

<script>
import VueTypes from 'vue-types';
import VInputText from 'components/controls/VInputText';

export default {
  name: 'c-text',
  components: {
    'v-input-text': VInputText
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    id: VueTypes.number.isRequired,
    required: VueTypes.bool
  },
  computed: {
    htmlId: function () {
      return `input-${this.id}`;
    },
    value: function () {
      return this.$refs.input.value;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .c-text {
    label {
      color: $gray;
      text-transform: uppercase;
      font-family: sinkinsans;
      font-size: 0.6rem;
    }

    .required {
      color: $red-light;
      text-transform: uppercase;
      font-family: sinkinsans;
      font-size: 0.6rem;
    }
  }
</style>
