<template lang="pug">
  auth-layout
    .login-page
      .content-center
        .card.card-login.card-plain
          .card-body
            p {{ $t('forgot-password.complete.header') }}
            v-error-list(
              prefix='forgot-password.complete.errors'
              :resource='this.completePasswordReset'
            )
            form(
              action='/api/passwordResets/complete'
              method='POST'
              @submit='onSubmit'
            )
              .form-group
                .input-group
                  span.input-group-addon
                    i.fa.fa-key
                  input.transparent.round.input-lg.form-control(
                    v-model='code'
                    type='text'
                    autocomplete='off'
                    name='code'
                    required=true
                    :placeholder='$t("forgot-password.complete.code-placeholder")'
                    :disabled='shouldDisableForm'
                  )
              .form-group
                .input-group
                  span.input-group-addon
                    i.fa.fa-lock
                  input.transparent.round.input-lg.form-control(
                    v-model='password'
                    type='password'
                    autocomplete='off'
                    name='password'
                    required=true
                    :placeholder='$t("placeholders.new-password")'
                    :disabled='shouldDisableForm'
                  )
              .form-group
                .input-group
                  span.input-group-addon
                    i.fa.fa-lock
                  input.transparent.round.input-lg.form-control(
                    v-model='password2'
                    type='password'
                    autocomplete='off'
                    name='password2'
                    required=true
                    :placeholder='$t("placeholders.confirm-new-password")'
                    :disabled='shouldDisableForm'
                  )
              .form-group
                .input-group
                  button.btn.btn-primary.btn-round.btn-lg.btn-block(
                    type='submit'
                    :disabled="shouldDisableForm"
                  ) {{ $t('forgot-password.complete.submit') }}
              v-link.btn.btn-link(
                to='/passwordResets/new'
                :disabled='shouldDisableForm'
              ) {{ $t('forgot-password.complete.send-email-again') }}
              v-link.btn.btn-link(
                to='/'
                :disabled='shouldDisableForm'
              ) {{ $t('forgot-password.back-to-login') }}
</template>

<script>
  import Vue from 'vue';
  import axios from 'axios';
  import errors from 'i18n/errors';
  import AuthLayout from 'components/auth/AuthLayout';
  import VErrorList from 'components/controls/VErrorList';
  import VLink from 'components/controls/VLink';
  import { mapState } from 'vuex';
  import { isLoaded, isMutating } from 'state/Resource';

  export default {
    name: 'complete-password-reset-page',
    components: {
      'auth-layout': AuthLayout,
      'v-error-list': VErrorList,
      'v-link': VLink
    },
    data: function () {
      return {
        code: null,
        password: null,
        password2: null
      };
    },
    computed: {
      ...mapState([ 'completePasswordReset' ]),
      shouldDisableForm: function () {
        return isMutating(this.completePasswordReset);
      }
    },
    mounted: function () {
      if (this.$route && this.$route.query.code != null) {
        this.code = this.$route.query.code;
      }
    },
    updated: function () {
      if (isLoaded(this.completePasswordReset)) {
        this.$router.push('/home');
      }
    },
    methods: {
      onSubmit: function (e) {
        e.preventDefault();

        this.$store.dispatch('completePasswordReset', {
          code: this.code,
          password: this.password,
          password2: this.password2
        });
      }
    }
  };
</script>

<style lang="scss">
</style>
