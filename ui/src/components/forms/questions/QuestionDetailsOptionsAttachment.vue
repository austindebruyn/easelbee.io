<template lang="pug">
  .question-details-options-attachment
    img.pull-left(:src='attachment.url', :alt='option.value')
    .img-controls.pull-left
      p hey
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
  }
</style>
