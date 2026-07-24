/**
 * Legacy bundle placeholder
 * In production build, this file would contain the refactored original game
 * extracted from ChineseDungeon.html.
 *
 * For modern development, we keep this as a lightweight bridge that re-exports
 * modern modules to match legacy API shape, so old code still works.
 *
 * The full legacy extraction is available in scripts/extract_legacy.js
 * which splits the 62k LOC file into ES modules.
 */

import { gameState } from '../core/gameState.js';

export function initLegacyGame(deps) {
  console.log('[Legacy Bundle] initLegacyGame called with deps', Object.keys(deps || {}));

  // Setup minimal legacy globals for compatibility
  if (typeof window !== 'undefined') {
    // These are accessed by some legacy UI code that may still be in HTML
    if (!window.地牢) window.地牢 = gameState.地牢;
    if (!window.玩家) window.玩家 = gameState.玩家;
    if (!window.玩家属性) window.玩家属性 = gameState.玩家属性;
    if (!window.当前层数) window.当前层数 = gameState.当前层数;

    // Stub functions that legacy UI expects
    window.更新界面状态 = window.更新界面状态 || (() => deps?.renderer?.draw?.());
    window.绘制 = window.绘制 || (() => deps?.renderer?.draw?.());
    window.更新视口 = window.更新视口 || ((force) => deps?.renderer?.updateViewport?.(force));
    window.初始化canvas = window.初始化canvas || (() => deps?.renderer?.resize?.());
    window.功能键映射 = window.功能键映射 || {};
    window.显示通知 = window.显示通知 || ((msg, type) => console.log(`[Notice ${type}] ${msg}`));
  }
}

// Re-export for module consumers
export const legacyVersion = '2.0.0-modern';
export const isModern = true;
