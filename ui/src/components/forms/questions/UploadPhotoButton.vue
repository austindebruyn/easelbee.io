<template lang="pug">
  button.button-icon.upload-photo-button(
    @click='handleClick'
  )
    i.fa.fa-camera
</template>

<script>
export default {
  name: 'upload-photo-button',
  methods: {
    handleClick: function () {
      this.$emit('submit', { bitch: 2 });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .button-icon {
    cursor: pointer;
    border: none;
    background: none;
  }

  .upload-photo-button {
    color: $blue-dark;
  }
</style>
