<template lang="pug">
  .c-text
    .form-group
      label(v-if='label', :for='htmlId') {{ label }}
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
    id: VueTypes.oneOfType([VueTypes.number, VueTypes.string]).isRequired,
    required: VueTypes.bool,
    label: VueTypes.string
  },
  computed: {
    htmlId: function () {
      return `input-${this.id}`;
    },
    value: function () {
      return this.$refs.input.value;
    }
  },
  methods: {
    setValue: function (value) {
      this.$refs.input.setValue(value);
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
