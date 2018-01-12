<template lang="pug">
  auth-layout
    .login-page
      .content-center
        .card.card-login.card-plain
          .header.header-primary.text-center
            h1 Login
          form(action='/api/users', method='POST', @submit="onSubmit")
            .form-group
              .input-group
                span.input-group-addon
                  i.fa.fa-user-o
                input.transparent.round.input-lg.form-control(
                  v-model='displayName'
                  type='text'
                  autocomplete='off'
                  name='displayName'
                  placeholder='Display Name'
                  :disabled='shouldDisableForm'
                )
              .input-group
                span.input-group-addon
                  i.fa.fa-envelope-o
                input.transparent.round.input-lg.form-control(
                  v-model='email'
                  type='text'
                  autocomplete='off'
                  name='email'
                  placeholder='Email'
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
              .input-group
                span.input-group-addon
                  i.fa.fa-lock
                input.transparent.round.input-lg.form-control(
                  v-model='password2'
                  type='password'
                  autocomplete='off'
                  name='password2'
                  placeholder='Confirm'
                  :disabled='shouldDisableForm'
                )
            .form-group
              .input-group
                button.btn.btn-primary.btn-round.btn-lg.btn-block(
                  type='submit'
                  :disabled='shouldDisableForm'
                ) Get Started
            router-link.btn.btn-link(to='/') Login to an existing account
</template>

<script>
import { mapState } from 'vuex';
import { isLoaded, isMutating } from 'state/Resource';
import AuthLayout from 'components/auth/AuthLayout';

export default {
  name: 'create-account-page',
  components: {
    'auth-layout': AuthLayout
  },
  data: function () {
    return {
      displayName: null,
      email: null,
      password: null,
      password2: null
    };
  },
  computed: {
    ...mapState(['user']),
    shouldDisableForm: function () {
      return isMutating(this.user);
    }
  },
  updated: function () {
    if (isLoaded(this.user) && this.user.value) {
      this.$router.push('/commissions');
    }
  },
  methods: {
    onSubmit: function (e) {
      e.preventDefault();

      this.$store.dispatch('createUser', {
        displayName: e.target.displayName.value,
        email: e.target.email.value,
        password: e.target.password.value,
        password2: e.target.password2.value
      });
    }
  }
};
</script>

<style lang="scss">
</style>
