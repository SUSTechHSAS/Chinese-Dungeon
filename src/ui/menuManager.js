import { GameStates } from '../core/constants.js';
import { gameState } from '../core/gameState.js';
export class MenuManager {
  showMain() { document.getElementById('主菜单容器').style.display = 'flex'; gameState.setState(GameStates.MAIN_MENU); }
  hideMain() { const m = document.getElementById('主菜单容器'); if (m) { m.style.opacity = '0'; setTimeout(() => m.style.display = 'none', 500); } }
}
