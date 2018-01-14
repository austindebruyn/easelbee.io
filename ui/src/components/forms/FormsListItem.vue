<template lang="pug">
  li.form-list-item
    .card
      .card-body
        h4.card-title {{ form.name }}
        .subtitle
          span.text-muted {{ $t('forms.index.item.last-updated-at') }}
          span  {{ lastUpdatedAt }}
        .subtitle(v-if='form.submittedAt')
          span.text-muted {{ $t('forms.index.item.last-submitted-at') }}
          span  {{ lastSubmittedAt }}
        .subtitle(v-else=true)
          span.text-muted {{ $t('forms.index.item.last-submitted-at-never') }}
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
