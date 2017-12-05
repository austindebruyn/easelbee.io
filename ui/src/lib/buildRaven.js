import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

let raven = null;

export default function (opts) {
  if (raven) {
    return raven;
  }

  let userId = 'unset';
  const publicToken = opts.public;

  if (publicToken) {
    const dsn = 'https://3246ffc63cc84a65b636faffe7462d11@sentry.io/252495';

    raven = Raven.config(dsn);
    raven.addPlugin(RavenVue, Vue);
    raven.install();

    raven.setRavenUser = function (user = {}) {
      if (!raven) {
        return;
      }
      if (userId === 'unset' || userId !== user.id) {
        Raven.setUserContext(user);
        userId = user.id;
      }
    };
  }
  return raven;
};
