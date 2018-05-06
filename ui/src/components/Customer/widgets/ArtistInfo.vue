<template lang="pug">
  .artist-info
    .profile-picture
      img(:src='profilePictureUrl')
    .details
      h1 {{ name }}
      .location
        .fa.fa-map-marker
        span San Francisco, CA
</template>

<script>
import ProfilePic from './profile-pic.png';
import VueTypes from 'vue-types';

export default {
  name: 'artist-info',
  props: {
    /* eslint-disable vue/require-default-prop */
    name: VueTypes.string.isRequired
  },
  computed: {
    profilePictureUrl: function () {
      return ProfilePic;
    }
  }
};
</script>

<style lang="scss">
  @import 'src/styles/colors';

  $ui-font-family: 'vocal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  $height: 108px;

  .artist-info {
    margin-bottom: 40px;
    border-radius: $height / 2;
    background: linear-gradient(45deg, rgba(79, 238, 128, 0.2), rgba(224, 237, 178, 0.2)),
      linear-gradient(142deg, transparent, rgba(178, 237, 227, 0.2)),
      linear-gradient(108deg, rgba(224, 237, 178, 0.2), transparent);

    display: flex;
    align-items: center;

    .profile-picture {
      img {
        width: 108px;
        height: 108px;
        border-radius: $height / 2;
      }
    }

    .details {
      padding: 0 20px;

      .location {
        font-family: $ui-font-family;
        font-size: 20px;

        .fa {
          margin-right: 0.75rem;
        }
      }
    }

    h1 {
      font-family: $ui-font-family;
      font-weight: normal;
      font-size: 36px;
      color: $black;
      margin: 0;
    }
  }
</style>
