import { gameState } from '../core/gameState.js';
export class GameLoop {
  constructor(renderer) {
    this.renderer = renderer;
    this.running = false;
    this.lastTime = 0;
  }
  start() {
    this.running = true;
    const tick = (time) => {
      if (!this.running) return;
      const delta = time - this.lastTime;
      this.lastTime = time;
      this.update(delta);
      this.render();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  stop() { this.running = false; }
  update(delta) {
    // game logic update placeholder
    if (window.更新界面状态) window.更新界面状态();
  }
  render() {
    this.renderer?.draw();
  }
}
