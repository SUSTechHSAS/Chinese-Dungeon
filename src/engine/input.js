import { gameState } from '../core/gameState.js';
export class InputManager {
  constructor(renderer) {
    this.renderer = renderer;
    this.keys = new Set();
    this.setup();
  }
  setup() {
    window.addEventListener('keydown', e => {
      this.keys.add(e.key.toLowerCase());
      this.handleKey(e);
    });
    window.addEventListener('keyup', e => this.keys.delete(e.key.toLowerCase()));
  }
  handleKey(e) {
    // delegates to game actions via config mapping
    if (window.功能键映射 && window.功能键映射[e.key.toLowerCase()]) {
      window.功能键映射[e.key.toLowerCase()]();
    }
  }
  isPressed(key) { return this.keys.has(key.toLowerCase()); }
}
