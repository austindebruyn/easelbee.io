export default function (array) {
  return function (value) {
    return array.indexOf(value) > -1;
  };
};
