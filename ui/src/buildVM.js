import Vue from 'vue';
import VueTween from 'lib/VueTween';
import buildRaven from 'lib/buildRaven';
import buildLocale from 'lib/buildLocale';
import router from 'router';
import store from 'state/store';
import pick from 'lodash.pick';

export default function (opts) {
  // hydrate
  const user = opts.user;
  const raven = buildRaven(opts.context.sentry);
  raven.ha()
  store.store.subscribe(function () {
    if (raven) {
      raven.setRavenUser(pick(store.state.user, 'id', 'username', 'email'));
    }
  });
  store.commit('loginSuccess', user);

  Vue.use(VueTween);

  const i18n = buildLocale();

  return new Vue({
    router,
    store,
    i18n
  });
};
