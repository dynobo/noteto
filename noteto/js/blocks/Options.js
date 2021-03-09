// Global options shared among all blocks
class Options {
  constructor(options) {
    this.add(options);
  }

  get(attr) {
    const opt = this[attr];
    if (opt.type === 'number') {
      return parseInt(opt.value, 10);
    }
    return opt.value;
  }

  add(options) {
    Object.entries(options).forEach(([optName, optValues]) => {
      if (optName in this) {
        return;
      }
      this[optName] = JSON.parse(JSON.stringify(optValues));
    });
  }

  addShared(options) {
    Object.entries(options).forEach(([optName, optValues]) => {
      if ((optName in this) || optValues.group === 'Block') {
        return;
      }
      this[optName] = JSON.parse(JSON.stringify(optValues));
    });
  }

  set(attr, value) {
    this[attr].value = value;
  }

  setShared(attr, value) {
    if ((this.useShared.value === true) && (attr in this)) {
      this[attr].value = value;
    }
  }
}

export default Options;
