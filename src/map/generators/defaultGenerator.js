import { BaseGenerator } from './base.js';
import { TileType } from '../../core/constants.js';
export class DefaultGenerator extends BaseGenerator {
  constructor(dungeon, prng, config = {}) {
    super(dungeon, prng);
    this.roomSizeRange = config.roomSizeRange || [7, 10];
    this.maxRooms = config.maxRooms || 15;
  }
  generate() {
    // Simplified generation - real logic in legacy bridge
    console.log('[Generator] Default generation with', this.maxRooms, 'rooms');
    return true;
  }
}
