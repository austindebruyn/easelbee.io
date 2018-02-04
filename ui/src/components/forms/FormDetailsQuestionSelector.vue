<template lang="pug">
  .form-details-question-selector
    button.bubble(
      v-for='bubble in bubbles'
      :key='bubble.number'
      :class='{ selected: bubble.selected }'
      @click='handleClick(bubble.number)'
    ) {{ bubble.number }}
</template>

<script>
export default {
  name: 'form-details-question-selector',
  props: {
    current: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  computed: {
    bubbles: function () {
      const list = [];
      for (let i = 1; i <= this.total; i++) {
        list.push({
          number: i,
          selected: i === this.current
        });
      }
      return list;
    }
  },
  methods: {
    handleClick: function (number) {
      this.$emit('click', number);
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .form-details-question-selector {
    display: flex;
    padding-bottom: 20px;

    .bubble {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;

      border: none;
      cursor: pointer;

      background-color: $blue;

      display: flex;
      justify-content: center;
      align-items: center;

      font-size: 1.8rem;
      color: white;

      &.selected {
        font-weight: bold;
        background-color: $blue-dark;
      }
    }
  }
</style>
