import { Monster } from '../base/monster.js';
export class Slime extends Monster {
  constructor(config = {}) { super({ ...config, 名称: '史莱姆', 图标: '🟢', 基础生命值: 15 }); }
}
export class Goblin extends Monster {
  constructor(config = {}) { super({ ...config, 名称: '哥布林', 图标: '👺', 基础生命值: 20 }); }
}
