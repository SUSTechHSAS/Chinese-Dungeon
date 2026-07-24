/**
 * Dungeon cell representation
 */

import { TileType } from '../core/constants.js';

export class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.类型 = TileType.WALL;
    this.背景类型 = TileType.WALL;
    this.墙壁 = { 上: false, 右: false, 下: false, 左: false };
    this.钥匙ID = null;
    this.颜色索引 = 0;
    this.关联物品 = null;
    this.关联怪物 = null;
    this.是否强制墙壁 = false;
    this.阻碍视野 = false;
    this.环境 = null;
    this.标识 = null;
    this.isOneWay = false;
    this.oneWayAllowedDirection = null;
    this.doorOrientation = null;
  }

  isWalkable(considerPlayer = true) {
    if (this.是否强制墙壁) return false;
    if (this.背景类型 === TileType.WALL) return false;
    if (this.背景类型 === TileType.LOCKED_DOOR) return false;
    if (this.关联物品 && this.关联物品.阻挡移动) return false;
    if (this.关联怪物 && !this.关联怪物.是否可穿越) return false;
    return true;
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      类型: this.类型,
      背景类型: this.背景类型,
      墙壁: this.墙壁,
      颜色索引: this.颜色索引,
      环境: this.环境,
    };
  }
}

// Backward compat
export const 单元格 = Cell;
