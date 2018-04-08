<template lang="pug">
  .commission-price-counter
    .center-characters
      .symbol $
      .number {{ price }}
</template>

<script>
import VueTypes from 'vue-types';
import PriceCalculator from 'logic/PriceCalculator';
import { formShape } from 'components/shapes';

export default {
  name: 'commission-price-counter',
  props: {
    /* eslint-disable vue/require-default-prop */
    form: formShape.isRequired,
    values: VueTypes.object.isRequired
  },
  computed: {
    price: function () {
      return new PriceCalculator().calculate(this.form, this.values);
    }
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';

  .commission-price-counter {
    padding: 30px 0;
    font-family: sinkinsans;

    .center-characters {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .symbol {
      float: left;
      color: green;
    }
    .number {
      float: left;
      font-size: 24px;
      font-weight: bold;
    }
  }
</style>
