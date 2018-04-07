<template lang="pug">
  .upload-photo-button
    button.button-icon.upload-photo-button(
      @click='handleClick'
    )
      i.fa.fa-camera
    input(
      @change='handleChange'
      ref='input'
      type='file'
      name='file'
      hidden=true
    )
</template>

<script>
export default {
  name: 'upload-photo-button',
  methods: {
    handleClick: function () {
      this.$refs.input.click();
      // this.$emit('submit', { bitch: 2 });
    },
    handleChange: function (e) {
      const { files } = e.currentTarget;

      if (files.length > 0) {
        this.$emit('submit', files[0]);
      }
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
