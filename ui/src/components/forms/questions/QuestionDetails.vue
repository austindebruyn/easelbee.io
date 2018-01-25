<template lang="pug">
  .question-details
    .card-body
      form(@submit='handleSubmit')
        .form-group
          h4 question title
          v-input-text(
            ref='title'
            :defaultValue='question.title'
            kind='madlibs'
            size='lg'
            @keyup='handleChange'
          )
        .form-group
          h4 type
          p coming soon...
        .form-group
          h4 options
          p coming soon...
        .form-group(v-if='dirty')
          button.btn.btn-primary(type='submit') Save
</template>

<script>
import { questionShape } from 'components/shapes';
import VInputText from 'components/controls/VInputText';

export default {
  name: 'question-details',
  components: {
    'v-input-text': VInputText
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    question: questionShape.isRequired
  },
  data: function () {
    return { dirty: false };
  },
  methods: {
    handleChange: function () {
      this.dirty = true;
    },
    handleSubmit: function (e) {
      e.preventDefault();

      this.$store.dispatch('updateQuestion', {
        id: this.question.id,
        title: this.$refs.title.getValue()
      });

      this.dirty = false;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .card-body {
    padding: 3rem;
  }

  .form-group {
    padding-bottom: 40px;

    &:last-child {
      padding-bottom: 0;
    }
  }

  h4 {
    font-family: 'tensoregular', sans-serif;
    text-transform: uppercase;
    color: $gray;
    font-size: 1rem;
  }
</style>
