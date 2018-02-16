import buildVM from '../../lib/buildVM';
import router from './router';
import store from 'state/store';

const root = document.getElementById('root');

const user = JSON.parse(root.getAttribute('data-user'));

const context = JSON.parse(root.getAttribute('data-context'));

store.commit('setUser', user);

const vm = buildVM({
  router,
  user,
  store,
  context
});

vm.$mount('#root');
