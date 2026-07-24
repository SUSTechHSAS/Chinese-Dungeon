# Chinese Dungeon - Modern Architecture Documentation

## Overview

This project has been refactored from a single 68k-line HTML monolith into a modern, modular, maintainable codebase using ES modules and Vite.

### Before (Legacy)

- Single file: `ChineseDungeon.html` (~68k lines)
- Inline CSS (~4.8k lines) + Inline JS (~62k lines)
- Global variables, no modules, hard to maintain
- No build system, no linting, no type safety

### After (Modern)

- **Build System**: Vite + ES Modules
- **Modular CSS**: Split into logical components
- **Modular JS**: Organized by domain
- **State Management**: Centralized `gameState`
- **Package Management**: npm + package.json

## Directory Structure

```
Chinese-Dungeon/
├── index.html                # Modern entry (Vite)
├── ChineseDungeon.html       # Legacy preserved for reference
├── package.json              # Dependencies & scripts
├── vite.config.js            # Build config with aliases
├── public/                   # Static assets
├── src/
│   ├── main.js               # Entry point - imports styles & app
│   ├── app.js                # GameApp orchestrator
│   ├── styles/
│   │   ├── main.css          # Imports all modules
│   │   ├── reset.css         # CSS reset
│   │   ├── variables.css     # CSS custom properties
│   │   ├── base.css          # Body, scrollbar, generic
│   │   ├── canvas.css        # Dungeon & background canvas
│   │   ├── menu.css          # Main menu & mode select
│   │   ├── hud.css           # HUD, minimap, monster indicators
│   │   ├── controls.css      # D-pad & action buttons
│   │   ├── inventory.css     # Backpack, equipment slots
│   │   ├── dialogs.css       # Trade, enchant, pet, settlement, etc.
│   │   ├── settings.css      # Settings window & hotkey binding
│   │   ├── editor.css        # Map editor toolbar & panels
│   │   ├── bigmap.css        # Fullscreen big map
│   │   ├── effects.css       # Keyframes & particle effects
│   │   ├── themes.css        # Theme switching
│   │   ├── responsive.css    # Media queries
│   │   ├── other.css         # Transitional bucket (to be redistributed)
│   │   └── themes/
│   │       ├── default.css   # Default dark theme
│   │       └── commandline.css # ASCII/terminal theme
│   ├── core/
│   │   ├── constants.js      # TileType, enums, game version
│   │   ├── config.js         # ConfigManager & defaults
│   │   ├── prng.js           # Seeded PRNG (replaces global prng)
│   │   ├── gameState.js      # Centralized state (replaces globals)
│   │   ├── types.js          # Cell, Door types
│   │   └── events.js         # EventEmitter
│   ├── engine/
│   │   ├── renderer.js       # Dungeon rendering & effects
│   │   ├── input.js          # Input handling
│   │   ├── loop.js           # Game loop
│   │   └── audio.js          # Audio manager
│   ├── map/
│   │   ├── cell.js           # Cell class
│   │   ├── dungeon.js        # Dungeon grid manager
│   │   └── generators/
│   │       ├── base.js       # BaseGenerator interface
│   │       ├── defaultGenerator.js
│   │       ├── caveGenerator.js   # Cellular automata
│   │       ├── mazeGenerator.js   # Growing tree
│   │       ├── puzzleGenerator.js # Push-box Sokoban
│   │       └── specialFloors.js   # Boss/library floors
│   ├── entities/
│   │   ├── base/
│   │   │   ├── item.js       # Base Item
│   │   │   ├── monster.js    # Base Monster
│   │   │   ├── pet.js        # Base Pet extends Monster
│   │   │   └── trap.js       # Base Trap
│   │   ├── items/
│   │   │   ├── weapons.js
│   │   │   ├── armor.js
│   │   │   ├── consumables.js
│   │   │   ├── tools.js
│   │   │   └── index.js
│   │   ├── monsters/
│   │   │   ├── basic.js
│   │   │   ├── advanced.js
│   │   │   ├── bosses.js
│   │   │   └── index.js
│   │   └── pets/
│   │       └── index.js
│   ├── systems/
│   │   ├── inventorySystem.js
│   │   ├── combatSystem.js
│   │   ├── statusSystem.js
│   │   ├── equipmentSystem.js
│   │   ├── petSystem.js
│   │   ├── fusionSystem.js
│   │   └── saveSystem.js
│   ├── ui/
│   │   ├── hud.js
│   │   ├── inventoryUI.js
│   │   ├── minimap.js
│   │   ├── bigmap.js
│   │   ├── dialogManager.js
│   │   ├── menuManager.js
│   │   ├── settingsManager.js
│   │   ├── notification.js
│   │   └── log.js
│   ├── utils/
│   │   ├── helpers.js        # deepEqual, safeEncode, etc.
│   │   ├── icon.js           # getIconHTML, drawIcon
│   │   ├── pathfinding.js    # A*, BFS, LoS
│   │   └── math.js
│   ├── data/
│   │   ├── itemPool.js
│   │   ├── monsterPool.js
│   │   └── recipes.js
│   └── legacy/
│       ├── bridge.js         # Compatibility layer
│       └── bundle.js         # Lightweight legacy stub
├── docs/
│   └── ARCHITECTURE.md       # This file
└── dist/                     # Build output (generated)
```

