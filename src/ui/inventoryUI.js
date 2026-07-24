import { gameState } from '../core/gameState.js';
import { getIconHTML } from '../utils/icon.js';
export class InventoryUI {
  constructor() { this.container = document.getElementById('背包物品栏'); }
  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    for (const item of gameState.玩家背包.values()) {
      const el = document.createElement('div');
      el.className = '物品条目';
      el.innerHTML = `<div class="物品图标">${getIconHTML(item.显示图标 || item.图标)}</div><div class="物品名称">${item.获取名称()}</div>`;
      this.container.appendChild(el);
    }
  }
}
