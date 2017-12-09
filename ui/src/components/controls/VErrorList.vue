<template lang="pug">
  ul.error-list(v-if='shouldShow')
    li(v-for='error in errors', key='error') {{ error }}
</template>

<script>
import { isErrored } from 'state/Resource';

export default {
  name: 'v-error-list',
  props: {
    resource: {
      required: true,
      type: Object,
      validator: function (value) {
        return typeof value.status === 'number';
      }
    },
    prefix: {
      required: true,
      type: String
    }
  },
  data: function () {
    return {
      errors: []
    };
  },
  computed: {
    shouldShow: function () {
      return isErrored(this.resource);
    }
  },
  watch: {
    'resource.errors': function (errors) {
      if (!errors || errors.length < 1) {
        this.errors = [ this.$t('error-list.generic-error') ];
      } else {
        this.errors = errors.map(error => {
          return this.$t(`${this.prefix}.${error.code}`);
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  ul.error-list {
    list-style-type: none;
    padding-left: 0;

    li {
      text-transform: uppercase;
      font-size: 0.8rem;
      color: red;
    }
  }
</style>
