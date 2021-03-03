// Global options shared among all blocks
class Options {
  constructor(options, scope) {
    this.opts = options;
    this.scope = scope;
  }

  get(attr) {
    const opt = this.opts[attr];
    if (opt.type === 'number') {
      return parseInt(opt.value, 10);
    }
    return opt.value;
  }
}

export default Options;
