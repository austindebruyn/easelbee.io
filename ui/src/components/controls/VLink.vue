<template lang="pug">
  router-link.v-link(
    :to='to'
    :event='event'
    :class='classes'
  )
    slot
</template>

<script>
  export default {
    name: 'v-link',
    props: {
      to: {
        required: true,
        type: String
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
