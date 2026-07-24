/**
 * Base Monster class
 */

import { MonsterState } from '../../core/constants.js';

export class Monster {
  constructor(config = {}) {
    this.类型 = config.类型 || "怪物";
    this.名称 = config.名称 || this.constructor.name;
    this.图标 = config.图标 || "M";
    this.颜色索引 = config.颜色索引 ?? 0;
    this.唯一标识 = config.唯一标识 || Symbol(Date.now().toString());
    this.x = config.x ?? 0;
    this.y = config.y ?? 0;
    this.基础生命值 = config.基础生命值 ?? 20;
    this.当前生命值 = config.当前生命值 ?? this.基础生命值;
    this.攻击力 = config.攻击力 ?? 5;
    this.防御力 = config.防御力 ?? 0;
    this.等级 = config.等级 ?? 1;
    this.强化 = config.强化 ?? false;
    this.状态 = config.状态 || MonsterState.IDLE;
    this.是否可穿越 = config.是否可穿越 ?? false;
    this.独立 = config.独立 ?? false;
    this.掉落物 = config.掉落物 ?? null;
    this.残血逃跑 = config.残血逃跑 ?? true;
    this.跟踪距离 = config.跟踪距离 ?? 8;
    this.自定义数据 = config.自定义数据 || new Map();
    this.永久增益 = config.永久增益 || [];
    this.携带药水 = config.携带药水 ?? null;
    this.随机游走 = config.随机游走 ?? false;
  }

  获取名称() {
    return this.名称;
  }

  受伤(伤害, 来源 = null) {
    const 实际伤害 = Math.max(1, 伤害 - this.防御力);
    this.当前生命值 -= 实际伤害;
    console.log(`${this.名称} 受到 ${实际伤害} 伤害`);
    if (this.当前生命值 <= 0) {
      this.死亡(来源);
    }
    return 实际伤害;
  }

  死亡(来源) {
    this.当前生命值 = 0;
    console.log(`${this.名称} 死亡`);
    // trigger death logic via gameState
  }

  移动(dx, dy, dungeon) {
    const nx = this.x + dx;
    const ny = this.y + dy;
    if (dungeon?.isPositionAvailable?.(nx, ny, false, false)) {
      this.x = nx;
      this.y = ny;
      return true;
    }
    return false;
  }

  更新(dungeon, player, distanceMap) {
    // AI logic placeholder
  }

  绘制血条(force = false) {
    // Minified: actual rendering in renderer
  }

  选择逃离目标(px, py, range = 5) {
    // simple flee away from player
    const dx = this.x - px;
    const dy = this.y - py;
    return {
      x: this.x + Math.sign(dx) * range,
      y: this.y + Math.sign(dy) * range
    };
  }
}

export const 怪物 = Monster;
