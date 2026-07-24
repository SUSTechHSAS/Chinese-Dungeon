import { configManager } from '../core/config.js';
export class SettingsManager {
  open() { document.getElementById('设置窗口遮罩').style.display = 'flex'; document.getElementById('设置窗口遮罩').classList.add('显示'); }
  close() { const s = document.getElementById('设置窗口遮罩'); s.classList.remove('显示'); setTimeout(() => s.style.display = 'none', 300); }
  save() { configManager.save(); }
}
