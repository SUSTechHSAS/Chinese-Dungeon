/**
 * Main entry point - modern modular bootstrap
 */

import './styles/main.css';
import { GameApp } from './app.js';

// Legacy global bridges for compatibility during migration
// Expose modern modules to window for legacy code interop
import { gameState } from './core/gameState.js';
import { configManager } from './core/config.js';
import { globalPRNG } from './core/prng.js';
import { audioManager } from './engine/audio.js';
import { showNotification } from './ui/notification.js';

if (typeof window !== 'undefined') {
  window.gameState = gameState;
  window.configManager = configManager;
  window.globalPRNG = globalPRNG;
  window.audioManager = audioManager;
  window.showNotification = showNotification;
  window.显示通知 = showNotification;
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[Chinese Dungeon] Modern modular version loading... v2.0.0');

  // Load legacy game bundle if present (for full compatibility)
  // The new engine will gradually replace it
  try {
    const app = new GameApp();
    await app.init();
    window.__CHINESE_DUNGEON_APP__ = app;
    console.log('[Chinese Dungeon] App initialized');
  } catch (e) {
    console.error('[Chinese Dungeon] Failed to init app:', e);
    showNotification('游戏初始化失败: ' + e.message, '错误');
  }
});

// HMR support
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('[HMR] Hot update');
  });
}
