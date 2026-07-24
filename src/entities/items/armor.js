import { Item } from '../base/item.js';
export class Armor extends Item {
  constructor(config = {}) {
    super(config);
    this.类型 = "防具";
    this.防御力 = config.防御力 || 3;
    this.耐久 = config.耐久 ?? 100;
  }
}
export const 防御装备类 = Armor;
