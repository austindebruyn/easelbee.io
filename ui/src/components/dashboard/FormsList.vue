<template lang="pug">
  .forms-list
    h3 forms
    loading-spinner(v-if='loading')
    div(v-else=true)
      p(v-if='forms.length < 1') No forms yet :)
      ul(v-else=true)
        li(v-for='form in forms', key='form.id')
          strong {{ form.name }}:
          |
          a(:href='form.publicUrl') {{ form.publicUrl }}
</template>

<script>
import LoadingSpinner from 'components/LoadingSpinner';
import VInputText from 'components/controls/VInputText';
import { isLoaded } from 'state/Resource';

export default {
  name: 'forms-list',
  components: {
    'loading-spinner': LoadingSpinner,
    'v-input-text': VInputText
  },
  computed: {
    loading: function () {
      return !isLoaded(this.$store.state.forms);
    },
    forms: function () {
      return this.$store.state.forms.value;
    }
  },
  mounted: function () {
    this.$store.dispatch('fetchForms');
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';
</style>
