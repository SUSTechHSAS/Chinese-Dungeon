import { gameState } from '../core/gameState.js';
export class EquipmentSystem {
  equip(item, slot) {
    if (gameState.玩家装备.has(slot)) this.unequip(slot);
    item.装备(slot);
    gameState.玩家装备.set(slot, item);
  }
  unequip(slot) {
    const item = gameState.玩家装备.get(slot);
    if (item) { item.卸下(); gameState.玩家装备.delete(slot); }
    return item;
  }
}
