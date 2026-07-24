/**
 * Big map (full-screen dungeon map) controller
 */

import { gameState } from '../core/gameState.js';

export class BigMap {
  constructor() {
    this.canvas = document.getElementById('大地图画布');
    this.container = document.getElementById('大地图画布容器');
    this.overlay = document.getElementById('大地图遮罩');
    this.ctx = this.canvas?.getContext('2d');
    this.isDragging = false;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.setupEvents();
  }

  setupEvents() {
    const closeBtn = document.getElementById('关闭大地图按钮');
    if (closeBtn) closeBtn.onclick = () => this.close();

    const zoomIn = document.getElementById('大地图缩放放大按钮');
    const zoomOut = document.getElementById('大地图缩放缩小按钮');
    const centerBtn = document.getElementById('大地图居中按钮');

    if (zoomIn) zoomIn.onclick = () => this.zoom(1.2);
    if (zoomOut) zoomOut.onclick = () => this.zoom(0.8);
    if (centerBtn) centerBtn.onclick = () => this.center();

    if (this.container) {
      this.container.addEventListener('mousedown', e => this.startDrag(e));
      this.container.addEventListener('mousemove', e => this.drag(e));
      this.container.addEventListener('mouseup', () => this.endDrag());
      this.container.addEventListener('wheel', e => this.onWheel(e), { passive: false });
    }
  }

  open() {
    if (!this.overlay) return;
    this.overlay.classList.add('显示');
    this.draw();
  }

  close() {
    this.overlay?.classList.remove('显示');
  }

  draw() {
    if (!this.ctx || !this.canvas) return;
    const width = this.container?.clientWidth || 800;
    const height = this.container?.clientHeight || 600;
    this.canvas.width = width;
    this.canvas.height = height;

    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, width, height);

    const dungeon = gameState.地牢;
    if (!dungeon) return;

    const cellSize = 16 * this.scale;
    for (let y = 0; y < dungeon.length; y++) {
      for (let x = 0; x < dungeon[y].length; x++) {
        const cell = dungeon[y][x];
        const screenX = x * cellSize + this.offsetX;
        const screenY = y * cellSize + this.offsetY;
        if (screenX < -cellSize || screenX > width || screenY < -cellSize || screenY > height) continue;

        if (cell.背景类型 === 1) {
          this.ctx.fillStyle = '#2a2a2a';
          this.ctx.fillRect(screenX, screenY, cellSize, cellSize);
          this.ctx.strokeStyle = '#4caf50';
          this.ctx.strokeRect(screenX, screenY, cellSize, cellSize);
        } else if (cell.背景类型 === 2) {
          this.ctx.fillStyle = '#1e1e1e';
          this.ctx.fillRect(screenX, screenY, cellSize, cellSize);
        }
      }
    }

    // Player marker
    const player = gameState.玩家;
    if (player) {
      this.ctx.fillStyle = '#ff0000';
      this.ctx.beginPath();
      this.ctx.arc(player.x * cellSize + this.offsetX + cellSize/2, player.y * cellSize + this.offsetY + cellSize/2, 6, 0, Math.PI*2);
      this.ctx.fill();
    }
  }

  zoom(factor) {
    this.scale *= factor;
    this.scale = Math.max(0.2, Math.min(3, this.scale));
    this.draw();
  }

  center() {
    const player = gameState.玩家;
    if (!player || !this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.offsetX = width/2 - player.x * 16 * this.scale;
    this.offsetY = height/2 - player.y * 16 * this.scale;
    this.draw();
  }

  startDrag(e) {
    this.isDragging = true;
    this.dragStartX = e.clientX - this.offsetX;
    this.dragStartY = e.clientY - this.offsetY;
  }

  drag(e) {
    if (!this.isDragging) return;
    this.offsetX = e.clientX - this.dragStartX;
    this.offsetY = e.clientY - this.dragStartY;
    this.draw();
  }

  endDrag() {
    this.isDragging = false;
  }

  onWheel(e) {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    this.zoom(factor);
  }
}
