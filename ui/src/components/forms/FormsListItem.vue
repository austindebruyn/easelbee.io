<template lang="pug">
  li.form-list-item
    .card
      .card-body
        .title-row
          .meta
            h4.card-title {{ form.name }}
            .subtitle
              span.text-muted {{ $t('forms.index.item.last-updated-at') }}
              span  {{ lastUpdatedAt }}
            .subtitle(v-if='form.submittedAt')
              span.text-muted {{ $t('forms.index.item.last-submitted-at') }}
              span  {{ lastSubmittedAt }}
            .subtitle(v-else=true)
              span.text-muted {{ $t('forms.index.item.last-submitted-at-never') }}
          .questions-count
            h2 {{ count }}
            strong.text-muted
              | {{ $t('forms.index.item.question-count', { count: count }) }}
        .card-controls
          v-card-control(
            icon='fa-trash-o'
            kind='danger'
          )
          v-card-control(
            icon='fa-pencil'
            :to='editUrl'
          )
          v-card-control(
            icon='fa-external-link'
            :href='form.publicUrl'
          )
</template>

<script>
import { formShape } from 'components/shapes';
import moment from 'moment';
import VCardControl from 'components/controls/VCardControl';

export default {
  name: 'forms-list-item',
  components: {
    'v-card-control': VCardControl
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    form: formShape.isRequired
  },
  computed: {
    count: function () {
      return this.form.questions.length;
    },
    editUrl: function () {
      return `/forms/${this.form.id}`;
    },
    lastUpdatedAt: function () {
      return moment(this.form.updatedAt).fromNow();
    },
    lastSubmittedAt: function () {
      return moment(this.form.submittedAt).fromNow();
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .form-list-item {
    .title-row {
      display: flex;

      .meta {
        flex-grow: 8;
      }

      .questions-count {
        h2 {
          margin: 0;
          text-align: right;
        }

        strong {
          text-transform: uppercase;
          font-family: sinkinsans;
          font-size: 0.6rem;
        }
      }
    }
  }
</style>
