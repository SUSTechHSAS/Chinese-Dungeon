import { Item } from '../base/item.js';
export class Weapon extends Item {
  constructor(config = {}) {
    super(config);
    this.类型 = "武器";
    this.攻击力 = config.攻击力 || 5;
    this.耐久 = config.耐久 ?? 100;
    this.最大耐久 = config.最大耐久 || 100;
  }
}
export const 武器类 = Weapon;
// Examples
export class SteelSword extends Weapon {
  constructor(config = {}) { super({ ...config, 名称: '钢制长剑', 图标: '🗡️', 攻击力: 10 }); }
}
export class OakStaff extends Weapon {
  constructor(config = {}) { super({ ...config, 名称: '橡木法杖', 图标: '🪄', 攻击力: 8 }); }
}
