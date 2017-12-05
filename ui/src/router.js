import Vue from 'vue';
import VueRouter from 'vue-router';
import store from 'state/store';

import 'components/App';
import LoginPage from 'components/auth/LoginPage';
import CreateAccountPage from 'components/auth/CreateAccountPage';
import NewPasswordResetPage from 'components/auth/passwordResets/NewPasswordResetPage';
import CompletePasswordResetPage from 'components/auth/passwordResets/CompletePasswordResetPage';
import VerifyEmailPage from 'components/auth/VerifyEmailPage';
import HomeIndexPage from 'components/HomeIndexPage';
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
    return next('/home');
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
      path: '/home',
      component: HomeIndexPage,
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
