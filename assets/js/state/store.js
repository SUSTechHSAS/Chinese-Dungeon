(function (root) {
  const CD = root.CD || (root.CD = {});
  const state = CD.state = CD.state || {
    ready: false,
    data: {},
    init() {
      this.ready = true;
      return Promise.resolve();
    },
    get(key) { return this.data[key]; },
    set(key, val) { this.data[key] = val; return val; },
    patch(obj) { Object.assign(this.data, obj); return this.data; }
  };
})(window);
