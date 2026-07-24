# Contributing to Chinese Dungeon (Modern Modular Edition)

Thank you for considering contributing! This guide explains the new modular architecture.

## Development Setup

```bash
git clone https://github.com/SUSTechHSAS/Chinese-Dungeon.git
cd Chinese-Dungeon
npm install
npm run dev
```

Dev server at http://localhost:3000 with HMR.

## Architecture Principles

1. **No New Globals**: Use `gameState` singleton and ES modules. Avoid `window.xxx` except via legacy bridge.
2. **Single Responsibility**: Each module does one thing (renderer, inventory, etc.).
3. **Dependency Injection**: Pass `gameState`, `renderer`, `configManager` as deps, don't import globals everywhere if avoidable.
4. **Chinese Aliases**: Keep Chinese export aliases for backward compat (`export const 单元格 = Cell`).
5. **CSS Modules**: Each UI component owns its CSS file. Import via `main.css`.

## Where to Put Code?

| Type | Location |
|------|----------|
| Constants, enums | `src/core/constants.js` |
| Config, settings | `src/core/config.js` |
| Random logic | `src/core/prng.js` |
| Game state | `src/core/gameState.js` |
| Rendering | `src/engine/renderer.js` |
| Input | `src/engine/input.js` |
| Dungeon logic | `src/map/dungeon.js` |
| Generators | `src/map/generators/*.js` |
| Base entities | `src/entities/base/*.js` |
| Items | `src/entities/items/*.js` |
| Monsters | `src/entities/monsters/*.js` |
| Pets | `src/entities/pets/*.js` |
| Systems | `src/systems/*.js` |
| UI | `src/ui/*.js` |
| Utilities | `src/utils/*.js` |
| Data pools | `src/data/*.js` |
| Styles | `src/styles/*.css` |

## Adding a Feature Example: New Monster

1. Create `src/entities/monsters/myMonster.js`:

```js
import { Monster } from '../base/monster.js';
export class MyMonster extends Monster {
  constructor(config = {}) {
    super({ ...config, 名称: '我的怪物', 图标: '👾', 基础生命值: 30 });
  }
  更新(dungeon, player) {
    // custom AI
  }
}
```

2. Export in `src/entities/monsters/index.js`:

```js
export * from './myMonster.js';
```

3. Add to pool in `src/data/monsterPool.js`

4. Add icon handling in `src/utils/icon.js` if needed

5. Test with `npm run dev`

## CSS Guidelines

- Use BEM or descriptive class names (existing Chinese names kept for compat)
- Variables in `variables.css` (`--ui-bg-color`, etc.)
- Component files: `.hud` in `hud.css`, `.背包弹窗` in `inventory.css`, etc.
- `main.css` is composition root — add new component imports there

## Legacy Bridge

During migration, some code still lives in `ChineseDungeon.html` (68k lines). Use `src/legacy/bridge.js` to interop:

```js
import { gameState } from '@core/gameState.js';
window.地牢 = gameState.地牢; // expose for legacy
```

Goal is to eventually delete `ChineseDungeon.html` and have all logic in `src/`.

## Commit Style

- `feat: add poison trap`
- `fix: minimap not updating`
- `refactor: split inventory CSS`
- `docs: update architecture guide`

## PR Checklist

- [ ] `npm run build` passes
- [ ] No new globals in `window`
- [ ] CSS added to appropriate modular file
- [ ] JSDoc for exported functions
- [ ] Tested in both desktop and mobile view

## Questions?

Open an issue or discussion. See `docs/ARCHITECTURE.md` for deep dive.
