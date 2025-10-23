			        物品列表.className = "宠物装备选择列表";
			        const 可用装备 = [...玩家背包.values()].filter(
			            (物品) => {
			                 if(物品类型过滤 === '饰品'){
			                    return 物品.类型 === '饰品' && !物品.是否隐藏;
			                }
			                return (槽位类型 === "武器" && 物品 instanceof 武器类) ||
			                (槽位类型 === "防具" && 物品 instanceof 防御装备类)
			            }
			        );
			        if (可用装备.length === 0) {
			            const 提示 = document.createElement("div");
			            提示.className = "无装备提示";
			            提示.textContent = `无可用${物品类型过滤 || 槽位类型}装备`;
			            物品列表.appendChild(提示);
			        } else {
			            可用装备.forEach((物品) => {
			                const 物品元素 = this.创建可选装备元素(
			                    物品,
			                    槽位类型
			                );
			                物品列表.appendChild(物品元素);
			            });
			        }
			        弹窗.appendChild(物品列表);
			        const 关闭按钮 = document.createElement("button");
			        关闭按钮.className = "关闭按钮";
			        关闭按钮.textContent = "×";
			        关闭按钮.onclick = () => {
			            弹窗.style.transform =
			                "translate(-50%, -50%) scale(0.9)";
			            弹窗.style.opacity = 0;
			            setTimeout(() => {
			                遮罩.remove();
			            }, 300);
			        };
			        弹窗.appendChild(关闭按钮);
			        遮罩.appendChild(弹窗);
			        document.querySelector(".宠物管理窗口").appendChild(遮罩);
			    }
			    创建可选装备元素(物品, 槽位类型) {
			        const 元素 = document.createElement("div");
			        元素.className = "宠物可选装备";
			        const 图标 = document.createElement("span");
			        图标.className = "宠物可选装备图标";
			        图标.textContent = 物品.图标;
			        图标.style.color = 物品.颜色表[物品.颜色索引];
			        const 名称 = document.createElement("span");
			        名称.className = "宠物可选装备名称";
			        名称.textContent = 物品.获取名称();
			        const 选择按钮 = document.createElement("button");
			        选择按钮.className = "宠物装备选择确认按钮";
			        选择按钮.textContent = "选择";
			        选择按钮.addEventListener("click", () => {
			            this.装备物品(物品, 槽位类型);
			            let 弹窗 = document.querySelector(".宠物装备选择弹窗");
			            弹窗.style.transform =
			                "translate(-50%, -50%) scale(0.9)";
			            弹窗.style.opacity = 0;
			            setTimeout(() => {
			                document
			                    .querySelector(".宠物装备选择遮罩")
			                    .remove();
			            }, 300);
			            更新装备显示();
			            更新背包显示();
			        });
			        元素.appendChild(图标);
			        元素.appendChild(名称);
			        元素.appendChild(选择按钮);
			        return 元素;
			    }
			    创建技能面板() {
			        const 面板 = document.createElement("div");
			        面板.className = "宠物技能面板";
			        面板.innerHTML = "<h4>技能</h4>";
			        const 技能列表 = this.自定义数据.get("技能");
			        if (技能列表 && 技能列表.length > 0) {
			            技能列表.forEach((技能) => {
			                const 技能元素 = document.createElement("div");
			                技能元素.className = "宠物技能";
			                技能元素.innerHTML = `
			        <p><strong>${技能.名称}</strong> (等级 ${技能.等级})</p>
			        <p>${技能.描述}</p>
			    `;
			                面板.appendChild(技能元素);
			            });
			        } else {
			            面板.innerHTML += "<p>暂无技能</p>";
			        }
			        return 面板;
			    }
			    获取提示() {
			        const data = this.自定义数据;
			        const 装备 = data.get("装备");
			        const 武器 = 装备?.武器 ? 装备.武器.获取名称() : "无";
			        const 防具 = 装备?.防具 ? 装备.防具.获取名称() : "无";
			
			        const 饰品文本列表 = [];
			        for(let i=1; i <= (data.get('饰品栏数量') || 0); i++) {
			            const 饰品 = 装备?.[`饰品${i}`];
			            if(饰品) 饰品文本列表.push(饰品.获取名称());
			        }
			        const 饰品文本 = 饰品文本列表.length > 0 ? 饰品文本列表.join(', ') : "无";
			
			        return [
			            `${this.获取名称()} (等级 ${data.get("等级")})`,
			            `类型：${this.类型}`,
			            `品质：${"★".repeat(this.品质)}`,
			            `生命值: ${data.get("当前生命值")} / ${data.get(
			                "最大生命值"
			            )}`,
			            `武器: ${武器}`,
			            `防具: ${防具}`,
			            `饰品: ${饰品文本}`,
			            `${this.效果描述}`,
			        ].join("\n");
			    }
			}
			class 熊猫 extends 宠物 {
			    constructor(配置 = {}) {
			        super({
			            名称: "熊猫",
			            图标: 图标映射.熊猫,
			            品质: 3,
			            颜色索引: 2,
			            饰品栏数量: 2,
			            效果描述:
			                "来自神秘竹林的守护者，擅长竹叶飞刀和强力防御。",
			            基础攻击力: 1,
			            基础防御力: 2,
			            最大生命值: 40,
			            强化: 配置.强化 || false,
			            技能: [
			                {
			                    名称: "竹叶飞刀",
			                    等级: 1,
			                    描述: "投掷锋利的竹叶，对单个敌人造成伤害。伤害随技能等级提升。",
			                    时机: "攻击",
			                    索引: 0,
			                },
			                {
			                    名称: "金钟罩",
			                    等级: 1,
			                    描述: "受到攻击时有几率触发金钟罩，使攻击来源攻击力下降。抵挡比例随技能等级提升。",
			                    时机: "被攻击",
			                    索引: 1,
			                },
			            ],
			            ...配置,
			        });
			        this.技能效果 = [
			            function (宠物, 目标怪物列表) {
			                if (!目标怪物列表 || 目标怪物列表.length === 0)
			                    return;
			                const 技能等级 =
			                    宠物.自定义数据.get("技能")[0].等级; // 获取第一个技能的等级
			                const 基础伤害 = 1;
			                const 伤害 = 基础伤害 + 技能等级 * 3;
			
			                // 随机选择一个目标
			                const 目标 =
			                    目标怪物列表[
			                        Math.floor(
			                            prng() * 目标怪物列表.length
			                        )
			                    ];
			                目标.受伤(伤害, 宠物);
			                添加日志(
			                    `${宠物.名称}使用了竹叶飞刀！造成了 ${伤害} 点伤害`,
			                    "成功"
			                );
			            },
			            function (宠物, 来源) {
			                const 技能等级 =
			                    宠物.自定义数据.get("技能")[1].等级; // 获取第二个技能的等级
			                const 基础格挡率 = 0.15;
			                const 格挡率 = Math.min(
			                    0.85,
			                    基础格挡率 + (技能等级 - 1) * 0.05
			                );
			
			                if (
			                    prng() < 格挡率 &&
			                    来源 instanceof 怪物
			                ) {
			                    // 触发格挡
			                    const 基础减伤 = 0.8;
			                    const 减伤比例 = Math.min(
			                        0,
			                        基础减伤 - 技能等级 * 0.05
			                    );
			                    来源.基础攻击力 = Math.floor(
			                        来源.基础攻击力 * 减伤比例
			                    ); //修改攻击者的基础攻击力
			                    添加日志(`${宠物.名称}触发了金钟罩！`, "成功");
			                }
			            },
			        ];
			    }
			
			    升级() {
			        const 升级成功 = super.升级();
			        if (升级成功) {
			            const 技能列表 = this.自定义数据.get("技能");
			            if (技能列表) {
			                // 随机升级一个技能
			                const 随机技能索引 = Math.floor(
			                    prng() * 技能列表.length
			                );
			                技能列表[随机技能索引].等级 += 1;
			                显示通知(
			                    `${this.名称}的技能 ${技能列表[随机技能索引].名称} 升级了!`,
			                    "成功"
			                );
			                window.宠物管理窗口.querySelector(
			                    ".宠物技能面板"
			                ).innerHTML = "";
			                window.宠物管理窗口
			                    .querySelector(".宠物技能面板")
			                    .appendChild(this.创建技能面板());
			            }
			        }
			        return 升级成功;
			    }
			
			    当玩家被攻击(原始攻击力, 来源) {
			        if (this.自定义数据.get("休眠中")) return 原始攻击力;
			
			        let 最终攻击力 = 原始攻击力;
			
			        // 宠物装备的防具效果
			        const 防具 = this.自定义数据.get("装备")?.防具;
			        if (防具) {
			            最终攻击力 = 防具.当被攻击(最终攻击力, 来源);
			        }
			
			        最终攻击力 = Math.max(
			            0,
			            最终攻击力 - this.自定义数据.get("基础防御力")
			        );
			        if (最终攻击力 <= 0)
			            最终攻击力 = Math.round(prng() * 100) / 100;
			        const 承担比例 = 0.3;
			        const 宠物承担伤害 = Math.floor(最终攻击力 * 承担比例);
			        this.受伤(宠物承担伤害);
			        最终攻击力 -= 宠物承担伤害;
			
			        this.触发技能("被攻击", 来源);
			        return 最终攻击力;
			    }
			}
class 火蜥蜴 extends 宠物 {
    constructor(配置 = {}) {
        super({
            名称: "火蜥蜴",
            图标: "🦎",
            品质: 4,
            颜色索引: 4,
            饰品栏数量: 2,
            效果描述: "喷射旋转的火焰并能震开敌人。",
            基础攻击力: 6,
            基础防御力: 3,
            最大生命值: 40,
            技能: [
                {
                    名称: "旋转火棍",
                    等级: 1,
                    描述: "向最近的敌人发射一道旋转的火焰路径，点燃路径上的所有敌人。",
                    时机: "攻击",
                    索引: 0,
                },
                {
                    名称: "烈焰震击",
                    等级: 1,
                    描述: "释放火焰冲击波，将所有可见的敌人击退一格。",
                    时机: "被攻击",
                    索引: 1,
                },
            ],
            ...配置,
        });

        this.技能效果 = [
            (宠物, 目标怪物列表) => {
                const 技能 = 宠物.自定义数据.get("技能")[0];
                const 目标 = 宠物.寻找最近怪物目标();
                if (!目标) return;

                const 初始路径 = 获取直线路径(宠物.x, 宠物.y, 目标.x, 目标.y);
                if (!初始路径 || 初始路径.length < 2) return;

                const 火棍长度 = 3 + 技能.等级;
                const 旋转帧数 = 8;
                const 每帧延迟 = 50;
                const 旋转总角度 = 360;
                const 已击中怪物 = new Set();
                
                const 初始向量X = 初始路径[1].x - 宠物.x;
                const 初始向量Y = 初始路径[1].y - 宠物.y;
                const 初始角度 = Math.atan2(初始向量Y, 初始向量X);

                for (let i = 0; i < 旋转帧数; i++) {
                    setTimeout(() => {
                        const 当前旋转角度 = 初始角度 + (i / (旋转帧数 - 1)) * (旋转总角度 * Math.PI / 180);
                        const 当前帧格子 = new Set();

                        for (let j = 1; j <= 火棍长度; j++) {
                            const x = Math.round(宠物.x + Math.cos(当前旋转角度) * j);
                            const y = Math.round(宠物.y + Math.sin(当前旋转角度) * j);

                            if (x < 0 || x >= 地牢大小 || y < 0 || y >= 地牢大小) break;
                            当前帧格子.add(`${x},${y}`);
                        }

                        const 格子列表 = Array.from(当前帧格子).map(s => {
                            const [x, y] = s.split(',').map(Number);
                            return { x, y };
                        });

                        计划显示格子特效(格子列表, "FFA500", 5);

                        格子列表.forEach(格 => {
                            const 单元格 = 地牢[格.y]?.[格.x];
                            const 怪物 = 单元格?.关联怪物;
                            if (怪物 && !已击中怪物.has(怪物)) {
                                new 状态效果("火焰", 效果颜色编号映射[效果名称编号映射.火焰], "火", 3 + 技能.等级, null, null, 怪物, 3);
                                已击中怪物.add(怪物);
                            }
                        });
                    }, i * 每帧延迟);
                }
            },
            (宠物, 来源) => {
                const 技能 = 宠物.自定义数据.get("技能")[1];
                if (prng() > 0.3 + 技能.等级 * 0.1) return;
                
                添加日志(`${宠物.名称} 发动了烈焰震击！`, "成功");
                计划显示格子特效([{x: 宠物.x, y: 宠物.y}], "FF4500", 0);

                所有怪物.forEach(怪物 => {
                    if (怪物.状态 !== 怪物状态.活跃 || !检查视线(宠物.x, 宠物.y, 怪物.x, 怪物.y, 15)) return;

                    const dx = 怪物.x - 宠物.x;
                    const dy = 怪物.y - 宠物.y;
                    let 击退DX = 0, 击退DY = 0;

                    if (Math.abs(dx) > Math.abs(dy)) 击退DX = Math.sign(dx);
                    else 击退DY = Math.sign(dy);

                    if (击退DX === 0 && 击退DY === 0) {
                        const 随机方向 = [[1,0], [-1,0], [0,1], [0,-1]][Math.floor(prng() * 4)];
                        击退DX = 随机方向[0];
                        击退DY = 随机方向[1];
                    }
                    
                    const { x: 最终X, y: 最终Y } = 怪物.计算最大甩飞位置(怪物.x, 怪物.y, 击退DX, 击退DY, 1 + 技能.等级);
                    if (最终X !== 怪物.x || 最终Y !== 怪物.y) {
                        const oldX = 怪物.x, oldY = 怪物.y;
                        怪物.恢复背景类型();
                        怪物.x = 最终X;
                        怪物.y = 最终Y;
                        怪物.保存新位置类型(最终X, 最终Y);
                        地牢[最终Y][最终X].类型 = 单元格类型.怪物;
                        地牢[最终Y][最终X].关联怪物 = 怪物;
                        怪物.处理地形效果();
                        怪物动画状态.set(怪物, {
                            旧逻辑X: oldX, 旧逻辑Y: oldY, 目标逻辑X: 最终X, 目标逻辑Y: 最终Y,
                            视觉X: oldX, 视觉Y: oldY, 动画开始时间: Date.now(), 正在动画: true,
                        });
                    }
                });
            },
        ];
    }
    			    升级() {
			        if (super.升级()) {
			            const 技能列表 = this.自定义数据.get("技能");
			            const 随机技能索引 = Math.floor(
			                prng() * 技能列表.length
			            );
			            技能列表[随机技能索引].等级 += 1;
			            显示通知(
			                `${this.名称}的技能 ${技能列表[随机技能索引].名称} 升级了!`,
			                "成功"
			            );
			        }
			    }
}   
class 定位器地图 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            名称: "定位器地图",
			            图标: 图标映射.定位器地图,
			            品质: 1,
			            颜色索引: 0,
			            效果描述: "装备后，可为你寻找下楼楼梯的位置。",
			            ...配置,
			        });
			    }
			        使用() {
			        return false;
			        }
			}
class 烟雾弹 extends 物品 {
    constructor(配置 = {}) {
        super({
            类型: "消耗品",
            名称: "烟雾弹",
            图标: 图标映射.烟雾弹,
            品质: 3,
            颜色索引: 2,
            堆叠数量: 配置.数量 || 1,
            最大堆叠数量: 16,
            效果描述: "制造一片烟雾，藏身其中可以免疫伤害且不会被怪物发现。",
            强化: 配置.强化 || false,
            ...配置,
            数据: {
                扩散范围: 配置.扩散范围??25,
                持续时间: 配置.持续时间??(10 + (配置.强化 ? 5 : 0)),
            },
            
        });
    }

    使用() {
        if (this.堆叠数量 <= 0) return false;
        
        
        const 范围 = this.自定义数据.get("扩散范围");
        const 持续 = this.自定义数据.get("持续时间");

        const 队列 = [{ x: 玩家.x, y: 玩家.y, 距离: 0 }];
        const 已访问 = new Set([`${玩家.x},${玩家.y}`]);
        let 放置计数 = 0;

        const 放置烟雾 = (x, y) => {
            if (位置是否可用(x, y, false)) {
                const 烟雾实例 = new 烟雾({
                    倒计时: 持续,
                    爆炸时间: 持续,
                });
                放置物品到单元格(烟雾实例, x, y);
                return true;
            }
            return false;
        };

        if (放置烟雾(玩家.x, 玩家.y)) 放置计数++;
        
        while (队列.length > 0 && 放置计数 < 范围) {
            const { x, y, 距离 } = 队列.shift();
            
            const 方向 = [[0, -1], [0, 1], [-1, 0], [1, 0]];
            方向.sort(() => prng() - 0.5);

            for (const [dx, dy] of 方向) {
                const 新X = x + dx;
                const 新Y = y + dy;
                const 键 = `${新X},${新Y}`;
                if (新X >= 0 && 新X < 地牢大小 && 新Y >= 0 && 新Y < 地牢大小 && !已访问.has(键)) {
                    已访问.add(键);
                    if (放置烟雾(新X, 新Y)) {
                        放置计数++;
                        队列.push({ x: 新X, y: 新Y, 距离: 距离 + 1 });
                        if (放置计数 >= 范围) break;
                    }
                }
            }
             if (放置计数 >= 范围) break;
        }

        显示通知("烟雾弥漫开来！", "成功");
        this.堆叠数量--;
        if (this.堆叠数量 <= 0) {
            处理销毁物品(this.唯一标识, true);
        }
        return true;
    }
}

class 烟雾 extends 物品 {
    constructor(配置 = {}) {
        super({
            类型: "地形",
            名称: "烟雾",
            图标: 图标映射.烟雾,
            品质: 1,
            颜色索引: 5,
            能否拾起: false,
            是否正常物品: false,
            阻碍怪物: false,
            效果描述: "浓厚的烟雾，可以隐藏身形。",
            ...配置,
            数据: {
                倒计时: 配置.倒计时 || 10,
                爆炸时间: 配置.倒计时 || 10,
            },
            
        });
        if (!所有计时器.some(t => t.唯一标识 === this.唯一标识)) {
            所有计时器.push(this);
        }
    }

    更新倒计时() {
        const 剩余回合 = this.自定义数据.get("倒计时") - 1;
        this.自定义数据.set("倒计时", 剩余回合);
        if (剩余回合 <= 0) {
            this.移除自身();
        }
    }

