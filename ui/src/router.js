import Vue from 'vue';
import VueRouter from 'vue-router';
import store from 'state/store';

import 'components/App';
import LoginPage from 'components/auth/LoginPage';
import CreateAccountPage from 'components/auth/CreateAccountPage';
import NewPasswordResetPage from 'components/auth/passwordResets/NewPasswordResetPage';
import CompletePasswordResetPage from 'components/auth/passwordResets/CompletePasswordResetPage';
import VerifyEmailPage from 'components/auth/VerifyEmailPage';
import CommissionsIndexPage from 'components/CommissionsIndexPage';
import CommissionsDetailsPage from 'components/CommissionsDetailsPage';
import FormsIndexPage from 'components/FormsIndexPage';
import NotFoundPage from 'components/NotFoundPage';
import SettingsPage from 'components/SettingsPage/SettingsPage';

Vue.use(VueRouter);

const ensureAuthenticated = function (to, from, next) {
  if (!store.state.user.value) {
    return next('/');
  }
  return next();
};

const ensureAnonymous = function (to, from, next) {
  if (store.state.user.value) {
    return next('/commissions');
  }
  return next();
};

export default new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: LoginPage, beforeEnter: ensureAnonymous },
    { path: '/create', component: CreateAccountPage, beforeEnter: ensureAnonymous },
    {
      path: '/passwordResets/new',
      component: NewPasswordResetPage,
      beforeEnter: ensureAnonymous
    },
    {
      path: '/passwordResets/complete',
      component: CompletePasswordResetPage,
      beforeEnter: ensureAnonymous
    },
    { path: '/users/me/emailPreferences/verify', component: VerifyEmailPage },
    {
      path: '/commissions',
      component: CommissionsIndexPage,
      beforeEnter: ensureAuthenticated
    },
    {
      path: '/commissions/:id',
      component: CommissionsDetailsPage,
      beforeEnter: ensureAuthenticated
    },
    {
      path: '/forms',
      component: FormsIndexPage,
      beforeEnter: ensureAuthenticated
    },
    {
      path: '/settings',
      component: SettingsPage,
      beforeEnter: ensureAuthenticated
    },
    { path: '*', component: NotFoundPage }
  ]
});
