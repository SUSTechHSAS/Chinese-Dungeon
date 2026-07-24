import { Item } from '../base/item.js';
export class Potion extends Item {
  constructor(config = {}) { super(config); this.类型 = "药水"; }
}
export const 药水类 = Potion;
export class Scroll extends Item {
  constructor(config = {}) { super(config); this.类型 = "卷轴"; }
}
export const 卷轴类 = Scroll;
