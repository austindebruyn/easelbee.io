<template lang="pug">
  .s-gather-user-details
    .control
      c-string(
        ref='email'
        :label='$t("customer.steps.gather-user-details.email-label")'
        :placeholder='$t("customer.steps.gather-user-details.email-placeholder")'
        id='email'
      )
      c-string(
        ref='nickname'
        :label='$t("customer.steps.gather-user-details.nickname-label")'
        :placeholder='$t("customer.steps.gather-user-details.nickname-placeholder")'
        id='nickname'
      )
</template>

<script>
import CString from '../controls/CString';
import CRadio from '../controls/CRadio';

export default {
  name: 's-gather-user-details',
  components: {
    CString,
    CRadio
  },
  methods: {
    getValues: function () {
      return {
        nickname: this.$refs.nickname.value,
        email: this.$refs.email.value
      };
    }
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';

  $ui-font-family: 'vocal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  .s-gather-user-details {
  }
</style>
