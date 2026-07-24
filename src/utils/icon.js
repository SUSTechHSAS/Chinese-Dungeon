/**
 * Icon handling - modernized from legacy getIconHTML/drawIcon
 */

import { configManager } from '../core/config.js';

const emojiImageCache = new Map();

export function getIconChar(key, iconMap) {
  if (!key) return '?';
  const map = iconMap || window.图标映射 || {};
  return map[key] || key;
}

export function getIconHTML(key, iconMap) {
  const settings = configManager.getAll();
  const isTextMode = settings.文本模式;
  const emojiStyle = settings.emoji风格;
  const cdnAvailable = settings.emojiCDN是否可用;

  let iconChar = key;
  if (iconMap) {
    iconChar = iconMap[key] || key;
  } else {
    const globalMap = settings.文本模式
      ? (window.中文对照图标映射 || {})
      : (window.图标映射 || {});
    iconChar = globalMap[key] || key;
  }

  // If text mode or local, return text
  if (isTextMode || emojiStyle === 'local' || !cdnAvailable) {
    if (iconChar.length === 1 && iconChar.charCodeAt(0) < 256) {
      return `<span class="汉字图标">${iconChar}</span>`;
    }
    return iconChar;
  }

  // Use CDN image
  if (emojiImageCache.has(iconChar)) {
    return emojiImageCache.get(iconChar);
  }

  // For simplicity, if CDN fails fallback to char
  // In real implementation would fetch image
  const isEmoji = /[\p{Emoji}]/u.test(iconChar) && iconChar.length <= 4;
  if (!isEmoji) {
    return iconChar;
  }

  const url = `https://emoji-cdn.mqrio.dev/${encodeURIComponent(iconChar)}?style=${emojiStyle}`;
  const html = `<img src="${url}" alt="${iconChar}" style="width:1em;height:1em;vertical-align:middle;" onerror="this.replaceWith(document.createTextNode('${iconChar}'))">`;
  emojiImageCache.set(iconChar, html);
  return html;
}

export function drawIcon(ctx, key, screenX, screenY, size, color, iconMap) {
  const char = getIconChar(key, iconMap);
  ctx.save();
  ctx.font = `${size}px "color-emoji", "Apple Color Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (color) ctx.fillStyle = color;
  ctx.fillText(char, screenX, screenY);
  ctx.restore();
}

export async function checkCdnAvailability() {
  try {
    const resp = await fetch('https://emoji-cdn.mqrio.dev/😀?style=apple', { method: 'HEAD' });
    return resp.ok;
  } catch {
    return false;
  }
}

export const iconCache = emojiImageCache;
