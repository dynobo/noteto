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

  addGlobal(options) {
    Object.entries(options).forEach(([optName, optValues]) => {
      if ((optName in this) || optValues.group === 'Block') {
        return;
      }
      this[optName] = JSON.parse(JSON.stringify(optValues));
    });
  }

  delete(opt) {
    if (Array.isArray(opt)) {
      opt.forEach((o) => {
        delete this[o];
      });
    } else {
      delete this[opt];
    }
  }

  set(attr, value) {
    this[attr].value = value;
  }

  setGlobal(attr, value) {
    if ((this.useGlobal.value === true) && (attr in this)) {
      this[attr].value = value;
    }
  }

  inherit(options) {
    if (this.useGlobal === false) {
      return;
    }
    Object.entries(options).forEach(([optName, optValues]) => {
      this[optName] = JSON.parse(JSON.stringify(optValues));
    });
  }
}

export default Options;