    移除自身() {
        if (this.x !== null && this.y !== null && 地牢[this.y]?.[this.x]?.关联物品 === this) {
            地牢[this.y][this.x].关联物品 = null;
            if (地牢[this.y][this.x].类型 === 单元格类型.物品) {
                地牢[this.y][this.x].类型 = null;
            }
        }
        所有计时器 = 所有计时器.filter(item => item !== this);
    }
}
			class 水母 extends 宠物 {
			    constructor(配置 = {}) {
			        super({
			            名称: "水母",
			            图标: 图标映射.水母,
			            品质: 4,
			            颜色索引: 3,
			            饰品栏数量: 3,
			            效果描述:
			                "来自虚空的神秘生物，可以扭曲空间，并拥有强大的精神控制力。",
			            基础攻击力: 2,
			            基础防御力: 2,
			            最大生命值: 30,
			            强化: 配置.强化 || false,
			            技能: [
			                {
			                    名称: "空间扭曲",
			                    等级: 1,
			                    描述: "被攻击时有几率扭曲空间，使攻击者传送回其原始位置。",
			                    时机: "被攻击",
			                    索引: 0,
			                },
			                {
			                    名称: "精神控制",
			                    等级: 1,
			                    描述: "攻击时有几率魅惑一个敌人，使其在短时间内为你作战。",
			                    时机: "攻击",
			                    索引: 1,
			                },
			            ],
			            ...配置,
			        });
			        this.技能效果 = [
			            function (宠物, 来源) {
			                if (!(来源 instanceof 怪物)) return;
			                const 技能等级 =
			                    宠物.自定义数据.get("技能")[0].等级;
			                const 触发几率 = Math.min(
			                    0.85,
			                    0.1 + (技能等级 - 1) * 0.05
			                ); // 初始10%几率, 每级增加5%
			
			                if (prng() < 触发几率) {
			                    // 记录原始位置
			                    if (!来源.原始位置) {
			                        来源.原始位置 = { x: 来源?.x, y: 来源?.y };
			                        return;
			                    }
			                    if (
			                        来源.原始位置 &&
			                        来源.原始位置.x >= 0 &&
			                        来源.原始位置.x < 地牢大小 &&
			                        来源.原始位置.y >= 0 &&
			                        来源.原始位置.y < 地牢大小
			                    ) {
			                        来源.恢复背景类型();
			                        来源.x = 来源.原始位置.x;
			                        来源.y = 来源.原始位置.y;
			                        地牢[来源.y][来源.x].类型 = 单元格类型.怪物;
			                        地牢[来源.y][来源.x].关联怪物 = 来源;
			                        显示通知(
			                            `${宠物.名称}发动了空间扭曲！`,
			                            "成功"
			                        );
			                        绘制();
			                    }
			                }
			            },
			            function (宠物, 目标怪物列表) {
			                if (!目标怪物列表 || 目标怪物列表.length === 0)
			                    return;
			                const 技能等级 =
			                    宠物.自定义数据.get("技能")[1].等级;
			                let 触发几率 = Math.min(
			                    0.85,
			                    0.1 + (技能等级 - 1) * 0.05
			                );
			                //触发几率 = 1;
			                if (prng() < 触发几率) {
			                    const 目标 =
			                        目标怪物列表[
			                            Math.floor(
			                                prng() * 目标怪物列表.length
			                            )
			                        ];
			
			                    if (
			                        怪物状态表.get(目标)?.类型 !== "魅惑" &&
			                        !(目标 instanceof 炸弹怪物) &&
			                        !(目标 instanceof 大魔法师)
			                    ) {
			                        const 持续回合 = 2 + 技能等级; // 基础2回合，每级+1回合
			                        const 控制状态 = new 状态效果(
			                            "魅惑",
			                            "#8e44ad",
			                            "魅",
			                            持续回合,
			                            null,
			                            null,
			                            目标
			                        );
			
			                        添加日志(
			                            `${宠物.名称}控制了${目标.类型}!`,
			                            "成功"
			                        );
			                    }
			                }
			            },
			        ];
			    }
			    升级() {
			        const 升级成功 = super.升级();
			        if (升级成功) {
			            const 技能列表 = this.自定义数据.get("技能");
			            if (技能列表) {
			                // 随机升级
			                const 随机技能索引 = Math.floor(
			                    prng() * 技能列表.length
			                );
			                技能列表[随机技能索引].等级 += 1;
			                显示通知(
			                    `${this.名称}的技能 ${技能列表[随机技能索引].名称} 升级了!`,
			                    "成功"
			                );
			                window.宠物管理窗口.querySelector(
			                    ".宠物技能面板"
			                ).innerHTML = "";
			                window.宠物管理窗口
			                    .querySelector(".宠物技能面板")
			                    .appendChild(this.创建技能面板());
			            }
			        }
			        return 升级成功;
			    }
			}
			class 魔法水晶 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: `${配置.水晶ID}水晶`,
			            图标: 图标映射.水晶,
			            品质: 5,
			            颜色索引: 配置.颜色索引 || 0,
			            能否拾起: false,
			            是否正常物品: false,
			            阻碍怪物: true,
			            效果描述:
			                "一个蕴含着强大魔法能量的水晶，似乎是某种封印的核心。",
			            数据: {
			                水晶ID: 配置.水晶ID || "未知",
			                已摧毁: false,
			                管辖房间: 配置.管辖房间 || [],
			            },
			            ...配置,
			        });
			    }
			
			    尝试互动() {
			        if (this.自定义数据.get("已摧毁")) return false;
			
			        const 管辖房间名称列表 = this.自定义数据.get("管辖房间");
			        if (管辖房间名称列表 && 管辖房间名称列表.length > 0) {
			            for (const 房间名称 of 管辖房间名称列表) {
			                const 房间 = 房间列表.find(
			                    (r) => r.名称 === 房间名称
			                );
			                if (房间) {
			                    for (const 怪物 of 所有怪物) {
			                        if (
			                            怪物.房间ID === 房间.id &&
			                            怪物.当前生命值 > 0
			                        ) {
			                            显示通知(
			                                `水晶受到保护，必须先清除 ${房间名称} 内的所有怪物！`,
			                                "警告"
			                            );
			                            return false;
			                        }
			                    }
			                }
			            }
			        }
			
			        this.自定义数据.set("已摧毁", true);
			        显示通知(
			            `${this.名称}被摧毁了，发出了一声清脆的碎裂声！`,
			            "成功"
			        );
			
			        if (
			            this.x !== null &&
			            this.y !== null &&
			            地牢[this.y]?.[this.x]?.关联物品 === this
			        ) {
			            地牢[this.y][this.x].关联物品 = null;
			            if (地牢[this.y][this.x].类型 === 单元格类型.物品) {
			                地牢[this.y][this.x].类型 = null;
			            }
			        }
			        绘制();
			        检查所有水晶状态();
			        return true;
			    }
			
			    get 颜色表() {
			        return 颜色表;
			    }
			}
			class 旗帜 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "胜利旗帜",
			            图标: 图标映射.旗帜,
			            品质: 5,
			            颜色索引: 2,
			            能否拾起: false,
			            是否正常物品: false,
			            阻碍怪物: false,
			            效果描述: "触碰它，宣告你的胜利！",
			            ...配置,
			        });
			    }
			
			    尝试互动() {
			        if (自定义全局设置.胜利条件.清除所有怪物) {
			            const 待清除怪物列表 = 所有怪物.filter(monster => {
			                // 排除远射陷阱
			                if (monster instanceof 远射陷阱) {
			                    return false;
			                }
			                // 排除血量异常或已经死亡的怪物
			                if (monster.当前生命值 <= 0) {
			                    return false;
			                }
			                // 如果未来有其他非战斗“怪物”单位，可在此处继续添加排除逻辑
			                
			                // 默认情况下，所有其他怪物都需要被清除
			                return true;
			            });
			
			            if (待清除怪物列表.length === 0) {
			                检查胜利条件();
			            } else {
			                显示通知(`还有 ${待清除怪物列表.length} 只怪物没有被清除！`, '警告');
			            }
			        } else {
			            检查胜利条件();
			        }
			        return true;
			    }
			}
			
			class 符文圈 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: `${配置.效果类型}符文圈`,
			            图标: 图标映射.符文圈,
			            品质: 5,
			            颜色索引: 效果名称编号映射[配置.效果类型] || 0,
			            能否拾起: false,
			            是否正常物品: false,
			            阻碍怪物: false,
			
			            效果描述: "周期性激活的魔法符文。",
			            数据: {
			                周期: 配置.周期 || 10,
			                剩余周期:
			                    配置.剩余周期 ??
			                    Math.floor(prng() * (配置.周期 || 10)),
			                持续时间: 配置.持续时间 || 3,
			                效果类型: 配置.效果类型 || "狂暴",
			                强度: 配置.强度 || 2,
			                ...配置.数据,
			            },
			            ...配置,
			        });
			        所有计时器.push(this);
			    }
			
			    更新倒计时() {
			        let 剩余 = this.自定义数据.get("剩余周期") - 1;
			        if (剩余 <= 0) {
			            const 效果列表 = ["狂暴", "神龟", "缓慢", "中毒"];
			            const 当前效果 = this.自定义数据.get("效果类型");
			            const 当前索引 = 效果列表.indexOf(当前效果);
			            const 下一个索引 = (当前索引 + 1) % 效果列表.length;
			            const 新效果类型 = 效果列表[下一个索引];
			
			            this.自定义数据.set("效果类型", 新效果类型);
			            this.名称 = `${新效果类型}符文圈`;
			            this.颜色索引 = 效果名称编号映射[新效果类型] || 0;
			            this.自定义数据.set(
			                "剩余周期",
			                this.自定义数据.get("周期")
			            );
			        } else {
			            this.自定义数据.set("剩余周期", 剩余);
			        }
			
			        this.应用效果();
			    }
			
			    应用效果() {
			        const 效果类型 = this.自定义数据.get("效果类型");
			        const 颜色 = 效果颜色编号映射[this.颜色索引];
			        const 图标 = this.图标;
			        const 持续时间 = this.自定义数据.get("持续时间");
			        const 强度 = this.自定义数据.get("强度");
			
			        if (玩家.x === this.x && 玩家.y === this.y) {
			            new 状态效果(
			                效果类型,
			                颜色,
			                图标,
			                持续时间,
			                null,
			                null,
			                null,
			                强度
			            );
			        }
			        所有怪物.forEach((怪物) => {
			            if (怪物.x === this.x && 怪物.y === this.y) {
			                new 状态效果(
			                    效果类型,
			                    颜色,
			                    图标,
			                    持续时间,
			                    null,
			                    null,
			                    怪物,
			                    强度
			                );
			            }
			        });
			    }
			
			    get 颜色表() {
			        return 效果颜色编号映射;
			    }
			}
			let 游戏开始时间 = null;
			class 奖杯物品 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "胜利奖杯",
			            图标: 图标映射.奖杯,
			            品质: 5,
			            颜色索引: 4, 
			            能否拾起: false,
			            是否正常物品: false,
			            阻碍怪物: true,
			            效果描述: "一座闪耀的奖杯，纪念着你来之不易的胜利。",
			            ...配置,
			        });
			    }
			
			    尝试互动() {
			        显示结算界面();
			        return true;
			    }
			}
			
			let 游戏事件日志 = [];
			function 获取结局评级(统计数据) {
			    let 分数 = 75;
			    let 评语池 = {
			        正面: [],
			        中立: [],
			        负面: []
			    };
			
			    if (统计数据.游戏时长秒 < 12000) { 
			        分数 += 20;
			        评语池.正面.push("风驰电掣");
			    } else if (统计数据.游戏时长秒 > 36000) {
			        分数 -= 10;
			        评语池.负面.push("一次漫长的苦旅");
			    } else {
			        评语池.中立.push("步履不停");
			    }
			    
			    if (统计数据.承受伤害 === 0) {
			        分数 += 30;
			        评语池.正面.push("毫发无伤的幻神");
			    } else if (统计数据.承受伤害 < 600) {
			        分数 += 10;
			        评语池.正面.push("身法灵动");
			    } else if (统计数据.承受伤害 > 2000) {
			        分数 -= 10;
			        评语池.负面.push("伤痕累累");
			    }
			
			    if (统计数据.击杀怪物 > 500) {
			        分数 += 15;
			        评语池.正面.push("地牢灾星");
			    } else if (统计数据.击杀怪物 < 300) {
			        分数 -= 5;
			    } else {
			        评语池.中立.push("清道夫");
			    }
			
			    if (统计数据.获得金币 > 200) {
			        分数 += 10;
			        评语池.正面.push("富甲一方");
			    }
			
			    if (玩家死亡次数 === 0) {
			        分数 += 25;
			        评语池.正面.push("不灭灵魂");
			    } else {
			        分数 -= 玩家死亡次数;
			        评语池.负面.push(`浴火重生x${玩家死亡次数}`);
			    }
			
			    let 最终评语 = "";
			    if (评语池.正面.length >= 2) {
			        最终评语 = `“${评语池.正面[0]}，${评语池.正面[1]}”`;
			    } else if (评语池.正面.length === 1) {
			        最终评语 = 评语池.中立.length > 0 ? `“${评语池.正面[0]}，亦是${评语池.中立[0]}”` : `“${评语池.正面[0]}”`;
			    } else if(评语池.负面.length > 0) {
			        最终评语 = `“${评语池.负面.join('，')}”`;
			    } else {
			        最终评语 = "“一次平凡但完整的冒险”";
			    }
			
			    if (分数 >= 135) return { 评级: 'S+', 标题: '地牢传奇', 颜色类: '评级-S-plus', 结束语: '你的事迹，已成为地牢中永恒的神话。\n'+最终评语 };
			    if (分数 >= 120) return { 评级: 'S', 标题: '地牢征服者', 颜色类: '评级-S', 结束语: '黑暗在你面前退却，你已是此地无可争议的主宰。\n' +最终评语};
			    if (分数 >= 100) return { 评级: 'A', 标题: '英勇探险家', 颜色类: '评级-A', 结束语: '凭借勇气与智慧，你战胜了所有险阻。\n'+最终评语 };
			    if (分数 >= 85) return { 评级: 'B', 标题: '熟练的冒险者', 颜色类: '评级-B', 结束语: '历经磨难，地牢的秘密已向你敞开。' +最终评语};
			    if (分数 >= 70) return { 评级: 'C', 标题: '幸存者', 颜色类: '评级-C', 结束语: '你在深渊的边缘走了一遭，并活了下来。\n'+最终评语 };
			    return { 评级: 'D', 标题: '惨胜', 颜色类: '评级-D', 结束语: '你赢了，但代价是什么呢？\n' +最终评语};
			}
			
			function 生成结算粒子(容器) {
			    if (!容器) return;
			    容器.innerHTML = '';
			    const 粒子数量 = 20;
			    for (let i = 0; i < 粒子数量; i++) {
			        const 粒子 = document.createElement('div');
			        粒子.className = '结算粒子';
			        粒子.style.left = `${prng() * 100}%`;
			        粒子.style.animationDelay = `${prng() * 15}s`;
			        粒子.style.animationDuration = `${5 + prng() * 10}s`;
			        容器.appendChild(粒子);
			    }
			}
			
			            function 显示结算界面() {
			    if (游戏状态 === '图鉴' || document.getElementById('结算界面遮罩').style.display === 'flex') return;
			
			    游戏状态 = "胜利";
			    导出存档();
			
			    const 遮罩 = document.getElementById('结算界面遮罩');
			    const 标题元素 = 遮罩.querySelector('.结算标题');
			    const 评级元素 = document.getElementById('结局评级');
			    const 评语元素 = document.getElementById('结束评语');
			    const 统计容器 = 遮罩.querySelector('.结算统计容器');
			    const 凭证码元素 = document.getElementById('通关凭证码');
			    
			    const 返回按钮 = document.getElementById('结算返回主菜单按钮');
			    const 粒子容器 = document.getElementById('结算粒子容器');
			
			    const 游戏时长秒 = Math.floor((Date.now() - 游戏开始时间) / 1000);
			    const 分钟 = Math.floor(游戏时长秒 / 60);
			    const 秒 = 游戏时长秒 % 60;
			    const 游戏时长文本 = `${分钟}分 ${秒}秒`;
			
			    const 总金币 = [...玩家背包.values()].filter(i => i instanceof 金币).reduce((sum, i) => sum + i.堆叠数量, 0);
			
			    const 统计数据 = {
			        '游戏时长': { 数值: 游戏时长文本, 图标: 图标映射.时间 },
			        '击杀怪物': { 数值: `${已击杀怪物数}`, 图标: 图标映射.死亡图标 },
			        '探索回合': { 数值: `${玩家总移动回合数}`, 图标: 图标映射.脚印 },
			        '获得金币': { 数值: `${总金币}`, 图标: 图标映射.金币 },
			        '承受伤害': { 数值: `${玩家总受到伤害.toFixed(1)}`, 图标:图标映射.修补心 },
			        '最高层数': { 数值: `${当前层数}`, 图标: 图标映射.旗帜 }
			    };
			
			    统计容器.innerHTML = '';
			    for (const [标签, 数据] of Object.entries(统计数据)) {
			        const 条目 = document.createElement('div');
			        条目.className = '统计条目';
			        条目.innerHTML = `
			            <div class="统计图标">${数据.图标}</div>
			            <div class="统计数值">${数据.数值}</div>
			            <div class="统计标签">${标签}</div>
			        `;
			        统计容器.appendChild(条目);
			    }
			
			    const 评级数据 = 获取结局评级({游戏时长秒: 游戏时长秒, 击杀怪物: 已击杀怪物数, 获得金币: 总金币, 回合数: 玩家总移动回合数, 承受伤害: 玩家总受到伤害});
			    标题元素.textContent = 评级数据.标题;
			    评级元素.textContent = 评级数据.评级;
			    评级元素.className = `结局评级 ${评级数据.颜色类}`;
			    评语元素.textContent = 评级数据.结束语;
			
			    const 胜利凭证 = 生成死亡凭证(当前层数);
			    凭证码元素.textContent = 胜利凭证;
			
			    返回按钮.onclick = () => {
			        遮罩.classList.remove('显示');
			        重置所有游戏状态();
			        显示主菜单();
			    };
			
			    生成结算粒子(粒子容器);
			    遮罩.style.display = 'flex';
			    requestAnimationFrame(() => {
			        遮罩.classList.add('显示');
			    });
			}
			class 魔法师法杖 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "魔法师法杖",
			            图标: 图标映射.魔法师法杖,
			            品质: 5,
			            基础攻击力: 10,
			            冷却回合: 6,
			            攻击范围: 5,
			            耐久: 120,
			            效果描述: "释放大魔法师的经典法术，攻击模式随机。",
			            不可破坏: false,
			            ...配置,
			        });
			    }
			    使用(目标怪物,路径,使用者=玩家) {
			        if (this.自定义数据.get("冷却剩余") > 0) return false;
			        this.普通攻击(使用者);
			        this.自定义数据.set("冷却剩余", this.最终冷却回合);
			        this.自定义数据.set(
			            "耐久",
			            this.自定义数据.get("耐久") - this.耐久消耗
			        );
			        if (this.自定义数据.get("耐久") <= 0) {
			            处理销毁物品(this.唯一标识, true);
			            显示通知(`${this.名称} 已损坏！`, "警告");
			        }
			        更新装备显示();
			        return true;
			    }
			
			    普通攻击(使用者) {
			        const 攻击模式 = Math.floor(prng() * 4);
			        let 方向列表 = [];
			
			        switch (攻击模式) {
			            case 0:
			                方向列表 = [
			                    { dx: 0, dy: -1 },
			                    { dx: 0, dy: 1 },
			                    { dx: -1, dy: 0 },
			                    { dx: 1, dy: 0 },
			                ];
			                break;
			            case 1:
			                方向列表 = [
			                    { dx: -1, dy: -1 },
			                    { dx: 1, dy: -1 },
			                    { dx: -1, dy: 1 },
			                    { dx: 1, dy: 1 },
			                ];
			                break;
			            case 2:
			            case 3:
			                const 基本方向 = [
			                    { dx: 0, dy: -1 },
			                    { dx: 1, dy: 0 },
			                    { dx: 0, dy: 1 },
			                    { dx: -1, dy: 0 },
			                ];
			                const 顺时针方向变化 = [
			                    { dx: 1, dy: 0 },
			                    { dx: 0, dy: 1 },
			                    { dx: -1, dy: 0 },
			                    { dx: 0, dy: -1 },
			                ];
			                const 逆时针方向变化 = [
			                    { dx: 0, dy: -1 },
			                    { dx: -1, dy: 0 },
			                    { dx: 0, dy: 1 },
			                    { dx: 1, dy: 0 },
			                ];
			
			                基本方向.forEach((起始方向) => {
			                    let 当前方向 = 起始方向;
			                    let 当前X = 使用者.x;
			                    let 当前Y = 使用者.y;
			                    let 路径 = [];
			                    let 层数 = 0;
			                    while (
			                        Math.abs(当前X - 使用者.x) +
			                            Math.abs(当前Y - 使用者.y) <=
			                        this.最终攻击范围
			                    ) {
			                        层数++;
			                        let 步数 = 层数 * 2 - 1;
			                        if (层数 > 1) {
			                            const 方向变化 =
			                                攻击模式 === 2
			                                    ? 顺时针方向变化
			                                    : 逆时针方向变化;
			                            let 方向索引 = 方向变化.findIndex(
			                                (d) =>
			                                    d.dx === 当前方向.dx &&
			                                    d.dy === 当前方向.dy
			                            );
			                            方向索引 = (方向索引 + 1) % 4;
			                            当前方向 = 方向变化[方向索引];
			                            当前X += 当前方向.dx;
			                            当前Y += 当前方向.dy;
			                            if (
			                                !检查移动可行性(
			                                    当前X - 当前方向.dx,
			                                    当前Y - 当前方向.dy,
			                                    当前X,
			                                    当前Y
			                                )
			                            )
			                                break;
			                            const 单元格 = 地牢[当前Y]?.[当前X];
			                            if (
			                                单元格?.关联怪物 &&
			                                单元格.类型 === 单元格类型.怪物 &&
			                                单元格.关联怪物?.状态 ===
			                                    怪物状态.活跃
			                            ) {
			                                单元格.关联怪物.受伤(
			                                    this.攻击力,
			                                    this
			                                );
			                            }
			                            路径.push({ x: 当前X, y: 当前Y });
			                            步数--;
			                        }
			                        for (let i = 0; i < 步数; i++) {
			                            当前X += 当前方向.dx;
			                            当前Y += 当前方向.dy;
			                            if (
			                                !检查移动可行性(
			                                    当前X - 当前方向.dx,
			                                    当前Y - 当前方向.dy,
			                                    当前X,
			                                    当前Y
			                                )
			                            )
			                                break;
			                            const 单元格 = 地牢[当前Y]?.[当前X];
			                            if (
			                                单元格?.关联怪物 &&
			                                单元格.类型 === 单元格类型.怪物 &&
			                                单元格.关联怪物?.状态 ===
			                                    怪物状态.活跃
			                            ) {
			                                单元格.关联怪物.受伤(
			                                    this.攻击力,
			                                    this
			                                );
			                            }
			                            路径.push({ x: 当前X, y: 当前Y });
			                        }
			                        if (
			                            Math.abs(当前X - 使用者.x) +
			                                Math.abs(当前Y - 使用者.y) >
			                            this.最终攻击范围
			                        )
			                            break;
			                    }
			                    计划显示格子特效(路径);
			                });
			                return;
			        }
			
			        方向列表.forEach((方向) => {
			            let 当前X = 使用者.x + 方向.dx;
			            let 当前Y = 使用者.y + 方向.dy;
			            let 路径 = [];
			            while (
			                Math.abs(当前X - 使用者.x) +
			                    Math.abs(当前Y - 使用者.y) <=
			                this.最终攻击范围
			            ) {
			                if (
			                    !检查移动可行性(
			                        当前X - 方向.dx,
			                        当前Y - 方向.dy,
			                        当前X,
			                        当前Y
			                    )
			                )
			                    break;
			                const 单元格 = 地牢[当前Y]?.[当前X];
			                if (
			                    单元格?.关联怪物 &&
			                    单元格.类型 === 单元格类型.怪物 &&
			                    单元格.关联怪物?.状态 === 怪物状态.活跃
			                ) {
			                    单元格.关联怪物.受伤(this.攻击力, this);
			                    break;
			                }
			                路径.push({ x: 当前X, y: 当前Y });
			                当前X += 方向.dx;
			                当前Y += 方向.dy;
			            }
			            计划显示格子特效(路径);
			        });
			    }
			}
			
			class 大师附魔卷轴 extends 卷轴类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "大师附魔卷轴",
			            品质: 5,
			            效果描述:
			                "从三个随机的高级附魔中选择一个，为装备附加。",
			            能量消耗: 50,
			            数据: {
			               附魔选项: [],
			            },
			            ...配置,
			        });
			        if (!this.自定义数据.get('附魔选项') || this.自定义数据.get('附魔选项').length === 0) {
			            const 附魔池 = new 附魔卷轴({}).附魔池;
			            const 效果名池 = new 附魔卷轴({}).效果名;
			            const 随机效果 = [];
			            const 已选索引 = new Set();
			            while (随机效果.length < 3 && 已选索引.size < 附魔池.length) {
			                const 索引 = Math.floor(prng() * 附魔池.length);
			                if (!已选索引.has(索引)) {
			                    已选索引.add(索引);
			                    随机效果.push({
			                        效果函数名: 附魔池[索引].name,
			                        效果名: 效果名池[索引],
			                    });
			                }
			            }
			            this.自定义数据.set('附魔选项', 随机效果);
			        }
			    }
			
			    使用() {
			        const 效果列表 = this.自定义数据.get('附魔选项').map(opt => ({
			            效果函数: opt.效果函数名,
			            效果名: opt.效果名
			        }));
			
			        if (效果列表.length < 3) {
			            显示通知("附魔池不足，无法生成选项！", "错误");
			            return false;
			        }
			        if (!this.消耗能量()) return false;
			
			        this.显示选择界面(效果列表);
			        当前激活卷轴列表.delete(this);
			        return true;
			    }
			
			    显示选择界面(效果列表) {
			        玩家属性.允许移动++;
			        const 遮罩 = document.createElement("div");
			        遮罩.className = "重铸遮罩";
			        const 弹窗 = document.createElement("div");
			        弹窗.className = "重铸弹窗";
			        弹窗.innerHTML = `<div class="重铸弹窗-header"><h3>选择一个附魔</h3><button class="关闭按钮" id="三选一关闭按钮">×</button></div><div id="附魔选项容器" class="重铸弹窗-items"></div>`;
			        const 容器 = 弹窗.querySelector("#附魔选项容器");
			
			        const 关闭选择界面 = () => {
			            遮罩.remove();
			            玩家属性.允许移动--;
			            const 能量条 = document.querySelector(".power-bar");
			            const 当前能量 = parseFloat(能量条.style.width) || 0;
			            if (能量条)
			                能量条.style.width = `${Math.min(
			                    100,
			                    当前能量 + this.自定义数据.get("能量消耗")/自定义全局设置.初始能量值*100
			                )}%`;
			            触发HUD显示();
			        };
			
			        弹窗.querySelector("#三选一关闭按钮").onclick =
			            关闭选择界面;
			
			        效果列表.forEach((效果) => {
			            const 按钮 = document.createElement("button");
			            按钮.className = "菜单按钮";
			            按钮.textContent = 效果.效果名;
			            按钮.onclick = () => {
			                遮罩.remove();
			                玩家属性.允许移动 -= 1;
			                const 临时附魔卷轴 = new 附魔卷轴({
			                    品质: 4,
			                    已解锁: true,
			                });
			                临时附魔卷轴.附魔效果 = 临时附魔卷轴[效果.效果函数];
			                临时附魔卷轴.当前附魔效果名 = 效果.效果名;
			                临时附魔卷轴.自定义数据.set('能量消耗',0);
			
			                const 原创建附魔弹窗 = 临时附魔卷轴.创建附魔弹窗;
			                临时附魔卷轴.创建附魔弹窗 = () => {
			                    const 附魔弹窗实例 =
			                        原创建附魔弹窗.call(临时附魔卷轴);
			                    const 原关闭按钮 =
			                        附魔弹窗实例.querySelector(".关闭按钮");
			                    if (原关闭按钮) {
			                        原关闭按钮.onclick = () => {
			                            附魔弹窗实例.classList.add("关闭中");
			                            setTimeout(() => {
			                                附魔弹窗实例.remove();
			                                当前激活卷轴列表.delete(
			                                    临时附魔卷轴
			                                );
			                                const 能量条 =
			                                    document.querySelector(
			                                        ".power-bar"
			                                    );
			                                const 当前能量 =
			                                    parseFloat(
			                                        能量条.style.width
			                                    ) || 0;
			                                if (能量条)
			                                    能量条.style.width = `${Math.min(
			                                        100,
			                                        当前能量 +
			                                            this.自定义数据.get(
			                                                "能量消耗"
			                                            )/自定义全局设置.初始能量值*100
			                                    )}%`;
			                                触发HUD显示();
			                            }, 300);
			                        };
			                    }
			                    return 附魔弹窗实例;
			                };
			
			                const 原执行附魔 = 临时附魔卷轴.执行附魔;
			                临时附魔卷轴.执行附魔 = (装备, 弹窗, 元素) => {
			                    const 附魔成功 = 原执行附魔.call(
			                        临时附魔卷轴,
			                        装备,
			                        弹窗,
			                        元素
			                    );
			                    if (附魔成功) {
			                        处理销毁物品(this.唯一标识, true);
			                    } else {
			                        显示通知('无法应用附魔','错误')
			                    }
			                };
			
			                临时附魔卷轴.使用();
			            };
			            容器.appendChild(按钮);
			        });
			        遮罩.appendChild(弹窗);
			        document.body.appendChild(遮罩);
			    }
			}
			class 小书魔 extends 宠物 {
			    constructor(配置 = {}) {
			        super({
			            名称: "小书魔",
			            图标: 图标映射.小书魔,
			            品质: 4,
			            饰品栏数量: 4,
			            效果描述: "它似乎对魔法卷轴有着天生的亲和力。",
			            基础攻击力: 3,
			            基础防御力: 1,
			            最大生命值: 25,
			            技能: [
			                {
			                    名称: "奥术飞弹",
			                    等级: 1,
			                    描述: "攻击时有几率发射奥术飞弹，造成额外伤害。",
			                    时机: "攻击",
			                    索引: 0,
			                },
			                {
			                    名称: "法力汲取",
			                    等级: 1,
			                    描述: "受击时有几率从攻击者身上汲取法力，为主人恢复能量。",
			                    时机: "被攻击",
			                    索引: 1,
			                },
			            ],
			            ...配置,
			        });
			
			        this.技能效果 = [
			            (宠物, 目标怪物列表) => {
			                const 技能 = 宠物.自定义数据.get("技能")[0];
			                if (prng() < 0.3) {
			                    const 伤害 = 2 + 技能.等级;
			                    const 目标 = 目标怪物列表[0];
			                    if (目标 && 目标.当前生命值 > 0) {
			                        目标.受伤(伤害, 宠物);
			                        添加日志(
			                            `${宠物.名称}发射了奥术飞弹！`,
			                            "成功"
			                        );
			                    }
			                }
			            },
			            (宠物, 来源) => {
			                const 技能 = 宠物.自定义数据.get("技能")[1];
			                if (prng() < 0.4 && 来源 instanceof 怪物) {
			                    const 恢复量 = 5 + 技能.等级 * 2;
			                    const 能量条 =
			                        document.querySelector(".power-bar");
			                    const 当前能量 =
			                        parseFloat(能量条.style.width) || 0;
			                    能量条.style.width = `${Math.min(
			                        100,
			                        当前能量 + 恢复量/自定义全局设置.初始能量值*100
			                    )}%`;
			                    添加日志(`${宠物.名称}汲取了能量！`, "成功");
			                }
			            },
			        ];
			    }
			
			    升级() {
			        if (super.升级()) {
			            const 技能列表 = this.自定义数据.get("技能");
			            const 随机技能索引 = Math.floor(
			                prng() * 技能列表.length
			            );
			            技能列表[随机技能索引].等级 += 1;
			            显示通知(
			                `${this.名称}的技能 ${技能列表[随机技能索引].名称} 升级了!`,
			                "成功"
			            );
			        }
			    }
			}
			class 罐子 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "工具",
			            名称: "神秘的罐子",
			            图标: 图标映射.罐子,
			            品质: 2,
			            颜色索引: 3,
			            最大堆叠数量: 1,
			            能否拾起: true,
			            是否正常物品: false,
			            阻碍怪物: false,
			            效果描述:
			                "一个看起来很脆弱的罐子，里面似乎装着什么东西。",
			            数据: {
			                内容物类型: null,
			                内容物类名: null,
			                内容物配置: {},
			                随机层数: 999,
			                已破碎: false,
			                
			            },
			            
			        });
			        if (
			            !this.自定义数据.get("已破碎") &&
			            !this.自定义数据.get("内容物类名") &&
			            this.自定义数据.get("内容物类型") !== '随机'
			        ) {
			            this.决定罐子内容(当前层数 ?? 0);
			        }
			    }
			
			    决定罐子内容(层数) {
			        const 实际层数 = (层数 === null || 层数 === undefined) ? (this.自定义数据.get('随机层数') ?? 999) : 层数;
			        if (prng() < 0.65) {
			            this.自定义数据.set("内容物类型", "怪物");
			            const 怪物池选择 = 怪物池.普通房间.filter(
			                (m) =>
			                    m.最小层 <= 实际层数 && m.类.name !== "大魔法师"
			            );
			            if (怪物池选择.length > 0) {
			                const 怪物配置 = 加权随机选择(
			                    怪物池选择.map((cfg) => ({ 值: cfg, 权重: 1 }))
			                );
			                this.自定义数据.set("内容物类名", 怪物配置.类.name);
			                this.自定义数据.set("内容物配置", {
			                    强化: prng() < 0.2 + 实际层数 * 0.02,
			                });
			            } else {
			                this.转为物品内容("金币", {
			                    数量: Math.floor(prng() * 10) + 5,
			                });
			            }
			        } else {
			            this.自定义数据.set("内容物类型", "物品");
			            const 物品池选择 = Object.values(物品池)
			                .flat()
			                .filter(
			                    (i) =>
			                        i.最小层 <= 实际层数 &&
			                        i.类.name !== "罐子" &&
			                        i.类.name !== "神秘商人" &&
			                        i.类.name !== "探险家" &&
			                        i.类.name !== "物品祭坛" &&
			                        i.类.name !== "耐久祭坛" &&
			                        i.类.name !== "背包扩容祭坛" &&
			                        i.类.name !== "重铸台" &&
			                        i.类.name !== "折跃门" &&
			                        i.类.name !== "寻宝戒指" &&
			                        i.类.name !== "配方卷轴" &&
			                        i.类.name !== "钥匙" &&
			                        i.类.name !== "调试工具"
			                );
			            if (物品池选择.length > 0) {
			                const 物品配置 =
			                    物品池选择[
			                        Math.floor(
			                            prng() * 物品池选择.length
			                        )
			                    ];
			                this.自定义数据.set("内容物类名", 物品配置.类.name);
			                this.自定义数据.set("内容物配置", {
			                    强化: prng() < 0.1 + 实际层数 * 0.02,
			                });
			            } else {
			                this.转为物品内容("金币", {
			                    数量: Math.floor(prng() * 10) + 5,
			                });
			            }
			        }
			    }
			
			    转为物品内容(类名, 配置) {
			        this.自定义数据.set("内容物类型", "物品");
			        this.自定义数据.set("内容物类名", 类名);
			        this.自定义数据.set("内容物配置", 配置);
			    }
			
			    当被收集(进入者) {
			        
			        if (this.自定义数据.get("已破碎")) return false;
			        this.破碎并释放内容();
			        return false;
			    }
			
			    破碎并释放内容(触发怪物 = null) {
			        if (this.自定义数据.get("已破碎")) return;
			        this.自定义数据.set("已破碎", true);
			
			        const 原罐子X = this.x;
			        const 原罐子Y = this.y;
			
			        if (
			            原罐子X !== null &&
			            原罐子Y !== null &&
			            地牢[原罐子Y]?.[原罐子X]?.关联物品 === this
			        ) {
			            地牢[原罐子Y][原罐子X].关联物品 = null;
			            if(地牢[原罐子Y][原罐子X].类型===单元格类型.物品) 地牢[原罐子Y][原罐子X].类型 = null;
			            地牢[原罐子Y][原罐子X].颜色索引 = 颜色表.length;
			        }
			        if (玩家背包.has(this.唯一标识)) {
			            玩家背包.delete(this.唯一标识);
			            更新背包显示();
			        }
			
			        显示通知("罐子破碎了！", "警告");
			        计划显示格子特效([{ x: 原罐子X, y: 原罐子Y }], "A52A2A");
			
			        let 内容物类型 = this.自定义数据.get("内容物类型");
			        let 内容物类名 = this.自定义数据.get("内容物类名");
			        
			        if (内容物类型 === '随机' || !内容物类型) {
			            this.决定罐子内容(this.自定义数据.get('随机层数'));
			            内容物类型 = this.自定义数据.get("内容物类型");
			            内容物类名 = this.自定义数据.get("内容物类名");
			        }
			
			        const 内容物配置 = this.自定义数据.get("内容物配置") || {};
			
			        if (!内容物类名) {
			            添加日志("罐子是空的...", "信息");
			            绘制();
			            return;
			        }
			
			        const 构造器 = window[内容物类名];
			        if (!构造器) {
			            添加日志(
			                `罐子里的东西不见了 (未知类型: ${内容物类名})`,
			                "错误"
			            );
			            绘制();
			            return;
			        }
			
			        let 释放物实例;
			        try {
			            释放物实例 = new 构造器({
			                ...内容物配置,
			                x: null,
			                y: null,
			            });
			        } catch (e) {
			            添加日志(
			                `无法创建罐子内容物 ${内容物类名}: ${e.message}`,
			                "错误"
			            );
			            绘制();
			            return;
			        }
			
			        let 放置X = 原罐子X;
			        let 放置Y = 原罐子Y;
			        let 放置成功 = false;
			
			        const 怪物正在此格 =
			            触发怪物 &&
			            触发怪物.x === 放置X &&
			            触发怪物.y === 放置Y;
			
			        if (!怪物正在此格 && 位置是否可用(放置X, 放置Y, false)) {
			            if (内容物类型 === "怪物") {
			                放置成功 = 放置怪物到单元格(
			                    释放物实例,
			                    放置X,
			                    放置Y
			                );
			            } else {
			                放置成功 = 放置物品到单元格(
			                    释放物实例,
			                    放置X,
			                    放置Y
			                );
			            }
			        }
			
			        if (!放置成功) {
			            const 方向 = [
			                [0, -1],
			                [0, 1],
			                [-1, 0],
			                [1, 0],
			                [-1, -1],
			                [1, -1],
			                [-1, 1],
			                [1, 1],
			            ];
			            方向.sort(() => prng() - 0.5);
			            for (const [dx, dy] of 方向) {
			                const 新X = 原罐子X + dx;
			                const 新Y = 原罐子Y + dy;
			
			                if (
			                    新X >= 0 &&
			                    新X < 地牢大小 &&
			                    新Y >= 0 &&
			                    新Y < 地牢大小 &&
			                    位置是否可用(新X, 新Y, false)
			                ) {
			                    if (内容物类型 === "怪物") {
			                        放置成功 = 放置怪物到单元格(
			                            释放物实例,
			                            新X,
			                            新Y
			                        );
			                    } else {
			                        放置成功 = 放置物品到单元格(
			                            释放物实例,
			                            新X,
			                            新Y
			                        );
			                    }
			                    if (放置成功) {
			                        放置X = 新X;
			                        放置Y = 新Y;
			                        break;
			                    }
			                }
			            }
			        }
			
			        if (放置成功) {
			            添加日志(
			                `从罐子中出现了: ${
			                    释放物实例.获取名称
			                        ? 释放物实例.获取名称()
			                        : 释放物实例.类型 || 内容物类名
			                }!`,
			                "成功"
			            );
			            if (内容物类型 === "怪物") {
			                释放物实例.状态 = 怪物状态.活跃;
			                释放物实例.绘制血条();
			            }
			        } else {
			            添加日志("罐子里的东西无处安放，消失了...", "信息");
			        }
			        绘制();
			    }
			
			    获取提示() {
			        if (this.自定义数据.get("已破碎")) {
			            return "破碎的罐子";
			        }
			        let 提示 = `${this.名称}\n品质：${"★".repeat(this.品质)}\n${
			            this.效果描述
			        }`;
			        return 提示;
			    }
			}
			class 空罐子 extends 罐子 {
			    constructor(配置 = {}) {
			        super({
			            名称: "空罐子",
			            数据: {
			                已破碎: false,
			                内容物类型: null,
			                内容物类名: null,
			            },
			            ...配置,
			        });
			    }
			    决定罐子内容() {}
			}
			class 吸能种子 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "消耗品",
			            名称: "吸能种子",
			            图标: 图标映射.种子,
			            品质: 2,
			            颜色索引: 1,
			            堆叠数量: 配置.数量 || 1,
			            最大堆叠数量: 16,
			            效果描述:
			                "消耗至多50点能量，将其转化为能量草存入背包。",
			            ...配置,
			        });
			    }
			
			    使用() {
			        if (this.堆叠数量 <= 0) return false;
			
			        const 能量条 = document.querySelector(".power-bar");
			        const 当前能量百分比 = parseFloat(能量条.style.width) || 0;
			        const 当前能量值 = 当前能量百分比;
			
			        if (当前能量值 <= 0) {
			            显示通知("没有能量可以吸取！", "错误");
			            return false;
			        }
			
			        const 能量草实例 = new 能量草({});
			        if (
			            [...玩家背包.values()].reduce(
			                (sum, i) => sum + (i.是否隐藏 ? 0 : 1),
			                0
			            ) >= 最大背包容量 &&
			            ![...玩家背包.values()].find((i) =>
			                i.可堆叠于(能量草实例)
			            )
			        ) {
			            显示通知("背包已满，无法生成能量草！", "错误");
			            return false;
			        }
			
			        const 吸收量 = Math.min(50, 当前能量值);
			        if (!扣除能量(吸收量)) {
			            显示通知("未知错误，无法吸取能量。", "错误");
			            return false;
			        }
			
			        if (尝试收集物品(能量草实例, true)) {
			            this.堆叠数量--;
			            显示通知(
			                `成功吸取 ${吸收量.toFixed(
			                    0
			                )} 点能量，获得了能量草！`,
			                "成功"
			            );
			            return true;
			        } else {
			            能量条.style.width = `${当前能量百分比}%`;
			            显示通知("背包空间不足，无法获得能量草！", "错误");
			            return false;
			        }
			    }
			}
			class 能量草 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "消耗品",
			            名称: "能量草",
			            图标: 图标映射.能量草,
			            品质: 2,
			            颜色索引: 1,
			            堆叠数量: 配置.数量 || 1,
			            最大堆叠数量: 16,
			            效果描述: "使用后恢复50点能量。",
			            ...配置,
			        });
			    }
			
			    使用() {
			        if (this.堆叠数量 <= 0) return false;
			
			        const 能量条 = document.querySelector(".power-bar");
			        const 当前能量 = parseFloat(能量条.style.width) || 0;
			        能量条.style.width = `${Math.min(100, 当前能量 + 50/自定义全局设置.初始能量值*100)}%`;
			
			        this.堆叠数量--;
			        if (this.堆叠数量 <= 0) {
			            处理销毁物品(this.唯一标识, true);
			        }
			
			        显示通知("你感到了能量的充盈！", "成功");
			        更新背包显示();
			        更新装备显示();
			        return true;
			    }
			}
			class 火焰物品 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形", // 特殊类型，非普通物品
			            名称: "火焰",
			            图标: 图标映射.火焰,
			            品质: 1, // 品质意义不大
			            颜色索引: 效果名称编号映射.火焰, // 使用火焰效果的颜色索引
			            最大堆叠数量: 1,
			            能否拾起: true, // 必须为true 才能触发 当被收集 函数
			            阻碍怪物: false, // 关键：不阻碍怪物
			            是否正常物品: false, // 不参与常规掉落/交易
			            是否为隐藏物品: false, // 在地图上可见
			            效果描述: "灼热的火焰，触碰会被点燃。",
			            数据: {
			                倒计时: 配置.倒计时 ?? 10, // 默认存在10回合
			                爆炸时间: 配置.倒计时 ?? 10, // 复用计时器接口
			                火焰强度: 配置.火焰强度 ?? 3, // 每回合伤害
			                火焰持续: 配置.火焰持续 ?? 3, // 施加给玩家的燃烧效果持续回合数
			                光照范围: 配置.光照范围 ?? 2, // 照亮范围
			                ...配置.数据, // 允许覆盖
			            },
			            ...配置, // 允许覆盖父类属性
			        });
			        // 火焰物品创建时自动加入计时器
			        if (!所有计时器.some((t) => t.唯一标识 === this.唯一标识)) {
			            
			            if (游戏状态 === '地图编辑器') {
			            if(配置?.玩家放置) this.玩家放置=配置?.玩家放置
			            return;
			                
			            }
			            所有计时器.push(this);
			        }
			        if (当前天气效果?.includes("严寒") && !配置.倒计时) {
			            this.自定义数据.set("爆炸时间", 5);
			            this.自定义数据.set("倒计时", 5);
			        }
			    }
			
			    // 火焰不能被主动使用
			    使用() {
			        return false;
			    }
			
			    // 玩家接触火焰时触发 (不能被收集，但会触发效果)
			    当被收集(进入者) {
			        if (进入者 !== "玩家") return;
			        const 效果 = new 状态效果(
			            "火焰", // 效果类型
			            this.获取火焰颜色(), // 颜色
			            图标映射.火焰, // 图标
			            this.自定义数据.get("火焰持续"), // 效果持续回合数
			            null, // 剩余回合（从持续时间开始）
			            null, // 来源（火焰本身，或null）
			            null, // 关联怪物 (null代表玩家)
			            this.自定义数据.get("火焰强度") // 效果强度（每回合伤害）
			        );
			        添加日志("你接触了火焰，被点燃了！", "错误");
			        return false; // 返回 false 表示无法被收集（移除）
			    }
			
			    // 更新倒计时 (每回合调用)
			    更新倒计时() {
			        const 剩余回合 = this.自定义数据.get("倒计时");
			        if (剩余回合 <= 0) {
			            this.熄灭(); // 时间到，火焰熄灭
			        } else {
			            this.自定义数据.set("倒计时", 剩余回合 - 1);
			        }
			    }
			
			    // 火焰熄灭 (代替原来的触发爆炸)
			    熄灭() {
			        // 从地牢格子中移除
			        if (
			            this.x !== null &&
			            this.y !== null &&
			            地牢[this.y]?.[this.x]?.关联物品 === this
			        ) {
			            地牢[this.y][this.x].关联物品 = null;
			
			            if (地牢[this.y]?.[this.x]?.类型 === 单元格类型.物品)
			                地牢[this.y][this.x].类型 = null;
			        }
			        // 从计时器列表中移除
			        所有计时器 = 所有计时器.filter((item) => item !== this);
			        绘制(); // 更新画面，移除火焰图标
			    }
			
			    获取提示() {
			        return [
			            `${this.获取名称()}`,
			            `类型：${this.类型}`,
			            `剩余时间：${this.自定义数据.get("倒计时")} 回合`,
			            `${this.效果描述}`,
			        ].join("\n");
			    }
			
			    获取火焰颜色() {
			        return 效果颜色编号映射[this.颜色索引] || "#CC5500";
			    }
			
			    get 颜色表() {
			        return 效果颜色编号映射;
			    }
			}
			class 寻宝戒指 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "戒指",
			            名称: "寻宝戒指",
			            图标: 图标映射.寻宝戒指,
			            品质: 3,
			            颜色索引: 2,
			            最大堆叠数量: 1,
			            效果描述: "装备后，会为你指出隐藏大门的位置",
			            数据: {
			                生效层数: 配置.生效层数 || 当前层数, // 指定生效的层数
			                已生成折跃门: false,
			                ...配置.数据,
			            },
			        });
			    }
			    生成显示元素(用途 = "背包") {
			        const 元素 = super.生成显示元素(用途);
			        if (用途 === "装备") {
			            const 标签 = document.createElement("div");
			            标签.className = "耐久标签";
			            标签.textContent = `当前层:${当前层数}`;
			            元素.appendChild(标签);
			        }
			        return 元素;
			    }
			    使用() {
			        显示通知("装备不能被使用！", "错误");
			        return false;
			    }
			    装备() {
			        if (!super.装备()) return false;
			        // 触发检查和生成折跃门逻辑
			        if (
			            this.自定义数据.get("生效层数") === 当前层数 &&
			            !this.自定义数据.get("已生成折跃门")
			        ) {
			            this.尝试生成折跃门();
			        }
			
			        更新装备显示();
			        return true;
			    }
			
			    取消装备() {
			        if (!this.已装备) return false;
			        // 移除折跃门指示器（如果存在）
			        const 指示器 = document.querySelector(".折跃门指示器");
			        if (指示器) {
			            指示器.remove();
			        }
			        玩家装备.delete(this.装备槽位);
			        this.已装备 = false;
			        this.装备槽位 = null;
			        更新装备显示();
			        return true;
			    }
			
			    尝试生成折跃门() {
			        const 可用房间 = 房间列表.filter(
			            (房间) => 房间.类型?.slice(0, 2) === "房间"
			        );
			        if (可用房间.length === 0) return; // 没有可用房间
			        const 随机房间 =
			            可用房间[Math.floor(prng() * 房间列表.length)];
			        const 放置折跃门 = new 折跃门({
			            目标房间: 房间列表.find(
			                (item) => item.类型?.slice(0, 2) === "隐藏"
			            ),
			        }); // 假设目标房间是起始房间
			        if (
			            放置物品到房间(
			                放置折跃门,
			                随机房间,
			                单元格类型.物品,
			                false,
			                true
			            )
			        ) {
			            this.自定义数据.set("已生成折跃门", true);
			            this.自定义数据.set("折跃门位置", {
			                x: 放置折跃门.x,
			                y: 放置折跃门.y,
			            });
			            更新物体指示器();
			        }
			    }
			
			    获取提示() {
			        return [
			            `${this.获取名称()}`,
			            `类型：${this.类型}`,
			            `生效层数：${this.自定义数据.get("生效层数")}`,
			            `效果描述：${this.效果描述}`,
			        ].join("\n");
			    }
			}
			class 传送门 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "传送门",
			            图标: 图标映射.传送门,
			            品质: 5,
			            颜色索引: 1, 
			            能否拾起: true,
			            是否正常物品: false,
			            阻碍怪物: false,
			            效果描述: "一个神秘的传送门，触碰它会被传送到未知的地方。",
			            数据: {
			                是否随机: true,
			                目标X: null,
			                目标Y: null,
			                ...配置.数据,
			            },
			            ...配置,
			        });
			    }
			
			    当被收集(进入者) {
			        if (进入者 !== "玩家") return false;
			        
			        const 是否随机 = this.自定义数据.get('是否随机');
			        let 目标X = this.自定义数据.get('目标X');
			        let 目标Y = this.自定义数据.get('目标Y');
			        
			
			        if (是否随机) {
			            const 可用位置 = [];
			            for (let y = 0; y < 地牢大小; y++) {
			                for (let x = 0; x < 地牢大小; x++) {
			                    if (位置是否可用(x, y, false)) {
			                        可用位置.push({ x, y });
			                    }
			                }
			            }
			            if (可用位置.length > 0) {
			                const 随机位置 = 可用位置[Math.floor(prng() * 可用位置.length)];
			                目标X = 随机位置.x;
			                目标Y = 随机位置.y;
			            } else {
			                显示通知("没有可用的传送目标位置！", "错误");
			                return false;
			            }
			        } else if (目标X === null || 目标Y === null) {
			            显示通知("传送门目标未设置！", "错误");
			            return false;
			        }
			
			        if (位置是否可用(目标X, 目标Y, false)) {
			            显示通知(`你穿过了传送门...`, "成功");
			            const 当前玩家房间ID = 房间地图[玩家.y][玩家.x];
			        if (当前玩家房间ID !== -1) {
			            const 当前玩家所在房间 = 房间列表.find(t=>t.id==当前玩家房间ID);
			            if (
			                当前玩家所在房间 &&
			                当前玩家所在房间.类型 === "挑战房间" &&
			                当前玩家所在房间.挑战状态 &&
			                当前玩家所在房间.挑战状态.进行中
			            ) {
			                处理挑战失败(当前玩家所在房间);
			            }
			        }
			        if (生存挑战激活) {
			            显示通知("强大的结界阻止了空间传送！", "错误");
			            return false;
			        }
			        setTimeout(() => {
			        const 旧X = 玩家.x;
			            const 旧Y = 玩家.y;
			            玩家.x = parseInt(目标X);
			            玩家.y = parseInt(目标Y);
			            处理玩家着陆效果(旧X, 旧Y, 玩家.x, 玩家.y);
			            更新视口();
			            
			    }, 400);
			            
			            
			        } else {
			            显示通知("传送目标位置被阻挡！", "错误");
			        }
			
			        return false; 
			    }
			
			    获取提示() {
			        const 是否随机 = this.自定义数据.get('是否随机');
			        let dest = 是否随机 ? "随机位置" : `(${this.自定义数据.get('目标X') ?? '未设置'}, ${this.自定义数据.get('目标Y') ?? '未设置'})`;
			        return `${this.名称}\n品质：${"★".repeat(this.品质)}\n传送目标: ${dest}\n${this.效果描述}`;
			    }
			
			    使用() {
			        return false;
			    }
			}
			class 折跃门 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            图标: 图标映射.折跃门,
			            类型: "地形",
			            名称: "折跃门",
			            品质: 1,
			            颜色索引: 2,
			            能否拾起: false,
			            是否正常物品: false,
			            是否为隐藏物品:
			                配置.是否为隐藏物品 !== undefined
			                    ? 配置.是否为隐藏物品
			                    : true, // 默认为隐藏
			            数据: {
			                目标房间: 配置.目标房间 || null, // 目标房间的配置
			            },
			        });
			    }
			
			    使用() {
			        const 目标房间 = this.自定义数据.get("目标房间");
			        if (!confirm("你发现了一个折跃门，是否传送？")) return false;
			        const 当前玩家房间ID = 房间地图[玩家.y][玩家.x];
			        if (当前玩家房间ID !== -1) {
			            const 当前玩家所在房间 = 房间列表.find(t=>t.id==当前玩家房间ID);
			            if (
			                当前玩家所在房间 &&
			                当前玩家所在房间.类型 === "挑战房间" &&
			                当前玩家所在房间.挑战状态 &&
			                当前玩家所在房间.挑战状态.进行中
			            ) {
			                处理挑战失败(当前玩家所在房间);
			            }
			        }
			        if (生存挑战激活) {
			            显示通知("强大的结界阻止了空间传送！", "错误");
			            return false;
			        }
			        if (目标房间) {
			            let 目标X, 目标Y;
			            let 尝试次数 = 0;
			            do {
			                目标X =
			                    目标房间.x +
			                    Math.floor(prng() * 目标房间.w);
			                目标Y =
			                    目标房间.y +
			                    Math.floor(prng() * 目标房间.h);
			                尝试次数++;
			            } while (
			                地牢[目标Y]?.[目标X]?.背景类型 ===
			                    单元格类型.墙壁 &&
			                尝试次数 < 50
			            );
			
			            if (
			                地牢[目标Y]?.[目标X]?.背景类型 === 单元格类型.墙壁
			            ) {
			                目标X = 目标房间.x + Math.floor(目标房间.w / 2);
			                目标Y = 目标房间.y + Math.floor(目标房间.h / 2);
			            }
			
			            玩家.x = 目标X;
			            玩家.y = 目标Y;
			            const 目标房间ID = 房间地图[玩家.y][玩家.x];
			            if (目标房间ID !== -1 && !已访问房间.has(目标房间ID)) {
			                moveQueue = [];
			                isAutoMoving = false;
			                已访问房间.add(目标房间ID);
			            }
			
			            更新视口();
			            绘制();
			            显示通知("你被传送到了一个神秘的房间！", "成功");
			            return true;
			        }
			        return false;
			    }
			}
			//下面这个物品！！！闪亮登场！
			class 炸弹 extends 物品 {
			    constructor(配置) {
			        super({
			            类型: "炸弹",
			            名称: "炸弹",
			            图标: 图标映射.炸弹,
			            品质: 3,
			            强化: 配置.强化 || false,
			            颜色索引:
			                配置.颜色索引 === undefined ? 2 : 配置.颜色索引,
			            堆叠数量: 配置.数量 || 1,
			            能否拾起:
			                配置.能否拾起 === undefined ? true : 配置.能否拾起,
			            数据: {
			                效果描述: "无法对炸弹怪物造成伤害",
			                倒计时: 配置.倒计时 || 2,
			                爆炸时间: 配置.爆炸时间 || 2,
			                爆炸范围: 配置.爆炸范围 || 3,
			                伤害: 配置.伤害 || 30,
			                来源: 配置.来源 || '玩家',
			            },
			        });
			    }
			    获取提示() {
			        return [
			            super.获取提示(),
			            `效果描述：${this.自定义数据.get("效果描述")}`,
			        ].join("\n");
			    }
			    使用(玩家使用 = true, x0 = 0, y0 = 0) {
			        if (当前天气效果.includes("严寒")) {
			            if (!玩家使用) {
			                this.能否拾起 = true;
			            }
			            显示通知("温度过低，炸弹打不着火了！", "警告");
			            return 0;
			        }
			        super.使用();
			        if (玩家使用) {
			            this.自定义数据.set(
			                "倒计时",
			                this.自定义数据.get("爆炸时间")
			            );
			            const { x, y, 新物品 } = 玩家放置物品(this, false);
			            if (x === null || y === null || 新物品 === null)
			                return false;
			            新物品.x = x;
			            新物品.y = y;
			            所有计时器.push(新物品);
			            return true;
			        }
			        this.x = x0;
			        this.y = y0;
			        所有计时器.push(this);
			        return true;
			    }
			    更新倒计时() {
			        const 剩余回合 = this.自定义数据.get("倒计时");
			
			        if (剩余回合 <= 0) {
			            this.触发爆炸();
			            所有计时器 = 所有计时器.filter((item) => item !== this);
			        }
			        this.自定义数据.set("倒计时", 剩余回合 - 1);
			    }
			
			    触发爆炸() {
			        if (this.能否拾起) return;
			        const 爆炸范围 = this.计算爆炸范围();
			        this.显示爆炸效果(爆炸范围);
			        this.处理爆炸效果(爆炸范围);
			    }
			
			    计算爆炸范围() {
			        const 可到达格子 = [];
			        const 队列 = [{ x: this.x, y: this.y, 距离: 0 }];
			        const 已访问 = new Set([`${this.x},${this.y}`]);
			
			        while (队列.length > 0) {
			            const 当前 = 队列.shift();
			            可到达格子.push(当前);
			
			            if (当前.距离 >= this.自定义数据.get("爆炸范围"))
			                continue;
			
			            const 方向 = [
			                { dx: 1, dy: 0 },
			                { dx: -1, dy: 0 },
			                { dx: 0, dy: 1 },
			                { dx: 0, dy: -1 },
			            ];
			
			            方向.forEach(({ dx, dy }) => {
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
			                        this.检查路径可行性(
			                            当前.x,
			                            当前.y,
			                            新X,
			                            新Y
			                        )
			                    ) {
			                        已访问.add(位置键);
			                        队列.push({
			                            x: 新X,
			                            y: 新Y,
			                            距离: 当前.距离 + 1,
			                        });
			                    }
			                }
			            });
			        }
			        return 可到达格子;
			    }
			
			    检查路径可行性(fromX, fromY, toX, toY) {
			        const 移动方向 = 获取移动方向(fromX, fromY, toX, toY);
			
			        const 当前单元格 = 地牢[fromY][fromX];
			        const 目标单元格 = 地牢[toY][toX];
			
			        if (
			            当前单元格.墙壁[移动方向.当前墙] ||
			            目标单元格.墙壁[移动方向.反方向墙]
			        ) {
			            return false;
			        }
			
			        return [
			            单元格类型.房间,
			            单元格类型.走廊,
			            单元格类型.门,
			            单元格类型.上锁的门,
			        ].includes(目标单元格.背景类型);
			    }
			
			    显示爆炸效果(爆炸范围) {
			        爆炸范围.sort((a, b) => a.距离 - b.距离);
			    待显示爆炸范围.push({
			        爆炸范围: 爆炸范围,
			        范围: this.自定义数据.get("爆炸范围"),
			    });
			    }
			
			    处理爆炸效果(爆炸范围) {
			        const 是否强化炸弹 = this.强化;
			
			        爆炸范围.forEach(({ x, y }) => {
			            const 当前单元格 = 地牢[y]?.[x];
			            if (!当前单元格) return;
			            if (当前单元格.关联物品 instanceof 符文圈) return;
			            if (当前单元格.关联物品 instanceof 挑战石碑) return;
			            if (当前单元格.关联物品 instanceof 魔法水晶) return;
			            if (当前单元格.关联物品 instanceof 传送门) return;
			            if (当前单元格.关联物品 instanceof 折跃门) return;
			            if (当前单元格.关联物品 instanceof 临时墙壁计时器) return;
			            if (当前单元格.关联物品 instanceof 告示牌) return;
			            if (当前单元格.关联物品 instanceof 存档点) return;
			            if (当前单元格.关联物品 instanceof 传送带) return;
			            if (当前单元格.关联物品 instanceof 开关脉冲器) return;
			            if (当前单元格.关联物品 instanceof 奖杯物品) return;
			            if (当前单元格.关联物品?.类型 === '开关砖') return;
			            
			            if (当前单元格.关联物品 instanceof 红蓝开关) {
			                当前单元格.关联物品.使用()
			                return;
			            }
			            if (当前单元格.关联物品 instanceof 绿紫开关) {
			                当前单元格.关联物品.使用()
			                return;
			            }
			
			            if (
			                当前单元格.关联物品 instanceof 祭坛类 &&
			                当前单元格.关联物品.自定义数据.get("激活条件") ===
			                    "爆炸冲击" &&
			                !当前单元格.关联物品.自定义数据.get("已激活")
			            ) {
			                当前单元格.关联物品.激活();
			            }
			
			            if (!是否强化炸弹 && 玩家.x === x && 玩家.y === y) {
			                伤害玩家(this.自定义数据?.get("伤害"), this.名称);
			                const 火焰强度玩家 = 5;
			                const 火焰持续玩家 = 4;
			                new 状态效果(
			                    "火焰",
			                    效果颜色编号映射[效果名称编号映射.火焰],
			                    图标映射.火焰,
			                    火焰持续玩家,
			                    null,
			                    null,
			                    null,
			                    火焰强度玩家
			                );
			                Array.from({ length: 装备栏每页装备数 }, (_, i) => 玩家装备.get(当前装备页 * 装备栏每页装备数 + i + 1)).filter(v => v != null).forEach(装备 => {
			                    if (装备.材质 === 材料.玻璃 && 装备.自定义数据?.has("耐久") && !装备.自定义数据.get("不可破坏")) {
			                        const 原耐久 = 装备.自定义数据.get("耐久");
			                        const 新耐久 = Math.floor(原耐久 / 2);
			                        装备.自定义数据.set("耐久", 新耐久);
			                         显示通知(`${装备.获取名称()} 因爆炸而破损！`, "警告");
			                         if (新耐久 === 0) {
			                            处理销毁物品(装备.唯一标识, true);
			                         }
			                    }
			                });
			                更新装备显示();
			            }
			            if (!是否强化炸弹) {
    当前出战宠物列表.forEach(pet => {
        if (pet && pet.是否已放置 && !pet.自定义数据.get("休眠中") && pet.x === x && pet.y === y && pet.层数==当前层数 ) {
            pet.受伤(this.自定义数据?.get("伤害"));
            添加日志(`${pet.名称} 被爆炸波及了！`, "警告");
        }
    });
}
			
			            if (当前单元格.关联怪物) {
			                if (
			                    当前单元格.关联怪物.类型 !== "炸弹怪物" &&
			                    当前单元格.关联怪物.类型 !== "大魔法师" &&
			                    当前单元格.关联怪物.类型 !== "米诺陶" &&
			                    !(当前单元格.关联怪物.类型 === "王座守护者" && 当前单元格.关联怪物.当前阶段 === 3)
			                ) {
			                    当前单元格.关联怪物.受伤(this.自定义数据?.get("伤害"), "炸弹");
			                    if (当前单元格.关联怪物) {
			                    const 火焰强度怪物 = 5;
			                    const 火焰持续怪物 = 4;
			                    new 状态效果(
			                        "火焰",
			                        效果颜色编号映射[效果名称编号映射.火焰],
			                        "火",
			                        火焰持续怪物,
			                        null,
			                        null,
			                        当前单元格.关联怪物,
			                        火焰强度怪物
			                    );
			                    添加日志(
			                        `${当前单元格.关联怪物?.类型} 被爆炸点燃了！`,
			                        "警告"
			                    );
			                    }
			                }
			            }
			
			            if (当前单元格.关联物品) {
			                if (
			                    当前单元格.关联物品 instanceof 罐子 &&
			                    !当前单元格.关联物品.自定义数据.get("已破碎")
			                ) {
			                    当前单元格.关联物品.破碎并释放内容();
			                } else if (
			                    !是否强化炸弹 &&
			                    !(当前单元格.关联物品 instanceof 罐子) &&
			                    !(当前单元格.关联物品 instanceof 祭坛类) &&
			                    !(当前单元格.关联物品.类型 === "楼梯")
			
			                ) {
			                    const 被毁物品 = 当前单元格.关联物品;
			                    const 计时器索引 = 所有计时器.findIndex(
			                        (t) => t.唯一标识 === 被毁物品.唯一标识
			                    );
			                    if (计时器索引 !== -1) {
			                        所有计时器.splice(计时器索引, 1);
			                    }
			                    if (当前单元格.关联物品 instanceof 炸弹 && 当前单元格.关联物品.唯一标识.toString()!==this.唯一标识.toString()) 当前单元格.关联物品.触发爆炸()
			                    添加日志(`${被毁物品.名称} 被炸毁了！`, "警告");
			                    当前单元格.关联物品 = null;
			                    当前单元格.类型 = null;
			                } else if (x === this.x && y === this.y) {
			                    const 被毁物品 = 当前单元格.关联物品;
			                    const 计时器索引 = 所有计时器.findIndex(
			                        (t) => t.唯一标识 === 被毁物品.唯一标识
			                    );
			                    if (计时器索引 !== -1) {
			                        所有计时器.splice(计时器索引, 1);
			                    }
			                    添加日志(`${被毁物品.名称} 被炸毁了！`, "警告");
			                    当前单元格.关联物品 = null;
			                    当前单元格.类型 = null;
			                }
			            }
			
			            if (当前单元格.背景类型 === 单元格类型.上锁的门) {
			                当前单元格.背景类型 = 单元格类型.门;
			            }
			        });
			
			
			
			        const 爆炸半径 = this.自定义数据.get("爆炸范围") ?? 3;
			        const 火焰数量 =
			            Math.floor(prng() * (爆炸半径 * 2)) + 1;
			        const 可放火焰格子 = 爆炸范围.filter(
			            ({ x, y, 距离 }) =>
			                距离 > 0 &&
			                地牢[y]?.[x] &&
			                !地牢[y][x].关联物品 &&
			                !地牢[y][x].关联怪物 &&
			                [
			                    单元格类型.房间,
			                    单元格类型.走廊,
			                    单元格类型.门,
			                ].includes(地牢[y][x].背景类型)
			        );
			
			        可放火焰格子.sort(() => prng() - 0.5);
			        const 实际放置火焰数 = Math.min(
			            火焰数量,
			            可放火焰格子.length
			        );
			
			        for (let i = 0; i < 实际放置火焰数; i++) {
			            const { x, y } = 可放火焰格子[i];
			            const 火焰 = new 火焰物品({ 强化: 是否强化炸弹 });
			            放置物品到单元格(火焰, x, y);
			        }
			        if (实际放置火焰数 > 0) {
			            添加日志(
			                `爆炸产生了 ${实际放置火焰数} 处火焰！`,
			                "信息"
			            );
			        }
			        绘制();
			    }
			}
			class 告示牌 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "告示牌",
			            图标: 图标映射.告示牌,
			            品质: 2,
			            颜色索引: 2,
			            能否拾起: false,
			            是否正常物品: false,
			            阻碍怪物: true,
			            效果描述: "一块可以写字的牌子。",
			            数据: {
			                内容: "这里写着一些文字...",
			                ...配置.数据,
			            },
			            ...配置,
			        });
			    }
			
			    尝试互动() {
			        const 内容 = this.自定义数据.get("内容");
			        const 提示窗口 = document.getElementById("教程提示窗口");
			        const 提示内容元素 = document.getElementById("教程提示内容");
			        const 关闭按钮 = 提示窗口.querySelector(".关闭按钮");
			
			        提示内容元素.innerHTML = 内容.replace(/\n/g, '<br>'); //此处可以XSS注入，那咋了？反正没人玩，连存档和apikey我都明文存了还怂这个？
			        
			        关闭按钮.textContent = "关闭";
			        关闭按钮.onclick = 关闭教程提示;
			        提示窗口.style.display = "block";
			    
			        
			        玩家属性.允许移动++;
			        
			        return true;
			    }
			}
			
			class 临时墙壁计时器 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "不稳定的墙体",
			            图标: "🧱",
			            能否拾起: false,
			            是否正常物品: false,
			            是否为隐藏物品: true,
			            阻碍怪物: true,
			            数据: {
			                倒计时: 25,
			                爆炸时间: 25,
			                原背景类型: 配置.原背景类型 ?? 单元格类型.走廊,
			                
			            },
			            
			        });
			    }
			
			    更新倒计时() {
			        const 剩余回合 = this.自定义数据.get("倒计时") - 1;
			        this.自定义数据.set("倒计时", 剩余回合);
			        if (剩余回合 <= 0) {
			            this.恢复墙壁();
			        }
			    }
			
			    恢复墙壁() {
			        const 单元格 = 地牢[this.y]?.[this.x];
			        if (单元格) {
			            单元格.背景类型 = this.自定义数据.get("原背景类型");
			            单元格.关联物品 = null;
			            单元格.类型 = null;
			            生成墙壁();
			            
			        }
			        所有计时器 = 所有计时器.filter(t => t.唯一标识 !== this.唯一标识);
			    }
			}
			
			// 基类：界面元素
			class 界面元素基类 {
			    constructor() {
			        this.元素标识 = `元素_${Date.now()}_${prng()
			            .toString(36)
			            .substr(2, 9)}`;
			        this.容器元素 = document.createElement("div");
			        this.容器元素.className = "hud-item";
			        this.容器元素.dataset.元素标识 = this.元素标识;
			        document.querySelector(".hud").appendChild(this.容器元素);
			    }
			
			    销毁() {
			        this.容器元素.remove();
			        this.容器元素 = null;
			    }
			
			    更新(参数) {
			        throw new Error("必须实现更新方法");
			    }
			}
			
			// 文本行元素
			class 文本元素 extends 界面元素基类 {
			    constructor(配置) {
			        super();
			        this.图标元素 = null;
			        this.文本元素 = null;
			        this.初始化(配置);
			    }
			
			    初始化({ 图标, 内容 }) {
			        const 行容器 = document.createElement("div");
			        行容器.className = "界面文本行";
			
			        if (图标) {
			            this.图标元素 = document.createElement("span");
			            this.图标元素.className = "hud-icon";
			            this.图标元素.textContent = 图标;
			            行容器.appendChild(this.图标元素);
			        }
			
			        this.文本元素 = document.createElement("span");
			        this.文本元素.className = "hud-label";
			        this.文本元素.textContent = 内容;
			        行容器.appendChild(this.文本元素);
			
			        this.容器元素.appendChild(行容器);
			        触发HUD显示();
			    }
			
			    更新({ 内容, 图标 }) {
			        if (this.文本元素.textContent == 内容) return;
			        if (内容) this.文本元素.textContent = 内容;
			        if (图标) this.图标元素.textContent = 图标;
			        触发HUD显示();
			    }
			}
			
			// 进度条元素
			class 进度条元素 extends 界面元素基类 {
			    constructor(配置) {
			        super();
			        this.进度条元素 = null;
			        this.标签元素 = null;
			        this.初始化(配置);
			    }
			
			    初始化({ 图标, 颜色, 初始值, 标签 }) {
			        this.容器元素.innerHTML = `
			                                                            <span class="hud-icon">${
			                                                                图标 ||
			                                                                "⚡"
			                                                            }</span>
			                                                            <div class="hud-bar-container">
			                                                                <div class="hud-bar" style="width: ${
			                                                                    初始值 ||
			                                                                    100
			                                                                }%">
			                                                                    <div class="进度条标签">${
			                                                                        标签 ||
			                                                                        ""
			                                                                    }</div>
			                                                                </div>
			                                                            </div>
			                                                        `;
			
			        this.进度条元素 = this.容器元素.querySelector(".hud-bar");
			        this.标签元素 =
			            this.进度条元素.querySelector(".进度条标签");
			
			        if (颜色) {
			            this.进度条元素.style.background = 颜色;
			        }
			        触发HUD显示();
			    }
			
			    更新({ 数值, 标签, 颜色 }) {
			        if (
			            this.标签元素.textContent == 标签 &&
			            this.进度条元素.style.width == `${数值}%`
			        )
			            return;
			        if (数值 !== undefined) {
			            this.进度条元素.style.width = `${数值}%`;
			
			            // 自动添加低数值警告
			            if (数值 <= 20) {
			                this.进度条元素.classList.add("低数值警告");
			            } else {
			                this.进度条元素.classList.remove("低数值警告");
			            }
			        }
			
			        // 动态调整标签位置
			        if (标签) {
			            this.标签元素.textContent = 标签;
			        }
			
			        if (颜色) {
			            this.进度条元素.style.background = 颜色;
			        }
			        触发HUD显示();
			    }
			}
			
			// 使用示例：
			//const 药水条 = new 进度条元素({
			//图标: '🧪',
			//颜色: 'linear-gradient(to right, #00ff88, #00ccff)',
			//初始值: 80,
			//标签: '强化药水 80%'
			//});
			
			//const 任务提示 = new 文本元素({
			//    图标: '📜',
			//    内容: '主线任务：寻找古代遗物'
			//});
			
			// 更新元素示例
			//药水条.更新({ 数值: 15, 标签: '药水剩余 15%' });
			//任务提示.更新({ 内容: '紧急任务：击败守护者' });
			
			const 怪物追踪提示 = new 文本元素({
			    内容: `追踪怪物：0`,
			});
			const 击杀提示 = new 文本元素({
			    内容: `已击杀怪物：${已击杀怪物数}`,
			});
			
			// 单元格类
			class 单元格 {
			    constructor(x, y) {
			        this.x = x;
			        this.y = y;
			        this.类型 = 单元格类型.墙壁;
			        this.墙壁 = { 上: false, 右: false, 下: false, 左: false };
			        this.钥匙ID = null;
			        this.颜色索引 = 颜色表.length;
			        this.关联物品 = null;
			        this.关联怪物 = null;
			        this.背景类型 = 单元格类型.墙壁;
			        this.isOneWay = false;
			        this.oneWayAllowedDirection = null;
			        this.doorOrientation = null;
			        this.是否强制墙壁 = false;
			        this.阻碍视野 = false;
			    }
			
			绘制() {
			        const 屏幕X = (this.x - 当前相机X) * 单元格大小;
			        const 屏幕Y = (this.y - 当前相机Y) * 单元格大小;
			        const 房间ID = 房间地图[this.y][this.x];
			        
			        const 房间实例 = 房间列表.find(t=>t.id==房间ID);
			        const 游戏时未探索 = 游戏状态 !== '地图编辑器'  && 房间ID !== -1 && !已访问房间.has(房间ID) && !玩家属性.透视;
			        const 编辑器时未探索 = 游戏状态 === '编辑器游玩' && 房间实例 && !房间实例.已探索;
			        
			        if (地牢生成方式 === 'cave' && !已揭示洞穴格子.has(`${this.x},${this.y}`) && 游戏状态 !== '地图编辑器' && !玩家属性.透视) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(屏幕X, 屏幕Y, 单元格大小, 单元格大小);
        return;
    }
			
			        if (
			            当前天气效果.includes("深夜") ||
			            房间列表.find(t=>t.id==房间ID)?.类型 === "黑暗房间" ||
			            玩家状态.some(s => s.类型 === '失明')
			        ) {
			            if (!是否在光源范围内(this.x, this.y) && 游戏状态 !== "地图编辑器") {
			                ctx.fillStyle = "#000000";
			                ctx.fillRect(屏幕X, 屏幕Y, 单元格大小, 单元格大小);
			                return;
			            }
			        }
			        if (
			            (游戏时未探索) &&
			            !(游戏状态 === "图鉴")
			        ) {
			            ctx.fillStyle = "rgba(0, 0, 0)";
			            ctx.fillRect(屏幕X, 屏幕Y, 单元格大小, 单元格大小);
			        } else {
                        let 背景颜色;
			            switch (this.背景类型) {
			                case 单元格类型.房间: 背景颜色 = "#3a506b"; break;
			                case 单元格类型.走廊: 背景颜色 = "#2b2d42"; break;
			                case 单元格类型.门: 背景颜色 = "#8b4513"; break;
			                case 单元格类型.上锁的门: 背景颜色 = 颜色表[this.颜色索引]; break;
			                case 单元格类型.楼梯下楼:
			                case 单元格类型.楼梯上楼:
			                    ctx.fillStyle = "#3a506b";
			                    ctx.fillRect(屏幕X, 屏幕Y, 单元格大小, 单元格大小);
			                    this.绘制物品(屏幕X, 屏幕Y);
			                    return;
			                default: 背景颜色 = "#1a1a1a";
			            }
                        ctx.fillStyle = 背景颜色;
                        ctx.fillRect(屏幕X, 屏幕Y, 单元格大小, 单元格大小);

                        ctx.strokeStyle = this.背景类型 === 单元格类型.上锁的门 ? "#ffd700" : "#e0e0e0";
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        
                        if (this.墙壁.上) {
                            if (this.背景类型 === 单元格类型.门 || this.背景类型 === 单元格类型.上锁的门) {
                                ctx.moveTo(屏幕X + 单元格大小 / 3, 屏幕Y);
                                ctx.lineTo(屏幕X + (单元格大小 * 2) / 3, 屏幕Y);
                            } else {
                                ctx.moveTo(屏幕X, 屏幕Y);
                                ctx.lineTo(屏幕X + 单元格大小, 屏幕Y);
                            }
                        }
                        if (this.墙壁.右) { ctx.moveTo(屏幕X + 单元格大小, 屏幕Y); ctx.lineTo(屏幕X + 单元格大小, 屏幕Y + 单元格大小); }
                        if (this.墙壁.下) { ctx.moveTo(屏幕X + 单元格大小, 屏幕Y + 单元格大小); ctx.lineTo(屏幕X, 屏幕Y + 单元格大小); }
                        if (this.墙壁.左) { ctx.moveTo(屏幕X, 屏幕Y + 单元格大小); ctx.lineTo(屏幕X, 屏幕Y); }
                        ctx.stroke();

			            if (this.isOneWay && this.oneWayAllowedDirection && [单元格类型.门, 单元格类型.上锁的门].includes(this.背景类型)) {
                            ctx.save();
			                ctx.font = `${单元格大小 * 0.7}px Arial`;
			                ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
			                ctx.textAlign = "center";
			                ctx.textBaseline = "middle";
			                let arrow = "";
			
			                if (this.oneWayAllowedDirection === "N") arrow = "↑";
			                else if (this.oneWayAllowedDirection === "S") arrow = "↓";
			                else if (this.oneWayAllowedDirection === "E") arrow = "→";
			                else if (this.oneWayAllowedDirection === "W") arrow = "←";
			
			                const arrowX = 屏幕X + 单元格大小 / 2;
			                const arrowY = 屏幕Y + 单元格大小 / 2;
			
			                ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
			                ctx.shadowBlur = 3;
			                ctx.shadowOffsetX = 1;
			                ctx.shadowOffsetY = 1;
			                ctx.fillText(arrow, arrowX, arrowY);
                            ctx.restore();
			            }
			            if (this.关联物品) {
			                this.绘制物品(屏幕X, 屏幕Y);
			            }
			        }
			    }
			绘制物品(屏幕X, 屏幕Y) {
			        if (!this.关联物品) return;
                    if (this.关联物品.是否为隐藏物品 && !(玩家属性.透视 || 游戏状态 === '地图编辑器')) {
                        return;
                    }

                    const isRevealedTrap = (this.关联物品 instanceof 陷阱基类 || this.关联物品 instanceof 隐形毒气陷阱) && this.关联物品.是否为隐藏物品 && (玩家属性.透视 || 游戏状态 === '地图编辑器');

                    ctx.save();

                    if (isRevealedTrap) {
                        ctx.globalAlpha = 0.55
                        
                    }

                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    const iconToDraw = isRevealedTrap ? this.关联物品.自定义数据.get('激活后图标') : this.关联物品.显示图标;
                    const iconSize = 单元格大小 * 0.8;
                    const iconColor = this.获取物品颜色();
                    
                    ctx.font = `${iconSize}px color-emoji`;
                    ctx.fillStyle = iconColor;
                    
                    if (this.颜色索引 < 颜色表.length || (this.关联物品 instanceof 火把 && this.关联物品.自定义数据.get("耐久") > 0)) {
                        if (this.关联物品 instanceof 火把) {
                            const 闪烁强度 = Math.abs(Math.sin(Date.now() / 200));
                            ctx.shadowColor = `rgba(255, 165, 0, ${0.5 + 闪烁强度 * 0.4})`;
                            ctx.shadowBlur = 8 + 闪烁强度 * 5;
                        } else {
                            ctx.shadowColor = iconColor;
                            ctx.shadowBlur = 15;
                        }
                    }
                    
                    ctx.fillText(iconToDraw, 屏幕X + 单元格大小 / 2, 屏幕Y + 单元格大小 / 2);
                    
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;

                    const smallTextSize = 单元格大小 * 0.4;
                    ctx.font = `${smallTextSize}px Arial`;
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "#000000";
                    ctx.fillStyle = "#FFFFFF";
                    

                    if (this.关联物品.堆叠数量 > 1) {
                        ctx.textAlign = "right";
                        ctx.textBaseline = "bottom";
                        const text = this.关联物品.堆叠数量;
                        const textX = 屏幕X + 单元格大小 - 4;
                        const textY = 屏幕Y + 单元格大小 - 4;
                        ctx.strokeText(text, textX, textY);
                        ctx.fillText(text, textX, textY);
                    }

                    if ((this.关联物品 instanceof 红蓝开关 || this.关联物品 instanceof 绿紫开关) && this.关联物品.自定义数据.get('耐久') > 0) {
                        ctx.textAlign = "right";
                        ctx.textBaseline = "bottom";
                        const text = this.关联物品.自定义数据.get('耐久');
                        const textX = 屏幕X + 单元格大小 - 2;
                        const textY = 屏幕Y + 单元格大小 - 2;
                        ctx.strokeText(text, textX, textY);
                        ctx.fillText(text, textX, textY);
                    }

                    if (this.关联物品.是否被丢弃) {
                        ctx.fillStyle = "#AAAAAA";
                        ctx.textAlign = "right";
                        ctx.textBaseline = "top";
                        ctx.fillText("丢", 屏幕X + 单元格大小 - 3, 屏幕Y + 3);
                    }
                    if (this.关联物品 instanceof 隐形毒气陷阱 && isRevealedTrap) {
                    ctx.textAlign = "right";
                        ctx.textBaseline = "top";
                        ctx.lineWidth = 2;
                    ctx.strokeStyle = "#000000";
                    ctx.fillStyle = "#FFFFFF";
                    ctx.strokeText(this.关联物品.自定义数据.get('关联陷阱ID')?.toString().slice(-3), 屏幕X + 单元格大小 - 3, 屏幕Y + 3);
                        ctx.fillText(this.关联物品.自定义数据.get('关联陷阱ID')?.toString().slice(-3), 屏幕X + 单元格大小 - 3, 屏幕Y + 3);
                        }
                    ctx.restore();

                    if ((this.关联物品 instanceof 火把 || this.关联物品 instanceof 护卫植物 || this.关联物品 instanceof 远射植物) && this.关联物品.自定义数据.has("耐久")) {
                        const 耐久百分比 = this.关联物品.自定义数据.get("耐久") / this.关联物品.自定义数据.get("原耐久");
                        ctx.fillStyle = "rgba(0,0,0,0.6)";
                        ctx.fillRect(屏幕X + 单元格大小 * 0.1, 屏幕Y + 单元格大小 * 0.85, 单元格大小 * 0.8, 单元格大小 * 0.1);
                        ctx.fillStyle = 耐久百分比 > 0.5 ? "#4CAF50" : 耐久百分比 > 0.2 ? "#FFC107" : "#F44336";
                        ctx.fillRect(屏幕X + 单元格大小 * 0.1, 屏幕Y + 单元格大小 * 0.85, 单元格大小 * 0.8 * 耐久百分比, 单元格大小 * 0.1);
                    }
			    }
			
			
			    获取物品颜色() {
			        // 根据物品类型返回颜色
			        if (
			            this.类型 === 单元格类型.楼梯下楼 ||
			            this.类型 === 单元格类型.楼梯上楼
			        )
			            return "#000";
			        return this.关联物品
			            ? this.关联物品.颜色表[this.关联物品.颜色索引] ||
			                  "#FFFFFF"
			            : "#FFFFFF";
			    }
			}
			
			function drawPath(path) {
			    if (path.length < 2) return;
			
			    ctx.save();
			    ctx.beginPath();
			
			    // 设置线条样式
			    ctx.strokeStyle = "rgba(255, 50, 50, 0.5)";
			    ctx.lineWidth = 2 * window.devicePixelRatio; // 适应高清屏
			    ctx.setLineDash([5, 15]);
			    ctx.lineJoin = "round";
			    ctx.lineCap = "round";
			
			    const startX = (玩家.x - 当前相机X + 0.5) * 单元格大小;
			    const startY = (玩家.y - 当前相机Y + 0.5) * 单元格大小;
			    ctx.moveTo(startX, startY);
			
			    // 连接后续点
			    for (let i = 1; i < path.length; i++) {
			        const { x, y } = path[i];
			        const pointX = (x - 当前相机X + 0.5) * 单元格大小;
			        const pointY = (y - 当前相机Y + 0.5) * 单元格大小;
			        ctx.lineTo(pointX, pointY);
			    }
			
			    ctx.stroke();
			    ctx.restore();
			}
			物品池 = 创建物品池();
			怪物池 = 创建怪物池();
			
			// 屏幕方向检测
			let resizeTimer;
			function handleResize() {
			    clearTimeout(resizeTimer);
			    resizeTimer = setTimeout(() => {
			        初始化canvas();
			        更新物体指示器();
			        绘制();
			    }, 200);
			}
			
			window.addEventListener("resize", handleResize);
			handleResize();
			
			function 开始移动() {
			    控制键处理移动(true);
			}
			
			function 控制键处理移动(PC = false) {
			    clearTimeout(移动定时器);
			    clearTimeout(单击移动定时器); // 清除之前的 单击移动定时器
			
			    const 立即移动 = () => {
			        const dx = 移动状态.left
			            ? -玩家属性.移动步数
			            : 移动状态.right
			            ? 玩家属性.移动步数
			            : 0;
			        const dy = 移动状态.up
			            ? -玩家属性.移动步数
			            : 移动状态.down
			            ? 玩家属性.移动步数
			            : 0;
			
			        if (dx !== 0 || dy !== 0) {
			            移动玩家(dx, dy);
			        }
			    };
			
			    const 持续移动 = () => {
			        if (
			            !移动状态.left &&
			            !移动状态.right &&
			            !移动状态.up &&
			            !移动状态.down
			        )
			            return;
			
			        const now = Date.now();
			        if (now - 最后移动时间 >= 移动间隔) {
			            长按移动 = true;
			            立即移动();
			            最后移动时间 = now;
			        }
			        移动定时器 = requestAnimationFrame(持续移动);
			    };
			
			    立即移动();
			    if (PC) {
			        长按移动 = true;
			        最后移动时间 = Date.now();
			        移动定时器 = setTimeout(() => {
			            cancelAnimationFrame(移动定时器);
			            移动定时器 = requestAnimationFrame(持续移动);
			        }, 0);
			    } else {
			        最后移动时间 = Date.now();
			
			        // 如果是长按，则在 首次移动延迟 后开始持续移动
			        移动定时器 = setTimeout(() => {
			            cancelAnimationFrame(移动定时器);
			            移动定时器 = requestAnimationFrame(持续移动);
			        }, 首次移动延迟);
			    }
			}
			function 停止移动() {
			    clearTimeout(移动定时器);
			    clearTimeout(单击移动定时器);
			    clearTimeout(开始移动定时器);
			    移动状态 = {
			        up: false,
			        down: false,
			        left: false,
			        right: false,
			    };
			    长按移动 = false;
			}
			function 显示HUD() {
			    if (hud模式 === "常隐") return;
			    if (hud模式 === "默认") {
			        if (显示HUD计时器) clearTimeout(显示HUD计时器);
			        document.querySelector(".hud").classList.add("可见");
			        显示HUD计时器 = setTimeout(() => {
			            隐藏HUD();
			        }, 700);
			    } else {
			        document.querySelector(".hud").classList.add("可见");
			    }
			}
			
			function 隐藏HUD() {
			    if (hud模式 !== "默认") return;
			    document.querySelector(".hud").classList.remove("可见");
			}
			
			function 切换HUD模式() {
			    const 模式顺序 = ["默认", "常显", "常隐"];
			    const 当前索引 = 模式顺序.indexOf(hud模式);
			    hud模式 = 模式顺序[(当前索引 + 1) % 3];
			
			    // 更新按钮图标
			    const 按钮图标映射 = {
			        默认: 图标映射.HUD智能,
			        常显: 图标映射.HUD常显,
			        常隐: 图标映射.HUD常隐,
			    };
			    document.getElementById("hudToggle").textContent =
			        按钮图标映射[hud模式];
			
			    // 立即应用新模式
			    if (hud模式 === "常显") {
			        document.querySelector(".hud").classList.add("可见");
			    } else if (hud模式 === "常隐") {
			        document.querySelector(".hud").classList.remove("可见");
			    } else {
			        隐藏HUD(); // 恢复默认模式隐藏
			    }
			}
			function 触发HUD显示() {
			    if (hud模式 === "默认") {
			        if (显示HUD计时器) clearTimeout(显示HUD计时器);
			        document.querySelector(".hud").classList.add("可见");
			        显示HUD计时器 = setTimeout(() => {
			            隐藏HUD();
			        }, 700);
			    }
			}
			
			// 防止长按触发文字选择
			document.addEventListener("contextmenu", (e) => e.preventDefault());
			
			const 添加控制事件 = (元素, 方向) => {
			    const 事件类型 = {
			        start:
			            "ontouchstart" in window ? "touchstart" : "mousedown",
			        end: "ontouchend" in window ? "touchend" : "mouseup",
			    };
			
			    元素.addEventListener(事件类型.start, (e) => {
			        e.preventDefault();
			        移动状态[方向] = true;
			        控制键处理移动();
			    });
			
			    元素.addEventListener(事件类型.end, () => {
			        移动状态[方向] = false;
			        停止移动();
			    });
			};
			
			添加控制事件(upBtn, "up");
			添加控制事件(leftBtn, "left");
			添加控制事件(rightBtn, "right");
			添加控制事件(downBtn, "down");
			function 深度比较(a, b) {
			    if (a === b) return true;
			    if (
			        typeof a !== "object" ||
			        typeof b !== "object" ||
			        a === null ||
			        b === null
			    )
			        return false;
			
			    const aKeys = Object.keys(a);
			    const bKeys = Object.keys(b);
			    if (aKeys.length !== bKeys.length) return false;
			
			    for (const key of aKeys) {
			        if (!b.hasOwnProperty(key)) return false;
			        if (!深度比较(a[key], b[key])) return false;
			    }
			    return true;
			}
			
			// 更新HUD显示
			function 更新界面状态() {
			    document.getElementById("roomCount").textContent =
			        已访问房间.size;
			}
			
			function 初始化canvas() {
			    画布宽度 = Math.min(
			        window.innerWidth - 20,
			        window.innerHeight - 100
			    ); // 动态宽度
			    画布高度 = 画布宽度; // 动态高度
			
			    // 保持单元格比例
			    const 单元格宽 = 画布宽度 / 相机显示边长;
			    const 单元格高 = 画布高度 / 相机显示边长;
			
			    单元格大小 = Math.min(单元格宽, 单元格高);
			    ctx.imageSmoothingEnabled = false;
			    ctx.webkitImageSmoothingEnabled = false;
			    const dpr = window.devicePixelRatio;
			    const width = 单元格大小 * 相机显示边长,
			        height = 单元格大小 * 相机显示边长;
			    
			    canvas.width = Math.round(width * dpr);
			    canvas.height = Math.round(height * dpr);
			    canvas.style.width = width + "px";
			    canvas.style.height = height + "px";
			    
			    ctx.scale(dpr, dpr);
			    
			    const 小地图 = document.getElementById("小地图");
			    小地图.width = 地牢大小 * 小地图缩放;
			    小地图.height = 地牢大小 * 小地图缩放;
			    小地图Ctx = 小地图.getContext("2d");
			}
			function 回溯路径(终点X, 终点Y, 距离图) {
			    const 路径 = [];
			    let 当前X = 终点X;
			    let 当前Y = 终点Y;
			    const 终点距离 = 距离图[当前Y][当前X];
			
			    if (终点距离 === Infinity) return []; 
			
			    路径.push({ x: 当前X, y: 当前Y });
			
			    while (距离图[当前Y][当前X] > 0) {
			        const 方向 = [{dx: 0, dy: -1}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 1, dy: 0}];
			        let 找到上一步 = false;
			        for (const {dx, dy} of 方向) {
			            const 上一步X = 当前X + dx;
			            const 上一步Y = 当前Y + dy;
			            if (上一步X >= 0 && 上一步X < 地牢大小 && 上一步Y >= 0 && 上一步Y < 地牢大小) {
			                if (距离图[上一步Y][上一步X] === 距离图[当前Y][当前X] - 1) {
			                    当前X = 上一步X;
			                    当前Y = 上一步Y;
			                    路径.push({ x: 当前X, y: 当前Y });
			                    找到上一步 = true;
			                    break;
			                }
			            }
			        }
			        if (!找到上一步) break; 
			    }
			    return 路径.reverse(); 
			}
			
			function 生成红蓝开关谜题(距离图) {
			    let 最远距离 = -1;
			    let 最远房间 = null;
			    const 可用房间 = 房间列表.filter(房间 => 房间 && 房间.id !== 0 && 房间.类型 === "房间");
			
			    可用房间.forEach(房间 => {
			        const 中心X = 房间.x + Math.floor(房间.w / 2);
			        const 中心Y = 房间.y + Math.floor(房间.h / 2);
			        const 距离 = 距离图[中心Y]?.[中心X];
			        if (距离 !== undefined && 距离 !== Infinity && 距离 > 最远距离) {
			            最远距离 = 距离;
			            最远房间 = 房间;
			        }
			    });
			
			    if (!最远房间) return;
			
			    
			    
			    const 终点中心X = 最远房间.x + Math.floor(最远房间.w / 2);
			    const 终点中心Y = 最远房间.y + Math.floor(最远房间.h / 2);
			    const 关键路径 = 回溯路径(终点中心X, 终点中心Y, 距离图);
			
			    if (关键路径.length < 20) return; 
			
			    
			    
			    const 路径起点索引 = Math.floor(关键路径.length * 0.3);
			    const 路径终点索引 = Math.floor(关键路径.length * 0.7);
			    const 候选障碍物位置 = [];
			
			    for (let i = 路径起点索引; i < 路径终点索引; i++) {
			        const 位置 = 关键路径[i];
			        if (地牢[位置.y][位置.x].背景类型 === 单元格类型.走廊) {
			            候选障碍物位置.push({位置: 位置, 索引: i});
			        }
			    }
			    
			    候选障碍物位置.sort(() => prng() - 0.5);
			    
			    let 最终障碍物位置 = null;
			    let 最终开关房间 = null;
			
			    for(const 候选 of 候选障碍物位置) {
			        const 障碍物距离 = 距离图[候选.位置.y][候选.位置.x];
			        const 关键路径房间ID = new Set(关键路径.map(p => 房间地图[p.y][p.x]));
			
			        const 开关候选房间 = 房间列表.filter(房间 => {
			            if (!房间 || 房间.类型 !== "房间" || 关键路径房间ID.has(房间.id)) return false;
			            
                    const 房间中心距离 = 距离图[房间.y + Math.floor(房间.h / 2)][房间.x + Math.floor(房间.w / 2)];
			        return 房间中心距离 < 障碍物距离; // 找到了！
			        });
			
			        if (开关候选房间.length > 0) {
			            最终障碍物位置 = 候选;
			            最终开关房间 = 开关候选房间[Math.floor(prng() * 开关候选房间.length)];
			            break;
			        }
			    }
			
			    if (!最终障碍物位置 || !最终开关房间) return; 
			
			    
			    
			    const 开关实例 = new 红蓝开关({});
			    const targetRoom = 最终开关房间;
        for (let y = targetRoom.y; y < targetRoom.y + targetRoom.h; y++) {
            for (let x = targetRoom.x; x < targetRoom.x + targetRoom.w; x++) {
                const cell = 地牢[y]?.[x];
                if (cell && cell.关联物品 instanceof 红蓝开关) {
                    最终开关房间=null;
                }
            }
        }
                if(最终开关房间) 放置物品到房间(开关实例, 最终开关房间);
			    添加日志(`已在房间 ${最终开关房间?.id} 生成红蓝开关`);
			    let isVertical = true; 
			    const prevNode = 关键路径[最终障碍物位置.索引 - 1];
			    const nextNode = 关键路径[最终障碍物位置.索引 + 1];
			    if (prevNode && nextNode && prevNode.y === nextNode.y) {
			        isVertical = false; 
			    }
			    
			    const 障碍物中心 = 最终障碍物位置.位置;
			    const 待填充格子 = [障碍物中心]; 
			    const 砖块类型 = prng() > 0.5 ? 蓝砖块 : 红砖块;
			
			    
			    if (isVertical) {
			        
			        for (let dx = -1; dx <= 1; dx += 2) { 
			            for (let i = 1; i < 100; i++) { 
			                const scanX = 障碍物中心.x + i * dx;
			                const scanY = 障碍物中心.y;
			                const cell = 地牢[scanY]?.[scanX];
			                if (cell && cell.背景类型 === 单元格类型.走廊) {
			                    待填充格子.push({ x: scanX, y: scanY });
			                } else {
			                    break; 
			                }
			            }
			        }
			    } else {
			        
			        for (let dy = -1; dy <= 1; dy += 2) { 
			            for (let i = 1; i < 100; i++) {
			                const scanX = 障碍物中心.x;
			                const scanY = 障碍物中心.y + i * dy;
			                const cell = 地牢[scanY]?.[scanX];
			                if (cell && cell.背景类型 === 单元格类型.走廊) {
			                    待填充格子.push({ x: scanX, y: scanY });
			                } else {
			                    break;
			                }
			            }
			        }
			    }
			
			    
			    let 放置的砖块数 = 0;
			    待填充格子.forEach(格子坐标 => {
			        if (放置物品到单元格(new 砖块类型({}), 格子坐标.x, 格子坐标.y)) {
			            放置的砖块数++;
			        }
			    });
			
			    if (放置的砖块数 > 0) {
			        添加日志(`已在关键路径上生成了由 ${放置的砖块数} 块砖块构成的障碍墙`);
			    }
			    
			}
			function 生成地牢() {
			    if (地牢生成方式 === 'cave') return 生成洞穴地牢()
			    if (地牢生成方式 === 'maze') return 生成迷宫地牢()
			    地牢大小 = 100 + 当前层数*2
			    地牢 = Array(地牢大小)
			        .fill()
			        .map((_, y) =>
			            Array(地牢大小)
			                .fill()
			                .map((_, x) => new 单元格(x, y))
			        );
			    房间地图 = Array(地牢大小)
			    .fill()
			    .map(() => Array(地牢大小).fill(-1));
			    let 已连接房间对 = new Set();
			
			    let 房间宽度 =
			        房间尺寸范围[0] +
			        2 *
			            Math.floor(
			                (prng() *
			                    (房间尺寸范围[1] - 房间尺寸范围[0])) /
			                    2
			            );
			    let 房间高度 =
			        房间尺寸范围[0] +
			        2 *
			            Math.floor(
			                (prng() *
			                    (房间尺寸范围[1] - 房间尺寸范围[0])) /
			                    2
			            );
			    let 房间起始X = Math.floor(地牢大小 / 2 - 房间宽度 / 2);
			    let 房间起始Y = Math.floor(地牢大小 / 2 - 房间高度 / 2);
			    房间列表.push({
			        x: 房间起始X,
			        y: 房间起始Y,
			        w: 房间宽度,
			        h: 房间高度,
			        id: 0,
			        名称: `房间_0`,
			        门: [],
			    });
			    放置房间(房间列表[0]);
			    let 回溯 = false;
			    for (let i = 1; i < 最大房间数+当前层数; i++) {
			        let 放置成功 = false;
			        let 尝试次数 = 0;
			
			        while (!放置成功 && 尝试次数 < 300) {
			            尝试次数++;
			            let 上一个房间 = 房间列表[i - 1];
			            if (回溯)
			                上一个房间 =
			                    房间列表[
			                        i -
			                            Math.floor(
			                                (Math.max(0, 尝试次数 - 10) / 40) *
			                                    (房间列表.length - 2)
			                            ) -
			                            1
			                    ];
			            房间宽度 =
			                房间尺寸范围[0] +
			                2 *
			                    Math.floor(
			                        (prng() *
			                            (房间尺寸范围[1] - 房间尺寸范围[0])) /
			                            2
			                    );
			            房间高度 =
			                房间尺寸范围[0] +
			                2 *
			                    Math.floor(
			                        (prng() *
			                            (房间尺寸范围[1] - 房间尺寸范围[0])) /
			                            2
			                    );
			
			            const 方向 = Math.floor(prng() * 4);
			
			            const 扩展距离 =
			                Math.floor(
			                    prng() * Math.max(0, 尝试次数 - 10)
			                ) +
			                房间尺寸范围[1] +
			                2;
			
			            switch (方向) {
			                case 0:
			                    房间起始X =
			                        上一个房间.x +
			                        Math.floor((上一个房间.w - 房间宽度) / 2);
			                    房间起始Y = 上一个房间.y - 房间高度 - 扩展距离;
			                    break;
			                case 1:
			                    房间起始X =
			                        上一个房间.x + 上一个房间.w + 扩展距离;
			                    房间起始Y =
			                        上一个房间.y +
			                        Math.floor((上一个房间.h - 房间高度) / 2);
			                    break;
			                case 2:
			                    房间起始X =
			                        上一个房间.x +
			                        Math.floor((上一个房间.w - 房间宽度) / 2);
			                    房间起始Y =
			                        上一个房间.y + 上一个房间.h + 扩展距离;
			                    break;
			                case 3:
			                    房间起始X = 上一个房间.x - 房间宽度 - 扩展距离;
			                    房间起始Y =
			                        上一个房间.y +
			                        Math.floor((上一个房间.h - 房间高度) / 2);
			                    break;
			            }
			
			            房间起始X = Math.max(
			                5,
			                Math.min(房间起始X, 地牢大小 - 房间宽度 - 5)
			            );
			            房间起始Y = Math.max(
			                5,
			                Math.min(房间起始Y, 地牢大小 - 房间高度 - 5)
			            );
			
			            if (
			                区域是否空闲(
			                    房间起始X,
			                    房间起始Y,
			                    房间宽度,
			                    房间高度
			                )
			            ) {
			                let 房间类型 = "房间";
			                if (房间列表.length > 2 && prng() < 0.12) {
			                    房间类型 = "挑战房间";
			                } else if (
			                    房间列表.length > 2 &&
			                    prng() < 0.15
			                ) {
			                    房间类型 = "单向房间";
			                } else if (
			                    房间列表.length > 2 &&
			                    prng() < 0.1
			                ) {
			                    房间类型 = "黑暗房间";
			                }
			
			                const 新房间 = {
			                    x: 房间起始X,
			                    y: 房间起始Y,
			                    w: 房间宽度,
			                    h: 房间高度,
			                    id: i,
			                    名称: `房间_${i}`,
			                    门: [],
			                    类型: 房间类型,
			                    已连接: true, //兼容 尝试进入特殊房间 函数
			                };
			                if (房间类型 === "挑战房间") {
			                    新房间.挑战状态 = {
			                        进行中: false,
			                        已完成: false,
			                        当前波次: 0,
			                        总波次: 4 + Math.round(prng()*Math.floor(当前层数 / 2)) + (玩家属性.挑战波数增加 || 0),
			                        波次最大回合数: 30 + 当前层数 * 3,
			                        波次当前回合数: 0,
			                        波次内怪物: [],
			                        原始门数据: [],
			                        挑战怪物层级: 当前层数,
			                        
			                    };
			                }
			                房间列表.push(新房间);
			                放置房间(新房间);
			                const 房间对ID = [房间列表[i - 1].id, 新房间.id]
			                    .sort()
			                    .join("-");
			                if (!已连接房间对.has(房间对ID)) {
			                    let 路径 = 连接房间(房间列表[i - 1], 新房间);
			                    if (路径) {
			                        生成走廊(路径);
			                        已连接房间对.add(房间对ID);
			                    }
			                }
			                
			
			                放置成功 = true;
			            }
			        }
			        回溯 = false;
			        if (!放置成功) {
			            console.log(`第${i}个房间多次尝试后仍然放置失败`);
			            回溯 = true;
			        }
			    }
			    添加额外走廊(房间列表, 5+当前层数, 已连接房间对);
			    let has特殊房间生成 = false;
			    if (prng() < 0.5) {
			        生成特殊房间();
			        has特殊房间生成 = true;
			    }
			    
			    生成墙壁();
			
			    const 第一个房间 = 房间列表[0];
			    房间列表[1].类型='房间'
			    玩家初始位置.x = 第一个房间.x + Math.floor(第一个房间.w / 2);
			    玩家初始位置.y = 第一个房间.y + Math.floor(第一个房间.h / 2);
			    玩家.x = 玩家初始位置.x;
			    玩家.y = 玩家初始位置.y;
			
			    if (房间列表.length > 4) {
			        处理上锁的门();
			        生成钥匙();
			    }
			    if (has特殊房间生成) 生成寻宝戒指();
			    生成金币();
			    生成物品();
			    if (当前层数>=7 && 当前层数%5!==0) {
			    for (let i=0;i<=当前层数-5;i++) 生成红蓝开关谜题(计算距离图(玩家初始位置.x, 玩家初始位置.y));
			    
			    }
			    生成怪物();
			    
			    if (当前层数 === 0) {
			        const 初始武器 = new 钢制长剑({ 不可破坏: true }); 
			        放置物品到房间(初始武器, 房间列表[0]);
			    }
			    更新视口();
			    已访问房间.add(第一个房间.id); 
			    房间列表.forEach((房间) => 更新房间墙壁(房间));
			    const 距离图 = 计算距离图(玩家初始位置.x, 玩家初始位置.y)
			
			
			    let 最远距离 = -1;
			    let 最远房间 = null;
			    const 可用房间 = 房间列表.filter(
			        (房间) => 房间.id !== 0 && 房间.类型 == "房间"
			    );
			
			    可用房间.forEach((房间) => {
			        const 中心X = 房间.x + Math.floor(房间.w / 2);
			        const 中心Y = 房间.y + Math.floor(房间.h / 2);
			        const 距离 = 距离图[中心Y]?.[中心X]; 
			        生成陷阱(房间);
			
			        if (
			            距离 !== undefined &&
			            距离 !== Infinity &&
			            距离 > 最远距离
			        ) {
			            最远距离 = 距离;
			            最远房间 = 房间;
			        }
			    });
			    
			
			    if (!最远房间) {
			        最远房间 =
			            可用房间[
			                Math.floor(prng() * 可用房间.length)
			            ];
			        console.warn(
			            "未能通过距离找到最远房间放置楼梯，已随机选择。"
			        );
			    }
			    放置楼梯(最远房间, 楼梯图标.下楼, 单元格类型.楼梯下楼);
			    if (当前层数 > 0) {
			        放置楼梯(第一个房间, 楼梯图标.上楼, 单元格类型.楼梯上楼);
			    }
			    所有怪物.forEach(monster => {
			if (monster instanceof 巡逻怪物) {
			    monster.初始巡逻();
			}
			        });
			    更新界面状态();
			    return;
			}
			function 生成迷宫地牢() {
			    地牢大小 = 100 + 当前层数 * 2;
			    地牢 = Array(地牢大小)
			        .fill()
			        .map((_, y) =>
			            Array(地牢大小)
			                .fill()
			                .map((_, x) => new 单元格(x, y))
			        );
			    房间地图 = Array(地牢大小)
			        .fill()
			        .map(() => Array(地牢大小).fill(-1));
			    房间列表 = [];
			    上锁房间列表 = [];
			    所有怪物 = [];
			    所有计时器 = [];
			    已访问房间 = new Set();
			    门实例列表 = new Map();
			    let 当前区域 = 0;

			    当前区域 = 放置房间群(当前区域);
			    当前区域 = 填充迷宫(当前区域);
			    连接所有区域();
			    //移除所有死胡同();
			    最终化地牢();
			}
