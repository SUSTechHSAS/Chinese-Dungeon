export class BaseGenerator {
  constructor(dungeon, prng) {
    this.dungeon = dungeon;
    this.prng = prng;
  }
  generate() { throw new Error('Not implemented'); }
  findEntry(avoidDir = {}) { /* placeholder */ return []; }
}
