import { BaseGenerator } from './base.js';
import { TileType } from '../../core/constants.js';
export class CaveGenerator extends BaseGenerator {
  constructor(dungeon, prng, config = {}) {
    super(dungeon, prng);
    this.wallChance = config.wallChance || 0.45;
    this.iterations = config.iterations || 5;
  }
  initMap() {
    for (let y = 0; y < this.dungeon.size; y++) {
      for (let x = 0; x < this.dungeon.size; x++) {
        if (x === 0 || y === 0 || x === this.dungeon.size - 1 || y === this.dungeon.size - 1) {
          this.dungeon.grid[y][x].背景类型 = TileType.WALL;
        } else {
          this.dungeon.grid[y][x].背景类型 = this.prng.next() < this.wallChance ? TileType.WALL : TileType.CORRIDOR;
        }
      }
    }
  }
  iterate() {
    const newGrid = this.dungeon.grid.map(row => row.map(cell => ({ ...cell })));
    // simplified cellular automata
    console.log('[CaveGen] iterate');
  }
  generate() {
    this.initMap();
    for (let i = 0; i < this.iterations; i++) this.iterate();
    return true;
  }
}
export async function 生成洞穴地牢() { /* legacy bridge */ }
