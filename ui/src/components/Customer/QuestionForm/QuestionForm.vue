<template lang="pug">
  .question-form
    h2.question-title {{ formTitle }}
    form(@submit='handleSubmit')
      .step(v-if='isFinalQuestion')
        s-gather-user-details(
          ref='step'
        )
      .control(v-else=true)
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
import VueTypes from 'vue-types';

import { questionShape } from 'components/shapes';
import CString from './controls/CString';
import CRadio from './controls/CRadio';
import SGatherUserDetails from './steps/SGatherUserDetails';

export default {
  name: 'question-form',
  components: {
    CString,
    CRadio,
    SGatherUserDetails
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    question: questionShape,
    // if `isFinalQuestion` is true, then `question` must be null
    isFinalQuestion: VueTypes.bool
  },
  computed: {
    buttonText: function () {
      return this.isFinalQuestion
        ? this.$t('customer.finish')
        : this.$t('customer.next');
    },
    formTitle: function () {
      if (this.question) {
        return this.question.title;
      }
      return this.$t('customer.steps.gather-user-details.title');
    }
  },
  methods: {
    handleSubmit: function (e) {
      e.preventDefault();
      if (this.question) {
        return this.$emit('submit', this.$refs.input.value);
      }
      const values = this.$refs.step.getValues();
      this.$emit('submit', values);
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
