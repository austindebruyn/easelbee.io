<template lang="pug">
  router-link.control-link(
    v-if='to'
    :to='to'
    :class='classes'
    @click='handleClick'
  )
    i.fa(:class='icon')
  a.control-link(
    v-else=true
    :href='href'
    :class='classes'
    target='_blank'
    @click='handleClick'
  )
    i.fa(:class='icon')
</template>

<script>
import VueTypes from 'vue-types';

export default {
  name: 'v-card-control',
  props: {
    to: {
      type: String,
      default: null
    },
    href: {
      type: String,
      default: 'javascript:;'
    },
    icon: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    /* eslint-disable vue/require-default-prop */
    kind: VueTypes.oneOf(['default', 'danger']).def('default')
  },
  computed: {
    classes: function () {
      if (this.kind === 'danger') {
        return 'danger-link';
      }
      return null;
    }
  },
  methods: {
    handleClick: function () {
      this.$emit('click');
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

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
</style>
