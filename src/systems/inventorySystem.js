import { gameState } from '../core/gameState.js';
export class InventorySystem {
  addItem(item) {
    if (gameState.玩家背包.size >= gameState.最大背包容量) return false;
    gameState.玩家背包.set(item.唯一标识, item);
    return true;
  }
  removeItem(id) { return gameState.玩家背包.delete(id); }
  hasItem(name) { for (const i of gameState.玩家背包.values()) if (i.名称 === name) return true; return false; }
}
export const inventorySystem = new InventorySystem();
