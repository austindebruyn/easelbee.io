<template lang="pug">
  .question-form
    h2.question-title {{ question.title }}
    form(@submit='handleSubmit')
      .control
        c-string(
          ref='input'
          v-if='question.type === "string"'
          :id='question.id'
        )
        c-radio(
          ref='input'
          v-else-if='question.type === "radio"'
          :id='question.id'
        )
      .button-row
        button.btn.btn-primary(type='submit') {{ buttonText }}
</template>

<script>
import { questionShape } from 'components/shapes';
import CString from './controls/CString';
import CRadio from './controls/CRadio';
import VueTypes from 'vue-types';

export default {
  name: 'question-form',
  components: {
    'c-string': CString,
    'c-radio': CRadio
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    question: questionShape.isRequired,
    isFinalQuestion: VueTypes.bool
  },
  computed: {
    buttonText: function () {
      return this.isFinalQuestion
        ? this.$t('customer.finish')
        : this.$t('customer.next');
    }
  },
  methods: {
    handleSubmit: function (e) {
      e.preventDefault();
      this.$emit('submit', this.$refs.input.value);
    }
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';

  $ui-font-family: 'vocal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  .question-form {
    h2 {
      font-weight: 100;
      font-family: $ui-font-family;
      color: $black;
      font-size: 30px;
      text-rendering: optimizeLegibility;

      margin-bottom: 40px;
    }

    .control {
      margin-bottom: 20px;
    }

    .button-row {
      text-align: right;
    }

    .btn {
      font-family: $ui-font-family;
      font-size: 24px;
      background-color: $ui-blue;
      border-color: $ui-blue;
      border-radius: 0;
      padding: 12px 42px;
    }

    form {
      margin: 0;
    }
  }
</style>
