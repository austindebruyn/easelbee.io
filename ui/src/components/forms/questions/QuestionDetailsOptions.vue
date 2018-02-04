<template lang="pug">
  .question-details-options
    .form-group(
      v-for='option in question.options'
      key='option.id'
    )
      v-input-text(
        :ref='"option-" + option.id'
        :name='"option" + option.id'
        :defaultValue='option.value'
        kind='madlibs'
        @keyup='handleChange'
      )
    a.btn.btn-link(
      href='javascript:;'
      @click='handleAddOptionClick'
    ) {{ $t('forms.details.questions.add-option') }}
</template>

<script>
import { questionShape } from 'components/shapes';
import VInputText from 'components/controls/VInputText';

export default {
  name: 'question-details-options',
  components: {
    'v-input-text': VInputText
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    question: questionShape.isRequired
  },
  methods: {
    handleAddOptionClick: function () {
      this.$emit('addOption');
    },
    getValues: function () {
      const refs = this.$refs;
      return this.question.options.map(function (option) {
        return { value: refs[`option-${option.id}`][0].getValue() };
      });
    },
    handleChange: function () {
      this.$emit('change');
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';
</style>
