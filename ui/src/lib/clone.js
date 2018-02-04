function recurse (source) {
  if (source === null || typeof source !== 'object') {
    return source;
  }

  if (Array.isArray(source)) {
    return source.map(recurse);
  }

  const dest = {};
  for (const k in source) {
    if (source.hasOwnProperty(k)) {
      dest[k] = recurse(source[k]);
    }
  }
  return dest;
}

export default function (obj) {
  return recurse(obj);
};
