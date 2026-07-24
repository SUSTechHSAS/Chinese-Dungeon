/**
 * @fileoverview Core game constants and enums
 * Modern ES module replacement for scattered global constants in legacy code
 */

export const TileType = Object.freeze({
  WALL: 0,
  ROOM: 1,
  CORRIDOR: 2,
  DOOR: 3,
  LOCKED_DOOR: 4,
  ITEM: 5,
  STAIRS_DOWN: 6,
  STAIRS_UP: 7,
  MONSTER: 8,
});

export const 单元格类型 = TileType; // backward compat alias

export const ColorTable = Object.freeze([
  "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#FF0000", "#800080",
  "#00FFFF", "#FFA500", "#A52A2A", "#808080", "#FFFFFF", "#000000"
]);

export const 颜色表 = ColorTable;

export const MaterialType = Object.freeze({
  NORMAL: "普通",
  WOOD: "木质",
  IRON: "铁质",
  GLASS: "玻璃",
  COPPER: "铜质",
  GOLD: "金质",
});

export const MaterialBadgeMap = Object.freeze({
  [MaterialType.NORMAL]: "普",
  [MaterialType.WOOD]: "木",
  [MaterialType.IRON]: "铁",
  [MaterialType.GLASS]: "璃",
  [MaterialType.COPPER]: "铜",
  [MaterialType.GOLD]: "金",
});

export const GameVersion = 1534;
export const SaveVersion = "v1";

export const MapSizeDefaults = {
  MIN: 50,
  MAX: 200,
  DEFAULT: 100,
  GROWTH_PER_LEVEL: 2,
};

export const CameraDefaults = {
  MIN: 5,
  MAX: 30,
  DEFAULT: 15,
};

export const InventoryDefaults = {
  MAX_STACK: 64,
  INITIAL_CAPACITY: 12,
  MAX_PAGES: 3,
  SLOTS_PER_PAGE: 7,
};

export const DrawingConstants = Object.freeze({
  DEFAULT_FONT: '"HarmonyOS Sans SC", "MiSans", system-ui, "color-emoji"',
  EMOJI_FONT: '"color-emoji"',
  CELL_SIZE: 30,
  MINIMAP_SCALE: 3,
  MINIMAP_OFFSET: 10,
});

export const MonsterState = Object.freeze({
  IDLE: "空闲",
  ACTIVE: "活跃",
  FLEEING: "逃跑",
  DORMANT: "休眠",
  PATROL: "巡逻",
});

export const MonsterMovementAnimationDuration = 300;

export const WeatherList = Object.freeze([
  "雷暴", "诡魅", "大风", "严寒", "深夜", "深夜"
]);

export const DataIntegrityKey = "f_SECRET_KEY_FOR_CHINESE_DUNGEON";

export const GameStates = Object.freeze({
  INIT: "初始化",
  MAIN_MENU: "主菜单",
  MODE_SELECT: "模式选择",
  IN_GAME: "游戏中",
  MAP_EDITOR: "地图编辑器",
  EDITOR_PLAY: "编辑器游玩",
  ENCYCLOPEDIA: "图鉴",
  ENCYCLOPEDIA_SELECT: "图鉴选择",
  GAME_OVER: "结算",
});

export const MAX_EMOJI_FETCH_RETRIES = 3;

export const DifficultyPresets = Object.freeze({
  CASUAL: "休闲",
  STANDARD: "标准",
  CHALLENGE: "挑战",
  EXTREME: "极限",
});

export const TrapDensity = Object.freeze({
  NONE: "无",
  RARE: "稀少",
  NORMAL: "普通",
  DEADLY: "致命",
});

export const DungeonGenType = Object.freeze({
  DEFAULT: "default",
  CAVE: "cave",
  MAZE: "maze",
  PUZZLE: "puzzle",
});

export const ICONS = {
  // Will be populated from icon module for backward compat
};
