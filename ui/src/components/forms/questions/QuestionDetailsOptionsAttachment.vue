<template lang="pug">
  .question-details-options-attachment
    img.pull-left(:src='attachment.url', alt='')
    .img-controls.pull-left
      p
        a(href='javascript:;', @click='handleClickReplace')
          | {{ $t('forms.details.questions.attachments.replace') }}
      p
        a.disabled(disabled=true, href='javascript:;', @click='handleClickDelete')
          | {{ $t('forms.details.questions.attachments.delete') }}
</template>

<script>
import VueTypes from 'vue-types';

export default {
  name: 'question-details-options-attachment',
  components: {
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    optionId: VueTypes.number.def(-1).isRequired
  },
  computed: {
    attachment: function () {
      return this.$store.getters.getOptionAttachmentByOptionId(this.optionId);
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
