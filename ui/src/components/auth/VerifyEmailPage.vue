<template lang="pug">
  .login-page
    .content-center
      .card.card-login.card-plain
        p Enter the token received in your email.
        form(
          action='/api/users/me/emailPreferences'
          ref='form'
          method='PATCH'
          @submit='on_submit'
        )
          .form-group
            input(type='hidden', name='action', value='verify')
            .input-group
              span.input-group-addon
                i.fa.fa-lock
              input.transparent.round.input-lg.form-control(
                type='text'
                autocomplete='off'
                name='verificationCode'
                v-model='verificationCode'
                placeholder='Verification code'
                :disabled='loading'
              )
          .form-group
            .input-group
              button.btn.btn-primary.btn-round.btn-lg.btn-block(
                type='submit'
                :disabled='loading'
              ) Verify
          router-link.btn.btn-link(to='/', :disabled='loading') Back to Login
</template>

<script>
  import Vue from 'vue';
  import axios from 'axios';
  import store from 'state/store';
  import errors from 'i18n/errors';
  import query_string from 'query-string';
  import { mapState } from 'vuex';

  export default {
    name: 'verify-email-page',
    data: function () {
      return {
        loading: false,
        verificationCode: null
      };
    },
    computed: mapState(['user']),
    beforeRouteLeave: function (to, from, next) {
      return next(!this.loading);
    },
    mounted: function () {
      if (this.$route && (this.$route.query.verificationCode != null)) {
        this.verificationCode = this.$route.query.verificationCode;
      }
      if (this.verificationCode) {
        this.submit();
      }
    },
    methods: {
      on_submit: function (e) {
        e.preventDefault();
        return this.submit();
      },
      submit: function () {
        this.loading = true;

        return axios.patch(this.$refs.form.getAttribute('action'), {
          action: 'verify',
          verificationCode: this.verificationCode
        }, {
          credentials: 'same-origin',
          headers: {
            'Action': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(({ data }) => {
          this.loading = false;
          if (this.user) {
            this.$router.push('/home');
          }
          else {
            this.$router.push('/');
          }
        })
        .catch(({ data }) => {
          if (data.errors && data.errors.length) {
            data.errors.forEach(function (error) {
              console.error(errors[error.code])
            });
          }
          else {
            console.error('Something went wrong!');
          }
        });
      }
    }
  };
</script>

<style lang="scss">
</style>
