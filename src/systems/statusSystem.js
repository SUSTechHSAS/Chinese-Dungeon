export class StatusEffect {
  constructor(type, color, icon, duration, remaining, source, target, strength = 1) {
    this.类型 = type;
    this.颜色 = color;
    this.图标 = icon;
    this.持续时间 = duration;
    this.剩余回合 = remaining;
    this.来源 = source;
    this.目标 = target;
    this.强度 = strength;
  }
}
export class StatusSystem {
  constructor() { this.effects = new Map(); }
  add(target, effect) { /* ... */ }
  remove(target, type) { /* ... */ }
  tick() { /* ... */ }
}
