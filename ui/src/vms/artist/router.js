import Vue from 'vue';
import VueRouter from 'vue-router';

import 'components/TheArtistRoot';
import NewPasswordResetPage from 'components/auth/passwordResets/NewPasswordResetPage';
import CompletePasswordResetPage from 'components/auth/passwordResets/CompletePasswordResetPage';
import VerifyEmailPage from 'components/auth/VerifyEmailPage';
import CommissionsIndexPage from 'components/CommissionsIndexPage';
import CommissionsDetailsPage from 'components/CommissionsDetailsPage';
import FormsIndexPage from 'components/FormsIndexPage';
import FormsDetailsPage from 'components/FormsDetailsPage';
import NotFoundPage from 'components/NotFoundPage';
import SettingsPage from 'components/SettingsPage/SettingsPage';

Vue.use(VueRouter);

const AppRouter = new VueRouter({
  mode: 'history',
  base: '/app/',
  routes: [
    // { path: '/create', component: CreateAccountPage, beforeEnter: ensureAnonymous },
    {
      path: '/passwordResets/new',
      component: NewPasswordResetPage
    },
    {
      path: '/passwordResets/complete',
      component: CompletePasswordResetPage
    },
    {
      path: '/users/me/emailPreferences/verify',
      component: VerifyEmailPage
    },
    {
      path: '/',
      component: null,
      beforeEnter: function () {
        return AppRouter.replace('/commissions');
      }
    },
    {
      path: '/commissions',
      component: CommissionsIndexPage
    },
    {
      path: '/commissions/:id',
      component: CommissionsDetailsPage
    },
    {
      path: '/forms/:id',
      component: FormsDetailsPage
    },
    {
      path: '/forms',
      component: FormsIndexPage
    },
    {
      path: '/settings',
      component: SettingsPage
    },
    { path: '*', component: NotFoundPage }
  ]
});

export default AppRouter;
