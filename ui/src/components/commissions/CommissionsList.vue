<template lang="pug">
  .commissions-list
    h3 Commissions
    loading-spinner(v-if='loading')
    div(v-else=true)
      p(v-if='commissions.length < 1') No commissions yet :)
      ul.list-unstyled(v-else=true)
        commissions-list-item(
          v-for='commission in commissions'
          key='commission.id'
          :commission='commission'
        )
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
import LoadingSpinner from 'components/LoadingSpinner';
import VInputText from 'components/controls/VInputText';
import CommissionsListItem from './CommissionsListItem';
import { isLoaded } from 'state/Resource';

export default {
  name: 'commissions-list',
  components: {
    'loading-spinner': LoadingSpinner,
    'v-input-text': VInputText,
    'commissions-list-item': CommissionsListItem
  },
  computed: {
    loading: function () {
      return !isLoaded(this.$store.state.commissions);
    },
    commissions: function () {
      return this.$store.state.commissions.value;
    }
  },
  mounted: function () {
    this.$store.dispatch('fetchCommissions');
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

<style lang="scss">
  @import 'src/styles/colors';

  ul {
    display: flex;
    flex-wrap: wrap;
  }
</style>
