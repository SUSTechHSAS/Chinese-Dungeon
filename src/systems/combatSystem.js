import { gameState } from '../core/gameState.js';
export class CombatSystem {
  calculateDamage(attacker, defender, weapon = null) {
    let base = attacker.攻击力 || 5;
    if (weapon) base += weapon.攻击力 || 0;
    const def = defender.防御力 || 0;
    return Math.max(1, base - def);
  }
  attack(attacker, defender) {
    const dmg = this.calculateDamage(attacker, defender);
    defender.当前生命值 -= dmg;
    return dmg;
  }
}
export const combatSystem = new CombatSystem();