## Migration Strategy

### Phase 1: Scaffolding (Current)
- ✅ Extract CSS into modules
- ✅ Create ES module structure
- ✅ Centralize globals into `gameState`
- ✅ Implement `ConfigManager`, `PRNG`, `Renderer`
- ✅ Legacy bridge for compatibility
- ✅ Vite build setup
- ✅ Modern `index.html` entry

### Phase 2: Incremental Replacement (Next)
- Extract all 252 classes into `src/entities/`
- Replace global functions with module imports
- Implement proper save/load via `SaveSystem`
- Migrate map generators fully
- Add TypeScript types (`.d.ts` or full TS migration)
- Unit tests for core logic (PRNG, pathfinding, dungeon gen)

### Phase 3: Modern Features
- ESBuild/SWC for faster builds
- PWA support (offline)
- Web Workers for dungeon generation
- WebGL renderer option
- Multiplayer via WebSocket (replace Socket.io CDN)
- Full i18n system

## Key Design Decisions

1. **GameState as Singleton**: Replaces 50+ global `let` variables. Provides event system for UI reactivity.
2. **Renderer Decoupled**: No direct `ctx` manipulation in game logic; all drawing via `Renderer` class.
3. **PRNG Class**: Testable, seedable, not global function soup.
4. **CSS Modules**: Each UI component owns its styles; `main.css` is composition root.
5. **Legacy Bridge**: Allows running new and old code side-by-side, enabling gradual migration without breaking game.
6. **Vite Aliases**: `@core`, `@engine`, etc. make imports readable and refactor-friendly.

## Development

```bash
npm install
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Build to dist/
npm run preview  # Preview production build
npm run lint     # ESLint
```

## Backward Compatibility

- `ChineseDungeon.html` preserved as legacy entry
- `index.html` now is modern entry (was previously redirector)
- `ChineseDungeon-Viewer.html` and `LevelManager.html` still work; will be migrated to `src/tools/` in future
- Global aliases (Chinese names) kept where needed: `export const 单元格类型 = TileType`

## Performance Notes

- CSS: 4.8k lines split into 15 files, loaded as single bundle via Vite CSS code splitting
- Lazy loading: `legacy/bridge.js` dynamically imports bundle only when needed
- Particle effects use `requestAnimationFrame`, not inline styles
- Emoji CDN caching via `Map` to avoid duplicate fetches

## Future Improvements

- Convert to TypeScript for better maintainability
- Add Vitest unit tests
- Use Zustand or similar for more advanced state management if needed
- Web Components for UI dialogs
- Asset pipeline for emoji spritesheet instead of CDN
