import buildVM from './buildVM';

const root = document.getElementById('root');

const vm = buildVM({
  user: JSON.parse(root.getAttribute('data-user')),
  context: JSON.parse(root.getAttribute('data-context'))
});

vm.$mount('#root');
