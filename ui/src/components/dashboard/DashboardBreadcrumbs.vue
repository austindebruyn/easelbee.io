<template lang="pug">
  ol.breadcrumb.dashboard-breadcrumbs
    li.breadcrumb-item(
      v-for='crumb in breadcrumbs'
      key='crumb.name'
      :classes='getClassesForCrumb(crumb)'
    )
      router-link(v-if='crumb.to', :to='crumb.to') {{ crumb.name }}
      span(v-else=true) {{ crumb.name }}
</template>

<script>
import VLink from 'components/controls/VLink';
import VueTypes from 'vue-types';

export const BreadcrumbsPropType = VueTypes.arrayOf(VueTypes.shape({
  name: VueTypes.string.isRequired,
  to: VueTypes.string,
  active: VueTypes.bool
}));

export default {
  name: 'dashboard-breadcrumbs',
  components: {
    'v-link': VLink
  },
  props: {
    /* eslint-disable vue/require-default-prop */
    breadcrumbs: BreadcrumbsPropType.isRequired
  },
  methods: {
    getClassesForCrumb: function (crumb) {
      return { active: crumb.active };
    }
  }
};
</script>

<style lang="scss" scoped>
  .dashboard-breadcrumbs {
    font-family: 'sinkinsans', sans-serif;
  }
</style>
