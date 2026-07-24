/**
 * Legacy bridge - loads and wraps original monolithic game logic
 * This file exists to allow incremental migration:
 * - In Phase 1, it imports the full legacy bundle as side-effect
 * - In Phase 2, individual modules replace legacy functions
 * - Eventually legacy bundle can be removed
 */

import { gameState } from '../core/gameState.js';
import { configManager } from '../core/config.js';

/**
 * Lazy loader for legacy game
 * The original game is ~62k lines, we keep it as legacy/bundle.js
 * which is generated from ChineseDungeon.html extraction
 */
let legacyLoaded = false;

export async function initLegacy(deps) {
  console.log('[Legacy Bridge] Initializing...');

  // Expose deps to window for legacy code (mimics old globals)
  if (typeof window !== 'undefined') {
    window.gameState = gameState;
    window.configManager = configManager;
    window.legacyDeps = deps;
  }

  // Try to load legacy bundle if exists
  try {
    // This will be the extracted original JS wrapped as module
    // If not present, we stay in modern mode
    const legacy = await import('./bundle.js').catch(() => null);
    if (legacy) {
      console.log('[Legacy Bridge] Loaded legacy bundle');
      legacyLoaded = true;
      if (legacy.initLegacyGame) {
        legacy.initLegacyGame(deps);
      }
    }
  } catch (e) {
    console.warn('[Legacy Bridge] No legacy bundle, modern mode only', e);
  }

  return legacyLoaded;
}

export function startGame(seed, isCustom) {
  if (legacyLoaded && window.启动游戏) {
    window.启动游戏(null, false, seed, '战士');
  } else {
    console.log('[Legacy Bridge] startGame fallback - seed:', seed);
    // Modern fallback will be handled by app.js
  }
}

// Export flags
export const isLegacyLoaded = () => legacyLoaded;

// For backward compat, re-export common legacy globals if they exist
export function getLegacyGlobal(name) {
  return typeof window !== 'undefined' ? window[name] : undefined;
}
