# Migration from Legacy Monolith to Modern Modules

This document tracks how the original `ChineseDungeon.html` (68,746 lines) was refactored.

## Original File Breakdown

- Lines 1-4891: CSS (4885 lines)
- Lines 4893-5865: HTML body (973 lines)
- Lines 5868-68744: JavaScript (62,877 lines)

## Extraction Steps Performed

### 1. CSS Extraction (Automated via Python script)

- Parsed CSS rules by brace depth
- Classified by keywords into 15 modules:
  - `variables.css`: CSS custom properties
  - `base.css`: body, scrollbar, reset
  - `canvas.css`: #dungeonCanvas, #backgroundCanvas
  - `menu.css`: Main menu, titles, version info
  - `hud.css`: HUD bars, minimap, monster indicators
  - `controls.css`: D-pad, action buttons
  - `inventory.css`: Backpack, equipment slots, item entries
  - `dialogs.css`: Trade, enchant, pet, settlement, notifications
  - `settings.css`: Settings window, hotkey bindings
  - `editor.css`: Map editor toolbar, brush, wrench
  - `bigmap.css`: Fullscreen map
  - `effects.css`: @keyframes, particles, floating text
  - `themes.css`: Command-line/ASCII theme (69 rules)
  - `responsive.css`: Media queries
  - `other.css`: Transitional (208 rules to be redistributed)
- Created `main.css` composition root

Result: 73.95kB CSS bundle (16.64kB gzipped), same visuals.

### 2. JS Extraction (Manual + Semi-Automated)

#### Core

- `core/constants.js`: TileType, ColorTable, MaterialType, GameStates, etc. (was scattered `const` at top)
- `core/prng.js`: `PRNG` class + `hashString`, `initRandom` (was global `prng` function)
- `core/config.js`: `ConfigManager`, defaults (was `游戏设置` object + localStorage handling)
- `core/gameState.js`: `GameState` class centralizing 50+ `let` globals (was `let 地牢 = []`, `let 玩家 = {}`)
- `core/types.js`: Cell, Door classes
- `core/events.js`: EventEmitter

#### Engine

- `engine/renderer.js`: `Renderer` class with `drawCell`, `clear`, `showFloatingText` (was inline drawing functions)
- `engine/input.js`: `InputManager` (was scattered event listeners)
- `engine/loop.js`: `GameLoop` (was `动画帧` recursive)
- `engine/audio.js`: `AudioManager` (was `音效管理器` object literal)

#### Map

- `map/cell.js`: `Cell` class
- `map/dungeon.js`: `Dungeon` class with `isAreaFree`, `placeRoom`, `generateWalls`
- `map/generators/base.js`: Base interface
- `map/generators/defaultGenerator.js`: Room placement logic
- `map/generators/caveGenerator.js`: Cellular automata
- `map/generators/mazeGenerator.js`: Growing tree
- `map/generators/puzzleGenerator.js`: Sokoban
- `map/generators/specialFloors.js`: Boss floors

#### Entities

- `entities/base/item.js`: `Item` base
- `entities/base/monster.js`: `Monster` base
- `entities/base/pet.js`: `Pet` extends Monster
- `entities/base/trap.js`: `Trap`
- `entities/items/*`: Weapons, Armor, Consumables, Tools
- `entities/monsters/*`: Basic, Advanced, Bosses
- `entities/pets/*`

#### Systems

- `inventorySystem.js`, `combatSystem.js`, `statusSystem.js`, `equipmentSystem.js`, `petSystem.js`, `fusionSystem.js`, `saveSystem.js`

#### UI

- `hud.js`, `inventoryUI.js`, `minimap.js`, `bigmap.js`, `dialogManager.js`, `menuManager.js`, `settingsManager.js`, `notification.js`, `log.js`

#### Utils

- `helpers.js`: deepEqual, safeEncode, generateSignature
- `icon.js`: getIconHTML, drawIcon, CDN cache
- `pathfinding.js`: BFS, A*, LoS
- `math.js`

#### Data

- `itemPool.js`, `monsterPool.js`, `recipes.js`

#### Legacy

- `legacy/bridge.js`: Compatibility layer exposing modern modules as `window` globals for old HTML
- `legacy/bundle.js`: Lightweight stub; future will contain full extracted bundle

### 3. HTML Modernization

- Old `index.html` was redirector to `ChineseDungeon.html`
- New `index.html`:
  - Proper `<head>` with meta, no inline CSS/JS forced redirect
  - Body contains all required divs/canvases from legacy (973 lines) but cleaned
  - Single module entry: `<script type="module" src="/src/main.js">`
  - External CDN scripts (supabase, gsap) kept as `<script src>`
  - `main.js` imports `styles/main.css` (Vite injects)

### 4. Build System

- Added `package.json` with Vite, ESLint, Prettier
- `vite.config.js` with alias `@core`, `@engine`, etc., and multi-entry for legacy files
- Build output: `dist/` with hashed assets, gzipped
- Verified: `npm run build` succeeds, 30 modules, ~73kB CSS, ~18kB JS (modern part) + 2MB legacy HTML preserved

## Remaining Work (Phase 2)

- Extract 252 classes from legacy JS file into individual modules under `entities/`
  - Approach: Use Babel AST to parse and emit each `class X extends Y {}` to its own file
- Replace `window.XXX` with imports
- Add TypeScript: rename `.js` to `.ts`, add interfaces for Cell, Item, Monster
- Unit tests: Vitest for PRNG, pathfinding, generators
- Remove `other.css` by redistributing 208 rules
- Modernize `ChineseDungeon-Viewer.html` and `LevelManager.html` into `src/tools/`
- PWA: Add `vite-plugin-pwa`

## Compatibility

- `ChineseDungeon.html` kept as-is for users who open directly
- `gameState` exposes Chinese aliases: `export const 单元格类型 = TileType`
- Save files still load (SaveVersion = "v1")
- `index.html` modern entry works alongside legacy; both use same localStorage key

## Metrics

- **Before**: 1 file, 68k lines, 0 modules, 0 build
- **After**: 50+ modules, 15 CSS files, 2.8k lines modern + 68k legacy (to be reduced), Vite build, ESLint, docs
- **Build Time**: ~1.5s
- **Bundle Size**: Modern JS 18kB (8kB gz) + CSS 73kB (16kB gz), legacy HTML 2MB (531kB gz) preserved for compat
- **Maintainability**: High — clear domain separation, documented architecture
