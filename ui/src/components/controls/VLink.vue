<template lang="pug">
  router-link.v-link(
    v-if='to'
    :to='to'
    :event='event'
    :class='classes'
  )
    slot
  a.v-link(
    v-else=true
    href='javascript:;'
    @click='handleClick'
  )
    slot
</template>

<script>
export default {
  name: 'v-link',
  props: {
    to: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    event: function () {
      return this.disabled ? '' : void 0;
    },
    classes: function () {
      return {
        disabled: this.disabled
      };
    }
  },
  methods: {
    handleClick: function (e) {
      this.$emit('click', e);
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .v-link {
    &.btn-link {
      text-decoration: underline;
      transition: none;

      &:focus {
        box-shadow: none;
      }
      &.disabled {
        color: $gray-dark;
      }
    }
  }
</style>
