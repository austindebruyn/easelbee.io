import Vue from 'vue';
import VueTween from 'lib/VueTween';
import buildRaven from 'lib/buildRaven';
import buildLocale from 'lib/buildLocale';
import store from 'state/store';
import pick from 'lodash.pick';

import VTooltip from 'v-tooltip';

export default function (opts) {
  const { user, router } = opts;
  const raven = buildRaven(opts.context.sentry);

  store.subscribe(function () {
    if (raven) {
      const userContext = pick(
        store.state.user.value,
        'id',
        'displayName',
        'email'
      );
      raven.setRavenUser(userContext);
    }
  });
  store.commit('loginSuccess', user);

  Vue.use(VueTween);
  Vue.use(VTooltip);

  const i18n = buildLocale();

  return new Vue({
    router,
    store,
    i18n
  });
};
