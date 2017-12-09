<template lang="pug">
  auth-layout
    .login-page
      .content-center
        .card
          .card-body
            h4 {{ $t('forgot-password.new.title') }}
            p {{ $t('forgot-password.new.header') }}
            v-error-list(
              prefix='forgot-password.new.errors'
              :resource='this.passwordReset'
            )
            form(action='/api/passwordResets', method='POST', @submit='onSubmit')
              .form-group
                .input-group
                  span.input-group-addon
                    i.fa.fa-envelope-o
                  input.transparent.round.input-lg.form-control(
                    v-model='email'
                    type='text'
                    autocomplete='off'
                    name='email'
                    required=true
                    :placeholder='$t("placeholders.email")'
                    :disabled='shouldDisableForm'
                  )
              .form-group
                .input-group
                  button.btn.btn-primary.btn-round.btn-lg.btn-block(
                    type='submit'
                    :disabled='shouldDisableForm'
                  ) {{ $t('forgot-password.new.send-email') }}
              v-link.btn.btn-link(
                to='/'
                :disabled='shouldDisableForm'
              ) {{ $t('forgot-password.back-to-login') }}
</template>

<script>
import AuthLayout from 'components/auth/AuthLayout';
import VErrorList from 'components/controls/VErrorList';
import VLink from 'components/controls/VLink';
import { mapState } from 'vuex';
import { isLoaded, isMutating } from 'state/Resource';

export default {
  name: 'new-password-reset',
  components: {
    'auth-layout': AuthLayout,
    'v-error-list': VErrorList,
    'v-link': VLink
  },
  data: function () {
    return {
      email: null
    };
  },
  computed: {
    ...mapState([ 'passwordReset' ]),
    shouldDisableForm: function () {
      return isMutating(this.passwordReset);
    }
  },
  updated: function () {
    if (isLoaded(this.passwordReset)) {
      this.$router.push('/passwordResets/complete');
    }
  },
  methods: {
    onSubmit: function (e) {
      e.preventDefault();

      this.$store.dispatch('createPasswordReset', {
        email: this.email
      });
    }
  }
};
</script>

<style lang="scss">
</style>
