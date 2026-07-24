/**
 * Minimap rendering
 */
import { gameState } from '../core/gameState.js';

export class Minimap {
  constructor(canvasId = '小地图') {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas?.getContext('2d');
    this.scale = 3;
  }

  draw() {
    if (!this.ctx || !this.canvas) return;
    const dungeon = gameState.地牢;
    if (!dungeon || dungeon.length === 0) return;

    const size = gameState.地牢大小;
    const displaySize = this.canvas.width || 150;
    const scale = displaySize / size;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const cell = dungeon[y]?.[x];
        if (!cell) continue;
        const roomId = gameState.房间地图[y]?.[x];
        const visited = roomId === -1 ? true : gameState.已访问房间.has(roomId);
        if (!visited) continue;

        let color = null;
        switch (cell.背景类型) {
          case 1: color = '#4caf50'; break; // room
          case 2: color = '#2b2d42'; break; // corridor
          case 4: color = '#FFD700'; break; // locked door
          default: continue;
        }
        if (color) {
          this.ctx.fillStyle = color;
          this.ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }

    // Player
    const player = gameState.玩家;
    if (player) {
      this.ctx.fillStyle = '#ff0000';
      this.ctx.beginPath();
      this.ctx.arc(player.x * scale, player.y * scale, Math.max(2, scale * 0.75), 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
}
