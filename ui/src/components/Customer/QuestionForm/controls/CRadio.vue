<template lang="pug">
  .c-radio
    .form-group
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
        .option-attachment(
          v-if='option.optionAttachment'
        )
          img(:src='getAttachmentUrl(option.optionAttachment)', :alt='option.value')
</template>

<script>
import VueTypes from 'vue-types';

export default {
  name: 'c-radio',
  props: {
    /* eslint-disable vue/require-default-prop */
    id: VueTypes.number.isRequired,
    required: VueTypes.bool
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
