<template lang="pug">
  .commissions-list
    .commissions-zero-data-state(v-if='commissions.length < 1')
      .fa.fa-spinner
      h3 Nothing here!
    ul.list-unstyled(v-else=true)
      commissions-list-item(
        v-for='commission in commissions'
        key='commission.id'
        :commission='commission'
      )
    div(hidden=true)
      hr
      h3 Create new commission
        form(
          @submit='handleFormSubmit'
        )
          .form-group
            v-input-text(
              name='email',
              placeholder='customers@email.com'
            )
          .form-group
            v-input-text(
              name='body',
              placeholder='Some message.'
            )
          .form-group
            button.btn.btn-primary(type='submit') Submit
</template>

<script>
import VueTypes from 'vue-types';

import VInputText from 'components/controls/VInputText';
import CommissionsListItem from './CommissionsListItem';
import { commissionShape } from 'components/shapes';

export default {
  name: 'commissions-list',
  components: {
    'v-input-text': VInputText,
    'commissions-list-item': CommissionsListItem
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    commissions: VueTypes.arrayOf(commissionShape)
  },
  methods: {
    handleFormSubmit: function (e) {
      e.preventDefault();

      this.$store.dispatch('createCommission', {
        email: e.target.email.value,
        body: e.target.body.value
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .commissions-list {
    padding-top: 2rem;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
  }

  .commissions-zero-data-state {
    color: $blue;
    text-align: center;
    border: 4px dashed $blue;
    padding: 4rem;

    .fa {
      font-size: 3rem;
      padding-bottom: 1rem;
    }

    h3 {
      font-size: 1.4rem;
    }
  }
</style>
