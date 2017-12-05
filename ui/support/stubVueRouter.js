import Vue from 'vue';

export default function () {
  if (typeof global.RouterView !== 'undefined' && global.RouterView !== null) {
    return;
  }

  global.RouterView = {
    name: 'router-view'
  };

  global.RouterLink = {
    name: 'router-link',
    props: { to: String },
    render: function (h) {
      return h('div');
    }
  };

  Vue.component('router-view', global.RouterView);
  Vue.component('router-link', global.RouterLink);
};
