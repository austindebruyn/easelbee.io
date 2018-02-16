<template lang="pug">
  nav.dashboard-navbar
    .top
      v-link(to='/commissions')
        span.fa.fa-th-large
      v-link(to='/forms')
        span.fa.fa-list-ol
    form(action='/signout', method='POST')
      button(type='submit')
        span.fa.fa-sign-out
</template>

<script>
import VLink from 'components/controls/VLink';

export default {
  name: 'dashboard-navbar',
  components: {
    'v-link': VLink
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';
  @import 'src/styles/fonts';

  .dashboard-navbar {
    background-color: $blue-dark;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 60px;
    padding: 32px 14px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    text-align: center;

    .top {
      flex-grow: 9;
    }

    a, button {
      display: block;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      font-size: 28px;
      color: #fff;
      margin-bottom: 24px;

      &.router-link-active {
        color: $blue;
      }

      &:hover {
        color: $blue-light;
      }
    }
  }
</style>
