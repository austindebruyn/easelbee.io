<template lang="pug">
  .c-radio
    span {{ value }}
    .form-group
      .form-check(
        v-for='option in options'
      )
        c-radio-option(
          v-model='value'
          :id='option.id'
          :name='htmlId'
          :label='option.value'
          :value='option.id'
        )
        .option-attachment(
          v-if='option.optionAttachment'
        )
          img(:src='getAttachmentUrl(option.optionAttachment)', :alt='option.value')
</template>

<script>
import VueTypes from 'vue-types';
import CRadioOption from './CRadioOption';

export default {
  name: 'c-radio',
  components: {
    CRadioOption
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    id: VueTypes.number.isRequired,
    required: VueTypes.bool
  },
  data: function () {
    return { value: null };
  },
  computed: {
    htmlId: function () {
      return `input-${this.id}`;
    },
    options: function () {
      return this.$store.getters.getOptionsByQuestionId(this.id);
    }
  },
  methods: {
    getAttachmentUrl: function (optionAttachmentId) {
      return this.$store.state.optionAttachments[optionAttachmentId].url;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .c-radio {
    .option-attachment {
      img {
        width: 25%;
      }
    }
  }
</style>
