/**
 * Base Item class
 */

export class Item {
  constructor(config = {}) {
    this.类型 = config.类型 || "物品";
    this.名称 = config.名称 || this.constructor.name;
    this.图标 = config.图标 || "?";
    this.显示图标 = config.显示图标 || this.图标;
    this.颜色索引 = config.颜色索引 ?? 0;
    this.颜色表 = config.颜色表 || ["#FFFFFF"];
    this.唯一标识 = config.唯一标识 || Symbol(Date.now().toString());
    this.品质 = config.品质 ?? 0;
    this.堆叠数量 = config.数量 ?? config.堆叠数量 ?? 1;
    this.最大堆叠数量 = config.最大堆叠数量 ?? 64;
    this.能否拾起 = config.能否拾起 ?? true;
    this.是否正常物品 = config.是否正常物品 ?? true;
    this.是否隐藏 = config.是否隐藏 ?? false;
    this.是否为隐藏物品 = config.是否为隐藏物品 ?? false;
    this.已装备 = config.已装备 ?? false;
    this.装备槽位 = config.装备槽位 ?? null;
    this.阻挡移动 = config.阻挡移动 ?? false;
    this.材质 = config.材质 || "普通";
    this.重量 = config.重量 || 1;
    this.自定义数据 = config.自定义数据 || new Map();
    this.效果描述 = config.效果描述 || null;
    this.数据 = config.数据 || {};
    this.x = config.x ?? null;
    this.y = config.y ?? null;
    this.强化 = config.强化 ?? false;
  }

  获取名称() {
    return this.名称;
  }

  获取描述() {
    return this.效果描述 || `${this.名称} - 品质: ${this.品质}`;
  }

  使用(使用者 = null) {
    console.log(`${this.名称} 被使用`);
    return false;
  }

  装备(槽位) {
    this.已装备 = true;
    this.装备槽位 = 槽位;
  }

  卸下() {
    this.已装备 = false;
    this.装备槽位 = null;
  }

  能否堆叠(other) {
    return other.constructor === this.constructor && this.堆叠数量 < this.最大堆叠数量;
  }

  toJSON() {
    return {
      类名: this.constructor.name,
      配置: {
        名称: this.名称,
        品质: this.品质,
        数量: this.堆叠数量,
        强化: this.强化,
      }
    };
  }
}

export const 物品 = Item;
