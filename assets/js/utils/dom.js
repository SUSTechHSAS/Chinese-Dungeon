(function (root) {
  const CD = root.CD || (root.CD = {});
  CD.utils = CD.utils || {};
  const dom = {
    $: (sel, scope=document) => scope.querySelector(sel),
    $$: (sel, scope=document) => Array.from(scope.querySelectorAll(sel)),
    on: (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts),
    off: (el, ev, fn, opts) => el && el.removeEventListener(ev, fn, opts),
    cls: (el, name, on) => el && el.classList[on ? 'add' : 'remove'](name),
  };
  CD.utils.dom = CD.utils.dom || dom;
})(window);
