export default function (wrapper) {
  return {
    with: function (value) {
      wrapper.element.value = value;
      wrapper.trigger('input');
    }
  };
};
