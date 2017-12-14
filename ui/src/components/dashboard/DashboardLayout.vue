<template lang="pug">
  .dashboard-layout
    nav.navbar.navbar-expand-lg.navbar-light.bg-light
      a.navbar-brand(href='#') easelbee.io
      button.navbar-toggler(type='button', data-toggle='collapse', data-target='#navbarNavAltMarkup', aria-controls='navbarNavAltMarkup', aria-expanded='false', aria-label='Toggle navigation')
        span.navbar-toggler-icon
      #navbarNavAltMarkup.collapse.navbar-collapse
        .navbar-nav
          v-link.nav-item.nav-link.active(to='/commissions') Commissions
          v-link.nav-item.nav-link(to='/forms') Forms
          v-link.nav-item.nav-link.disabled(to='#', disabled=true) Settings
    .content
      slot
</template>

<script>
import VLink from 'components/controls/VLink';

export default {
  name: 'dashboard-layout',
  components: {
    'v-link': VLink
  }
};
</script>

<style lang="scss" scoped>
  .navbar {
    font-family: 'sinkinsans', sans-serif;
  }

  .content {
    padding-top: 40px;
  }
</style>
