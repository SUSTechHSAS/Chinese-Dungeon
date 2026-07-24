import { Item } from '../base/item.js';
export class Tool extends Item {
  constructor(config = {}) { super(config); this.类型 = "工具"; }
}
