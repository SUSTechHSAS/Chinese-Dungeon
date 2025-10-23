(function (root) {
  const CD = root.CD || (root.CD = {});
  function expose(name, getterOrFn) {
    try {
      if (typeof getterOrFn === 'function') {
        Object.defineProperty(root, name, { value: (...args) => getterOrFn.apply(CD, args), configurable: true });
      } else {
        Object.defineProperty(root, name, { get: () => getterOrFn, configurable: true });
      }
    } catch (_) { /* ignore define errors */ }
  }
  // Example mappings (fill as modules migrate to CD.*):
  // if (CD.ui?.log?.toggle) expose('切换日志显示', CD.ui.log.toggle);
  // if (CD.items?.pool?.create) expose('创建物品池', CD.items.pool.create);
  // if (CD.ui?.settings?.open) expose('打开设置窗口', CD.ui.settings.open);
  // if (CD.recipes?.openBook) expose('打开配方书', CD.recipes.openBook);
  // if (CD.workshop?.init) expose('初始化创意工坊', CD.workshop.init);
})(window);
