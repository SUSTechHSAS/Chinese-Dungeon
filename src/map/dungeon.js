/**
 * Dungeon map management
 */

import { Cell } from './cell.js';
import { TileType } from '../core/constants.js';
import { PRNG, globalPRNG } from '../core/prng.js';

export class Dungeon {
  constructor(size, prng = globalPRNG) {
    this.size = size;
    this.prng = prng;
    this.grid = this.createEmptyGrid(size);
    this.roomList = [];
    this.lockedRoomList = [];
    this.roomMap = Array(size).fill().map(() => Array(size).fill(-1));
    this.doorInstances = new Map();
    this.visitedRooms = new Set();
    this.revealedCaveCells = new Set();
  }

  createEmptyGrid(size) {
    return Array(size).fill().map((_, y) =>
      Array(size).fill().map((_, x) => new Cell(x, y))
    );
  }

  getCell(x, y) {
    return this.grid[y]?.[x] || null;
  }

  isAreaFree(x, y, w, h, buffer = 2) {
    for (let i = y; i < y + h; i++) {
      for (let j = x; j < x + w; j++) {
        if (i >= this.size || j >= this.size) return false;
        if (this.grid[i][j].背景类型 !== TileType.WALL) return false;
      }
    }
    const xStart = Math.max(0, x - buffer);
    const xEnd = Math.min(this.size - 1, x + w - 1 + buffer);
    const yStart = Math.max(0, y - buffer);
    const yEnd = Math.min(this.size - 1, y + h - 1 + buffer);
    for (let yy = yStart; yy <= yEnd; yy++) {
      for (let xx = xStart; xx <= xEnd; xx++) {
        let dx = 0, dy = 0;
        if (xx < x) dx = x - xx;
        else if (xx >= x + w) dx = xx - (x + w - 1);
        if (yy < y) dy = y - yy;
        else if (yy >= y + h) dy = yy - (y + h - 1);
        const dist = dx + dy;
        if (dist <= buffer && this.grid[yy][xx].背景类型 !== TileType.WALL) return false;
      }
    }
    return true;
  }

  placeRoom(room) {
    for (let y = room.y; y < room.y + room.h; y++) {
      for (let x = room.x; x < room.x + room.w; x++) {
        const cell = this.grid[y][x];
        cell.背景类型 = TileType.ROOM;
        this.roomMap[y][x] = room.id;
        cell.墙壁 = {
          上: y === room.y,
          下: y === room.y + room.h - 1,
          左: x === room.x,
          右: x === room.x + room.w - 1
        };
      }
    }
    room.已解锁 = false;
    return true;
  }

  generateWalls() {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const cell = this.grid[y][x];
        if ([TileType.WALL, TileType.CORRIDOR, TileType.ROOM].includes(cell.背景类型)) {
          cell.墙壁 = {
            上: y > 0 && this.grid[y - 1][x].背景类型 !== cell.背景类型,
            下: y < this.size - 1 && this.grid[y + 1][x].背景类型 !== cell.背景类型,
            左: x > 0 && this.grid[y][x - 1].背景类型 !== cell.背景类型,
            右: x < this.size - 1 && this.grid[y][x + 1].背景类型 !== cell.背景类型
          };
        }
      }
    }
  }

  isPositionAvailable(x, y, considerPlayer = true, ignoreMonster = false) {
    const cell = this.getCell(x, y);
    if (!cell) return false;
    if (cell.背景类型 === TileType.WALL) return false;
    if (cell.背景类型 === TileType.LOCKED_DOOR) return false;
    if (cell.关联物品 && cell.关联物品.阻挡移动) return false;
    if (!ignoreMonster && cell.关联怪物) return false;
    if (considerPlayer) {
      const player = window.玩家 || { x: -1, y: -1 };
      if (player.x === x && player.y === y) return false;
    }
    return true;
  }
}

// Chinese aliases
export const 地牢管理器 = Dungeon;
