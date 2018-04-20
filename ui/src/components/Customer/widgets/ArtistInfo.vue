<template lang="pug">
  .artist-info
    .title
      .profile-picture
        img(:src='profilePictureUrl')
      h1 {{ name }}
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

  .artist-info {
    padding-bottom: 40px;

    .profile-picture {
      img {
        width: 80px;
      }
    }

    h1 {
      font-family: 'tensoregular';
      font-weight: normal;
      color: $blue-dark;
    }
    h2 {
      font-family: 'sinkinsans';
      font-weight: normal;
      color: $gray;
    }
  }
</style>
