import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import pick from 'lodash.pick';

let raven = null;

export default function (opts) {
  if (raven) {
    return raven;
  }

  const publicToken = opts.public;

  if (publicToken) {
    const dsn = 'https://3246ffc63cc84a65b636faffe7462d11@sentry.io/252495';

    raven = Raven.config(dsn);
    raven.addPlugin(RavenVue, Vue);
    raven.install();

    if (opts.user) {
      Raven.setUserContext(pick(opts.user, 'id', 'displayName', 'email'));
    }
  }
  return raven;
};
