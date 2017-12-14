<template lang="pug">
  li.card.commission-card
    .thumbnail
    .content
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
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .commission-card {
    margin: 20px;
    width: 250px;

    .thumbnail {
      height: 160px;
      background-color: #ade;
    }

    .content {
      padding: 20px;
    }
  }
</style>
