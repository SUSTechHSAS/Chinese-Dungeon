function deepClone(target) {
  // 缓存已拷贝对象，防止循环引用导致栈溢出
  const map = new Map();
  /**
   * 递归克隆函数
   * @param {any} _value - 当前处理的值
   * @returns {any} 拷贝后的值
   */
  function clone(_value) {
    // 如果是已经处理过的对象，直接返回缓存结果（防止循环引用）
    if (map.has(_value)) return map.get(_value);

    // 原始类型（number、string、boolean、null、undefined、symbol）直接返回
    if (!isObject(_value)) return _value;

    // 函数类型不做处理，直接返回引用本身
    if (typeof _value === 'function') {
      map.set(_value, _value);
      return _value;
    }

    let result;

    // Date 类型
    if (_value instanceof Date) {
      result = new Date(_value);
      map.set(_value, result);
      return result;
    }

    // Map 类型
    if (_value instanceof Map) {
      result = new Map();
      map.set(_value, result);
      _value.forEach((val, key) => {
        result.set(key, clone(val));
      });
      return result;
    }

    // Set 类型
    if (_value instanceof Set) {
      result = new Set();
      map.set(_value, result);
      _value.forEach((item) => {
        result.add(clone(item));
      });
      return result;
    }

    // 普通对象或数组
    result = Array.isArray(_value) ? [] : {};
    map.set(_value, result);

    // 递归处理对象自身的可枚举属性（不包括原型链上的）
    for (const key in _value) {
      if (Object.hasOwn(_value, key)) {
        result[key] = clone(_value[key]);
      }
    }

    return result;
  }

  return clone(target);
}

