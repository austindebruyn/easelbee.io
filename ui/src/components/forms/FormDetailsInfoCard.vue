<template lang="pug">
  .card.form-details-info-card
    .title-block
      form(@submit='handleSubmit')
        v-input-text(
          ref='name'
          :defaultValue='form.name'
          kind='madlibs'
        )
        input(type='submit', hidden=true)
    .card-body
      p
        span.text-muted {{ $t('forms.details.created-at') }}
        span  {{ createdAt }}
      p
        span.text-muted {{ $t('forms.details.fillout-counts-label') }}
        span  {{ filloutCountsValue }}
      p
        span.text-muted {{ $t('forms.details.revenue-label-1') }}
        span  {{ revenueValue }}
        span.text-muted  {{ $t('forms.details.revenue-label-2') }}
</template>

<script>
import VInputText from 'components/controls/VInputText';
import { formShape } from 'components/shapes';
import moment from 'moment';

export default {
  name: 'form-details-info-card',
  components: {
    'v-input-text': VInputText
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    form: formShape.isRequired
  },
  computed: {
    createdAt: function () {
      return moment(this.form.createdAt).fromNow();
    },
    filloutCountsValue: function () {
      return this.$t('forms.details.fillout-counts-value', { count: 0 });
    },
    revenueValue: function () {
      return '$0';
    }
  },
  methods: {
    handleSubmit: function (e) {
      e.preventDefault();

      this.$store.dispatch('updateForm', {
        id: this.form.id,
        name: this.$refs.name.getValue()
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .form-details-info-card {
    .title-block {
      background-color: $gray-light;
      padding: 10px 20px;
    }
  }
</style>