function 确保所有房间均已连接() {
			    const 方向 = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }];

			    for (const 房间 of 房间列表) {
			        if (!房间) continue;

			        let 已连接到走廊 = false;
			        if (房间.门) {
			            for (const 门坐标 of 房间.门) {
			                for (const { dx, dy } of 方向) {
			                    const 邻居X = 门坐标.x + dx;
			                    const 邻居Y = 门坐标.y + dy;
			                    if (地牢[邻居Y]?.[邻居X]?.背景类型 === 单元格类型.走廊) {
			                        已连接到走廊 = true;
			                        break;
			                    }
			                }
			                if (已连接到走廊) break;
			            }
			        }

			        if (已连接到走廊) continue;

			        console.warn(`房间 ${房间.id} (${房间.名称}) 未连接到走廊，正在强制连接...`);

			        const 队列 = [];
			        const 已访问 = new Set();
			        const cameFrom = new Map();


			        for (let ry = 房间.y; ry < 房间.y + 房间.h; ry++) {
			            for (let rx = 房间.x; rx < 房间.x + 房间.w; rx++) {
			                const 房间单元格 = 地牢[ry]?.[rx];
			                if (房间单元格 && 房间单元格.背景类型 === 单元格类型.房间) {
			                    // 检查四个正交方向的邻居
			                    for (const { dx, dy } of 方向) {
			                        const wallX = rx + dx;
			                        const wallY = ry + dy;
			                        const wallKey = `${wallX},${wallY}`;

			                        if (wallX >= 0 && wallX < 地牢大小 && wallY >= 0 && wallY < 地牢大小 &&
			                            地牢[wallY][wallX].背景类型 === 单元格类型.墙壁 &&
			                            !已访问.has(wallKey)) {
			                            
			                            队列.push({ x: wallX, y: wallY });
			                            已访问.add(wallKey);
			                            cameFrom.set(wallKey, {x: rx, y: ry}); // 路径回溯时，墙的前一个点是房间内的地块
			                        }
			                    }
			                }
			            }
			        }

			        if (队列.length === 0) {
			            console.error(`房间 ${房间.id} 无法找到任何可作为起点的相邻墙壁。`);
			            continue;
			        }

			        let 终点 = null;
			        while (队列.length > 0) {
			            const 当前 = 队列.shift();
			            
			            for (const { dx, dy } of 方向) {
			                const 邻居X = 当前.x + dx;
			                const 邻居Y = 当前.y + dy;
			                const 邻居键 = `${邻居X},${邻居Y}`;

			                if (邻居X >= 0 && 邻居X < 地牢大小 && 邻居Y >= 0 && 邻居Y < 地牢大小 && !已访问.has(邻居键)) {
			                     if (地牢[邻居Y][邻居X].背景类型 === 单元格类型.走廊) {
			                        cameFrom.set(邻居键, 当前);
			                        终点 = {x: 邻居X, y: 邻居Y};
			                        队列.length = 0; // 找到即停止
			                        break;
			                     }
			                    if (地牢[邻居Y][邻居X].背景类型 === 单元格类型.墙壁) {
			                        已访问.add(邻居键);
			                        cameFrom.set(邻居键, 当前);
			                        队列.push({ x: 邻居X, y: 邻居Y });
			                    }
			                }
			            }
			        }

			        if (终点) {
			            const 路径 = [];
			            let current = 终点;
			            while (current) {
			                路径.unshift(current);
			                const currentKey = `${current.x},${current.y}`;
			                current = cameFrom.get(currentKey);
			            }
			            
			            // 路径的第一个点现在是房间内的地块，第二个点是紧邻的墙（即门的位置）
			            if (路径.length > 1) { 
			                const 门坐标 = 路径[1]; 
			                const 门单元格 = 地牢[门坐标.y][门坐标.x];

			                const 新门 = new 门({ 关联房间ID: 房间.id, 位置: { x: 门坐标.x, y: 门坐标.y } });
			                门单元格.背景类型 = 单元格类型.门;
			                门单元格.标识 = 新门.唯一标识;
			                门实例列表.set(新门.唯一标识, 新门);
			                if (!房间.门) 房间.门 = [];
			                房间.门.push({ x: 门坐标.x, y: 门坐标.y });
			                
			                // 将路径上剩余的墙壁打通为走廊
			                for (let i = 2; i < 路径.length; i++) {
			                    const pos = 路径[i];
			                    const cell = 地牢[pos.y][pos.x];
			                    if(cell.背景类型 === 单元格类型.墙壁) {
			                       cell.背景类型 = 单元格类型.走廊;
			                    }
			                }
			                console.log(`已为房间 ${房间.id} 在 (${门坐标.x}, ${门坐标.y}) 创建连接通道。`);
			            }
			        } else {
			            console.error(`无法为房间 ${房间.id} 找到通往走廊的路径！`);
			        }
			    }
			}
			function 放置房间群(起始区域) {
			    let 当前区域 = 起始区域;
			    for (let i = 0; i < (200 + 当前层数 * 5); i++) {
			        const 宽度 = (Math.floor(prng() * 4) + 2) * 2 + 1;
			        const 高度 = (Math.floor(prng() * 4) + 2) * 2 + 1;
			        const x = Math.floor(prng() * ((地牢大小 - 宽度) / 2)) * 2 + 1;
			        const y = Math.floor(prng() * ((地牢大小 - 高度) / 2)) * 2 + 1;

			        if (区域是否空闲(x, y, 宽度, 高度, 2)) {
			            
			            let 房间类型 = "房间";
			            if (房间列表.length > 2 && prng() < 0.12) {
			                房间类型 = "挑战房间";
			            } else if (房间列表.length > 2 && prng() < 0.1) {
			                房间类型 = "单向房间";
			            } else if (房间列表.length > 2 && prng() < 0.15) {
			                房间类型 = "黑暗房间";
			            }

			            const 新房间 = {
			                x,
			                y,
			                w: 宽度,
			                h: 高度,
			                id: 当前区域,
			                名称: `房间_${当前区域}`,
			                门: [],
			                类型: 房间类型,
			                已连接: true,
			            };

			            if (房间类型 === "挑战房间") {
			                新房间.挑战状态 = {
			                    进行中: false,
			                    已完成: false,
			                    当前波次: 0,
			                    总波次: 4 + Math.round(prng() * Math.floor(当前层数 / 2)) + (玩家属性.挑战波数增加 || 0),
			                    波次最大回合数: 30 + 当前层数 * 3,
			                    波次当前回合数: 0,
			                    波次内怪物: [],
			                    原始门数据: [],
			                    挑战怪物层级: 当前层数,
			                };
			            }
			            房间列表.push(新房间);
			            房间列表.sort((a,b)=>a.id-b.id)
			            for (let ry = y; ry < y + 高度; ry++) {
			                for (let rx = x; rx < x + 宽度; rx++) {
			                    地牢[ry][rx].背景类型 = 单元格类型.房间;
			                    房间地图[ry][rx] = 当前区域;
			                }
			            }
			            if (房间类型 === "房间" && 房间列表.length > 3 && prng() < 0.17) {
			                const 房间主题列表 = [
			                    { 类型: "隐藏解谜棋盘", 概率: 0.15 },
			                    { 类型: "隐藏罐子房间", 概率: 0.25 },
			                    { 类型: "隐藏植物房间", 概率: 0.2 },
			                    { 类型: "隐藏书库房间", 概率: 0.25 },
			                    { 类型: "隐藏药水房间", 概率: 0.15 },
			                ];
			                const 选定主题 = 加权随机选择(
			                    房间主题列表.map((t) => ({ 值: t.类型, 权重: t.概率 }))
			                );
			                新房间.类型 = 选定主题;
			                
			                switch (选定主题) {
			                    case "隐藏解谜棋盘":
			                        生成解谜棋盘(新房间);
			                        break;
			                    case "隐藏罐子房间":
			                        生成罐子房间内容(新房间);
			                        break;
			                    case "隐藏植物房间":
			                        生成植物房间内容(新房间);
			                        break;
			                    case "隐藏书库房间":
			                        生成书库房间内容(新房间);
			                        break;
			                    case "隐藏药水房间":
			                        生成药水房内容(新房间);
			                        break;
			                }
			            }

			            
			            当前区域++;
			        }
			    }
			    return 当前区域;
			}

			function 填充迷宫(起始区域) {
			    let 当前区域 = 起始区域;
			    for (let y = 1; y < 地牢大小 - 1; y += 4) {
			        for (let x = 1; x < 地牢大小 - 1; x += 4) {
			            if (地牢[y][x].背景类型 === 单元格类型.墙壁) {
			                当前区域++;
			                生长树算法(x, y, 当前区域);
			            }
			        }
			    }
			    return 当前区域;
			}

			function 生长树算法(起始X, 起始Y, 区域ID) {
			    const 单元格列表 = [];
			    const 雕刻 = (x, y) => {
			        if (x < 0 || x >= 地牢大小 || y < 0 || y >= 地牢大小) return;
			        地牢[y][x].背景类型 = 单元格类型.走廊;
			        房间地图[y][x] = 区域ID;
			    };

			    const 雕刻区块 = (x, y) => {
			        雕刻(x, y);
			        雕刻(x + 1, y);
			        雕刻(x, y + 1);
			        雕刻(x + 1, y + 1);
			    };

			    雕刻区块(起始X, 起始Y);
			    单元格列表.push({ x: 起始X, y: 起始Y });

			    while (单元格列表.length > 0) {
			        const 当前单元格 = 单元格列表[单元格列表.length - 1];
			        const 可用方向 = [];
			        const 方向数组 = [{ x: 0, y: -4 }, { x: 0, y: 4 }, { x: -4, y: 0 }, { x: 4, y: 0 }];
			        方向数组.sort(() => prng() - 0.5);

			        for (const 方向 of 方向数组) {
			            const 新X = 当前单元格.x + 方向.x;
			            const 新Y = 当前单元格.y + 方向.y;
			            if (新X > 0 && 新X < 地牢大小 - 1 && 新Y > 0 && 新Y < 地牢大小 - 1 && 地牢[新Y][新X].背景类型 === 单元格类型.墙壁) {
			                可用方向.push(方向);
			            }
			        }

			        if (可用方向.length > 0) {
			            const 选定方向 = 可用方向[0];
			            const 连接点X = 当前单元格.x + 选定方向.x / 2;
			            const 连接点Y = 当前单元格.y + 选定方向.y / 2;
			            const 邻居X = 当前单元格.x + 选定方向.x;
			            const 邻居Y = 当前单元格.y + 选定方向.y;

			            雕刻区块(连接点X, 连接点Y);
			            雕刻区块(邻居X, 邻居Y);

			            单元格列表.push({ x: 邻居X, y: 邻居Y });
			        } else {
			            单元格列表.pop();
			        }
			    }
			}

			function 连接所有区域() {
			    const 连接点列表 = [];
			    for (let y = 1; y < 地牢大小 - 1; y++) {
			        for (let x = 1; x < 地牢大小 - 1; x++) {
			            if (地牢[y][x].背景类型 !== 单元格类型.墙壁) continue;

			            const 相邻区域 = new Set();
			            const 方向数组 = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
			            for (const 方向 of 方向数组) {
			                const 邻居单元格 = 地牢[y + 方向.y][x + 方向.x];
			                if (房间地图[y + 方向.y][x + 方向.x] >= 0) {
			                    相邻区域.add(房间地图[y + 方向.y][x + 方向.x]);
			                }
			            }

			            if (相邻区域.size > 1) {
			                连接点列表.push({ x, y, regions: 相邻区域 });
			            }
			        }
			    }
			    连接点列表.sort(() => prng() - 0.5);

			    const 合并区域 = new Map();
			    for (let i = 0; i <= 房间列表.length + 填充迷宫.length; i++) {
			        合并区域.set(i, i);
			    }

			    const 查找根 = (区域) => {
			        if (!合并区域.has(区域) || 合并区域.get(区域) === 区域) return 区域;
			        const 根 = 查找根(合并区域.get(区域));
			        合并区域.set(区域, 根);
			        return 根;
			    };

			    for (const 连接点 of 连接点列表) {
			        const 区域数组 = Array.from(连接点.regions).map(查找根);
			        const 唯一根 = new Set(区域数组);

			        if (唯一根.size > 1) {
			            const 根代表 = 唯一根.values().next().value;
			            唯一根.forEach(根 => 合并区域.set(根, 根代表));
			            _放置门(连接点.x, 连接点.y);
			        }
			    }
			    const 额外连接概率 = 0.12
                for (const 连接点 of 连接点列表) {
                    if (prng() < 额外连接概率) {
                        _放置门(连接点.x, 连接点.y);
                    }
                }
			

			}

			function _放置门(x, y) {
			    if (x < 0 || x >= 地牢大小 || y < 0 || y >= 地牢大小) return;
			    let 关联房间 = null;
			    const 方向数组 = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }];
			    for (const 方向 of 方向数组) {
			        const 邻居X = x + 方向.dx;
			        const 邻居Y = y + 方向.dy;
			        if (地牢[邻居Y]?.[邻居X]?.背景类型 === 单元格类型.房间) {
			            关联房间 = 房间列表.find(r => r.id === 房间地图[邻居Y][邻居X]);
			            break;
			        }
			    }

			    if (!关联房间) {
			        return;
			    }
				let adjX = -1,
			        adjY = -1;
			    let isVerticalDoor = false; // 门是垂直放置（左右打开）还是水平放置（上下打开）
			
			    // 检查左右是否是房间或走廊
			    const leftCell = 地牢[y]?.[x - 1];
			    const rightCell = 地牢[y]?.[x + 1];
			    if (
			        (leftCell && leftCell.背景类型 !== 单元格类型.墙壁) ||
			        (rightCell && rightCell.背景类型 !== 单元格类型.墙壁)
			    ) {
			        const upCell = 地牢[y - 1]?.[x];
			        const downCell = 地牢[y + 1]?.[x];
			        if (
			            (upCell && upCell.背景类型 !== 单元格类型.墙壁) ||
			            (downCell && downCell.背景类型 !== 单元格类型.墙壁)
			        ) {
			            adjX = -1;
			            adjY = -1;
			        } else {
			            isVerticalDoor = true;
			            adjY = y + 1; // 尝试在下方放置配对门
			            adjX = x;
			        }
			    } else {
			        // 检查上下是否是房间或走廊
			        const upCell = 地牢[y - 1]?.[x];
			        const downCell = 地牢[y + 1]?.[x];
			        if (
			            (upCell && upCell.背景类型 !== 单元格类型.墙壁) ||
			            (downCell && downCell.背景类型 !== 单元格类型.墙壁)
			        ) {
			            isVerticalDoor = false; // 水平放置
			            adjX = x + 1; // 尝试在右方放置配对门
			            adjY = y;
			        } else {
			            adjX = -1;
			            adjY = -1;
			        }
			    }
			
			    // --- 创建逻辑门实例 ---
			    const 新门 = new 门({
			        关联房间ID: 关联房间.id,
			        位置: { x, y }, // 主单元格位置
			    });
			    let mainDoorOrientation = null;
			    if (isVerticalDoor) {
			        mainDoorOrientation = "EW";
			    } else {
			    mainDoorOrientation = "NS";
			    }


			    const 单元格 = 地牢[y][x];
			    单元格.背景类型 = 单元格类型.门;
			    单元格.标识 = 新门.唯一标识;
			    单元格.关联物品 = null;
			    单元格.墙壁 = { 上: false, 右: false, 下: false, 左: false };
				单元格.oneWayAllowedDirection = null; // Initialize
			    单元格.doorOrientation = mainDoorOrientation;
			    门实例列表.set(新门.唯一标识, 新门);

			    if (!关联房间.门.some(d => d.x === x && d.y === y)) {
			        关联房间.门.push({ x, y });
			    }
			}

			function 最终化地牢() {
			    for (let y = 1; y < 地牢大小 - 1; y++) {
			        for (let x = 1; x < 地牢大小 - 1; x++) {
			            if (房间地图[y][x]==房间列表.length+1) 房间地图[y][x]=-1
			                }
			            }
			    生成墙壁();
			    房间列表.forEach(更新房间墙壁);
			    确保所有房间均已连接();
                生成墙壁();

			    const 第一个房间 = 房间列表.find(r => r.id === 0) || 房间列表[0];
			    if (第一个房间) {
			        玩家初始位置.x = 第一个房间.x + Math.floor(第一个房间.w / 2);
			        玩家初始位置.y = 第一个房间.y + Math.floor(第一个房间.h / 2);
			        玩家.x = 玩家初始位置.x;
			        玩家.y = 玩家初始位置.y;
			        已访问房间.add(第一个房间.id);
			    }

			    const 距离图 = 计算距离图(玩家初始位置.x, 玩家初始位置.y);
			    let 最远距离 = -1;
			    let 最远房间 = null;

			    const 可用房间 = 房间列表.filter(房间 => 房间 && (第一个房间 ? 房间.id !== 第一个房间.id : true));

			    可用房间.forEach((房间) => {
			        const 中心X = 房间.x + Math.floor(房间.w / 2);
			        const 中心Y = 房间.y + Math.floor(房间.h / 2);
			        const 距离 = 距离图[中心Y]?.[中心X];
			        生成陷阱(房间);

			        if (!isNaN(距离) && 距离 !== Infinity && 距离 > 最远距离) {
			            最远距离 = 距离;
			            最远房间 = 房间;
			        }
			    });
			    

			    if (!最远房间 && 可用房间.length > 0) {
			        最远房间 = 可用房间[可用房间.length - 1];
			    }

			    if (最远房间) {
			        放置楼梯(最远房间, 楼梯图标.下楼, 单元格类型.楼梯下楼);
			    }
			    if (当前层数 > 0 && 第一个房间) {
			        放置楼梯(第一个房间, 楼梯图标.上楼, 单元格类型.楼梯上楼);
			    }

			    if (当前层数 === 0 && 第一个房间) {
			        const 初始武器 = new 钢制长剑({ 不可破坏: true });
			        放置物品到房间(初始武器, 第一个房间);
			    }

			    if (房间列表.length > 4) {
			        处理上锁的门();
			        生成钥匙();
			    }
			    for (let i=0;i<=当前层数-5;i++) 生成红蓝开关谜题(计算距离图(玩家初始位置.x, 玩家初始位置.y));
			    生成金币();
			    生成物品();
			    生成怪物();
			    

			    所有怪物.forEach(monster => {
			        if (monster instanceof 巡逻怪物) {
			            monster.初始巡逻();
			        }
			    });
			    更新界面状态();
			    更新视口();
			    绘制小地图();
			}
			function 生成陷阱(房间) {
			     if (房间.id === 0 || 房间.类型 !== '房间') return;
			     const 陷阱池 = [
			        { 类: 隐形落石陷阱, 权重: 20 },
			        { 类: 隐形地刺陷阱, 权重: 20 },
			        { 类: 远射陷阱, 权重: 8 },
			        { 类: 隐形失明陷阱, 权重: 12 },
			        { 类: 召唤怪物陷阱, 权重: 10 },
			        { 类: 烈焰触发陷阱, 权重: 5 },
			        { 类: 隐形虫洞陷阱, 权重: 10 },
			     ];
			     
			     const 是否上锁 = 上锁房间列表.some(r => r.id === 房间.id);
			
			     if (prng() < 0.15) {
			         生成毒气陷阱群(房间);
			     }
			
			     const 可用格子 = [];
			     for (let y = 房间.y; y < 房间.y + 房间.h; y++) {
			         for (let x = 房间.x; x < 房间.x + 房间.w; x++) {
			             const 单元格 = 地牢[y]?.[x];
			             if (单元格 && (单元格.背景类型 === 单元格类型.房间 || 单元格.背景类型 === 单元格类型.走廊) && !单元格.关联物品 && !单元格.关联怪物) {
			                 可用格子.push({ x, y });
			             }
			         }
			     }
			     可用格子.sort(() => prng() - 0.5);
			
			     const 陷阱数量 = prng() < 0.5 ? Math.ceil(prng()*5) : 0;
			
			     for (let i=0; i < 陷阱数量; i++) {
			         if (可用格子.length === 0) break;
			         const { x, y } = 可用格子.pop();
			
			         const 选定陷阱配置 = 加权随机选择(陷阱池.map(t => ({值: t, 权重: t.权重})));
			         if (选定陷阱配置) {
			             const 强化状态 = 是否上锁 || (prng() < 0.1 + 当前层数 * 0.025);
			             const 陷阱实例 = new 选定陷阱配置.类({强化: 强化状态});
			             
			             if (选定陷阱配置.类 === 远射陷阱) {
			                 放置怪物到单元格(陷阱实例, x, y);
			             } else {
			                 放置物品到单元格(陷阱实例, x, y);
			             }
			         }
			     }
			}
			function 计算距离图(起始X, 起始Y) {
			    const 距离图 = Array(地牢大小)
			        .fill(null)
			        .map(() => Array(地牢大小).fill(Infinity));
			    const 队列 = [[起始X, 起始Y, 0]]; // x, y, 距离
			    距离图[起始Y][起始X] = 0;
			    const 已访问 = new Set([`${起始X},${起始Y}`]);
			    const 方向 = [
			        { dx: 0, dy: -1, 当前墙: "上", 反方向墙: "下" },
			        { dx: 0, dy: 1, 当前墙: "下", 反方向墙: "上" },
			        { dx: -1, dy: 0, 当前墙: "左", 反方向墙: "右" },
			        { dx: 1, dy: 0, 当前墙: "右", 反方向墙: "左" },
			    ];
			
			    while (队列.length > 0) {
			        const [x, y, 距离] = 队列.shift();
			
			        for (const dir of 方向) {
			            const 新X = x + dir.dx;
			            const 新Y = y + dir.dy;
			
			            if (
			                新X < 0 ||
			                新X >= 地牢大小 ||
			                新Y < 0 ||
			                新Y >= 地牢大小
			            )
			                continue;
			
			            const 位置键 = `${新X},${新Y}`;
			            if (已访问.has(位置键)) continue;
			
			            const 当前单元格 = 地牢[y]?.[x];
			            const 下一单元格 = 地牢[新Y]?.[新X];
			
			            // 检查移动是否有效（非墙、非锁门、路径通畅）
			            if (
			                当前单元格 &&
			                下一单元格 &&
			                ![单元格类型.墙壁, 单元格类型.上锁的门].includes(
			                    下一单元格.背景类型
			                ) &&
			                !当前单元格.墙壁[dir.当前墙] &&
			                !下一单元格.墙壁[dir.反方向墙] &&
			                !(下一单元格.关联物品?.类型 === '开关砖')
			            ) {
			                距离图[新Y][新X] = 距离 + 1;
			                已访问.add(位置键);
			                队列.push([新X, 新Y, 距离 + 1]);
			            }
			        }
			    }
			    return 距离图;
			}
			function 寻找可放置位置(中心X, 中心Y) {
			    const 方向 = [
			        
			        [0, -1],
			        [1, 0],
			        [0, 1],
			        [-1, 0],
			        [0, 0],
			    ];
			    for (const [dx, dy] of 方向) {
			        const 检查X = 中心X + dx;
			        const 检查Y = 中心Y + dy;
			        if (
			            检查X >= 0 &&
			            检查X < 地牢大小 &&
			            检查Y >= 0 &&
			            检查Y < 地牢大小 &&
			            位置是否可用(检查X, 检查Y, false) &&
			            (已访问房间.has(房间地图[检查Y][检查X])||房间地图[检查Y][检查X]==-1)
			        ) {
			            return { x: 检查X, y: 检查Y };
			        }
			    }
			    return null;
			}
			function 生成罐子房间内容(房间) {
			    for (let y = 房间.y; y < 房间.y + 房间.h; y++) {
			        for (let x = 房间.x; x < 房间.x + 房间.w; x++) {
			            if ((x + y) % 2 === 0) {
			                if (prng() < 0.3) {
			                    放置物品到单元格(new 空罐子({}), x, y);
			                } else {
			                    放置物品到单元格(new 罐子({}), x, y);
			                }
			            }
			        }
			    }
			}
			
			function 生成植物房间内容(房间) {
			    放置物品到房间(new 泉水({}), 房间);
			
			    const 种子池 = [
			        { 类: 荆棘种子, 权重: 35 },
			        { 类: 护卫种子, 权重: 30 },
			        { 类: 远射种子, 权重: 25 },
			        { 类: 吸能种子, 权重: 10 },
			    ];
			
			    for (let i = 0; i < 6; i++) {
			        const 选定种子配置 = 加权随机选择(
			            种子池.map((s) => ({ 值: s, 权重: s.权重 }))
			        );
			        if (选定种子配置) {
			            const 数量 = 2 + Math.floor(prng() * 2);
			            const 种子实例 = new 选定种子配置.类({ 数量: 数量 });
			            放置物品到房间(种子实例, 房间);
			        }
			    }
			}
			
			function 生成药水房内容(房间) {
			    //放置物品到房间(new 泉水({}), 房间);
			
			    const 药水池 = 物品池["药水"];
			    const 药水数量 = 3 + Math.floor(prng() * 3);
			
			    for (let i = 0; i < 药水数量; i++) {
			        const 选定药水配置 =
			            药水池[Math.floor(prng() * 药水池.length)];
			        if (选定药水配置) {
			            const 药水实例 = new 选定药水配置.类({
			                强化: prng() < 0.3,
			            });
			            放置物品到房间(药水实例, 房间);
			        }
			    }
			
			    const 怪物数量 = 3 + Math.floor(prng() * 3);
			    for (let i = 0; i < 怪物数量; i++) {
			        放置怪物到房间(new 伪装怪物({ 伪装成: "药水" }), 房间);
			    }
			}
			function 生成书库房间内容(房间) {
			    const 书架数量 = Math.floor(
			        房间.w * 房间.h * (0.15 + prng() * 0.2)
			    );
			    for (let i = 0; i < 书架数量; i++) {
			        放置物品到房间(
			            new 书架({ 有内容: prng() < 0.2 }),
			            房间
			        );
			    }
			    const 怪物数量 = Math.floor(
			        房间.w * 房间.h * (0.1 + prng() * 0.2)
			    );
			    for (let i = 0; i < 怪物数量; i++) {
			        放置怪物到房间(new 伪装怪物({ 伪装成: "书架" }), 房间);
			    }
			}
			function 生成特殊房间() {
			    let 房间宽度, 房间高度, 房间起始X, 房间起始Y;
			    let 放置成功 = false;
			    let 尝试次数 = 0;
			
			    const 房间主题列表 = [
			        { 类型: "隐藏解谜棋盘", 概率: 0.15 },
			        { 类型: "隐藏罐子房间", 概率: 0.25 },
			        { 类型: "隐藏植物房间", 概率: 0.2 },
			        { 类型: "隐藏书库房间", 概率: 0.25 },
			        { 类型: "隐藏药水房间", 概率: 0.15 },
			    ];
			
			    const 选定主题 = 加权随机选择(
			        房间主题列表.map((t) => ({ 值: t.类型, 权重: t.概率 }))
			    );
			
			    while (!放置成功 && 尝试次数 < 100) {
			        尝试次数++;
			        房间宽度 = Math.floor(prng() * 3) + 7;
			        房间高度 = 房间宽度;
			        房间起始X =
			            Math.floor(prng() * (地牢大小 - 房间宽度 - 2)) +
			            1;
			        房间起始Y =
			            Math.floor(prng() * (地牢大小 - 房间高度 - 2)) +
			            1;
			
			        if (
			            区域是否空闲(房间起始X, 房间起始Y, 房间宽度, 房间高度)
			        ) {
			            const 新房间 = {
			                x: 房间起始X,
			                y: 房间起始Y,
			                w: 房间宽度,
			                h: 房间高度,
			                id: 房间列表.length,
			                门: [],
			                已连接: false,
			                类型: 选定主题,
			            };
			            房间列表.push(新房间);
			            房间列表.sort((a,b)=>a.id-b.id)
			            放置房间(新房间);
			
			            switch (选定主题) {
			                case "隐藏解谜棋盘":
			                    生成解谜棋盘(新房间);
			                    break;
			                case "隐藏罐子房间":
			                    生成罐子房间内容(新房间);
			                    break;
			                case "隐藏植物房间":
			                    生成植物房间内容(新房间);
			                    break;
			                case "隐藏书库房间":
			                    生成书库房间内容(新房间);
			                    break;
			                case "隐藏药水房间":
			                    生成药水房内容(新房间);
			                    break;
			            }
			            放置成功 = true;
			        }
			    }
			}
			function 生成寻宝戒指() {
			    // 排除已经作为特殊房间的房间
			    const 可用房间 = 房间列表.filter((房间) => 房间.类型 == "房间");
			    if (可用房间.length === 0) return; // 没有可用房间则不生成
			
			    const 目标房间 =
			        可用房间[Math.floor(prng() * 可用房间.length)];
			    const 新戒指 = new 寻宝戒指({ 生效层数: 当前层数 });
			    放置物品到房间(新戒指, 目标房间);
			}
			
			function 连接特殊房间(特殊房间) {
			    let 最近房间 = null;
			    let 最小距离 = Infinity;
			
			    for (const 房间 of 房间列表) {
			        if (房间 === 特殊房间 || 房间.已连接) continue; // 排除特殊房间本身和已连接的房间
			
			        const 距离 =
			            Math.abs(特殊房间.x - 房间.x) +
			            Math.abs(特殊房间.y - 房间.y);
			        if (距离 < 最小距离) {
			            最小距离 = 距离;
			            最近房间 = 房间;
			        }
			    }
			    if (最近房间) {
			        let 路径 = 连接房间(特殊房间, 最近房间);
			
			        if (路径) {
			            生成走廊(路径);
			            特殊房间.已连接 = true; // 标记为已连接
			        } else {
			            添加日志(
			                `无法将特殊房间连接到地牢！房间 ID: ${特殊房间.id}`,
			                `错误`
			            );
			        }
			    } else {
			        添加日志(
			            `没有找到可连接的房间！房间 ID: ${特殊房间.id}`,
			            `错误`
			        );
			    }
			}
			function 生成墙壁() {
			    for (let y = 0; y < 地牢大小; y++) {
			        for (let x = 0; x < 地牢大小; x++) {
			            const 当前单元格 = 地牢[y][x];
			            if (当前单元格.是否强制墙壁) {
			                continue; 
			            }
			                if (
			                    [
			                        单元格类型.墙壁,
			                        单元格类型.走廊,
			                        单元格类型.房间,
			                    ].includes(当前单元格.背景类型)
			                ) {
			                    地牢[y][x].墙壁 = {
			                        上:
			                            y > 0 &&
			                            地牢[y - 1][x].背景类型 !==
			                                地牢[y][x].背景类型 &&
			                            [
			                                单元格类型.墙壁,
			                                单元格类型.走廊,
			                                单元格类型.房间,
			                            ].includes(地牢[y - 1][x].背景类型),
			                        下:
			                            y < 地牢大小 - 1 &&
			                            地牢[y + 1][x].背景类型 !==
			                                地牢[y][x].背景类型 &&
			                            [
			                                单元格类型.墙壁,
			                                单元格类型.走廊,
			                                单元格类型.房间,
			                            ].includes(地牢[y + 1][x].背景类型),
			                        左:
			                            x > 0 &&
			                            地牢[y][x - 1].背景类型 !==
			                                地牢[y][x].背景类型 &&
			                            [
			                                单元格类型.墙壁,
			                                单元格类型.走廊,
			                                单元格类型.房间,
			                            ].includes(地牢[y][x - 1].背景类型),
			                        右:
			                            x < 地牢大小 - 1 &&
			                            地牢[y][x + 1].背景类型 !==
			                                地牢[y][x].背景类型 &&
			                            [
			                                单元格类型.墙壁,
			                                单元格类型.走廊,
			                                单元格类型.房间,
			                            ].includes(地牢[y][x + 1].背景类型),
			                    };
			                } else {
			                    地牢[y][x].墙壁 = {
			                        上:
			                            y > 0 &&
			                            地牢[y - 1][x].背景类型 ===
			                                单元格类型.墙壁,
			                        下:
			                            y < 地牢大小 - 1 &&
			                            地牢[y + 1][x].背景类型 ===
			                                单元格类型.墙壁,
			                        左:
			                            x > 0 &&
			                            地牢[y][x - 1].背景类型 ===
			                                单元格类型.墙壁,
			                        右:
			                            x < 地牢大小 - 1 &&
			                            地牢[y][x + 1].背景类型 ===
			                                单元格类型.墙壁,
			                    };
			                }
			
			            
			        }
			    }
			    for (let y = 0; y < 地牢大小; y++) {
			        for (let x = 0; x < 地牢大小; x++) {
			            const 当前单元格 = 地牢[y]?.[x];
			            if (!当前单元格) continue;
			
			            const 配对位置 = 当前单元格.配对单元格位置;
			            if (
			                配对位置 &&
			                [
			                    单元格类型.走廊,
			                    单元格类型.门,
			                    单元格类型.上锁的门,
			                ].includes(当前单元格.背景类型)
			            ) {
			                const 配对单元格 = 地牢[配对位置.y]?.[配对位置.x];
			                if (
			                    配对单元格 &&
			                    配对单元格.背景类型 === 当前单元格.背景类型
			                ) {
			                    if (配对位置.x > x) {
			                        
			                        当前单元格.墙壁.右 = false;
			                        配对单元格.墙壁.左 = false;
			                    } else if (配对位置.x < x) {
			                        
			                        当前单元格.墙壁.左 = false;
			                        配对单元格.墙壁.右 = false;
			                    } else if (配对位置.y > y) {
			                        
			                        当前单元格.墙壁.下 = false;
			                        配对单元格.墙壁.上 = false;
			                    } else if (配对位置.y < y) {
			                        
			                        当前单元格.墙壁.上 = false;
			                        配对单元格.墙壁.下 = false;
			                    }
			                }
			            }
			        }
			    }
			}
			function 添加额外走廊(房间列表, 数量, 已连接房间对) {
			    let 添加次数 = 0;
			    let 尝试次数 = 0;
			
			    while (添加次数 < 数量 && 尝试次数 < 100) {
			        尝试次数++;
			
			        const 房间A =
			            房间列表[Math.floor(prng() * 房间列表.length)];
			        const 房间B =
			            房间列表[Math.floor(prng() * 房间列表.length)];
			        if (房间A === 房间B) continue;
			
			        const 房间对ID = [房间A.id, 房间B.id].sort().join("-");
			        if (已连接房间对.has(房间对ID)) {
			            continue;
			        }
			
			        const 路径 = 连接房间(房间A, 房间B);
			
			        if (路径) {
			            已连接房间对.add(房间对ID);
			            生成走廊(路径);
			            添加次数++;
			        }
			    }
			}
			            function 恢复挑战区域() {
			    if (生存挑战备份单元格.length === 0) return;
			
			    生存挑战备份单元格.forEach(备份 => {
			        const { x, y, 类型, 背景类型, 墙壁, 关联物品, 关联怪物, 颜色索引, 标识 } = 备份;
			        const 单元格 = 地牢[y]?.[x];
			        if (单元格) {
			            单元格.类型 = 类型;
			            单元格.背景类型 = 背景类型;
			            单元格.墙壁 = 墙壁;
			            单元格.关联物品 = 关联物品;
			            单元格.关联怪物 = 关联怪物;
			            单元格.颜色索引 = 颜色索引;
			            单元格.标识 = 标识;
			        }
			    });
			
			    生存挑战备份单元格 = []; 
			    生成墙壁(); 
			    绘制();
			    显示通知("随着你的倒下，挑战结界消失了...", "信息");
			}
			            function 生成奖励(房间) {
			    const 奖励数量 = 3;
			    const 奖励物品 = [];
			    
			    const 奖励层级 = (游戏状态 === '地图编辑器' || 游戏状态 === '编辑器游玩' || 是否是自定义关卡) 
			                    ? (自定义全局设置.奖励物品层级 || 0) 
			                    : Math.max(当前层数, 0); 
			    const 下一层数 = 奖励层级 + 1;
			
			    const 品质权重基础 = [
			        { 品质: 1, 权重: 20 },
			        { 品质: 2, 权重: 35 },
			        { 品质: 3, 权重: 25 },
			        { 品质: 4, 权重: 15 },
			        { 品质: 5, 权重: 5 },
			    ];
			
			    let 已选中 = false;
			    let 尝试次数 = 0;
			    const 已生成物品名称 = new Set(); 
			
			    for (let i = 0; i < 奖励数量; i++) {
			        已选中 = false;
			        尝试次数 = 0;
			        while (!已选中 && 尝试次数 < 100) {
			            const 候选物品池 = Object.values(物品池)
			                .flat()
			                .filter((itemCfg) => {
			                    const 临时实例 = new itemCfg.类({});
			                    return (
			                        itemCfg.最小层 <= 下一层数 &&
			                        临时实例.类型 !== "工具" &&
			                        itemCfg.类.name !== "神秘商人" &&
			                        itemCfg.类.name !== "探险家" &&
			                        itemCfg.类.name !== "物品祭坛" &&
			                        itemCfg.类.name !== "耐久祭坛" &&
			                        itemCfg.类.name !== "背包扩容祭坛" &&
			                        itemCfg.类.name !== "重铸台" &&
			                        itemCfg.类.name !== "折跃门" &&
			                        itemCfg.类.name !== "寻宝戒指" &&
			                        itemCfg.类.name !== "配方卷轴" &&
			                        itemCfg.类.name !== "钥匙" &&
			                        itemCfg.类.name !== "金币"
			                    );
			                });
			
			            if (候选物品池.length === 0) {
			                尝试次数 = 100; 
			                continue;
			            }
			
			            let 选中物品模板 = null;
			            let 品质尝试次数 = 0;
			            while (!选中物品模板 && 品质尝试次数 < 50) {
			                const 目标品质配置 = 加权随机选择(
			                    品质权重基础.map((p) => ({
			                        值: p.品质,
			                        权重: p.权重,
			                    }))
			                );
			                const 品质过滤后物品 = 候选物品池.filter(
			                    (item) => item.品质 === 目标品质配置
			                );
			
			                if (品质过滤后物品.length > 0) {
			                    选中物品模板 =
			                        品质过滤后物品[
			                            Math.floor(
			                                prng() *
			                                    品质过滤后物品.length
			                            )
			                        ];
			                }
			                品质尝试次数++;
			            }
			
			            if (!选中物品模板) {
			                选中物品模板 =
			                    候选物品池[
			                        Math.floor(
			                            prng() * 候选物品池.length
			                        )
			                    ];
			            }
			
			            if (选中物品模板) {
			                const 物品实例 = new 选中物品模板.类({
			                    数量: 1, 
			                    强化:
			                        prng() <
			                        0.2 + Math.min(奖励层级, 10) * 0.05, 
			                    已解锁: true, 
			                });
			
			                if (
			                    !已生成物品名称.has(物品实例.名称) &&
			                    物品实例.是否正常物品
			                ) {
			                    奖励物品.push(物品实例);
			                    已生成物品名称.add(物品实例.名称);
			                    已选中 = true;
			                }
			            }
			            尝试次数++;
			        }
			    }
			
			    奖励物品.forEach((物品) => {
			        放置物品到房间(物品, 房间, 单元格类型.物品, false, true);
			    });
			}
			
			let 上次死亡地点 = null;
			function 玩家死亡() {
			    if (死亡界面已显示 || 游戏状态 === "图鉴") return;
			    if (游戏状态 === "地图编辑器" ) {
			    显示通知("不支持在地图编辑器自杀", "错误");
			        return;
			    }
			    if (游戏状态 === "地图编辑器" || 游戏状态 === "死亡界面" || 游戏状态==="胜利"||游戏状态==="图鉴选择") return;
			
			    if (生存挑战激活) {
			        恢复挑战区域();
			        生存挑战激活 = false;
			        
			        let 石碑 = null;
			        let 石碑所在房间 = null;
			        
			        for(const row of 地牢) {
			            for(const cell of row) {
			                if (cell.关联物品 instanceof 挑战石碑 && cell.关联物品.自定义数据.get("已激活")) {
			                    石碑 = cell.关联物品;
			                    const 石碑房间ID = 房间地图[cell.y]?.[cell.x];
			                    if (石碑房间ID !== undefined && 石碑房间ID !== -1) {
			                        石碑所在房间 = 房间列表[石碑房间ID];
			                    }
			                    break;
			                }
			            }
			            if(石碑) break;
			        }
			
			        if (石碑 && 石碑所在房间) {
			            石碑.发放奖励(石碑所在房间.survivalWave); // 在石碑房间生成奖励
			            石碑.自定义数据.set("已激活", false);
			        }
			        
			        // 将所有房间的挑战状态重置
			        房间列表.forEach(房间 => {
			            if (房间 && 房间.isSurvivalChallenge) {
			                房间.isSurvivalChallenge = false;
			            }
			        });
			    }
			    if (!是否为教程层 && 当前层数 !== null) {
			        上次死亡地点 = { 层数: 当前层数, x: 玩家.x, y: 玩家.y };
			    }
			    
			    玩家死亡次数++;
			    更新胜利条件显示();
			    if (游戏状态 === '编辑器游玩' || 是否是自定义关卡) {
			        const 玩家房间ID = 房间地图[玩家.y]?.[玩家.x];
			    const 玩家所在房间 = 房间列表[玩家房间ID];
			    if (玩家所在房间 && 玩家所在房间.类型 === "挑战房间" && 玩家所在房间.挑战状态?.进行中) {
			            处理挑战失败(玩家所在房间);
			        }
			        死亡界面已显示 = true;
			        const 死亡遮罩 = document.createElement("div");
			        死亡遮罩.id = "死亡遮罩";
			        死亡遮罩.innerHTML = `
			        <div class="死亡内容容器">
			            <div class="骷髅容器">
			                <div class="动态骷髅">${图标映射.死亡图标}</div>
			            </div>
			            <div class="重生选项">
			                <button class="重生按钮" id="保留重生">
			                    <span class="按钮图标">⚡</span>
			                    在本层重生
			                </button>
			            </div>
			        </div>
			        `;
			        游戏状态 = "死亡界面";
			        死亡遮罩.querySelector("#保留重生").addEventListener("click", function () {
			            处理重生(true);
			            // 修复bug：确保重生后游戏状态正确，而不是回到主菜单
			            游戏状态 = 是否是自定义关卡 ? "游戏中" : "编辑器游玩"; 
			            
			            document.body.classList.add('编辑器游玩模式', '游戏进行中');
			            document.body.classList.remove('地图编辑器模式');
			            
			            this.style.transform = "scale(0.95)";
			            setTimeout(() => {
			                this.style.transform = "";
			                所有怪物.forEach((m) => {
			                    m.绘制血条(true);
			                });
			            }, 500);
			        });
			        document.body.appendChild(死亡遮罩);
			        return; 
			    }
			
			    
			
			
			    死亡界面已显示 = true;
			    const 设置菜单 = document.getElementById("设置菜单");
			    if (设置菜单 && 设置菜单.classList.contains("显示")) {
			        关闭设置菜单();
			    }
			    房间列表.forEach((房间实例) => {
			        if (
			            房间实例.类型 === "挑战房间" &&
			            房间实例.挑战状态 &&
			            房间实例.挑战状态.进行中
			        ) {
			            显示通知(
			                `由于你的死亡，房间 ${房间实例.id} 的挑战失败了！`,
			                "错误",
			                true,
			                3000
			            );
			            房间实例.挑战状态.进行中 = false;
			            房间实例.挑战状态.已完成 = true;
			
			            房间实例.挑战状态.原始门数据.forEach((门数据) => {
			                const 门单元格 = 地牢[门数据.y]?.[门数据.x];
			                if (门单元格) {
			                    门单元格.背景类型 = 门数据.原类型;
			                    门单元格.标识 = 门数据.原标识;
			                    门单元格.颜色索引 = 门数据.原颜色索引;
			                    门单元格.钥匙ID = 门数据.原钥匙ID;
			                    if (
			                        门数据.原类型 === 单元格类型.上锁的门 &&
			                        门数据.原标识
			                    ) {
			                        const 门实例 = 门实例列表.get(
			                            门数据.原标识
			                        );
			                        if (门实例) {
			                            门实例.类型 = "上锁的门";
			                            门实例.是否上锁 = true;
			                        }
			                    } else if (
			                        门数据.原类型 === 单元格类型.门 &&
			                        门数据.原标识
			                    ) {
			                        const 门实例 = 门实例列表.get(
			                            门数据.原标识
			                        );
			                        if (门实例) {
			                            门实例.类型 = "门";
			                            门实例.是否上锁 = false;
			                        }
			                    }
			                }
			            });
			            生成墙壁();
			        }
			    });
			    const 死亡遮罩 = document.createElement("div");
			    死亡遮罩.id = "死亡遮罩";
			    死亡遮罩.innerHTML = `
			    <div class="死亡内容容器">
			        <div class="骷髅容器">
			            <div class="动态骷髅">${图标映射.死亡图标}</div>
			        </div>
			        <div class="重生选项">
			            <button class="重生按钮" id="保留重生">
			                <span class="按钮图标">⚡</span>
			                从本层重生（保留物品）
			            </button>
			            <button class="重生按钮" id="重新开始">
			                <span class="按钮图标">🔄</span>
			                全新开始（第0层）
			            </button>
			        </div>
			    </div>
			`;
			    if (!是否为教程层 && 当前层数 !== null) {
			        let 死亡凭证 = 生成死亡凭证(当前层数);
			        添加日志(
			            `您已死亡，但您曾经到达 ${当前层数} 层，您的凭证是：` +
			                死亡凭证,
			            "信息"
			        );
			        CopyTextToClipboard(死亡凭证);
			    }
			    游戏状态 = "死亡界面";
			
			    const 粒子容器 = document.createElement("div");
			    粒子容器.className = "死亡粒子";
			    死亡遮罩.appendChild(粒子容器);
			    生成死亡粒子(粒子容器);
			
			    const 显示确认对话框 = () => {
			        const 确认遮罩 = document.createElement("div");
			        确认遮罩.className = "确认对话框遮罩";
			        确认遮罩.innerHTML = `
			        <div class="确认对话框">
			            <h3>警告</h3>
			            <p>你确定要放弃所有进度，从头开始吗？<br>这将清除你所有的物品和探索记录！</p>
			            <div class="确认按钮容器">
			                <button class="确认按钮 确认按钮-确认">确认放弃</button>
			                <button class="确认按钮 确认按钮-取消">再想想</button>
			            </div>
			        </div>
			    `;
			        document.body.appendChild(确认遮罩);
			
			        确认遮罩.querySelector(".确认按钮-确认").onclick = () => {
			            确认遮罩.remove();
			            处理重生(false);
			            游戏状态 = "游戏中";
			        };
			
			        确认遮罩.querySelector(".确认按钮-取消").onclick = () => {
			            确认遮罩.remove();
			        };
			    };
			
			    死亡遮罩.querySelector("#保留重生").addEventListener(
			        "click",
			        function () {
			            处理重生(true);
			            游戏状态 = "游戏中";
			            this.style.transform = "scale(0.95)";
			            setTimeout(() => {
			                this.style.transform = "";
			                所有怪物.forEach((m) => {
			                    m.绘制血条(true);
			                });
			            }, 500);
			        }
			    );
			
			    死亡遮罩.querySelector("#重新开始").addEventListener(
			        "click",
			        function () {
			            显示确认对话框();
			        }
			    );
			
			    document.body.appendChild(死亡遮罩);
			}
			
			function 生成物品(生成房间 = null) {
			    const 当前层数权重 = Math.min(Math.floor(当前层数 / 2), 1); // 每2层提升品质
			    let 可用房间 = 房间列表.filter((房间) => 房间.类型 == "房间");
			    if (生成房间) 可用房间 = 生成房间;
			    可用房间.forEach((房间) => {
			        const 是否上锁 = 上锁房间列表.some((r) => r.id === 房间.id);
			        const 房间类型 = 是否上锁 ? "上锁房间" : "普通房间";
			        const 基础概率 = 是否上锁
			            ? 物品生成配置.基础概率.上锁房间
			            : 物品生成配置.基础概率.普通房间;
			
			        // 计算实际生成概率
			        let 实际概率 = 基础概率;
			        if (是否上锁) 实际概率 += 0.1 + 当前层数 * 0.05;
			        实际概率 = Math.min(实际概率, 0.85);
			
			        if (prng() > 实际概率) return;
			        let 物品数量 = 1;
			        if (是否上锁) {
			            while (prng() < 0.8+0.1*实际概率 && 物品数量<=5) {
			                物品数量++;
			            }
			            物品数量 = Math.min(物品数量, 5);
			        }
			        for (let i = 0; i < 物品数量; i++) {
			            // 计算品质分布
			            const 品质分布 = Object.entries(
			                物品生成配置.品质权重
			            ).reduce((acc, [品质, 权重]) => {
			                const 总权重 = 权重[0] + 权重[1] * 当前层数权重;
			                if (总权重 > 0)
			                    acc.push({
			                        品质: parseInt(品质),
			                        权重: 总权重,
			                    });
			                return acc;
			            }, []);
			
			            // 选择物品类型
			            const 类型分布 = 物品生成配置.类型分布[房间类型];
			            const 选中类型 = 加权随机选择(类型分布);
			
			            // 过滤可用物品
			            const 可用物品 = 物品池[选中类型["类型"]].filter(
			                (item) =>
			                    当前层数 >= item.最小层 &&
			                    品质分布.some((q) => q.品质 >= item.品质)
			            );
			
			            if (可用物品.length === 0) return;
			
			            // 加权选择品质
			            const 目标品质 = 加权随机选择(
			                品质分布.map((q) => ({
			                    值: q.品质,
			                    权重: q.权重,
			                }))
			            );
			
			            // 筛选符合品质的物品
			            const 候选物品 = 可用物品.filter(
			                (item) => item.品质 >= 目标品质
			            );
			            if (候选物品.length === 0) return;
			
			            // 创建物品实例
			            const 选中物品配置 =
			                候选物品[
			                    Math.round(
			                        prng() * (候选物品.length - 1)
			                    )
			                ];
			            const 新物品 = new 选中物品配置.类({});
			
			            if (是否上锁) {
			                新物品.强化 = true;
			            }
			
			            // 尝试放置物品
			            if (!放置物品到房间(新物品, 房间)) {
			                console.log("物品放置失败，位置被占用");
			            }
			        }
			    });
			}
			let 怪物引入计划 = new Map();

			function 生成怪物引入计划() {
			    怪物引入计划.clear();
			    const 怪物池 = 创建怪物池();
			    const 所有普通怪物 = [
			        ...new Map(怪物池.普通房间.map(m => [m.类.name, m])).values()
			    ];
			    if (游戏状态 === '地图编辑器' || 游戏状态 === '编辑器游玩' || 是否是自定义关卡) {
			        怪物引入计划.set(0, 所有普通怪物);
			        return;
			    }

			    const 固定引入 = {
			        0: ['怪物', '盔甲怪物'],
			        1: ['仙人掌怪物', '冰冻怪物', '蜘蛛怪物'],
			        2: ['敏捷怪物', '仙人掌怪物', '吸血鬼'],
			        3: ['炸弹怪物', '萨满怪物', '恐惧怪物'],
			        4: ['剧毒云雾怪物', '反弹怪物', '吸能怪物']
			    };

			    const 已分配怪物 = new Set();
			    for (let i = 0; i <= 4; i++) {
			        怪物引入计划.set(i, []);
			        if (固定引入[i]) {
			            固定引入[i].forEach(怪名 => {
			                const 怪物定义 = 所有普通怪物.find(m => m.类.name === 怪名);
			                if (怪物定义) {
			                    怪物引入计划.get(i).push(怪物定义);
			                    已分配怪物.add(怪名);
			                }
			            });
			        }
			    }

			    const 待分配怪物 = 所有普通怪物.filter(m => !已分配怪物.has(m.类.name));
			    
			    for (let i = 待分配怪物.length - 1; i > 0; i--) {
			        const j = Math.floor(prng() * (i + 1));
			        [待分配怪物[i], 待分配怪物[j]] = [待分配怪物[j], 待分配怪物[i]];
			    }

			    const 可分配层数 = [];
			    for (let i = 5; i < 15; i++) {
			        if (i % 5 !== 0) {
			            可分配层数.push(i);
			        }
			    }

			    if (待分配怪物.length === 0 || 可分配层数.length === 0) {
			        return;
			    }

			    let 当前层数索引 = 0;
			    待分配怪物.forEach(怪物 => {
			        const 分配层数 = 可分配层数[当前层数索引];
			        if (!怪物引入计划.has(分配层数)) {
			            怪物引入计划.set(分配层数, []);
			        }
			        怪物引入计划.get(分配层数).push(怪物);
			        当前层数索引 = (当前层数索引 + 1) % 可分配层数.length;
			    });
			}
			function 生成怪物() {
			    const 当前层数权重 = Math.floor(当前层数 / 3);
			    const 可用房间 = 房间列表.filter(
			        (房间) => 房间.类型 == "房间" || 房间.类型 == "黑暗房间"
			    );
			    
			    const 当前怪物池 = { 普通房间: [], 上锁房间: [] };
			    for (let i = 0; i <= 当前层数; i++) {
			        if (怪物引入计划.has(i)) {
			            怪物引入计划.get(i).forEach(怪物定义 => {
			                if (!当前怪物池.普通房间.some(m => m.类.name === 怪物定义.类.name)) {
			                    当前怪物池.普通房间.push(怪物定义);
			                    当前怪物池.上锁房间.push(怪物定义);
			                }
			            });
			        }
			    }

			    可用房间.forEach((房间) => {
			        if (房间.id === 0) return;
			        const 是否上锁 = 上锁房间列表.some((r) => r.id === 房间.id);
			        const 房间类型 = 是否上锁 ? "上锁房间" : "普通房间";
			
			        const 候选怪物 = 当前怪物池[房间类型].filter(
			            (m) => !(m.类.prototype instanceof 巡逻怪物)
			        );
			
			        if (候选怪物.length === 0) return;
			
			        const 最大生成数 = 是否上锁 ? 最大怪物数 + 2 : 最大怪物数;
			        let 生成数量 = Math.round(
			                prng() *
			                prng() *
			                最大生成数 +
			                当前层数权重
			        );
			
			        if (房间.类型 === "黑暗房间")
			            生成数量 = Math.max(2, 生成数量);
			
			        for (let i = 0; i < 生成数量; i++) {
			            const 总权重 = 候选怪物.reduce(
			                (sum, m) => sum + m.权重,
			                0
			            );
			            let 随机值 = prng() * 总权重;
			            let 选中配置 = null;
			
			            for (const m of 候选怪物) {
			                if (随机值 <= m.权重) {
			                    选中配置 = m;
			                    break;
			                }
			                随机值 -= m.权重;
			            }
			
			            let 放置成功 = false;
			            for (let 尝试次数 = 0; 尝试次数 < 10; 尝试次数++) {
			                const x =
			                    房间.x + Math.floor(prng() * 房间.w);
			                const y =
			                    房间.y + Math.floor(prng() * 房间.h);
			
			                if (
			                    地牢[y][x].背景类型 === 单元格类型.房间 &&
			                    !地牢[y][x].关联怪物 &&
			                    !地牢[y][x].关联物品
			                ) {
			                    const 新怪物 = new 选中配置.类({
			                        x: x,
			                        y: y,
			                        房间ID: 房间.id,
			                        强化: 是否上锁,
			                        基础攻击力: 3 + 当前层数权重,
			                    });
			                    if (当前层数>7 && prng() < 0.15+(当前层数-7)*0.1) {
			                        const 药水池 = [
			                            { 类型: '一次性治疗', 值: 50 },
			                            { 类型: '永久隐身'},
			                            { 类型: '永久速度', 值: 1, 图标: 图标映射.飞毛腿 },
			                            { 类型: '永久抗火', 图标: 图标映射.永久抗火 },
			                            { 类型: '永久力量', 值: 5, 图标: 图标映射.永久力量 },
			                            { 类型: '永久强化', 值: 10 },
			                            { 类型: '永久抗毒', 图标: 图标映射.永久抗毒 },
			                            { 类型: '永久解冻', 图标: 图标映射.永久解冻 },
			                            { 类型: '自爆', 图标: 图标映射.炸弹 }
			                        ];
			                        新怪物.携带药水 = 药水池[Math.floor(prng() * 药水池.length)];
			                        if (新怪物.携带药水.类型 === '自爆') 新怪物.永久增益.push(新怪物.携带药水);
			                    }
			                    新怪物.基础生命值 += 当前层数权重 * 3;
			                    新怪物.当前生命值 += 当前层数权重 * 3;
			                    放置怪物到单元格(新怪物, x, y);
			                    生成成功 = true;
			                    break;
			                }
			            }
			        }
			    });
			
			    
			    const 走廊格子 = [];
			    for (let y = 0; y < 地牢大小; y++) {
			        for (let x = 0; x < 地牢大小; x++) {
			            if (地牢[y]?.[x]?.背景类型 === 单元格类型.走廊) {
			                走廊格子.push({x, y});
			            }
			        }
			    }
			
			    const 巡逻怪物数量 = Math.floor(走廊格子.length / 50);
			    if (走廊格子.length > 0 && 巡逻怪物数量 > 0) {
			         for (let i = 0; i < 巡逻怪物数量; i++) {
			            let 放置成功 = false;
			            for (let 尝试次数 = 0; 尝试次数 < 20; 尝试次数++) {
			                const 随机索引 = Math.floor(prng() * 走廊格子.length);
			                const {x, y} = 走廊格子[随机索引];
			
			                if (!地牢[y][x].关联怪物 && !地牢[y][x].关联物品) {
			                    const 强化 = prng() < 0.1 + 当前层数 * 0.02;
			                    const 新巡逻怪 = new 巡逻怪物({
			                        x, y,
			                        房间ID: -1,
			                        强化,
			                        随机游走: true,
			                    });
			                    放置怪物到单元格(新巡逻怪, x, y);
			                    放置成功 = true;
			                    走廊格子.splice(随机索引, 1);
			                    break;
			                }
			            }
			        }
			    }
			}
			
			function 加权随机选择(选项列表) {
			    const 乱序列表 = [...选项列表].sort(() => prng() - 0.5);
			
			    // 计算累计权重
			    let 累计权重 = 0;
			    const 累计列表 = 乱序列表.map((opt) => {
			        累计权重 += opt.权重;
			        return { ...opt, 累计权重 };
			    });
			
			    const 随机值 =prng() * 累计权重;
			
			    // 进行一个二分
			    let left = 0;
			    let right = 累计列表.length - 1;
			
			    while (left <= right) {
			        const mid = Math.floor((left + right) / 2);
			        if (随机值 <= 累计列表[mid].累计权重) {
			            if (mid === 0 || 随机值 > 累计列表[mid - 1].累计权重) {
			                return 累计列表[mid].值 || 累计列表[mid];
			            }
			            right = mid - 1;
			        } else {
			            left = mid + 1;
			        }
			    }
			
			    return 累计列表[0]?.值 || 累计列表[0];
			}
			
			function 生成死亡粒子(容器) {
			    const 粒子数量 = 30;
			    const 颜色 = ["#ff0000", "#ff4444", "#ff8888"];
			
			    for (let i = 0; i < 粒子数量; i++) {
			        const 粒子 = document.createElement("div");
			        粒子.className = "死亡粒子";
			        粒子.style.cssText = `
			                                                            position: absolute;
			                                                            width: ${
			                                                                prng() *
			                                                                    4 +
			                                                                2
			                                                            }px;
			                                                            height: ${
			                                                                prng() *
			                                                                    4 +
			                                                                2
			                                                            }px;
			                                                            background: ${
			                                                                颜色[
			                                                                    Math.floor(
			                                                                        prng() *
			                                                                            颜色.length
			                                                                    )
			                                                                ]
			                                                            };
			                                                            border-radius: 50%;
			                                                            left: ${
			                                                                prng() *
			                                                                100
			                                                            }%;
			                                                            top: ${
			                                                                prng() *
			                                                                100
			                                                            }%;
			                                                            animation: 粒子飘落 ${
			                                                                prng() *
			                                                                    3 +
			                                                                2
			                                                            }s linear infinite;
			                                                            opacity: ${
			                                                                prng() *
			                                                                    0.6 +
			                                                                0.4
			                                                            };
			                                                        `;
			        粒子.style.setProperty("--random", prng());
			        容器.appendChild(粒子);
			    }
			}
			function 处理重生(保留物品) {
			    if (当前天气效果.includes("诡魅")) {
			        处理诡魅房间刷新(
			            玩家.x,
			            玩家.y,
			            玩家初始位置.x,
			            玩家初始位置.y
			        );
			    }
			    const 生命条 = document.querySelector(".health-bar");
			    生命条.style.width = "100%";
			    document.querySelector(".power-bar").style.width = `100%`;
			
			    玩家状态.forEach((m) => {
			        m.移除状态();
			    });
			    if (当前激活卷轴列表.size > 0) {
			        当前激活卷轴列表.forEach((卷轴) => {
			            当前激活卷轴列表.delete(卷轴);
			            卷轴.卸下();
			        });
			    }
			    玩家属性.允许移动 = 0;
			    应用永久Buffs();
			    玩家状态 = [];
			
			    if (保留物品) {
			        if (当前层数 === 5) {
			            const 迷宫尺寸 = 85;
			            const 偏移X = Math.floor((地牢大小 - 迷宫尺寸) / 2);
			            const 偏移Y = Math.floor((地牢大小 - 迷宫尺寸) / 2);
			            let rx, ry;
			            do {
			                rx = 偏移X + Math.floor(prng() * 迷宫尺寸);
			                ry = 偏移Y + Math.floor(prng() * 迷宫尺寸);
			            } while (地牢[ry]?.[rx]?.背景类型 !== 单元格类型.走廊);
			            玩家.x = rx;
			            玩家.y = ry;
			        } else if (当前层数 === 15) {
			        const 房间ID = 房间地图[玩家.y][玩家.x];
			        const 当前所在房间 = 房间列表.find(r => r.id === 房间ID);
			
			        let 重生X = 玩家初始位置.x;
			        let 重生Y = 玩家初始位置.y;
			        let 找到位置 = false;
			
			        if (当前所在房间) {
			            for (let i = 0; i < 50; ) {
			                const 随机X = 当前所在房间.x + Math.floor(prng() * 当前所在房间.w);
			                const 随机Y = 当前所在房间.y + Math.floor(prng() * 当前所在房间.h);
			                if (位置是否可用(随机X, 随机Y, false)) {
			                    if (当前所在房间.名称 === "最终秘室") {
			                        const 大首领 = 所有怪物.find(m => m instanceof 王座守护者);
			                        if (大首领 && 广度优先搜索路径(随机X, 随机Y, 大首领.x, 大首领.y, 999)) {
			                            重生X = 随机X;
			                            重生Y = 随机Y;
			                            找到位置 = true;
			                            break;
			                        }
			                    } else {
			                        重生X = 随机X;
			                        重生Y = 随机Y;
			                        找到位置 = true;
			                        break;
			                    }
			                    i++
			                }
			            }
			        }
			
			        if (!找到位置 && 当前所在房间) {
			             重生X = 当前所在房间.x + Math.floor(当前所在房间.w / 2);
			             重生Y = 当前所在房间.y + Math.floor(当前所在房间.h / 2);
			        }
			        
			        玩家.x = 重生X;
			        玩家.y = 重生Y;
			
			    } else if (地牢生成方式 === 'cave') {
            const 可重生位置 = Array.from(已揭示洞穴格子);
            if (可重生位置.length > 0) {
                let 随机X, 随机Y;
let 尝试次数 = 0;
const 最大尝试次数 = 可重生位置.length * 2;

while (尝试次数 < 最大尝试次数) {
    const 位置字符串 = 可重生位置[Math.floor(prng() * 可重生位置.length)];
    const [x, y] = 位置字符串.split(',').map(Number);
    
    if (位置是否可用(x, y)) {
        [随机X, 随机Y] = [x, y];
        break;
    }
    
    尝试次数++;
}

if (尝试次数 >= 最大尝试次数) {
    console.log("无法找到可用的重生位置");
    玩家.x = 玩家初始位置.x;
                玩家.y = 玩家初始位置.y;
} else {
玩家.x = 随机X;
                玩家.y = 随机Y;
}

                
            } else {
                玩家.x = 玩家初始位置.x;
                玩家.y = 玩家初始位置.y;
            }
			        } else if(地牢生成方式==='maze') {
			            const visitedRoomIds = Array.from(已访问房间);
			            const availableRespawnRooms = 房间列表.filter(room => room && visitedRoomIds.includes(room.id));

			            if (availableRespawnRooms.length > 0) {
			                // 随机选择一个已访问的房间
			                const randomRoom = availableRespawnRooms[Math.floor(prng() * availableRespawnRooms.length)];
			                
			                // 将玩家放置在房间的中心位置，确保是一个有效的地块
			                玩家.x = randomRoom.x + Math.floor(randomRoom.w / 2);
			                玩家.y = randomRoom.y + Math.floor(randomRoom.h / 2);
			                } else {
			                    玩家.x = 玩家初始位置.x;
			                    玩家.y = 玩家初始位置.y;
			                }
			        } else {
			            玩家.x = 玩家初始位置.x;
			            玩家.y = 玩家初始位置.y;
			        }
			
			        玩家背包.forEach((item) => {
			            if (
			                item.类型 === "武器" &&
			                item.自定义数据.get("冷却剩余") > 0
			            ) {
			                item.自定义数据.set("冷却剩余", 0);
			            }
			        });
			
			        更新装备显示();
			    } else {
			        上次死亡地点 = null;
			        玩家背包.clear();
			        玩家装备.clear();
			        所有地牢层.clear();
			        已访问房间.clear();
			        玩家.x = 玩家初始位置.x;
			        玩家.y = 玩家初始位置.y;
			        地牢 = [];
			        房间列表 = [];
			        所有计时器 = [];
			        if (当前层数 !== null) {
			            切换楼层(0, true,null,false,()=>{更新视口();
			    绘制小地图();
			    更新光源地图();});
			        } else {
			            进入教程层();
			        }
			        更新背包显示();
			        更新装备显示();
			
			        更新界面状态();
			        更新物体指示器();
			        const 死亡遮罩 = document.getElementById("死亡遮罩");
			    if (死亡遮罩) 死亡遮罩.remove();
			    死亡界面已显示 = false;
			    return;
			    }
			
			    const 死亡遮罩 = document.getElementById("死亡遮罩");
			    if (死亡遮罩) 死亡遮罩.remove();
			    死亡界面已显示 = false;
			    更新视口();
			    绘制小地图();
			    更新光源地图();
			}
			function 切换楼层(
			    新层数,
			    完全重生 = false,
			    目标坐标 = null,
			    通过楼梯切换 = false,
			    onCompleteCallback = null
			) {
			    const 遮罩 = document.getElementById("transitionMask");
			    const 标题 = document.getElementById("floorTitle");
			
			    遮罩.style.opacity = 1;
			    if (新层数 === 5 && 当前层数 !== 5) {
			        标题.textContent = `米诺陶的迷宫`;
			    } else if (新层数 === 10 && 当前层数 !== 10) {
			        标题.textContent = `法师图书馆`;
			    } else if (新层数 === 15 && 当前层数 !== 15) {
			        标题.textContent = `最终战场`;
			    } else {
			        标题.textContent = `地牢 ${
			            新层数 < 0 ? 当前层数 - 1 : 新层数
			        }`;
			    }
			    if (新层数 > 当前层数 && !所有地牢层.has(新层数)) {
			            const 定位器地图实例 = [...玩家装备.values()].find(item => item instanceof 定位器地图) || [...玩家背包.values()].find(item => item instanceof 定位器地图);
			            if (定位器地图实例) {
			                if (定位器地图实例.堆叠数量 > 1) {
			                    定位器地图实例.堆叠数量--;
			                    添加日志("消耗了一张定位器地图。", "信息");
			                } else {
			                    处理销毁物品(定位器地图实例.唯一标识, true);
			                    添加日志("消耗了最后一张定位器地图！", "警告");
			                }
			                更新背包显示();
			                更新装备显示();
			            }
			        }
			    setTimeout(() => {
			        标题.style.opacity = 1;
			        标题.style.transform = "scale(1)";
			    }, 200);
			
			    setTimeout(() => {
			        const 旧楼层数据 = 所有地牢层.get(当前层数);
			        const 当前数据 = {
			            地牢数组: 地牢,
			            房间列表: 房间列表,
			            门实例列表: 门实例列表,
			            玩家位置: { x: 玩家.x, y: 玩家.y },
			            上锁房间列表: 上锁房间列表,
			            已访问房间: 已访问房间,
			            地牢生成方式: 地牢生成方式,
			            已揭示洞穴格子: deepClone(已揭示洞穴格子),
			            房间地图: 房间地图,
			            所有怪物: 所有怪物,
			            玩家初始位置: { x: 玩家初始位置.x, y: 玩家初始位置.y },
			            所有计时器: 所有计时器,
			            当前天气效果: [...当前天气效果],
			        };
			
			        所有怪物.forEach((m) => {
			            m.绘制血条(true);
			        });
			
			        if (当前层数 !== null && !完全重生) {
			            const 待保存楼层数据 = 所有地牢层.get(当前层数) || {};
			            待保存楼层数据.地牢数组 = 地牢;
			            待保存楼层数据.房间列表 = 房间列表;
			            待保存楼层数据.门实例列表 = 门实例列表;
			            if (通过楼梯切换) {
			                待保存楼层数据.玩家位置 = { x: 玩家.x, y: 玩家.y };
			            } else {
			                if (!待保存楼层数据.玩家位置) {
			                    待保存楼层数据.玩家位置 = { x: 玩家初始位置.x, y: 玩家初始位置.y };
			                }
			            }
			            待保存楼层数据.上锁房间列表 = 上锁房间列表;
			            待保存楼层数据.已访问房间 = 已访问房间;
			            待保存楼层数据.地牢生成方式 = 地牢生成方式;
			            待保存楼层数据.已揭示洞穴格子 = deepClone(已揭示洞穴格子);
			            待保存楼层数据.房间地图 = 房间地图;
			            待保存楼层数据.所有怪物 = 所有怪物;
			            待保存楼层数据.玩家初始位置 = { x: 玩家初始位置.x, y: 玩家初始位置.y };
			            待保存楼层数据.所有计时器 = 所有计时器;
			            待保存楼层数据.当前天气效果 = [...当前天气效果];
			            所有地牢层.set(当前层数, 待保存楼层数据);
			        } else {
			            传送点列表 = [];
			        }
			
			        当前层数 = 新层数;
			        已揭示洞穴格子.clear();
			
			        if (所有地牢层.has(新层数)) {
			            const 新地牢数据 = 所有地牢层.get(新层数);
			            地牢 = 新地牢数据.地牢数组;
			            地牢大小 = 地牢.length;
			            房间列表 = 新地牢数据.房间列表;
			            门实例列表 = 新地牢数据.门实例列表;
			            上锁房间列表 = 新地牢数据.上锁房间列表;
			            已访问房间 = 新地牢数据.已访问房间;
			            已揭示洞穴格子 = deepClone(新地牢数据.已揭示洞穴格子);
			            地牢生成方式 = 新地牢数据.地牢生成方式;
			            房间地图 = 新地牢数据.房间地图;
			            所有怪物 = 新地牢数据.所有怪物;
			            所有计时器 = 新地牢数据.所有计时器;
			            玩家初始位置 = 新地牢数据.玩家初始位置;
			            当前天气效果 = 新地牢数据.当前天气效果 || [];
			            if (目标坐标 && 位置是否可用(目标坐标.x, 目标坐标.y, false)) {
			                玩家.x = 目标坐标.x;
			                玩家.y = 目标坐标.y;
			            } else {
			                玩家.x = 新地牢数据.玩家位置.x;
			                玩家.y = 新地牢数据.玩家位置.y;
			            }
			        } else if (当前层数 === 5) {
			            初始化随机数生成器(当前游戏种子);
			            生成迷宫关卡();
			        } else if (当前层数 === 10) {
			            初始化随机数生成器(当前游戏种子);
			            生成法师图书馆();
			        } else if (当前层数 === 15) {
			            初始化随机数生成器(当前游戏种子);
			            生成最终首领楼层();
			        } else if (当前层数 > 15){
			            初始化随机数生成器(当前游戏种子);
			            生成沉没的迷宫();
			            显示通知('喜悦...或是不甘？','信息');
			            彩蛋1触发 = true;
			        } else {
			            初始化随机数生成器(当前游戏种子);
			            for (let i=0;i<当前层数;i++) prng()
			            if(当前层数===0) {
			                当前出战宠物列表 = [];
			                
			            }
			            const 能量条 = document.querySelector(".power-bar");
			        if (能量条 && 玩家属性.初始能量加成 > 0) {
			            const 当前能量 = parseFloat(能量条.style.width) || 0;
			            能量条.style.width = `${Math.min(100, 当前能量 + 玩家属性.初始能量加成/自定义全局设置.初始能量值*100)}%`;
			        }
			            房间列表 = [];
			            上锁房间列表 = [];
			            所有怪物 = [];
			            所有计时器 = [];
			            已访问房间 = new Set();
			            房间地图 = Array(地牢大小).fill().map(() => Array(地牢大小).fill(-1));
			            门实例列表 = new Map();
			            
			            if (当前层数 !== null && 当前层数 % 3 === 0 && 当前层数 !== 0) {
			                生成天气效果();
			            } else {
			                当前天气效果 = [];
			            }
			            生成地牢();
			            //更新洞穴视野();
			            生成并放置随机配方卷轴(当前层数);
			            玩家.x = 玩家初始位置.x;
			            玩家.y = 玩家初始位置.y;
			        }
						当前出战宠物列表.forEach(pet => {
    if (!pet || !pet.是否已放置) return;
	const 瞬间移动 = Object.values(pet.自定义数据.get("装备") || {}).find(item => item instanceof 瞬间移动饰品);
			            if (瞬间移动) {
			                pet.瞬移到玩家身旁();
			            }
});
			
			        更新视口();
			        绘制小地图();
			        更新界面状态();
			        更新物体指示器();
			        更新洞穴视野();
			        所有怪物.forEach((m) => { m.绘制血条(true); });
			        移动玩家(0, 0);
			        if (typeof onCompleteCallback === 'function') {
			            onCompleteCallback(); 
			        }
			        
			
			        标题.style.opacity = 0;
			        标题.style.transform = "scale(0.5)";
			        遮罩.style.opacity = 0;
			    }, 1200);
			
			}


			function 保存传送点() {
			    if (传送点列表.length >= 最大传送点数量) {
			        显示通知(
			            `最多只能保存 ${最大传送点数量} 个传送点！`,
			            "错误"
			        );
			        return;
			    }
			    if (当前层数 === null) {
			        显示通知(`不能在当前楼层设置传送点！`, "错误");
			        return;
			    }
			    if (
			        当前天气效果.includes("诡魅") ||
			        当前天气效果.includes("深夜")
			    ) {
			        显示通知(`奇怪的气氛阻止了传送点的保存...`, "错误");
			        return;
			    }
			    const 当前位置标识 = `${当前层数}-${玩家.x}-${玩家.y}`;
			    // 检查是否已在完全相同的位置保存过
			    if (
			        传送点列表.some(
			            (点) => `${点.层数}-${点.x}-${点.y}` === 当前位置标识
			        )
			    ) {
			        显示通知("当前位置已存在传送点！", "警告");
			        return;
			    }
			
			    // 允许玩家输入名称，或者使用默认名称
			    let 传送点名称 = prompt(
			        `为传送点命名（可选，当前：第 ${当前层数} 层 (${玩家.x}, ${玩家.y})）：`,
			        `第 ${当前层数} 层 (${玩家.x}, ${玩家.y})`
			    );
			    if (传送点名称 === null) return; // 用户取消
			    if (传送点名称.trim() === "") {
			        传送点名称 = `第 ${当前层数} 层 (${玩家.x}, ${玩家.y})`; // 默认名称
			    }
			
			    const 新传送点 = {
			        id:
			            Date.now().toString() +
			            prng().toString(36).substring(2, 7), // 简单唯一ID
			        名称: 传送点名称,
			        层数: 当前层数,
			        x: 玩家.x,
			        y: 玩家.y,
			    };
			
			    传送点列表.push(新传送点);
			    显示通知(`传送点 "${新传送点.名称}" 已保存！`, "成功");
			}
			function 打开传送菜单() {
			    if (自定义全局设置.禁用传送菜单) {
			        显示通知("此关卡禁用了传送菜单。", "警告");
			        return;
			    }
			    if (当前天气效果.includes("诡魅")) {
			        显示通知("诡异的气息干扰了空间传送！", "错误");
			        return;
			    }
			    if (当前层数 % 5 === 0 && 当前层数 > 0) {
			            显示通知('当前地牢无法使用传送菜单','错误');
			            return false;
			        }
			    if (生存挑战激活) {
			            显示通知("强大的结界阻止了空间传送！", "错误");
			            return false;
			    }
			    if (游戏状态 === "地图编辑器") {
			        显示通知("不支持在地图编辑器传送", "错误");
			        return;
			    }
			    if (游戏状态 === "地图编辑器" || 游戏状态 === "死亡界面" || 游戏状态==="胜利"||游戏状态==="图鉴选择"||游戏状态==="图鉴") return;
			    const 遮罩 = document.getElementById("传送点遮罩");
			    const 菜单 = document.getElementById("传送点菜单");
			    const 列表容器 = document.getElementById("传送点列表容器");
			
			    列表容器.innerHTML = "";
			    const 标题栏 = 菜单.querySelector(".重铸弹窗-header");
			    // 检查按钮是否已存在，防止重复添加
			    let 保存按钮 = 标题栏.querySelector("#保存当前传送点按钮"); // 先查找
			    if (!保存按钮) {
			        // 不存在则创建
			        保存按钮 = document.createElement("button");
			        保存按钮.textContent = "保存"; // 使用图标
			        保存按钮.className = "菜单操作按钮 传送菜单按钮-保存"; // 使用新基础类和特定类
			        保存按钮.id = "保存当前传送点按钮";
			        保存按钮.onclick = (事件) => {
			            事件.stopPropagation();
			            保存传送点(); // 调用现有的保存函数
			            列表容器.innerHTML = ""; // 清空旧列表
			            刷新传送菜单();
			        };
			        const 关闭按钮实例 = 标题栏.querySelector(".关闭按钮");
			        if (关闭按钮实例) {
			            标题栏.insertBefore(保存按钮, 关闭按钮实例);
			        } else {
			            标题栏.appendChild(保存按钮);
			        }
			    }
			    刷新传送菜单();
			
			    遮罩.style.display = "block";
			    菜单.style.opacity = 0;
			    菜单.style.transform = "translate(-50%, -50%) scale(0.9)";
			    requestAnimationFrame(() => {
			        菜单.style.transition =
			            "opacity 0.3s ease, transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
			        菜单.style.opacity = 1;
			        菜单.style.transform = "translate(-50%, -50%) scale(1)";
			    });
			    玩家属性.允许移动 += 1;
			}
			function 刷新传送菜单() {
			    const 遮罩 = document.getElementById("传送点遮罩");
			    const 菜单 = document.getElementById("传送点菜单");
			    const 列表容器 = document.getElementById("传送点列表容器");
			    列表容器.innerHTML = "";
			    if (传送点列表.length === 0) {
			        列表容器.innerHTML =
			            "<p style='text-align: center; color: #888;'>没有已保存的传送点。</p>";
			    } else {
			        传送点列表.forEach((点) => {
			            const 条目元素 = document.createElement("div");
			            条目元素.className = "重铸物品"; // 复用样式
			            条目元素.style.display = "flex";
			            条目元素.style.justifyContent = "space-between";
			            条目元素.style.alignItems = "center";
			            条目元素.style.padding = "10px 15px";
			
			            const 名称元素 = document.createElement("span");
			            名称元素.textContent = `${点.名称}`;
			            名称元素.style.flexGrow = "1";
			            名称元素.style.marginRight = "10px";
			
			            const 操作容器 = document.createElement("div");
			            操作容器.style.display = "flex";
			            操作容器.style.gap = "8px"; // 稍微增大按钮间距
			
			            const 传送按钮 = document.createElement("button");
			            传送按钮.innerHTML = "传送"; // 使用图标
			            传送按钮.className = "菜单操作按钮 传送菜单按钮-传送";
			            传送按钮.onclick = (事件) => {
			                事件.stopPropagation();
			                执行传送(点.id);
			            };
			
			            const 删除按钮 = document.createElement("button");
			            删除按钮.innerHTML = "删除"; // 使用图标
			            删除按钮.className = "菜单操作按钮 传送菜单按钮-删除";
			            删除按钮.onclick = (事件) => {
			                事件.stopPropagation();
			                删除传送点(点.id);
			                列表容器.innerHTML = "";
			                刷新传送菜单();
			            };
			
			            操作容器.appendChild(传送按钮);
			            操作容器.appendChild(删除按钮);
			
			            条目元素.appendChild(名称元素);
			            条目元素.appendChild(操作容器);
			            列表容器.appendChild(条目元素);
			        });
			    }
			}
			
			function 关闭传送菜单() {
			    const 遮罩 = document.getElementById("传送点遮罩");
			    const 菜单 = document.getElementById("传送点菜单");
			    菜单.style.transition =
			        "opacity 0.3s ease, transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
			    菜单.style.opacity = 0;
			    菜单.style.transform = "translate(-50%, -50%) scale(0.9)";
			    setTimeout(() => {
			        遮罩.style.display = "none";
			        玩家属性.允许移动 -= 1;
			    }, 300); // 等待动画完成
			}
			
			function 执行传送(目标点标识) {
			    if (当前天气效果.includes("诡魅")) {
			        显示通知("诡异的气息干扰了空间传送！", "错误");
			        关闭传送菜单();
			        return;
			    }
			    if (生存挑战激活) {
			        显示通知("强大的结界阻止了传送！", "错误");
			        关闭传送菜单();
			        return;
			    }
			    const 目标点 = 传送点列表.find((点) => 点.id === 目标点标识);
			    if (!目标点) {
			        显示通知("传送目标点无效！", "错误");
			        return;
			    }
			
			    const 当前玩家房间ID = 房间地图[玩家.y][玩家.x];
			    if (当前玩家房间ID !== -1) {
			        const 当前玩家所在房间 = 房间列表[当前玩家房间ID];
			        if (
			            当前玩家所在房间 &&
			            当前玩家所在房间.类型 === "挑战房间" &&
			            当前玩家所在房间.挑战状态 &&
			            当前玩家所在房间.挑战状态.进行中
			        ) {
			            处理挑战失败(当前玩家所在房间);
			        }
			    }
			
			    关闭传送菜单();
			
			    setTimeout(() => {
			        if (目标点.层数 === 当前层数) {
			            const 目标单元格 = 地牢[目标点.y]?.[目标点.x];
			            if (
			                目标单元格 &&
			                ![单元格类型.墙壁, 单元格类型.上锁的门].includes(
			                    目标单元格.背景类型
			                )
			            ) {
			                玩家.x = 目标点.x;
			                玩家.y = 目标点.y;
			                添加日志(`已传送到 ${目标点.名称}`, "信息");
			                更新视口();
			                绘制();
			                处理怪物回合();
			                更新物体指示器();
			            } else {
			                显示通知(
			                    "目标位置无法传送！可能已被阻挡。",
			                    "错误"
			                );
			            }
			        } else {
			            切换楼层(目标点.层数, false, {
			                x: 目标点.x,
			                y: 目标点.y,
			            });
			            添加日志(`已传送到 ${目标点.名称}`, "信息");
			        }
			    }, 350);
			}
			function 删除传送点(目标点标识) {
			    const 索引 = 传送点列表.findIndex((点) => 点.id === 目标点标识);
			    if (索引 !== -1) {
			        const 删除的名称 = 传送点列表[索引].名称;
			        传送点列表.splice(索引, 1);
			        显示通知(`传送点 "${删除的名称}" 已删除。`, "成功");
			    }
			}
			function 放置楼梯(房间, 图标, 类型) {
			    const 楼梯 = {
			        类型: "楼梯",
			        图标: 图标,
			        显示图标: 图标,
			        颜色索引: 颜色表.length,
			        使用: () => {
			              let 目标层数 =
			                类型 === 单元格类型.楼梯下楼
			                    ? 当前层数 + 1
			                    : 当前层数 - 1;
			            if (当前层数===null) 目标层数 = 0;
			            切换楼层(目标层数, false, null, true);
			        },
			        唯一标识: Symbol(`楼梯_${类型}`),
			        获取名称: () =>
			            类型 === 单元格类型.楼梯下楼 ? "下楼楼梯" : "上楼楼梯",
			        自定义数据: new Map(),
			        品质: 1,
			        能否拾起: false,
			        是否正常物品: false,
			        是否隐藏: false,
			        是否为隐藏物品: false,
			        效果描述: null,
			        已装备: false,
			        装备槽位: null,
			        堆叠数量: 1,
			        最大堆叠数量: 1,
			        颜色表: 颜色表,
			    };
			    放置物品到房间(楼梯, 房间, 类型);
			}
			
			function 生成金币() {
			    const 普通房间生成概率 = 0.3;
			    const 上锁房间生成概率 = 0.7;
			    const 可用房间 = 房间列表.filter((房间) => 房间.类型 == "房间");
			    可用房间.forEach((房间) => {
			        let 生成概率 = 普通房间生成概率;
			        let 最大数量 = 9 + 当前层数;
			
			        // 上锁房间生成更多金币
			        if (上锁房间列表.some((r) => r.id === 房间.id)) {
			            生成概率 = 上锁房间生成概率;
			            最大数量 = 22 + 当前层数;
			        }
			
			        if (prng() < 生成概率) {
			            const 数量 = Math.min(
			                Math.floor(prng() * 最大数量) + 1,
			                最大堆叠数
			            );
			            const 金币实例 = new 金币({ 数量 });
			            放置物品到房间(金币实例, 房间);
			        }
			    });
			}
			function 区域是否空闲(x, y, w, h) {
			    for (let i = y; i < y + h; i++) {
			        for (let j = x; j < x + w; j++) {
			            if (
			                i >= 地牢大小 ||
			                j >= 地牢大小 ||
			                地牢[i][j].背景类型 !== 单元格类型.墙壁
			            ) {
			                return false;
			            }
			        }
			    }
			
			    // 计算缓冲区范围
			    const 缓冲距离 = 2;
			    const xStart = Math.max(0, x - 缓冲距离);
			    const xEnd = Math.min(地牢大小 - 1, x + w - 1 + 缓冲距离);
			    const yStart = Math.max(0, y - 缓冲距离);
			    const yEnd = Math.min(地牢大小 - 1, y + h - 1 + 缓冲距离);
			
			    for (let yi = yStart; yi <= yEnd; yi++) {
			        for (let xi = xStart; xi <= xEnd; xi++) {
			            // 计算到房间边缘的最小曼哈顿距离
			            let dx = 0,
			                dy = 0;
			            if (xi < x) dx = x - xi;
			            else if (xi >= x + w) dx = xi - (x + w - 1);
			
			            if (yi < y) dy = y - yi;
			            else if (yi >= y + h) dy = yi - (y + h - 1);
			
			            const 总距离 = dx + dy;
			
			            // 如果曼哈顿距离≤2且单元格非墙壁，则区域被占用
			            if (
			                总距离 <= 缓冲距离 &&
			                地牢[yi][xi].背景类型 !== 单元格类型.墙壁
			            ) {
			                return false;
			            }
			        }
			    }
			
			    return true;
			}
			
			function 放置房间(房间) {
			    for (let y = 房间.y; y < 房间.y + 房间.h; y++) {
			        for (let x = 房间.x; x < 房间.x + 房间.w; x++) {
			            const 单元格 = 地牢[y][x];
			            单元格.背景类型 = 单元格类型.房间;
			            房间地图[y][x] = 房间.id;
			            单元格.墙壁 = {
			                上: y === 房间.y,
			                下: y === 房间.y + 房间.h - 1,
			                左: x === 房间.x,
			                右: x === 房间.x + 房间.w - 1,
			            };
			        }
			    }
			    房间.已解锁 = false;
			    return true;
			}
			
			function 更新房间墙壁(房间) {
			    房间.门.forEach((门) => {
			        const { x, y } = 门;
			        if (y + 1 < 地牢大小) 地牢[y + 1][x].墙壁.上 = false;
			        if (y - 1 >= 0) 地牢[y - 1][x].墙壁.下 = false;
			        if (x + 1 < 地牢大小) 地牢[y][x + 1].墙壁.左 = false;
			        if (x - 1 >= 0) 地牢[y][x - 1].墙壁.右 = false;
			    });
			}
			
			function 处理上锁的门() {
			    const 上锁起始索引 = Math.floor(房间列表.length * 0.5);
			    const 候选房间 = 房间列表.filter(
			        (房间) =>
			            房间.门.length > 0 &&
			            房间.id >= 上锁起始索引 &&
			            房间.类型 == "房间" // 排除特殊房间
			    );
			    const 上锁数量 = Math.min(
			        候选房间.length,
			        Math.floor(prng() * 候选房间.length * 0.5) + 1
			    ); // 上锁一部分
			
			    for (let i = 0; i < 上锁数量; i++) {
			        if (候选房间.length === 0) break;
			
			        const 目标房间 = 候选房间.splice(
			            Math.floor(prng() * 候选房间.length),
			            1
			        )[0];
			
			        if (目标房间.id !== 0) {
			            // 不锁起始房间
			            const 颜色索引 = i % 颜色表.length;
			            // 遍历房间记录的主门位置
			            目标房间.门.forEach((主门位置) => {
			                const 主门单元格 = 地牢[主门位置.y]?.[主门位置.x];
			                if (主门单元格 && 主门单元格.标识) {
			                    const 门标识 = 主门单元格.标识;
			                    // 查找所有拥有相同门标识的单元格（包括主门和配对门）
			                    for (let y = 0; y < 地牢大小; y++) {
			                        for (let x = 0; x < 地牢大小; x++) {
			                            const 单元格 = 地牢[y]?.[x];
			                            if (
			                                单元格 &&
			                                单元格.标识 === 门标识 &&
			                                单元格.背景类型 === 单元格类型.门
			                            ) {
			                                单元格.背景类型 =
			                                    单元格类型.上锁的门;
			                                单元格.钥匙ID = 目标房间.id;
			                                单元格.颜色索引 = 颜色索引;
			                                // 更新门实例状态（虽然可能没直接用到，但保持一致）
			                                const 门实例 =
			                                    门实例列表.get(门标识);
			                                if (门实例) {
			                                    门实例.类型 = "上锁的门";
			                                    门实例.是否上锁 = true; // 添加一个明确的锁状态
			                                }
			                            }
			                        }
			                    }
			                }
			            });
			            // 记录上锁房间信息
			            上锁房间列表.push({ ...目标房间, 颜色索引 });
			        }
			    }
			    // 标记房间状态
			    上锁房间列表.forEach((房间) => {
			        const 原始房间 = 房间列表.find((r) => r.id === 房间.id);
			        if (原始房间) 原始房间.已解锁 = false; // 标记未解锁
			    });
			}
			
			function 生成钥匙() {
			    // 计算房间 ID 的 50% 分位点
			    const 钥匙放置截止索引 = Math.floor(房间列表.length * 0.5);
			
			    上锁房间列表.forEach((上锁房间) => {
			        const 新钥匙 = new 钥匙({
			            对应门ID: 上锁房间.id,
			            颜色索引: 上锁房间.颜色索引,
			            地牢层数: 当前层数,
			        });
			
			        // 只在房间 ID 小于 80% 分位点的房间中生成钥匙
			        const 可用房间 = 房间列表.filter(
			            (r) =>
			                !上锁房间列表.some((锁房) => 锁房.id === r.id) &&
			                r.id < 钥匙放置截止索引 &&
			                r.类型 === "房间"
			        );
			
			        const 目标房间 =
			            可用房间.length > 0
			                ? 可用房间[
			                      Math.floor(prng() * 可用房间.length)
			                  ]
			                : null; // 确保有可用房间
			
			        if (目标房间 && 放置物品到房间(新钥匙, 目标房间)) {
			            // 放置成功
			        }
			    });
			}
			
			function 寻找房间入口(房间, 避开方向 = {}) {
			    const { x, y, w, h } = 房间;
			    const 候选入口 = [];
			
			    if (!避开方向.上 && y > 0) {
			        for (let i = x + 1; i < x + w - 1; i++) {
			            if (地牢[y - 1][i].背景类型 === 单元格类型.墙壁) {
			                候选入口.push({ x: i, y: y - 1 });
			            }
			        }
			    }
			    if (!避开方向.下 && y + h < 地牢大小 - 1) {
			        for (let i = x + 1; i < x + w - 1; i++) {
			            if (地牢[y + h][i].背景类型 === 单元格类型.墙壁) {
			                候选入口.push({ x: i, y: y + h });
			            }
			        }
			    }
			    if (!避开方向.左 && x > 0) {
			        for (let i = y + 1; i < y + h - 1; i++) {
			            if (地牢[i][x - 1].背景类型 === 单元格类型.墙壁) {
			                候选入口.push({ x: x - 1, y: i });
			            }
			        }
			    }
			    if (!避开方向.右 && x + w < 地牢大小 - 1) {
			        for (let i = y + 1; i < y + h - 1; i++) {
			            if (地牢[i][x + w].背景类型 === 单元格类型.墙壁) {
			                候选入口.push({ x: x + w, y: i });
			            }
			        }
			    }
			    return 候选入口; // 直接返回数组
			}
			
			function 连接房间(房间A, 房间B, 尝试 = 0) {
			    if (!房间A || !房间B) return;
			    if (尝试 >= 6) {
			        房间A =
			            房间列表[
			                Math.floor(prng() * (房间列表.length - 2))
			            ];
			    }
			    if (尝试 >= 12) return;
			    const 相对位置 = {
			        左: 房间A.x < 房间B.x,
			        右: 房间A.x > 房间B.x,
			        上: 房间A.y < 房间B.y,
			        下: 房间A.y > 房间B.y,
			    };
			
			    const 避开方向 = {
			        起始: {
			            左: 相对位置.左,
			            右: 相对位置.右,
			            上: 相对位置.上,
			            下: 相对位置.下,
			        },
			        结束: {
			            左: 相对位置.右,
			            右: 相对位置.左,
			            上: 相对位置.下,
			            下: 相对位置.上,
			        },
			    };
			
			    const 起始候选 = 寻找房间入口(房间A, 避开方向.起始);
			    const 结束候选 = 寻找房间入口(房间B, 避开方向.结束);
			
			    if (!起始候选 || !结束候选) return;
			
			    let 起始 = null;
			    let 结束 = null;
			    let 最小距离 = Infinity;
			
			    for (const 房间起始 of 起始候选) {
			        for (const 房间结束 of 结束候选) {
			            const 距离 =
			                Math.abs(房间起始.x - 房间结束.x) +
			                Math.abs(房间起始.y - 房间结束.y);
			            if (距离 < 最小距离) {
			                最小距离 = 距离;
			                起始 = 房间起始;
			                结束 = 房间结束;
			            }
			        }
			    }
			
			    if (!起始 || !结束) {
			        return;
			    }
			
			    let 当前 = { x: 起始.x, y: 起始.y };
			    let 路径 = [当前];
			    let 门 = [];
			    let 在房间内 = false;
			    let 进入的房间 = null;
			
			    门.push({ x: 起始.x, y: 起始.y, 进入的房间: 房间A });
			
			    const x轴优先 =
			        Math.abs(结束.x - 起始.x) > Math.abs(结束.y - 起始.y);
			
			    let 上一个节点 = 当前;
			    while (当前.x !== 结束.x || 当前.y !== 结束.y) {
			        const dx = 结束.x - 当前.x;
			        const dy = 结束.y - 当前.y;
			
			        if (x轴优先 && dx !== 0) {
			            当前.x += dx > 0 ? 1 : -1;
			        } else if (dy !== 0) {
			            当前.y += dy > 0 ? 1 : -1;
			        } else if (!x轴优先 && dx !== 0) {
			            当前.x += dx > 0 ? 1 : -1;
			        }
			
			        let 附近的门数量 = [
			            { x: 当前.x, y: 当前.y - 1 },
			            { x: 当前.x, y: 当前.y + 1 },
			            { x: 当前.x - 1, y: 当前.y },
			            { x: 当前.x + 1, y: 当前.y },
			        ].reduce((数量, pos) => {
			            if (
			                pos.x >= 0 &&
			                pos.x < 地牢大小 &&
			                pos.y >= 0 &&
			                pos.y < 地牢大小
			            ) {
			                return (
			                    数量 +
			                    (地牢[pos.y][pos.x].背景类型 === 单元格类型.门)
			                );
			            }
			            return 数量;
			        }, 0);
			
			        const 碰撞房间 = 房间列表.find(
			            (房间) =>
			                当前.x >= 房间.x &&
			                当前.x <= 房间.x + 房间.w - 1 &&
			                当前.y >= 房间.y &&
			                当前.y <= 房间.y + 房间.h - 1 &&
			                房间 !== 房间A
			        );
			        if (碰撞房间 && !在房间内) {
			            在房间内 = true;
			            进入的房间 = 碰撞房间;
			            门.push({
			                x: 上一个节点.x,
			                y: 上一个节点.y,
			                进入的房间: 进入的房间,
			            });
			            附近的门数量 -= 1;
			        } else if (!碰撞房间 && 在房间内) {
			            if (当前.x !== 结束.x && 当前.y !== 结束.y) {
			                门.push({
			                    x: 当前.x,
			                    y: 当前.y,
			                    进入的房间: 进入的房间,
			                });
			                路径.push({ x: 当前.x, y: 当前.y });
			                在房间内 = false;
			            }
			            附近的门数量 -= 1;
			        }
			        if (
			            地牢[当前.y][当前.x].背景类型 === 单元格类型.门 ||
			            附近的门数量 > 1
			        ) {
			            let 路径 = [];
			            let 门 = [];
			            return 连接房间(房间A, 房间B, 尝试 + 1);
			        }
			        if (
			            路径.length === 0 &&
			            地牢[当前.y][当前.x].背景类型 === 单元格类型.走廊
			        ) {
			            let 路径 = [];
			            let 门 = [];
			            return 连接房间(房间A, 房间B, 尝试 + 1);
			        }
			        if (!在房间内) {
			            路径.push({ x: 当前.x, y: 当前.y });
			        }
			        上一个节点 = { x: 当前.x, y: 当前.y };
			    }
			
			    if (!在房间内) {
			        门.push({ x: 结束.x, y: 结束.y, 进入的房间: 房间B });
			        路径.push(结束);
			    }
			    门.forEach((door) => {
			        放置门(door.x, door.y, door.进入的房间);
			    });
			    return 路径;
			}
			
			function 生成走廊(路径) {
			    for (let i = 0; i < 路径.length; i++) {
			        const { x, y } = 路径[i];
			
			        // 确定偏移方向（尝试保持一致性，例如优先向右/向下偏移）
			        let adjX = x,
			            adjY = y;
			        if (i < 路径.length - 1) {
			            // 根据下一个点确定方向
			            const nextX = 路径[i + 1].x;
			            const nextY = 路径[i + 1].y;
			            if (nextX === x) {
			                // 垂直移动
			                adjX = x + 1; // 尝试向右偏移
			            } else {
			                // 水平移动
			                adjY = y + 1; // 尝试向下偏移
			            }
			        } else if (i > 0) {
			            // 根据上一个点确定方向（路径末端）
			            const prevX = 路径[i - 1].x;
			            const prevY = 路径[i - 1].y;
			            if (prevX === x) {
			                // 垂直移动
			                adjX = x + 1;
			            } else {
			                // 水平移动
			                adjY = y + 1;
			            }
			        }
			
			        // 放置主路径单元格
			        if (
			            地牢[y]?.[x] &&
			            地牢[y][x].背景类型 === 单元格类型.墙壁
			        ) {
			            地牢[y][x].背景类型 = 单元格类型.走廊;
			            地牢[y][x].墙壁 = {
			                上: false,
			                右: false,
			                下: false,
			                左: false,
			            }; // 清除墙壁
			            地牢[y][x].配对单元格位置 = { x: adjX, y: adjY }; // 记录伙伴位置
			        }
			
			        // 放置相邻单元格
			        if (
			            adjX >= 0 &&
			            adjX < 地牢大小 &&
			            adjY >= 0 &&
			            adjY < 地牢大小 &&
			            地牢[adjY]?.[adjX]
			        ) {
			            if (地牢[adjY][adjX].背景类型 === 单元格类型.墙壁) {
			                地牢[adjY][adjX].背景类型 = 单元格类型.走廊;
			                地牢[adjY][adjX].墙壁 = {
			                    上: false,
			                    右: false,
			                    下: false,
			                    左: false,
			                }; // 清除墙壁
			                地牢[adjY][adjX].配对单元格位置 = { x: x, y: y }; // 记录伙伴位置
			            }
			        }
			    }
			    // 单独处理墙壁清除，确保相邻的走廊单元格之间没有墙
			    路径.forEach(({ x, y }) => {
			        if (
			            !地牢[y]?.[x] ||
			            地牢[y][x].背景类型 !== 单元格类型.走廊
			        )
			            return;
			
			        const adjPos = 地牢[y][x].配对单元格位置;
			        if (
			            adjPos &&
			            地牢[adjPos.y]?.[adjPos.x]?.背景类型 === 单元格类型.走廊
			        ) {
			            // 根据相对位置清除墙壁
			            if (adjPos.x > x) {
			                // 相邻在右侧
			                地牢[y][x].墙壁.右 = false;
			                地牢[adjPos.y][adjPos.x].墙壁.左 = false;
			            } else if (adjPos.x < x) {
			                // 相邻在左侧
			                地牢[y][x].墙壁.左 = false;
			                地牢[adjPos.y][adjPos.x].墙壁.右 = false;
			            } else if (adjPos.y > y) {
			                // 相邻在下方
			                地牢[y][x].墙壁.下 = false;
			                地牢[adjPos.y][adjPos.x].墙壁.上 = false;
			            } else if (adjPos.y < y) {
			                // 相邻在上方
			                地牢[y][x].墙壁.上 = false;
			                地牢[adjPos.y][adjPos.x].墙壁.下 = false;
			            }
			        }
			        // 清除与路径中上一个点的墙壁
			        const prevIndex =
			            路径.findIndex((p) => p.x === x && p.y === y) - 1;
			        if (prevIndex >= 0) {
			            const prev = 路径[prevIndex];
			            if (
			                地牢[prev.y]?.[prev.x]?.背景类型 === 单元格类型.走廊
			            ) {
			                if (prev.x === x) {
			                    // 垂直连接
			                    if (prev.y < y) {
			                        地牢[y][x].墙壁.上 = false;
			                        地牢[prev.y][prev.x].墙壁.下 = false;
			                    } else {
			                        地牢[y][x].墙壁.下 = false;
			                        地牢[prev.y][prev.x].墙壁.上 = false;
			                    }
			                } else {
			                    // 水平连接
			                    if (prev.x < x) {
			                        地牢[y][x].墙壁.左 = false;
			                        地牢[prev.y][prev.x].墙壁.右 = false;
			                    } else {
			                        地牢[y][x].墙壁.右 = false;
			                        地牢[prev.y][prev.x].墙壁.左 = false;
			                    }
			                }
			                // 同时清除配对单元格与上一个配对单元格的墙
			                const prevAdjPos =
			                    地牢[prev.y]?.[prev.x]?.配对单元格位置;
			                const currentAdjPos = 地牢[y]?.[x]?.配对单元格位置;
			                if (
			                    prevAdjPos &&
			                    currentAdjPos &&
			                    地牢[prevAdjPos.y]?.[prevAdjPos.x]?.背景类型 ===
			                        单元格类型.走廊 &&
			                    地牢[currentAdjPos.y]?.[currentAdjPos.x]
			                        ?.背景类型 === 单元格类型.走廊
			                ) {
			                    if (prevAdjPos.x === currentAdjPos.x) {
			                        // 垂直连接
			                        if (prevAdjPos.y < currentAdjPos.y) {
			                            地牢[currentAdjPos.y][
			                                currentAdjPos.x
			                            ].墙壁.上 = false;
			                            地牢[prevAdjPos.y][
			                                prevAdjPos.x
			                            ].墙壁.下 = false;
			                        } else {
			                            地牢[currentAdjPos.y][
			                                currentAdjPos.x
			                            ].墙壁.下 = false;
			                            地牢[prevAdjPos.y][
			                                prevAdjPos.x
			                            ].墙壁.上 = false;
			                        }
			                    } else {
			                        // 水平连接
			                        if (prevAdjPos.x < currentAdjPos.x) {
			                            地牢[currentAdjPos.y][
			                                currentAdjPos.x
			                            ].墙壁.左 = false;
			                            地牢[prevAdjPos.y][
			                                prevAdjPos.x
			                            ].墙壁.右 = false;
			                        } else {
			                            地牢[currentAdjPos.y][
			                                currentAdjPos.x
			                            ].墙壁.右 = false;
			                            地牢[prevAdjPos.y][
			                                prevAdjPos.x
			                            ].墙壁.左 = false;
			                        }
			                    }
			                }
			            }
			        }
			    });
			}
			
			function 是否在任意房间内(x, y) {
			    return 房间列表.some(
			        (房间) =>
			            x >= 房间.x &&
			            x < 房间.x + 房间.w &&
			            y >= 房间.y &&
			            y < 房间.h
			    ); //可改为直接判断单元格类型
			}
			
			function 放置门(x, y, 目标房间) {
			    if (x < 0 || x >= 地牢大小 || y < 0 || y >= 地牢大小) return;
			
			    // --- 确定门的方向和相邻位置 ---
			    let adjX = -1,
			        adjY = -1;
			    let isVerticalDoor = false; // 门是垂直放置（左右打开）还是水平放置（上下打开）
			
			    // 检查左右是否是房间或走廊
			    const leftCell = 地牢[y]?.[x - 1];
			    const rightCell = 地牢[y]?.[x + 1];
			    if (
			        (leftCell && leftCell.背景类型 !== 单元格类型.墙壁) ||
			        (rightCell && rightCell.背景类型 !== 单元格类型.墙壁)
			    ) {
			        const upCell = 地牢[y - 1]?.[x];
			        const downCell = 地牢[y + 1]?.[x];
			        if (
			            (upCell && upCell.背景类型 !== 单元格类型.墙壁) ||
			            (downCell && downCell.背景类型 !== 单元格类型.墙壁)
			        ) {
			            adjX = -1;
			            adjY = -1;
			        } else {
			            isVerticalDoor = true;
			            adjY = y + 1; // 尝试在下方放置配对门
			            adjX = x;
			        }
			    } else {
			        // 检查上下是否是房间或走廊
			        const upCell = 地牢[y - 1]?.[x];
			        const downCell = 地牢[y + 1]?.[x];
			        if (
			            (upCell && upCell.背景类型 !== 单元格类型.墙壁) ||
			            (downCell && downCell.背景类型 !== 单元格类型.墙壁)
			        ) {
			            isVerticalDoor = false; // 水平放置
			            adjX = x + 1; // 尝试在右方放置配对门
			            adjY = y;
			        } else {
			            adjX = -1;
			            adjY = -1;
			        }
			    }
			
			    // --- 创建逻辑门实例 ---
			    const 新门 = new 门({
			        关联房间ID: 目标房间.id,
			        位置: { x, y }, // 主单元格位置
			    });
			    let mainDoorOrientation = null;
			    if (isVerticalDoor) {
			        mainDoorOrientation = "EW";
			    } else {
			        mainDoorOrientation = "NS";
			    }
			
			    // --- 放置第一个门单元格 ---
			    if (地牢[y]?.[x]) {
			        地牢[y][x].标识 = 新门.唯一标识;
			        地牢[y][x].关联物品 = null;
			        地牢[y][x].背景类型 = 单元格类型.门;
			        地牢[y][x].墙壁 = {
			            上: false,
			            右: false,
			            下: false,
			            左: false,
			        }; // 清除所有墙
			        // 清除周围单元格对着门方向的墙壁
			        if (地牢[y]?.[x + 1]) 地牢[y][x + 1].墙壁.左 = false;
			        if (地牢[y]?.[x - 1]) 地牢[y][x - 1].墙壁.右 = false;
			        if (地牢[y + 1]?.[x]) 地牢[y + 1][x].墙壁.上 = false;
			        if (地牢[y - 1]?.[x]) 地牢[y - 1][x].墙壁.下 = false;
			        地牢[y][x].配对单元格位置 = { x: adjX, y: adjY };
			        地牢[y][x].isOneWay = false; // Initialize
			        地牢[y][x].oneWayAllowedDirection = null; // Initialize
			        地牢[y][x].doorOrientation = mainDoorOrientation;
			        地牢[y][x].主 = true;
			    } else {
			        console.error(`尝试在无效位置 (${x}, ${y}) 放置门`);
			        return;
			    }
			
			    // --- 放置第二个（配对）门单元格 ---
			    let 配对门放置成功 = false;
			    if (
			        adjX >= 0 &&
			        adjX < 地牢大小 &&
			        adjY >= 0 &&
			        adjY < 地牢大小 &&
			        地牢[adjY]?.[adjX]
			    ) {
			        const 配对门 = new 门({
			            关联房间ID: 目标房间.id,
			            位置: { x: adjX, y: adjY },
			        });
			        // 检查配对位置是否为墙壁，避免覆盖房间或走廊
			        if (地牢[adjY][adjX].背景类型 === 单元格类型.墙壁) {
			            地牢[adjY][adjX].标识 = 配对门.唯一标识;
			            地牢[adjY][adjX].关联物品 = null;
			            地牢[adjY][adjX].背景类型 = 单元格类型.门;
			            地牢[adjY][adjX].墙壁 = {
			                上: false,
			                右: false,
			                下: false,
			                左: false,
			            }; // 清除所有墙
			            地牢[adjY][adjX].配对单元格位置 = { x: x, y: y }; // 指回主单元格
			            地牢[adjY][adjX].isOneWay = false; // Initialize
			            地牢[adjY][adjX].oneWayAllowedDirection = null; // Initialize
			            地牢[adjY][adjX].doorOrientation = mainDoorOrientation;
			            配对门放置成功 = true;
			
			            // 清除周围单元格对着配对门方向的墙壁
			            if (地牢[adjY]?.[adjX + 1])
			                地牢[adjY][adjX + 1].墙壁.左 = false;
			            if (地牢[adjY]?.[adjX - 1])
			                地牢[adjY][adjX - 1].墙壁.右 = false;
			            if (地牢[adjY + 1]?.[adjX])
			                地牢[adjY + 1][adjX].墙壁.上 = false;
			            if (地牢[adjY - 1]?.[adjX])
			                地牢[adjY - 1][adjX].墙壁.下 = false;
			        } else {
			            // 如果配对位置不是墙，主门仍然放置，但没有配对门
			            地牢[y][x].配对单元格位置 = null; // 主门没有配对
			            console.warn(
			                `门的配对位置 (${adjX}, ${adjY}) 不是墙壁，只放置了单个门在 (${x}, ${y})`
			            );
			        }
			    } else {
			        // 如果配对位置无效，主门仍然放置，但没有配对门
			        地牢[y][x].配对单元格位置 = null;
			        console.warn(
			            `门的配对位置 (${adjX}, ${adjY}) 超出边界，只放置了单个门在 (${x}, ${y})`
			        );
			    }
			
			    // --- 清除两个门单元格之间的墙壁 ---
			    if (配对门放置成功) {
			        if (isVerticalDoor) {
			            // 垂直放置的门，清除上下墙
			            地牢[y][x].墙壁.下 = false;
			            地牢[adjY][adjX].墙壁.上 = false;
			        } else {
			            // 水平放置的门，清除左右墙
			            地牢[y][x].墙壁.右 = false;
			            地牢[adjY][adjX].墙壁.左 = false;
			        }
			    }
			
			    if (
			        目标房间 &&
			        !目标房间.门.some((d) => d.x === x && d.y === y)
			    ) {
			        目标房间.门.push({ x, y });
			        if (配对门放置成功) 目标房间.门.push({ x: adjX, y: adjY });
			    }
			}
			function randomlySetOneWayDirection(doorCell) {
			    if (!doorCell || !doorCell.doorOrientation) {
			        console.error(
			            "Cannot set one-way direction: doorCell or its orientation is invalid.",
			            doorCell
			        );
			        return null; // Or a default
			    }
			    if (doorCell.doorOrientation === "NS") {
			        return prng() < 0.5 ? "N" : "S"; // Allow passage North or South
			    } else if (doorCell.doorOrientation === "EW") {
			        return prng() < 0.5 ? "E" : "W"; // Allow passage East or West
			    }
			    return null; // Should not happen
			}
			
			function getMoveDirection(fromX, fromY, toX, toY) {
			    if (toX > fromX) return "E";
			    if (toX < fromX) return "W";
			    if (toY > fromY) return "S";
			    if (toY < fromY) return "N";
			    return null;
			}
			function 放置物品到房间(
			    物品实例,
			    目标房间,
			    放置物体 = 单元格类型.物品,
			    禁用光晕 = false,
			    特效 = false,
			    无视怪物 = false
			) {
			    // 寻找有效放置位置
			    let 放置成功 = false;
			    for (let 尝试次数 = 0; 尝试次数 < 20; 尝试次数++) {
			        // 计算房间有效区域
			        const 最小x = 目标房间.x;
			        const 最大x = 目标房间.x + 目标房间.w - 1;
			        const 最小y = 目标房间.y;
			        const 最大y = 目标房间.y + 目标房间.h - 1;
			
			        
			        const x =
			            最小x + Math.floor(prng() * (最大x - 最小x + 1));
			        const y =
			            最小y + Math.floor(prng() * (最大y - 最小y + 1));
			
			        // 验证位置有效性
			        if (位置是否可用(x, y,false,无视怪物)&& !地牢[y][x].关联物品) {
			            地牢[y][x].类型 = 放置物体;
			            地牢[y][x].关联物品 = 物品实例;
			            if (物品实例.颜色索引 === null || 禁用光晕) {
			                物品实例.颜色索引 = 物品实例.颜色表.length;
			            }
			            物品实例.x = x;
			            物品实例.y = y;
			            地牢[y][x].颜色索引 = 物品实例.颜色索引;
			            
			            放置成功 = true;
			            if (特效)
			                计划显示格子特效(
			                    [{ x: x, y: y }],
			                    物品实例.颜色表[物品实例.颜色索引].slice(1)
			                );
			            break;
			        }
			    }
			    return 放置成功;
			}
			function 放置物品到单元格(
			    物品实例,
			    x,
			    y,
			    放置物体 = 单元格类型.物品,
			    禁用光晕 = false,
			    无视怪物 = false
			) {
			    // 验证位置有效性
			    if (位置是否可用(x, y, false,无视怪物) && !地牢[y][x].关联物品) {
			        地牢[y][x].类型 = 放置物体;
			        地牢[y][x].关联物品 = 物品实例;
			        if (物品实例.颜色索引 === null || 禁用光晕) {
			            物品实例.颜色索引 = 物品实例.颜色表.length;
			        }
			        物品实例.x = x;
			        物品实例.y = y;
			        if (物品实例 instanceof 远射植物 || 物品实例 instanceof 护卫植物 || 物品实例 instanceof 刷怪笼 || 物品实例 instanceof 开关脉冲器) {
			if (!所有计时器.some(t => t.唯一标识 === 物品实例.唯一标识)) {
			     所有计时器.push(物品实例);
			}
			        }
			        if (物品实例 instanceof 沉浸式传送门 && !所有传送门.includes(物品实例)) {
			    所有传送门.push(物品实例);
			}
			        地牢[y][x].颜色索引 = 物品实例.颜色索引;
			        return true;
			    }
			    return false;
			}
			
			function 位置是否可用(x, y, 考虑玩家 = true,无视怪物 = false) {
			    // 边界检查
			    if (x < 0 || x >= 地牢大小 || y < 0 || y >= 地牢大小 || 地牢?.length == 0)
			        return false;
			    if (考虑玩家 && 玩家.x === x && 玩家.y === y) return false;
				if (当前出战宠物列表.some(p => p.x === x && p.y === y)) return false;
			    const 单元格 = 地牢[y][x];
			
			    // 必须是房间地板且没有其他物品
			    return (
			        [单元格类型.房间, 单元格类型.走廊, 单元格类型.门].includes(
			            单元格.背景类型
			        ) &&
			        (!单元格.关联物品 || !单元格.关联物品?.阻碍怪物 ) &&
			        (!单元格.关联怪物 || 无视怪物)
			    );
			}
			let 互动按钮长按定时器 = null;
			let 互动按钮触摸移动 = false;
			let 互动按钮长按已触发 = false;
			const 互动按钮 = document.getElementById("互动按钮");
			if (互动按钮) {
				互动按钮.addEventListener('touchstart', (e) => {
					e.preventDefault();
					互动按钮触摸移动 = false;
					互动按钮长按已触发 = false;
					clearTimeout(互动按钮长按定时器);
					互动按钮长按定时器 = setTimeout(() => {
					    const inGameStates = ["游戏中", "编辑器游玩", "图鉴"];
						if (!互动按钮触摸移动 && inGameStates.includes(游戏状态)) {
							互动按钮长按已触发 = true;
							开始休息();
						}
					}, 500);
				}, { passive: false });


				互动按钮.addEventListener('touchend', (e) => {
					e.preventDefault();
					clearTimeout(互动按钮长按定时器);
					if (互动按钮长按已触发) {
						停止休息();
					} else if (!互动按钮触摸移动) {
						
						互动按钮.click();
					}
				}, { passive: false });

				互动按钮.addEventListener('touchcancel', (e) => {
					clearTimeout(互动按钮长按定时器);
					if (玩家正在休息) {
						停止休息();
					}
				}, { passive: false });
			}
			//修改时记得同步修改使用背包物品
			            function 尝试互动() {
			    if (游戏状态 === '地图编辑器') {
			        const 互动按钮元素 = document.getElementById('互动按钮');
			        if (编辑器状态.模式 === '传送') {
			            编辑器状态.模式 = '编辑';
			            显示通知("已切换到编辑模式", '信息');
			            互动按钮元素.style.background = '';
			        } else {
			            旧编辑器状态 = 编辑器状态.模式;
			            编辑器状态.模式 = '传送';
			            document.getElementById('笔刷工具容器').style.display = 'none';
			            显示通知("传送模式已开启：点击地图进行传送", '信息');
			            互动按钮元素.style.background = '#2196F3';
			        }
			        编辑器状态.当前选中 = null;
			        document.querySelectorAll('#背包物品栏 .物品条目').forEach(el => el.classList.remove('active'));
			        return;
			    }
			
			    //if (互动冷却) return;
			    //互动冷却 = true;
			    //setTimeout(() => (互动冷却 = false), 500);
			    
			    const 发现的隐藏陷阱 = [];
			    const 侦测范围 = 1; 
			
			    for (let dy = -侦测范围; dy <= 侦测范围; dy++) {
			        for (let dx = -侦测范围; dx <= 侦测范围; dx++) {
			            const 目标X = 玩家.x + dx;
			            const 目标Y = 玩家.y + dy;
			
			            if (目标X < 0 || 目标X >= 地牢大小 || 目标Y < 0 || 目标Y >= 地牢大小) continue;
			
			            const 单元格 = 地牢[目标Y][目标X];
			            if (单元格 && 单元格.关联物品 && (单元格.关联物品 instanceof 陷阱基类 || 单元格.关联物品 instanceof 隐形毒气陷阱) && 单元格.关联物品.是否为隐藏物品) {
			                发现的隐藏陷阱.push(单元格.关联物品);
			            }
			        }
			    }
			
			    if (发现的隐藏陷阱.length > 0) {
			        const 能量消耗 = 5;
			        if (扣除能量(能量消耗)) {
			            发现的隐藏陷阱.forEach(陷阱 => {
			                陷阱.是否为隐藏物品 = false;
			                陷阱.自定义数据.set("已触发", true);
			                陷阱.自定义数据.set("已发现", true);
			                陷阱.图标 = 陷阱.自定义数据.get('激活后图标');
			            });
			            显示通知(`你仔细探查后，发现了 ${发现的隐藏陷阱.length} 个陷阱！`, "成功");
			            
			        } else {
			            显示通知(`能量不足，无法侦测陷阱！(需要 ${能量消耗} 能量)`, "错误");
			        }
			    }
			
			    let 互动 = false;
			    const 玩家所在单元格 = 地牢[玩家.y][玩家.x];
			    if (玩家所在单元格.关联物品) {
			        if (玩家所在单元格.关联物品?.类型 === "棋子") {
			            玩家所在单元格.关联物品.能否拾起 = true;
			            if (尝试收集物品(玩家所在单元格.关联物品)) {
			                玩家所在单元格.类型 = null;
			                玩家所在单元格.关联物品 = null;
			                
			                绘制();
			                互动 = true;
			            }
			        } else if (尝试收集物品(玩家所在单元格.关联物品)) {
			            玩家所在单元格.类型 = null;
			            玩家所在单元格.关联物品 = null;
			            更新光源地图();
			            绘制();
			            互动 = true;
			        } else if (
			            玩家所在单元格.关联物品?.类型 === "NPC" &&
			            !NPC互动中
			        ) {
			            玩家所在单元格.关联物品.使用();
			            NPC互动中 = true;
			            互动 = true;
			        }
			        if (玩家所在单元格.关联物品?.尝试互动?.()) {
			            互动 = true;
			        }
			    }
				当前出战宠物列表.forEach(pet => {
    if (!pet || !pet.是否已放置) return;
	if (pet?.x===玩家.x&&pet?.y===玩家.y && pet.层数==当前层数 ) {
		pet.尝试互动();
			        互动=true;
			    }
});
			    
			
			    if (互动) return;
			
			    const 方向 = [
			        { dx: 0, dy: -1 },
			        { dx: 1, dy: 0 },
			        { dx: 0, dy: 1 },
			        { dx: -1, dy: 0 },
			    ];
			
			    for (const { dx, dy } of 方向) {
			        const 目标X = 玩家.x + dx;
			        const 目标Y = 玩家.y + dy;
			
			        if (
			            目标X < 0 ||
			            目标X >= 地牢大小 ||
			            目标Y < 0 ||
			            目标Y >= 地牢大小
			        )
			            continue;
			
			        const 单元格 = 地牢[目标Y][目标X];
			
			        if (
			            单元格.关联物品 instanceof 祭坛类 &&
			            单元格.关联物品.自定义数据.get("激活条件") ===
			                "力量考验"
			        ) {
			            const 武器 = Array.from({ length: 装备栏每页装备数 }, (_, i) =>
			                玩家装备.get(当前装备页 * 装备栏每页装备数 + i + 1)
			            )
			                .filter((v) => v != null)
			                .find(
			                    (i) =>
			                        i?.类型 === "武器" &&
			                        i?.堆叠数量 > 0 &&
			                        i?.自定义数据.get("冷却剩余") == 0
			                );
			            if (武器) {
			                单元格.关联物品.当被攻击(武器.攻击力, 玩家);
			                武器.自定义数据.set(
			                    "耐久",
			                    武器.自定义数据.get("耐久") - 武器.耐久消耗
			                );
			                if (武器.自定义数据.get("耐久") <= 0) {
			                    处理销毁物品(武器.唯一标识, true);
			                }
			                武器.自定义数据.set("冷却剩余", 武器.最终冷却回合);
			                更新装备显示();
			                互动 = true;
			                break;
			            }
			        }
			        
			        if (单元格.背景类型 === 单元格类型.上锁的门) {
			            const 对应门 = 门实例列表.get(单元格.标识);
			            const 对应钥匙 = [...玩家背包.values()].find((item) =>
			                item.可交互目标(对应门)
			            );
			            if (对应钥匙) {
			                房间列表.find(
			                    (房间) => 房间.id === 对应门.房间ID
			                )?.门?.forEach((item) => {
			                    let 房间门 = 门实例列表.get(
			                        地牢[item.y][item.x].标识
			                    );
			                    互动 = 房间门.尝试解锁(玩家背包);
			                    if (互动)
			                        地牢[房间门.所在位置.y][
			                            房间门.所在位置.x
			                        ].背景类型 = 单元格类型.门;
			                });
			                绘制();
			            }
			            if (互动) {
			                处理销毁物品(对应钥匙.唯一标识, true);
			                显示通知("解锁成功！", "成功");
			                break; 
			            }
			        } else if (快速直线检查(玩家.x, 玩家.y, 目标X, 目标Y, 1)) {
			            if (单元格.关联物品) {
			                if (单元格.关联物品?.类型 === "棋子") {
			                    单元格.关联物品.能否拾起 = true;
			                    单元格.关联物品.isActive = false;
			                    if (尝试收集物品(单元格.关联物品)) {
			                        单元格.类型 = null;
			                        单元格.关联物品 = null;
			                        绘制();
			                        互动 = true;
			                    }
			                } else if (尝试收集物品(单元格.关联物品)) {
			                    单元格.类型 = null;
			                    单元格.关联物品 = null;
			                    更新光源地图();
			                    绘制();
			                    互动 = true;
			                } else if (
			                    单元格.关联物品?.类型 === "NPC" &&
			                    !NPC互动中
			                ) {
			                    单元格.关联物品.使用();
			                    NPC互动中 = true;
			                    互动 = true;
			                    break;
			                } else if (单元格.关联物品?.尝试互动?.()) {
			            互动 = true;
			            break;
			        }
			            }
			        }
			    }
			    if (互动) {
			        更新装备显示();
			        return;
			    }
			    const 武器 = Array.from({ length: 装备栏每页装备数 }, (_, i) =>
			        玩家装备.get(当前装备页 * 装备栏每页装备数 + i + 1)
			    )
			        .filter((v) => v != null)
			        .filter(
			            (i) =>
			                i?.类型 === "武器" &&
			                i?.堆叠数量 > 0 &&
			                i?.自定义数据.get("冷却剩余") == 0 && 
			                i?.自定义数据.get("攻击目标数") > 0 && 
			                !(i instanceof 充能魔杖)
			        );
			    if (武器) {
			        let maxCount = 0;
			        let maxRange = 0; 
			        let 目标怪物,
			            目标路径 = [];
			        let 目标路径有效 = []; 
			        武器.forEach((可用武器) => {
			            maxCount = Math.max(
			                maxCount,
			                可用武器.自定义数据.get("攻击目标数")
			            );
			            if (!(可用武器 instanceof 金币手枪))
			                maxRange = Math.max(
			                    maxRange,
			                    可用武器.最终攻击范围
			                ); 
			        });
			        let { 怪物, 路径 } = 获取周围怪物(maxCount, maxRange);
			        if (怪物 && 路径) {
			            武器.forEach((可用武器) => {
			                路径 = 路径.filter(
			                    (item, index) => 怪物[index].当前生命值 > 0
			                );
			                怪物 = 怪物.filter((item) => item.当前生命值 > 0);
			                目标路径有效 = []; 
			                目标怪物 = []; 
			
			                路径.forEach((item, index) => {
			                    if (item.length <= 可用武器.最终攻击范围 + 1) {
			                        目标路径有效.push(item);
			                        目标怪物.push(怪物[index]);
			                    }
			                });
			                if (目标怪物.length > 0) {
			                    if (可用武器.使用(目标怪物, 目标路径有效,玩家)) {
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
			                                    !装备.自定义数据.get("休眠中")
			                                ) {
			                                    装备.当玩家攻击(目标怪物); 
			                                }
			                            });
			                        
			                        
			                        互动 = true;
			                    }
			                }
			            });
			        }
			    }
			
			    if (!互动) 显示通知("周围没有可互动物体了...", "信息");
			    更新装备显示();
			    return;
			}
			
			
			function 克隆物品(原始物品, 附加配置 = {}) {
			    if (!原始物品 || typeof 原始物品.constructor !== 'function') {
			        console.error("无法克隆无效的物品:", 原始物品);
			        return 原始物品;
			    }
			
			    // 1. 从原始物品构建一个基础配置对象
			    const 基础配置 = {
			        类型: 原始物品.类型,
			        名称: 原始物品.名称,
			        图标: 原始物品.图标,
			        品质: 原始物品.品质,
			        堆叠数量: 原始物品.堆叠数量,
			        最大堆叠数量: 原始物品.最大堆叠数量,
			        颜色索引: 原始物品.颜色索引,
			        强化: 原始物品.强化,
			        能否拾起: 原始物品.能否拾起,
			        是否正常物品: 原始物品.是否正常物品,
			        是否隐藏: 原始物品.是否隐藏,
			        是否为隐藏物品: 原始物品.是否为隐藏物品,
			        效果描述: 原始物品.效果描述,
			        阻碍怪物: 原始物品.阻碍怪物,
			        数据: 原始物品.自定义数据 ? Object.fromEntries(原始物品.自定义数据) : {}
			    };
			
			    // 2. 将基础配置与用户传入的附加配置深度合并
			    const 最终配置 = { ...基础配置, ...附加配置 };
			    if (基础配置.数据 && 附加配置.数据) {
			        最终配置.数据 = { ...基础配置.数据, ...附加配置.数据 };
			    }
			
			    // 3. 使用原始物品的构造函数和最终配置创建新实例
			    const 克隆实例 = new 原始物品.constructor(最终配置);
			    
			for (const 键 in 原始物品) {
			        if (Object.hasOwnProperty.call(原始物品, 键)) {
			            if (
			                键 === "自定义数据" &&
			                原始物品.自定义数据 instanceof Map
			            ) {
			                克隆实例.自定义数据 = new Map(原始物品.自定义数据);
			            } else {
			                克隆实例[键] = 原始物品[键];
			            }
			        }
			    }
			
			    克隆实例.isActive = false;
			    克隆实例.显示元素 = null;
			    克隆实例.已装备 = false;
			    克隆实例.装备槽位 = null;
			    克隆实例.唯一标识 = Symbol(
			        Date.now().toString() + prng().toString()
			    );
			
			    return 克隆实例;
			}
			
			function 获取周围怪物(数量 = 1, 范围 = null, 原位置 = 玩家) {
			    if (当前天气效果.includes("诡魅") && 范围 > 2) {
			        // 假设范围>1表示远程
			        范围 = 2;
			    }
			    let 攻击范围 = 0;
			    if (范围 === null) {
			        const 当前武器 = Array.from(
			            { length: 装备栏每页装备数 },
			            (_, i) =>
			                玩家装备.get(当前装备页 * 装备栏每页装备数 + i + 1)
			        )
			            .filter((v) => v != null)
			            .find(
			                (i) =>
			                    i.类型 === "武器" &&
			                    i.堆叠数量 > 0 &&
			                    i.自定义数据.get("冷却剩余") === 0
			            );
			        if (!当前武器) return { 路径: null, 怪物: null };
			        攻击范围 = 当前武器.最终攻击范围;
			    } else {
			        攻击范围 = 范围;
			    }
			    const 候选怪物 = [];
			    for (let dx = -攻击范围; dx <= 攻击范围; dx++) {
			        for (let dy = -攻击范围; dy <= 攻击范围; dy++) {
			            const x = 原位置.x + dx;
			            const y = 原位置.y + dy;
			            if (
			                x >= 0 &&
			                x < 地牢大小 &&
			                y >= 0 &&
			                y < 地牢大小 &&
			                地牢[y][x].关联怪物?.状态 === 怪物状态.活跃 &&
			                怪物状态表.get(地牢[y][x].关联怪物)?.类型 !== "魅惑"
			            ) {
			                const 怪物实例 = 地牢[y][x].关联怪物;
			                if (检查视线(原位置.x, 原位置.y, x, y, 攻击范围)) {
			                    候选怪物.push({
			                        怪物: 怪物实例,
			                        距离: Math.abs(dx) + Math.abs(dy),
			                        x: x,
			                        y: y,
			                    });
			                }
			            }
			        }
			    }
			    const 排序后 = 候选怪物.sort((a, b) => a.距离 - b.距离);
			    const 结果 = 排序后.slice(0, 数量);
			    const 路径数组 = [];
			    const 怪物数组 = [];
			    for (const item of 结果) {
			        let 路径 = [];
			        if (
			            快速直线检查(原位置.x, 原位置.y, item.x, item.y, 攻击范围)
			        ) {
			            路径 = 获取直线路径(原位置.x, 原位置.y, item.x, item.y);
			        } else {
			            路径 = 广度优先搜索路径(
			                原位置.x,
			                原位置.y,
			                item.x,
			                item.y,
			                攻击范围,
			                true
			            );
			        }
			        if (路径) {
			            路径.shift();
			            路径数组.push(路径);
			            怪物数组.push(item.怪物);
			        }
			    }
			    return 路径数组.length > 0
			        ? { 路径: 路径数组, 怪物: 怪物数组 }
			        : { 路径: null, 怪物: null };
			}
			function 获取直线路径(startX, startY, endX, endY) {
			    const path = [];
			    let currentX = startX;
			    let currentY = startY;
			    const dx = endX - startX;
			    const dy = endY - startY;
			    const steps = Math.max(Math.abs(dx), Math.abs(dy));
			    const xInc = dx / steps;
			    const yInc = dy / steps;
			    for (let i = 0; i <= steps; i++) {
			        const x = Math.round(currentX);
			        const y = Math.round(currentY);
			        path.push({ x: x, y: y });
			        currentX += xInc;
			        currentY += yInc;
			    }
			    return path;
			}
			// BFS U ARE MY GOD
			function 广度优先搜索路径(
			    startX,
			    startY,
			    endX,
			    endY,
			    maxSteps,
			    返回路径 = false,
			    不进入未知房间 = false,
			    路径必须可用 = false,
			) {
			    const 最小步数记录 = new Array(地牢大小)
			        .fill()
			        .map(() => new Array(地牢大小).fill(Infinity));
			    const 前驱节点 = new Array(地牢大小)
			        .fill(null)
			        .map(() => new Array(地牢大小).fill(null));
			    const 队列 = [[startX, startY, 0]];
			    最小步数记录[startY][startX] = 0;
			    const 方向 = [
			        { dx: 0, dy: -1, 当前墙: "上", 反方向墙: "下" },
			        { dx: 0, dy: 1, 当前墙: "下", 反方向墙: "上" },
			        { dx: -1, dy: 0, 当前墙: "左", 反方向墙: "右" },
			        { dx: 1, dy: 0, 当前墙: "右", 反方向墙: "左" },
			    ];
			    while (队列.length > 0) {
			        const [x, y, step] = 队列.shift();
			        if (x === endX && y === endY) {
			            if (返回路径) {
			                return 从终点回溯路径(前驱节点, endX, endY);
			            }
			            return true;
			        }
			        if (step >= maxSteps) continue;
			        for (const dir of 方向) {
			            const 新X = x + dir.dx;
			            const 新Y = y + dir.dy;
			            const 新步数 = step + 1;
			            if (
			                新X < 0 ||
			                新X >= 地牢大小 ||
			                新Y < 0 ||
			                新Y >= 地牢大小
			            )
			                continue;
			            if (新步数 >= 最小步数记录[新Y][新X]) continue;
			            const 当前单元格 = 地牢[y][x];
			            const 下一单元格 = 地牢[新Y][新X];
			            if (
			                当前单元格.墙壁[dir.当前墙] ||
			                下一单元格.墙壁[dir.反方向墙]
			            )
			                continue;
			
			            const 移动方向 = getMoveDirection(x, y, 新X, 新Y);
			            if (
			                下一单元格.isOneWay &&
			                移动方向 !== 下一单元格.oneWayAllowedDirection
			            ) {
			                continue;
			            }
			
			            if (
			                [单元格类型.墙壁, 单元格类型.上锁的门].includes(
			                    下一单元格.背景类型
			                ) || (下一单元格.关联物品?.类型 === '开关砖' && 下一单元格.关联物品?.阻碍怪物)
			            )
			                continue;
			            if (不进入未知房间&&(!已访问房间.has(房间地图[新Y][新X]) && 房间地图[新Y][新X]!==-1)) continue;
			            if (路径必须可用&&!位置是否可用(新X,新Y,false,true)) continue;
			            
			            最小步数记录[新Y][新X] = 新步数;
			            前驱节点[新Y][新X] = { x: x, y: y };
			            队列.push([新X, 新Y, 新步数]);
			        }
			    }
			    return 返回路径 ? [] : false;
			}
			function A星寻路(起始X, 起始Y, 结束X, 结束Y, 最大步数) {
    const 开放列表 = [{ x: 起始X, y: 起始Y, g: 0, h: 0, f: 0, parent: null }];
    const 已关闭集合 = new Set();
    const 方向 = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }];

    const 计算启发值 = (x, y) => Math.abs(x - 结束X) + Math.abs(y - 结束Y);

    while (开放列表.length > 0) {
        开放列表.sort((a, b) => a.f - b.f);
        const 当前节点 = 开放列表.shift();

        if (当前节点.x === 结束X && 当前节点.y === 结束Y) {
            const 路径 = [];
            let temp = 当前节点;
            while (temp) {
                路径.push({ x: temp.x, y: temp.y });
                temp = temp.parent;
            }
            return 路径.reverse();
        }

        已关闭集合.add(`${当前节点.x},${当前节点.y}`);

        if (当前节点.g >= 最大步数) continue;

        for (const dir of 方向) {
            const 新X = 当前节点.x + dir.dx;
            const 新Y = 当前节点.y + dir.dy;
            const 邻居键 = `${新X},${新Y}`;

            if (新X < 0 || 新X >= 地牢大小 || 新Y < 0 || 新Y >= 地牢大小 || 已关闭集合.has(邻居键)) continue;
            
            const 邻居单元格 = 地牢[新Y]?.[新X];
            if (!邻居单元格 || !快速检查相邻移动(当前节点.x, 当前节点.y, 新X, 新Y)) continue;
            if ([单元格类型.墙壁, 单元格类型.上锁的门].includes(邻居单元格.背景类型) || (邻居单元格.关联物品?.类型 === '开关砖' && 邻居单元格.关联物品?.阻碍怪物)) continue;
            const 移动方向 = getMoveDirection(
                    当前节点.x,
                    当前节点.y,
                    新X,
                    新Y
                );
                if (
                    邻居单元格.isOneWay &&
                    移动方向 !== 邻居单元格.oneWayAllowedDirection
                )
                   continue;


            const g分数 = 当前节点.g + 1;
            let 开放列表中的邻居 = 开放列表.find(node => node.x === 新X && node.y === 新Y);

            if (!开放列表中的邻居 || g分数 < 开放列表中的邻居.g) {
                const h分数 = 计算启发值(新X, 新Y);
                if (开放列表中的邻居) {
                    开放列表中的邻居.g = g分数;
                    开放列表中的邻居.f = g分数 + h分数;
                    开放列表中的邻居.parent = 当前节点;
                } else {
                    开放列表.push({ x: 新X, y: 新Y, g: g分数, h: h分数, f: g分数 + h分数, parent: 当前节点 });
                }
            }
        }
    }
    return null;
}
			function 从终点回溯路径(前驱节点, endX, endY) {
			    const 路径 = [];
			    let currentX = endX;
			    let currentY = endY;
			    while (前驱节点[currentY][currentX] !== null) {
			        路径.push({ x: currentX, y: currentY });
			        const tempX = 前驱节点[currentY][currentX].x;
			        const tempY = 前驱节点[currentY][currentX].y;
			        currentX = tempX;
			        currentY = tempY;
			    }
			    路径.push({ x: currentX, y: currentY });
			    return 路径.reverse();
			}
			function 检查视线(startX, startY, endX, endY, maxSteps = Infinity) {
			    const 曼哈顿距离 =
			        Math.abs(endX - startX) + Math.abs(endY - startY);
			    if (曼哈顿距离 > maxSteps) return false;
			    const 目标单元格 = 地牢[endY]?.[endX];
    if (目标单元格?.关联物品 instanceof 烟雾) {
        if (startX !== endX || startY !== endY) {
            return false;
        }
    }
			    if (startX === endX && startY === endY) return true;
			    if (快速直线检查(startX, startY, endX, endY, maxSteps)) {
			        return true;
			    }
			    return 广度优先搜索路径(startX, startY, endX, endY, maxSteps);
			}
			function 快速直线检查(startX, startY, endX, endY, maxSteps,无视物品=false) {
			    const 曼哈顿距离 =
			        Math.abs(endX - startX) + Math.abs(endY - startY);
			    if (曼哈顿距离 > maxSteps) return false;
			    if (startX === endX && startY === endY) return true;
			
			    const path = 获取直线格子(startX, startY, endX, endY);
			    if (path.length -1 > maxSteps) return false;
			
			    
			    for(let i=1; i < path.length; i++) {
			        const prev = path[i-1];
			        const curr = path[i];
			
			        if (curr.x < 0 || curr.x >= 地牢大小 || curr.y < 0 || curr.y >= 地牢大小) return false;
			        
			        const 单元格 = 地牢[curr.y][curr.x];
			
			        if (([单元格类型.墙壁, 单元格类型.上锁的门].includes(单元格.背景类型) || (单元格.关联物品?.类型 === '开关砖' && 单元格.关联物品?.阻碍怪物)) &&!无视物品) return false;
			
			        if ((Array.from(玩家装备.values()).some(item => item instanceof 潜行靴子) && 单元格.关联物品) && !(玩家.x === startX && 玩家.y === startY)) return false;
			
			        const 移动方向 = getMoveDirection(prev.x, prev.y, curr.x, curr.y);
			        if (单元格.isOneWay && 移动方向 !== 单元格.oneWayAllowedDirection) return false;
			
			        const dirs = [];
			        if (curr.x > prev.x) dirs.push("右");
			        else if (curr.x < prev.x) dirs.push("左");
			        
			        if (curr.y > prev.y) dirs.push("下");
			        else if (curr.y < prev.y) dirs.push("上");
			
			        for (const dir of dirs) {
			            const mapping = {
			                右: { 当前墙: "左", 反方向墙: "右" },
			                左: { 当前墙: "右", 反方向墙: "左" },
			                下: { 当前墙: "上", 反方向墙: "下" },
			                上: { 当前墙: "下", 反方向墙: "上" },
			            }[dir];
			            if (mapping && (地牢[curr.y][curr.x].墙壁[mapping.当前墙] || 地牢[prev.y][prev.x].墙壁[mapping.反方向墙])) {
			                return false;
			            }
			        }
			    }
			    return true;
			}
			function 获取移动方向(fromX, fromY, toX, toY) {
			    const dx = toX - fromX;
			    const dy = toY - fromY;
			    const 主要方向 =
			        Math.abs(dx) > Math.abs(dy)
			            ? dx > 0
			                ? "右"
			                : "左"
			            : dy > 0
			            ? "下"
			            : "上";
			    return {
			        右: { 当前墙: "右", 反方向墙: "左" },
			        左: { 当前墙: "左", 反方向墙: "右" },
			        下: { 当前墙: "下", 反方向墙: "上" },
			        上: { 当前墙: "上", 反方向墙: "下" },
			    }[主要方向];
			}
			
			function 计划显示格子特效(路径数组, 颜色 = "FF0000", 间隔 = 100) {
			    // 增加颜色参数，默认为红色
			    if (长按移动) {
			        //return;
			    }
			    const 可见路径 = 路径数组.filter((节点) => {
			        return (
			            节点.x >= 视口偏移X &&
			            节点.x < 视口偏移X + 相机显示边长 &&
			            节点.y >= 视口偏移Y &&
			            节点.y < 视口偏移Y + 相机显示边长
			        );
			    });
			    if (可见路径.length > 0) {
			        相机锁定 = true;
			        待显示格子特效队列.push({
			            路径: 可见路径,
			            颜色: 颜色,
			            间隔: 间隔,
			        });
			    }
			}
			function 显示格子特效(路径, 颜色 = "FF0000", 间隔 = 100) {
			    const 画布Rect = canvas.getBoundingClientRect();
			    const 特效容器 = document.getElementById("effectsContainer");
			
			    路径.forEach((节点, index) => {
			        if (!(节点.x >= 视口偏移X &&
			            节点.x < 视口偏移X + 相机显示边长 &&
			            节点.y >= 视口偏移Y &&
			            节点.y < 视口偏移Y + 相机显示边长)) return;
			        const 屏幕X = (节点.x - 当前相机X) * 单元格大小;
			        const 屏幕Y = (节点.y - 当前相机Y) * 单元格大小;
			
			        const 特效 = document.createElement("div");
			        特效.className = "攻击路径特效";
			
			        特效.style.cssText = `
			position: absolute;
			left: ${屏幕X + 画布Rect.left}px;
			top: ${屏幕Y + 画布Rect.top}px;
			width: ${单元格大小}px;
			height: ${单元格大小}px;
			background: radial-gradient(circle,
			    ${hexToRgba(颜色, 0)} 0%,
			    ${hexToRgba(颜色, 0.3)} 70%,
			    transparent 100%
			);
			opacity: 0.7;
			pointer-events: none;
			z-index: 998;
			
			        `;
			
			        const worldX = 节点.x;
			        const worldY = 节点.y;
			        const effectData = {
			            element: 特效,
			            worldX: worldX,
			            worldY: worldY,
			        };
			
			        特效容器.appendChild(特效);
			        活动DOM特效.push(effectData);
			
			        const removalDelay = 200 + index * 间隔;
			        setTimeout(function () {
			            特效.remove();
			
			            活动DOM特效 = 活动DOM特效.filter(
			                (item) => item.element !== 特效
			            );
			        }, removalDelay);
			    });
			}
			function 尝试进入特殊房间(x, y) {
			    const 房间ID = 房间地图[y][x];
			    if (房间ID === -1) return;
			    const 房间 = 房间列表.find(t=>t.id==房间ID);
			    if (
			        房间 &&
			        !房间.已连接 &&
			        房间?.类型?.slice(0, 2) === "隐藏"
			    ) {
			        连接特殊房间(房间);
			        生成墙壁();
			        const 待销毁戒指 = [];
			        玩家背包.forEach((item) => {
			            if (
			                item instanceof 寻宝戒指 &&
			                item.自定义数据.get("生效层数") === 当前层数
			            ) {
			                待销毁戒指.push(item.唯一标识);
			            }
			        });
			        待销毁戒指.forEach((id) => {
			            处理销毁物品(id, true);
			        });
			        移动玩家(0, 0);
			        绘制();
			    }
			}
			function 尝试执行吹动(实例, 移动计划, 已执行, 风向DX, 风向DY) {
			    if (已执行.has(实例)) return true;
			    if (!移动计划.has(实例)) return true;
			
			    const { 新X, 新Y, 旧X, 旧Y, 类型 } = 移动计划.get(实例);
			
			    if (
			        新X < 0 ||
			        新X >= 地牢大小 ||
			        新Y < 0 ||
			        新Y >= 地牢大小 ||
			        !检查直线移动可行性(旧X, 旧Y, 新X, 新Y, true) ||
			        [单元格类型.墙壁, 单元格类型.上锁的门].includes(
			            地牢[新Y][新X]?.背景类型
			        )
			    ) {
			        已执行.add(实例);
			        return false;
			    }
			
			    const 占用单元格 = 地牢[新Y]?.[新X];
			    const 占用者 = 占用单元格?.关联物品 || 占用单元格?.关联怪物;
			
			    if (占用者) {
			        const 不可移动类型列表 = ["楼梯", "地形", "祭坛", "折跃门"];
			        const 物品是否不可移动 =
			            占用者 instanceof 物品 &&
			            不可移动类型列表.includes(占用者.类型);
			
			        if (物品是否不可移动) {
			            已执行.add(实例);
			            if (占用者 instanceof 火焰物品) {
			                if (地牢[旧Y]?.[旧X]?.关联物品 === 实例) {
			                    地牢[旧Y][旧X].关联物品 = null;
			                    if (地牢[旧Y]?.[旧X]?.类型 === 单元格类型.物品)
			                        地牢[旧Y][旧X].类型 = null;
			                    地牢[旧Y][旧X].颜色索引 = 颜色表.length;
			                }
			                添加日志(
			                    `${实例.名称} 被吹向火焰，烧毁了！`,
			                    "信息"
			                );
			                return true;
			            }
			            return false;
			        }
			        if (移动计划.has(占用者)&&!已执行.has(占用者)) {
			            const 占用者移动成功 = 尝试执行吹动(
			                占用者,
			                移动计划,
			                已执行,
			                风向DX,
			                风向DY
			            );
			            if (!占用者移动成功) {
			                已执行.add(实例);
			                return false;
			            }
			        } else {
			            已执行.add(实例);
			            return false;
			        }
			    }
			
			    try {
			        if (类型 === "物品") {
			            if (地牢[旧Y]?.[旧X]?.关联物品 === 实例) {
			                地牢[旧Y][旧X].关联物品 = null;
			                if (地牢[旧Y]?.[旧X]?.类型 === 单元格类型.物品)
			                    地牢[旧Y][旧X].类型 = null;
			                地牢[旧Y][旧X].颜色索引 = 颜色表.length;
			            }
			
			            实例.x = 新X;
			            实例.y = 新Y;
			
			            地牢[新Y][新X].类型 = 单元格类型.物品;
			            地牢[新Y][新X].关联物品 = 实例;
			            地牢[新Y][新X].颜色索引 = 实例.颜色索引;
			
			            添加日志(
			                `${实例.名称} 被大风吹到了 (${新X},${新Y})！`,
			                "信息"
			            );
			            已执行.add(实例);
			             return true;
			        } else if (类型 === "怪物") {
			            const 旧X = 实例.x;
			            const 旧Y = 实例.y;
			            实例.恢复背景类型();
			            实例.x = 新X;
			            实例.y = 新Y;
			            实例.保存新位置类型(新X, 新Y);
			            地牢[新Y][新X].类型 = 单元格类型.怪物;
			            地牢[新Y][新X].关联怪物 = 实例;
			            添加日志(
			                `${实例.类型} 被大风吹到了 (${新X},${新Y})！`,
			                "信息"
			            );
			            实例.处理地形效果();
			            怪物动画状态.set(实例, {
			    旧逻辑X: 旧X,
			    旧逻辑Y: 旧Y,
			    目标逻辑X: 新X,
			    目标逻辑Y: 新Y,
			    视觉X: 旧X,
			    视觉Y: 旧Y,
			    动画开始时间: Date.now(),
			    正在动画: true,
			});
			        }
			        已执行.add(实例);
			        return true;
			    } catch (错误) {
			        console.error(
			            `执行移动实例 ${
			                实例?.名称 || "未知"
			            } 到 (${新X}, ${新Y}) 时出错: `,
			            错误
			        );
			        已执行.add(实例);
			        return false;
			    }
			}
			
			function 处理大风效果() {
			    const 方向列表 = [
			        { dx: 0, dy: -1 },
			        { dx: 1, dy: 0 },
			        { dx: 0, dy: 1 },
			        { dx: -1, dy: 0 },
			    ];
			    const { dx: 风向DX, dy: 风向DY } =
			        方向列表[Math.floor(prng() * 4)];
			
			    const 画布 = document.getElementById("dungeonCanvas");
			    const 画布Rect = 画布.getBoundingClientRect();
			    const 视口起始X = Math.floor(当前相机X);
			    const 视口起始Y = Math.floor(当前相机Y);
			    const 视口宽度格 = Math.ceil(画布Rect.width / 单元格大小);
			    const 视口高度格 = Math.ceil(画布Rect.height / 单元格大小);
			    const 视口结束X = Math.min(
			        地牢大小 - 1,
			        视口起始X + 视口宽度格
			    );
			    const 视口结束Y = Math.min(
			        地牢大小 - 1,
			        视口起始Y + 视口高度格
			    );
			
			    const 移动计划 = new Map();
			    const 不可移动类型列表 = ["楼梯", "地形", "祭坛", "折跃门"];
			
			    for (let y = 视口起始Y; y <= 视口结束Y; y++) {
			        for (let x = 视口起始X; x <= 视口结束X; x++) {
			            const 物品 = 地牢[y]?.[x]?.关联物品;
			            if (
			                物品 &&
			                !不可移动类型列表.includes(物品.类型) &&
			                (已访问房间.has(房间地图[y][x]) ||
			                    房间地图[y][x] === -1)
			            ) {
			                if (prng() < 大风吹动概率) {
			                    const 新X = x + 风向DX;
			                    const 新Y = y + 风向DY;
			
			                    if (
			                        新X >= 0 &&
			                        新X < 地牢大小 &&
			                        新Y >= 0 &&
			                        新Y < 地牢大小 &&
			                        ![
			                            单元格类型.墙壁,
			                            单元格类型.上锁的门,
			                        ].includes(地牢[新Y][新X]?.背景类型) &&
			                        检查直线移动可行性(x, y, 新X, 新Y, true) &&
			                        (已访问房间.has(房间地图[y][x]) ||
			                            房间地图[y][x] === -1) &&
			                        (!(物品 instanceof 隐形毒气陷阱) ||
			                        !物品.自定义数据.get('已触发'))
			                    ) {
			                        移动计划.set(物品, {
			                            新X,
			                            新Y,
			                            旧X: x,
			                            旧Y: y,
			                            类型: "物品",
			                        });
			                    }
			                }
			            }
			        }
			    }
			
			    所有怪物.forEach((怪物) => {
			        const { x, y } = 怪物;
			        if (
			            怪物.状态 === 怪物状态.活跃 &&
			            x >= 视口起始X &&
			            x <= 视口结束X &&
			            y >= 视口起始Y &&
			            y <= 视口结束Y
			        ) {
			            if (prng() < 大风吹动概率) {
			                const 新X = x + 风向DX;
			                const 新Y = y + 风向DY;
			
			                if (
			                    新X >= 0 &&
			                    新X < 地牢大小 &&
			                    新Y >= 0 &&
			                    新Y < 地牢大小 &&
			                    ![
			                        单元格类型.墙壁,
			                        单元格类型.上锁的门,
			                    ].includes(地牢[新Y][新X]?.背景类型) &&
			                    检查直线移动可行性(x, y, 新X, 新Y, true)
			                ) {
			                    移动计划.set(怪物, {
			                        新X,
			                        新Y,
			                        旧X: x,
			                        旧Y: y,
			                        类型: "怪物",
			                    });
			                }
			            }
			        }
			    });
			
			    if (
			        玩家.x >= 视口起始X &&
			        玩家.x <= 视口结束X &&
			        玩家.y >= 视口起始Y &&
			        玩家.y <= 视口结束Y
			    ) {
			        if (prng() < 大风吹动概率) {
			            const 新X = 玩家.x + 风向DX;
			            const 新Y = 玩家.y + 风向DY;
			
			            if (
			                新X >= 0 &&
			                新X < 地牢大小 &&
			                新Y >= 0 &&
			                新Y < 地牢大小 &&
			                ![单元格类型.墙壁, 单元格类型.上锁的门].includes(
			                    地牢[新Y][新X]?.背景类型
			                ) &&
			                检查直线移动可行性(玩家.x, 玩家.y, 新X, 新Y, true)
			            ) {
			                移动计划.set(玩家, {
			                    新X,
			                    新Y,
