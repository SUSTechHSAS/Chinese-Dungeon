/**
 * Game configuration and settings management
 */

import { MapSizeDefaults, CameraDefaults, InventoryDefaults, DungeonGenType, TrapDensity } from './constants.js';

export const DefaultGameSettings = Object.freeze({
  方向键大小: 13,
  显示方向键: true,
  手机模式: false,
  移动速度: 100,
  相机视野大小: CameraDefaults.DEFAULT,
  小地图大小: 150,
  显示伤害文本: true,
  禁用点击移动: false,
  动画模式: false,
  文本模式: false,
  受伤时击退: false,
  命令行模式: false,
  画面增强: true,
  物品光晕: true,
  开启音效: true,
  自动移动可打断: true,
  emoji风格: 'local',
  emojiCDN是否可用: true,
  热键绑定: {
    '装备槽1': '1',
    '装备槽2': '2',
    '装备槽3': '3',
    '装备槽4': '4',
    '装备槽5': '5',
    '装备槽6': '6',
    '装备槽7': '7',
    '切换HUD': 'h',
    '背包': 'b',
    '日志': 'l',
    '互动': 'e',
    '导出存档': 'o',
    '传送菜单': 't',
    '装备页上一页': 'q',
    '装备页下一页': 'w',
    '自杀': 'k',
    '重置关卡': 'r',
    '配方书': 'p',
  }
});

export const CustomGameSettingsDefaults = Object.freeze({
  开启怪物等级: false,
  开启药水增益怪物: true,
  开启巡逻怪物: true,
  开启红蓝砖块谜题: true,
  开启Boss战: true,
  天气系统: "三层一次",
  陷阱密度: TrapDensity.NORMAL,
  开启升级奖励: true,
  物品掉落率: 1.0,
  地牢初始大小: MapSizeDefaults.DEFAULT,
  初始房间数量: 15,
  洞穴开阔度: 55,
  剔除死胡同: 0.2,
  禁用传送菜单: false,
  极限模式: false,
  洞穴随机重生: true,
  怪物强度系数: 1.0,
});

export const CustomGlobalSettingsDefaults = Object.freeze({
  初始能量值: 100,
  初始生命值: 100,
});

export class ConfigManager {
  constructor(storageKey = 'ChineseDungeonSettings') {
    this.storageKey = storageKey;
    this.settings = this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return this.mergeDefaults(DefaultGameSettings, parsed);
      }
    } catch (e) {
      console.warn('[Config] Failed to load settings:', e);
      localStorage.removeItem(this.storageKey);
    }
    return structuredClone(DefaultGameSettings);
  }

  mergeDefaults(defaults, overrides) {
    const result = structuredClone(defaults);
    for (const key in overrides) {
      if (key in result) {
        if (typeof result[key] === 'object' && !Array.isArray(result[key]) && result[key] !== null) {
          Object.assign(result[key], overrides[key]);
        } else {
          result[key] = overrides[key];
        }
      }
    }
    return result;
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    } catch (e) {
      console.error('[Config] Failed to save:', e);
    }
  }

  get(key) {
    return this.settings[key];
  }

  set(key, value) {
    this.settings[key] = value;
    this.save();
  }

  reset() {
    this.settings = structuredClone(DefaultGameSettings);
    this.save();
  }

  getAll() {
    return this.settings;
  }
}

export const configManager = new ConfigManager();
