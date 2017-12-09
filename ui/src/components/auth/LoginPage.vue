<template lang="pug">
  auth-layout
    .login-page
      .content-center
        .card.card-login.card-plain
          .header.header-primary.text-center
            h1 easelbee.io
          form(action='/login', method='POST', @submit='onSubmit')
            .form-group
              .input-group
                span.input-group-addon
                  i.fa.fa-user-o
                input.transparent.round.input-lg.form-control(
                  v-model='username'
                  type='text'
                  autocomplete='off'
                  name='username'
                  placeholder='Username'
                  :disabled='shouldDisableForm'
                )
              .input-group
                span.input-group-addon
                  i.fa.fa-lock
                input.transparent.round.input-lg.form-control(
                  v-model='password'
                  type='password'
                  autocomplete='off'
                  name='password'
                  placeholder='Password'
                  :disabled='shouldDisableForm'
                )
            .form-group
              button.btn.btn-primary.btn-round.btn-lg.btn-block(
                type='submit'
                :disabled='shouldDisableForm'
              ) Submit
            router-link.btn.btn-link(
              :disabled='shouldDisableForm'
              to='/create'
            ) Create an Account
            router-link.btn.btn-link(
              :disabled='shouldDisableForm'
              to='/passwordResets/new'
            ) I forgot my password
            loading-spinner(v-if='shouldDisableForm')
</template>

<script>
import { mapState } from 'vuex';
import LoadingSpinner from 'components/LoadingSpinner';
import AuthLayout from 'components/auth/AuthLayout';
import { isLoaded, isMutating } from 'state/Resource';

export default {
  name: 'login-page',
  components: {
    'auth-layout': AuthLayout,
    'loading-spinner': LoadingSpinner
  },
  data: function () {
    return {
      username: null,
      password: null
    };
  },
  computed: {
    ...mapState([ 'user' ]),
    shouldDisableForm: function () {
      return isMutating(this.user);
    }
  },
  updated: function () {
    if (isLoaded(this.user)) {
      this.$router.push('/home');
    }
  },
  methods: {
    onSubmit: function (e) {
      e.preventDefault();

      this.$store.dispatch('login', {
        username: this.username,
        password: this.password
      });
    }
  }
};
</script>

<style lang="scss">
</style>
