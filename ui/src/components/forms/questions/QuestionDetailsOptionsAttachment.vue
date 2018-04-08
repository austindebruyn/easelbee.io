<template lang="pug">
  .question-details-options-attachment
    img.pull-left(:src='attachment.url', :alt='option.value')
    .img-controls.pull-left
      p
        a(href='javascript:;', @click='handleClickReplace')
          | {{ $t('forms.details.questions.attachments.replace') }}
      p
        a.disabled(disabled=true, href='javascript:;', @click='handleClickDelete')
          | {{ $t('forms.details.questions.attachments.delete') }}
</template>

<script>
import { optionShape } from 'components/shapes';

export default {
  name: 'question-details-options-attachment',
  components: {
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    option: optionShape.isRequired
  },
  computed: {
    attachment: function () {
      return this.option.optionAttachment;
    }
  },
  methods: {
    handleClickDelete: function () {
      this.$emit('delete');
    },
    handleClickReplace: function () {
      this.$emit('replace');
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .question-details-options-attachment {
    padding-top: 14px;

    img {
      width: 200px;
      border-radius: 3px;
      box-shadow: 0 0 8px $gray;
    }

    .img-controls {
      padding-left: 1rem;
    }

    a.disabled {
      color: $gray;
      &:hover {
        text-decoration: none;
      }
    }
  }
</style>
