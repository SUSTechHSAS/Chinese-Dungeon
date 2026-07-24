/**
 * Game Application - central orchestrator
 */

import { GameStates } from './core/constants.js';
import { gameState } from './core/gameState.js';
import { configManager } from './core/config.js';
import { Renderer } from './engine/renderer.js';
import { GameLoop } from './engine/loop.js';
import { InputManager } from './engine/input.js';
import { HUD } from './ui/hud.js';
import { MenuManager } from './ui/menuManager.js';
import { SettingsManager } from './ui/settingsManager.js';
import { DialogManager } from './ui/dialogManager.js';
import { InventoryUI } from './ui/inventoryUI.js';
import { globalPRNG } from './core/prng.js';

/**
 * Background particle animation - extracted from legacy monolith
 */
class BackgroundAnimator {
  constructor(canvasId = 'backgroundCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = canvasId;
      this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:10004;pointer-events:none;';
      document.body.prepend(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.count = 100;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.initParticles();
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        speed: Math.random() * 0.5 + 0.1,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'rgba(76, 175, 80, 0.8)';
    for (const p of this.particles) {
      p.y -= p.speed;
      if (p.y < 0) {
        p.y = this.canvas.height;
        p.x = Math.random() * this.canvas.width;
      }
      this.ctx.globalAlpha = p.opacity;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1.0;
    requestAnimationFrame(() => this.animate());
  }

  start() {
    this.animate();
  }
}

export class GameApp {
  constructor() {
    this.renderer = null;
    this.gameLoop = null;
    this.inputManager = null;
    this.hud = null;
    this.menuManager = null;
    this.settingsManager = null;
    this.dialogManager = null;
    this.inventoryUI = null;
    this.backgroundAnimator = null;
    this.legacyBridge = null;
  }

  async init() {
    // Setup canvas & renderer
    const canvas = document.getElementById('dungeonCanvas');
    if (!canvas) throw new Error('dungeonCanvas not found');

    const ctx = canvas.getContext('2d');
    this.renderer = new Renderer(canvas, ctx);
    this.renderer.init();
    this.renderer.updateViewport(true);

    // Core systems
    this.gameLoop = new GameLoop(this.renderer);
    this.inputManager = new InputManager(this.renderer);
    this.hud = new HUD();
    this.menuManager = new MenuManager();
    this.settingsManager = new SettingsManager();
    this.dialogManager = new DialogManager();
    this.inventoryUI = new InventoryUI();

    // Background
    this.backgroundAnimator = new BackgroundAnimator();
    this.backgroundAnimator.start();

    // Load settings
    const settings = configManager.getAll();
    console.log('[App] Loaded settings:', settings.emoji风格);

    // Bind UI events (modernized from legacy)
    this.bindUIEvents();

    // Initialize legacy bridge (loads original game logic for compatibility)
    // This allows incremental migration
    await this.initLegacyBridge();

    // Apply config effects
    this.applySettings();

    // Show main menu
    this.menuManager.showMain();
    document.body.classList.remove('初始化');

    // Start loop
    this.gameLoop.start();

    // Expose for debugging
    window.渲染器 = this.renderer;
    window.游戏应用 = this;
  }

  bindUIEvents() {
    // Settings
    const settingsBtn = document.getElementById('设置按钮_主菜单');
    const settingsBtn2 = document.getElementById('设置按钮');
    const closeSettingsBtn = document.getElementById('关闭设置窗口按钮');
    const saveSettingsBtn = document.getElementById('保存设置按钮');

    if (settingsBtn) settingsBtn.onclick = () => this.settingsManager.open();
    if (settingsBtn2) settingsBtn2.onclick = () => this.settingsManager.open();
    if (closeSettingsBtn) closeSettingsBtn.onclick = () => this.settingsManager.close();
    if (saveSettingsBtn) saveSettingsBtn.onclick = () => this.saveSettings();

    // Main menu buttons delegated to legacy if available
    const startBtn = document.getElementById('开始冒险按钮');
    const editorBtn = document.getElementById('地图编辑器按钮');
    const encyclopediaBtn = document.getElementById('图鉴按钮');
    const workshopBtn = document.getElementById('创意关卡按钮');

    // If legacy bridge handles, let it
    if (!window.启动游戏 && startBtn) {
      startBtn.onclick = () => this.startNewGame();
    }
  }

  async initLegacyBridge() {
    // Dynamic import legacy full game if we have it as module
    // For now, we check if legacy global functions exist (from original HTML)
    // In modern build, we will import src/legacy/bridge.js which re-exports legacy
    try {
      const bridge = await import('./legacy/bridge.js');
      this.legacyBridge = bridge;
      if (bridge.initLegacy) {
        await bridge.initLegacy({
          gameState,
          renderer: this.renderer,
          configManager,
          prng: globalPRNG,
        });
      }
      console.log('[App] Legacy bridge loaded');
    } catch (e) {
      console.warn('[App] No legacy bridge, running in pure modern mode', e);
    }
  }

  applySettings() {
    const s = configManager.getAll();
    document.body.classList.toggle('手机模式启用', s.手机模式);
    document.body.classList.toggle('方向键隐藏', !s.显示方向键);
    document.body.classList.toggle('命令行风格', s.命令行模式);

    // Directional btn size
    document.querySelectorAll('.directional-btn, .control-btn').forEach(btn => {
      btn.style.width = `${s.方向键大小}vmin`;
      btn.style.height = `${s.方向键大小}vmin`;
    });

    // Minimap size
    const minimapContainer = document.getElementById('小地图容器');
    const minimap = document.getElementById('小地图');
    if (minimapContainer && minimap) {
      if (s.小地图大小 > 0) {
        minimapContainer.style.display = 'block';
        minimap.style.width = `${s.小地图大小}px`;
        minimap.style.height = `${s.小地图大小}px`;
      } else {
        minimapContainer.style.display = 'none';
      }
    }
  }

  saveSettings() {
    // Collect from UI - simplified
    const sizeSlider = document.getElementById('方向键大小滑块');
    const camSlider = document.getElementById('相机视野滑块');
    const miniSlider = document.getElementById('小地图大小滑块');

    if (sizeSlider) configManager.set('方向键大小', parseInt(sizeSlider.value));
    if (camSlider) configManager.set('相机视野大小', parseInt(camSlider.value));
    if (miniSlider) configManager.set('小地图大小', parseInt(miniSlider.value));

    // toggles
    const toggles = [
      ['显示方向键切换', '显示方向键'],
      ['手机模式切换', '手机模式'],
      ['命令行风格切换', '命令行模式'],
      ['画面增强切换', '画面增强'],
      ['物品光晕切换', '物品光晕'],
    ];
    for (const [elId, key] of toggles) {
      const el = document.getElementById(elId);
      if (el) configManager.set(key, el.classList.contains('active'));
    }

    configManager.save();
    this.applySettings();
    this.settingsManager.close();
    window.显示通知?.('设置已保存', '成功');
  }

  startNewGame(seed = null, isCustom = false) {
    console.log('[App] Starting new game', { seed, isCustom });
    gameState.setState(GameStates.IN_GAME);
    if (this.legacyBridge?.startGame) {
      this.legacyBridge.startGame(seed, isCustom);
    } else {
      // Modern fallback - generate simple dungeon
      this.generateSimpleDungeon();
    }
  }

  generateSimpleDungeon() {
    const size = configManager.get('地牢初始大小') || 100;
    gameState.地牢大小 = size;
    gameState.地牢 = Array(size).fill().map((_, y) =>
      Array(size).fill().map((_, x) => {
        const cell = { x, y, 背景类型: 0, 墙壁: {}, 关联物品: null, 关联怪物: null };
        // simple room in center
        if (x > size/2 - 10 && x < size/2 + 10 && y > size/2 - 10 && y < size/2 + 10) {
          cell.背景类型 = 1; // room
        }
        return cell;
      })
    );
    gameState.玩家.x = Math.floor(size/2);
    gameState.玩家.y = Math.floor(size/2);
    this.renderer.updateViewport(true);
    this.renderer.draw();
  }
}
