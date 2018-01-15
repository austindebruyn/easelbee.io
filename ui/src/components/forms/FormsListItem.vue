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
        .controls
          a.control-link.danger-link(href='javascript:;')
            i.fa.fa-trash-o
          router-link.control-link(:to='editUrl')
            i.fa.fa-pencil
          a.control-link(:href='form.publicUrl', target='_blank')
            i.fa.fa-external-link
</template>

<script>
import { formShape } from 'components/shapes';
import moment from 'moment';

export default {
  name: 'forms-list-item',
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

    .controls {
      padding-top: 16px;
      float: right;

      .control-link {
        i {
          border: 1px solid $blue;
          padding: 8px 16px;
          color: $blue;
          font-size: 1.5rem;

          &:hover {
            color: $blue-light;
            border-color: $blue-light;
          }
        }

        margin-right: 8px;

        &:last-child {
          margin-right: 0;
        }
      }

      .danger-link {
        i {
          color: $red;
          border-color: $red;

          &:hover {
            color: $red-light;
            border-color: $red-light;
          }
        }
      }
    }
  }
</style>
