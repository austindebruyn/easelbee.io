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
          select(
            ref='type'
            @change='handleChange'
          )
            option(value='radio') Multiple-choice
            option(value='string') Short Text
        .form-group(v-if='shouldShowOptions')
          h4 {{ $t('forms.details.questions.options') }}
          question-details-options(
            ref='questionOptions'
            :question='question'
            @addOption='handleAddOption'
            @change='handleChange'
          )
        .form-group(v-if='dirty')
          button.btn.btn-primary(type='submit') {{ $t('save') }}
</template>

<script>
import { questionShape } from 'components/shapes';
import VInputText from 'components/controls/VInputText';
import QuestionDetailsOptions from './QuestionDetailsOptions';
import clone from '../../../lib/clone';
import pick from 'lodash.pick';

export default {
  name: 'question-details',
  components: {
    'v-input-text': VInputText,
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
    scrubQuestionOptions: function (questionOptions) {
      // When submitting options to the API, don't include model attributes like
      // id or timestamps.
      return questionOptions.map(function (questionOption) {
        return pick(questionOption, 'value');
      });
    },
    handleSubmit: function (e) {
      e.preventDefault();

      const options = this.scrubQuestionOptions(
        this.shouldShowOptions
        ? this.$refs.questionOptions.getValues()
        : this.question.options || []
      );

      this.$store.dispatch('updateQuestion', {
        id: this.question.id,
        title: this.$refs.title.getValue(),
        type: this.$refs.type.value,
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
        type: this.$refs.type.value,
        options: this.scrubQuestionOptions(options)
      });
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
