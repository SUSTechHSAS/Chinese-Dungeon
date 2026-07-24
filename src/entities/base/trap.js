import { Item } from './item.js';
export class Trap extends Item {
  constructor(config = {}) {
    super(config);
    this.类型 = "陷阱";
    this.隐藏 = config.隐藏 ?? true;
    this.触发后消失 = config.触发后消失 ?? false;
  }
  触发(触发者) { console.log('Trap triggered by',触发者); }
}
export const 陷阱基类 = Trap;
