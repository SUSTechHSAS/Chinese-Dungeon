export * from '../base/pet.js';
export class Panda extends (await import('../base/pet.js')).then(m=>m.Pet) {
  constructor(c) { super({ ...c, 名称: '熊猫', 图标: '🐼' }); }
}
