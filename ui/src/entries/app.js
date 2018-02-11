import buildVM from '../lib/buildVM';
import appRouter from '../routers/app';

const root = document.getElementById('root');

const vm = buildVM({
  router: appRouter,
  user: JSON.parse(root.getAttribute('data-user')),
  context: JSON.parse(root.getAttribute('data-context'))
});

vm.$mount('#root');
