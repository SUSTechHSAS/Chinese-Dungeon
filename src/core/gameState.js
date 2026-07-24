/**
 * Centralized game state management
 * Replaces scattered global let variables from legacy code
 */

import { GameStates, DungeonGenType } from './constants.js';

export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.state = GameStates.INIT;
    this.地牢 = [];
    this.地牢大小 = 100;
    this.房间列表 = [];
    this.上锁房间列表 = [];
    this.门实例列表 = new Map();
    this.房间地图 = [];
    this.已访问房间 = new Set();
    this.已揭示洞穴格子 = new Set();
    this.所有怪物 = [];
    this.怪物状态表 = new WeakMap();
    this.所有计时器 = [];
    this.当前天气效果 = [];
    this.所有地牢层 = new Map();
    this.当前层数 = 0;
    this.玩家 = { x: 0, y: 0 };
    this.玩家初始位置 = { x: 0, y: 0 };
    this.玩家属性 = {
      当前生命值: 100,
      最大生命值加成: 0,
      当前能量值: 100,
      攻击加成: 0,
      防御加成: 0,
      移动步数: 1,
      允许移动: 0,
      透视: false,
      初始能量加成: 0,
    };
    this.玩家背包 = new Map();
    this.玩家装备 = new Map();
    this.玩家状态 = [];
    this.玩家仆从列表 = [];
    this.当前出战宠物列表 = [];
    this.宠物状态表 = new WeakMap();
    this.融合区物品 = [null, null, null, null];
    this.fusionGoldQuantities = [0, 0, 0, 0];
    this.所有传送门 = [];
    this.地图标记 = new Map();
    this.大地图状态 = {
      当前查看楼层: 0,
      缩放等级: 1,
      平移X: 0,
      平移Y: 0,
      标记模式: false,
      传送模式: false,
      正在拖拽: false,
      拖拽起始X: 0,
      拖拽起始Y: 0,
    };
    this.当前装备页 = 0;
    this.最大装备页 = 3;
    this.最大装备槽数量 = 24;
    this.装备栏每页装备数 = 7;
    this.最大背包容量 = 12;
    this.玩家职业 = null;
    this.游戏种子 = null;
    this.地牢生成方式 = DungeonGenType.DEFAULT;
    this.死亡界面已显示 = false;
    this.玩家总移动回合数 = 0;
    this.玩家总受到伤害 = 0;
    this.已击杀怪物数 = 0;
    this.联机模式 = false;
    this.其他玩家列表 = [];
    this.本地玩家ID = null;
    this.怪物动画状态 = new WeakMap();
    this.玩家动画状态 = { 正在动画: false };
  }

  setState(newState) {
    const old = this.state;
    this.state = newState;
    document.body.className = this.mapStateToBodyClass(newState);
    this.emit('stateChange', { from: old, to: newState });
  }

  mapStateToBodyClass(state) {
    const map = {
      [GameStates.MAIN_MENU]: '',
      [GameStates.IN_GAME]: '游戏进行中',
      [GameStates.MAP_EDITOR]: '地图编辑器模式',
      [GameStates.EDITOR_PLAY]: '编辑器游玩模式',
      [GameStates.ENCYCLOPEDIA]: '图鉴模式',
    };
    return map[state] || '游戏进行中';
  }

  // Simple event emitter
  listeners = new Map();
  on(event, fn) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(fn);
  }
  off(event, fn) {
    if (!this.listeners.has(event)) return;
    this.listeners.set(event, this.listeners.get(event).filter(f => f !== fn));
  }
  emit(event, data) {
    if (!this.listeners.has(event)) return;
    for (const fn of this.listeners.get(event)) {
      try { fn(data); } catch (e) { console.error(e); }
    }
  }

  // Serialization helpers for save/load
  serialize() {
    // To be implemented with saveSystem
    return {};
  }
}

export const gameState = new GameState();

// For backward compatibility during migration, expose as global if needed
if (typeof window !== 'undefined') {
  window.gameState = gameState;
}
