import { Monster } from '../base/monster.js';
export class IceMonster extends Monster {
  constructor(config = {}) { super({ ...config, 名称: '冰冻怪物', 图标: '🧊' }); }
}
export class TeleportMonster extends Monster {
  constructor(config = {}) { super({ ...config, 名称: '瞬移怪物', 图标: '👻' }); }
}
