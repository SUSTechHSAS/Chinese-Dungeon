/**
 * Base Pet class
 */
import { Monster } from './monster.js';

export class Pet extends Monster {
  constructor(config = {}) {
    super(config);
    this.类型 = "宠物";
    this.是否已放置 = config.是否已放置 ?? false;
    this.等级 = config.等级 ?? 1;
    this.经验值 = config.经验值 ?? 0;
    this.所需经验 = config.所需经验 ?? 100;
    this.自定义数据.set("装备", config.装备 || {});
  }

  获得经验(amount) {
    this.经验值 += amount;
    if (this.经验值 >= this.所需经验) {
      this.升级();
    }
  }

  升级() {
    this.等级++;
    this.经验值 = 0;
    this.所需经验 = Math.floor(this.所需经验 * 1.5);
    this.基础生命值 += 5;
    this.当前生命值 = this.基础生命值;
    console.log(`宠物 ${this.名称} 升级到 ${this.等级}`);
  }

  瞬移到玩家身旁() {
    const player = window.玩家;
    if (!player) return;
    // find adjacent free cell
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = player.x + dx;
        const ny = player.y + dy;
        const dungeon = window.地牢 || [];
        const cell = dungeon[ny]?.[nx];
        if (cell && !cell.关联怪物 && !cell.关联物品) {
          this.x = nx;
          this.y = ny;
          return;
        }
      }
    }
  }
}

export const 宠物 = Pet;
