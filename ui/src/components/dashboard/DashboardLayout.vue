<template lang="pug">
  .dashboard-layout
    dashboard-navbar
    .navbar-padding
      section.top-section
        .container(v-if='breadcrumbs')
          dashboard-breadcrumbs(:breadcrumbs='breadcrumbs')
      section.content-section
        .content
          slot
</template>

<script>
import VLink from 'components/controls/VLink';
import DashboardBreadcrumbs, { BreadcrumbsPropType } from 'components/dashboard/DashboardBreadcrumbs';
import DashboardNavbar from 'components/dashboard/DashboardNavbar';

export default {
  name: 'dashboard-layout',
  components: {
    'v-link': VLink,
    'dashboard-breadcrumbs': DashboardBreadcrumbs,
    'dashboard-navbar': DashboardNavbar
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

  .navbar-padding {
    padding-left: 60px;
  }

  .content {
    padding-top: 40px;
  }

  section.top-section {
    background-color: white;
    padding-top: 3rem;
    padding-bottom: 0.25rem;
  }
</style>
