import Vue from 'vue';
import VueRouter from 'vue-router';

import 'components/TheCustomerRoot';
import NotFoundPage from 'components/NotFoundPage';
import CustomerFormPage from 'components/Customer/CustomerFormPage';

Vue.use(VueRouter);

const AppRouter = new VueRouter({
  mode: 'history',
  base: '/forms',
  routes: [
    {
      path: '/:slug',
      component: CustomerFormPage
    },
    { path: '*', component: NotFoundPage }
  ]
});

export default AppRouter;
