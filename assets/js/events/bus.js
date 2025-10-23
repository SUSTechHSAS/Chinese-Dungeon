(function (root) {
  const CD = root.CD || (root.CD = {});
  const listeners = {};
  function on(type, handler) {
    (listeners[type] ||= []).push(handler);
  }
  function off(type, handler) {
    const arr = listeners[type];
    if (!arr) return;
    const i = arr.indexOf(handler);
    if (i >= 0) arr.splice(i, 1);
  }
  function emit(type, payload) {
    const arr = listeners[type];
    if (!arr) return;
    arr.slice().forEach(fn => { try { fn(payload); } catch(e) { console.warn('event handler error', type, e); } });
  }
  CD.events = CD.events || { on, off, emit };
})(window);
