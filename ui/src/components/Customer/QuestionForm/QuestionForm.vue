<template lang="pug">
  .question-form
    h4 {{ question.title }}
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

  .question-form {
    h4 {
      padding-bottom: 40px;
    }

    .control {
      padding-bottom: 20px;
    }
  }
</style>
