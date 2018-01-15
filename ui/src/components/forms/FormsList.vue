<template lang="pug">
  .forms-list
    .forms-zero-data-state(v-if='forms.length < 1')
      .fa.fa-spinner
      h3 Nothing here!
    ul(v-else=true)
      forms-list-item(
        v-for='form in forms'
        key='form.id'
        :form='form'
      )
    button.btn-block.text-center.new-form-button(v-tooltip='$t("feature-not-built")')
      span
        .fa.fa-plus-circle
        | {{ $t('forms.index.new') }}
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

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .forms-list {
    ul {
      list-style: none;
      padding: 0;
      margin-bottom: 0;

      li {
        margin-bottom: 1.5rem;
      }
    }
  }

  .new-form-button {
    background: none;
    border: 4px dashed $gray;
    color: $gray;
    cursor: pointer;

    text-align: center;
    padding: 20px;
    margin-bottom: 1.5rem;

    font-size: 1.6rem;

    span .fa {
      margin-right: 10px;
    }
  }

  .forms-zero-data-state {
    color: $gray;
    text-align: center;
    border: 4px dashed $gray;
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
