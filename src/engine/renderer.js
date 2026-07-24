/**
 * Renderer - handles dungeon drawing and effects
 */

import { TileType } from '../core/constants.js';
import { gameState } from '../core/gameState.js';
import { getIconChar } from '../utils/icon.js';

export class Renderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.cellSize = 30;
    this.viewportX = 0;
    this.viewportY = 0;
    this.cameraSize = 15;
    this.effectsContainer = document.getElementById('effectsContainer');
    this.animationFrameId = null;
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const size = Math.min(window.innerWidth - 20, window.innerHeight - 20);
    this.canvas.width = size;
    this.canvas.height = size;
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;
  }

  updateViewport(forceCenter = false) {
    const player = gameState.玩家;
    if (!player) return;
    const half = Math.floor(this.cameraSize / 2);
    this.viewportX = player.x - half;
    this.viewportY = player.y - half;
    if (forceCenter) {
      // center logic
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw() {
    this.clear();
    const dungeon = gameState.地牢;
    if (!dungeon || dungeon.length === 0) return;

    const startX = Math.max(0, this.viewportX);
    const endX = Math.min(dungeon[0].length, this.viewportX + this.cameraSize);
    const startY = Math.max(0, this.viewportY);
    const endY = Math.min(dungeon.length, this.viewportY + this.cameraSize);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const cell = dungeon[y][x];
        if (!cell) continue;
        const screenX = (x - this.viewportX) * this.cellSize;
        const screenY = (y - this.viewportY) * this.cellSize;
        this.drawCell(cell, screenX, screenY);
      }
    }

    // Draw player
    const player = gameState.玩家;
    if (player) {
      const px = (player.x - this.viewportX) * this.cellSize;
      const py = (player.y - this.viewportY) * this.cellSize;
      this.ctx.fillStyle = '#4caf50';
      this.ctx.fillRect(px, py, this.cellSize, this.cellSize);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = `${this.cellSize * 0.8}px sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText('🧙', px + this.cellSize / 2, py + this.cellSize / 2 + 5);
    }
  }

  drawCell(cell, sx, sy) {
    const { 背景类型, 关联物品, 关联怪物 } = cell;

    // Background
    let bg = '#1a1a1a';
    switch (背景类型) {
      case TileType.ROOM: bg = '#2a2a2a'; break;
      case TileType.CORRIDOR: bg = '#1e1e1e'; break;
      case TileType.DOOR: bg = '#8b4513'; break;
      case TileType.LOCKED_DOOR: bg = '#FFD700'; break;
      case TileType.WALL: bg = '#0a0a0a'; break;
    }
    this.ctx.fillStyle = bg;
    this.ctx.fillRect(sx, sy, this.cellSize, this.cellSize);

    // Wall borders
    if (cell.墙壁) {
      this.ctx.strokeStyle = '#333';
      this.ctx.lineWidth = 1;
      if (cell.墙壁.上) {
        this.ctx.beginPath();
        this.ctx.moveTo(sx, sy);
        this.ctx.lineTo(sx + this.cellSize, sy);
        this.ctx.stroke();
      }
      if (cell.墙壁.下) {
        this.ctx.beginPath();
        this.ctx.moveTo(sx, sy + this.cellSize);
        this.ctx.lineTo(sx + this.cellSize, sy + this.cellSize);
        this.ctx.stroke();
      }
      if (cell.墙壁.左) {
        this.ctx.beginPath();
        this.ctx.moveTo(sx, sy);
        this.ctx.lineTo(sx, sy + this.cellSize);
        this.ctx.stroke();
      }
      if (cell.墙壁.右) {
        this.ctx.beginPath();
        this.ctx.moveTo(sx + this.cellSize, sy);
        this.ctx.lineTo(sx + this.cellSize, sy + this.cellSize);
        this.ctx.stroke();
      }
    }

    // Item
    if (关联物品 && !关联物品.是否隐藏) {
      const icon = 关联物品.显示图标 || 关联物品.图标 || '?';
      this.ctx.font = `${this.cellSize * 0.7}px "color-emoji"`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(icon, sx + this.cellSize / 2, sy + this.cellSize / 2);
    }

    // Monster
    if (关联怪物) {
      const icon = 关联怪物.图标 || 'M';
      this.ctx.font = `${this.cellSize * 0.7}px "color-emoji"`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(icon, sx + this.cellSize / 2, sy + this.cellSize / 2);
    }
  }

  showFloatingText(text, x, y, color = '#fff') {
    const div = document.createElement('div');
    div.className = '浮动文字';
    div.textContent = text;
    div.style.left = `${(x - this.viewportX) * this.cellSize}px`;
    div.style.top = `${(y - this.viewportY) * this.cellSize}px`;
    div.style.color = color;
    this.effectsContainer?.appendChild(div);
    setTimeout(() => div.remove(), 800);
  }

  triggerShake(intensity = 5) {
    this.canvas.style.transform = `translate(${Math.random() * intensity - intensity/2}px, ${Math.random() * intensity - intensity/2}px)`;
    setTimeout(() => {
      this.canvas.style.transform = '';
    }, 100);
  }
}
