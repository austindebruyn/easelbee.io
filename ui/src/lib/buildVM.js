import Vue from 'vue';
import VueTween from 'lib/VueTween';
import buildRaven from 'lib/buildRaven';
import buildLocale from 'lib/buildLocale';

import VTooltip from 'v-tooltip';

export default function (opts) {
  const { user, router, store } = opts;

  buildRaven({
    ...opts.context.sentry,
    user
  });

  Vue.use(VueTween);
  Vue.use(VTooltip);

  const i18n = buildLocale();

  return new Vue({
    router,
    store,
    i18n
  });
};
