import { gameState } from '../core/gameState.js';
export class HUD {
  constructor() { this.element = document.querySelector('.hud'); }
  show() { this.element?.classList.add('可见'); }
  hide() { this.element?.classList.remove('可见'); }
  update() {
    const player = gameState.玩家属性;
    const hpBar = document.querySelector('.health-bar');
    const mpBar = document.querySelector('.power-bar');
    if (hpBar) hpBar.style.width = `${Math.max(0, Math.min(100, player.当前生命值))}%`;
    if (mpBar) mpBar.style.width = `${Math.max(0, Math.min(100, player.当前能量值))}%`;
  }
}
