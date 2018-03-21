<template lang="pug">
  .question-details-options-delta
    .text-muted
      span(v-if='!type')
        | {{ $t('forms.details.questions.deltas.none') }}
        |
        a(href='javascript:;', @click='handleClick')
          | {{ $t('forms.details.questions.deltas.links.base' )}}
      span(v-else-if='type === "base"')
        | {{ $t('forms.details.questions.deltas.base') }}
        | $
        input(
          @change='handleAmountChange'
          :value='amount'
          name='amount'
          type='number'
        )
        |
        a(href='javascript:;', @click='handleClick')
          | {{ $t('forms.details.questions.deltas.links.add' )}}
      span(v-else=true)
        | {{ $t('forms.details.questions.deltas.add') }}
        | $
        input(
          @change='handleAmountChange'
          :value='amount'
          name='amount'
          type='number'
        )
        |
        a(href='javascript:;', @click='handleClick')
          | {{ $t('forms.details.questions.deltas.links.none' )}}
</template>

<script>
import { questionShape } from 'components/shapes';
import VInputText from 'components/controls/VInputText';
import VueTypes from 'vue-types';

export default {
  name: 'question-details-options-delta',
  props: {
    /* eslint-disable vue/require-default-prop */
    type: VueTypes.oneOf(['base', 'add']),
    amount: VueTypes.number
  },
  methods: {
    handleClick: function (e) {
      e.preventDefault();

      let delta;
      if (!this.type || this.type === 'base') {
        delta = {
          type: { base: 'add' }[this.type] || 'base',
          amount: this.amount || 5
        };
      }
      else {
        delta = null;
      }

      this.$emit('change', delta);
    },
    handleAmountChange: function (e) {
      this.$emit('change', {
        type: this.type,
        amount: parseInt(e.target.value, 10)
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }

  .question-details-options-delta {
    font-size: 0.8rem;

    .text-muted a {
      color: $gray;
      text-decoration: underline;
    }

    input {
      color: $gray;
      border: none;
      border-bottom: 1px solid $gray;
      width: 30px;
      text-align: right;
      margin-right: 20px;
    }
  }
</style>
