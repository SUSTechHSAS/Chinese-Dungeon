			            掉落概率: 0.2,
			            ...配置,
			        });
			        this.当前反弹伤害 = 配置.当前反弹伤害??6;
			    }

			    get 攻击力() {
			        return this.当前反弹伤害;
			    }

			    受伤(伤害, 来源 = null) {
			        if (!this.强化) {
			            this.当前反弹伤害 = Math.max(this.当前反弹伤害, Math.floor(伤害));
			        } else {
			            this.当前反弹伤害 += Math.floor(Math.abs(伤害))
			        }
			        super.受伤(伤害, 来源);
			    }

			    尝试攻击() {
			        const 攻击成功 = super.尝试攻击();
			        if (this?.目标.x !== 玩家.x || this?.目标.y !== 玩家.y) {
			            return 攻击成功;
			        }
			        if (攻击成功) {
			            const 自身状态 = 怪物状态表.get(this);
			            const 负面效果列表 = ["中毒", "火焰", "缓慢", "腐蚀", "眩晕", "恐惧", "牵制", "魅惑"];
			            if (自身状态 && 负面效果列表.includes(自身状态.类型)) {
			                const 怪物专属效果 = ["魅惑","恐惧"];
			                let 效果已转移 = false;
			                if (怪物专属效果.includes(自身状态.类型)) {
			                    new 状态效果("中毒", 效果颜色编号映射[效果名称编号映射.中毒], "☠️", 3, null, null, null, 2);
			                    添加日志(`${this.类型} 将 ${自身状态.类型} 效果转化为毒素传递给了你！`, "错误");
			                    效果已转移 = true;
			                } else {
			                    new 状态效果(
			                        自身状态.类型,
			                        自身状态.颜色,
			                        自身状态.图标,
			                        自身状态.持续时间,
			                        null,
			                        null,
			                        null,
			                        自身状态.强度
			                    );
			                    添加日志(`${this.类型} 将 ${自身状态.类型} 效果传递给了你！`, "错误");
			                    效果已转移 = true;
			                }
			                if (效果已转移) {
			                    自身状态.移除状态();
			                }
			            }
			        }
			        return 攻击成功;
			    }
			}
  

			class 蜘蛛怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.蜘蛛怪物,
			            类型: "蜘蛛怪物",
			            基础生命值: 28 + (配置.强化 ? 12 : 0),
			            基础攻击力: 4 + (配置.强化 ? 2 : 0),
			            移动率: 0.8,
			            掉落物: new 渔网({数量: 2}),
			            掉落概率: 0.4,
			            基础攻击范围: 1,
			            ...配置,
			        });
			        this.喷吐冷却 = 配置.喷吐冷却??(3-(配置.强化 ? 1 : 0));
			        this.喷吐冷却剩余 = 配置.喷吐冷却剩余??0;
			    }

			    尝试移动() {
			        const 旧X = this.x;
			        const 旧Y = this.y;
			        super.尝试移动();
			        if ((this.x !== 旧X || this.y !== 旧Y)&&prng()<0.5) {
			            const 蛛网实例 = new 蛛网({强化: this.强化});
			            放置物品到单元格(蛛网实例, 旧X, 旧Y);
			        }
			    }

			    尝试攻击() {
			        if (this.喷吐冷却剩余 > 0) {
			            this.喷吐冷却剩余--;
			        }
			        const 玩家距离 = Math.abs(this.x - 玩家.x) + Math.abs(this.y - 玩家.y);
			        if (玩家距离 > 1 && 玩家距离 <= 5 && this.喷吐冷却剩余 <= 0 && 检查视线(this.x, this.y, 玩家.x, 玩家.y)) {
			            const 蛛网实例 = new 蛛网({强化: this.强化});
			            放置物品到单元格(蛛网实例, 玩家.x, 玩家.y);
			            添加日志(`${this.类型} 向你喷吐了蛛网！`, "警告");
			            计划显示格子特效(获取直线路径(this.x, this.y, 玩家.x, 玩家.y), "FFFFFF");
			            this.喷吐冷却剩余 = this.喷吐冷却;
			            return true;
			        }
			        return super.尝试攻击();
			    }
			}
			class 腐蚀怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.腐蚀怪物,
			            类型: "腐蚀怪物",
			            基础生命值: 35 + (配置.强化 ? 15 : 0),
			            基础攻击力: 4 + (配置.强化 ? 2 : 0),
			            掉落物: new 重铸台({}),
			            掉落概率: 0.1,
			            攻击冷却: 1,
			            ...配置,
			        });
			        this.腐蚀强度 = 配置.腐蚀强度??(1 + (配置.强化 ? 1 : 0));
			        this.腐蚀持续 = 配置.腐蚀持续??(4 + (配置.强化 ? 2 : 0));
			    }
			
			    尝试攻击() {
			        if (super.尝试攻击()) {
			            if (怪物状态表.get(this)?.类型 === "魅惑") {
			            } else if (this.目标?.x==玩家.x && this.目标?.y==玩家.y){
			                new 状态效果(
			                    "腐蚀",
			                    "#8FBC8F",
			                    "☠️",
			                    this.腐蚀持续,
			                    null,
			                    this,
			                    null,
			                    this.腐蚀强度
			                );
			                添加日志("你的装备被腐蚀了！", "错误");
			            }
			            return true;
			        }
			        return false;
			    }
			
			    应用效果() {
			        const 腐蚀量 = 1 + Math.floor(this.腐蚀强度 / 2);
			        let 实际腐蚀 = false;
			        Array.from({ length: 装备栏每页装备数 }, (_, i) => 玩家装备.get(当前装备页 * 装备栏每页装备数 + i + 1)).filter((v) => v != null).forEach((装备) => {
			                if (
			                    装备.自定义数据?.has("耐久") &&
			                    !装备.自定义数据.get("不可破坏")
			                ) {
			                    const 额外腐蚀 = 装备.材质 === 材料.铁质 ? 腐蚀量 : 0;
			                    const 总腐蚀量 = 腐蚀量 + 额外腐蚀;
			                    const 原耐久 = 装备.自定义数据.get("耐久");
			                    装备.自定义数据.set(
			                        "耐久",
			                        Math.max(0, 原耐久 - 总腐蚀量)
			                    );
			                    if (
			                        原耐久 > 0 &&
			                        装备.自定义数据.get("耐久") === 0
			                    ) {
			                        添加日志(
			                            `${装备.名称} 被腐蚀损坏了！`,
			                            "错误"
			                        );
			                        处理销毁物品(装备.唯一标识, true);
			                        实际腐蚀 = true;
			                    } else if (
			                        装备.自定义数据.get("耐久") < 原耐久
			                    ) {
			                        添加日志(
			                            `${装备.名称} 被腐蚀了！损失 ${总腐蚀量} 点耐久。`,
			                            "错误"
			                        );
			                        实际腐蚀 = true;
			                    }
			                }
			            });
			        if (实际腐蚀) {
			            更新装备显示();
			        }
			    }
			    移除效果() {
			        return true;
			    }
			}
			class 盗贼怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.盗贼怪物,
			            类型: "盗贼怪物",
			            基础生命值: 25 + (配置.强化 ? 10 : 0),
			            基础攻击力: 4 + (配置.强化 ? 1 : 0),
			            移动率: 0.8,
			            基础移动距离: 2,
			            掉落物: new 神偷手({}),
			            掉落概率: 0.3,
			            跟踪距离: 20,
			            ...配置,
			        });
			        this.偷窃几率 = 配置.偷窃几率??(0.5 + (配置.强化 ? 0.2 : 0));
			        this.偷窃武器几率 = 配置.偷窃武器几率??(0.15 + (配置.强化 ? 0.1 : 0));
			        this.偷窃装备几率 = 配置.偷窃装备几率??(0.15 + (配置.强化 ? 0.1 : 0));
			        this.偷到的金币 = 0;
			        this.偷到的武器列表 = [];
			    }
			
			    尝试攻击() {
			        if (怪物状态表.get(this)?.类型 === "魅惑") {
			            return super.尝试攻击();
			        }
			
			        const 攻击成功 = super.尝试攻击();
			        if (攻击成功) {
			            if (prng() < this.偷窃几率) {
			                const 玩家金币 = [...玩家背包.values()]
			                    .filter((i) => i instanceof 金币)
			                    .reduce((sum, i) => sum + i.堆叠数量, 0);
			                if (玩家金币 > 0) {
			                    const 偷窃数量 = Math.min(
			                        玩家金币,
			                        Math.floor(
			                            prng() * (5 + this.攻击力)
			                        ) + 1
			                    );
			                    if (扣除金币(偷窃数量)) {
			                        this.偷到的金币 += 偷窃数量;
			                        显示通知(
			                            `${this.类型} 偷走了你的 ${偷窃数量} 金币！`,
			                            "错误"
			                        );
			                        添加日志(
			                            `${this.类型} 偷走了 ${偷窃数量} 金币！`,
			                            "错误"
			                        );
			                    }
			                }
			            
			
			            if (prng() < this.偷窃武器几率) {
			                let 玩家装备武器 = Array.from(
			                    { length: 装备栏每页装备数 },
			                    (_, i) =>
			                        玩家装备.get(
			                            当前装备页 * 装备栏每页装备数 + i + 1
			                        )
			                )
			                    .filter((v) => v != null)
			                    .filter((item) => item instanceof 武器类);
			
			                if (玩家装备武器.length > 1) {
			                    const 目标武器索引 = Math.floor(
			                        prng() * 玩家装备武器.length
			                    );
			                    const 被偷武器 = 玩家装备武器[目标武器索引];
			
			                    玩家装备.delete(被偷武器.装备槽位);
			                    被偷武器.已装备 = false;
			                    const 原槽位 = 被偷武器.装备槽位;
			                    被偷武器.装备槽位 = null;
			
			                    this.偷到的武器列表.push(被偷武器);
			                    玩家背包.delete(被偷武器.唯一标识);
			                    被偷武器.已装备 = false;
			                    被偷武器.装备槽位 = null;
			
			                    显示通知(
			                        `${
			                            this.类型
			                        } 偷走了你的 ${被偷武器.获取名称()}！`,
			                        "错误"
			                    );
			                    添加日志(
			                        `${
			                            this.类型
			                        } 偷走了 ${被偷武器.获取名称()}！`,
			                        "错误"
			                    );
			
			                    更新装备显示();
			                    更新背包显示();
			                }
			                } else if (prng()<this.偷窃装备几率){
			                let 玩家装备装甲 = Array.from(
			                    { length: 装备栏每页装备数 },
			                    (_, i) =>
			                        玩家装备.get(
			                            当前装备页 * 装备栏每页装备数 + i + 1
			                        )
			                )
			                    .filter((v) => v != null)
			                    .filter((item) => item instanceof 防御装备类);
			                if (玩家装备装甲.length <= 1) return 攻击成功;
			
			                const 目标武器索引 = Math.floor(
			                    prng() * 玩家装备装甲.length
			                );
			                const 被偷装甲 = 玩家装备装甲[目标武器索引];
			
			                if (被偷装甲) {
			                    玩家装备.delete(被偷装甲.装备槽位);
			                    被偷装甲.已装备 = false;
			                    const 原槽位 = 被偷装甲.装备槽位;
			                    被偷装甲.装备槽位 = null;
			
			                    this.偷到的武器列表.push(被偷装甲);
			                    玩家背包.delete(被偷装甲.唯一标识);
			                    被偷装甲.已装备 = false;
			                    被偷装甲.装备槽位 = null;
			
			                    显示通知(
			                        `${
			                            this.类型
			                        } 偷走了你的 ${被偷装甲.获取名称()}！`,
			                        "错误"
			                    );
			                    添加日志(
			                        `${
			                            this.类型
			                        } 偷走了 ${被偷装甲.获取名称()}！`,
			                        "错误"
			                    );
			
			                    更新装备显示();
			                    更新背包显示();
			                }
			            }
			            }
			            }
			        
			        return 攻击成功;
			    }
			
			    受伤(伤害, 来源 = null) {
			        const 原始血量 = this.当前生命值;
			        super.受伤(伤害, 来源);
			
			        if (原始血量 > 0 && this.当前生命值 <= 0) {
			            let 掉落成功 = false;
			
			            if (this.偷到的金币 > 0) {
			                const 掉落金币 = new 金币({
			                    数量: this.偷到的金币,
			                });
			                if (放置物品到单元格(掉落金币, this.x, this.y)) {
			                    添加日志(
			                        `${this.类型} 死亡，掉落了 ${this.偷到的金币} 金币！`,
			                        "成功"
			                    );
			                    掉落成功 = true;
			                } else {
			                    let 方向 = [
			                        [0, -1],
			                        [0, 1],
			                        [-1, 0],
			                        [1, 0],
			                    ];
			                    for (const [dx, dy] of 方向) {
			                        if (
			                            放置物品到单元格(
			                                掉落金币,
			                                this.x + dx,
			                                this.y + dy
			                            )
			                        ) {
			                            添加日志(
			                                `${this.类型} 死亡，掉落了 ${this.偷到的金币} 金币！`,
			                                "成功"
			                            );
			                            掉落成功 = true;
			                            break;
			                        }
			                    }
			                    if (!掉落成功) {
			                        方向 = [
			                            [1, -1],
			                            [1, 1],
			                            [-1, -1],
			                            [1, -1],
			                        ];
			                        for (const [dx, dy] of 方向) {
			                            if (
			                                放置物品到单元格(
			                                    掉落金币,
			                                    this.x + dx,
			                                    this.y + dy
			                                )
			                            ) {
			                                添加日志(
			                                    `${this.类型} 死亡，掉落了 ${this.偷到的金币} 金币！`,
			                                    "成功"
			                                );
			                                掉落成功 = true;
			                                break;
			                            }
			                        }
			                    }
			                }
			                if (!掉落成功)
			                    添加日志(
			                        `${this.类型} 死亡，但未能掉落金币（周围无空间）`,
			                        "警告"
			                    );
			            }
			
			            this.偷到的武器列表.forEach((武器) => {
			                掉落成功 = false;
			                if (放置物品到单元格(武器, this.x, this.y)) {
			                    添加日志(
			                        `${
			                            this.类型
			                        } 死亡，掉落了 ${武器.获取名称()}！`,
			                        "成功"
			                    );
			                    掉落成功 = true;
			                } else {
			                    let 方向 = [
			                        [0, -1],
			                        [0, 1],
			                        [-1, 0],
			                        [1, 0],
			                    ];
			                    for (const [dx, dy] of 方向) {
			                        if (
			                            放置物品到单元格(
			                                武器,
			                                this.x + dx,
			                                this.y + dy
			                            )
			                        ) {
			                            添加日志(
			                                `${
			                                    this.类型
			                                } 死亡，掉落了 ${武器.获取名称()}！`,
			                                "成功"
			                            );
			                            掉落成功 = true;
			                            break;
			                        }
			                    }
			
			                }
			                if (!掉落成功) {
			                    添加日志(
			                        `${
			                            this.类型
			                        } 死亡，但未能掉落 ${武器.获取名称()}（周围无空间）`,
			                        "警告"
			                    );
			
			                    if (尝试收集物品(武器, true)) {
			                        添加日志(
			                            `${武器.获取名称()} 已返回你的背包！`,
			                            "成功"
			                        );
			                    } else {
			                        添加日志(
			                            `背包已满，无法返还 ${武器.获取名称()}！`,
			                            "错误"
			                        );
			                    }
			                }
			            });
			            this.偷到的武器列表 = [];
			            更新背包显示();
			        }
			    }
			}
			class 吸能怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.吸能怪物,
			            类型: "吸能怪物",
			            基础生命值: 28 + (配置.强化 ? 12 : 0),
			            基础攻击力: 4 + (配置.强化 ? 2 : 0),
			            掉落物: new 能量药水({ 数量: 1 }),
			            掉落概率: 0.4,
			            基础攻击范围: 2, // 增加攻击范围以便吸附
			            ...配置,
			        });
			        this.吸能比例 = 配置.吸能比例??(0.3 + (配置.强化 ? 0.15 : 0));
			        this.最小吸能 = 配置.最小吸能 ?? (5 + (配置.强化 ? 10 : 0));
			        this.吸附距离 = 配置.吸附距离??(2 + (配置.强化 ? 1 : 0));
			        this.吸附冷却 = 配置.吸附冷却??(3 - (配置.强化 ? 1 : 0)); // 吸附技能冷却时间
			        this.吸附冷却剩余 = 配置.吸附冷却剩余??0;
			    }
			
			    尝试移动() {
			        if (this.吸附冷却剩余 > 0) {
			            this.吸附冷却剩余--;
			        }
			        const 玩家距离 =
			            Math.abs(this.x - 玩家.x) + Math.abs(this.y - 玩家.y);
			
			        if (玩家距离 <= this.吸附距离 && this.吸附冷却剩余 <= 0) {
			            const 路径 = 获取直线路径(
			                玩家.x,
			                玩家.y,
			                this.x,
			                this.y
			            );
			            if (路径 && 路径.length > 1) {
			                计划显示格子特效(路径.slice(1, -1), "8A2BE2");
			                const { 成功吸附, 新玩家X, 新玩家Y } =
			                    this.尝试吸附玩家();
			                if (成功吸附) {
			                    const 旧吸附X = 玩家.x,
			                        旧吸附Y = 玩家.y;
			                    玩家.x = 新玩家X;
			                    玩家.y = 新玩家Y;
			                    玩家动画状态 = {
			         正在动画: true,
			         旧逻辑X: 旧吸附X,
			         旧逻辑Y: 旧吸附Y,
			         目标逻辑X: 玩家.x,
			         目标逻辑Y: 玩家.y,
			         视觉X: 旧吸附X,
			         视觉Y: 旧吸附Y,
			         动画开始时间: Date.now()
			     };
			                    添加日志("你被吸能怪物拉近了！", "警告");
			                    处理玩家着陆效果(
			                        旧吸附X,
			                        旧吸附Y,
			                        玩家.x,
			                        玩家.y
			                    );
			                    更新视口();
			                    绘制();
			                    this.吸附冷却剩余 = this.吸附冷却;
			                }
			            }
			        }
			        super.尝试移动();
			    }
			
			    尝试攻击() {
			        if (怪物状态表.get(this)?.类型 === "冻结") return false;
			        if (this.攻击冷却回合剩余 > 0) {
			            this.攻击冷却回合剩余 -= 1;
			            return false;
			        }
			        this.绘制血条();
			
			        if (this.通向目标路径.length > this.攻击范围) return false;
			
			        if (怪物状态表.get(this)?.类型 === "魅惑") {
			            if (
			                this.魅惑目标怪物 !== this &&
			                this.魅惑目标怪物 !== null
			            ) {
			                this.魅惑目标怪物?.受伤(this.攻击力, this);
			                this.攻击冷却回合剩余 = this.攻击冷却;
			                计划显示格子特效(this.通向目标路径);
			                return true;
			            } else {
			                return false;
			            }
			        }
			
			        const 攻击成功 = super.尝试攻击();
			        if (攻击成功) {
			            const 造成伤害 = this.攻击力;
			            const 吸取量 = Math.max(
			                this.最小吸能,
			                Math.ceil(造成伤害 * this.吸能比例)
			            );
			            if (扣除能量(吸取量)) {
			                const 能量条 = document.querySelector(".power-bar");
			                const 当前能量 =
			                    parseFloat(能量条.style.width) || 0;
			                添加日志(
			                    `${this.类型} 吸取了你 ${吸取量.toFixed(
			                        0
			                    )} 点能量！`,
			                    "错误"
			                );
			                触发HUD显示();
			            }
			        }
			        return 攻击成功;
			    }
			
			    尝试吸附玩家() {
			        let 成功吸附 = false;
			        let 当前玩家X = 玩家.x;
			        let 当前玩家Y = 玩家.y;
			        let 新玩家X = 玩家.x;
			        let 新玩家Y = 玩家.y;
			
			        for (let i = 0; i < this.吸附距离; i++) {
			            const dx = this.x - 当前玩家X;
			            const dy = this.y - 当前玩家Y;
			            if (dx === 0 && dy === 0) break; // 已经到达怪物位置
			
			            let 移动X = 当前玩家X;
			            let 移动Y = 当前玩家Y;
			
			            if (Math.abs(dx) > Math.abs(dy)) {
			                移动X += Math.sign(dx);
			            } else if (Math.abs(dy) > Math.abs(dx)) {
			                移动Y += Math.sign(dy);
			            } else {
			                if (prng() < 0.5) {
			                    移动X += Math.sign(dx);
			                } else {
			                    移动Y += Math.sign(dy);
			                }
			            }
			
			            if (移动X === this.x && 移动Y === this.y) break; // 不吸入到怪物自身格
			
			            if (
			                检查移动可行性(当前玩家X, 当前玩家Y, 移动X, 移动Y)
			            ) {
			                const 目标单元格 = 地牢[移动Y]?.[移动X];
			                if (
			                    目标单元格 &&
			                    ![
			                        单元格类型.墙壁,
			                        单元格类型.上锁的门,
			                    ].includes(目标单元格.背景类型) &&
			                    !目标单元格.关联怪物
			                ) {
			                    新玩家X = 移动X;
			                    新玩家Y = 移动Y;
			                    当前玩家X = 移动X;
			                    当前玩家Y = 移动Y;
			                    成功吸附 = true;
			                } else {
			                    break; // 遇到障碍
			                }
			            } else {
			                break; // 路径不可行
			            }
			        }
			        return { 成功吸附, 新玩家X, 新玩家Y };
			    }
			}
			
			class 剧毒云雾怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.剧毒云雾怪物,
			            类型: "剧毒云雾怪物",
			            基础生命值: 25 + (配置.强化 ? 15 : 0),
			            基础攻击力: 5 + (配置.强化 ? 2 : 0),
			            移动率: 0.8,
			            掉落物: new 治疗药水({ 数量: 1 }),
			            掉落概率: 0.3,
			            基础攻击范围: 1,
			            ...配置,
			        });
			        this.毒云范围 = 配置.毒云范围??(1 + (配置.强化 ? 1 : 0));
			        this.毒云持续 = 配置.毒云持续??(3 + (配置.强化 ? 1 : 0));
			        this.毒云强度 = 配置.毒云强度??(2 + (配置.强化 ? 1 : 0));
			    }
			
			    受伤(伤害, 来源 = null) {
			        const 原始血量 = this.当前生命值;
			        super.受伤(伤害, 来源);
			
			        if (原始血量 > 0 && this.当前生命值 <= 0) {
			            this.释放毒云();
			        }
			    }
			
			    释放毒云() {
			        添加日志(`${this.类型} 死亡时释放了剧毒云雾！`, "警告");
			        const 范围 = this.毒云范围;
			        const 中心X = this.x;
			        const 中心Y = this.y;
			
			        for (let dx = -范围; dx <= 范围; dx++) {
			            for (let dy = -范围; dy <= 范围; dy++) {
			                const x = 中心X + dx;
			                const y = 中心Y + dy;
			
			                if (
			                    x >= 0 &&
			                    x < 地牢大小 &&
			                    y >= 0 &&
			                    y < 地牢大小
			                ) {
			                    const 单元格 = 地牢[y][x];
			
			                    if (
			                        单元格.背景类型 !== 单元格类型.墙壁 &&
			                        单元格.背景类型 !== 单元格类型.上锁的门
			                    ) {
			                        if (玩家.x === x && 玩家.y === y) {
			                            new 状态效果(
			                                "中毒",
			                                "#008000",
			                                "☠️",
			                                this.毒云持续,
			                                null,
			                                null,
			                                null,
			                                this.毒云强度
			                            );
			                            添加日志("你吸入了剧毒云雾！", "错误");
			                        }
			
			                        if (
			                            单元格.关联怪物 &&
			                            单元格.关联怪物 !== this &&
			                            怪物状态表.get(单元格.关联怪物)
			                                ?.类型 !== "魅惑"
			                        ) {
			                            new 状态效果(
			                                "中毒",
			                                "#008000",
			                                "☠️",
			                                this.毒云持续,
			                                null,
			                                null,
			                                单元格.关联怪物,
			                                this.毒云强度
			                            );
			                            添加日志(
			                                `${单元格.关联怪物.类型} 吸入了剧毒云雾！`,
			                                "信息"
			                            );
			                        }
			
			                        Array.from(
			                            { length: 装备栏每页装备数 },
			                            (_, i) =>
			                                玩家装备.get(
			                                    当前装备页 * 装备栏每页装备数 +
			                                        i +
			                                        1
			                                )
			                        )
			                            .filter((v) => v != null)
			                            .forEach((装备) => {
			                                if (
			                                    装备 instanceof 宠物 &&
			                                    装备.x === x &&
			                                    装备.y === y &&
			                                    !装备.自定义数据.get("休眠中")
			                                ) {
			                                    装备.受伤(this.毒云强度);
			                                    添加日志(
			                                        `${装备.名称} 吸入了剧毒云雾！`,
			                                        "错误"
			                                    );
			                                }
			                            });
			
			                        计划显示格子特效(
			                            [{ x: x, y: y }],
			                            "90EE90",
			                            150
			                        );
			                    }
			                }
			            }
			        }
			    }
			}
			class 骷髅仆从 extends 怪物 {
    constructor(配置 = {}) {
        super({
            图标: 图标映射.骷髅仆从,
            类型: "骷髅仆从",
            基础生命值: 15 + (配置.强化 ? 10 : 0),
            基础攻击力: 3 + (配置.强化 ? 2 : 0),
            移动率: 1.0,
            掉落概率: 0,
            基础攻击范围: 1,
            跟踪距离: 50,
            ...配置,
        });
        this.主人 = 玩家;
        this.状态 = 怪物状态.活跃;
        this.生命周期 = 30 + (配置.强化 ? 20 : 0);
    }

    选择目标() {
        if (this.仇恨 && this.仇恨.当前生命值 > 0) {
            const 距离 = Math.abs(this.x - this.仇恨.x) + Math.abs(this.y - this.仇恨.y);
            if (距离 < this.跟踪距离 && 检查视线(this.x, this.y, this.仇恨.x, this.仇恨.y, this.跟踪距离)) {
                return this.仇恨;
            }
        }
        return this.寻找最近怪物目标();
    }

    寻找最近怪物目标() {
        let 最近距离 = Infinity;
        let 最近目标 = {x:玩家.x,y:玩家.y};

        所有怪物.forEach(怪物 => {
            if (怪物.状态 === 怪物状态.活跃 && 怪物.当前生命值 > 0 && !(怪物 instanceof 骷髅仆从) && !(怪物 instanceof 远射陷阱) && !(怪物 instanceof 巡逻怪物)) {
                const 距离 = Math.abs(this.x - 怪物.x) + Math.abs(this.y - 怪物.y);
                if (距离 < 最近距离 && 检查视线(this.x, this.y, 怪物.x, 怪物.y, this.跟踪距离)) {
                    最近距离 = 距离;
                    最近目标 = 怪物;
                }
            }
        });
        this.仇恨 = 最近目标;
        return 最近目标;
    }

    尝试移动() {
        if (this.生命周期 > 0) {
            this.生命周期--;
        } else {
            this.受伤(999, '消散');
            return;
        }

        const 目标 = this.选择目标();
        if (!目标) {
            const 距离主人 = Math.abs(this.x - this.主人.x) + Math.abs(this.y - this.主人.y);
            if (距离主人 > 2) {
                this.目标路径 = this.计算路径(this.主人.x, this.主人.y);
                if (this.目标路径 && this.目标路径.length > 0) {
                    super.尝试移动();
                }
            }
            return;
        }

        const 距离目标 = Math.abs(this.x - 目标.x) + Math.abs(this.y - 目标.y);

        if (距离目标 > this.攻击范围) {
            this.目标路径 = this.计算路径(目标.x, 目标.y);
            if (this.目标路径 && this.目标路径.length > 0) {
                super.尝试移动();
            }
        }
    }
    
    尝试攻击() {
        const 目标 = this.选择目标();
        if (目标 && 深度比较(目标,this.主人)) {
             const 距离目标 = Math.abs(this.x - 目标.x) + Math.abs(this.y - 目标.y);
             if (距离目标 <= this.攻击范围) {
                 目标.受伤(this.攻击力, this);
                 计划显示格子特效(获取直线路径(this.x,this.y,目标.x,目标.y));
                 return true;
             }
        }
        return false;
    }
    
    受伤(伤害, 来源 = null) {
        if (来源 !== 玩家 && !(来源 instanceof 骷髅仆从)) {
            this.当前生命值 -= 伤害;
        }
        if (来源 instanceof 怪物) {
			            let dx = this.x - 来源.x;
			            let dy = this.y - 来源.y;
			            let 方向DX = 0, 方向DY = 0;

			            if (Math.abs(dx) > Math.abs(dy)) {
			                方向DX = Math.sign(dx) || (dy === 0 ? (prng() < 0.5 ? 1 : -1) : 0);
			            } else if (Math.abs(dy) > Math.abs(dx)) {
			                方向DY = Math.sign(dy) || (dx === 0 ? (prng() < 0.5 ? 1 : -1) : 0);
			            } else if (dx !== 0) {
			                方向DX = Math.sign(dx);
			            } else if (dy !== 0) {
			                方向DY = Math.sign(dy);
			            }

			            const 新X = this.x + 方向DX;
			            const 新Y = this.y + 方向DY;

			            if (位置是否可用(新X, 新Y, true, false) && 检查移动可行性(this.x, this.y, 新X, 新Y)) {
			                const 旧X = this.x;
			                const 旧Y = this.y;
			                this.x = 新X;
			                this.y = 新Y;
			                怪物动画状态.set(this, {
			                    旧逻辑X: 旧X, 旧逻辑Y: 旧Y,
			                    目标逻辑X: 新X, 目标逻辑Y: 新Y,
			                    视觉X: 旧X, 视觉Y: 旧Y,
			                    动画开始时间: Date.now(), 正在动画: true,
			                });
			                //添加日志(`${this.名称} 被击退了！`, "警告");
			            }
			        }
        
        if (this.当前生命值 <= 0) {
            this.恢复背景类型();
            所有怪物 = 所有怪物.filter(m => m !== this);
            玩家仆从列表 = 玩家仆从列表.filter(p => p !== this);
            计划显示格子特效([{ x: this.x, y: this.y }], "FFFFFF");
        }
    }

    绘制血条(隐藏 = false) {
        const 动画状态 = 怪物动画状态.get(this);
			        let 绘制逻辑X = this.x;
			        let 绘制逻辑Y = this.y;
			        const 正在动画 = 动画状态?.正在动画;
			
			        if (正在动画) {
			            绘制逻辑X =
			                动画状态.视觉X !== undefined
			                    ? 动画状态.视觉X
			                    : this.x;
			            绘制逻辑Y =
			                动画状态.视觉Y !== undefined
			                    ? 动画状态.视觉Y
			                    : this.y;
			        }
			
			        const 屏幕X = (绘制逻辑X - 当前相机X) * 单元格大小;
			        const 屏幕Y = (绘制逻辑Y - 当前相机Y) * 单元格大小;
        const 宽度 = 单元格大小;

        const 血条高度 = 4;
        const 血条Y = 屏幕Y - 12;
        const 血条背景色 = "#444";
        const 血条前景色 = "#90ee90";

        ctx.save();
        ctx.fillStyle = 血条背景色;
        ctx.fillRect(屏幕X, 血条Y, 宽度, 血条高度);
        const 血量百分比 = Math.max(0, (this.当前生命值 / this.生命值) * 100);
        ctx.fillStyle = 血条前景色;
        ctx.fillRect(屏幕X, 血条Y, 宽度 * (血量百分比 / 100), 血条高度);
        ctx.restore();
    }
}



    
			class 召唤师怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.召唤师怪物,
			            类型: "召唤师怪物",
			            基础生命值: 30 + (配置.强化 ? 15 : 0),
			            基础攻击力: 3 + (配置.强化 ? 1 : 0),
			            移动率: 0.8,
			            掉落物: new 能量药水({ 数量: 1 }),
			            掉落概率: 0.3,
			            基础攻击范围: 4,
			            跟踪距离: 15,
			            ...配置,
			        });
			        this.召唤冷却 = 配置.召唤冷却??(3 + (配置.强化 ? -1 : 0));
			        this.召唤冷却剩余 = 配置.召唤冷却剩余??(Math.floor(
			            prng() * this.召唤冷却
			        ));
			        this.最大召唤物数量 = 配置.最大召唤物数量??(2 + (配置.强化 ? 1 : 0));
			        this.当前召唤物列表 = [];
			        this.召唤物类 = 幽灵仆从;
			    }
			
			    尝试移动() {
			        const 我的状态 = 怪物状态表.get(this);
			        if (我的状态?.类型 === "冻结") return;
			
			        if (this.当前生命值 <= 0) return;
			
			        this.当前召唤物列表 = this.当前召唤物列表.filter(
			            (仆从) => 仆从 && 仆从.当前生命值 > 0
			        );
			
			        if (this.受伤冻结回合剩余 > 0) {
			            this.受伤冻结回合剩余--;
			            this.绘制血条();
			            return;
			        }
			
			        if (this.召唤冷却剩余 > 0) {
			            this.召唤冷却剩余--;
			        }
			
			        if (我的状态?.类型 === "魅惑") {
			            const 目标 = this.寻找最近怪物目标();
			            if (目标) {
			                const 逃离点 = this.选择逃离目标(目标.x, 目标.y, 5);
			                if (逃离点) {
			                    this.目标路径 = this.计算路径(
			                        逃离点.x,
			                        逃离点.y
			                    );
			                    if (this.目标路径) super.尝试移动();
			                }
			            }
			            this.绘制血条();
			            return;
			        }
			
			        if (
			            this.召唤冷却剩余 <= 0 &&
			            this.当前召唤物列表.length < this.最大召唤物数量
			        ) {
			            if (this.尝试召唤()) {
			                this.召唤冷却剩余 = this.召唤冷却;
			            }
			        }
			
			        const 玩家距离 =
			            Math.abs(this.x - 玩家.x) + Math.abs(this.y - 玩家.y);
			        if (玩家距离 <= this.基础攻击范围) {
			            const 逃离点 = this.选择逃离目标(玩家.x, 玩家.y, 15);
			            if (逃离点) {
			                this.目标路径 = this.计算路径(逃离点.x, 逃离点.y);
			                if (this.目标路径) super.尝试移动();
			                else {
			                }
			            } else {
			            }
			        } else {
			            const 旧X = this.x;
			            const 旧Y = this.y;
			            if (prng() < this.移动率) {
			                const 方向 = [
			                    [0, -1],
			                    [0, 1],
			                    [-1, 0],
			                    [1, 0],
			                ];
			                const [dx, dy] =
			                    方向[Math.floor(prng() * 4)];
			                const 新X = this.x + dx;
			                const 新Y = this.y + dy;
			                if (
			                    检查移动可行性(this.x, this.y, 新X, 新Y) &&
			                    位置是否可用(新X, 新Y, false)
			                ) {
			                    this.恢复背景类型();
			                    this.保存新位置类型(新X, 新Y);
			                    this.x = 新X;
			                    this.y = 新Y;
			                    地牢[新Y][新X].类型 = 单元格类型.怪物;
			                    地牢[新Y][新X].关联怪物 = this;
			                    怪物动画状态.set(this, {
			                        旧逻辑X: 旧X,
			                        旧逻辑Y: 旧Y,
			                        目标逻辑X: this.x,
			                        目标逻辑Y: this.y,
			                        视觉X: 旧X,
			                        视觉Y: 旧Y,
			                        动画开始时间: Date.now(),
			                        正在动画: true,
			                    });
			                }
			            }
			        }
			        this.绘制血条();
			    }
			
			    选择逃离目标(目标X, 目标Y, 范围 = 10) {
			        const 可达点 = [];
			        const 队列 = [{ x: this.x, y: this.y, 距离: 0 }];
			        const 已访问 = new Set([`${this.x},${this.y}`]);
			        const 怪物所在房间ID = 房间地图[this.y][this.x];
			
			        while (队列.length > 0) {
			            const 当前 = 队列.shift();
			            const 距离目标 =
			                Math.abs(当前.x - 目标X) + Math.abs(当前.y - 目标Y);
			            const 距离自身 = 当前.距离;
			
			            if (
			                距离自身 <= 范围 &&
			                距离目标 >
			                    Math.abs(this.x - 目标X) +
			                        Math.abs(this.y - 目标Y)
			            ) {
			                const 点所在房间ID = 房间地图[当前.y][当前.x];
			                if (
			                    点所在房间ID === 怪物所在房间ID ||
			                    点所在房间ID === -1 ||
			                    (已访问房间.has(点所在房间ID) &&
			                        房间列表[点所在房间ID]?.类型?.slice(
			                            0,
			                            2
			                        ) !== "隐藏")
			                ) {
			                    if (this.位置合法(当前.x, 当前.y)) {
			                        可达点.push({
			                            x: 当前.x,
			                            y: 当前.y,
			                            距离目标: 距离目标,
			                        });
			                    }
			                }
			            }
			
			            if (当前.距离 >= 范围) continue;
			
			            const 方向 = [
			                { dx: 1, dy: 0 },
			                { dx: -1, dy: 0 },
			                { dx: 0, dy: 1 },
			                { dx: 0, dy: -1 },
			            ];
			            for (const { dx, dy } of 方向) {
			                const 新X = 当前.x + dx;
			                const 新Y = 当前.y + dy;
			                const 位置键 = `${新X},${新Y}`;
			
			                if (
			                    新X >= 0 &&
			                    新X < 地牢大小 &&
			                    新Y >= 0 &&
			                    新Y < 地牢大小 &&
			                    !已访问.has(位置键)
			                ) {
			                    const 当前单元格 = 地牢[当前.y]?.[当前.x];
			                    const 目标单元格 = 地牢[新Y]?.[新X];
			                    const 移动方向 = getMoveDirection(当前.x, 当前.y, 新X, 新Y);
			                    if (目标单元格.isOneWay && 移动方向 !== 目标单元格.oneWayAllowedDirection) {
			                        continue;
			                    }
			                    if (
			                        当前单元格 &&
			                        目标单元格 &&
			                        ![
			                            单元格类型.墙壁,
			                            单元格类型.上锁的门,
			                        ].includes(目标单元格.背景类型) &&
			                        检查移动可行性(当前.x, 当前.y, 新X, 新Y) &&
			                        this.位置合法(新X, 新Y)
			                    ) {
			                        已访问.add(位置键);
			                        队列.push({
			                            x: 新X,
			                            y: 新Y,
			                            距离: 当前.距离 + 1,
			                        });
			                    }
			                }
			            }
			        }
			
			        if (可达点.length > 0) {
			            可达点.sort((a, b) => b.距离目标 - a.距离目标);
			            return 可达点[0];
			        }
			        return null;
			    }
			
			    尝试召唤() {
			        const 方向 = [
			            [-1, 0],
			            [1, 0],
			            [0, -1],
			            [0, 1],
			            [-1, -1],
			            [1, -1],
			            [-1, 1],
			            [1, 1],
			        ];
			        let 召唤成功数 = 0;
			        const 需要召唤数 =
			            1 + (this.强化 ? Math.floor(prng() * 2) : 0);
			
			        for (let i = 0; i < 需要召唤数; i++) {
			            let 放置成功 = false;
			            方向.sort(() => prng() - 0.5);
			            for (const [dx, dy] of 方向) {
			                const 召唤X = this.x + dx;
			                const 召唤Y = this.y + dy;
			                if (
			                    召唤X >= 0 &&
			                    召唤X < 地牢大小 &&
			                    召唤Y >= 0 &&
			                    召唤Y < 地牢大小 &&
			                    位置是否可用(召唤X, 召唤Y, false) &&
			                    检查直线移动可行性(
			                        this.x,
			                        this.y,
			                        召唤X,
			                        召唤Y,
			                        true
			                    )
			                ) {
			                    const 新召唤物 = new this.召唤物类({
			                        x: 召唤X,
			                        y: 召唤Y,
			                        房间ID: this.房间ID,
			                        状态: 怪物状态.活跃,
			                        召唤者: this,
			                        强化: this.强化,
			                    });
			                    放置怪物到单元格(新召唤物, 召唤X, 召唤Y);
			                    新召唤物.处理地形效果();
			                    this.当前召唤物列表.push(新召唤物);
			                    召唤成功数++;
			                    放置成功 = true;
			                    break;
			                }
			            }
			            if (!放置成功 && i === 0) return false;
			            if (!放置成功 && i > 0) break;
			        }
			
			        if (召唤成功数 > 0) {
			            添加日志(
			                `${this.类型} 召唤了 ${召唤成功数} 个 幽灵奴仆！`,
			                "信息"
			            );
			            计划显示格子特效(
			                this.当前召唤物列表
			                    .slice(-召唤成功数)
			                    .map((s) => ({ x: s.x, y: s.y })),
			                "8A2BE2",
			                0
			            );
			            return true;
			        }
			        return false;
			    }
			
			    尝试攻击() {
			        if (
			            this.召唤冷却剩余 <= 0 ||
			            this.当前召唤物列表.length < this.最大召唤物数量
			        ) {
			            return false;
			        }
			
			        if (怪物状态表.get(this)?.类型 === "魅惑") {
			            return super.尝试攻击();
			        } else {
			            return super.尝试攻击();
			        }
			    }
			
			    受伤(伤害, 来源 = null) {
			        const 原始血量 = this.当前生命值;
			        super.受伤(伤害, 来源);
			        if (原始血量 > 0 && this.当前生命值 <= 0) {
			            this.当前召唤物列表.forEach((仆从) => {
			                if (
			                    仆从 &&
			                    仆从.当前生命值 > 0 &&
			                    prng() < 0.7
			                ) {
			                    仆从.受伤(仆从.生命值 * 2, "召唤者死亡");
			                    添加日志(
			                        `${仆从.类型} 随着 ${this.类型} 的死亡而消散了。`,
			                        "信息"
			                    );
			                }
			            });
			            this.当前召唤物列表 = [];
			        }
			    }
			}
			
			class 幽灵仆从 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.幽灵仆从,
			            类型: "幽灵仆从",
			            基础生命值: 10 + (配置.强化 ? 3 : 0),
			            基础攻击力: 2 + (配置.强化 ? 1 : 0),
			            移动率: 1.0,
			            掉落物: null,
			            掉落概率: 0,
			            基础攻击范围: 1,
			            跟踪距离: 10,
			            ...配置,
			        });
			        this.生命周期 = 8 + (配置.强化 ? 4 : 0);
			        this.召唤者 = 配置.召唤者;
			    }
			
			    尝试移动() {
			        if (this.当前生命值 <= 0) return;
			
			        this.生命周期--;
			        if (this.生命周期 <= 0) {
			            this.受伤(this.生命值 * 2, "生命周期结束");
			            添加日志(`${this.类型} 消散了。`, "信息");
			            return;
			        }
			
			        if (
			            (!this.召唤者 || this.召唤者.当前生命值 <= 0) &&
			            prng() < 0.1
			        ) {
			            this.受伤(this.生命值 * 2, "召唤者死亡");
			            return;
			        }
			
			        this.目标路径 = this.计算路径(玩家.x, 玩家.y);
			        super.尝试移动();
			        this.绘制血条();
			    }
			
			    选择目标() {
			        return { x: 玩家.x, y: 玩家.y };
			    }
			}
			
			class 萨满怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.萨满怪物,
			            类型: "萨满怪物",
			            基础生命值: 35 + (配置.强化 ? 10 : 0),
			            基础攻击力: 2 + (配置.强化 ? 1 : 0),
			            移动率: 0.9,
			            掉落物: new 治疗药水({
			                数量: Math.ceil(prng() * 3),
			            }),
			            掉落概率: 0.5,
			            基础攻击范围: 1,
			            跟踪距离: 12,
			            ...配置,
			        });
			        this.治疗范围 = 配置.治疗范围??(3 + (配置.强化 ? 2 : 0));
			        this.治疗量 = 配置.治疗量??(8 + (配置.强化 ? 4 : 0));
			        this.治疗冷却 = 配置.治疗冷却??(1 - (配置.强化 ? 1 : 0));
			        this.治疗冷却剩余 = 配置.治疗冷却剩余??(Math.floor(
			            prng() * (this.治疗冷却 + 1)
			        ));
			        this.优先治疗阈值 = 配置.优先治疗阈值??0.7;
			    }
			
			    尝试移动() {
			        const 我的状态 = 怪物状态表.get(this);
			        if (
			            我的状态?.类型 === "冻结" ||
			            我的状态?.类型 === "魅惑"
			        ) {
			            super.尝试移动();
			            this.绘制血条();
			            return;
			        }
			        if (this.当前生命值 <= 0) return;
			        if (this.受伤冻结回合剩余 > 0) {
			            this.受伤冻结回合剩余--;
			            this.绘制血条();
			            return;
			        }
			
			        if (this.治疗冷却剩余 > 0) {
			            this.治疗冷却剩余--;
			        }
			
			        const 待治疗友军 = this.寻找待治疗友军();
			
			        if (待治疗友军 && this.治疗冷却剩余 <= 0) {
			            const 距离 =
			                Math.abs(this.x - 待治疗友军.x) +
			                Math.abs(this.y - 待治疗友军.y);
			            if (距离 <= this.治疗范围) {
			                this.执行治疗(待治疗友军);
			            }
			            this.目标路径 = this.计算目标路径(
			                待治疗友军.x,
			                待治疗友军.y
			            );
			            if (this.目标路径) {
			                super.尝试移动();
			            }
			
			            this.绘制血条();
			            return;
			        }
			
			        this.目标路径 = this.计算路径(玩家.x, 玩家.y);
			        super.尝试移动();
			        this.绘制血条();
			    }
			
			    尝试攻击() {
			        if (
			            怪物状态表.get(this)?.类型 === "魅惑" ||
			            怪物状态表.get(this)?.类型 === "冻结"
			        )
			            return false;
			        if (this.治疗冷却剩余 > 0) {
			            return;
			        }
			
			        const 待治疗友军 = this.寻找待治疗友军();
			        if (待治疗友军 && this.治疗冷却剩余 <= 0) {
			            const 距离 =
			                Math.abs(this.x - 待治疗友军.x) +
			                Math.abs(this.y - 待治疗友军.y);
			            if (距离 <= this.治疗范围) {
			                return false;
			            }
			        }
			
			        return super.尝试攻击();
			    }
			
			    寻找待治疗友军() {
			        let 最优先目标 = null;
			        let 最低血量百分比 = this.优先治疗阈值;
			
			        所有怪物.forEach((友军) => {
			            if (
			                友军 === this ||
			                友军.当前生命值 <= 0 ||
			                友军.当前生命值 >= 友军.生命值 ||
			                怪物状态表.get(友军)?.类型 === "魅惑"
			            )
			                return;
			            const 距离 =
			                Math.abs(this.x - 友军.x) +
			                Math.abs(this.y - 友军.y);
			
			            if (距离 <= this.治疗范围 + 3) {
			                const 血量百分比 = 友军.当前生命值 / 友军.生命值;
			                if (血量百分比 < 最低血量百分比) {
			                    最低血量百分比 = 血量百分比;
			                    最优先目标 = 友军;
			                }
			            }
			        });
			        return 最优先目标;
			    }
			
			    执行治疗(目标) {
			        const 治疗量 = this.治疗量;
			        目标.当前生命值 = Math.min(
			            目标.生命值,
			            目标.当前生命值 + 治疗量
			        );
			        this.治疗冷却剩余 = this.治疗冷却;
			        添加日志(
			            `${this.类型} 治疗了 ${目标.类型}，恢复了 ${治疗量} 点生命！`,
			            "信息"
			        );
			        目标.绘制血条();
			        目标.接受萨满治疗 = true;
			    }
			}
			
			class 大史莱姆怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.大史莱姆,
			            类型: "大史莱姆",
			            基础生命值: 40 + (配置.强化 ? 20 : 0),
			            基础攻击力: 5 + (配置.强化 ? 2 : 0),
			            移动率: 0.6, // 移动较慢
			            掉落物: new 金币({
			                数量: Math.floor(prng() * 8) + 3,
			            }),
			            掉落概率: 0.8,
			            攻击冷却: 1,
			            ...配置,
			        });
			        this.分裂数量 =配置.分裂数量??( 2 + (配置.强化 ? 1 : 0));
			    }
			
			    尝试攻击() {
			        if (super.尝试攻击()) {
			            // 攻击成功后施加缓慢效果
			            if (怪物状态表.get(this)?.类型 === "魅惑") {
			                if (this.魅惑目标怪物) {
			                    new 状态效果(
			                        "缓慢",
			                        "#888888",
			                        "慢",
			                        5,
			                        null,
			                        null,
			                        this.魅惑目标怪物
			                    );
			                }
			            } else if (this.目标?.x==玩家.x && this.目标?.y==玩家.y){
			                new 状态效果(
			                    "缓慢",
			                    "#888888",
			                    图标映射.缓慢,
			                    5,
			                    5
			                ); // 假设缓慢持续5回合
			            }
			            return true;
			        }
			        return false;
			    }
			
			    受伤(伤害, 来源 = null) {
			        const 原始血量 = this.当前生命值;
			        super.受伤(伤害, 来源);
			        // 如果死亡，则分裂
			        if (原始血量 > 0 && this.当前生命值 <= 0) {
			            this.分裂();
			        }
			    }
			
			    分裂() {
			        let 成功分裂数 = 0;
			        const 方向 = [
			            { dx: -1, dy: 0 },
			            { dx: 1, dy: 0 },
			            { dx: 0, dy: -1 },
			            { dx: 0, dy: 1 },
			            { dx: -1, dy: -1 },
			            { dx: 1, dy: -1 },
			            { dx: -1, dy: 1 },
			            { dx: 1, dy: 1 },
			        ];
			
			        for (let i = 0; i < this.分裂数量; i++) {
			            let 放置成功 = false;
			            for (const { dx, dy } of 方向) {
			                const 新X = this.x + dx;
			                const 新Y = this.y + dy;
			                if (位置是否可用(新X, 新Y) && 快速检查相邻移动(this.x, this.y, 新X, 新Y)) {
			                    let 史莱姆;
			                    if (prng() < 0.15 && this.强化) {
			                        史莱姆 = new 大史莱姆怪物({
			                            x: 新X,
			                            y: 新Y,
			                            房间ID: this.房间ID,
			                            状态: 怪物状态.活跃, // 出生即活跃
			                            强化: this.强化, // 继承强化状态
			                        });
			                        if (this.永久增益.some(b => b.类型 === '自爆')) 史莱姆.永久增益.push(新怪物.携带药水);
			                    } else {
			                        史莱姆 = new 小史莱姆怪物({
			                            x: 新X,
			                            y: 新Y,
			                            房间ID: this.房间ID,
			                            状态: 怪物状态.活跃, // 出生即活跃
			                            强化: this.强化, // 继承强化状态
			                        });
			                        if (this.永久增益.some(b => b.类型 === '自爆')) 史莱姆.永久增益.push(新怪物.携带药水);
			                    }
			                    放置怪物到单元格(史莱姆, 新X, 新Y);
			                    成功分裂数++;
			                    放置成功 = true;
			                    // 移除已用方向，避免重复放置
			                    方向.splice(
			                        方向.findIndex(
			                            (d) => d.dx === dx && d.dy === dy
			                        ),
			                        1
			                    );
			                    break;
			                }
			            }
			            // 如果所有方向都试过还失败，就不再尝试分裂更多
			            if (!放置成功) break;
			        }
			        if (成功分裂数 > 0) {
			            添加日志(
			                `${this.类型} 分裂成了 ${成功分裂数} 个小史莱姆！`,
			                "警告"
			            );
			        }
			    }
			}
			
			class 小史莱姆怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.小史莱姆,
			            类型: "小史莱姆",
			            基础生命值: 15 + (配置.强化 ? 10 : 0),
			            基础攻击力: 3 + (配置.强化 ? 1 : 0),
			            移动率: 1, // 移动较快
			            掉落物: new 金币({
			                数量: Math.floor(prng() * 3) + 1,
			            }),
			            掉落概率: 0.5,
			            攻击冷却: 0, // 攻击更快
			            基础攻击范围: 1,
			            基础移动距离: 2, // 可以移动两格
			            ...配置,
			        });
			    }
			
			    尝试攻击() {
			        if (super.尝试攻击()) {
			            if (怪物状态表.get(this)?.类型 === "魅惑") {
			                if (this.魅惑目标怪物) {
			                    new 状态效果(
			                        "缓慢",
			                        "#888888",
			                        图标映射.缓慢,
			                        3,
			                        null,
			                        null,
			                        this.魅惑目标怪物
			                    );
			                }
			            } else {
			                new 状态效果(
			                    "缓慢",
			                    "#888888",
			                    图标映射.缓慢,
			                    3,
			                    3
			                ); // 缓慢持续3回合
			            }
			            return true;
			        }
			        return false;
			    }
			}
			
			class 瞬移怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.瞬移怪物,
			            类型: "瞬移怪物",
			            基础生命值: 25 + (配置.强化 ? 15 : 0),
			            基础攻击力: 2 + (配置.强化 ? 3 : 0),
			            移动率: 0.85,
			            掉落物: new 跃迁卷轴({
			                数量: 1,
			                强化: 配置.强化 ?? false,
			            }),
			            掉落概率: 0.4,
			            基础攻击范围: 2,
			            受伤冻结回合: 0, // 受伤不冻结，可能直接瞬移走
			            ...配置,
			        });
			        this.瞬移几率 = 配置.瞬移几率??(0.6 + (配置.强化 ? 0.2 : 0));
			        this.受击瞬移几率 = 配置.受击瞬移几率??(0.4 + (配置.强化 ? 0.2 : 0));
			    }
			
			    尝试移动() {
			        const 我的状态 = 怪物状态表.get(this);
			        if (我的状态?.类型 === "冻结") return;
			
			        if (this.当前生命值 <= 0) return;
			        if (房间地图[玩家.y][玩家.x] === 0) return; // 教程层不动
			
			        // 魅惑状态下的移动
			        if (我的状态?.类型 === "魅惑") {
			            const 目标 = this.寻找最近怪物目标();
			            if (目标 && prng() < this.瞬移几率) {
			                this.瞬移到(目标.x, 目标.y, 5); // 尝试瞬移到目标怪物附近
			            } else if (目标) {
			                // 不瞬移则正常寻路移动
			                this.目标路径 = this.计算路径(目标.x, 目标.y);
			                super.尝试移动(); // 调用基类移动
			            }
			            this.绘制血条();
			            return; // 处理完魅惑移动后返回
			        }
			
			        // 正常状态下的移动
			        const 玩家距离 =
			            Math.abs(this.x - 玩家.x) + Math.abs(this.y - 玩家.y);
			        if (
			            玩家距离 <= this.跟踪距离 &&
			            prng() < this.瞬移几率
			        ) {
			            this.瞬移到(玩家.x, 玩家.y, 3); // 尝试瞬移到玩家附近
			        } else {
			            // 不瞬移则正常寻路移动
			            if (this.目标路径.length > 0 && this.追击玩家中) {
			                super.尝试移动(); // 调用基类移动
			            }
			        }
			        this.绘制血条();
			    }
			
			    尝试攻击() {
			        if (怪物状态表.get(this)?.类型 === "冻结") return false;
			        if (this.攻击冷却回合剩余 > 0) {
			            this.攻击冷却回合剩余 -= 1;
			            return false;
			        }
			
			        if (怪物状态表.get(this)?.类型 === "魅惑") {
			            const { x: 目标X, y: 目标Y } = this.寻找最近怪物目标();
			            this.通向目标路径 = this.计算目标路径(目标X, 目标Y);
			            if (this.通向目标路径 === null) return false;
			            if (this.通向目标路径.length <= this.攻击范围) {
			                if (this.魅惑目标怪物) {
			                    this.魅惑目标怪物.受伤(this.攻击力, this);
			                    this.攻击冷却回合剩余 = this.攻击冷却;
			                    计划显示格子特效(this.通向目标路径);
			                    return true;
			                }
			            }
			        } else {
			            this.通向目标路径 = this.计算目标路径(玩家.x, 玩家.y);
			            if (this.通向目标路径 === null) return false;
			            if (this.通向目标路径.length <= this.攻击范围) {
			                伤害玩家(this.攻击力, this);
			                this.攻击冷却回合剩余 = this.攻击冷却;
			                计划显示格子特效(this.通向目标路径);
			                return true;
			            }
			        }
			        return false;
			    }
			
			    瞬移到(目标X, 目标Y, 范围) {
			        const 候选位置 = [];
			        const 搜索范围 = 范围 + 2; // 稍微扩大搜索范围以找到更多候选点
			
			        // 1. 查找目标点周围的可用格子
			        for (let dx = -范围; dx <= 范围; dx++) {
			            for (let dy = -范围; dy <= 范围; dy++) {
			                if (dx === 0 && dy === 0) continue;
			                const 新X = 目标X + dx;
			                const 新Y = 目标Y + dy;
			                if (
			                    新X >= 0 &&
			                    新X < 地牢大小 &&
			                    新Y >= 0 &&
			                    新Y < 地牢大小 &&
			                    位置是否可用(新X, 新Y, false)
			                ) {
			                    候选位置.push({ x: 新X, y: 新Y });
			                }
			            }
			        }
			
			        // 2. 筛选出 BFS 可达的格子
			        const 可达位置 = 候选位置.filter((pos) =>
			            检查直线移动可行性(this.x, this.y, pos.x, pos.y, true)
			        );
			
			        if (可达位置.length > 0) {
			            const 目标位置 =
			                可达位置[
			                    Math.floor(prng() * 可达位置.length)
			                ];
			            // 保存旧位置用于恢复单元格类型
			            const 旧X = this.x;
			            const 旧Y = this.y;
			
			            this.恢复背景类型(); // 恢复旧位置单元格
			            this.保存新位置类型(目标位置.x, 目标位置.y); // 保存新位置背景类型
			            this.x = 目标位置.x;
			            this.y = 目标位置.y;
			            地牢[this.y][this.x].类型 = 单元格类型.怪物;
			            地牢[this.y][this.x].关联怪物 = this;
			            this.处理地形效果();
			            怪物动画状态.set(this, {
			                旧逻辑X: 旧X,
			                旧逻辑Y: 旧Y,
			                目标逻辑X: this.x,
			                目标逻辑Y: this.y,
			                视觉X: 旧X,
			                视觉Y: 旧Y,
			                动画开始时间: Date.now(),
			                正在动画: true,
			            });
			            添加日志(`${this.类型} 瞬移了！`, "信息");
			        }
			    }
			    瞬移逃跑() {
			        const 范围 = 8; // 逃跑瞬移范围更大
			        const 候选位置 = [];
			        // 1. 查找自身周围的可用格子作为逃跑候选
			        for (let dx = -范围; dx <= 范围; dx++) {
			            for (let dy = -范围; dy <= 范围; dy++) {
			                if (dx === 0 && dy === 0) continue;
			                const 新X = this.x + dx;
			                const 新Y = this.y + dy;
			                if (
			                    新X >= 0 &&
			                    新X < 地牢大小 &&
			                    新Y >= 0 &&
			                    新Y < 地牢大小 &&
			                    位置是否可用(新X, 新Y, false)
			                ) {
			                    const 距离玩家 =
			                        Math.abs(新X - 玩家.x) +
			                        Math.abs(新Y - 玩家.y);
			                    const 距离自身 = Math.abs(dx) + Math.abs(dy);
			                    // 优先选择远离玩家的位置
			                    if (
			                        距离玩家 >
			                        Math.abs(this.x - 玩家.x) +
			                            Math.abs(this.y - 玩家.y)
			                    ) {
			                        候选位置.push({
			                            x: 新X,
			                            y: 新Y,
			                            距离玩家: 距离玩家,
			                            距离自身: 距离自身,
			                        });
			                    }
			                }
			            }
			        }
			
			        // 2. 筛选出 BFS 可达的逃跑位置
			        const 可达逃跑位置 = 候选位置.filter(
			            (pos) =>
			                检查直线移动可行性(
			                    this.x,
			                    this.y,
			                    pos.x,
			                    pos.y,
			                    true
			                ) // 允许较长路径
			        );
			
			        if (可达逃跑位置.length > 0) {
			            // 3. 从可达位置中选择最优（最远）
			            可达逃跑位置.sort((a, b) => b.距离玩家 - a.距离玩家); // 按距离玩家远近排序
			            const 目标位置 = 可达逃跑位置[0]; // 选择最远的
			
			            // 保存旧位置
			            const 旧X = this.x;
			            const 旧Y = this.y;
			
			            this.恢复背景类型(); // 恢复旧位置
			            this.保存新位置类型(目标位置.x, 目标位置.y); // 保存新位置
			            this.x = 目标位置.x;
			            this.y = 目标位置.y;
			            地牢[this.y][this.x].类型 = 单元格类型.怪物;
			            地牢[this.y][this.x].关联怪物 = this;
			            添加日志(`${this.类型} 瞬移逃跑了！`, "信息");
			            this.处理地形效果();
			            怪物动画状态.set(this, {
			                旧逻辑X: 旧X,
			                旧逻辑Y: 旧Y,
			                目标逻辑X: this.x,
			                目标逻辑Y: this.y,
			                视觉X: 旧X,
			                视觉Y: 旧Y,
			                动画开始时间: Date.now(),
			                正在动画: true,
			            });
			        }
			        // 如果没有可达的逃跑位置，则不瞬移
			    }
			
			    受伤(伤害, 来源 = null) {
			        const 原始血量 = this.当前生命值;
			        if (来源 instanceof 狙击金币枪) {
			             super.受伤(伤害, 来源);
			             return;
			        }
			
			        // 有几率瞬移逃跑
			        if (
			            原始血量 > 0 &&
			            this.当前生命值 > 0 &&
			            prng() < this.受击瞬移几率
			        ) {
			            this.瞬移逃跑();
			            return;
			        }
			        super.受伤(伤害, 来源);
			    }
			}
			
			class 伪装怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        const 伪装物品列表 = [
			            { 图标: 图标映射.药水, 名称: "药水" },
			            { 图标: 图标映射.卷轴, 名称: "卷轴" },
			            { 图标: 图标映射.金币, 名称: "金币" },
			        ];
			        let 伪装 =
			            伪装物品列表[
			                Math.floor(prng() * 伪装物品列表.length)
			            ];
			
			        if (配置.伪装成) {
			            伪装 = {
			                图标: 图标映射[配置.伪装成],
			                名称: 配置.伪装成,
			            };
			        }
			
			        super({
			            类型: "伪装怪物",
			            图标: 图标映射.伪装怪物,
			            基础生命值: 30 + (配置.强化 ? 10 : 0),
			            基础攻击力: 7 + (配置.强化 ? 3 : 0),
			            移动率: 0, // 初始不动
			            掉落物: new 隐身药水({}),
			            掉落概率: 0.9,
			            基础攻击范围: 1,
			            ...配置,
			        });
			        this.伪装状态 = true;
			        this.图标 = 伪装.图标;
			        this.触发距离 = 配置.触发距离??1;
			        this.偷袭伤害 = 配置.偷袭伤害??(12 + (配置.强化 ? 8 : 0));
			    }
			    尝试移动() {
			        if (this.当前生命值 <= 0) return;
			
			        if (this.伪装状态) {
			            const 玩家距离 =
			                Math.abs(this.x - 玩家.x) +
			                Math.abs(this.y - 玩家.y);
			            if (玩家距离 <= this.触发距离) {
			                this.解除伪装();
			            } else {
			                return;
			            }
			        }
			
			        if (!this.伪装状态) {
			            super.尝试移动();
			        }
			        this.绘制血条();
			    }
			
			    解除伪装() {
			        if (!this.伪装状态) return;
			        显示通知(`一个${this.类型}显现了！`, "警告");
			        添加日志(
			            `伪装的 ${this.图标} 原来是 ${this.类型}！`,
			            "警告"
			        );
			        this.伪装状态 = false;
			        this.图标 = 图标映射.伪装怪物;
			        this.移动率 = 0.7;
			        this.状态 = 怪物状态.活跃;
			
			        const 玩家距离 =
			            Math.abs(this.x - 玩家.x) + Math.abs(this.y - 玩家.y);
			        if (玩家距离 <= 2) {
			        伤害玩家(this.偷袭伤害, this);
			        显示通知(`它对你发动了突然袭击！`, "错误");
			        }
			
			        this.绘制血条();
			        绘制();
			    }
			
			    绘制血条(隐藏血条 = false) {
			        if (!this.伪装状态) {
			            super.绘制血条(隐藏血条);
			        } else if (this.血条元素) {
			            this.血条元素.style.display = "none";
			        }
			    }
			
			    尝试攻击() {
			        if (!this.伪装状态) {
			            return super.尝试攻击();
			        }
			        return false;
			    }
			
			    受伤(伤害, 来源 = null) {
			        if (this.伪装状态) {
			            this.解除伪装();
			        }
			        super.受伤(伤害, 来源);
			    }
			}
			
			class 炸弹怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            基础移动距离: 配置.基础移动距离 ?? 2,
			            图标: 图标映射.炸弹怪物,
			            类型: "炸弹怪物",
			            掉落物: new 炸弹({
			                数量: Math.floor(prng() * 5) + 1,
			                强化: 配置.强化 || false,
			            }),
			            房间ID: 配置.房间ID || null,
			            强化: 配置.强化 || false,
			            x: 配置.x || null,
			            y: 配置.y || null,
			            状态: 配置.状态 || 怪物状态.休眠,
			            生命值: 配置.基础生命值 || 45,
			            基础攻击力: 配置.基础攻击力 || 3,
			        });
			        this.携带炸弹 = 配置.携带炸弹??true;
			    }
			
			    尝试移动() {
			        if (!this.携带炸弹) {
			            super.尝试移动();
			            return;
			        }
			
			        this.目标路径 = this.计算路径(this.目标.x, this.目标.y);
			        const 玩家距离 = this.目标路径 ? this.目标路径.length - 1 : Infinity;
			
			        if (玩家距离 <= this.攻击范围) {
			            this.放置炸弹();
			            return;
			        }
			        
			
			        if (this.目标路径 === null) {
			            this.尝试摧毁障碍物()
			                return;
			            
			        }
			        const 下一步 =
			                this.目标路径[
			                    Math.min(
			                        this.移动距离 - 1,
			                        this.目标路径.length - 1
			                    )
			                ];
			            let 最终位置 = null;
			            if (下一步) {
			                const dx = 下一步.x - this.x;
			                const dy = 下一步.y - this.y;
			                最终位置 = this.规划移动路径(dx, dy);
			            }
			        if(!最终位置 || (最终位置.x === this.x && 最终位置.y === this.y)) {
			        this.尝试摧毁障碍物()
			                return;
			            
			        }
			
			        return super.尝试移动();
			    }
			
			    尝试摧毁障碍物() {
			        const 障碍物列表 = [];
			        const 搜索范围 = 8;
			        for (let dy = -搜索范围; dy <= 搜索范围; dy++) {
			            for (let dx = -搜索范围; dx <= 搜索范围; dx++) {
			                const x = this.x + dx;
			                const y = this.y + dy;
			                if(x<0 || x>=地牢大小 || y<0 || y>=地牢大小) continue;
			                const 单元格 = 地牢[y][x];
			                if (单元格 && 单元格.关联物品 instanceof 已放置的障碍物) {
			                    障碍物列表.push(单元格.关联物品);
			                }
			            }
			        }
			        if(障碍物列表.length === 0) return false;
			
			        let 最近障碍物 = null;
			        let 最短路径 = null;
			        let 最小距离 = Infinity;
			        障碍物列表.forEach(障碍物 => {
			            const 路径 = this.计算路径(障碍物.x, 障碍物.y);
			            if (路径 && 路径.length < 最小距离) {
			                最小距离 = 路径.length;
			                最近障碍物 = 障碍物;
			                最短路径 = 路径;
			            }
			        });
			
			        if (最近障碍物) {
			            if (最小距离 <= 2) {
			                this.放置炸弹(最近障碍物.x, 最近障碍物.y);
			                return true;
			            } else {
			                this.目标路径 = 最短路径;
			                super.尝试移动();
			                return true;
			            }
			        }
			        return false;
			    }
			
			    放置炸弹(目标X, 目标Y) {
			         if (当前天气效果.includes("严寒")) {
			            return;
			        }
			
			        const 扔出炸弹 = new 炸弹({ 能否拾起: false, 来源: '怪物', 颜色索引: 4 });
			        let 放置X = 目标X, 放置Y = 目标Y;
			
			        if (目标X === undefined || 目标Y === undefined) {
			            const 玩家放置结果 = 玩家放置物品(扔出炸弹);
			            if(玩家放置结果.x === null) return;
			            放置X = 玩家放置结果.x;
			            放置Y = 玩家放置结果.y;
			        } else {
			             const 方向 = [[0, -1], [0, 1], [-1, 0], [1, 0]];
			             let 最佳位置 = null;
			             for(const [dx, dy] of 方向) {
			                 const x = 目标X + dx;
			                 const y = 目标Y + dy;
			                 if(位置是否可用(x, y, false)){
			                    最佳位置 = {x, y};
			                    break;
			                 }
			             }
			             if(!最佳位置) return;
			             放置X = 最佳位置.x;
			             放置Y = 最佳位置.y;
			             放置物品到单元格(扔出炸弹,放置X,放置Y);
			        }
			
			        if (放置X !== null && 放置Y !== null) {
			            扔出炸弹.使用(false, 放置X, 放置Y);
			            setTimeout(()=>this.基础移动距离 = 1,1000);
			            if (当前层数 !== 10) {
			                this.携带炸弹 = false;
			                this.图标 = 图标映射.怪物;
			            }
			        }
			    }
			}
			class 旋风怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.旋风怪物,
			            类型: "旋风怪物",
			            基础生命值: 38 + (配置.强化 ? 18 : 0),
			            基础攻击力: 3 + (配置.强化 ? 1 : 0), // 直接攻击力不高
			            移动率: 0.75,
			            掉落物: new 追踪风弹({
			                数量: Math.floor(prng() * 10) + 5,
			                强化: 配置.强化,
			            }),
			            掉落概率: 0.6,
			            基础攻击范围: 1, // 主要靠旋风
			            跟踪距离: 15,
			            ...配置,
			        });
			        this.召唤冷却 = 配置.召唤冷却??(4 + (配置.强化 ? -1 : 0)); // 召唤间隔
			        this.召唤冷却剩余 = 配置.召唤冷却剩余??(Math.floor(
			            prng() * (this.召唤冷却 + 1)
			        ));
			        this.最大召唤物数量 = 配置.最大召唤物数量??(1 + (配置.强化 ? 1 : 0)); // 同时存在的旋风数量
			        this.当前召唤物列表 = [];
			        this.召唤物类 = 旋风; // 召唤旋风怪物
			    }
			
			    尝试移动() {
			        const 我的状态 = 怪物状态表.get(this);
			        if (我的状态?.类型 === "冻结") return;
			
			        if (this.当前生命值 <= 0) return;
			
			        // 清理已消失的召唤物
			        this.当前召唤物列表 = this.当前召唤物列表.filter(
			            (旋) => 旋 && 旋.当前生命值 > 0
			        );
			
			        if (this.受伤冻结回合剩余 > 0) {
			            this.受伤冻结回合剩余--;
			            this.绘制血条();
			            return;
			        }
			
			        // 冷却处理
			        if (this.召唤冷却剩余 > 0) {
			            this.召唤冷却剩余--;
			        }
			
			        // 尝试召唤
			        if (
			            this.召唤冷却剩余 <= 0 &&
			            this.当前召唤物列表.length < this.最大召唤物数量
			        ) {
			            if (this.尝试召唤()) {
			                this.召唤冷却剩余 = this.召唤冷却;
			                this.绘制血条();
			                return; // 召唤成功后本回合可能不再移动或攻击
			            }
			        }
			
			        super.尝试移动();
			        this.绘制血条();
			    }
			
			    尝试召唤() {
			        const 方向 = [
			            [-1, 0],
			            [1, 0],
			            [0, -1],
			            [0, 1],
			            [-1, -1],
			            [1, -1],
			            [-1, 1],
			            [1, 1],
			        ];
			        let 召唤成功数 = 0;
			        const 需要召唤数 = 1; // 一次只召唤一个
			
			        for (let i = 0; i < 需要召唤数; i++) {
			            let 放置成功 = false;
			            方向.sort(() => prng() - 0.5); // 随机方向
			            for (const [dx, dy] of 方向) {
			                const 召唤X = this.x + dx;
			                const 召唤Y = this.y + dy;
			                if (
			                    召唤X >= 0 &&
			                    召唤X < 地牢大小 &&
			                    召唤Y >= 0 &&
			                    召唤Y < 地牢大小 &&
			                    位置是否可用(召唤X, 召唤Y, false)
			                ) {
			                    const 新召唤物 = new this.召唤物类({
			                        x: 召唤X,
			                        y: 召唤Y,
			                        房间ID: this.房间ID,
			                        状态: 怪物状态.活跃,
			                        强化: this.强化,
			                    });
			                    放置怪物到单元格(新召唤物, 召唤X, 召唤Y);
			                    this.当前召唤物列表.push(新召唤物);
			                    召唤成功数++;
			                    放置成功 = true;
			                    break;
			                }
			            }
			            if (!放置成功) return false; // 无法放置则召唤失败
			        }
			
			        if (召唤成功数 > 0) {
			            添加日志(`${this.类型} 释放了一个旋风！`, "信息");
			            计划显示格子特效(
			                this.当前召唤物列表
			                    .slice(-召唤成功数)
			                    .map((s) => ({ x: s.x, y: s.y })),
			                "ADD8E6",
			                0
			            ); // 淡蓝色特效
			            return true;
			        }
			        return false;
			    }
			
			    // 可以保留基础攻击，或者让它完全依赖旋风
			    尝试攻击() {
			        super.尝试攻击();
			        return true; // 目前主要靠旋风
			    }
			
			    受伤(伤害, 来源 = null) {
			        const 原始血量 = this.当前生命值;
			        super.受伤(伤害, 来源);
			        // 死亡时驱散场上所有由它召唤的旋风（可选）
			        if (原始血量 > 0 && this.当前生命值 <= 0) {
			            this.当前召唤物列表.forEach((旋) => {
			                if (旋 && 旋.当前生命值 > 0) {
			                    旋.受伤(旋.生命值 * 2, "召唤者死亡"); // 强制移除
			                }
			            });
			            this.当前召唤物列表 = [];
			        }
			    }
			}
			class 旋风 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.旋风,
			            类型: "旋风",
			            基础生命值: 5 + (配置.强化 ? 5 : 0), // 很脆弱
			            基础攻击力: 0, // 不直接攻击
			            移动率: 1.0, // 移动较快
			            掉落概率: 0,
			            基础攻击范围: 0, // 接触触发
			            跟踪距离: 30, // 追踪范围大
			            受伤冻结回合: 0, // 不受冻结影响移动
			            基础移动距离: 2, // 移动快
			            ...配置,
			        });
			        this.生命周期 = 10 + (配置.强化 ? 5 : 0); // 存在时间
			    }
			
			    尝试移动() {
			        if (this.当前生命值 <= 0) return;
			
			        // 生命周期处理
			        this.生命周期--;
			        if (this.生命周期 <= 0) {
			            this.受伤(this.生命值 * 2, "生命周期结束"); // 时间到了消失
			            添加日志(`${this.类型} 消散了。`, "信息");
			            this.移除自身();
			            return;
			        }
			        let { x, y } = this.选择目标();
			        // 碰撞检测与效果触发
			        if (this.x === x && this.y === y) {
			            this.触发效果();
			        }
			        this.目标路径 = this.计算目标路径(x, y);
			        if (this.当前生命值 <= 0) return;
			        if (房间地图[玩家.y][玩家.x] === 0) return;
			        if (
			            this.目标路径.length === 0 ||
			            (prng() > this.移动率 && !切换动画) ||
			            this.跟踪距离 < this.目标路径.length
			        ) {
			            this.追击玩家中 = false;
			            return;
			        }
			
			        const 旧X = this.x;
			        const 旧Y = this.y;
			        const 下一步 =
			            this.目标路径[
			                Math.min(
			                    this.移动距离 - 1,
			                    this.目标路径.length - 1
			                )
			            ];
			        if (下一步) {
			            const dx = 下一步.x - this.x;
			            const dy = 下一步.y - this.y;
			
			            // 规划实际可移动位置
			            const 最终位置 = this.规划移动路径(dx, dy);
			            if (!最终位置) return;
			            this.恢复背景类型();
			            this.保存新位置类型(最终位置.x, 最终位置.y);
			            this.x = 最终位置.x;
			            this.y = 最终位置.y;
			            地牢[this.y][this.x].类型 = 单元格类型.怪物;
			            地牢[this.y][this.x].关联怪物 = this;
			            怪物动画状态.set(this, {
			                旧逻辑X: 旧X,
			                旧逻辑Y: 旧Y,
			                目标逻辑X: this.x,
			                目标逻辑Y: this.y,
			                视觉X: 旧X,
			                视觉Y: 旧Y,
			                动画开始时间: Date.now(),
			                正在动画: true,
			            });
			        }
			        if (this.x === x && this.y === y) {
			            this.触发效果();
			            return;
			        }
			        this.绘制血条(true); // 强制不显示血条
			    }
			
			    绘制血条(隐藏血条 = true) {
			        // 旋风不显示血条
			        if (this.血条元素) {
			            this.血条元素.style.display = "none";
			        }
			    }
			
			    尝试攻击() {
			        let { x, y } = this.选择目标();
			        if (this.x === x && this.y === y) {
			            this.触发效果();
			        }
			        return false;
			    }
			    获得效果(状态效果) {
			        状态效果.移除状态();
			        return false;
			    }
			    触发效果() {
			        添加日志(`${this.类型} 撞到了你，释放了气流！`, "警告");
			        this.受伤(this.生命值 * 2, "效果触发");
			        this.移除自身();
			        const 中心X = this.x;
			        const 中心Y = this.y;
			
			        // 在3x3区域生成旋风物品
			        for (let dx = -1; dx <= 1; dx++) {
			            for (let dy = -1; dy <= 1; dy++) {
			                // if (dx === 0 && dy === 0) continue; // 不在中心生成
			                const x = 中心X + dx;
			                const y = 中心Y + dy;
			
			                if (
			                    x >= 0 &&
			                    x < 地牢大小 &&
			                    y >= 0 &&
			                    y < 地牢大小
			                ) {
			                    // 检查目标格子是否可放置（非墙、非上锁门）
			                    const 单元格 = 地牢[y][x];
			                    if (
			                        单元格 &&
			                        ![
			                            单元格类型.墙壁,
			                            单元格类型.上锁的门,
			                        ].includes(单元格.背景类型) &&
			                        !单元格.关联物品
			                    ) {
			                        const 旋风物品实例 = new 旋风物品({});
			                        // 使用放置物品到单元格，并将其添加到所有计时器列表
			                        if (放置物品到单元格(旋风物品实例, x, y)) {
			                            旋风物品实例.x = x;
			                            旋风物品实例.y = y;
			                            所有计时器.push(旋风物品实例); // 添加到计时器列表
			                            计划显示格子特效(
			                                [{ x: x, y: y }],
			                                "90EE90"
			                            ); // 显示生成特效
			                        }
			                    }
			                }
			            }
			        }
			        new 状态效果(
			            "眩晕",
			            效果颜色编号映射[效果名称编号映射.眩晕],
			            图标映射.眩晕,
			            2
			        );
			    }
			
			    移除自身() {
			        this.恢复背景类型();
			        if (this.血条元素) this.血条元素.remove();
			        所有怪物 = 所有怪物.filter((m) => m !== this);
			        绘制(); // 更新画面
			    }
			}
			class 盔甲怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.盔甲怪物,
			            类型: "盔甲怪物",
			            强化: 配置.强化 || false,
			            掉落物: new 钢制板甲({
			                数量: 1,
			            }),
			            掉落概率: 0.5,
			            房间ID: 配置.房间ID || null,
			            x: 配置.x || null,
			            y: 配置.y || null,
			            状态: 配置.状态 || 怪物状态.休眠,
			            基础生命值: 配置.基础生命值 || 35,
			        });
			        if (this.掉落物) {
			            this.尝试添加随机词条到掉落物(this.掉落物);
			        }
			    }
			}
			class 敏捷怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            基础移动距离: 3,
			            跟踪距离: 40,
			            图标: 图标映射.敏捷怪物,
			            类型: "敏捷怪物",
			            强化: 配置.强化 || false,
			            掉落物: new 迅捷卷轴({
			                数量: 1,
			            }),
			            掉落概率: 0.3,
			            房间ID: 配置.房间ID || null,
			            x: 配置.x || null,
			            y: 配置.y || null,
			            状态: 配置.状态 || 怪物状态.休眠,
			            基础生命值: 配置.基础生命值 || 28,
			            基础攻击力: 配置.基础攻击力 || 4,
			            移动率: 配置.移动率 || 0.85,
			        });
			    }
			}
			class 远攻怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.远攻怪物,
			            类型: "远攻怪物",
			            掉落物: new 橡木法杖({
			                数量: 1,
			            }),
			            掉落概率: 0.3,
			            房间ID: 配置.房间ID || null,
			            x: 配置.x || null,
			            y: 配置.y || null,
			            状态: 配置.状态 || 怪物状态.休眠,
			            强化: 配置.强化 || false,
			            基础生命值: 配置.基础生命值 || 35,
			            基础攻击力: 配置.基础攻击力 || 3,
			            移动率: 配置.移动率 || 0.7,
			            基础攻击范围: 3,
			            跟踪距离: 25,
			        });
			        if (this.掉落物) {
			            this.尝试添加随机词条到掉落物(this.掉落物);
			        }
			    }
			}
			class 仙人掌怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        const 随机品质 =
			            1 + Math.floor(prng() * prng() * 4);
			        const 荆棘卷轴实例 = new 附魔卷轴({
			            品质: 随机品质, // 使用随机品质
			            已解锁: true, // 默认掉落已鉴定
			            强化: 配置.强化 || false, // 可选：继承强化状态
			        });
			
			        // 手动设置附魔效果为荆棘
			        const 效果名 = "荆棘附魔";
			        const 效果索引 = 荆棘卷轴实例.效果名.indexOf(效果名);
			
			        if (效果索引 !== -1) {
			            荆棘卷轴实例.附魔效果 = 荆棘卷轴实例.附魔池[效果索引]; // 设置效果函数
			            荆棘卷轴实例.效果描述 = `为防御装备附加${效果名} ${"I".repeat(
			                随机品质
			            )}级`; // 更新描述
			            荆棘卷轴实例.名称 = `${效果名}卷轴`; // 可以考虑更新名称
			            荆棘卷轴实例.颜色索引 = 随机品质 - 1; // 根据品质更新颜色
			        }
			        super({
			            图标: 图标映射.仙人掌怪物,
			            类型: "仙人掌怪物",
			            掉落物: 荆棘卷轴实例,
			            掉落概率: 0.3 + (配置.强化 ? 0.15 : 0),
			            房间ID: 配置.房间ID || null,
			            x: 配置.x || null,
			            y: 配置.y || null,
			            状态: 配置.状态 || 怪物状态.休眠,
			            强化: 配置.强化 || false,
			            生命值: 配置.基础生命值 || 30,
			            基础攻击力: 配置.基础攻击力 || 3,
			            移动率: 配置.移动率 || 0.7,
			        });
			    }
			    受伤(伤害, 来源 = null) {
			        if (来源 === "玩家") {
			            伤害玩家(this.攻击力, this);
			        }
			        super.受伤(伤害, 来源);
			    }
			}
			class 冰冻怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.冰冻怪物,
			            类型: "冰冻怪物",
			            掉落物: new 冰盾({
			                数量: 1,
			            }),
			            掉落概率: 配置.掉落概率 || 0.3,
			            房间ID: 配置.房间ID || null,
			            x: 配置.x || null,
			            y: 配置.y || null,
			            状态: 配置.状态 || 怪物状态.休眠,
			            强化: 配置.强化 || false,
			            基础生命值: 配置.基础生命值 || 23,
			            基础攻击力: 配置.基础攻击力 || 3,
			            移动率: 配置.移动率 || 0.7,
			            基础攻击范围: 1,
			            跟踪距离: 25,
			            攻击冷却: 4,
			        });
			        if (this.掉落物) {
			            this.尝试添加随机词条到掉落物(this.掉落物);
			        }
			    }
			    位置合法(x, y) {
			        if (!super.位置合法(x,y)) return false;
			        if (
			            地牢[y][x].类型 === 单元格类型.物品 &&
			            地牢[y][x].关联物品 instanceof 火焰物品
			        ) {
			            return false;
			        }
			        return true;
			    }
			    尝试攻击() {
			        if (
			            玩家状态.some((s) => s.类型 === "冻结") &&
			            this.攻击冷却回合剩余 === 0
			        ) {
			            //倘若已有效果则不攻击，缓冲攻击冷却给其它怪物起辅助作用
			            return false;
			        }
			        if (super.尝试攻击()) {
			            if (怪物状态表.get(this)?.类型 === "魅惑") {
			                new 状态效果(
			                    "冻结",
			                    "#2196F3",
			                    "冻",
			                    3,
			                    null,
			                    null,
			                    this.魅惑目标怪物
			                );
			            } else if (
			                this.目标?.x == 玩家.x && this.目标?.y==玩家.y &&
			                !Array.from({ length: 装备栏每页装备数 }, (_, i) =>
			                    玩家装备.get(
			                        当前装备页 * 装备栏每页装备数 + i + 1
			                    )
			                )
			                    .filter((v) => v != null)
			                    .some((item) => item.名称 === "冰盾")
			            ) {
			                new 状态效果(
			                    "冻结",
			                    "#2196F3",
			                    图标映射.冰冻怪物,
			                    3,
			                    3
			                ); // 添加冻结效果
			            }
			        }
			    }
			    获得效果(状态效果) {
			        if (状态效果.类型 === "冻结") {
			            状态效果.移除状态();
			            return false;
			        }
			        if (状态效果.类型 === "火焰") {
			            this.恢复背景类型();
			            
			            所有怪物 = 所有怪物.filter((m) => m !== this);
			            const 新怪物 = new 怪物({
			                x: this.x,
			                y: this.y,
			                当前生命值: this.当前生命值,
			                基础生命值: this.生命值,
			            });
			            放置怪物到单元格(新怪物, this.x, this.y);
			            新怪物.绘制血条();
			        }
			        return true;
			    }
			}
			class 米诺陶 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.米诺陶,
			            类型: "米诺陶",
			            基础生命值: 100 + (配置.强化 ? 150 : 0),
			            基础攻击力: 6 + (配置.强化 ? 5 : 0),
			            移动率: 0.9,
			            掉落概率: 1.0,
			            基础攻击范围: 1,
			            跟踪距离: 1000,
			            基础移动距离: 1,
			            攻击冷却: 1,
			            残血逃跑: false,
			            ...配置,
			        });
			        this.技能冷却 = {
			            高速冲撞: 12,
			            喷火: 5,
			            喷射毒液: 10,
			            战争践踏: 8,
			            异墙凸起: 12,
			        };
			        this.技能冷却剩余 = {
			            高速冲撞: 0,
			            喷火: Math.floor(prng() * 3),
			            喷射毒液: Math.floor(prng() * 4),
			            战争践踏: Math.floor(prng() * 5),
			            异墙凸起: Math.floor(prng() * 8),
			        };
			    }
			    计算路径(目标X, 目标Y) {
			        const 路径 = [];
			        const dx = 目标X - this.x;
			        const dy = 目标Y - this.y;
			
			        if (dx === 0 && dy === 0) {
			            return 路径;
			        }
			
			        const 步数 = Math.max(Math.abs(dx), Math.abs(dy));
			        const x增量 = dx / 步数;
			        const y增量 = dy / 步数;
			
			        let 当前X = this.x;
			        let 当前Y = this.y;
			
			        for (let i = 0; i < 步数; i++) {
			            当前X += x增量;
			            当前Y += y增量;
			            const 下一个点X = Math.round(当前X);
			            const 下一个点Y = Math.round(当前Y);
			
			            if (路径.length > 0) {
			                const 上一个点 = 路径[路径.length - 1];
			                if (
			                    上一个点.x === 下一个点X &&
			                    上一个点.y === 下一个点Y
			                ) {
			                    continue;
			                }
			            }
			            路径.push({ x: 下一个点X, y: 下一个点Y });
			        }
			
			        return 路径;
			    }
			
			    计算目标路径(x, y) {
			        return this.计算路径(x, y);
			    }
			
			    更新技能冷却() {
			        for (const 技能 in this.技能冷却剩余) {
			            if (
			                this.技能冷却剩余[技能] > 0 &&
			                prng() < 0.5
			            ) {
			                this.技能冷却剩余[技能]--;
			            }
			        }
			    }
			
			    受伤(伤害, 来源 = null) {
			        if (来源 === "火焰" || 来源 === "中毒") {
			            return;
			        }
			
			        if (this.当前生命值 > 0) {
			            this.当前生命值 -= 伤害;
			            if (中文模式) this.触发受击动画();
			
			            if (this.当前生命值 <= 0) {
			                const deathX = this.x,
			                    deathY = this.y;
			                this.恢复背景类型();
			                if (this.血条元素) this.血条元素.remove();
			                所有怪物 = 所有怪物.filter((m) => m !== this);
			
			                const 附近位置 = [
			                    [0, 0],
			                    [0, 1],
			                    [0, -1],
			                    [1, 0],
			                    [-1, 0],
			                    [1, 1],
			                    [1, -1],
			                    [-1, 1],
			                    [-1, -1],
			                ];
			                const 可用位置列表 = [];
			
			                for (const [dx, dy] of 附近位置) {
			                    const 检查X = deathX + dx;
			                    const 检查Y = deathY + dy;
			                    if (位置是否可用(检查X, 检查Y, false)) {
			                        可用位置列表.push({ x: 检查X, y: 检查Y });
			                    }
			                }
			
			                if (游戏状态 === '地图编辑器' || 游戏状态 === '编辑器游玩') {
			                    if (可用位置列表.length > 0) {
			                        const 旗帜位置 = 可用位置列表.shift();
			                        放置物品到单元格(new 旗帜(), 旗帜位置.x, 旗帜位置.y);
			                    } else {
			                        放置物品到单元格(new 旗帜(), deathX, deathY);
			                    }
								} else if (游戏状态 !== '图鉴') {
									if (可用位置列表.length > 0) {
										const 牛角位置 = 可用位置列表.shift();
										const 冲撞牛角掉落 = new 冲撞牛角({});
										放置物品到单元格(冲撞牛角掉落, 牛角位置.x, 牛角位置.y);
									}
									if (可用位置列表.length > 0) {
										const 战斧位置 = 可用位置列表.shift();
										const 战斧掉落 = new 嗜血战斧({ 强化: true });
										放置物品到单元格(战斧掉落, 战斧位置.x, 战斧位置.y);
									}
					
									if (可用位置列表.length > 0) {
										const 出口位置 = 可用位置列表.shift();
										生成迷宫出口(出口位置.x, 出口位置.y);
									} else {
										生成迷宫出口(deathX, deathY);
									}
								}
			
			                显示通知("米诺陶发出一声哀嚎，倒下了...", "成功");
			                return;
			            }
			            this.绘制血条();
			        }
			    }
			
			    选择目标() {
			        if (this.当前生命值 < this.生命值 * 0.7) {
			            let 最近药水位置 = null;
			            let 最小距离 = Infinity;
			            for (let y = 0; y < 地牢大小; y++) {
			                for (let x = 0; x < 地牢大小; x++) {
			                    const 物品 = 地牢[y]?.[x]?.关联物品;
			                    if (物品 instanceof 治疗药水) {
			                        const 方向 = [
			                            [0, -1],
			                            [0, 1],
			                            [-1, 0],
			                            [1, 0],
			                        ];
			                        for (const [dx, dy] of 方向) {
			                            const 邻近X = x + dx;
			                            const 邻近Y = y + dy;
			                            if (
			                                邻近X >= 0 &&
			                                邻近X < 地牢大小 &&
			                                邻近Y >= 0 &&
			                                邻近Y < 地牢大小 &&
			                                位置是否可用(邻近X, 邻近Y, false)
			                            ) {
			                                const 距离 =
			                                    Math.abs(this.x - 邻近X) +
			                                    Math.abs(this.y - 邻近Y);
			                                if (距离 < 最小距离) {
			                                    最小距离 = 距离;
			                                    最近药水位置 = {
			                                        x: 邻近X,
			                                        y: 邻近Y,
			                                        药水本体X: x,
			                                        药水本体Y: y,
			                                    };
			                                }
			                            }
			                        }
			                    }
			                }
			            }
			            if (最近药水位置) {
			                this.目标 = 最近药水位置;
			                return 最近药水位置;
			            }
			        }
			        this.目标 = 玩家;
			        return { x: 玩家.x, y: 玩家.y };
			    }
			
			                    尝试移动() {
			        this.更新技能冷却();
			        const 目标 = this.选择目标();
			
			        if (目标.药水本体X !== undefined) {
			            this.目标路径 = this.计算路径(目标.x, 目标.y);
			            if (this.目标路径) {
			                super.尝试移动();
			                const 距离药水 =
			                    Math.abs(this.x - 目标.药水本体X) +
			                    Math.abs(this.y - 目标.药水本体Y);
			                if (距离药水 === 1) {
			                    const 药水单元格 =
			                        地牢[目标.药水本体Y]?.[目标.药水本体X];
			                    if (
			                        药水单元格 &&
			                        药水单元格.关联物品 instanceof 治疗药水
			                    ) {
			                        this.当前生命值 = Math.min(
			                            this.生命值,
			                            this.当前生命值 + 50
			                        );
			                        药水单元格.关联物品 = null;
			                        if (药水单元格.类型 === 单元格类型.物品)
			                            药水单元格.类型 = null;
			                        添加日志(
			                            `${this.类型} 喝下了治疗药水，恢复了生命！`,
			                            "信息"
			                        );
			                        this.绘制血条();
			                        const 迷宫尺寸 = 85;
			                        const 偏移X = Math.floor((地牢大小 - 迷宫尺寸) / 2);
			                        const 偏移Y = Math.floor((地牢大小 - 迷宫尺寸) / 2);
			                        let 放置成功 = false;
			                        for (let 尝试次数 = 0; 尝试次数 < 100 && !放置成功; 尝试次数++) {
			                            const 新药水X = 偏移X + Math.floor(prng() * 迷宫尺寸);
			                            const 新药水Y = 偏移Y + Math.floor(prng() * 迷宫尺寸);
			                            if (位置是否可用(新药水X, 新药水Y, false) && 地牢[新药水Y]?.[新药水X]?.背景类型 === 单元格类型.走廊) {
			                                 放置物品到单元格(new 治疗药水({ 强化: true }), 新药水X, 新药水Y);
			                                 放置成功 = true;
			                            }
			                        }
			                        绘制();
			                    }
			                }
			            }
			        } else {
			            this.目标路径 = this.计算路径(目标.x, 目标.y);
			            super.尝试移动();
			        }
			    }
			
			    尝试攻击() {
			        const 玩家距离 =
			            Math.abs(this.x - 玩家.x) + Math.abs(this.y - 玩家.y);
			        const 技能列表 = [];
			
			        if (玩家距离 >= 8 && this.技能冷却剩余.高速冲撞 <= 0)
			            技能列表.push("高速冲撞");
			        if (玩家距离 <= 4 && this.技能冷却剩余.喷火 <= 0)
			            技能列表.push("喷火");
			        if (玩家距离 <= 5 && this.技能冷却剩余.喷射毒液 <= 0)
			            技能列表.push("喷射毒液");
			        if (玩家距离 <= 3 && this.技能冷却剩余.战争践踏 <= 0)
			            技能列表.push("战争践踏");
			        if (
			            玩家距离 > 2 &&
			            玩家距离 < 7 &&
			            this.技能冷却剩余.异墙凸起 <= 0
			        )
			            技能列表.push("异墙凸起");
			
			        if (技能列表.length > 0) {
			            const 选用技能 =
			                技能列表[
			                    Math.floor(prng() * 技能列表.length)
			                ];
			            switch (选用技能) {
			                case "高速冲撞":
			                    return this.高速冲撞();
			                case "喷火":
			                    return this.喷火();
			                case "喷射毒液":
			                    return this.喷射毒液();
			                case "战争践踏":
			                    return this.战争践踏();
			                case "异墙凸起":
			                    return this.异墙凸起();
			            }
			        } else if (玩家距离 <= this.攻击范围) {
			            return super.尝试攻击();
			        }
			
			        return false;
			    }
			
			    高速冲撞() {
			        if (
			            this.技能冷却剩余.高速冲撞 > 0 ||
			            this.选择目标().药水本体X !== undefined
			        )
			            return false;
			
			        const 伤害 = this.攻击力 * 1.5;
			        const 冲撞距离 = 10;
			        const 落点距离 = 4;
			        const dx = 玩家.x - this.x;
			        const dy = 玩家.y - this.y;
			
			        if (dx === 0 && dy === 0) return false;
			
			        let dirX, dirY;
			        if (Math.abs(dx) > Math.abs(dy)) {
			            dirX = Math.sign(dx);
			            dirY = 0;
			        } else {
			            dirX = 0;
			            dirY = Math.sign(dy);
			        }
			
			        const 冲撞路径 = [];
			        let 撞到玩家 = false;
			
			        for (let i = 1; i <= 冲撞距离; i++) {
			            const 路径X = this.x + i * dirX;
			            const 路径Y = this.y + i * dirY;
			            冲撞路径.push({ x: 路径X, y: 路径Y });
			            if (路径X === 玩家.x && 路径Y === 玩家.y) {
			                伤害玩家(伤害, this);
			                撞到玩家 = true;
			                break;
			            }
			            if (当前出战宠物列表.some(pet => pet.是否已放置 && !pet.自定义数据.get("休眠中") && pet.x === 路径X && pet.y === 路径Y)) {
    当前出战宠物列表.forEach(pet => {
        if (pet.x === 路径X && pet.y === 路径Y && pet.层数==当前层数 ) {
            pet.受伤(伤害);
        }
    });
}
			        }
			
			        if (撞到玩家) {
			            for (let i = 1; i <= 落点距离; i++) {
			                const 路径X = 玩家.x + i * dirX;
			                const 路径Y = 玩家.y + i * dirY;
			                if (
			                    路径X < 0 ||
			                    路径X >= 地牢大小 ||
			                    路径Y < 0 ||
			                    路径Y >= 地牢大小
			                )
			                    break;
			                冲撞路径.push({ x: 路径X, y: 路径Y });
			            }
			        }
			
			        let 最终落点 = { x: this.x, y: this.y };
			        for (const 节点 of 冲撞路径) {
			            const 当前单元格 = 地牢[节点.y]?.[节点.x];
			
			            if (this.位置合法(节点.x, 节点.y, true)) {
			                最终落点 = { x: 节点.x, y: 节点.y };
			            } else {
			                break;
			            }
			            当前单元格.背景类型 = 单元格类型.走廊;
			        }
			
			        if (冲撞路径.length === 0) return false;
			
			        const 旧X = this.x,
			            旧Y = this.y;
			        this.恢复背景类型();
			        this.x = 最终落点.x;
			        this.y = 最终落点.y;
			        this.保存新位置类型(this.x, this.y);
			        地牢[this.y][this.x].类型 = 单元格类型.怪物;
			        地牢[this.y][this.x].关联怪物 = this;
			        生成墙壁();
			        怪物动画状态.set(this, {
			            旧逻辑X: 旧X,
			            旧逻辑Y: 旧Y,
			            目标逻辑X: this.x,
			            目标逻辑Y: this.y,
			            视觉X: 旧X,
			            视觉Y: 旧Y,
			            动画开始时间: Date.now(),
			            正在动画: true,
			        });
			
			        计划显示格子特效(冲撞路径, "FF4500");
			        添加日志("米诺陶发动了高速冲撞！", "警告");
			        this.技能冷却剩余.高速冲撞 = this.技能冷却.高速冲撞;
			        return true;
			    }
			
			    喷火() {
			        if (this.技能冷却剩余.喷火 > 0) return false;
			        const 范围 = 4;
			        const 方向 = [
			            [-1, 0],
			            [1, 0],
			            [0, -1],
			            [0, 1],
			        ];
			        const 火焰区域 = [];
			        for (const [dx, dy] of 方向) {
			            let lastX = this.x,
			                lastY = this.y;
			            for (let i = 0; i <= 范围; i++) {
			                const x = this.x + i * dx,
			                    y = this.y + i * dy;
			                if (
			                    x < 0 ||
			                    x >= 地牢大小 ||
			                    y < 0 ||
			                    y >= 地牢大小
			                )
			                    break;
			
			                const 前一单元格 = 地牢[lastY]?.[lastX];
			                const 当前单元格 = 地牢[y]?.[x];
			                if (!前一单元格 || !当前单元格) break;
			                const 移动方向 = 获取移动方向(lastX, lastY, x, y);
			                if (
			                    前一单元格.墙壁[移动方向.当前墙] ||
			                    当前单元格.墙壁[移动方向.反方向墙]
			                )
			                    break;
			
			                火焰区域.push({ x, y });
			                lastX = x;
			                lastY = y;
			            }
			        }
			        火焰区域.forEach(({ x, y }) => {
			            计划显示格子特效([{ x, y }], "FFA500");
			            if (玩家.x === x && 玩家.y === y) 伤害玩家(this.攻击力, this);
						当前出战宠物列表.forEach(pet => {
    if (pet && pet.是否已放置 && !pet.自定义数据.get("休眠中") && pet.x === x && pet.y === y && pet.层数==当前层数 ) {
        pet.受伤(this.攻击力);
    }
});
			        });
			        添加日志(`${this.类型} 喷出了火焰！`, "警告");
			        this.技能冷却剩余.喷火 = this.技能冷却.喷火;
			        return true;
			    }
			
			    喷射毒液() {
			        if (this.技能冷却剩余.喷射毒液 > 0) return false;
			        const 范围 = 3;
			        const 毒液数量 = 5;
			        const 可选位置 = [];
			        for (let dx = -范围; dx <= 范围; dx++) {
			            for (let dy = -范围; dy <= 范围; dy++) {
			                const x = this.x + dx,
			                    y = this.y + dy;
			                if (
			                    x >= 0 &&
			                    x < 地牢大小 &&
			                    y >= 0 &&
			                    y < 地牢大小 &&
			                    位置是否可用(x, y, false)
			                ) {
			                    可选位置.push({ x, y });
			                }
			            }
			        }
			        for (
			            let i = 0;
			            i < Math.min(毒液数量, 可选位置.length);
			            i++
			        ) {
			            const 位置 =
			                可选位置[
			                    Math.floor(prng() * 可选位置.length)
			                ];
			            const 毒液 = new 毒液物品({ 强化: this.强化 });
			            放置物品到单元格(毒液, 位置.x, 位置.y);
			            可选位置.splice(可选位置.indexOf(位置), 1);
			        }
			        添加日志(`${this.类型} 喷射了毒液！`, "警告");
			        this.技能冷却剩余.喷射毒液 = this.技能冷却.喷射毒液;
			        return true;
			    }
			
			    战争践踏() {
			        if (this.技能冷却剩余.战争践踏 > 0) return false;
			        const 范围 = 3;
			        const 影响格子 = [];
			        const 击中列表 = new Set();
			
			        for (let dx = -范围; dx <= 范围; dx++) {
			            for (let dy = -范围; dy <= 范围; dy++) {
			                if (Math.abs(dx) + Math.abs(dy) > 范围) continue;
			                const x = this.x + dx;
			                const y = this.y + dy;
			                if (
			                    x >= 0 &&
			                    x < 地牢大小 &&
			                    y >= 0 &&
			                    y < 地牢大小
			                ) {
			                    计划显示格子特效([{ x, y }], "A52A2A");
			
			                    if (玩家.x === x && 玩家.y === y) {
			                        击中列表.add(玩家);
			                    }
			                    当前出战宠物列表.forEach(pet => {
    if (pet && pet.是否已放置 && !pet.自定义数据.get("休眠中") && pet.x === x && pet.y === y && pet.层数==当前层数 ) {
        击中列表.add(pet);
    }
});
			                    const 单元格 = 地牢[y]?.[x];
			                    if (
			                        单元格?.关联怪物 &&
			                        单元格.关联怪物 !== this
			                    ) {
			                        击中列表.add(单元格.关联怪物);
			                    }
			                }
			            }
			        }
			
			        击中列表.forEach((目标) => {
			            if (目标 === 玩家) {
			                伤害玩家(this.攻击力, this);
			                new 状态效果(
			                    "眩晕",
			                    效果颜色编号映射[效果名称编号映射.眩晕],
			                    图标映射.眩晕,
			                    3
			                );
			            } else if (目标 instanceof 怪物) {
			                new 状态效果(
			                    "眩晕",
			                    效果颜色编号映射[效果名称编号映射.眩晕],
			                    图标映射.眩晕,
			                    2,
			                    null,
			                    null,
			                    目标
			                );
			            }
			        });
			
			        添加日志(`${this.类型} 发动了战争践踏！`, "警告");
			        this.技能冷却剩余.战争践踏 = this.技能冷却.战争践踏;
			        return true;
			    }
			
			    异墙凸起() {
			        if (this.技能冷却剩余.异墙凸起 > 0) return false;
			
			        const 尝试次数 = 15;
			        for (let i = 0; i < 尝试次数; i++) {
			            const 角度 = prng() * Math.PI * 2;
			            const 距离 = 2.5 + prng() * 2;
			            const 墙壁半长 = 4 + prng() * 8;
			            const 墙壁中心X = 玩家.x + Math.cos(角度) * 距离;
			            const 墙壁中心Y = 玩家.y + Math.sin(角度) * 距离;
			            const 墙壁方向X = -Math.sin(角度);
			            const 墙壁方向Y = Math.cos(角度);
			            const 起点X = 墙壁中心X - 墙壁方向X * 墙壁半长;
			            const 起点Y = 墙壁中心Y - 墙壁方向Y * 墙壁半长;
			            const 终点X = 墙壁中心X + 墙壁方向X * 墙壁半长;
			            const 终点Y = 墙壁中心Y + 墙壁方向Y * 墙壁半长;
			
			            const 格子列表 = 获取直线格子(
			                起点X,
			                起点Y,
			                终点X,
			                终点Y
			            );
			
			            if (
			                格子列表.some(
			                    (p) => p.x === 玩家.x && p.y === 玩家.y
			                )
			            )
			                continue;
			
			            const 有效墙壁格子 = 格子列表.filter(({ x, y }) => {
			                if (
			                    x < 0 ||
			                    x >= 地牢大小 ||
			                    y < 0 ||
			                    y >= 地牢大小
			                )
			                    return false;
			                const 单元格 = 地牢[y]?.[x];
			                return (
			                    单元格 &&
			                    (单元格.背景类型 === 单元格类型.走廊 ||
			                        单元格.背景类型 === 单元格类型.房间) &&
			                    !单元格.关联物品 &&
			                    !单元格.关联怪物
			                );
			            });
			
			            if (有效墙壁格子.length >= 4) {
			                有效墙壁格子.forEach(({ x, y }) => {
			                    const 单元格 = 地牢[y][x];
			                    const 原背景类型 = 单元格.背景类型;
			                    const 计时器实例 = new 临时墙壁计时器({ 原背景类型: 原背景类型 });
			                    
			                    
			                    放置物品到单元格(计时器实例, x, y); 
			                    单元格.背景类型 = 单元格类型.墙壁;
			                    所有计时器.push(计时器实例);
			                });
			                生成墙壁();
			                计划显示格子特效(有效墙壁格子, "8B4513");
			                添加日志(`${this.类型} 发动了异墙凸起！`, "警告");
			                this.技能冷却剩余.异墙凸起 = this.技能冷却.异墙凸起;
			                return true;
			            }
			        }
			        return false;
			    }
			
			    规划移动路径() {
			        let 当前位置 = { x: this.x, y: this.y };
			        let 有效位置 = null;
			        for (
			            let i = 0;
			            i < Math.min(this.目标路径.length, this.移动距离);
			            i++
			        ) {
			            const 节点 = this.目标路径[i];
			            const nextX = 节点.x,
			                nextY = 节点.y;
			
			            const 目标单元格 = 地牢[nextY]?.[nextX];
			
			            if (目标单元格.背景类型 === 单元格类型.墙壁) {
			                目标单元格.背景类型 = 单元格类型.走廊;
			                生成墙壁();
			                有效位置 = { x: nextX, y: nextY };
			                break;
			            }
			
			            if (this.位置合法(nextX, nextY)) {
			                有效位置 = { x: nextX, y: nextY };
			            }
			
			            当前位置 = { x: nextX, y: nextY };
			        }
			        if (有效位置) this.目标路径 = [];
			        return 有效位置;
			    }
			
			    位置合法(x, y, 忽略怪物 = false) {
			        if (x < 0 || x >= 地牢大小 || y < 0 || y >= 地牢大小)
			            return false;
			        const 单元格 = 地牢[y]?.[x];
			        if (!单元格) return false;
			        if (单元格.关联物品 && 单元格.关联物品.阻碍怪物)
			            return false;
			        if (
			            !忽略怪物 &&
			            单元格.关联怪物 &&
			            单元格.关联怪物 !== this
			        )
			            return false;
			        return true;
			    }
			}
			
			class 恐惧怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.恐惧怪物,
			            类型: "恐惧怪物",
			            基础生命值: 30 + (配置.强化 ? 15 : 0),
			            基础攻击力: 5 + (配置.强化 ? 2 : 0),
			            移动率: 0.6,
			            掉落物: new 恐惧魔杖({ 强化: 配置.强化 ?? false }),
			            掉落概率: 0.8,
			            基础攻击范围: 2,
			            跟踪距离: 10,
			            数据: {
			                恐惧持续时间: 3 + (配置?.强化 ? 2 : 0),
			                ...配置.数据,
			            },
			            ...配置,
			        });
			        this.击退距离 = 2 + (配置.强化 ? 1 : 0);
			    }
			
			    尝试攻击() {
			        const 我的状态 = 怪物状态表.get(this);
			        if (我的状态?.类型 === "冻结") return false;
			        if (this.攻击冷却回合剩余 > 0) {
			            this.攻击冷却回合剩余 -= 1;
			            return false;
			        }
			
			        if (我的状态?.类型 === "魅惑") {
			            if (
			                this.魅惑目标怪物 &&
			                this.魅惑目标怪物 !== this &&
			                this.魅惑目标怪物.当前生命值 > 0
			            ) {
			                // this.通向目标路径 应该由 处理怪物回合 中的 计算目标路径 更新
			                if (
			                    this.通向目标路径 &&
			                    this.通向目标路径.length <= this.攻击范围
			                ) {
			                    this.魅惑目标怪物.受伤(this.攻击力, this);
			                    this.攻击冷却回合剩余 = this.攻击冷却;
			                    计划显示格子特效(
			                        this.通向目标路径,
			                        效果颜色编号映射[
			                            效果名称编号映射.恐惧
			                        ].slice(1)
			                    );
			
			                    if (this.魅惑目标怪物.当前生命值 > 0) {
			                        new 状态效果(
			                            "恐惧",
			                            效果颜色编号映射[效果名称编号映射.恐惧],
			                            图标映射.恐惧,
			                            this.自定义数据.get("恐惧持续时间") ||
			                                3,
			                            null,
			                            null,
			                            this.魅惑目标怪物,
			                            1
			                        );
			                        添加日志(
			                            `${this.类型} 使 ${this.魅惑目标怪物.类型} 陷入了恐惧！`,
			                            "信息"
			                        );
			                    }
			                    return true;
			                }
			            }
			            return false;
			        } else {
			            const 玩家距离 =
			                Math.abs(this.x - 玩家.x) +
			                Math.abs(this.y - 玩家.y);
			
			            if (
			                玩家距离 <= this.攻击范围 &&
			                检查视线(
			                    this.x,
			                    this.y,
			                    玩家.x,
			                    玩家.y,
			                    this.攻击范围
			                )
			            ) {
			                伤害玩家(this.攻击力, this);
			                this.攻击冷却回合剩余 = this.攻击冷却;
			
			                let dx = 玩家.x - this.x;
			                let dy = 玩家.y - this.y;
			                let 方向DX = 0,
			                    方向DY = 0;
			
			                if (Math.abs(dx) > Math.abs(dy))
			                    方向DX =
			                        Math.sign(dx) ||
			                        (dy === 0
			                            ? prng() < 0.5
			                                ? 1
			                                : -1
			                            : 0);
			                else if (Math.abs(dy) > Math.abs(dx))
			                    方向DY =
			                        Math.sign(dy) ||
			                        (dx === 0
			                            ? prng() < 0.5
			                                ? 1
			                                : -1
			                            : 0);
			                else if (dx !== 0 && dy !== 0) {
			                    if (prng() < 0.5) 方向DX = Math.sign(dx);
			                    else 方向DY = Math.sign(dy);
			                }
			                if (方向DX === 0 && 方向DY === 0) {
			                    if (prng() < 0.5)
			                        方向DX = prng() < 0.5 ? 1 : -1;
			                    else 方向DY = prng() < 0.5 ? 1 : -1;
			                }
			
			                if (方向DX !== 0 || 方向DY !== 0) {
			                    let 最终X = 玩家.x;
			                    let 最终Y = 玩家.y;
			                    for (let i = 1; i <= this.击退距离; i++) {
			                        const 尝试X = 玩家.x + 方向DX * i;
			                        const 尝试Y = 玩家.y + 方向DY * i;
			
			                        if (
			                            尝试X < 0 ||
			                            尝试X >= 地牢大小 ||
			                            尝试Y < 0 ||
			                            尝试Y >= 地牢大小
			                        )
			                            break;
			                        if (
			                            !检查移动可行性(
			                                最终X,
			                                最终Y,
			                                尝试X,
			                                尝试Y,
			                                true
			                            )
			                        )
			                            break;
			                        const 目标单元格 = 地牢[尝试Y]?.[尝试X];
			                        if (
			                            !目标单元格 ||
			                            [
			                                单元格类型.墙壁,
			                                单元格类型.上锁的门,
			                            ].includes(目标单元格.背景类型)
			                        )
			                            break;
			                        if (
			                            目标单元格.关联怪物 ||
			                            (目标单元格.关联物品 &&
			                                目标单元格.关联物品.阻碍怪物)
			                        )
			                            break;
			
			                        最终X = 尝试X;
			                        最终Y = 尝试Y;
			                    }
			
			                    if (最终X !== 玩家.x || 最终Y !== 玩家.y) {
			                        const 旧恐惧X = 玩家.x,
			                            旧恐惧Y = 玩家.y;
			                        玩家.x = 最终X;
			                        玩家.y = 最终Y;
			                        处理玩家着陆效果(
			                            旧恐惧X,
			                            旧恐惧Y,
			                            玩家.x,
			                            玩家.y
			                        );
			                        更新视口();
			                        添加日志(
			                            `你被 ${this.类型} 击退了！`,
			                            "警告"
			                        );
			                        this.攻击冷却回合剩余++;
			                        绘制();
			                    }
			                }
			                计划显示格子特效(
			                    [{ x: 玩家.x, y: 玩家.y }],
			                    效果颜色编号映射[效果名称编号映射.恐惧].slice(1)
			                );
			                return true;
			            }
			            return false;
			        }
			    }
			}
			
			class 物品 {
			    constructor(配置 = {}) {
			        this.类型 = 配置.类型 || "其他物品";
			        this.名称 = 配置.名称 || "未命名物品";
			        this.图标 = 配置.图标 || "◎";
			        this.品质 = 配置.品质 || 1;
			        this.堆叠数量 = 配置.堆叠数量 || 1;
			        const 材料列表 = Object.values(材料);
			        this.材质 = 配置.材质 ?? 材料列表[Math.floor(prng() * 材料列表.length)];
			        this.最大堆叠数量 = 配置.最大堆叠数量 || 最大堆叠数;
			        this.颜色索引 = 配置.颜色索引 || 0;
			        if (配置.数据 instanceof Map) {
			            this.自定义数据 = new Map([...配置.数据]);
			        } else {
			            this.自定义数据 = new Map(Object.entries(配置.数据 || {}));
			        }
			        
			        const date = new Date();
			        this.唯一标识 =
			            配置.唯一标识 ||
			            Symbol(
			                Date.now().toString() + prng().toString()
			            );
			        this.已装备 = 配置.已装备 || false;
			        this.装备槽位 = 配置.已装备 || null;
			        this.x = 配置.x || null;
			        this.y = 配置.y || null;
			        this.显示元素 = null;
			        this.isActive = false; //屎山莫动
			        this.强化 = 配置.强化 || false;
			        this.能否拾起 =
			            配置.能否拾起 === undefined ? true : 配置.能否拾起;
			        this.是否正常物品 =
			            配置.是否正常物品 === undefined
			                ? true
			                : 配置.是否正常物品; // 用于配置是否是只能存在于地图上被玩家使用的物品
			        this.效果描述 = 配置.效果描述 || null;
			        this.是否隐藏 = 配置.是否隐藏 || false; //是否在背包中显示
			        this.是否为隐藏物品 = 配置.是否为隐藏物品 || false; //是否在地图上显示
			        this.阻碍怪物 =
			            配置.阻碍怪物 !== undefined ? 配置.阻碍怪物 : true;
			        this.是否被丢弃 = 配置.是否被丢弃 ?? false;
			    }
			    装备() {
			        if (this.已装备) return false;
			        const 空槽 =
			            Array.from(
			                { length: 装备栏每页装备数 },
			                (_, i) => i + 1
			            ).find(
			                (id) =>
			                    !玩家装备.has(
			                        id + 当前装备页 * 装备栏每页装备数
			                    )
			            ) +
			            当前装备页 * 装备栏每页装备数;
			
			        if (空槽) {
			            this.已装备 = true;
			            this.装备槽位 = 空槽;
			            玩家装备.set(this.装备槽位, this);
			            
			            return true;
			        }
			        return false;
			    }
			
			    取消装备() {
			        if (!this.已装备) return false;
			        玩家装备.delete(this.装备槽位);
			        this.已装备 = false;
			        this.装备槽位 = null;
			        
			        return true;
			    }
			    获取名称() {
			        return (
			            `${this.显示名称} [${this.品质} 级]` +
			            (this.强化 ? ` [强化]` : ``)
			        );
			    }
			
			    使用() {
			        this.堆叠数量 -= 1;
			        return true;
			    }
			    当被收集(进入者) {
			        return true;
			    }
			    当被丢弃(x, y) {
			        return true;
			    }
			    可交互目标(目标) {
			        return false;
			    }
			    刷新显示() {
			        this.显示元素.innerHTML = `
			< div class="物品图标" > ${this.图标}</div >
			<div class="物品名称">${this.获取名称()}</div>
			                                                            ${
			                                                                this
			                                                                    .堆叠数量 >
			                                                                1
			                                                                    ? `<div class="物品堆叠">x${this.堆叠数量}</div>`
			                                                                    : ""
			                                                            }
			        `;
			    }
			
			    获取提示() {
			        const lines = [];
			        lines.push(`${this.获取名称()} `);
			        lines.push(`类型：${this.类型} `);
			        lines.push(`品质：${"★".repeat(this.品质)} `);
			        lines.push(`材质：${this.材质}`);
			
			        if (this.最大堆叠数量 > 1) {
			            lines.push(
			                `堆叠：${this.堆叠数量} / ${this.最大堆叠数量}`
			            );
			        }
			        if (this.效果描述) {
			            lines.push(`效果描述：${this.效果描述} `);
			        }
			
			        const 融合Buffs = this.自定义数据?.get("fusedBuffs");
			        if (融合Buffs && 融合Buffs.length > 0) {
			            lines.push("--- 强化效果 ---");
			            融合Buffs.forEach((buff) => {
			                let buffs = 格式化Buff提示(buff)
			                if(buffs) lines.push(buffs);
			            });
			        }
			
			        if (
			            this.自定义数据?.has("附魔") &&
			            this.自定义数据.get("附魔").length > 0
			        ) {
			            const 附魔描述 = 获取附魔描述(
			                this.自定义数据.get("附魔")
			            );
			            if (附魔描述) lines.push(附魔描述);
			        }
			
			        if (
			            this.自定义数据?.has("耐久") &&
			            this.自定义数据?.has("原耐久")
			        ) {
			            lines.push(
			                `耐久：${this.自定义数据.get(
			                    "耐久"
			                )} / ${this.自定义数据.get("原耐久")}`
			            );
			        }
			
			        if (
			            this.自定义数据?.has("冷却剩余") &&
			            this.自定义数据?.has("冷却回合")
			        ) {
			            if (this.自定义数据.get("冷却回合") > 0) {
			                lines.push(
			                    `冷却：${this.自定义数据.get(
			                        "冷却剩余"
			                    )} / ${this.最终冷却回合||this.自定义数据.get("冷却回合")}回合`
			                );
			            }
			        }
			        if (this.自定义数据?.get("不可破坏")) {
			            lines.push("[不可破坏]");
			        }
			
			        return lines
			            .filter((line) => line && line.trim() !== "")
			            .join("\n");
			    }
			    安全销毁() {
			        this.取消装备();
			        this.自定义数据.clear();
			        this.唯一标识 = null;
			        return true;
			    }
			    get 显示图标() {
			        return this.图标;
			    }
			    get 显示名称() {
			        return this.名称;
			    }
			    get 颜色表() {
			        return 颜色表;
			    }
			    生成显示元素(用途 = "背包") {
			        const 元素 = document.createElement("div");
			        元素.className = "物品条目";
			        元素.setAttribute("data-quality", this.品质);
			        元素.__物品实例 = this; 
			
			        let innerHTML = `
			            <div class="物品图标">${this.显示图标}</div>
			            <div class="物品名称">${用途 === '背包' ? this.获取名称() : this.显示名称}</div>
			            ${this.堆叠数量 > 1 ? `<div class="物品堆叠">x${this.堆叠数量}</div>` : ""}
			        `;
			        
			        if (用途 === "背包") {
			            元素.classList.add("hover");
			            innerHTML += `
			                <button class="上屏按钮">↑</button>
			                <button class="丢弃按钮">↓</button>
			                <button class="使用按钮">⚡</button>
			                <button class="装备按钮" style="background: ${this.已装备 ? '#f44336' : '#FF9800'};">${图标映射.装备按钮}</button>
			            `;
			        }
			        
			        元素.innerHTML = innerHTML;
			        
			        const 图标元素 = 元素.querySelector(".物品图标");
			        图标元素.style.cssText = `
			            color: ${this.颜色表[this.颜色索引]};
			            font-size: 2.5em;
			            text-shadow: 0 0 8px ${this.颜色表[this.颜色索引]};
			        `;
			        
			        if (用途 === '装备') {
			             元素.style.transform = 'scale(0.65)';
			             元素.style.margin = '-5px 0';
			        }
			
			        return 元素;
			    }
			    可堆叠于(其他物品) {
			        if (
			            this.堆叠数量 >= this.最大堆叠数量 ||
			            this.堆叠数量 >= 最大堆叠数
			        )
			            return false;
			        const 基础相同 =
			            this.类型 === 其他物品.类型 &&
			            this.名称 === 其他物品.名称 &&
			            this.图标 === 其他物品.图标 &&
			            this.品质 === 其他物品.品质 &&
			            this.强化 === 其他物品.强化 &&
			            this.获取名称() === 其他物品.获取名称();
			
			        const 数据相同 = this.比较自定义数据(其他物品.自定义数据);
			
			        return 基础相同 && 数据相同;
			    }
			    比较自定义数据(其他数据) {
			        if (this.自定义数据.size !== 其他数据.size) return false;
			
			        for (const [键, 值] of this.自定义数据) {
			            if (!其他数据.has(键)) return false;
			
			            const 其他值 = 其他数据.get(键);
			            if (typeof 值 === "object" && 值 !== null) {
			                if (!深度比较(值, 其他值)) return false;
			            } else if (值 !== 其他值) {
			                return false;
			            }
			        }
			        return true;
			    }
			}
			
			            class 武器类 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "武器",
			            名称: 配置.名称 || "铁剑",
			            图标: 配置.图标 || "⚔️",
			            品质: 配置.品质 || 1,
			            颜色索引: 配置.品质 - 1 || 0,
			            堆叠数量: 配置.堆叠数量 || 1,
			            最大堆叠数量: 配置.最大堆叠数量 || 1,
			            效果描述: 配置.效果描述 || null,
			            强化: 配置.强化 || false,
			            ...配置,
			            数据: {
			                基础攻击力: 配置.基础攻击力 ?? 3,
			                冷却回合: 配置.冷却回合 || 1,
			                冷却剩余: 0,
			                攻击范围: 配置.攻击范围 ?? 1,
			                耐久: 配置.耐久 || 30,
			                原耐久: 配置.耐久 || 30,
			                不可破坏: 配置.不可破坏 || false,
			                攻击目标数: 配置.攻击目标数 ?? 1,
			                附魔: 配置.附魔 || [],
			                fusedBuffs: 配置.fusedBuffs || [],
			                ...配置.数据,
			            },
			        });
			    }
			    get 最终攻击范围() {
			        let 范围 = this.自定义数据.get("攻击范围") || 1;
			        const buffs = this.自定义数据.get("fusedBuffs") || [];
			        const 范围加成Buff = buffs.find(
			            (b) => b.type === 融合Buff类型.范围加成
			        );
			        if (
			            范围加成Buff &&
			            typeof 范围加成Buff.value === "number"
			        ) {
			            范围 += 范围加成Buff.value;
			        }
			        return Math.max(1, Math.round(范围));
			    }
			    get 最终冷却回合() {
			        let effectiveCooldown =
			            this.自定义数据.get("冷却回合") || 0;
			
			        if (this.强化) {
			            effectiveCooldown = Math.max(0, effectiveCooldown - 1);
			        }
			
			        const buffs = this.自定义数据.get("fusedBuffs") || [];
			
			        const sharpenedCooldownBuff = buffs.find(b => b.type === 融合Buff类型.磨刀石冷却缩减);
			        if (sharpenedCooldownBuff) {
			            effectiveCooldown -= sharpenedCooldownBuff.value;
			        }
			
			        buffs.forEach((buff) => {
			            if (buff.type === 融合Buff类型.冷却缩减) {
			                effectiveCooldown -= buff.value;
			            } else if (buff.type === 融合Buff类型.冷却倍率) {
			                effectiveCooldown *=
			                    1 - Math.min(1, Math.max(0, buff.value));
			            }
			        });
			
			        return Math.max(1, Math.round(effectiveCooldown));
			    }
			
			    使用(目标怪物列表, 目标路径, 调用者) {
			        if (
			            this.堆叠数量 <= 0 ||
			            this.自定义数据.get("冷却剩余") > 0
			        )
			            return 0;
			        if (!目标怪物列表) return 0;
			        const buffs = this.自定义数据.get("fusedBuffs") || [];
			        const sharpenedAttackBuff = buffs.find(b => b.type === 融合Buff类型.磨刀石攻击加成);
			        const sharpenedCooldownBuff = buffs.find(b => b.type === 融合Buff类型.磨刀石冷却缩减);
			        let sharpenedAttackBonus = 0;
			        if (sharpenedAttackBuff) {
			            sharpenedAttackBonus = sharpenedAttackBuff.value;
			        }
			
			        let 总伤害 = this.攻击力 + sharpenedAttackBonus;
			        let 总有效伤害 = 0;
			        let isCriticalHit = false;
			
			
			        const critChanceBuff = buffs.find(
			            (b) => b.type === 融合Buff类型.暴击几率
			        );
			        if (
			            critChanceBuff &&
			            prng() < critChanceBuff.value
			        ) {
			            isCriticalHit = true;
			            const critDamageBuff = buffs.find(
			                (b) => b.type === 融合Buff类型.暴击伤害倍率
			            );
			            const critMultiplier =
			                1.5 + (critDamageBuff ? critDamageBuff.value : 0);
			            总伤害 *= critMultiplier;
			            添加日志(`${this.获取名称()} 打出了暴击！`, "成功");
			        }
			
			        目标怪物列表.forEach((怪物) => {
			            if (怪物.当前生命值 > 0) {
			                const 原始血量 = 怪物.当前生命值;
			                怪物.受伤(Math.round(总伤害), 调用者);
			                const 实际伤害 = 原始血量 - 怪物.当前生命值;
			                if (实际伤害 > 0) 总有效伤害 += 实际伤害;
			
			                const luckyStrikeBuff = buffs.find(
			                    (b) => b.type === 融合Buff类型.幸运一击
			                );
			                if (
			                    luckyStrikeBuff &&
			                    prng() < luckyStrikeBuff.value &&
			                    怪物.当前生命值 > 0
			                ) {
			                    const luckyDamageMultiplier = 1.2;
			                    const bonusDamage = Math.round(
			                        总伤害 * (luckyDamageMultiplier - 1)
			                    );
			                    const originalMonsterHealthForLucky =
			                        怪物.当前生命值;
			                    怪物.受伤(bonusDamage, "幸运一击");
			                    const actualBonusDamage =
			                        originalMonsterHealthForLucky -
			                        怪物.当前生命值;
			                    if (actualBonusDamage > 0)
			                        总有效伤害 += actualBonusDamage;
			                    添加日志(
			                        `${this.获取名称()} 触发幸运一击！额外造成 ${bonusDamage} 伤害！`,
			                        "成功"
			                    );
			                }
			
			                const knockbackBuff = buffs.find(
			                    (b) => b.type === 融合Buff类型.击退几率
			                );
			                if (
			                    knockbackBuff &&
			                    prng() < knockbackBuff.value &&
			                    怪物.当前生命值 > 0
			                ) {
			                    let dx = 怪物.x - 玩家.x;
			                    let dy = 怪物.y - 玩家.y;
			                    let 方向DX = 0,
			                        方向DY = 0;
			                    if (Math.abs(dx) > Math.abs(dy))
			                        方向DX = Math.sign(dx);
			                    else if (Math.abs(dy) > Math.abs(dx))
			                        方向DY = Math.sign(dy);
			                    else if (dx !== 0) 方向DX = Math.sign(dx);
			                    else if (dy !== 0) 方向DY = Math.sign(dy);
			
			                    if (方向DX !== 0 || 方向DY !== 0) {
			                        const { x: 最终X, y: 最终Y } =
			                            怪物.计算最大甩飞位置(
			                                怪物.x,
			                                怪物.y,
			                                方向DX,
			                                方向DY,
			                                1
			                            );
			                        if (最终X !== 怪物.x || 最终Y !== 怪物.y) {
			                            怪物.恢复背景类型();
			                            怪物.x = 最终X;
			                            怪物.y = 最终Y;
			                            怪物.保存新位置类型(最终X, 最终Y);
			                            地牢[最终Y][最终X].类型 =
			                                单元格类型.怪物;
			                            地牢[最终Y][最终X].关联怪物 = 怪物;
			                            怪物.处理地形效果();
			                            怪物.绘制血条();
			                            添加日志(
			                                `${this.获取名称()} 将 ${
			                                    怪物.类型
			                                } 击退了！`,
			                                "信息"
			                            );
			                        }
			                    }
			                }
			                const fireChanceBuff = buffs.find(
			                    (b) => b.type === 融合Buff类型.火焰伤害
			                );
			                if (
			                    fireChanceBuff &&
			                    prng() < fireChanceBuff.value &&
			                    怪物.当前生命值 > 0
			                ) {
			                    new 状态效果(
			                        "火焰",
			                        效果颜色编号映射[效果名称编号映射.火焰],
			                        "火",
			                        3,
			                        null,
			                        null,
			                        怪物,
			                        2
			                    );
			                    添加日志(
			                        `${this.获取名称()} 点燃了 ${怪物.类型}！`,
			                        "成功"
			                    );
			                }
			                const poisonChanceBuff = buffs.find(
			                    (b) => b.type === 融合Buff类型.中毒几率
			                );
			                if (
			                    poisonChanceBuff &&
			                    prng() < poisonChanceBuff.value &&
			                    怪物.当前生命值 > 0
			                ) {
			                    new 状态效果(
			                        "中毒",
			                        效果颜色编号映射[效果名称编号映射.中毒],
			                        "☠️",
			                        3,
			                        null,
			                        null,
			                        怪物,
			                        1 + Math.floor(this.品质 / 2)
			                    );
			                    添加日志(
			                        `${this.获取名称()} 使 ${
			                            怪物.类型
			                        } 中毒了！`,
			                        "成功"
			                    );
			                }
			                const iceChanceBuff = buffs.find(
			                    (b) => b.type === 融合Buff类型.冰冻几率
			                );
			                if (
			                    iceChanceBuff &&
			                    prng() < iceChanceBuff.value &&
			                    怪物.当前生命值 > 0
			                ) {
			                    new 状态效果(
			                        "冻结",
			                        "#2196F3",
			                        "冻",
			                        2,
			                        null,
			                        null,
			                        怪物
			                    );
			                    添加日志(
			                        `${this.获取名称()} 冻结了 ${怪物.类型}！`,
			                        "成功"
			                    );
			                }
			            }
			        });
			
			        const lifeStealBuff = buffs.find(
			            (b) => b.type === 融合Buff类型.生命偷取
			        );
			        if (lifeStealBuff && 总有效伤害 > 0) {
			            const 吸血量 = Math.ceil(
			                总有效伤害 * lifeStealBuff.value
			            );
			            const 生命条 =
			                document.querySelector(".health-bar");
			            const 当前宽度 =
			                parseFloat(生命条.style.width) || 0;
			            const 新宽度 = Math.min(100, 当前宽度 + 吸血量);
			            if (新宽度 > 当前宽度) {
			                生命条.style.width = `${新宽度}%`;
			                添加日志(
			                    `${this.获取名称()} 吸取了 ${吸血量.toFixed(
			                        0
			                    )} 点生命！`,
			                    "成功"
			                );
			                触发HUD显示();
			            }
			        }
			
			        const energyStealBuff = buffs.find(
			            (b) => b.type === 融合Buff类型.攻击吸能
			        );
			        if (energyStealBuff && 总有效伤害 > 0) {
			            const 吸能量 = Math.ceil(
			                总有效伤害 * energyStealBuff.value * 0.5
			            );
			            const 能量条 = document.querySelector(".power-bar");
			            const 当前能量 = parseFloat(能量条.style.width) || 0;
			            能量条.style.width = `${Math.min(
			                100,
			                当前能量 + 吸能量/自定义全局设置.初始能量值*100
			            )}%`;
			            添加日志(
			                `${this.获取名称()} 吸取了 ${吸能量.toFixed(
			                    0
			                )} 点能量！`,
			                "成功"
			            );
			            触发HUD显示();
			        }
			
			        if (sharpenedAttackBuff) {
			            sharpenedAttackBuff.usesLeft--;
			            if (sharpenedAttackBuff.usesLeft <= 0) {
			                const index = buffs.indexOf(sharpenedAttackBuff);
			                if (index > -1) buffs.splice(index, 1);
			            }
			        }
			        if (sharpenedCooldownBuff) {
			            sharpenedCooldownBuff.usesLeft--;
			             if (sharpenedCooldownBuff.usesLeft <= 0) {
			                const index = buffs.indexOf(sharpenedCooldownBuff);
			                if (index > -1) buffs.splice(index, 1);
			            }
			        }
			        this.自定义数据.set("fusedBuffs", buffs);
			
			        this.自定义数据.set(
			            "耐久",
			            this.自定义数据.get("耐久") - this.耐久消耗
			        );
			        if (this.自定义数据.get("耐久") <= 0) {
			            处理销毁物品(this.唯一标识, true);
			            显示通知(`${this.名称} 已损坏！`, "警告");
			        }
			
			        this.自定义数据.set("冷却剩余", this.最终冷却回合);
			
			        if (总有效伤害 > 0) {
			            if (目标怪物列表.length > 1) {
			                显示通知(
			                    `${this.名称} 对 ${
			                        目标怪物列表.length
			                    } 个目标造成共 ${总有效伤害.toFixed(
			                        1
			                    )} 点伤害！`,
			                    "成功"
			                );
			            } else {
			                显示通知(
			                    `${this.名称} 造成 ${总有效伤害.toFixed(
			                        1
			                    )} 点伤害！`,
			                    "成功"
			                );
			            }
			        }
			        this.触发通用附魔(目标怪物列表);
			        let 物品已生锈 = false;
			
			        if (this.材质 === 材料.铁质 && !this.自定义数据.get("不可破坏")) {
			            if (prng() < 0.05) {
			                let 锈蚀度 = this.自定义数据.get('锈蚀度') || 0;
			                if (锈蚀度 < this.攻击力) {
			                    this.自定义数据.set('锈蚀度', Math.round(10*(锈蚀度 + Math.pow(this.攻击力-锈蚀度,1/3)/8))/10);
			                    物品已生锈 = true;
			                }
			            }
			        }
			
			    if (物品已生锈) {
			        更新背包显示();
			    }
			
			        if (目标路径) {
			            目标路径.forEach((攻击路径) => {
			                计划显示格子特效(攻击路径);
			            });
			        }
			        更新装备显示();
			        return 总有效伤害;
			    }
			
			    触发通用附魔(目标怪物列表) {
			        if (!当前天气效果.includes("严寒")) {
			            if (
			                this.自定义数据
			                    .get("附魔")
			                    ?.find((item) => item.种类 === "火焰附魔")?.等级
			            ) {
			                const 火焰等级 = this.自定义数据
			                    .get("附魔")
			                    .find((item) => item.种类 === "火焰附魔").等级;
			                目标怪物列表.forEach((怪物) => {
			                    if (怪物.当前生命值 > 0) {
			                        new 状态效果(
			                            "火焰",
			                            "#CC5500",
			                            "火",
			                            火焰等级,
			                            null,
			                            null,
			                            怪物
			                        );
			                    }
			                });
			            }
			        }
			
			        const 连锁附魔 = this.自定义数据
			            .get("附魔")
			            ?.find((item) => item.种类 === "连锁附魔");
			        if (连锁附魔) {
			            const 连锁距离 = 连锁附魔.等级;
			            目标怪物列表.forEach((初始目标) => {
			                if (初始目标.当前生命值 > 0) {
			                    this.触发连锁(初始目标, 连锁距离, 目标怪物列表);
			                }
			            });
			        }
			    }
			    触发连锁(当前目标, 连锁距离, 已攻击过的怪物 = []) {
			        let 第一层 = false;
			        if (this.访问过 === undefined) {
			            this.访问过 = [];
			            第一层 = true;
			        }
			        if (this.访问过.includes(当前目标)) return;
			        this.访问过.push(当前目标);
			        if (连锁距离 <= 0) return;
			        const 可连锁目标 = this.寻找连锁目标(
			            当前目标,
			            连锁距离,
			            this.访问过
			        );
			        for (const 新目标 of 可连锁目标) {
			            计划显示格子特效(新目标.路径);
			            this.使用([新目标.怪物]);
			            添加日志(
			                `连锁附魔击中了 ${新目标.怪物.类型}！`,
			                "成功"
			            );
			        }
			        if (第一层) this.访问过 = undefined;
			    }
			    寻找连锁目标(中心怪物, 连锁距离, 已攻击过的怪物) {
			        const 开放列表 = [
			            { x: 中心怪物.x, y: 中心怪物.y, 距离: 0, 路径: [] },
			        ];
			        const 已访问 = new Set([`${中心怪物.x},${中心怪物.y} `]);
			        const 可连锁目标 = [];
			
			        for (const 怪物 of 已攻击过的怪物) {
			            已访问.add(`${怪物.x},${怪物.y} `);
			        }
			
			        const 方向 = [
			            { dx: 1, dy: 0, 当前墙: "右", 目标墙: "左" },
			            { dx: -1, dy: 0, 当前墙: "左", 目标墙: "右" },
			            { dx: 0, dy: 1, 当前墙: "下", 目标墙: "上" },
			            { dx: 0, dy: -1, 当前墙: "上", 目标墙: "下" },
			        ];
			
			        while (开放列表.length > 0) {
			            const 当前 = 开放列表.shift();
			
			            if (当前.距离 >= 连锁距离) continue;
			
			            for (const { dx, dy, 当前墙, 目标墙 } of 方向) {
			                const 新X = 当前.x + dx;
			                const 新Y = 当前.y + dy;
			
			                if (
			                    新X < 0 ||
			                    新X >= 地牢大小 ||
			                    新Y < 0 ||
			                    新Y >= 地牢大小
			                )
			                    continue;
			
			                const 位置键 = `${新X},${新Y} `;
			                if (已访问.has(位置键)) continue;
			
			                const 当前单元格 = 地牢[当前.y][当前.x];
			                const 目标单元格 = 地牢[新Y][新X];
			
			                if (
			                    当前单元格.墙壁[当前墙] ||
			                    目标单元格.墙壁[目标墙] ||
			                    目标单元格.背景类型 === 单元格类型.墙壁 ||
			                    目标单元格.背景类型 === 单元格类型.上锁的门
			                )
			                    continue;
			
			                const 新路径 = [...当前.路径, { x: 新X, y: 新Y }];
			
			                if (
			                    目标单元格.类型 === 单元格类型.怪物 &&
			                    目标单元格.关联怪物?.状态 === 怪物状态.活跃
			                ) {
			                    可连锁目标.push({
			                        怪物: 目标单元格.关联怪物,
			                        路径: 新路径,
			                    });
			                    已访问.add(位置键);
			                }
			                已访问.add(位置键);
			                开放列表.push({
			                    x: 新X,
			                    y: 新Y,
			                    距离: 当前.距离 + 1,
			                    路径: 新路径,
			                });
			            }
			        }
			        return 可连锁目标;
			    }
			
			    获取提示() {
			        const lines = super.获取提示().split("\n");
			        const weaponStats = [];
			        weaponStats.push(`攻击力：${this.攻击力.toFixed(1)}`);
			
			        const 锈蚀度 = this.自定义数据.get('锈蚀度');
			        if (this.材质 === 材料.铁质 && 锈蚀度 > 0) {
			            weaponStats.push(`锈蚀：攻击力 -${锈蚀度}`);
			        }
			        weaponStats.push(`攻击范围：${this.最终攻击范围} 格`);
			
			        if (
			            this.自定义数据.has("攻击目标数") &&
			            this.自定义数据.get("攻击目标数") > 1
			        ) {
			            weaponStats.push(
			                `穿透数量：${this.自定义数据.get("攻击目标数")} 个`
			            );
			        }
			
			        let insertIndex = lines.findIndex((line) =>
			            line.startsWith("品质：")
			        );
			        if (insertIndex === -1) {
			            insertIndex = lines.findIndex((line) =>
			                line.startsWith("类型：")
			            );
			        }
			        if (insertIndex === -1) {
			            insertIndex = lines.findIndex((line) =>
			                line.startsWith(this.获取名称())
			            );
			        }
			
			        if (insertIndex !== -1) {
			            lines.splice(insertIndex + 1, 0, ...weaponStats);
			        } else {
			            lines.unshift(...weaponStats);
			        }
			        return lines.filter(Boolean).join("\n");
			    }
			
			    获取名称() {
			        return (
			            物品.prototype.获取名称.call(this) +
			            (this.自定义数据.get("攻击目标数") > 1
			                ? " [范围武器]"
			                : "")
			        );
			    }
			
			    get 攻击力() {
			        let 基础攻击 =
			            (this.自定义数据.get("基础攻击力") || 0) +
			            (this.强化 ? 2 : 0) +
			            (玩家属性.攻击加成 || 0);
			        let 锈蚀度 = this.自定义数据.get('锈蚀度') || 0;
			        if (this.材质 === 材料.铁质 && 锈蚀度 > 0) {
			            基础攻击 = Math.max(1, 基础攻击 - 锈蚀度);
			        }
			        const buffs = this.自定义数据.get("fusedBuffs") || [];
			
			        buffs.forEach((buff) => {
			            if (buff.type === 融合Buff类型.攻击加成) {
			                基础攻击 += buff.value;
			            } else if (buff.type === 融合Buff类型.攻击倍率) {
			                基础攻击 *= 1 + buff.value;
			            }
			        });
			
			        const synergyBuffWeapon = buffs.find(
			            (b) => b.type === 融合Buff类型.协同效应
			        );
			        if (synergyBuffWeapon) {
			            基础攻击 += synergyBuffWeapon.value;
			        }
			
			        基础攻击 +=
			            this.自定义数据
			                .get("附魔")
			                ?.find((item) => item.种类 === "锋利附魔")?.等级 *
			                2 || 0;
			
			        return Math.max(1, 基础攻击);
			    }
			    get 耐久消耗() {
			        if (this.自定义数据.get("不可破坏")) return 0;
			        const 耐久附魔等级 =
			            this.自定义数据
			                .get("附魔")
			                ?.find((item) => item.种类 === "耐久附魔")?.等级 ||
			            0;
			        let 消耗系数 = 1;
			        if (耐久附魔等级 > 0) {
			            消耗系数 = 1 / (耐久附魔等级 + 1);
			        }
			        if (this.强化) {
			            消耗系数 *= 0.5;
			        }
			         消耗系数 *= (1 - (玩家属性.耐久消耗减免 || 0));
			        return Math.max(0.1, 消耗系数);
			    }
			}
			class 钥匙 extends 物品 {
			    constructor(配置) {
			        let 钥匙唯一标识 = undefined;
			        if (配置.地牢层数 && 配置.对应门ID) {
			            钥匙唯一标识 = Symbol.for(
			                配置.地牢层数.toString() +
			                    "层" +
			                    配置.对应门ID.toString()
			            );
			        }
			        super({
			            ...配置,
			            类型: 配置.类型 || "钥匙",
			            名称: 配置.名称 || "钥匙",
			            图标: 配置.图标 || 图标映射.钥匙,
			            品质: 配置.品质 || 2,
			            颜色索引: 配置.颜色索引,
			            唯一标识: 钥匙唯一标识,
			            数据: {
			                对应门ID: 配置.对应门ID || 0,
			                地牢层数: 配置.地牢层数,
			            },
			            
			        });
			    }
			
			    获取名称() {
			        const 颜色名 = 颜色名表[this.颜色索引] || "未知";
			        return `${颜色名} 铜钥匙`;
			    }
			
			    可交互目标(门实例) {
			        if (门实例.类型 !== "上锁的门") return false;
			
			        const 钥匙绑定的门ID = this.自定义数据.get("对应门ID");
			        const 钥匙绑定的层数 = this.自定义数据.get("地牢层数");
			
			        if (钥匙绑定的层数 == -1 && 钥匙绑定的门ID == -1) {
			            return true; 
			        }
			
			        if (钥匙绑定的层数 == -1) {
			            return 钥匙绑定的门ID == 门实例.房间ID;
			        }
			        
			        if (钥匙绑定的层数 == 当前层数) {
			            return 钥匙绑定的门ID == 门实例.房间ID;
			        }
			        
			        return false;
			    }
			    获取提示() {
			        return [
			            `类型：${this.类型} `,
			            `品质：${"★".repeat(this.品质)} `,
			            `房间 ID：${this.自定义数据.get("对应门ID")==-1 ? '万能' : this.自定义数据.get("对应门ID")} `,
			            `层数：${this.自定义数据.get("地牢层数")==-1 ? '万能' : this.自定义数据.get("地牢层数")} `,
			        ].join("\n");
			    }
			    使用() {
			        显示通知("请使用互动键来使用钥匙", "错误");
			        return false;
			    }
			}
			class 金币 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "金币",
			            名称: "金币",
			            图标: 图标映射.金币,
			            品质: 1,
			            颜色索引: 2,
			            堆叠数量: 配置.数量 || 1,
			            是否隐藏: 配置.是否隐藏 || false,
			        });
			    }
			
			    获取名称() {
			        return `${this.名称} `;
			    }
			    使用() {
			        return false;
			    }
			}
			
			class 卷轴类 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "卷轴",
			            名称: 配置.名称 || "魔法卷轴",
			            效果描述: 配置.效果描述 || "未知效果",
			            图标: 配置.图标 || 图标映射.卷轴,
			            品质: 配置.品质 || 3,
			            颜色索引: 配置.品质 - 1 || 2,
			            堆叠数量: 配置.堆叠数量 || 1,
			            强化: 配置.强化 || false,
			            最大堆叠数量: 1,
			            ...配置,
			            数据: {
			                能量消耗: 配置.能量消耗 ?? 2,
			                已解锁: 配置.已解锁 || false,
			                ...配置.数据,
			            },
			            
			        });
			    }
			    安全销毁() {
			        if (当前激活卷轴列表.has(this))
			            当前激活卷轴列表.delete(this);
			        let ret = super.安全销毁();
			
			        return ret;
			    }
			    使用() {
			        // 具体效果由子类实现
			        return false;
			    }
			    获取名称() {
			        return this.自定义数据.get("已解锁")
			            ? `${this.显示名称} [${this.品质} 级]` +
			                  (this.强化 ? " [强化]" : "")
			            : "卷轴";
			    }
			    消耗能量() {
			        if (当前天气效果.includes("诡魅")) {
			            当前激活卷轴列表.delete(this);
			            if (this.卸下()){
			            显示通知("不论如何念咒，卷轴依然无法启用...","信息",true);
			            
			            }
			            return false;
			        }
			        return 扣除能量(this.最终能量消耗, true);
			    }
			    get 最终能量消耗() {
			        return Math.max(
			            this.自定义数据.get("能量消耗") - (this.强化 ? 2 : 0),
			            0
			        );
			    }
			    get 显示图标() {
			        return this.自定义数据.get("已解锁")
			            ? this.图标
			            : 图标映射.卷轴;
			    }
			    get 显示名称() {
			        return this.自定义数据.get("已解锁") ? this.名称 : "卷轴";
			    }
			    生成显示元素(用途 = "背包") {
			        let 元素 = super.生成显示元素(用途);
			        if (this.装备按钮) {
			        this.装备按钮.onclick = (e) => {
			            e.stopPropagation();
			            this.isActive = true;
			            元素.classList.add("active");
			            document.querySelectorAll(".物品条目").forEach((el) => {
			                if (el !== 元素 && el.__物品实例) {
			                    el.classList.remove("active");
			                    el.__物品实例.isActive = false;
			                }
			            });
			            if (this.已装备) {
			                this.取消装备();
			                显示通知("已卸下", "成功");
			            } else {
			                if (this.装备()) {
			                    显示通知("已装备", "成功");
			                } else {
			                    显示通知("装备槽已满！", "错误");
			                }
			            }
			            this.装备按钮.style.background = this.已装备
			                ? "#f44336"
			                : "#FF9800";
			            更新装备显示();
			            更新背包显示();
			
			            document.getElementById("浮动提示框").style.display =
			                "none";
			        };
			        }
			        return 元素;
			    }
			    取消装备() {
			        if (!this.已装备) return false;
			        if (当前激活卷轴列表.has(this)) {
			            当前激活卷轴列表.delete(this);
			            this.卸下();
			        }
			        let ret = super.取消装备();
			        return ret;
			    }
			    卸下() {
			        return true;
			    }
			    获取提示() {
			        if (this.自定义数据.get("已解锁")) {
			            return [
			                `${this.获取名称()} `,
			                `品质：${"★".repeat(this.品质)} `,
			                `材质：${this.材质}`,
			                `能量消耗：${this.最终能量消耗} `,
			                `效果描述：${this.效果描述} `,
			            ].join("\n");
			        } else {
			            return `古老的卷轴，似乎透露着什么秘密...\n材质：${this.材质}`;
			        }
			    }
			}
			class 防御装备类 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "防御装备",
			            名称: 配置.名称 || "护甲模板",
			            图标: 配置.图标 || "🛡️",
			            品质: 配置.品质 || 2,
			            颜色索引: 配置.品质 - 1 || 1,
			            最大堆叠数量: 1,
			            堆叠数量: 配置.堆叠数量 || 1,
			            效果描述: 配置.效果描述 || null,
			            强化: 配置.强化 || false,
			            数据: {
			                防御力: 配置.防御力 || 1,
			                耐久: 配置.耐久 || 100,
			                原耐久: 配置.耐久 || 100,
			                不可破坏: 配置.不可破坏 || false,
			                附魔: 配置.附魔 || [],
			                fusedBuffs: 配置.fusedBuffs || [],
			                ...配置.数据,
			            },
			        });
			    }
			    get 最终防御力() {
			        let 基础防御 =
			            (this.自定义数据.get("防御力") || 0) +
			            (this.强化 ? 2 : 0);
			        const buffs = this.自定义数据.get("fusedBuffs") || [];
			
			        buffs.forEach((buff) => {
			            if (buff.type === 融合Buff类型.防御加成) {
			                基础防御 += buff.value;
			            } else if (buff.type === 融合Buff类型.防御倍率) {
			                基础防御 *= 1 + buff.value;
			            }
			        });
			
			        const synergyBuffArmor = buffs.find(
			            (b) => b.type === 融合Buff类型.协同效应
			        );
			        if (synergyBuffArmor) {
			            基础防御 += synergyBuffArmor.value;
			        }
			
			        基础防御 +=
			            this.自定义数据
			                .get("附魔")
			                ?.find((item) => item.种类 === "保护附魔")?.等级 ||
			            0;
			        return Math.max(0, 基础防御);
			    }
			    get 耐久消耗() {
			        if (this.自定义数据.get("不可破坏")) return 0;
			        const 耐久附魔等级 =
			            this.自定义数据
			                .get("附魔")
			                ?.find((item) => item.种类 === "耐久附魔")?.等级 ||
			            0;
			        let 消耗系数 = 1;
			        if (耐久附魔等级 > 0) {
			            消耗系数 = 1 / (耐久附魔等级 + 1);
			        }
			        if (this.强化) {
			            消耗系数 *= 0.5;
			        }
			        return Math.max(0.1, 消耗系数);
			    }
			    get 反伤() {
			        const 荆棘附魔等级 =
			            this.自定义数据
			                .get("附魔")
			                ?.find((item) => item.种类 === "荆棘附魔")?.等级 ||
			            0;
			        if (荆棘附魔等级 > 0) {
			            return 荆棘附魔等级 * 1.5;
			        }
			        return 0;
			    }
			
			    当被攻击(原始攻击力, 来源 = null) {
			        let 最终伤害 = 原始攻击力;
			        const buffs = this.自定义数据.get("fusedBuffs") || [];
			
			        const flatReductionBuff = buffs.find(
			            (b) => b.type === 融合Buff类型.固定伤害减免
			        );
			        if (flatReductionBuff) {
			            最终伤害 = Math.max(
			                0,
			                最终伤害 - flatReductionBuff.value
			            );
			        }
			
			        最终伤害 = Math.max(0, 最终伤害 - this.最终防御力);
			
			        if (
			            来源 === "炸弹" &&
			            this.自定义数据
			                .get("附魔")
			                .some(
			                    (item) =>
			                        item.种类 === "爆炸保护附魔" &&
			                        item.等级 > 0
			                )
			        ) {
			            最终伤害 = Math.max(
			                0,
			                最终伤害 -
			                    this.自定义数据
			                        .get("附魔")
			                        .find(
			                            (item) => item.种类 === "爆炸保护附魔"
			                        )?.等级 *
			                        5
			            );
			        }
			
			        if (
			            来源 instanceof 怪物 &&
			            this.自定义数据
			                .get("附魔")
			                .some(
			                    (item) =>
			                        item.种类 === "火焰附魔" && item.等级 > 0
			                )
			        ) {
			            const 火焰等级 = this.自定义数据
			                .get("附魔")
			                .find((item) => item.种类 === "火焰附魔").等级;
			            new 状态效果(
			                "火焰",
			                "#CC5500",
			                "火",
			                火焰等级,
			                null,
			                null,
			                来源
			            );
			        }
			
			        const dodgeBuff = buffs.find(
			            (b) => b.type === 融合Buff类型.闪避几率
			        );
			        if (dodgeBuff && prng() < dodgeBuff.value) {
			            添加日志(`${this.获取名称()} 触发闪避！`, "成功");
			            最终伤害 = 0;
			        }
			
			        const poisonChanceBuff = buffs.find(
			            (b) => b.type === 融合Buff类型.中毒几率
			        );
			        if (
			            poisonChanceBuff &&
			            来源 instanceof 怪物 &&
			            来源.当前生命值 > 0 &&
			            prng() < poisonChanceBuff.value
			        ) {
			            new 状态效果(
			                "中毒",
			                效果颜色编号映射[效果名称编号映射.中毒],
			                "☠️",
			                3,
			                null,
			                null,
			                来源,
			                1 + Math.floor(this.品质 / 2)
			            );
			            添加日志(
			                `${this.获取名称()} 使 ${来源.类型} 中毒了！`,
			                "成功"
			            );
			        }
			
			        if (最终伤害 <= 0 && 原始攻击力 > 0)
			            最终伤害 = Math.round(prng() * 100) / 100;
			
			        if (最终伤害 > 0) {
			            this.自定义数据.set(
			                "耐久",
			                (this.自定义数据.get("耐久") - this.耐久消耗).toFixed(2)
			            );
			            if (
			                this.反伤 > 0 &&
			                来源 instanceof 怪物 &&
			                !(来源 instanceof 仙人掌怪物)
			            ) {
			                来源.受伤(this.反伤, "荆棘");
			                添加日志(
			                    `${this.名称} 因荆棘造成了 ${this.反伤} 点伤害！`,
			                    "成功"
			                );
			            }
			
			            const energyOnHitBuff = buffs.find(
			                (b) => b.type === 融合Buff类型.受击回能
			            );
			            if (energyOnHitBuff) {
			                const 恢复能量 = Math.ceil(energyOnHitBuff.value);
			                const 能量条 = document.querySelector(".power-bar");
			                const 当前能量 =
			                    parseFloat(能量条.style.width) || 0;
			                能量条.style.width = `${Math.min(
			                    100,
			                    当前能量 + 恢复能量/自定义全局设置.初始能量值*100
			                )}%`;
			                添加日志(
			                    `${this.获取名称()} 受到攻击，恢复了 ${恢复能量} 点能量！`,
			                    "信息"
			                );
			                触发HUD显示();
			            }
			        }
			
			        if (this.自定义数据.get("耐久") <= 0) {
			            处理销毁物品(this.唯一标识, true);
			            显示通知(`${this.名称} 已损坏！`, "警告");
			        }
			        更新装备显示();
			
			        return 最终伤害;
			    }
			
			    获取提示() {
			        const lines = super.获取提示().split("\n");
			        const armorStats = [
			            `防御力：${this.最终防御力.toFixed(1)}`,
			        ];
			
			        let insertIndex = lines.findIndex((line) =>
			            line.startsWith("品质：")
			        );
			        if (insertIndex === -1) {
			            insertIndex = lines.findIndex((line) =>
			                line.startsWith("类型：")
			            );
			        }
			        if (insertIndex === -1) {
			            insertIndex = lines.findIndex((line) =>
			                line.startsWith(this.获取名称())
			            );
			        }
			
			        if (insertIndex !== -1) {
			            lines.splice(insertIndex + 1, 0, ...armorStats);
			        } else {
			            lines.unshift(...armorStats);
			        }
			        return lines.filter(Boolean).join("\n");
			    }
			    使用() {
			        显示通知("装备不能被主动使用！", "错误");
			        return false;
			    }
			}
			class 扫帚 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "扫帚",
			            图标: 图标映射.扫帚,
			            品质: 2,
			            基础攻击力: 8,
			            冷却回合: 4,
			            攻击范围: 3,
			            耐久: 配置?.耐久 || 70,
			            强化: 配置?.强化 || false,
			            效果描述: "扫除面前扇形区域的敌人。",
			            攻击目标数: 99,
			            ...配置,
			        });
			    }

			    寻找最近的可攻击怪物(使用者) {
			        let 最近怪物 = null;
			        let 最小距离 = Infinity;

			        所有怪物.forEach(怪物 => {
			            if (怪物.状态 === 怪物状态.活跃 && 怪物.当前生命值 > 0) {
			                if (检查视线(使用者.x, 使用者.y, 怪物.x, 怪物.y, 999)) {
			                    const 距离 = Math.abs(使用者.x - 怪物.x) + Math.abs(使用者.y - 怪物.y);
			                    if (距离 < 最小距离) {
			                        最小距离 = 距离;
			                        最近怪物 = 怪物;
			                    }
			                }
			            }
			        });
			        return 最近怪物;
			    }

			    使用(目标怪物列表, 目标路径, 使用者 = 玩家) {
			        if (this.堆叠数量 <= 0 || this.自定义数据.get("冷却剩余") > 0) return 0;

			        const 目标怪物 = this.寻找最近的可攻击怪物(使用者);
			        if (!目标怪物) {
			            显示通知("没有可攻击的目标！", "警告");
			            return 0;
			        }

			        const dx = 目标怪物.x - 使用者.x;
			        const dy = 目标怪物.y - 使用者.y;

			        let 主轴;
			        let 方向 = {};
			        if (Math.abs(dx) >= Math.abs(dy)) {
			            主轴 = 'x';
			            方向.dx = dx === 0 ? 1 : Math.sign(dx);
			            方向.dy = 0;
			        } else {
			            主轴 = 'y';
			            方向.dx = 0;
			            方向.dy = dy === 0 ? 1 : Math.sign(dy);
			        }

			        const 攻击格子 = new Set();
			        let 总有效伤害 = 0;
			        const 击中怪物 = new Set();
			        const 攻击范围 = this.最终攻击范围;

			        for (let i = 1; i <= 攻击范围; i++) {
			            const 宽度 = (i * 2) - 1;
			            for (let j = -Math.floor(宽度 / 2); j <= Math.floor(宽度 / 2); j++) {
			                let 格子X, 格子Y;
			                if (主轴 === 'x') {
			                    格子X = 使用者.x + i * 方向.dx;
			                    格子Y = 使用者.y + j;
			                } else {
			                    格子X = 使用者.x + j;
			                    格子Y = 使用者.y + i * 方向.dy;
			                }
			
			                const 路径到目标 = 获取直线路径(使用者.x, 使用者.y, 格子X, 格子Y);
			                let 路径畅通 = true;
			                if (路径到目标.length > 1) {
			                    for(let k = 1; k < 路径到目标.length; k++) {
			                        if(!检查移动可行性(路径到目标[k-1].x, 路径到目标[k-1].y, 路径到目标[k].x, 路径到目标[k].y, true)){
			                            路径畅通 = false;
			                            break;
			                        }
			                    }
			                }

			                if (路径畅通 && 格子X >= 0 && 格子X < 地牢大小 && 格子Y >= 0 && 格子Y < 地牢大小) {
			                    攻击格子.add(`${格子X},${格子Y}`);
			                    const 单元格 = 地牢[格子Y]?.[格子X];
			                    if (单元格?.关联怪物 && 单元格.关联怪物.当前生命值 > 0 && !击中怪物.has(单元格.关联怪物)) {
			                        const 怪物 = 单元格.关联怪物;
			                        击中怪物.add(怪物);
			                        const 原始血量 = 怪物.当前生命值;
			                        怪物.受伤(this.攻击力, 使用者);
			                        const 实际伤害 = 原始血量 - 怪物.当前生命值;
			                        if (实际伤害 > 0) 总有效伤害 += 实际伤害;
			                    }
			                }
			            }
			        }
			        
			        const 格式化攻击格子 = Array.from(攻击格子).map(coord => {
			            const [x, y] = coord.split(',').map(Number);
			            return {x, y};
			        });
			        
			        计划显示格子特效(格式化攻击格子, "A9A9A9", 20);

			        this.自定义数据.set("耐久", this.自定义数据.get("耐久") - this.耐久消耗);
			        if (this.自定义数据.get("耐久") <= 0) {
			            处理销毁物品(this.唯一标识, true);
			        }
			        this.自定义数据.set("冷却剩余", this.最终冷却回合);

			        if (击中怪物.size > 0) {
			            显示通知(`扫帚挥击了 ${击中怪物.size} 个目标，共造成 ${总有效伤害.toFixed(1)} 点伤害！`, "成功");
			            this.触发通用附魔(Array.from(击中怪物));
			        } else {
			            显示通知(`${this.名称} 挥了个空！`, "信息");
			        }
			        更新装备显示();
			        return 总有效伤害;
			    }
			}
			class 吸血剑 extends 武器类 {
			    constructor(配置) {
			        super({
			            名称: "吸血剑",
			            图标: 图标映射.吸血剑,
			            品质: 2,
			            基础攻击力: 6,
			            冷却回合: 3,
			            攻击范围: 1,
			            耐久: 配置?.耐久 || 80,
			            强化: 配置?.强化 || false,
			            效果描述: `${(0.7 * 100).toFixed(0)}%概率吸取造成伤害${(
			                0.25 * 100
			            ).toFixed(0)}%的生命。`,
			            不可破坏: 配置?.不可破坏 || false,
			            附魔: 配置?.数据?.附魔 || [],
			            fusedBuffs: 配置?.数据?.fusedBuffs || [],
			            数据: {
			                吸血概率: 0.7,
			                吸血比例: 0.25,
			                ...(配置?.数据 || {}),
			            },
			        });
			    }
			
			    使用(目标怪物列表, 目标路径) {
			        const 总有效伤害 = super.使用(目标怪物列表, 目标路径); // 调用父类，它会处理暴击、击退等
			        if (总有效伤害 > 0) {
			            let 吸血概率 = this.自定义数据.get("吸血概率");
			            let 吸血比例 = this.自定义数据.get("吸血比例");
			
			            // 检查是否有生命偷取buff，如果有，则优先使用buff的几率和比例
			            const lifeStealBuff = (
			                this.自定义数据.get("fusedBuffs") || []
			            ).find((b) => b.type === 融合Buff类型.生命偷取);
			            if (lifeStealBuff) {
			                吸血概率 = lifeStealBuff.value; // 直接使用buff的value作为几率
			                吸血比例 = lifeStealBuff.value; // 假设buff的value同时代表比例，或者需要单独定义比例
			            }
			
			            if (prng() < 吸血概率) {
			                const 吸血量 = Math.ceil(总有效伤害 * 吸血比例);
			                const 生命条 =
			                    document.querySelector(".health-bar");
			                const 当前宽度 =
			                    parseFloat(生命条.style.width) || 0;
			                const 新宽度 = Math.min(100, 当前宽度 + 吸血量);
			                if (新宽度 > 当前宽度) {
			                    生命条.style.width = `${新宽度}%`;
			                    添加日志(
			                        `${this.获取名称()} 吸取了 ${吸血量.toFixed(
			                            0
			                        )} 点生命！`,
			                        "成功"
			                    );
			                    触发HUD显示();
			                }
			            }
			            return true;
			        }
			        return false;
			    }
			}
			class 棋子 extends 物品 {
			    constructor(配置) {
			        super({
			            类型: "棋子",
			            名称: 配置.名称 || "棋子",
			            图标: 配置.图标,
			            品质: 1,
			            颜色索引: 2,
			            最大堆叠数量: 8,
			            效果描述: "使用可以在玩家位置落子，按互动键可以提子",
			            ...配置,
			        });
			        this.能否拾起 = true;
			    }
			
			    可攻击位置(x, y, 棋盘) {
			        return [];
			    }
			    使用(玩家使用 = true, x0 = 0, y0 = 0) {
			        if (this.堆叠数量 <= 0) return false; // 检查是否有棋子可用
			
			        let 放置成功 = false;
			        if (玩家使用) {
			            const 当前房间ID = 房间地图[玩家.y][玩家.x];
			            const 当前房间 = 房间列表[当前房间ID];
			            if (当前房间?.类型 === "隐藏解谜棋盘") {
			                // 检查房间类型
			                let ret = 玩家放置物品(this, false); // 放置棋子逻辑不变
			                if (ret.x !== null) {
			                    // 检查放置是否成功
			                    放置成功 = true;
			                    检查解谜是否成功(当前房间.棋子数量);
			                    显示通知("落子成功", "成功");
			                } else {
			                    显示通知("无法在此处落子", "错误");
			                    return false; // 放置失败，不消耗棋子
			                }
			            } else {
			                显示通知("只能在解谜棋盘上落子", "错误");
			                return false; // 不在棋盘上，不消耗
			            }
			        } else {
			            // 非玩家使用（例如编辑器放置）的逻辑 - 可能不需要修改消耗
			            放置成功 = true; // 假设非玩家使用总是“成功”放置，不涉及消耗
			        }
			
			        if (放置成功 && 玩家使用) {
			            // 只有玩家成功放置才消耗
			            this.堆叠数量 -= 1; // 消耗一个棋子
			            if (this.堆叠数量 <= 0) {
			                // 如果是最后一个棋子，从背包或装备中移除
			                if (this.已装备) {
			                    玩家装备.delete(this.装备槽位);
			                    this.已装备 = false;
			                    this.装备槽位 = null;
			                    更新装备显示();
			                }
			                玩家背包.delete(this.唯一标识);
			                更新背包显示(); // 更新UI显示数量或移除条目
			            } else {
			                // 如果还有棋子，仅更新UI显示数量
			                更新背包显示();
			                更新装备显示();
			            }
			            return true; // 返回放置结果（放置逻辑已处理）
			        } else if (!玩家使用 && 放置成功) {
			            // 非玩家使用，可能不需要消耗或UI更新，直接返回true
			            return true;
			        }
			
			        return false; // 放置失败或其他情况
			    }
			}
			
			class 国际象棋车 extends 棋子 {
			    constructor(配置 = {}) {
			        super({
			            名称: "国际象棋车",
			            图标: "♜",
			            ...配置,
			        });
			    }
			    可攻击位置(x, y, 棋盘) {
			        const 攻击位置 = [];
			        const 棋盘大小 = 棋盘.length;
			
			        for (let i = 0; i < 棋盘大小; i++) {
			            if (i !== x) 攻击位置.push({ x: i, y: y });
			        }
			
			        for (let j = 0; j < 棋盘大小; j++) {
			            if (j !== y) 攻击位置.push({ x: x, y: j });
			        }
			
			        return 攻击位置;
			    }
			}
			
			class 国际象棋马 extends 棋子 {
			    constructor(配置 = {}) {
			        super({
			            名称: "国际象棋马",
			            图标: "♞",
			            ...配置,
			        });
			    }
			
			    可攻击位置(x, y, 棋盘) {
			        const 攻击位置 = [];
			        const 棋盘大小 = 棋盘.length;
			        const dx = [-2, -2, -1, -1, 1, 1, 2, 2];
			        const dy = [-1, 1, -2, 2, -2, 2, -1, 1];
			        for (let i = 0; i < 8; i++) {
			            const 新x = x + dx[i];
			            const 新y = y + dy[i];
			            if (
			                新x >= 0 &&
			                新x < 棋盘大小 &&
			                新y >= 0 &&
			                新y < 棋盘大小
			            ) {
			                攻击位置.push({ x: 新x, y: 新y });
			            }
			        }
			        return 攻击位置;
			    }
			}
			
			class 国际象棋象 extends 棋子 {
			    constructor(配置 = {}) {
			        super({
			            名称: "国际象棋象",
			            图标: "♝",
			            ...配置,
			        });
			    }
			
			    可攻击位置(x, y, 棋盘) {
			        const 攻击位置 = [];
			        const 棋盘大小 = 棋盘.length;
			
			        const directions = [
			            [1, 1],
			            [1, -1],
			            [-1, 1],
			            [-1, -1],
			        ];
			        for (const [dx, dy] of directions) {
			            for (let i = 1; i < 棋盘大小; i++) {
			                const 新x = x + i * dx;
			                const 新y = y + i * dy;
			
			                if (
			                    新x >= 0 &&
			                    新x < 棋盘大小 &&
			                    新y >= 0 &&
			                    新y < 棋盘大小
			                ) {
			                    攻击位置.push({ x: 新x, y: 新y });
			                } else {
			                    break;
			                }
			            }
			        }
			
			        return 攻击位置;
			    }
			}
			
			class 中国象棋炮 extends 棋子 {
			    constructor(配置 = {}) {
			        super({
			            名称: "中国象棋炮",
			            图标: "♚",
			            ...配置,
			        });
			    }
			
			    可攻击位置(x, y, 棋盘) {
			        const 攻击位置 = [];
			        const 棋盘大小 = 棋盘.length;
			
			        const directions = [
			            [1, 0],
			            [-1, 0],
			            [0, 1],
			            [0, -1],
			        ];
			        for (const [dx, dy] of directions) {
			            let 隔子 = false;
			            for (let i = 1; i < 棋盘大小; i++) {
			                const 新x = x + i * dx;
			                const 新y = y + i * dy;
			
			                if (
			                    新x >= 0 &&
			                    新x < 棋盘大小 &&
			                    新y >= 0 &&
			                    新y < 棋盘大小
			                ) {
			                    if (棋盘[新y][新x] !== 0) {
			                        if (!隔子) {
			                            隔子 = true;
			                        } else {
			                            攻击位置.push({ x: 新x, y: 新y });
			                            break;
			                        }
			                    } else if (!隔子) {
			                        攻击位置.push({ x: 新x, y: 新y });
			                    }
			                } else {
			                    break;
			                }
			            }
			        }
			
			        return 攻击位置;
			    }
			}
			class 药水类 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "药水",
			            名称: 配置.名称 || "基础药水",
			            图标: 配置.图标 || 图标映射.药水,
			            品质: 配置.品质 || 3,
			            颜色索引: 效果名称编号映射[配置.效果类型] || 0,
			            堆叠数量: 配置.堆叠数量 || 1,
			            最大堆叠数量: 16,
			            效果描述: 配置.效果描述 || null,
			            强化: 配置.强化 || false,
			            数据: {
			                是否冻结: 配置.是否冻结 || false,
			                基础持续时间: 配置.持续时间 || 3,
			                效果强度: 配置.效果强度 || 1,
			                效果类型: 配置.效果类型 || null,
			                ...配置.数据,
			            },
			        });
			        this.激活中 = false;
			        this.状态效果 = null;
			    }
			    获取名称() {
			        let 基础名称 = super.获取名称();
			        if (this.自定义数据?.get("是否冻结")) {
			            基础名称 += " [冻]";
			        }
			        return 基础名称;
			    }
			
			    使用() {
			        if (this.自定义数据?.get("是否冻结")) {
			            显示通知("药水被冻住了，无法使用！", "警告");
			            return false;
			        }
			        if (this.激活中) {
			            显示通知(
			                `${this.自定义数据.get("效果类型")} 效果已存在`,
			                "错误"
			            );
			            return false;
			        }
			
			        // 应用效果
			        this.激活中 = true;
			        this.状态效果 = new 状态效果(
			            this.自定义数据.get("效果类型"),
			            this.获取药水颜色(),
			            this.图标,
			            this.持续时间,
			            this.持续时间,
			            this
			        );
			        this.应用效果();
			
			        // 关键修复：在这里直接调用父类的使用方法来消耗一个单位
			        super.使用();
			
			        绘制();
			        显示通知(`${this.名称} 效果生效！`, "成功");
			        return true;
			    }
			
			    获取药水颜色() {
			        return 效果颜色编号映射[this.颜色索引] || "#FFFFFF";
			    }
			
			    应用效果() {
			        // 子类在这实现自定义效果...
			        return;
			    }
			
			    // [已修正]
			    移除效果() {
			        this.激活中 = false;
			        // 关键修复：移除这里的 super.使用() 调用，因为消耗已经在“使用”时完成。
			        // 子类在这还原效果...
			        return;
			    }
			
			    获取提示() {
			        return [
			            super.获取提示(),
			            `效果类型: ${this.自定义数据.get("效果类型")} `,
			            `持续时间: ${this.持续时间} 回合`,
			            `强度: +${this.强度} `,
			        ].join("\n");
			    }
			    get 强度() {
			        return (
			            this.自定义数据.get("效果强度") + (this.强化 ? 2 : 0)
			        );
			    }
			    get 持续时间() {
			        return (
			            this.自定义数据.get("基础持续时间") +
			            (this.强化 ? 2 : 0)
			        );
			    }
			    get 颜色表() {
			        return 效果颜色编号映射;
			    }
			}
			
			class 治疗药水 extends 药水类 {
			    constructor(配置) {
			        super({
			            名称: "治疗药水",
			            效果类型: "治疗",
			            持续时间: 5,
			            效果强度: 2,
			            堆叠数量: 配置.数量 || 1,
			            强化: 配置.强化 || false,
			        });
			    }
			    应用效果() {
			        const 当前生命 =
			            parseFloat(
			                document.querySelector(".health-bar").style.width
			            ) || 0;
			        document.querySelector(
			            ".health-bar"
			        ).style.width = `${Math.min(
			            100,
			            当前生命 + 4 * this.强度 //实际强度由getter决定
			        )}% `;
			        return;
			    }
			    移除效果() {
			        super.移除效果();
			        return;
			    }
			}
			
			class 能量药水 extends 药水类 {
			    constructor(配置) {
			        super({
			            名称: "能量药水",
			            效果类型: "能量",
			            持续时间: 5,
			            效果强度: 2,
			            堆叠数量: 配置.数量 || 1,
			            强化: 配置.强化 || false,
			        });
			    }
			    应用效果() {
			        const 当前能量 =
			            parseFloat(
			                document.querySelector(".power-bar").style.width
			            ) || 0;
			        document.querySelector(
			            ".power-bar"
			        ).style.width = `${Math.min(
			            100,
			            当前能量 + 3 * this.强度/自定义全局设置.初始能量值*100
			        )}% `;
			        return;
			    }
			    移除效果() {
			        super.移除效果();
			        return;
			    }
			}
			class 狂暴药水 extends 药水类 {
			    constructor(配置) {
			        super({
			            名称: "狂暴药水",
			            效果类型: "狂暴",
			            持续时间: 10,
			            效果强度: 1,
			            堆叠数量: 配置.数量 || 1,
			            强化: 配置.强化 || false,
			        });
			    }
			    应用效果() {
			        玩家属性.攻击加成 = 2 + 5 * this.强度;
			        return;
			    }
			    移除效果() {
			        玩家属性.攻击加成 = 0;
			        super.移除效果();
			        return;
			    }
			}
			class 神龟药水 extends 药水类 {
			    constructor(配置) {
			        super({
			            名称: "神龟药水",
			            效果类型: "神龟",
			            持续时间: 20,
			            效果强度: 1,
			            效果描述: "给予你赛尔达飞艇级别的防御",
			            堆叠数量: 配置.数量 || 1,
			            强化: 配置.强化 || false,
			        });
			    }
			    应用效果() {
			        玩家属性.防御加成 = 2 + 5 * this.强度;
			        return;
			    }
			    移除效果() {
			        玩家属性.防御加成 = 0;
			        super.移除效果();
			        return;
			    }
			}
			class 隐身药水 extends 药水类 {
			    constructor(配置) {
			        super({
			            名称: "隐身药水",
			            效果类型: "隐身",
			            持续时间: 35,
			            效果强度: 1,
			            效果描述: "悄悄滴进村，打枪滴不要。怪物视距全部变为 1",
			            堆叠数量: 配置.数量 || 1,
			            强化: 配置.强化 || false,
			        });
			    }
			    应用效果() {
			        处理怪物回合();
			        return; // 在 处理怪物回合 中检测了 玩家状态 来实现
			    }
			    移除效果() {
			        super.移除效果();
			        return;
			    }
			}
			class 透视药水 extends 药水类 {
			    constructor(配置) {
			        super({
			            名称: "透视药水",
			            效果类型: "透视",
			            持续时间: 50,
			            效果强度: 1,
			            效果描述: "透过迷雾，看清房内的陷阱",
			            堆叠数量: 配置.数量 || 1,
			            强化: 配置.强化 || false,
			        });
			    }
			    应用效果() {
			        玩家属性.透视 = true;
			        绘制();
			        return;
			    }
			    移除效果() {
			        玩家属性.透视 = false;
			        super.移除效果();
			        return;
			    }
			}
			class 死灵法杖 extends 武器类 {
    constructor(配置 = {}) {
        super({
            名称: "死灵法杖",
            图标: 图标映射.死灵法杖,
            品质: 2,
            基础攻击力: 1,
            冷却回合: 8,
            攻击范围: 10,
            耐久: 50,
            效果描述: "召唤一个骷髅仆从为你作战，仆从会在一定回合后消散。",
            ...配置,
            数据: {
                最大仆从数: 5 + (配置.强化 ? 5 : 0),
                ...配置.数据
            }
        });
    }

    使用(目标怪物列表, 目标路径, 使用者 = 玩家) {
        if (this.自定义数据.get("冷却剩余") > 0) {
            显示通知("法杖还未准备好！", "错误");
            return false;
        }

        const 当前仆从数 = 玩家仆从列表.length;
        if (当前仆从数 >= this.自定义数据.get("最大仆从数")) {
            显示通知("你无法控制更多的仆从！", "警告");
            return false;
        }

        let 放置位置 = 寻找可放置位置(使用者.x, 使用者.y);
        if (!放置位置) {
            显示通知("周围没有空间召唤仆从！", "错误");
            return false;
        }

        let 新仆从 = new 骷髅仆从({ 强化: this.强化 });
        let 放置成功=false
        if (放置怪物到单元格(新仆从, 放置位置.x, 放置位置.y)) {
            玩家仆从列表.push(新仆从);
            显示通知("骷髅仆从响应了你的召唤！", "成功");
            计划显示格子特效([{ x: 放置位置.x, y: 放置位置.y }], "8A2BE2");
            this.自定义数据.set("冷却剩余", this.最终冷却回合);
            更新装备显示();
            放置成功 = true
            //return true;
        }
        if (放置成功){
        if(prng()<0.5){
        放置位置 = 寻找可放置位置(使用者.x, 使用者.y);
        if (!放置位置) {
            显示通知("周围没有空间召唤仆从！", "错误");
            return false;
        }

        新仆从 = new 骷髅仆从({ 强化: this.强化 });
        if (放置怪物到单元格(新仆从, 放置位置.x, 放置位置.y)) {
            玩家仆从列表.push(新仆从);
            //显示通知("一个骷髅仆从响应了你的召唤！", "成功");
            计划显示格子特效([{ x: 放置位置.x, y: 放置位置.y }], "8A2BE2");
            //this.自定义数据.set("冷却剩余", this.最终冷却回合);
            //更新装备显示();
            return true;
        }
        } else {
        return true;
        }
        }
        return false;
    }
}
			class 冰霜法杖 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "冰霜法杖",
			            图标: 图标映射.冰霜法杖,
			            品质: 3,
			            基础攻击力: 6,
			            冷却回合: 7,
			            攻击范围: 3,
			            耐久: 配置?.耐久 || 45,
			            强化: 配置?.强化 || false,
			            效果描述:
			                "释放一圈冰霜能量，对范围内的敌人造成伤害并有几率冻结。",
			            攻击目标数: 99,
			            不可破坏: 配置?.不可破坏 || false,
			            附魔: 配置?.数据?.附魔 || [],
			            数据: {
			                冻结几率: 0.75 + (配置?.强化 ? 0.15 : 0),
			                冻结回合: 2,
			                ...配置.数据,
			            },
			        });
			    }
			
			    使用(目标怪物列表,目标路径,使用者=玩家) {
			        if (
			            this.堆叠数量 <= 0 ||
			            this.自定义数据.get("冷却剩余") > 0
			        )
			            return 0;
			
			        const 范围 = this.最终攻击范围;
			        const 击中怪物 = new Set();
			        let 总有效伤害 = 0;
			        const 影响格子分层 = Array.from(
			            { length: 范围 + 1 },
			            () => []
			        );
			
			        const 队列 = [{ x: 使用者.x, y: 使用者.y, 距离: 0 }];
			        const 已访问 = new Set();
			        影响格子分层[0].push();
			
			        while (队列.length > 0) {
			            const 当前 = 队列.shift();
			            if (当前.距离 >= 范围) continue;
			
			            const 方向 = [
			                { dx: 1, dy: 0 },
			                { dx: -1, dy: 0 },
			                { dx: 0, dy: 1 },
			                { dx: 0, dy: -1 },
			            ];
			
			            for (const { dx, dy } of 方向) {
			                const 新X = 当前.x + dx;
			                const 新Y = 当前.y + dy;
			                const 位置键 = `${新X},${新Y}`;
			
			                if (
			                    新X >= 0 &&
			                    新X < 地牢大小 &&
			                    新Y >= 0 &&
			                    新Y < 地牢大小 &&
			                    !已访问.has(位置键)
			                ) {
			                    if (
			                        检查视线(使用者.x, 使用者.y, 新X, 新Y, 范围 + 1)
			                    ) {
			                        已访问.add(位置键);
			                        const 新距离 = 当前.距离 + 1;
			                        影响格子分层[新距离].push({
			                            x: 新X,
			                            y: 新Y,
			                        });
			                        队列.push({ x: 新X, y: 新Y, 距离: 新距离 });
			
			                        const 单元格 = 地牢[新Y][新X];
			
			                        if (
			                            单元格?.关联物品 instanceof 祭坛类 &&
			                            单元格.关联物品.自定义数据.get(
			                                "激活条件"
			                            ) === "冰霜封印" &&
			                            !单元格.关联物品.自定义数据.get(
			                                "已激活"
			                            )
			                        ) {
			                            单元格.关联物品.激活();
			                        }
			
			                        if (
			                            单元格?.关联怪物 instanceof 怪物 &&
			                            单元格.关联怪物.当前生命值 > 0
			                        ) {
			                            const 怪物 = 单元格.关联怪物;
			                            if (!击中怪物.has(怪物)) {
			                                击中怪物.add(怪物);
			                                const 原始血量 = 怪物.当前生命值;
			                                怪物.受伤(this.攻击力, "玩家");
			                                const 实际伤害 =
			                                    原始血量 - 怪物.当前生命值;
			                                if (实际伤害 > 0)
			                                    总有效伤害 += 实际伤害;
			
			                                if (
			                                    怪物.当前生命值 > 0 &&
			                                    prng() <
			                                        this.自定义数据.get(
			                                            "冻结几率"
			                                        )
			                                ) {
			                                    new 状态效果(
			                                        "冻结",
			                                        "#2196F3",
			                                        "冻",
			                                        this.自定义数据.get(
			                                            "冻结回合"
			                                        ),
			                                        null,
			                                        null,
			                                        怪物
			                                    );
			                                    添加日志(
			                                        `${怪物.类型} 被冰霜法杖冻结了！`,
			                                        "警告"
			                                    );
			                                }
			                            }
			                        } else if (
			                            单元格.关联物品 instanceof 炸弹
			                        ) {
			                            if (!单元格.关联物品.能否拾起) {
			                                单元格.关联物品.自定义数据.set(
			                                    "倒计时",
			                                    单元格.关联物品.自定义数据.get(
			                                        "爆炸时间"
			                                    )
			                                );
			                                单元格.关联物品.能否拾起 = true;
			                                所有计时器 = 所有计时器.filter(
			                                    (item) =>
			                                        item.x !== 单元格.关联物品.x || item.y !== 单元格.关联物品.y
			                                );
			                                单元格.关联物品.x = null;
			                                单元格.关联物品.y = null;
			                                添加日志("炸弹已被熄灭！", "信息");
			                            }
			                        } else if (
			                            单元格.关联物品 instanceof 火焰物品
			                        ) {
			                            单元格.关联物品 = null;
			                            if (单元格.类型 === 单元格类型.物品)
			                                单元格.类型 = null;
			                            单元格.颜色索引 = 颜色表.length;
			                        }
			                    }
			                }
			            }
			        }
			
			        影响格子分层.forEach((层内格子, 层级) => {
			            if (层内格子.length > 0) {
			                setTimeout(() => {
			                    计划显示格子特效(层内格子, "ADD8E6", 0);
			                }, 层级 * 80);
			            }
			        });
			
			        this.自定义数据.set(
			            "耐久",
			            this.自定义数据.get("耐久") - this.耐久消耗
			        );
			        if (this.自定义数据.get("耐久") <= 0) {
			            处理销毁物品(this.唯一标识, true);
			            显示通知(`${this.名称} 已损坏！`, "警告");
			        }
			        this.自定义数据.set(
			            "冷却剩余",
			            this.最终冷却回合
			        );
			
			        if (击中怪物.size > 0) {
			            显示通知(
			                `${this.名称} 释放了冰霜！击中 ${
			                    击中怪物.size
			                } 个目标，共造成 ${总有效伤害.toFixed(1)} 点伤害！`,
			                "成功"
			            );
			            const 所有击中怪物 = Array.from(击中怪物);
			
			            if (总有效伤害 > 0) {
			                this.触发通用附魔(所有击中怪物);
			            }
			        } else {
			            显示通知(`${this.名称} 释放了冰霜！`, "信息");
			        }
			        绘制();
			        更新装备显示();
			        return 总有效伤害;
			    }
			
			    触发通用附魔(目标怪物列表) {
			        if (
			            this.自定义数据
			                .get("附魔")
			                ?.find((item) => item.种类 === "火焰附魔")?.等级
			        ) {
			            const 火焰等级 = this.自定义数据
			                .get("附魔")
			                .find((item) => item.种类 === "火焰附魔").等级;
			            目标怪物列表.forEach((怪物) => {
			                if (怪物.当前生命值 > 0) {
			                    new 状态效果(
			                        "火焰",
			                        "#CC5500",
			                        "火",
			                        火焰等级,
			                        null,
			                        null,
			                        怪物
			                    );
			                }
			            });
			        }
			        const 连锁附魔 = this.自定义数据
			            .get("附魔")
			            ?.find((item) => item.种类 === "连锁附魔");
			        if (连锁附魔) {
			            const 连锁距离 = 连锁附魔.等级;
			            目标怪物列表.forEach((初始目标) => {
			                if (初始目标.当前生命值 > 0) {
			                    this.触发连锁(初始目标, 连锁距离, 目标怪物列表);
			                }
			            });
			        }
			    }
			
			    获取提示() {
			        let lines = super.获取提示().split("\n");
			        const specificEffectLines = [
			            `冻结几率：${(
			                this.自定义数据.get("冻结几率") * 100
			            ).toFixed(0)}% (${this.自定义数据.get(
			                "冻结回合"
			            )}回合)`,
			        ];
			
			        const effectDescIndex = lines.findIndex((line) =>
			            line.startsWith("效果描述：")
			        );
			        let insertAtIndex =
			            effectDescIndex !== -1
			                ? effectDescIndex + 1
			                : lines.findIndex((line) =>
			                      line.startsWith("--- 强化效果 ---")
			                  );
			        if (insertAtIndex === -1) insertAtIndex = lines.length;
			
			        lines.splice(insertAtIndex, 0, ...specificEffectLines);
			        return lines.filter(Boolean).join("\n");
			    }
			}
			class 荆棘种子 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "种子",
			            名称: "荆棘种子",
			            图标: 图标映射.种子,
			            品质: 1,
			            颜色索引: 0, // 绿色系
			            堆叠数量: 配置.数量 || Math.ceil(prng() * 5),
			            最大堆叠数量: 16,
			            效果描述:
			                "在相邻空格子播种，生成持续数回合的荆棘丛，可以用互动键收回。",
			            强化: 配置.强化 || false, // 强化可能增加荆棘伤害或持续时间
			            数据: {
			                荆棘持续时间: 5 + (配置.强化 ? 3 : 0),
			                荆棘伤害: 3 + (配置.强化 ? 2 : 0),
			                减速概率: 0.6 + (配置.强化 ? 0.1 : 0),
			                减速回合: 7,
			                ...配置.数据,
			            },
			            ...配置,
			        });
			    }
			
			    使用() {
			        if (this.堆叠数量 <= 0) return false;
			
			        const 方向数组 = [
			            { dx: 0, dy: 0 },
			            { dx: 0, dy: -1 },
			            { dx: 1, dy: 0 },
			            { dx: 0, dy: 1 },
			            { dx: -1, dy: 0 },
			        ];
			        let 放置成功 = false;
			        let 目标X = -1,
			            目标Y = -1;
			
			        // 查找玩家周围可放置的格子
			        for (const { dx, dy } of 方向数组) {
			            const 检查X = 玩家.x + dx;
			            const 检查Y = 玩家.y + dy;
			            if (
			                (检查X >= 0 &&
			                    检查X < 地牢大小 &&
			                    检查Y >= 0 &&
			                    检查Y < 地牢大小 &&
			                    位置是否可用(检查X, 检查Y, false)) ||
			                !检查直线移动可行性(
			                    玩家.x,
			                    玩家.y,
			                    检查X,
			                    检查Y,
			                    true
			                )
			            ) {
			                // 检查格子是否为空地
			                目标X = 检查X;
			                目标Y = 检查Y;
			                放置成功 = true;
			                break; // 找到第一个可用格子就放置
			            }
			        }
			
			        if (!放置成功) {
			            显示通知("周围没有合适的地方播种！", "错误");
			            return false;
			        }
			
			        // 创建荆棘丛实例
			        const 荆棘丛实例 = new 荆棘丛({
			            倒计时: this.自定义数据.get("荆棘持续时间"),
			            爆炸时间: this.自定义数据.get("荆棘持续时间"), // 复用
			            伤害: this.自定义数据.get("荆棘伤害"),
			            减速概率: this.自定义数据.get("减速概率"),
			            减速回合: this.自定义数据.get("减速回合"),
			            强化: this.强化, // 传递强化状态给荆棘丛
			        });
			
			        // 放置荆棘丛到地牢
			        if (放置物品到单元格(荆棘丛实例, 目标X, 目标Y)) {
			            荆棘丛实例.x = 目标X; // 确保实例有坐标
			            荆棘丛实例.y = 目标Y;
			            所有计时器.push(荆棘丛实例); // 加入计时器列表使其能自动消失
			            显示通知(
			                `在 (${目标X}, ${目标Y}) 种下了荆棘丛！`,
			                "成功"
			            );
			
			            // 消耗种子
			            this.堆叠数量 -= 1;
			
			            计划显示格子特效([{ x: 目标X, y: 目标Y }], "228B22"); // 深绿色特效
			            return true;
			        } else {
			            显示通知("无法放置荆棘丛！", "错误");
			            return false;
			        }
			    }
			
			    获取提示() {
			        return [
			            `${this.获取名称()} `,
			            `类型：${this.类型}`,
			            `品质：${"★".repeat(this.品质)}`,
			            `材质：${this.材质}`,
			            `堆叠：${this.堆叠数量} / ${this.最大堆叠数量}`,
			            `效果：${this.效果描述}`,
			            `荆棘持续：${this.自定义数据.get("荆棘持续时间")} 回合`,
			            `进入伤害：${this.自定义数据.get("荆棘伤害")} 点`,
			            `减速几率：${(
			                this.自定义数据.get("减速概率") * 100
			            ).toFixed(0)}% (${this.自定义数据.get(
			                "减速回合"
			            )}回合)`,
			        ].join("\n");
			    }
			}
			
			class 荆棘丛 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形", // 标记为地形，不可交互
			            名称: "荆棘丛",
			            图标: 图标映射.荆棘丛, // 仙人掌图标
			            品质: 1,
			            颜色索引: 0,
			            最大堆叠数量: 1,
			            能否拾起: false,
			            阻碍怪物: false, // 不阻挡移动
			            是否正常物品: false,
			            是否为隐藏物品: false, // 地图上可见
			            效果描述: "进入时会受到伤害并可能减速。",
			            数据: {
			                倒计时: 配置.倒计时 ?? 7,
			                爆炸时间: 配置.倒计时 ?? 7, // 复用计时器接口
			                伤害: 配置.伤害 ?? 3,
			                减速概率: 配置.减速概率 ?? 0.3,
			                减速回合: 配置.减速回合 ?? 2,
			                // 可以添加一个 '来源玩家' 标记，避免玩家自己被自己的荆棘伤害？
			            },
			            ...配置,
			        });
			        this.发挥效果 = false;
			    }
			    尝试互动() {
			        if (玩家.x !== this.x || 玩家.y !== this.y) {
			            return false;
			        }
			        if (尝试收集物品(new 荆棘种子({}), true)) {
			            this.移除自身();
			            显示通知("成功回收了荆棘种子！", "成功");
			            return true;
			        } else {
			            显示通知("背包已满，无法回收种子！", "错误");
			            return false;
			        }
			    }
			    使用() {
			        return false;
			    }
			    
			    当被收集(进入者) {
			        const 伤害量 = this.自定义数据.get("伤害");
			        if (进入者 === "玩家" && false) { //废除。
			            伤害玩家(伤害量, this.名称);
			            添加日志("你踩进了荆棘丛！", "错误");
			            // 概率触发减速
			            if (prng() < this.自定义数据.get("减速概率")) {
			                new 状态效果(
			                    "缓慢",
			                    效果颜色编号映射[效果名称编号映射.缓慢],
			                    图标映射.缓慢,
			                    this.自定义数据.get("减速回合"),
			                    null,
			                    null,
			                    null,
			                    1
			                );
			                this.发挥效果 = true;
			                添加日志("你被荆棘缠绕，移动变慢了！", "错误");
			            }
			        }
			        // 注意：怪物的效果在 怪物.处理地形效果 中处理
			
			        return false; // 不可被收集
			    }
			
			    更新倒计时() {
			        const 剩余回合 = this.自定义数据.get("倒计时");
			        if (剩余回合 <= 0 && this.发挥效果) {
			            this.移除自身();
			        } else {
			            this.自定义数据.set("倒计时", 剩余回合 - 1);
			        }
			    }
			
			    移除自身() {
			        if (
			            this.x !== null &&
			            this.y !== null &&
			            地牢[this.y]?.[this.x]?.关联物品 === this
			        ) {
			            地牢[this.y][this.x].关联物品 = null;
			            if (地牢[this.y]?.[this.x]?.类型 === 单元格类型.物品)
			                地牢[this.y][this.x].类型 = null;
			            地牢[this.y][this.x].颜色索引 = 颜色表.length; // 重置颜色
			        }
			        所有计时器 = 所有计时器.filter((item) => item !== this);
			    }
			
			    获取提示() {
			        return [
			            `${this.获取名称()}`,
			            `类型：${this.类型}`,
			            `剩余时间：${this.自定义数据.get("倒计时")} 回合`,
			            `进入伤害：${this.自定义数据.get("伤害")} 点`,
			            `减速几率：${(
			                this.自定义数据.get("减速概率") * 100
			            ).toFixed(0)}% (${this.自定义数据.get(
			                "减速回合"
			            )}回合)`,
			            `${this.效果描述}`,
			        ].join("\n");
			    }
			}
			
			class 能量熔炉 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "工具",
			            名称: "能量熔炉",
			            图标: "⚙️",
			            品质: 3,
			            颜色索引: 4,
			            最大堆叠数量: 1,
			            效果描述: "消耗能量，少量修复所有已装备物品的耐久。",
			            强化: 配置.强化 || false, // 强化降低消耗或增加修复量
			            数据: {
			                能量消耗: 90 - (配置.强化 ? 15 : 0),
			                修复比例: 0.1 + (配置.强化 ? 0.05 : 0), // 修复最大耐久的10%，强化+5%
			                固定修复量: 5 + (配置.强化 ? 3 : 0), // 或至少修复5点，强化+3
			            },
			            ...配置,
			        });
			    }
			
			    使用() {
			        if (!扣除能量(this.自定义数据.get("能量消耗"))) {
			            // 调用基类卷轴的能量消耗方法
			            显示通知("能量不足！", "错误");
			            return false;
			        }
			
			        let 修复发生 = false;
			        玩家装备.forEach((装备) => {
			            if (
			                装备.自定义数据?.has("耐久") &&
			                装备.自定义数据?.has("原耐久")
			            ) {
			                const 当前耐久 = 装备.自定义数据.get("耐久");
			                const 最大耐久 = 装备.自定义数据.get("原耐久");
			                if (当前耐久 < 最大耐久) {
			                    const 按比例修复 = Math.ceil(
			                        最大耐久 * this.自定义数据.get("修复比例")
			                    );
			                    const 实际修复量 = Math.max(
			                        this.自定义数据.get("固定修复量"),
			                        按比例修复
			                    );
			                    const 新耐久 = Math.min(
			                        最大耐久,
			                        当前耐久 + 实际修复量
			                    );
			                    if (新耐久 > 当前耐久) {
			                        装备.自定义数据.set("耐久", 新耐久);
			                        修复发生 = true;
			                        添加日志(
			                            `${装备.获取名称()} 被修复了 ${
			                                新耐久 - 当前耐久
			                            } 点耐久。`,
			                            "成功"
			                        );
			                    }
			                }
			            }
			        });
			
			        if (修复发生) {
			            显示通知(`${this.获取名称()} 修复了装备！`, "成功");
			            更新装备显示(); // 更新UI
			        } else {
			            显示通知(
			                `${this.获取名称()} 发动了，但没有装备需要修复。`,
			                "信息"
			            );
			        }
			
			        更新装备显示(); // 更新冷却显示（如果装备栏显示冷却）
			        return true;
			    }
			
			    获取提示() {
			        let 基础提示 = super.获取提示();
			        基础提示 = 基础提示.replace(/堆叠：.*\n/, ""); // 移除堆叠信息
			        const 能量消耗 = this.自定义数据.get("能量消耗");
			        const 修复比例 = (
			            this.自定义数据.get("修复比例") * 100
			        ).toFixed(0);
			        const 固定修复 = this.自定义数据.get("固定修复量");
			
			        return [
			            基础提示,
			            `---`,
			            `能量消耗：${能量消耗}`,
			            `修复效果：恢复最大耐久${修复比例}% (至少${固定修复}点)`,
			        ].join("\n");
			    }
			}
			class 引雷针护符 extends 防御装备类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "引雷针护符",
			            图标: 图标映射.引雷针护符,
			            品质: 2,
			            颜色索引: 3,
			            防御力: 1,
			            耐久: 配置.耐久 || 35 + (配置.强化 ? 10 : 0),
			            原耐久: 配置.原耐久 || 35 + (配置.强化 ? 10 : 0),
			            强化: 配置.强化 || false,
			            不可破坏: false,
			            效果描述: "拦截落雷，可能获得充能或恢复能量。",
			            数据: {
			                充能概率: 0.6 + (配置.强化 ? 0.15 : 0),
			                充能持续时间: 3 + (配置.强化 ? 2 : 0),
			                充能攻击加成值: 2 + (配置.强化 ? 2 : 0),
			                能量恢复量: 15 + (配置.强化 ? 15 : 0),
			            },
			            ...配置,
			        });
			    }
			
			    当被攻击(原始攻击力, 来源 = null) {
			        if (来源 === "雷暴" && this.自定义数据.get("耐久") > 0) {
			            super.当被攻击(原始攻击力, 来源);
			            添加日志(`${this.名称} 吸收了落雷！`, "成功");
			            const 现有效果 = 玩家状态.find(
			                (s) => s.来源 === this && s.类型 === "充能"
			            );
			            if (
			                prng() < this.自定义数据.get("充能概率") &&
			                !现有效果
			            ) {
			                const 持续时间 =
			                    this.自定义数据.get("充能持续时间");
			                const 加成值 =
			                    this.自定义数据.get("充能攻击加成值");
			                const 新效果 = new 状态效果(
			                    "充能",
			                    效果颜色编号映射[效果名称编号映射.充能],
			                    "⚡",
			                    持续时间,
			                    null,
			                    this,
			                    null,
			                    加成值
			                );
			                玩家属性.攻击加成 += 加成值;
			                显示通知(
			                    "你感到了电流的涌动，攻击力提升！",
			                    "成功"
			                );
			            } else {
			                const 恢复量 = this.自定义数据.get("能量恢复量");
			                const 能量条 = document.querySelector(".power-bar");
			                const 当前能量 =
			                    parseFloat(能量条.style.width) || 0;
			                能量条.style.width = `${Math.min(
			                    100,
			                    当前能量 + 恢复量/自定义全局设置.初始能量值*100
			                )}%`;
			                显示通知(
			                    `护符转化雷电，恢复了 ${恢复量} 点能量！`,
			                    "成功"
			                );
			                触发HUD显示();
			            }
			            return 0;
			        }
			        return super.当被攻击(原始攻击力, 来源);
			    }
			    应用效果() {
			        return;
			    }
			    移除效果() {
			        const 加成值 = this.自定义数据.get("充能攻击加成值");
			        const 对应效果 = 玩家状态.find(
			            (s) => s.来源 === this && s.类型 === "充能"
			        );
			        if (对应效果 && 加成值 > 0) {
			            玩家属性.攻击加成 -= 加成值;
			        }
			    }
			
			    获取提示() {
			        let lines = super.获取提示().split("\n");
			        const effectDescIndex = lines.findIndex((line) =>
			            line.startsWith("效果描述：")
			        );
			        if (effectDescIndex !== -1) {
			            lines.splice(effectDescIndex, 1);
			        }
			
			        const 充能概率 = (
			            this.自定义数据.get("充能概率") * 100
			        ).toFixed(0);
			        const 攻击加成 = this.自定义数据.get("充能攻击加成值");
			        const 持续 = this.自定义数据.get("充能持续时间");
			        const 能量恢复 = this.自定义数据.get("能量恢复量");
			        const 当前效果 = 玩家状态.find(
			            (s) => s.来源 === this && s.类型 === "充能"
			        );
			        const 剩余 = 当前效果 ? 当前效果.剩余回合 : 0;
			
			        let 效果详情 = `效果：拦截落雷消耗 1 耐久。\n`;
			        效果详情 += ` ${充能概率}%几率获得[充能](${持续}回合, +${攻击加成}攻击力)。\n`;
			        效果详情 += ` 否则恢复 ${能量恢复} 能量。`;
			        if (剩余 > 0) {
			            效果详情 += `\n 充能剩余：${剩余}回合`;
			        }
			
			        let insertIndex = lines.findIndex((line) =>
			            line.startsWith("--- 强化效果 ---")
			        );
			        if (insertIndex === -1) {
			            insertIndex = lines.findIndex((line) =>
			                line.startsWith("耐久：")
			            );
			        }
			        if (insertIndex === -1) {
			            insertIndex = lines.length;
			        }
			        lines.splice(insertIndex, 0, 效果详情);
			
			        return lines.filter(Boolean).join("\n");
			    }
			}
			class 重力锤 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "重力锤",
			            图标: 图标映射.重力锤,
			            品质: 4,
			            基础攻击力: 12,
			            冷却回合: 11,
			            攻击范围: 3 + (配置.强化 ? 2 : 0),
			            耐久: 配置?.耐久 || 60,
			            强化: 配置?.强化 || false,
			            效果描述:
			                "猛击地面，将范围内的敌人拉向自己，然后造成范围伤害。",
			            攻击目标数: 99,
			            不可破坏: 配置?.不可破坏 || false,
			            附魔: 配置?.数据?.附魔 || [],
			            数据: {
			                伤害范围: 1 + (配置.强化 ? 2 : 0),
			                ...配置.数据,
			            },
			        });
			    }
			
			    使用(目标怪物列表,目标路径,使用者=玩家) {
			        if (
			            this.堆叠数量 <= 0 ||
			            this.自定义数据.get("冷却剩余") > 0
			        )
			            return 0;
			
			        const 拉取范围 = this.最终攻击范围;
			        const 伤害范围 = this.自定义数据.get("伤害范围");
			        const 被拉取怪物 = new Set();
			        const 拉取路径可视化 = [];
			
			        for (let dx = -拉取范围; dx <= 拉取范围; dx++) {
			            for (let dy = -拉取范围; dy <= 拉取范围; dy++) {
			                const x = 使用者.x + dx;
			                const y = 使用者.y + dy;
			
			                if (
			                    x >= 0 &&
			                    x < 地牢大小 &&
			                    y >= 0 &&
			                    y < 地牢大小
			                ) {
			                    const 单元格 = 地牢[y][x];
			                    const 怪物 = 单元格?.关联怪物;
			                    if (
			                        怪物 &&
			                        怪物.当前生命值 > 0 &&
			                        怪物.状态 === 怪物状态.活跃
			                    ) {
			                        let 拉到X = 使用者.x;
			                        let 拉到Y = 使用者.y;
			                        let 最近距离 = Infinity;
			                        let 找到位置 = false;
			                        let 移动路径 = null;
			
			                        for (let pdx = -1; pdx <= 1; pdx++) {
			                            for (let pdy = -1; pdy <= 1; pdy++) {
			                                if (pdx === 0 && pdy === 0)
			                                    continue;
			                                const 目标X = 使用者.x + pdx;
			                                const 目标Y = 使用者.y + pdy;
			                                if (
			                                    目标X >= 0 &&
			                                    目标X < 地牢大小 &&
			                                    目标Y >= 0 &&
			                                    目标Y < 地牢大小 &&
			                                    位置是否可用(
			                                        目标X,
			                                        目标Y,
			                                        true
			                                    ) &&
			                                    检查视线(
			                                        怪物.x,
			                                        怪物.y,
			                                        目标X,
			                                        目标Y,
			                                        拉取范围 + 2
			                                    )
			                                ) {
			                                    const 距离 =
			                                        Math.abs(目标X - 怪物.x) +
			                                        Math.abs(目标Y - 怪物.y);
			                                    if (距离 < 最近距离) {
			                                        const 路径 =
			                                            广度优先搜索路径(
			                                                怪物.x,
			                                                怪物.y,
			                                                目标X,
			                                                目标Y,
			                                                拉取范围 + 2,
			                                                true
			                                            );
			                                        if (
			                                            路径 &&
			                                            路径.length > 1
			                                        ) {
			                                            最近距离 = 距离;
			                                            拉到X = 目标X;
			                                            拉到Y = 目标Y;
			                                            移动路径 = 路径;
			                                            找到位置 = true;
			                                        }
			                                    }
			                                }
			                            }
			                        }
			
			                        if (
			                            找到位置 &&
			                            !(怪物.x === 拉到X && 怪物.y === 拉到Y)
			                        ) {
			                            被拉取怪物.add(怪物);
			                            拉取路径可视化.push(移动路径.slice(1));
			
			                            怪物.恢复背景类型();
			                            怪物.x = 拉到X;
			                            怪物.y = 拉到Y;
			                            怪物.保存新位置类型(拉到X, 拉到Y);
			                            地牢[拉到Y][拉到X].类型 =
			                                单元格类型.怪物;
			                            地牢[拉到Y][拉到X].关联怪物 = 怪物;
			                        }
			                    }
			                }
			            }
			        }
			        if (拉取路径可视化.length <= 0) return 0;
			        拉取路径可视化.forEach((路径, index) => {
			            setTimeout(() => {
			                计划显示格子特效(路径.slice().reverse(), "9400D3");
			            }, index * 50);
			        });
			
			        let 总有效伤害 = 0;
			        const 击中怪物 = new Set();
			        const 伤害格子 = [];
			
			        setTimeout(() => {
			            for (let ddx = -伤害范围; ddx <= 伤害范围; ddx++) {
			                for (let ddy = -伤害范围; ddy <= 伤害范围; ddy++) {
			                    const dmgX = 使用者.x + ddx;
			                    const dmgY = 使用者.y + ddy;
			                    if (
			                        dmgX >= 0 &&
			                        dmgX < 地牢大小 &&
			                        dmgY >= 0 &&
			                        dmgY < 地牢大小
			                    ) {
			                        if (
			                            检查视线(
			                                使用者.x,
			                                使用者.y,
			                                dmgX,
			                                dmgY,
			                                伤害范围 + 1
			                            )
			                        ) {
			                            伤害格子.push({ x: dmgX, y: dmgY });
			                            const 单元格 = 地牢[dmgY][dmgX];
			                            if (
			                                单元格?.关联怪物 &&
			                                单元格.关联怪物.当前生命值 > 0
			                            ) {
			                                const 怪物 = 单元格.关联怪物;
			                                if (!击中怪物.has(怪物)) {
			                                    击中怪物.add(怪物);
			                                    const 原始血量 =
			                                        怪物.当前生命值;
			                                    怪物.受伤(this.攻击力, "玩家");
			                                    const 实际伤害 =
			                                        原始血量 - 怪物.当前生命值;
			                                    if (实际伤害 > 0)
			                                        总有效伤害 += 实际伤害;
			                                }
			                            }
			                        }
			                    }
			                }
			            }
			            setTimeout(() => {
			                计划显示格子特效(伤害格子, "FFA500", 0);
			            }, 拉取路径可视化[0].length * 50);
			
			            this.自定义数据.set(
			                "耐久",
			                (
			                    this.自定义数据.get("耐久") -
			                    this.耐久消耗 * (被拉取怪物.size > 0 ? 1.2 : 1)
			                ).toFixed(1)
			            );
			            if (this.自定义数据.get("耐久") <= 0) {
			                处理销毁物品(this.唯一标识, true);
			                显示通知(`${this.名称} 已损坏！`, "警告");
			            }
			            this.自定义数据.set(
			                "冷却剩余",
			               this.最终冷却回合
			            );
			
			            if (被拉取怪物.size > 0 || 击中怪物.size > 0) {
			                let 消息 = `${this.名称} 发动！`;
			                if (被拉取怪物.size > 0)
			                    消息 += ` 拉近了 ${被拉取怪物.size} 个目标。`;
			                if (击中怪物.size > 0)
			                    消息 += ` 震击了 ${
			                        击中怪物.size
			                    } 个目标，共造成 ${总有效伤害.toFixed(
			                        1
			                    )} 点伤害！`;
			                显示通知(消息, "成功");
			
			                const 所有影响怪物 = Array.from(
			                    new Set([...被拉取怪物, ...击中怪物])
			                );
			
			                if (总有效伤害 > 0) {
			                    this.触发通用附魔(所有影响怪物);
			                }
			            } else {
			                显示通知(
			                    `${this.名称} 发动了，但未影响任何目标。`,
			                    "信息"
			                );
			            }
			
			            更新装备显示();
			            绘制();
			        }, 拉取路径可视化.length * 50 + 100);
			
			        return 1;
			    }
			
			    触发通用附魔(目标怪物列表) {
			        if (
			            this.自定义数据
			                .get("附魔")
			                ?.find((item) => item.种类 === "火焰附魔")?.等级
			        ) {
			            const 火焰等级 = this.自定义数据
			                .get("附魔")
			                .find((item) => item.种类 === "火焰附魔").等级;
			            目标怪物列表.forEach((怪物) => {
			                if (怪物.当前生命值 > 0) {
			                    new 状态效果(
			                        "火焰",
			                        "#CC5500",
			                        "火",
			                        火焰等级,
			                        null,
			                        null,
			                        怪物
			                    );
			                }
			            });
			        }
			        const 连锁附魔 = this.自定义数据
			            .get("附魔")
			            ?.find((item) => item.种类 === "连锁附魔");
			        if (连锁附魔) {
			            const 连锁距离 = 连锁附魔.等级;
			            目标怪物列表.forEach((初始目标) => {
			                if (初始目标.当前生命值 > 0) {
			                    this.触发连锁(初始目标, 连锁距离, 目标怪物列表);
			                }
			            });
			        }
			    }
			
			    获取提示() {
			        let lines = super.获取提示().split("\n");
			        const specificEffectLines = [
			            `震击范围：周围 ${this.自定义数据.get("伤害范围")} 格`,
			        ];
			        const effectDescIndex = lines.findIndex((line) =>
			            line.startsWith("效果描述：")
			        );
			        let insertAtIndex =
			            effectDescIndex !== -1
			                ? effectDescIndex + 1
			                : lines.findIndex((line) =>
			                      line.startsWith("--- 强化效果 ---")
			                  );
			        if (insertAtIndex === -1) insertAtIndex = lines.length;
			
			        lines.splice(insertAtIndex, 0, ...specificEffectLines);
			        return lines.filter(Boolean).join("\n");
			    }
			}
			class 旋风物品 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "旋风气流",
			            图标: 图标映射.旋风物品,
			            品质: 1,
			            颜色索引: 1,
			            最大堆叠数量: 1,
			            能否拾起: false, // 不能主动拾取
			            阻碍怪物: false, // 怪物可以穿过
			            效果描述: "不稳定的气流，接触会头晕。",
			            数据: {
			                倒计时: 5, // 存在5回合
			                爆炸时间: 5, // 同上，用于计时器
			                眩晕回合: 2,
			            },
			            ...配置, // 允许覆盖默认配置
			        });
			    }
			
			    使用() {
			        return false;
			    }
			
			    触发爆炸() {
			        this.移除自身();
			    }
			
			    当被收集(进入者) {
			        if (进入者 !== "玩家") return;
			        new 状态效果(
			            "眩晕",
			            效果颜色编号映射[效果名称编号映射.眩晕],
			            图标映射.眩晕,
			            this.自定义数据.get("眩晕回合")
			        );
			        return false;
			    }
			
			    移除自身() {
			        // 从地牢格子中移除
			        if (
			            this.x !== null &&
			            this.y !== null &&
			            地牢[this.y]?.[this.x]?.关联物品 === this
			        ) {
			            地牢[this.y][this.x].关联物品 = null;
			            if (地牢[this.y]?.[this.x]?.类型 === 单元格类型.物品)
			                地牢[this.y][this.x].类型 = null; // 恢复原始格子类型
			        }
			        所有计时器 = 所有计时器.filter((item) => item !== this);
			        绘制(); // 更新画面
			    }
			
			    更新倒计时() {
			        const 剩余回合 = this.自定义数据.get("倒计时");
			        if (剩余回合 <= 0) {
			            // 用 <= 0 更安全
			            this.触发爆炸(); // 时间到，移除物品
			        } else {
			            this.自定义数据.set("倒计时", 剩余回合 - 1);
			        }
			    }
			}
			class 磨刀石 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "工具",
			            名称: "磨刀石",
			            图标: 图标映射.磨刀石,
			            品质: 3,
			            颜色索引: 4, 
			            最大堆叠数量: 1,
			            效果描述: "用于融合，可强化武器。先放磨刀石，再放武器。",
			            数据: {
			                耐久: 5 + (配置.强化 ? 3 : 0),
			                原耐久: 5 + (配置.强化 ? 3 : 0),
			            },
			            ...配置,
			        });
			    }
			    使用() {
			        return false;
			    }
			
			    获取提示() {
			        return `${this.获取名称()}\n类型：${
			this.类型
			        }\n品质：${"★".repeat(
			this.品质
			        )}\n效果：${this.效果描述}\n剩余使用次数：${this.自定义数据.get("耐久")}`;
			    }
			}
			class 刷怪笼 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "刷怪笼",
			            图标: 图标映射.刷怪笼,
			            品质: 4,
			            能否拾起: false,
			            阻碍怪物: true,
			            效果描述: "周期性地生成怪物或物品。",
			            数据: {
			                生成物类名: 配置.数据?.生成物类名 || '怪物',
			                生成间隔: 配置.数据?.生成间隔 || 5,
			                剩余间隔: 配置.数据?.剩余间隔 || 5,
			                生成半径: 配置.数据?.生成半径 || 3,
			                生成数量: 配置.数据?.生成数量 || 1,
			                生成上限: 配置.数据?.生成上限 || 5,
			                是否激活: 配置.数据?.是否激活 !== undefined ? 配置.数据.是否激活 : true,
			                是否生成点燃的炸弹: 配置.数据?.是否生成点燃的炸弹 || false,
			                巡逻方向: 配置.数据?.巡逻方向 || 'E',
			                当前生成物列表: [],
			                ...配置.数据,
			            },
			            ...配置,
			        });
			    }
			
			    更新倒计时() {
			        if (!this.自定义数据.get('是否激活')) return;
			        let 剩余 = this.自定义数据.get('剩余间隔');
			        剩余--;
			        if (剩余 <= 0) {
			this.尝试生成();
			剩余 = this.自定义数据.get('生成间隔');
			        }
			        this.自定义数据.set('剩余间隔', 剩余);
			    }
			
			    尝试生成() {
			        const 已生成列表 = this.自定义数据.get('当前生成物列表') || [];
			        const 存活列表 = 已生成列表.filter(实例 => 
			            (实例 instanceof 怪物 && 所有怪物.includes(实例)) ||
			            (实例 instanceof 物品 && 所有计时器.includes(实例))
			        );
			        this.自定义数据.set('当前生成物列表', 存活列表);
			
			        if (存活列表.length >= this.自定义数据.get('生成上限')) {
			            return;
			        }
			
			        const 数量 = Math.min(this.自定义数据.get('生成上限')-存活列表.length,this.自定义数据.get('生成数量'));
			        for (let i = 0; i < 数量; i++) {
			            const 半径 = this.自定义数据.get('生成半径');
			            let 放置成功 = false;
			            for(let 尝试 = 0; 尝试 < 200; 尝试++){
			                const dx = Math.floor(prng() * (2 * 半径 + 1)) - 半径;
			                const dy = Math.floor(prng() * (2 * 半径 + 1)) - 半径;
			                
			                if (Math.abs(dx) + Math.abs(dy) > 半径) {
			                    continue;
			                }
			
			                const x = this.x + dx;
			                const y = this.y + dy;
			
			                if (位置是否可用(x, y, true)) {
			                    let 实例;
			                    if (this.自定义数据.get('是否生成点燃的炸弹')) {
			                        const 放置炸弹 = new 炸弹({ 能否拾起: false, 来源: '怪物', 颜色索引: 4 });
			                        放置物品到单元格(放置炸弹, x, y);
			                        放置炸弹.使用(false, x, y);
			                    } else {
			                        const 构造器 = window[this.自定义数据.get('生成物类名')];
			                        if (构造器) {
			                            let 怪物配置 = {状态: 怪物状态.活跃};
			                            if (构造器 === 巡逻怪物) {
			                                怪物配置.巡逻方向 = this.自定义数据.get('巡逻方向');
			                            }
			                            实例 = new 构造器(怪物配置);
			                            放置怪物到单元格(实例, x, y);
			                        }
			                    }
			                    if(实例){
			                        存活列表.push(实例);
			                    }
			                    放置成功 = true;
			                    break;
			                }
			            }
			        }
			        this.自定义数据.set('当前生成物列表', 存活列表);
			    }
			}
			
			class 卷轴滚动墙 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "卷轴滚动墙",
			            图标: 图标映射.卷轴滚动墙,
			            品质: 1,
			            颜色索引: 4,
			            能否拾起: false,
			            是否正常物品: false,
			            阻碍怪物: false,
			            
			            效果描述: "阻挡视线的魔法墙壁，可通过开关控制。",
			            数据: {
			                开关控制: true,
			                ...配置.数据,
			            },
			            ...配置,
			        });
			    }
			    get 阻碍视野() {
			        if (this.自定义数据.get('开关控制')) {
			            return 绿紫开关状态 !== '紫';
			        }
			        return true;
			    }
			    set 阻碍视野(值){}
			}
			class 传送带 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			类型: "地形",
			名称: "传送带",
			图标: '→',
			品质: 2,
			能否拾起: false,
			阻碍怪物: false,
			效果描述: "将物品或生物向指定方向传送。",
			...配置,
			数据: {
			    方向: 配置.数据?.方向 || 上次放置的传送带?.自定义数据.get('方向') || 'E',
			    开关控制: 配置.数据?.开关控制 || 上次放置的传送带?.自定义数据.get('开关控制') || false,
			    开关激发: 配置.数据?.开关激发 || 上次放置的传送带?.自定义数据.get('开关激发') || false,
			    力度: 配置.数据?.力度?? 上次放置的传送带?.自定义数据.get('力度') ?? 1,
			    ...配置.数据,
			},
			
			        });
			        
			    }
			    set 颜色索引(a) {}
			    get 颜色索引() {
			        return this.自定义数据.get('开关控制')?4:this.自定义数据.get('开关激发')?3:2
			    }
			
			    get 图标() {
			        const 方向图标 = { N: '↑', S: '↓', E: '→', W: '←' };
			        return 方向图标[this.自定义数据.get('方向')] || '→';
			    }
			    set 图标(a) {}
			}
			
			class 巡逻怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.巡逻怪物,
			            类型: "巡逻怪物",
			            基础生命值: 40,
			            基础攻击力: 20,
			            掉落概率: 0,
			            ...配置,
			        });
			        
			        this.随机游走 = 配置.随机游走 ?? false;
			        this.随机游走方向 = 配置.随机游走方向 || '';
			        this.巡逻方向 = 配置.巡逻方向 || 'E';
			
			        const canMove = (x, y, dx, dy) => {
			            const newX = x + dx;
			            const newY = y + dy;
			            if (newX < 0 || newX >= 地牢大小 || newY < 0 || newY >= 地牢大小) return false;
			            const targetCell = 地牢[newY]?.[newX];
			            if (!targetCell || [单元格类型.墙壁, 单元格类型.上锁的门].includes(targetCell.背景类型) || (targetCell.关联物品 && targetCell.关联物品.阻碍怪物) || targetCell.关联怪物) {
			                return false;
			            }
			            return 快速检查相邻移动(x, y, newX, newY);
			        };
			
			        if (this.随机游走) {
			            const { x, y } = this;
			            const canGoEast = canMove(x, y, 1, 0);
			            const canGoWest = canMove(x, y, -1, 0);
			            const canGoNorth = canMove(x, y, 0, -1);
			            const canGoSouth = canMove(x, y, 0, 1);
			
			            const horizontalFree = canGoEast && canGoWest;
			            const verticalFree = canGoNorth && canGoSouth;
			
			            if (horizontalFree && verticalFree) {
			                if (prng() < 0.5) {
			                   this.巡逻方向 = prng() < 0.5 ? 'E' : 'W';
			                } else {
			                   this.巡逻方向 = prng() < 0.5 ? 'N' : 'S';
			                }
			            } else if (horizontalFree) {
			                this.巡逻方向 = prng() < 0.5 ? 'E' : 'W';
			            } else if (verticalFree) {
			                this.巡逻方向 = prng() < 0.5 ? 'N' : 'S';
			            } else {
			                const possibleDirections = [];
			                if (canGoEast) possibleDirections.push('E');
			                if (canGoWest) possibleDirections.push('W');
			                if (canGoNorth) possibleDirections.push('N');
			                if (canGoSouth) possibleDirections.push('S');
			                if (possibleDirections.length > 0) {
			                    this.巡逻方向 = possibleDirections[Math.floor(prng() * possibleDirections.length)];
			                }
			            }
			            return;
			        } else if (this.随机游走方向 && this.随机游走方向.length > 0) {
			            const directions = this.随机游走方向.split('');
			            this.巡逻方向 = directions[Math.floor(prng() * directions.length)];
			        }
			    }
			    初始巡逻() {
			        const canMove = (x, y, dx, dy) => {
			            const newX = x + dx;
			            const newY = y + dy;
			            if (newX < 0 || newX >= 地牢大小 || newY < 0 || newY >= 地牢大小) return false;
			            const targetCell = 地牢[newY]?.[newX];
			            if (!targetCell || [单元格类型.墙壁, 单元格类型.上锁的门].includes(targetCell.背景类型) || (targetCell.关联物品 && targetCell.关联物品.阻碍怪物) || targetCell.关联怪物) {
			                return false;
			            }
			            return 快速检查相邻移动(x, y, newX, newY);
			        };
			
			        if (this.随机游走) {
			            const { x, y } = this;
			            const canGoEast = canMove(x, y, 1, 0);
			            const canGoWest = canMove(x, y, -1, 0);
			            const canGoNorth = canMove(x, y, 0, -1);
			            const canGoSouth = canMove(x, y, 0, 1);
			
			            const horizontalFree = canGoEast && canGoWest;
			            const verticalFree = canGoNorth && canGoSouth;
			
			            if (horizontalFree && verticalFree) {
			                if (prng() < 0.5) {
			                   this.巡逻方向 = prng() < 0.5 ? 'E' : 'W';
			                } else {
			                   this.巡逻方向 = prng() < 0.5 ? 'N' : 'S';
			                }
			            } else if (horizontalFree) {
			                this.巡逻方向 = prng() < 0.5 ? 'E' : 'W';
			            } else if (verticalFree) {
			                this.巡逻方向 = prng() < 0.5 ? 'N' : 'S';
			            } else {
			                const possibleDirections = [];
			                if (canGoEast) possibleDirections.push('E');
			                if (canGoWest) possibleDirections.push('W');
			                if (canGoNorth) possibleDirections.push('N');
			                if (canGoSouth) possibleDirections.push('S');
			                if (possibleDirections.length > 0) {
			                    this.巡逻方向 = possibleDirections[Math.floor(prng() * possibleDirections.length)];
			                }
			            }
			            return;
			        } else if (this.随机游走方向 && this.随机游走方向.length > 0) {
			            const directions = this.随机游走方向.split('');
			            this.巡逻方向 = directions[Math.floor(prng() * directions.length)];
			        }
			    }
			
			    尝试移动() {
			        const 旧X = this.x;
			        const 旧Y = this.y;
			        const 我的状态 = 怪物状态表.get(this);
			        if (我的状态) {
			            switch (我的状态.类型) {
			                case "冻结":
			                case "眩晕":
			                case "牵制":
			                    return;
			                case "恐惧":
			                    return;
			            }
			        }
			
			        if (this.受伤冻结回合剩余 > 0) {
			            this.受伤冻结回合剩余--;
			            return;
			        }
			
			        const 方向向量 = { N: {dx: 0, dy: -1}, S: {dx: 0, dy: 1}, E: {dx: 1, dy: 0}, W: {dx: -1, dy: 0} };
			        const 反向 = { N: 'S', S: 'N', E: 'W', W: 'E' };
			
			        const 检查路径是否通畅 = (当前X, 当前Y, 移动DX, 移动DY) => {
			            const 目标X = 当前X + 移动DX;
			            const 目标Y = 当前Y + 移动DY;
			            if (目标X < 0 || 目标X >= 地牢大小 || 目标Y < 0 || 目标Y >= 地牢大小) return false;
			            
			            const 目标单元格 = 地牢[目标Y]?.[目标X];
			            if (!目标单元格 || (目标单元格.关联物品 && 目标单元格.关联物品.阻碍怪物) || 目标单元格.关联怪物 ||!this.位置合法(目标X,目标Y)) return false;
			            
			            return 检查移动可行性(当前X, 当前Y, 目标X, 目标Y);
			        };
			
			        let {dx, dy} = 方向向量[this.巡逻方向];
			        let 移动成功 = false;
			
			        for (let i = 0; i < this.移动距离; i++) {
			            if (检查路径是否通畅(this.x, this.y, dx, dy)) {
			                this.恢复背景类型();
			                this.x += dx;
			                this.y += dy;
			                this.保存新位置类型(this.x, this.y);
			                地牢[this.y][this.x].类型 = 单元格类型.怪物;
			                地牢[this.y][this.x].关联怪物 = this;
			                const 开关 = 地牢[this.y][this.x].关联物品;
			                if (开关 && (开关 instanceof 红蓝开关 || 开关 instanceof 绿紫开关)) {
			                    开关.使用();
			                }
			                移动成功 = true;
			            } else {
			                this.巡逻方向 = 反向[this.巡逻方向];
			                let {dx: newDx, dy: newDy} = 方向向量[this.巡逻方向];
			                if (检查路径是否通畅(this.x, this.y, newDx, newDy)) {
			                    dx = newDx;
			                    dy = newDy;
			                    i--;
			                } else {
			                    break;
			                }
			            }
			        }
			
			        if (移动成功) {
			            怪物动画状态.set(this, {
			                旧逻辑X: 旧X, 旧逻辑Y: 旧Y,
			                目标逻辑X: this.x, 目标逻辑Y: this.y,
			                视觉X: 旧X, 视觉Y: 旧Y,
			                动画开始时间: Date.now(), 正在动画: true,
			            });
			        }
			    }
			    尝试攻击() {
			        let 目标 = this.目标;
			        if (!目标) return false;
			        if (怪物状态表.get(this)?.类型 === "冻结") return;
			        const 距离目标 = Math.abs(this.x - 目标.x) + Math.abs(this.y - 目标.y);
			        if (距离目标>this.攻击范围) return;
			        let 攻击方向=方向到向量(this.巡逻方向)
			        if ((Math.sign(目标.x-this.x)!==攻击方向.dx||Math.sign(目标.y-this.y)!==攻击方向.dy)&&(目标.x!==this.x||目标.y!==this.y)) return;
			        this.绘制血条();
			        if (目标.x === 玩家.x && 目标.y === 玩家.y) {
			            伤害玩家(this.攻击力, this);
			            计划显示格子特效([{x:玩家.x,y:玩家.y}])
			        } else if (目标 instanceof 怪物) { 
			             目标.受伤(this.攻击力, this);
			        } else {
			            return false;
			        }
			        
			        
			        return true;
			    }
			}
			
			class 同步怪物 extends 怪物 {
			    constructor(配置 = {}) {
			        super({
			图标: 图标映射.同步怪物,
			类型: "同步怪物",
			基础生命值: 40,
			基础攻击力: 6,
			掉落概率: 0,
			...配置,
			        });
			    }
			
			    尝试移动() {
			        if (this.受伤冻结回合剩余 > 0) {
			this.受伤冻结回合剩余--;
			return;
			        }
			
			        
			const 当前距离 = Math.abs(this.x - 玩家.x) + Math.abs(this.y - 玩家.y);
			if (当前距离 <= 1) return;
			
			const 移动选项 = [];
			const 方向 = [{dx: 0, dy: -1}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 1, dy: 0}];
			
			for(const {dx, dy} of 方向) {
			    const 新X = this.x + dx;
			    const 新Y = this.y + dy;
			    if(新X < 0 || 新X >= 地牢大小 || 新Y < 0 || 新Y >= 地牢大小) continue;
			    const 新距离 = Math.abs(新X - 玩家.x) + Math.abs(新Y - 玩家.y);
			    const 目标单元格 = 地牢[新Y]?.[新X];
			    if (新距离 < 当前距离 && 目标单元格 && ![单元格类型.墙壁, 单元格类型.上锁的门].includes(目标单元格.背景类型) && !(目标单元格.关联物品 && 目标单元格.关联物品.阻碍怪物) && !目标单元格.关联怪物 && 快速检查相邻移动(this.x, this.y, 新X, 新Y)) {
			        移动选项.push({dx, dy, 新距离});
			    }
			}
			
			if (移动选项.length === 0) return;
			
			移动选项.sort((a,b) => a.新距离 - b.新距离);
			const 最佳移动 = 移动选项[0];
			const 旧X = this.x;
			const 旧Y = this.y;
			this.恢复背景类型();
			this.x += 最佳移动.dx;
			this.y += 最佳移动.dy;
			this.保存新位置类型(this.x, this.y);
			地牢[this.y][this.x].类型 = 单元格类型.怪物;
			地牢[this.y][this.x].关联怪物 = this;
			怪物动画状态.set(this, { 旧逻辑X: 旧X, 旧逻辑Y: 旧Y, 目标逻辑X: this.x, 目标逻辑Y: this.y, 视觉X: 旧X, 视觉Y: 旧Y, 动画开始时间: Date.now(), 正在动画: true, });
			
			
			const 开关 = 地牢[this.y][this.x].关联物品;
			if (开关 && (开关 instanceof 红蓝开关 || 开关 instanceof 绿紫开关)) {
			    开关.使用();
			}
			        
			    }
			}
			
			class 急救绷带 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "消耗品",
			            名称: "急救绷带",
			            图标: 图标映射.急救绷带,
			            品质: 2,
			            颜色索引: 0, 
			            堆叠数量: 配置.数量 || 1,
			            最大堆叠数量: 16,
			            效果描述: "恢复大量生命值，并移除中毒和火焰效果。",
			            数据: {
			                恢复量: 40 + (配置.强化 ? 20 : 0),
			            },
			            ...配置,
			        });
			    }
			
			    使用() {
			        if (this.堆叠数量 <= 0) return false;
			
			        const 生命条 = document.querySelector(".health-bar");
			        const 当前宽度 = parseFloat(生命条.style.width) || 0;
			        const 新宽度 = Math.min(100, 当前宽度 + this.自定义数据.get("恢复量"));
			        if (新宽度 > 当前宽度) {
			            生命条.style.width = `${新宽度}%`;
			        }
			        
			        const 待移除状态 = [];
			        玩家状态.forEach(状态 => {
			            if (状态.类型 === '中毒' || 状态.类型 === '火焰') {
			                待移除状态.push(状态);
			            }
			        });
			
			        待移除状态.forEach(状态 => {
			            状态.移除状态();
			        });
			
			        this.堆叠数量--;
			        if (this.堆叠数量 <= 0) {
			            处理销毁物品(this.唯一标识, true);
			        }
			
			        显示通知("你使用了急救绷带！感觉好多了。", "成功");
			        更新背包显示();
			        更新装备显示();
			        触发HUD显示();
			
			        return true;
			    }
			
			    获取提示() {
			        return `${this.获取名称()}\n类型：${this.类型}\n品质：${"★".repeat(
			this.品质
			        )}\n效果：${this.效果描述}\n恢复量：${this.自定义数据.get("恢复量")}点`;
			    }
			}
			
			 class 照明弹光源 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "照明弹光源",
			            图标: 图标映射.照明弹光源,
			            能否拾起: false,
			            是否正常物品: false,
			            是否为隐藏物品: true,
			            阻碍怪物: false,
			            数据: {
			                倒计时: 配置.耐久 || 15,
			                爆炸时间: 配置.耐久 || 15, 
			                光照范围: 6 + (配置.强化 ? 2 : 0),
			            },
			            ...配置,
			        });
			    }
			    更新倒计时() {
			        const 剩余回合 = this.自定义数据.get("倒计时");
			        if (剩余回合 <= 0) {
			            this.移除自身();
			        } else {
			            this.自定义数据.set("倒计时", 剩余回合 - 1);
			        }
			    }
			    移除自身() {
			        if (
			            this.x !== null &&
			            this.y !== null &&
			            地牢[this.y]?.[this.x]?.关联物品 === this
			        ) {
			            地牢[this.y][this.x].关联物品 = null;
			            地牢[this.y][this.x].类型 = null;
			        }
			        所有计时器 = 所有计时器.filter((item) => item !== this);
			        绘制();
			    }
			}
			
			class 照明弹 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "工具",
			            名称: "照明弹",
			            图标: 图标映射.照明弹,
			            品质: 2,
			            颜色索引: 2,
			            最大堆叠数量: 1,
			            效果描述: "使用后点亮大片区域，持续15回合。",
			            数据: {
			                耐久: 3 + (配置.强化 ? 2 : 0), 
			                原耐久: 3 + (配置.强化 ? 2 : 0),
			            },
			            ...配置,
			        });
			    }
			
			    使用() {
			        if (this.自定义数据.get("耐久") <= 0) return false;
			
			        const lightSource = new 照明弹光源({强化: this.强化});
			        lightSource.x = 玩家.x;
			        lightSource.y = 玩家.y;
			        if (!放置物品到单元格(lightSource,玩家.x,玩家.y)) return false;
			        所有计时器.push(lightSource);
			
			        this.自定义数据.set("耐久", this.自定义数据.get("耐久") - 1);
			        if (this.自定义数据.get("耐久") <= 0) {
			            处理销毁物品(this.唯一标识, true);
			        }
			        更新背包显示();
			        更新装备显示();
			        显示通知("照明弹升空，照亮了周围！", "成功");
			        绘制(); 
			        return true;
			    }
			}
			class 开关脉冲器 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "开关脉冲器",
			            图标: 图标映射.开关脉冲器,
			            品质: 4,
			            能否拾起: false,
			            阻碍怪物: false,
			            效果描述: "监测特定开关状态并周期性地触发脉冲。",
			            ...配置,
			            数据: {
			                监测状态: 配置.监测状态 || 上次放置的开关脉冲器?.自定义数据?.get('监测状态') || '红', 
			                脉冲范围: 配置.脉冲范围 || 上次放置的开关脉冲器?.自定义数据?.get('脉冲范围') || 3,
			                脉冲冷却: 配置.脉冲冷却 || 上次放置的开关脉冲器?.自定义数据?.get('脉冲冷却') || 2,
			                禁用特效: 配置.禁用特效 || 上次放置的开关脉冲器?.自定义数据?.get('禁用特效') || false,
			                脉冲冷却剩余: 0,
			                ...配置.数据,
			            },
			        });
			        this.正在触发 = false
			    }
			
			    更新倒计时() {
			        let 冷却 = this.自定义数据.get('脉冲冷却剩余');
			        if (冷却 > 0) {
			            this.自定义数据.set('脉冲冷却剩余', 冷却 - 1);
			            return;
			        }
			        
			        const 监测状态 = this.自定义数据.get('监测状态');
			        const 当前开关状态 = (监测状态 === '红' || 监测状态 === '蓝') ? 红蓝开关状态 : 绿紫开关状态;
			
			        if (当前开关状态 === 监测状态) {
			            this.触发脉冲();
			            this.自定义数据.set('脉冲冷却剩余', this.自定义数据.get('脉冲冷却'));
			        }
			    }
			
			    触发脉冲() {
			        if(!(地牢[this.y][this.x].关联物品 instanceof 开关脉冲器)) {
			
			            return;
			        }
			        const 监测状态 = this.自定义数据.get('监测状态');
			        const 当前开关状态 = (监测状态 === '红' || 监测状态 === '蓝') ? 红蓝开关状态 : 绿紫开关状态;
			
			        if (当前开关状态 !== 监测状态) {
			            return;
			        }
			        this.正在触发 = true
			        const 范围 = this.自定义数据.get('脉冲范围');
			        const 脉冲格子 = [];
			        const 影响的怪物 = new Set();
			        const 影响的物品 = new Set();
			
			        for (let dy = -范围; dy <= 范围; dy++) {
			            for (let dx = -范围; dx <= 范围; dx++) {
			                const 目标X = this.x + dx;
			                const 目标Y = this.y + dy;
			                if (目标X < 0 || 目标X >= 地牢大小 || 目标Y < 0 || 目标Y >= 地牢大小) continue;
			                
			                脉冲格子.push({x: 目标X, y: 目标Y});
			                if(!this.自定义数据.get("禁用特效")) 计划显示格子特效([{x: 目标X, y: 目标Y}], '00FFFF', 20);
			
			                const 单元格 = 地牢[目标Y]?.[目标X];
			                if (!单元格) continue;
			
			                if (单元格.关联怪物 && 单元格.关联怪物.当前生命值 > 0) {
			                    影响的怪物.add(单元格.关联怪物);
			                }
			                if (单元格.关联物品 && 单元格.关联物品 !== this && !(单元格.关联物品 instanceof 开关脉冲器 && 单元格.关联物品?.正在触发)) {
			                    影响的物品.add(单元格.关联物品);
			                }
			            }
			        }
			
			        
			        
			        const 玩家穿了潜行靴子 = Array.from(玩家装备.values()).some(item => item instanceof 潜行靴子);
			
			        影响的怪物.forEach(m => {
			            if (m.状态 !== 怪物状态.活跃 || m.当前生命值 <= 0) return;
			            if (地牢[m.y]?.[m.x]?.关联物品 instanceof 传送带) return;
			
			            const 原始移动距离 = m.基础移动距离;
			            const 我的状态 = 怪物状态表.get(m);
			            我的状态?.更新状态();
			
			            if (m instanceof 同步怪物 || m instanceof 巡逻怪物) {
			                m.尝试移动();
			                let 目标 = m.选择目标();
			                m.目标 = 目标;
			                m.尝试攻击();
			                return;
			            }
			            if (m.始终追踪玩家) {
			                m.追踪玩家();
			                
			            }
			
			            let 目标 = m.选择目标();
			            m.目标 = 目标;
			            let { x, y } = 目标;
			
			            let 可以追踪 = true;
			            if (玩家穿了潜行靴子 && 我的状态?.类型 !== "魅惑" && 目标 === 玩家) {
			                可以追踪 = 快速直线检查(m.x, m.y, 玩家.x, 玩家.y, m.跟踪距离);
			            }
			
			            const 曼哈顿距离 = Math.abs(m.x - x) + Math.abs(m.y - y);
			            if (可以追踪 && 曼哈顿距离 <= m.跟踪距离) {
			                m.目标路径 = m.计算路径(x, y);
			            } else {
			                m.目标路径 = null;
			            }
			
			            if (m.目标路径) {
			                const 行动次数 = m.本回合行动次数 || 1;
			                for (let i = 0; i < 行动次数; i++) {
			                    
			                        if (m.目标路径.length > 0 && !(m.目标路径.length > 1 && 玩家状态.some(s => s.类型 === "隐身") && 我的状态?.类型 !== "魅惑")) {
			                            if (我的状态?.类型 !== "魅惑") m.追击玩家中 = true;
			                            m.尝试移动();
			                        } else {
			                            m.追击玩家中 = false;
			                        }
			                    
			                    m.通向目标路径 = m.计算目标路径(m.目标.x, m.目标.y);
			                    if (m.通向目标路径 && !(m.通向目标路径.length > 1 && 玩家状态.some(s => s.类型 === "隐身") && 我的状态?.类型 !== "魅惑")) {
			                        m.尝试攻击();
			                    }
			                    if (m.当前生命值 <= 0) break;
			                }
			                if (m?.本回合行动次数 > 1) m.本回合行动次数 = 1;
			            }
			            
			            m.基础移动距离 = 原始移动距离;
			            if (m instanceof 大魔法师) m.更新技能冷却();
			        });
			
			        影响的物品.forEach(物品 => {
			            物品.更新倒计时?.();
			            if (物品 instanceof 红蓝开关 || 物品 instanceof 绿紫开关) {
			            if (!物品.自定义数据.get('隐藏')) 物品.使用()
			            }
			        });
			        this.正在触发 = false
			    }
			}
			class 红蓝开关 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "红蓝开关",
			            图标: 图标映射.红蓝开关,
			            品质: 3,
			            颜色索引: 4,
			            能否拾起: false,
			            是否正常物品: false,
			            阻碍怪物: false,
			            效果描述: "激活后，切换所有红色和蓝色方块的状态。",
			            ...配置,
			             数据: {
			                耐久: 配置.数据?.耐久 === undefined ? -1 : 配置.数据.耐久,
			                隐藏: 配置.数据?.隐藏 === undefined ? false : 配置.数据.隐藏,
			                广播距离: 配置.数据?.广播距离 === undefined ? 5 : 配置.数据.广播距离,
			                ...配置.数据,
			            },
			        });
			    }
			    get 颜色索引() {
			        return 红蓝开关状态 === '红' ? 4 : 1
			    }
			    set 颜色索引(a) {}
			
			    尝试互动() {
			        if (玩家.x !== this.x || 玩家.y !== this.y) {
			            return false;
			        }
			        this.使用();
			        return true;
			    }
			
			    使用() {
			        const 耐久 = this.自定义数据.get('耐久');
			        if (耐久 === 0) return true; 
			
			        if (耐久 > 0) {
			            this.自定义数据.set('耐久', 耐久 - 1);
			            if (this.自定义数据.get('耐久') <= 0) {
			                显示通知(`${this.名称} 的能量耗尽了！`, "警告");
			            }
			        }
			
			        红蓝开关状态 = 红蓝开关状态 === '红' ? '蓝' : '红';
			        添加日志(`开关已切换为 ${红蓝开关状态 === '红' ? '红色' : '蓝色'} 状态！`, "信息");
			        const 激活的砖块类型 = 红蓝开关状态 === '红' ? '红砖块' : '蓝砖块';
			
			        const 脉冲器列表 = [];
			        const 传送带列表 = [];
			        for (let y = 0; y < 地牢大小; y++) {
			            for (let x = 0; x < 地牢大小; x++) {
			                const 物品 = 地牢[y]?.[x]?.关联物品;
			                const 单元格 = 地牢[y][x];
			                if (物品 instanceof 开关脉冲器) {
			                    const 距离 = Math.abs(x - this.x) + Math.abs(y - this.y);
			                    脉冲器列表.push({ 实例: 物品, 距离: 距离 });
			                }
			                if (物品 instanceof 传送带) {
			                    传送带列表.push(物品);
			                }
			                if (单元格?.关联物品?.名称 === 激活的砖块类型 && 单元格.关联怪物) {
			                    推开生物(x, y);
			                }
			            }
			        }
			
			        const 按距离分组的脉冲器 = new Map();
			        脉冲器列表.forEach(item => {
			            if (!按距离分组的脉冲器.has(item.距离)) {
			                按距离分组的脉冲器.set(item.距离, []);
			            }
			            按距离分组的脉冲器.get(item.距离).push(item.实例);
			        });
			
			        const 排序后的距离 = Array.from(按距离分组的脉冲器.keys()).sort((a, b) => a - b);
			
			        排序后的距离.forEach((距离, 索引) => {
			            if (距离 > this.自定义数据.get('广播距离')) return;
			            const 脉冲器组 = 按距离分组的脉冲器.get(距离);
			            脉冲器组.forEach(脉冲器 => {if(!脉冲器.正在触发) 脉冲器.触发脉冲()});
			            
			        });
			        
			        
			
			    for (const 带 of 传送带列表) {
			        const 单元格 = 地牢[带.y]?.[带.x];
			
			            let 移动方向 = 带.自定义数据.get('方向');
			            
			            if (带.自定义数据.get('开关控制')) {
			                
			                    const 反向 = { N: 'S', S: 'N', E: 'W', W: 'E' };
			                    带.自定义数据.set('方向',反向[移动方向]);
			                }
			    }
			        return true;
			    }
			     get 是否为隐藏物品() {
			        return this.自定义数据.get('隐藏');
			    }
			    set 是否为隐藏物品(值) {
			         this.自定义数据.set('隐藏', 值);
			    }
			}
			class 绿紫开关 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "绿紫开关",
			            图标: 图标映射.绿紫开关,
			            品质: 3,
			            能否拾起: false,
			            是否正常物品: false,
			            阻碍怪物: false,
			            效果描述: "激活后，切换所有绿色和紫色方块的状态。",
			            ...配置,
			            数据: {
			                耐久: 配置.数据?.耐久 === undefined ? -1 : 配置.数据.耐久,
			                隐藏: 配置.数据?.隐藏 === undefined ? false : 配置.数据.隐藏,
			                广播距离: 配置.数据?.广播距离 === undefined ? 5 : 配置.数据.广播距离,
			                ...配置.数据,
			            },
			        });
			    }
			    get 颜色索引() {
			        return 绿紫开关状态 === '绿' ? 0 : 5
			    }
			    set 颜色索引(a) {}
			    
			    尝试互动() {
			        if (玩家.x !== this.x || 玩家.y !== this.y) {
			            return false;
			        }
			        this.使用();
			        return true;
			    }
			    使用() {
			        const 耐久 = this.自定义数据.get('耐久');
			        if (耐久 === 0) return true;
			
			        if (耐久 > 0) {
			            this.自定义数据.set('耐久', 耐久 - 1);
			             if (this.自定义数据.get('耐久') <= 0) {
			                显示通知(`${this.名称} 的能量耗尽了！`, "警告");
			            }
			        }
			        绿紫开关状态 = 绿紫开关状态 === '绿' ? '紫' : '绿';
			        添加日志(`开关已切换为 ${绿紫开关状态 === '绿' ? '绿色' : '紫色'} 状态！`, "信息");
			        
			
			        const 脉冲器列表 = [];
			        const 激活的砖块类型 = 绿紫开关状态 === '绿' ? '绿砖块' : '紫砖块';
			        for (let y = 0; y < 地牢大小; y++) {
			            for (let x = 0; x < 地牢大小; x++) {
			                const 物品 = 地牢[y]?.[x]?.关联物品;
			                const 单元格 = 地牢[y][x];
			                if (物品 instanceof 开关脉冲器) {
			                    const 距离 = Math.abs(x - this.x) + Math.abs(y - this.y);
			                    脉冲器列表.push({ 实例: 物品, 距离: 距离 });
			                } else if (物品 instanceof 绿紫开关 && 物品.图标 !== "切"){
			                    物品.图标=绿紫开关状态 === '绿' ? "🟢":"🟣"
			                } else if (单元格?.关联物品?.名称 === 激活的砖块类型 && 单元格.关联怪物) {
			                    推开生物(x, y);
			                } else if (物品 instanceof 卷轴滚动墙 && 物品.图标 !== "停"){
			                    物品.图标=绿紫开关状态 === '绿' ? "🚫":""
			                }
			            }
			        }
			
			        const 按距离分组的脉冲器 = new Map();
			        脉冲器列表.forEach(item => {
			            if (!按距离分组的脉冲器.has(item.距离)) {
			                按距离分组的脉冲器.set(item.距离, []);
			            }
			            按距离分组的脉冲器.get(item.距离).push(item.实例);
			        });
			
			        const 排序后的距离 = Array.from(按距离分组的脉冲器.keys()).sort((a, b) => a - b);
			
			        排序后的距离.forEach((距离, 索引) => {
			            if (距离 > this.自定义数据.get('广播距离')) return;
			            const 脉冲器组 = 按距离分组的脉冲器.get(距离);
			            脉冲器组.forEach(脉冲器 => {if(!脉冲器.正在触发) 脉冲器.触发脉冲()});
			            
			        });
			
			        更新视口()
			        return true;
			    }
			     get 是否为隐藏物品() {
			        return this.自定义数据.get('隐藏');
			    }
			    set 是否为隐藏物品(值) {
			         this.自定义数据.set('隐藏', 值);
			    }
			}
			
			class 红砖块 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "开关砖",
			            名称: "红砖块",
			            图标: 图标映射.红砖块,
			            品质: 1,
			            颜色索引: 4,
			            能否拾起: false,
			            是否正常物品: false,
			            ...配置,
			        });
			    }
			    
			    get 阻碍怪物() {
			        return 红蓝开关状态 === '红';
			    }
			    
			    get 是否为隐藏物品() {
			        return 红蓝开关状态 !== '红';
			    }
			    set 阻碍怪物(a) {}
			    set 是否为隐藏物品(a){}
			
			    当被收集(进入者) {
			        return false;
			    }
			}
			
			class 蓝砖块 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "开关砖",
			            名称: "蓝砖块",
			            图标: 图标映射.蓝砖块,
			            品质: 1,
			            颜色索引: 1,
			            能否拾起: false,
			            是否正常物品: false,
			            ...配置,
			        });
			    }
			
			    get 阻碍怪物() {
			        return 红蓝开关状态 === '蓝';
			    }
			    
			    get 是否为隐藏物品() {
			        return 红蓝开关状态 !== '蓝';
			    }
			    
			    set 阻碍怪物(a) {}
			    set 是否为隐藏物品(a){}
			
			    当被收集(进入者) {
			        return false;
			    }
			}
			class 绿砖块 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			类型: "开关砖",
			名称: "绿砖块",
			图标: 图标映射.绿砖块,
			品质: 1,
			颜色索引: 0,
			能否拾起: false,
			是否正常物品: false,
			...配置,
			        });
			    }
			
			    get 阻碍怪物() {
			        return 绿紫开关状态 === '绿';
			    }
			    
			    get 是否为隐藏物品() {
			        return 绿紫开关状态 !== '绿';
			    }
			    set 阻碍怪物(a) {}
			    set 是否为隐藏物品(a){}
			
			    当被收集(进入者) {
			        return false;
			    }
			}
			
			class 紫砖块 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			类型: "开关砖",
			名称: "紫砖块",
			图标: 图标映射.紫砖块,
			品质: 1,
			颜色索引: 3,
			能否拾起: false,
			是否正常物品: false,
			...配置,
			        });
			    }
			
			    get 阻碍怪物() {
			        return 绿紫开关状态 === '紫';
			    }
			    
			    get 是否为隐藏物品() {
			        return 绿紫开关状态 !== '紫';
			    }
			    set 阻碍怪物(a) {}
			    set 是否为隐藏物品(a){}
			
			    当被收集(进入者) {
			        return false;
			    }
			}
			class 挑战石碑 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "挑战石碑",
			            图标: 图标映射.挑战石碑,
			            品质: 4,
			            颜色索引: 3,
			            能否拾起: false,
			            是否正常物品: false,
			            阻碍怪物: true,
			            效果描述: "一座古老的石碑，散发着不祥的气息。互动以开始生存挑战。",
			            数据: {
			                已激活: false,
			                当前波数: 0,
			                自定义奖励: [],
			            },
			            ...配置,
			        });
			    }
			
			    尝试互动() {
			        if (生存挑战激活) {
			            显示通知("已有挑战正在进行！", "错误");
			            return false;
			        }
			
			        if (this.自定义数据.get("已激活")) {
			            显示通知("石碑上的能量已经平息。", "信息");
			            return false;
			        }
			
			        显示自定义确认对话框(
			            "你确定要激活石碑，开始无尽的生存挑战吗？挑战将在你倒下时结束。",
			            () => this.开始生存挑战()
			        );
			
			        return true;
			    }
			
			    开始生存挑战() {
			        if (生存挑战激活) return; 
			
			        const 当前房间ID = 房间地图[this.y]?.[this.x];
			        if (当前房间ID === -1 || 当前房间ID === undefined) {
			            显示通知("石碑未在有效房间内，无法开始挑战。", "错误");
			            return;
			        }
			        const 房间实例 = 房间列表.find(t=>t.id==当前房间ID);
			
			        生存挑战激活 = true;
			        生存挑战备份单元格 = [];
			        this.自定义数据.set("已激活", true);
			        this.自定义数据.set("当前波数", 0);
			        房间实例.isSurvivalChallenge = true; 
			        房间实例.survivalWave = 0; 
			
			        const 挑战半径 = 25;
			        const 中心X = this.x;
			        const 中心Y = this.y;
			
			        for (let y = 中心Y - 挑战半径; y <= 中心Y + 挑战半径; y++) {
			            for (let x = 中心X - 挑战半径; x <= 中心X + 挑战半径; x++) {
			                if (x < 0 || x >= 地牢大小 || y < 0 || y >= 地牢大小) continue;
			                
			                const 距离 = Math.sqrt(Math.pow(x - 中心X, 2) + Math.pow(y - 中心Y, 2));
			
			                if (Math.abs(距离 - 挑战半径) < 1) { 
			                    const 原始单元格 = 地牢[y][x];
			                    生存挑战备份单元格.push({
			                        x: x,
			                        y: y,
			                        类型: 原始单元格.类型,
			                        背景类型: 原始单元格.背景类型,
			                        墙壁: { ...原始单元格.墙壁 },
			                        关联物品: 原始单元格.关联物品,
			                        关联怪物: 原始单元格.关联怪物,
			                        颜色索引: 原始单元格.颜色索引,
			                        标识: 原始单元格.标识,
			                    });
			
			                    原始单元格.类型 = 单元格类型.墙壁;
			                    原始单元格.背景类型 = 单元格类型.墙壁;
			                    原始单元格.关联物品 = null;
			                    原始单元格.关联怪物 = null;
			                }
			            }
			        }
			
			        生成墙壁();
			        绘制();
			        
			        显示通知("挑战结界已升起！", "警告", true);
			        this.刷新生存挑战下一波(房间实例);
			    }
			    
			    刷新生存挑战下一波(房间实例) {
			        if (!this.自定义数据.get("已激活")) return;
			
			        this.自定义数据.set("当前波数", this.自定义数据.get("当前波数") + 1);
			        房间实例.survivalWave = this.自定义数据.get("当前波数");
			
			        const 波数 = this.自定义数据.get("当前波数");
			        显示通知(`第 ${波数} 波开始！`, "警告");
			        
			        const 怪物数量 = Math.min(8, 1 + Math.floor(波数 / 2));
			        const 强化概率 = Math.min(0.8, 0.1 + 波数 * 0.05);

			        const 挑战怪物池 = [];
			        const 怪物层级 = 当前层数 === -1 ? 999 : 当前层数;
			        for (let i = 0; i <= 怪物层级; i++) {
			            if (怪物引入计划.has(i)) {
			                怪物引入计划.get(i).forEach(怪物定义 => {
			                    if (!挑战怪物池.some(m => m.类.name === 怪物定义.类.name)) {
			                        挑战怪物池.push(怪物定义);
			                    }
			                });
			            }
			        }
			        const 候选怪物 = 挑战怪物池.filter(m => m.类.name !== '蜈蚣怪物' && m.类.name !== '巨人怪物');
			
			        if(候选怪物.length === 0) return;
			
			        for(let i=0; i<怪物数量; i++) {
			            const 选中配置 = 候选怪物[Math.floor(prng() * 候选怪物.length)];
			            const 新怪物 = new 选中配置.类({强化: prng() < 强化概率, 状态: 怪物状态.活跃});
			            放置怪物到房间(新怪物, 房间实例);
			        }
			    }
			
			    发放奖励(波数) {
			        const 房间实例 = 房间列表.find(t=>t.id==房间地图[this.y][this.x]);
			        if (!房间实例) return;
			    
			        const 自定义奖励 = this.自定义数据.get('自定义奖励');
			        if (自定义奖励 && 自定义奖励.length > 0) {
			            自定义奖励.forEach(奖励配置 => {
			                const 奖励类 = window[奖励配置.类名];
			                if (奖励类) {
			                    const 新物品 = new 奖励类(奖励配置.配置 || {});
			                    放置物品到房间(新物品, 房间实例, 单元格类型.物品, false, true);
			                }
			            });
			            显示通知(`挑战结束！你坚持了 ${波数} 波，获得了预设的奖励！`, "成功");
			        } else {
			            const 奖励等级 = Math.floor(波数 / 5);
			            const 奖励数量 = 1 + 奖励等级;
			    
			            for (let i = 0; i < 奖励数量; i++) {
			                const 品质 = Math.min(5, 2 + 奖励等级);
			                const 可用物品 = Object.values(物品池).flat().filter(item => item.品质 >= 品质-1 && item.品质 <= 品质 && new item.类({}).是否正常物品);
			                if (可用物品.length > 0) {
			                        const 选中配置 = 可用物品[Math.floor(prng() * 可用物品.length)];
			                        const 新物品 = new 选中配置.类({强化: true, 已解锁: true});
			                        放置物品到房间(新物品, 房间实例, 单元格类型.物品, false, true);
			                }
			            }
			            显示通知(`挑战结束！你坚持了 ${波数} 波，获得了随机奖励！`, "成功");
			        }
			    }
			}
			class 剧毒匕首 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "剧毒匕首",
			            图标: 图标映射.剧毒匕首,
			            品质: 1,
			            基础攻击力: 3,
			            冷却回合: 2,
			            攻击范围: 1,
			            耐久: 配置?.耐久 || 90,
			            强化: 配置?.强化 || false,
			            效果描述: "攻击附加可叠加的中毒效果，持续造成伤害。",
			            攻击目标数: 1,
			            不可破坏: 配置?.不可破坏 || false,
			            附魔: 配置?.数据?.附魔 || [],
			            数据: {
			                中毒强度: 2 + (配置?.强化 ? 1 : 0),
			                中毒持续时间: 5,
			                ...配置.数据,
			            },
			        });
			    }
			
			    使用(目标怪物列表,目标路径,使用者=玩家) {
			        if (
			            this.堆叠数量 <= 0 ||
			            this.自定义数据.get("冷却剩余") > 0 ||
			            !(目标怪物列表?.length>0)
			        )
			            return 0;
			
			        const 目标怪物 = 目标怪物列表[0];
			        if (!目标怪物 || 目标怪物.当前生命值 <= 0) return 0;
			
			        let 总有效伤害 = 0;
			        const 原始血量 = 目标怪物.当前生命值;
			        目标怪物.受伤(this.攻击力, "玩家");
			        const 实际伤害 = 原始血量 - 目标怪物.当前生命值;
			        if (实际伤害 > 0) 总有效伤害 += 实际伤害;
			
			        if (目标怪物.当前生命值 > 0) {
			            new 状态效果(
			                "中毒",
			                效果颜色编号映射[效果名称编号映射.中毒],
			                "☠️",
			                this.自定义数据.get("中毒持续时间"),
			                null,
			                null,
			                目标怪物,
			                this.自定义数据.get("中毒强度")
			            );
			            添加日志(`${目标怪物.类型} 中毒了！`, "警告");
			        }
			
			        const 攻击路径 = 广度优先搜索路径(
			            使用者.x,
			            使用者.y,
			            目标怪物.x,
			            目标怪物.y,
			            this.最终攻击范围,
			            true
			        );
			        if (攻击路径 && 攻击路径.length > 1) {
			            计划显示格子特效(攻击路径.slice(1), "008000");
			        }
			
			        this.自定义数据.set(
			            "耐久",
			            this.自定义数据.get("耐久") - this.耐久消耗
			        );
			        if (this.自定义数据.get("耐久") <= 0) {
			            处理销毁物品(this.唯一标识, true);
			            显示通知(`${this.名称} 已损坏！`, "警告");
			        }
			        this.自定义数据.set(
			            "冷却剩余",
			            this.最终冷却回合
			        );
			
			        let 消息 = `${this.名称} 造成 ${总有效伤害.toFixed(
			            1
			        )} 点伤害`;
			        if (
			            目标怪物.当前生命值 > 0 &&
			            怪物状态表.get(目标怪物)?.类型 === "中毒"
			        ) {
			            消息 += ` 并附加了中毒效果！`;
			        } else {
			            消息 += `！`;
			        }
			        显示通知(消息, "成功");
			
			        if (总有效伤害 > 0) {
			            this.触发通用附魔([目标怪物]);
			        }
			
			        更新装备显示();
			        return 总有效伤害;
			    }
			
			    触发通用附魔(目标怪物列表) {
			        if (
			            this.自定义数据
			                .get("附魔")
			                ?.find((item) => item.种类 === "火焰附魔")?.等级
			        ) {
			            const 火焰等级 = this.自定义数据
			                .get("附魔")
			                .find((item) => item.种类 === "火焰附魔").等级;
			            目标怪物列表.forEach((怪物) => {
			                if (怪物.当前生命值 > 0) {
			                    new 状态效果(
			                        "火焰",
			                        "#CC5500",
			                        "火",
			                        火焰等级,
			                        null,
			                        null,
			                        怪物
			                    );
			                }
			            });
			        }
			        const 连锁附魔 = this.自定义数据
			            .get("附魔")
			            ?.find((item) => item.种类 === "连锁附魔");
			        if (连锁附魔) {
			            const 连锁距离 = 连锁附魔.等级;
			            目标怪物列表.forEach((初始目标) => {
			                if (初始目标.当前生命值 > 0) {
			                    this.触发连锁(初始目标, 连锁距离, 目标怪物列表);
			                }
			            });
			        }
			    }
			
			    获取提示() {
			        let lines = super.获取提示().split("\n");
			        const specificEffectLines = [
			            `毒性：${this.自定义数据.get("中毒强度")}点/回合`,
			            `持续：${this.自定义数据.get("中毒持续时间")}回合`,
			        ];
			        const effectDescIndex = lines.findIndex((line) =>
			            line.startsWith("效果描述：")
			        );
			        let insertAtIndex =
			            effectDescIndex !== -1
			                ? effectDescIndex + 1
			                : lines.findIndex((line) =>
			                      line.startsWith("--- 强化效果 ---")
			                  );
			        if (insertAtIndex === -1) insertAtIndex = lines.length;
			
			        lines.splice(insertAtIndex, 0, ...specificEffectLines);
			        return lines.filter(Boolean).join("\n");
			    }
			}
			
			class 荆棘鞭 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "荆棘鞭",
			            图标: 图标映射.荆棘鞭,
			            品质: 1,
			            基础攻击力: 2,
			            冷却回合: 3,
			            攻击范围: 2,
			            耐久: 配置?.耐久 || 70,
			            强化: 配置?.强化 || false,
			            效果描述:
			                "甩出长鞭，将近处的单个敌人直线甩飞并造成少量伤害。",
			            攻击目标数: 1,
			            不可破坏: 配置?.不可破坏 || false,
			            附魔: 配置?.数据?.附魔 || [],
