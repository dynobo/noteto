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
      this[optName] = optValues;
    });
  }
}

export default Options;
