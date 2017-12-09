<template lang="pug">
  footer.footer
    .container
      .row
        .col-12.col-md-6
          p Made with &#6144066472; in Sunnyvale, CA
        .col-12.col-md-6.text-md-right
          p easelbee.io is an open source project.
          p
            a.link-with-icon(:href='githubUrl')
              span.fa.fa-github
              span Github
</template>

<script>
export default {
  name: 'the-footer',
  computed: {
    githubUrl: function () {
      return 'https://github.com/austindebruyn/easelbee.io';
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .footer {
    background-color: $gray-light;
    color: $gray-dark;

    padding: 20px 0;

    .link-with-icon {
      text-decoration: underline;
      color: $gray-dark;

      .fa {
        margin-right: 0.4rem;
      }

      &:hover {
        color: $gray;
      }
    }
  }
</style>
