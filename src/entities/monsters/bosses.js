import { Monster } from '../base/monster.js';
export class Minotaur extends Monster {
  constructor(config = {}) { super({ ...config, 名称: '米诺陶', 图标: '🐂', 基础生命值: 200 }); }
}
export class ArchMage extends Monster {
  constructor(config = {}) { super({ ...config, 名称: '大魔法师', 图标: '🧙‍♂️', 基础生命值: 300 }); }
}
