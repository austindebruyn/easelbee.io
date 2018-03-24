<template lang="pug">
  .question-details-options
    .option-form(
      v-for='option in question.options'
      key='option.id'
    )
      .form-row
        .form-group.col-11
          v-input-text(
            :ref='"option-" + option.id'
            :name='"option" + option.id'
            :defaultValue='option.value'
            kind='madlibs'
            @keyup='handleChange'
          )
        .col-1
          button.delete-option-button(
            @click='handleDeleteOptionClick(option.id)'
          )
            i.fa.fa-times
      .form-row
        .col-12
          question-details-options-delta(
            :type='getDeltaType(option)'
            :amount='getDeltaAmount(option)'
            @change='data => handleDeltaChange(option, data)'
          )
    a.btn.btn-link(
      href='javascript:;'
      @click='handleAddOptionClick'
    ) {{ $t('forms.details.questions.add-option') }}
</template>

<script>
import pick from 'lodash.pick';
import { questionShape } from 'components/shapes';
import VInputText from 'components/controls/VInputText';
import QuestionDetailsOptionsDelta from './QuestionDetailsOptionsDelta';

export default {
  name: 'question-details-options',
  components: {
    'v-input-text': VInputText,
    'question-details-options-delta': QuestionDetailsOptionsDelta
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    question: questionShape.isRequired
  },
  methods: {
    handleAddOptionClick: function () {
      this.$emit('addOption');
    },
    handleDeleteOptionClick: function (optionId) {
      this.$emit('deleteOption', optionId);
    },
    getValues: function () {
      const refs = this.$refs;
      return this.question.options.map(function (option) {
        return { value: refs[`option-${option.id}`][0].getValue() };
      });
    },
    handleChange: function () {
      this.$emit('change');
    },
    handleDeltaChange: function (option, delta) {
      if (delta) {
        this.$store.dispatch('updateOptionDelta', {
          ...pick(option, 'id', 'questionId'),
          delta
        });
      } else {
        this.$store.dispatch('destroyOptionDelta', {
          ...pick(option, 'id', 'questionId')
        });
      }
    },
    getDeltaType: function (option) {
      return option.delta ? option.delta.type : null;
    },
    getDeltaAmount: function (option) {
      return option.delta ? option.delta.amount : null;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .delete-option-button {
    cursor: pointer;
    border: none;
    background: none;
    color: $red;
  }

  .option-form {
    padding-bottom: 20px;
  }
</style>
