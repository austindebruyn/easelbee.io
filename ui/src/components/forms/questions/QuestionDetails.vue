<template lang="pug">
  .question-details
    .card-body
      form(@submit='handleSubmit')
        .form-group
          h4 {{ $t('forms.details.questions.title') }}
          v-input-text(
            ref='title'
            :defaultValue='question.title'
            kind='madlibs'
            size='lg'
            @keyup='handleChange'
          )
        .form-group
          h4 {{ $t('forms.details.questions.type') }}
          v-dropdown(
            ref='type'
            :defaultValue='this.question.type'
            :options='[{ label: "Multiple-choice", value: "radio" }, { label: "Short Text", value: "string" }]'
            @change='handleChange'
          )
        .form-group(v-if='shouldShowOptions')
          h4 {{ $t('forms.details.questions.options') }}
          question-details-options(
            ref='options'
            :question='question'
            @addOption='handleAddOption'
            @change='handleChange'
          )
        .form-group(v-if='dirty')
          button.btn.btn-primary(type='submit') {{ $t('save') }}
      .card-controls
        v-card-control(
          icon='fa-trash-o'
          kind='danger'
          @click='handleDestroyClick'
        )
</template>

<script>
import { questionShape } from 'components/shapes';
import VInputText from 'components/controls/VInputText';
import VDropdown from 'components/controls/VDropdown';
import VCardControl from 'components/controls/VCardControl';
import QuestionDetailsOptions from './QuestionDetailsOptions';
import clone from '../../../lib/clone';
import pick from 'lodash.pick';

export default {
  name: 'question-details',
  components: {
    'v-input-text': VInputText,
    'v-dropdown': VDropdown,
    'v-card-control': VCardControl,
    'question-details-options': QuestionDetailsOptions
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    question: questionShape.isRequired
  },
  data: function () {
    return { dirty: false };
  },
  computed: {
    shouldShowOptions: function () {
      return ['radio'].includes(this.question.type);
    }
  },
  methods: {
    handleChange: function () {
      this.dirty = true;
    },
    scrubOptions: function (options) {
      // When submitting options to the API, don't include model attributes like
      // id or timestamps.
      return options.map(option => pick(option, 'value'));
    },
    handleSubmit: function (e) {
      e.preventDefault();

      const options = this.scrubOptions(
        this.shouldShowOptions
          ? this.$refs.options.getValues()
          : this.question.options || []
      );

      this.$store.dispatch('updateQuestion', {
        id: this.question.id,
        title: this.$refs.title.getValue(),
        type: this.$refs.type.getValue(),
        options
      });

      this.dirty = false;
    },
    handleAddOption: function () {
      const options = clone(this.question.options);
      options.push({ value: '' });

      this.$store.dispatch('updateQuestion', {
        id: this.question.id,
        title: this.$refs.title.getValue(),
        type: this.$refs.type.getValue(),
        options: this.scrubOptions(options)
      });
    },
    handleDestroyClick: function () {
      this.$store.dispatch('destroyQuestion', { id: this.question.id });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .card-body {
    padding: 3rem;
  }

  .card-controls {

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
