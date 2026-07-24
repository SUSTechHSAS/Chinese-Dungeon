import { gameState } from '../core/gameState.js';
export class PetSystem {
  summon(pet) { pet.是否已放置 = true; gameState.当前出战宠物列表.push(pet); }
  dismiss(pet) { pet.是否已放置 = false; gameState.当前出战宠物列表 = gameState.当前出战宠物列表.filter(p => p !== pet); }
}
