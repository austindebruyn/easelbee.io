<template lang="pug">
  .forms-list
    p(v-if='forms.length < 1') No forms yet :)
    ul(v-else=true)
      forms-list-item(
        v-for='form in forms'
        key='form.id'
        :form='form'
      )
</template>

<script>
import LoadingSpinner from 'components/LoadingSpinner';
import VInputText from 'components/controls/VInputText';
import FormsListItem from './FormsListItem';
import VueTypes from 'vue-types';
import { formShape } from 'components/shapes';

export default {
  name: 'forms-list',
  components: {
    'loading-spinner': LoadingSpinner,
    'v-input-text': VInputText,
    'forms-list-item': FormsListItem
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    forms: VueTypes.arrayOf(formShape).isRequired
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';
</style>
