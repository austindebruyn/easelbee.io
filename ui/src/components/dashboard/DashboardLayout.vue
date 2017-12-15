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
    .container(v-if='breadcrumbs')
      dashboard-breadcrumbs(:breadcrumbs='breadcrumbs')
    .content
      slot
</template>

<script>
import VLink from 'components/controls/VLink';
import DashboardBreadcrumbs, { BreadcrumbsPropType } from 'components/dashboard/DashboardBreadcrumbs';

export default {
  name: 'dashboard-layout',
  components: {
    'v-link': VLink,
    'dashboard-breadcrumbs': DashboardBreadcrumbs
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    breadcrumbs: BreadcrumbsPropType
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/fonts';

  .navbar {
    font-family: 'sinkinsans', sans-serif;
  }

  .content {
    padding-top: 40px;
  }
</style>
