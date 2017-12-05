export const STATUS = {
  UNLOADED: 0,
  LOADED: 1,
  MUTATING: 2,
  ERRORED: 3
};

export default class Resource {
  constructor(opts) {
    this.status = STATUS.UNLOADED;
    this.value = null;
    this.errors = null;
    Object.assign(this, opts);
  }
}

export function isUnloaded(resource) {
  return resource.status === STATUS.UNLOADED;
}

export function isLoaded(resource) {
  return resource.status === STATUS.LOADED;
}

export function isMutating(resource) {
  return resource.status === STATUS.MUTATING;
}

export function isErrored(resource) {
  return resource.status === STATUS.ERRORED;
}
