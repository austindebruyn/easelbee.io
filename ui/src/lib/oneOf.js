export default function (array) {
  return {
    validator: function (value) {
      return array.indexOf(value) > -1;
    }
  };
};
