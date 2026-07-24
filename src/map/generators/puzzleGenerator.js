export class PuzzleGenerator {
  constructor(prng) { this.prng = prng; }
  generatePushBox(width, height, boxCount) {
    console.log('[Puzzle] generate', width, height);
    return { success: true, boxes: [] };
  }
}
