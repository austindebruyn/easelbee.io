<template lang="pug">
  .customer-form-question-card
    .row
      //- .col-2
      //-   .card
      //-     commission-price-counter(
      //-       :values='values'
      //-       :form='form'
      //-     )
      .col-12.col-lg-10.offset-lg-1
        artist-info(:name='artist.displayName')
        .card
          .progress-bar
          .card-body
            customer-form-completed-card(
              v-if='isCompleted'
              :name='artist.displayName'
            )
            question-form(
              v-else=true
              :key='index'
              :question='currentQuestion'
              :isFinalQuestion='isFinalQuestion'
              @submit='handleSubmit'
            )
</template>

<script>
import { mapGetters } from 'vuex';
import VueTypes from 'vue-types';

import { formShape } from 'components/shapes';
import clone from 'lib/clone';
import QuestionForm from './QuestionForm/QuestionForm';
import CommissionPriceCounter from './widgets/CommissionPriceCounter';
import CustomerFormCompletedCard from './widgets/CustomerFormCompletedCard';
import ArtistInfo from 'components/Customer/widgets/ArtistInfo';

/**
 * CustomerFormContainer contains state on the user's progress in the form.
 */
export default {
  name: 'customer-form-container',
  components: {
    'artist-info': ArtistInfo,
    'question-form': QuestionForm,
    'commission-price-counter': CommissionPriceCounter,
    'customer-form-completed-card': CustomerFormCompletedCard
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    form: formShape.isRequired,
    artist: VueTypes.shape({
      id: VueTypes.number.isRequired,
      displayName: VueTypes.string.isRequired,
      createdAt: VueTypes.string,
      updatedAt: VueTypes.string,
      email: VueTypes.string
    }).isRequired
  },
  data: function () {
    return {
      values: {},
      index: 0
    };
  },
  computed: {
    ...mapGetters(['isCompleted']),
    isFinalQuestion: function () {
      // There is always an extra "contact info" question that is considered
      // to be question n (where n = length of questions). For that reason,
      // the form is not complete until n + 1 questions have been answered and
      // it is valid to be on item n (not n-1) of an array with only n
      // elements.
      return this.index === this.form.questions.length;
    },
    price: function () {
      return 0;
    },
    currentQuestion: function () {
      if (this.isFinalQuestion) {
        return null;
      }
      const id = this.form.questions[this.index];
      return this.$store.state.questions[id];
    }
  },
  methods: {
    handleSubmit: function (value) {
      this.values = clone(this.values);

      if (this.isFinalQuestion) {
        Object.assign(this.values, value);
        this.$emit('complete', this.values);
      } else {
        const key = `question_${this.currentQuestion.id}`;
        this.values[key] = value;
        this.index = this.index + 1;
      }
    }
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';

  h1 {
    font-size: 1.6rem;
  }

  h2 {
    font-size: 1rem;
    color: $gray;
  }

  .card {
    border: 1px solid $gray;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
</style>
