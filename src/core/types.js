import { Cell } from '../map/cell.js';
export { Cell };
export class Door {
  constructor(config) {
    this.id = Symbol();
    this.roomId = config.关联房间ID;
    this.pos = config.位置;
    this.isLocked = false;
  }
}
export const 门 = Door;
