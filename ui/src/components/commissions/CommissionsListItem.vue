<template lang="pug">
  li
    router-link(:to='url').card.commission-card
      .card-img-top
      .card-body
        .card-text
          h4 {{ commission.email }}
          q {{ commission.body }}
</template>

<script>
export default {
  name: 'commissions-list-item',
  props: {
    commission: {
      type: Object,
      required: true
    }
  },
  computed: {
    url: function () {
      return `/commissions/${this.commission.id}`;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .commission-card {
    border: 0;
    margin: 20px;
    width: 250px;
    color: black;
    text-decoration: inherit;

    &:hover {
      box-shadow: 0 6px 30px $gray;
      top: -6px;
    }

    .card-img-top {
      height: 160px;
      background-color: #ade;
    }
  }
</style>
