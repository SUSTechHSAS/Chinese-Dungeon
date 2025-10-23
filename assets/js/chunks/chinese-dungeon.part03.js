			            数据: {
			                甩飞距离: 3 + (配置?.强化 ? 1 : 0),
			                ...配置.数据,
			            },
			        });
			    }
			
			    计算最大甩飞距离(起始X, 起始Y, 方向DX, 方向DY, 最大距离) {
			        let 可行终点 = { x: 起始X, y: 起始Y };
			        for (let i = 1; i <= 最大距离; i++) {
			            const 尝试X = 起始X + 方向DX * i;
			            const 尝试Y = 起始Y + 方向DY * i;
			
			            if (
			                尝试X < 0 ||
			                尝试X >= 地牢大小 ||
			                尝试Y < 0 ||
			                尝试Y >= 地牢大小
			            )
			                break;
			            if (!快速直线检查(起始X, 起始Y, 尝试X, 尝试Y, i)) break;
			            if (位置是否可用(尝试X, 尝试Y, true)) {
			                可行终点 = { x: 尝试X, y: 尝试Y };
			            }
			        }
			        return 可行终点;
			    }
			
			    使用(目标怪物列表,目标路径,使用者=玩家) {
			        if (
			            this.堆叠数量 <= 0 ||
			            this.自定义数据.get("冷却剩余") > 0
			        )
			            return 0;
			
			        if (!目标怪物列表 || 目标怪物列表.length === 0) {
			            显示通知("附近没有可甩飞的目标！", "警告");
			            return 0;
			        }
			
			        const 目标怪物 = 目标怪物列表[0];
			        if (目标怪物.当前生命值 <= 0) return 0;
			
			        const 路径 = 获取直线路径(
			            使用者.x,
			            使用者.y,
			            目标怪物.x,
			            目标怪物.y
			        );
			        if (
			            路径.length === 0 ||
			            路径.length > this.最终攻击范围 + 1
			        ) {
			            显示通知("目标太远或路径被阻挡！", "警告");
			            return 0;
			        }
			
			        const dx = 目标怪物.x - 使用者.x;
			        const dy = 目标怪物.y - 使用者.y;
			        const 甩飞距离 = this.自定义数据.get("甩飞距离");
			        let 最终X = 目标怪物.x;
			        let 最终Y = 目标怪物.y;
			        let 选择方向DX = 0;
			        let 选择方向DY = 0;
			
			        if (dx === 0) {
			            选择方向DY = dy > 0 ? 1 : -1;
			        } else if (dy === 0) {
			            选择方向DX = dx > 0 ? 1 : -1;
			        } else {
			            const 水平方向DX = dx > 0 ? 1 : -1;
			            const 水平终点 = this.计算最大甩飞距离(
			                目标怪物.x,
			                目标怪物.y,
			                水平方向DX,
			                0,
			                甩飞距离
			            );
			            const 水平距离使用者 =
			                Math.abs(水平终点.x - 使用者.x) +
			                Math.abs(水平终点.y - 使用者.y);
			
			            const 垂直方向DY = dy > 0 ? 1 : -1;
			            const 垂直终点 = this.计算最大甩飞距离(
			                目标怪物.x,
			                目标怪物.y,
			                0,
			                垂直方向DY,
			                甩飞距离
			            );
			            const 垂直距离使用者 =
			                Math.abs(垂直终点.x - 使用者.x) +
			                Math.abs(垂直终点.y - 使用者.y);
			
			            if (水平距离使用者 >= 垂直距离使用者) {
			                选择方向DX = 水平方向DX;
			                选择方向DY = 0;
			            } else {
			                选择方向DX = 0;
			                选择方向DY = 垂直方向DY;
			            }
			        }
			
			        const 最终落点 = this.计算最大甩飞距离(
			            目标怪物.x,
			            目标怪物.y,
			            选择方向DX,
			            选择方向DY,
			            甩飞距离
			        );
			        最终X = 最终落点.x;
			        最终Y = 最终落点.y;
			
			        let 总有效伤害 = 0;
			        const 原始血量 = 目标怪物.当前生命值;
			        目标怪物.受伤(this.攻击力, "玩家");
			
			        const 实际伤害 = 原始血量 - 目标怪物.当前生命值;
			        if (实际伤害 > 0) 总有效伤害 += 实际伤害;
			        if (目标怪物.当前生命值 <= 0) return 总有效伤害;
			
			        if (最终X !== 目标怪物.x || 最终Y !== 目标怪物.y) {
			            目标怪物.恢复背景类型();
			            目标怪物.x = 最终X;
			            目标怪物.y = 最终Y;
			            目标怪物.保存新位置类型(最终X, 最终Y);
			            地牢[最终Y][最终X].类型 = 单元格类型.怪物;
			            地牢[最终Y][最终X].关联怪物 = 目标怪物;
			            目标怪物.处理地形效果();
			            目标怪物.绘制血条();
			            绘制();
			            显示通知(
			                `${this.名称} 将 ${
			                    目标怪物.类型
			                } 甩飞了，造成 ${总有效伤害.toFixed(1)} 点伤害！`,
			                "成功"
			            );
			        } else {
			            显示通知(
			                `${this.名称} 击中了 ${
			                    目标怪物.类型
			                } 但未能将其甩飞，造成 ${总有效伤害.toFixed(
			                    1
			                )} 点伤害！`,
			                "信息"
			            );
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
			            `甩飞距离：${this.自定义数据.get("甩飞距离")} 格`,
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
			class 回旋镖 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "回旋镖",
			            图标: 图标映射.回旋镖,
			            品质: 2,
			            基础攻击力: 4,
			            冷却回合: 2,
			            攻击范围: 5 + (配置?.强化 ? 2 : 0),
			            耐久: 配置?.耐久 || 60,
			            强化: 配置?.强化 || false,
			            效果描述:
			                "沿直线投掷固定距离后返回，对路径上的敌人造成两次伤害。会被墙壁阻挡。",
			            攻击目标数: 5,
			            不可破坏: 配置?.不可破坏 || false,
			            附魔: 配置?.数据?.附魔 || [],
			            数据: {
			                ...配置.数据,
			            },
			        });
			    }
			    获取固定距离轴向路径(startX, startY, targetX, targetY) {
			        const path = [];
			        const fixedDistance = this.最终攻击范围;
			        const dxTotal = targetX - startX;
			        const dyTotal = targetY - startY;
			
			        let currentX = startX;
			        let currentY = startY;
			        let dirX = 0;
			        let dirY = 0;
			
			        if (Math.abs(dxTotal) >= Math.abs(dyTotal)) {
			            dirX =
			                Math.sign(dxTotal) ||
			                (prng() < 0.5 ? 1 : -1);
			            dirY = 0;
			        } else {
			            dirX = 0;
			            dirY =
			                Math.sign(dyTotal) ||
			                (prng() < 0.5 ? 1 : -1);
			        }
			
			        if (dirX === 0 && dirY === 0) return [];
			
			        for (let i = 0; i < fixedDistance; i++) {
			            const nextX = currentX + dirX;
			            const nextY = currentY + dirY;
			
			            if (
			                nextX < 0 ||
			                nextX >= 地牢大小 ||
			                nextY < 0 ||
			                nextY >= 地牢大小
			            ) {
			                break;
			            }
			            if (!检查移动可行性(currentX, currentY, nextX, nextY)) {
			                break;
			            }
			            if (地牢[nextY][nextX].背景类型 === 单元格类型.墙壁) {
			                break;
			            }
			            path.push({ x: nextX, y: nextY });
			            currentX = nextX;
			            currentY = nextY;
			        }
			        return path;
			    }
			
			    寻找直线方向目标(使用者) {
			        const 方向列表 = [
			            { dx: 0, dy: -1, 名称: "上" },
			            { dx: 0, dy: 1, 名称: "下" },
			            { dx: -1, dy: 0, 名称: "左" },
			            { dx: 1, dy: 0, 名称: "右" },
			        ];
			        let 最近目标坐标 = null;
			        let 最小距离 = Infinity;
			        const 搜索距离 = 20;
			
			        for (const 方向 of 方向列表) {
			            let 当前X = 使用者.x;
			            let 当前Y = 使用者.y;
			
			            for (let i = 1; i <= 搜索距离; i++) {
			                const 检查X = 使用者.x + 方向.dx * i;
			                const 检查Y = 使用者.y + 方向.dy * i;
			
			                if (
			                    检查X < 0 ||
			                    检查X >= 地牢大小 ||
			                    检查Y < 0 ||
			                    检查Y >= 地牢大小
			                )
			                    break;
			                if (!检查移动可行性(当前X, 当前Y, 检查X, 检查Y))
			                    break;
			                if (地牢[检查Y][检查X].背景类型 === 单元格类型.墙壁)
			                    break;
			
			                const 单元格 = 地牢[检查Y][检查X];
			                if (
			                    单元格?.关联怪物 &&
			                    单元格.关联怪物.状态 === 怪物状态.活跃
			                ) {
			                    const 距离 = i;
			                    if (距离 < 最小距离) {
			                        最小距离 = 距离;
			                        最近目标坐标 = { x: 检查X, y: 检查Y };
			                    }
			                }
			                当前X = 检查X;
			                当前Y = 检查Y;
			            }
			        }
			        return 最近目标坐标;
			    }
			    使用(目标怪物列表,目标路径,使用者=玩家) {
			        if (
			            this.堆叠数量 <= 0 ||
			            this.自定义数据.get("冷却剩余") > 0
			        )
			            return 0;
			
			        const 目标坐标 = this.寻找直线方向目标(使用者);
			        let targetDirX, targetDirY;
			        if (目标坐标) {
			            targetDirX = 目标坐标.x;
			            targetDirY = 目标坐标.y;
			        } else {
			            targetDirX = 使用者.x;
			            targetDirY = 使用者.y-1;
			        }
			        const 实际飞出路径 = this.获取固定距离轴向路径(
			            使用者.x,
			            使用者.y,
			            targetDirX,
			            targetDirY
			        );
			
			        if (实际飞出路径.length === 0) {
			            显示通知("回旋镖无法掷出（前方有障碍）！", "警告");
			            this.自定义数据.set(
			                "耐久",
			                this.自定义数据.get("耐久") - this.耐久消耗 * 0.5
			            );
			            if (this.自定义数据.get("耐久") <= 0)
			                处理销毁物品(this.唯一标识, true);
			            this.自定义数据.set(
			                "冷却剩余",
			                this.最终冷却回合
			            );
			            更新装备显示();
			            return 0;
			        }
			
			        let 总有效伤害 = 0;
			        const 击中怪物_去程 = new Set();
			        const 击中怪物_回程 = new Set();
			
			        for (const 节点 of 实际飞出路径) {
			            const 单元格 = 地牢[节点.y]?.[节点.x];
			            if (
			                单元格?.关联怪物 &&
			                单元格.关联怪物.当前生命值 > 0 &&
			                !击中怪物_去程.has(单元格.关联怪物)
			            ) {
			                const 怪物实例 = 单元格.关联怪物;
			                const 原始血量 = 怪物实例.当前生命值;
			                怪物实例.受伤(this.攻击力, "玩家");
			                const 实际伤害 = 原始血量 - 怪物实例.当前生命值;
			                if (实际伤害 > 0) 总有效伤害 += 实际伤害;
			                击中怪物_去程.add(怪物实例);
			                if (
			                    击中怪物_去程.size >=
			                    this.自定义数据.get("攻击目标数")
			                )
			                    break;
			            }
			        }
			
			        const 实际返回路径 = [];
			        let 回程当前X =
			            实际飞出路径.length > 0
			                ? 实际飞出路径[实际飞出路径.length - 1].x
			                : 使用者.x;
			        let 回程当前Y =
			            实际飞出路径.length > 0
			                ? 实际飞出路径[实际飞出路径.length - 1].y
			                : 使用者.y;
			
			        for (let i = 实际飞出路径.length - 1; i >= 0; i--) {
			            const 目标节点 = 实际飞出路径[i];
			            const 回程步X = 目标节点.x;
			            const 回程步Y = 目标节点.y;
			
			            if (
			                !检查移动可行性(
			                    回程当前X,
			                    回程当前Y,
			                    回程步X,
			                    回程步Y
			                )
			            ) {
			                break;
			            }
			            if (地牢[回程步Y][回程步X].背景类型 === 单元格类型.墙壁) {
			                break;
			            }
			
			            实际返回路径.push({ x: 回程步X, y: 回程步Y });
			
			            const 单元格 = 地牢[回程步Y]?.[回程步X];
			            if (
			                单元格?.关联怪物 &&
			                单元格.关联怪物.当前生命值 > 0 &&
			                !击中怪物_回程.has(单元格.关联怪物)
			            ) {
			                const 怪物实例 = 单元格.关联怪物;
			                const 伤害系数 = 击中怪物_去程.has(怪物实例)
			                    ? 0.8
			                    : 1;
			                const 原始血量 = 怪物实例.当前生命值;
			                怪物实例.受伤(this.攻击力 * 伤害系数, "玩家");
			                const 实际伤害 = 原始血量 - 怪物实例.当前生命值;
			                if (实际伤害 > 0) 总有效伤害 += 实际伤害;
			                击中怪物_回程.add(怪物实例);
			                if (
			                    击中怪物_回程.size >=
			                    this.自定义数据.get("攻击目标数")
			                )
			                    break;
			            }
			            回程当前X = 回程步X;
			            回程当前Y = 回程步Y;
			        }
			
			        计划显示格子特效(实际飞出路径, "00FF00");
			        if (实际返回路径.length > 0) {
			            setTimeout(() => {
			                计划显示格子特效(实际返回路径.slice(), "FFFF00");
			            }, 450);
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
			
			        const 总击中数 = new Set([
			            ...击中怪物_去程,
			            ...击中怪物_回程,
			        ]).size;
			        if (总击中数 > 0) {
			            显示通知(
			                `${
			                    this.名称
			                } 击中了 ${总击中数} 个目标，共造成 ${总有效伤害.toFixed(
			                    1
			                )} 点伤害！`,
			                "成功"
			            );
			
			            if (总有效伤害 > 0) {
			                const 所有击中怪物 = Array.from(击中怪物_去程);
			
			                this.触发通用附魔(所有击中怪物);
			            }
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
			        return super.获取提示();
			    }
			}
			
			class 闪电链法杖 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "闪电链法杖",
			            图标: 图标映射.闪电链法杖,
			            品质: 3,
			            基础攻击力: 7,
			            冷却回合: 3,
			            攻击范围: 3,
			            耐久: 配置?.耐久 || 35,
			            强化: 配置?.强化 || false,
			            效果描述:
			                "释放一道闪电链，攻击一个目标后弹射到附近其他敌人，每次弹射伤害递减。",
			            攻击目标数: 1,
			            不可破坏: 配置?.不可破坏 || false,
			            附魔: 配置?.数据?.附魔 || [],
			            数据: {
			                最大弹射次数: 3 + (配置?.强化 ? 1 : 0),
			                弹射范围: 3,
			                伤害衰减系数: 0.7,
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
			        if (!目标怪物列表?.length) return 0;
			        const 初始目标 = 目标怪物列表[0];
			        if (!初始目标 || 初始目标.当前生命值 <= 0) return 0;
			
			        let 总有效伤害 = 0;
			        const 已攻击怪物 = new Set([初始目标]);
			        let 当前目标 = 初始目标;
			        let 当前伤害 = this.攻击力;
			        const 弹射路径可视化 = [];
			
			        const 初始攻击路径 = 获取直线路径(
			            使用者.x,
			            使用者.y,
			            初始目标.x,
			            初始目标.y
			        );
			        初始攻击路径.shift();
			        计划显示格子特效(初始攻击路径, "00FFFF");
			
			        const 初始原始血量 = 初始目标.当前生命值;
			        初始目标.受伤(当前伤害, "玩家");
			        const 初始实际伤害 = 初始原始血量 - 初始目标.当前生命值;
			        if (初始实际伤害 > 0) 总有效伤害 += 初始实际伤害;
			
			        let 剩余弹射次数 = this.自定义数据.get("最大弹射次数");
			        while (剩余弹射次数 > 0 && 当前目标.当前生命值 > 0) {
			            const 下一个目标信息 = this.寻找下一个弹射目标(
			                当前目标,
			                已攻击怪物
			            );
			            if (!下一个目标信息) break;
			
			            const { 目标: 下一个目标, 路径: 弹射路径 } =
			                下一个目标信息;
			
			            当前伤害 *= this.自定义数据.get("伤害衰减系数");
			            if (当前伤害 < 1) break;
			
			            弹射路径可视化.push(弹射路径);
			
			            const 原始血量 = 下一个目标.当前生命值;
			            下一个目标.受伤(Math.round(当前伤害), "玩家");
			            const 实际伤害 = 原始血量 - 下一个目标.当前生命值;
			            if (实际伤害 > 0) 总有效伤害 += 实际伤害;
			
			            已攻击怪物.add(下一个目标);
			            当前目标 = 下一个目标;
			            剩余弹射次数--;
			        }
			
			        弹射路径可视化.forEach((路径段, index) => {
			            setTimeout(() => {
			                计划显示格子特效(路径段, "FFFF00");
			            }, 100 + index * 100);
			        });
			
			        this.自定义数据.set(
			            "耐久",
			            this.自定义数据.get("耐久") -
			                this.耐久消耗 * (已攻击怪物.size > 1 ? 1.5 : 1)
			        );
			        if (this.自定义数据.get("耐久") <= 0) {
			            处理销毁物品(this.唯一标识, true);
			            显示通知(`${this.名称} 已损坏！`, "警告");
			        }
			        this.自定义数据.set(
			            "冷却剩余",
			            this.最终冷却回合
			        );
			
			        if (已攻击怪物.size > 0) {
			            显示通知(
			                `${this.名称} 攻击了 ${
			                    已攻击怪物.size
			                } 个目标，共造成 ${总有效伤害.toFixed(1)} 点伤害！`,
			                "成功"
			            );
			            if (总有效伤害 > 0) {
			                const 所有击中怪物 = Array.from(已攻击怪物);
			                this.触发通用附魔(所有击中怪物);
			            }
			        }
			        更新装备显示();
			        return 总有效伤害;
			    }
			
			    寻找下一个弹射目标(当前怪物, 已攻击集合) {
			        const 范围 = this.自定义数据.get("弹射范围");
			        let 最近目标 = null;
			        let 最短路径 = null;
			        let 最小距离 = Infinity;
			
			        for (let dx = -范围; dx <= 范围; dx++) {
			            for (let dy = -范围; dy <= 范围; dy++) {
			                if (dx === 0 && dy === 0) continue;
			                const x = 当前怪物.x + dx;
			                const y = 当前怪物.y + dy;
			
			                if (
			                    x >= 0 &&
			                    x < 地牢大小 &&
			                    y >= 0 &&
			                    y < 地牢大小
			                ) {
			                    const 单元格 = 地牢[y][x];
			                    const 潜在目标 = 单元格?.关联怪物;
			                    if (
			                        潜在目标 &&
			                        潜在目标.当前生命值 > 0 &&
			                        !已攻击集合.has(潜在目标) &&
			                        潜在目标.状态 === 怪物状态.活跃
			                    ) {
			                        const 路径 = 广度优先搜索路径(
			                            当前怪物.x,
			                            当前怪物.y,
			                            x,
			                            y,
			                            范围,
			                            true
			                        );
			                        if (
			                            路径 &&
			                            路径.length > 1 &&
			                            路径.length <= 范围 + 1
			                        ) {
			                            const 距离 = 路径.length - 1;
			                            if (距离 < 最小距离) {
			                                最小距离 = 距离;
			                                最近目标 = 潜在目标;
			                                最短路径 = 路径.slice(1);
			                            }
			                        }
			                    }
			                }
			            }
			        }
			        return 最近目标 ? { 目标: 最近目标, 路径: 最短路径 } : null;
			    }
			
			    获取提示() {
			        let lines = super.获取提示().split("\n");
			        const specificEffectLines = [
			            `最大弹射：${this.自定义数据.get("最大弹射次数")} 次`,
			            `弹射范围：${this.自定义数据.get("弹射范围")} 格`,
			            `伤害衰减：x${this.自定义数据
			                .get("伤害衰减系数")
			                .toFixed(2)} /次`,
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
			
			class 大地猛击锤 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "大地猛击锤",
			            图标: 图标映射.大地猛击锤,
			            品质: 3,
			            基础攻击力: 10,
			            冷却回合: 5,
			            攻击范围: 2 + (配置?.强化 ? 2 : 0),
			            耐久: 配置?.耐久 || 80,
			            强化: 配置?.强化 || false,
			            效果描述:
			                "猛击地面，对自身周围小范围内的所有敌人造成伤害并有几率眩晕。",
			            攻击目标数: 99,
			            不可破坏: 配置?.不可破坏 || false,
			            附魔: 配置?.数据?.附魔 || [],
			            数据: {
			                眩晕几率: 0.3,
			                眩晕回合: 2,
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
			
			        const 范围 = this.最终攻击范围 - 1;
			        const 影响格子 = [];
			        const 击中怪物 = new Set();
			        let 总有效伤害 = 0;
			
			        for (let dx = -范围; dx <= 范围; dx++) {
			            for (let dy = -范围; dy <= 范围; dy++) {
			                const x = 使用者.x + dx;
			                const y = 使用者.y + dy;
			
			                if (
			                    x >= 0 &&
			                    x < 地牢大小 &&
			                    y >= 0 &&
			                    y < 地牢大小
			                ) {
			                    if (检查视线(使用者.x, 使用者.y, x, y, 范围 + 1)) {
			                        影响格子.push({ x, y });
			                        const 单元格 = 地牢[y][x];
			                        if (
			                            单元格?.关联怪物 &&
			                            单元格.关联怪物.当前生命值 > 0
			                        ) {
			                            const 怪物 = 单元格.关联怪物;
			                            击中怪物.add(怪物);
			                            const 原始血量 = 怪物.当前生命值;
			                            怪物.受伤(this.攻击力, "玩家");
			                            const 实际伤害 =
			                                原始血量 - 怪物.当前生命值;
			                            if (实际伤害 > 0)
			                                总有效伤害 += 实际伤害;
			
			                            if (
			                                怪物.当前生命值 > 0 &&
			                                prng() < this.眩晕几率
			                            ) {
			                                new 状态效果(
			                                    "冻结",
			                                    "#FFA500",
			                                    "晕",
			                                    this.自定义数据.get("眩晕回合"),
			                                    null,
			                                    null,
			                                    怪物
			                                );
			                                添加日志(
			                                    `${怪物.类型} 被大地猛击锤眩晕了！`,
			                                    "警告"
			                                );
			                            }
			                        }
			                    }
			                }
			            }
			        }
			
			        if (影响格子.length > 0) {
			            影响格子.forEach((格, index) => {
			                const dist =
			                    Math.abs(格.x - 使用者.x) +
			                    Math.abs(格.y - 使用者.y);
			                setTimeout(
			                    () => 计划显示格子特效([格], "A0522D"),
			                    dist * 50
			                );
			            });
			        }
			
			        this.自定义数据.set(
			            "耐久",
			            this.自定义数据.get("耐久") -
			                this.耐久消耗 * (击中怪物.size > 2 ? 1.5 : 1)
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
			                `${this.名称} 震击了 ${
			                    击中怪物.size
			                } 个目标，共造成 ${总有效伤害.toFixed(1)} 点伤害！`,
			                "成功"
			            );
			            const 所有击中怪物 = Array.from(击中怪物);
			
			            if (总有效伤害 > 0) {
			                this.触发通用附魔(所有击中怪物);
			            }
			        } else {
			            显示通知(`${this.名称} 发动了震击！`, "信息");
			        }
			
			        更新装备显示();
			        return 总有效伤害;
			    }
			    get 眩晕几率() {
			        return (
			            this.自定义数据.get("眩晕几率") + (this.强化 ? 0.15 : 0)
			        );
			    }
			    获取提示() {
			        let lines = super.获取提示().split("\n");
			        const specificEffectLines = [
			            `眩晕几率：${(this.眩晕几率 * 100).toFixed(0)}%`,
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
			
			class 穿云箭 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "穿云箭",
			            图标: 图标映射.穿云箭,
			            品质: 2,
			            基础攻击力: 5,
			            冷却回合: 3,
			            攻击范围: 8 + (配置?.强化 ? 2 : 0),
			            耐久: 配置?.耐久 || 50,
			            强化: 配置?.强化 || false,
			            效果描述:
			                "射出一支能够穿透多个敌人的箭矢，飞行固定距离。",
			            攻击目标数: 3 + (配置?.强化 ? 1 : 0),
			            不可破坏: 配置?.不可破坏 || false,
			            附魔: 配置?.数据?.附魔 || [],
			            数据: {
			                ...配置.数据,
			            },
			        });
			    }
			
			    寻找直线方向目标(使用者) {
			        const 方向列表 = [
			            { dx: 0, dy: -1, 名称: "上" },
			            { dx: 0, dy: 1, 名称: "下" },
			            { dx: -1, dy: 0, 名称: "左" },
			            { dx: 1, dy: 0, 名称: "右" },
			        ];
			        let 最近目标坐标 = null;
			        let 最小距离 = Infinity;
			        const 搜索距离 = 20;
			
			        for (const 方向 of 方向列表) {
			            let 当前X = 使用者.x;
			            let 当前Y = 使用者.y;
			
			            for (let i = 1; i <= 搜索距离; i++) {
			                const 检查X = 使用者.x + 方向.dx * i;
			                const 检查Y = 使用者.y + 方向.dy * i;
			
			                if (
			                    检查X < 0 ||
			                    检查X >= 地牢大小 ||
			                    检查Y < 0 ||
			                    检查Y >= 地牢大小
			                )
			                    break;
			                if (!检查移动可行性(当前X, 当前Y, 检查X, 检查Y))
			                    break;
			                if (地牢[检查Y][检查X].背景类型 === 单元格类型.墙壁)
			                    break;
			
			                const 单元格 = 地牢[检查Y][检查X];
			                if (
			                    单元格?.关联怪物 &&
			                    单元格.关联怪物.状态 === 怪物状态.活跃
			                ) {
			                    const 距离 = i;
			                    if (距离 < 最小距离) {
			                        最小距离 = 距离;
			                        最近目标坐标 = { x: 检查X, y: 检查Y };
			                    }
			                }
			                当前X = 检查X;
			                当前Y = 检查Y;
			            }
			        }
			        return 最近目标坐标;
			    }
			
			    获取固定距离直线路径(startX, startY, targetX, targetY) {
			        const path = [];
			        const fixedDistance = this.最终攻击范围;
			        const dxTotal = targetX - startX;
			        const dyTotal = targetY - startY;
			
			        let currentX = startX;
			        let currentY = startY;
			        let dirX = 0;
			        let dirY = 0;
			
			        if (
			            Math.abs(dxTotal) >= Math.abs(dyTotal) &&
			            dxTotal !== 0
			        ) {
			            dirX = Math.sign(dxTotal);
			            dirY = 0;
			        } else if (
			            Math.abs(dyTotal) > Math.abs(dxTotal) &&
			            dyTotal !== 0
			        ) {
			            dirX = 0;
			            dirY = Math.sign(dyTotal);
			        } else {
			            const lastMove = 移动历史[移动历史.length - 1];
			            if (lastMove === "右") {
			                dirX = 1;
			                dirY = 0;
			            } else if (lastMove === "左") {
			                dirX = -1;
			                dirY = 0;
			            } else if (lastMove === "下") {
			                dirX = 0;
			                dirY = 1;
			            } else if (lastMove === "上") {
			                dirX = 0;
			                dirY = -1;
			            } else {
			                if (prng() < 0.5) {
			                    dirX = prng() < 0.5 ? 1 : -1;
			                    dirY = 0;
			                } else {
			                    dirX = 0;
			                    dirY = prng() < 0.5 ? 1 : -1;
			                }
			            }
			        }
			        if (dirX === 0 && dirY === 0) return [];
			
			        for (let i = 0; i < fixedDistance; i++) {
			            const nextX = currentX + dirX;
			            const nextY = currentY + dirY;
			
			            if (
			                nextX < 0 ||
			                nextX >= 地牢大小 ||
			                nextY < 0 ||
			                nextY >= 地牢大小
			            )
			                break;
			            if (!检查移动可行性(currentX, currentY, nextX, nextY))
			                break;
			            if (地牢[nextY][nextX].背景类型 === 单元格类型.墙壁)
			                break;
			
			            path.push({ x: nextX, y: nextY });
			            currentX = nextX;
			            currentY = nextY;
			        }
			        return path;
			    }
			    使用(目标怪物列表,目标路径,使用者=玩家) {
			        if (
			            this.堆叠数量 <= 0 ||
			            this.自定义数据.get("冷却剩余") > 0
			        )
			            return 0;
			
			        let targetX, targetY;
			        const 方向目标坐标 = this.寻找直线方向目标(使用者);
			
			        if (方向目标坐标) {
			            targetX = 方向目标坐标.x;
			            targetY = 方向目标坐标.y;
			        } else {
			            显示通知("攻击范围内无可攻击怪物", "错误");
			            return 0;
			        }
			
			        const 实际飞行路径 = this.获取固定距离直线路径(
			            使用者.x,
			            使用者.y,
			            targetX,
			            targetY
			        );
			
			        if (实际飞行路径.length === 0) {
			            显示通知("箭矢无法射出（前方有障碍）！", "警告");
			            this.自定义数据.set(
			                "耐久",
			                this.自定义数据.get("耐久") - this.耐久消耗 * 0.5
			            );
			            if (this.自定义数据.get("耐久") <= 0)
			                处理销毁物品(this.唯一标识, true);
			            this.自定义数据.set(
			                "冷却剩余",
			                this.最终冷却回合
			            );
			            更新装备显示();
			            return 0;
			        }
			
			        let 总有效伤害 = 0;
			        const 击中怪物 = new Set();
			        let 穿透计数 = 0;
			
			        for (const 节点 of 实际飞行路径) {
			            if (穿透计数 >= this.自定义数据.get("攻击目标数"))
			                break;
			
			            const 单元格 = 地牢[节点.y]?.[节点.x];
			            if (
			                单元格?.关联怪物 &&
			                单元格.关联怪物.当前生命值 > 0 &&
			                !击中怪物.has(单元格.关联怪物)
			            ) {
			                const 怪物 = 单元格.关联怪物;
			                击中怪物.add(怪物);
			                穿透计数++;
			
			                const 原始血量 = 怪物.当前生命值;
			                怪物.受伤(this.攻击力, "玩家");
			                const 实际伤害 = 原始血量 - 怪物.当前生命值;
			                if (实际伤害 > 0) 总有效伤害 += 实际伤害;
			            }
			        }
			
			        计划显示格子特效(实际飞行路径, "C0C0C0");
			
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
			                `${this.名称} 穿透了 ${
			                    击中怪物.size
			                } 个目标，共造成 ${总有效伤害.toFixed(1)} 点伤害！`,
			                "成功"
			            );
			            const 所有击中怪物 = Array.from(击中怪物);
			
			            if (总有效伤害 > 0) {
			                this.触发通用附魔(所有击中怪物);
			            }
			        } else if (实际飞行路径.length > 0) {
			            显示通知(`${this.名称} 未击中任何目标。`, "信息");
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
			        return super.获取提示();
			    }
			}
			class 守卫者盔甲 extends 防御装备类 {
    constructor(配置) {
        super({
            名称: "守卫者盔甲",
            图标: "🛡️",
            品质: 4,
            防御力: 0,
            效果描述: `提供 ${配置?.强化 ? '10%' : '5%'} 的伤害减免，可叠加，最高85%。`,
            耐久: 配置?.耐久 || 200,
            强化: 配置?.强化 || false,
            ...配置,
        });
    }
}
			class 钢制长剑 extends 武器类 {
			    constructor(配置) {
			        super({
			            名称: "钢制长剑",
			            图标: 图标映射.钢制长剑,
			            基础攻击力: 6,
			            冷却回合: 2,
			            攻击范围: 2,
			            效果描述: "一把标准的钢剑。",
			            耐久: 配置.耐久 || 50,
			            强化: 配置.强化 || false,
			            不可破坏: 配置.不可破坏 || false,
			        });
			    }
			    获取提示() {
			        return super.获取提示();
			    }
			}
			
			class 橡木法杖 extends 武器类 {
			    constructor(配置) {
			        super({
			            名称: "橡木法杖",
			            图标: 图标映射.橡木法杖,
			            品质: 3,
			            基础攻击力: 8,
			            攻击范围: 5,
			            冷却回合: 3,
			            攻击目标数: 5,
			            效果描述: "发射魔法弹攻击多个目标。",
			            耐久: 配置.耐久 || 40,
			            强化: 配置.强化 || false,
			            不可破坏: 配置.不可破坏 || false,
			        });
			    }
			    获取提示() {
			        return super.获取提示();
			    }
			}
			
			class 沉浸式传送门 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "沉浸式传送门",
			            图标: 图标映射.沉浸式传送门,
			            品质: 5,
			            能否拾起: true,
			            是否为隐藏物品: true,
			            是否正常物品: false,
			            阻碍怪物: false,
			            效果描述: "连接两个时空节点的传送门。",
			            ...配置,
			            数据: {
			                传送门ID: 配置?.传送门ID ?? 所有传送门.slice(-1)[0]?.自定义数据?.get('传送门ID')??0,
			                ...配置.数据,
			            },
			        });
			    }
			
			    get 颜色索引() {
			        
			        return (this.自定义数据.get('传送门ID')) % 颜色表.length;
			    }
			    set 颜色索引(值) {
			    }
			    
			    当被收集(进入者) {
			        if (进入者 !== "玩家" || 玩家正在传送) return false;
			        return false;
			    }
			}
			class 冲撞牛角 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "冲撞牛角",
			            图标: 图标映射.冲撞牛角,
			            品质: 5,
			            基础攻击力: 15,
			            冷却回合: 12,
			            攻击范围: 10,
			            耐久: 配置?.耐久 || 50,
			            强化: 配置?.强化 || false,
			            效果描述:
			                "消耗能量，朝怪物最多的方向冲锋，对路径上的敌人造成伤害。",
			            攻击目标数: 99,
			            不可破坏: 配置?.不可破坏 || false,
			            数据: {
			                能量消耗: 40,
			                ...配置.数据,
			            },
			        });
			    }
			
			    使用(目标怪物列表,目标路径,使用者=玩家) {
			        if (
			            this.堆叠数量 <= 0 ||
			            this.自定义数据.get("冷却剩余") > 0
			        )
			            return false;
			        if (!扣除能量(this.自定义数据.get("能量消耗"))) {
			            显示通知("能量不足！", "错误");
			            return false;
			        }
			
			        const 方向列表 = [
			            { dx: 0, dy: -1, 名称: "上" },
			            { dx: 0, dy: 1, 名称: "下" },
			            { dx: -1, dy: 0, 名称: "左" },
			            { dx: 1, dy: 0, 名称: "右" },
			        ];
			        let 最佳方向 = null;
			        let 最大怪物数 = -1;
			
			        方向列表.forEach((方向) => {
			            let 怪物计数 = 0;
			            for (let i = 1; i <= this.最终攻击范围; i++) {
			                const 检查X = 使用者.x + 方向.dx * i;
			                const 检查Y = 使用者.y + 方向.dy * i;
			                if (
			                    !检查直线移动可行性(
			                        使用者.x,
			                        使用者.y,
			                        检查X,
			                        检查Y,
			                        true
			                    )
			                )
			                    break;
			                if (地牢[检查Y]?.[检查X]?.关联怪物) {
			                    怪物计数++;
			                }
			            }
			            if (怪物计数 > 最大怪物数) {
			                最大怪物数 = 怪物计数;
			                最佳方向 = 方向;
			            }
			        });
			
			        if (最大怪物数 <= 0) {
			            显示通知("没有可冲锋的目标方向！", "信息");
			            const 能量条 = document.querySelector(".power-bar");
			            const 当前能量 = parseFloat(能量条.style.width) || 0;
			            能量条.style.width = `${Math.min(
			                100,
			                当前能量 + this.自定义数据.get("能量消耗")/自定义全局设置.初始能量值*100
			            )}%`;
			            return false;
			        }
			
			        const 冲锋路径 = [];
			        let 最终X = 使用者.x;
			        let 最终Y = 使用者.y;
			        let 总有效伤害 = 0;
			
			        for (let i = 1; i <= this.最终攻击范围; i++) {
			            const 新X = 使用者.x + 最佳方向.dx * i;
			            const 新Y = 使用者.y + 最佳方向.dy * i;
			            if (!检查直线移动可行性(最终X, 最终Y, 新X, 新Y)) break;
			
			            冲锋路径.push({ x: 新X, y: 新Y });
			            最终X = 新X;
			            最终Y = 新Y;
			
			            const 单元格 = 地牢[新Y]?.[新X];
			            if (单元格?.关联怪物) {
			                const 原始血量 = 单元格.关联怪物.当前生命值;
			                单元格.关联怪物.受伤(this.攻击力, "玩家");
			                let 实际伤害 =
			                    原始血量 - 单元格.关联怪物?.当前生命值;
			                if (!单元格.关联怪物?.当前生命值) 实际伤害 = 原始血量;
			                if (实际伤害 > 0) 总有效伤害 += 实际伤害;
			            }
			        }
			
			        if (冲锋路径.length > 0) {
			            计划显示格子特效(冲锋路径, "FFA500");
			            const 旧玩家X = 使用者.x;
			            const 旧玩家Y = 使用者.y;
			            使用者.x = 最终X;
			            使用者.y = 最终Y;
			            if(!(使用者 instanceof 宠物)) 处理玩家着陆效果(旧玩家X, 旧玩家Y, 使用者.x, 使用者.y);
			            更新视口();
			            显示通知(
			                `发动冲锋！对路径上的敌人造成了 ${总有效伤害.toFixed(
			                    1
			                )} 点伤害！`,
			                "成功"
			            );
			        }
			
			        this.自定义数据.set(
			            "耐久",
			            this.自定义数据.get("耐久") - this.耐久消耗
			        );
			        if (this.自定义数据.get("耐久") <= 0) {
			            处理销毁物品(this.唯一标识, true);
			        }
			        this.自定义数据.set("冷却剩余", this.最终冷却回合);
			        更新装备显示();
			        return true;
			    }
			}
			class 护卫种子 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "种子",
			            名称: "护卫种子",
			            图标: 图标映射.种子,
			            品质: 2,
			            颜色索引: 1,
			            堆叠数量: 配置.数量 || 1,
			            最大堆叠数量: 16,
			            效果描述:
			                "种下一株永久存在的护卫植物，它会自动攻击周围的敌人，可以用互动键收回。",
			            数据: {
			                耐久: 配置.耐久,
			            },
			            ...配置,
			        });
			    }
			
			    使用() {
			        if (this.堆叠数量 <= 0) return false;
			        const 放置位置 = 寻找可放置位置(玩家.x, 玩家.y);
			        if (!放置位置) {
			            显示通知("周围没有合适的地方播种！", "错误");
			            return false;
			        }
			        const 护卫植物实例 = new 护卫植物({
			            强化: this.强化,
			            耐久: this.自定义数据.get("耐久"),
			        });
			        if (
			            放置物品到单元格(护卫植物实例, 放置位置.x, 放置位置.y)
			        ) {
			            
			            this.堆叠数量--;
			            显示通知("种下了护卫植物！", "成功");
			            return true;
			        }
			        return false;
			    }
			    获取提示() {
			        let 提示 = super.获取提示();
			        const 耐久 = this.自定义数据.get("耐久");
			        if (耐久 !== undefined && 耐久 !== null) {
			            const 临时植物 = new 护卫植物({ 强化: this.强化 });
			            const 原耐久 = 临时植物.自定义数据.get("原耐久");
			            提示 += `\n剩余攻击次数: ${耐久}/${原耐久}`;
			        }
			        return 提示;
			    }
			}
			
			class 护卫植物 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "植物",
			            名称: "护卫植物",
			            图标: 图标映射.护卫植物,
			            能否拾起: false,
			            是否正常物品: false,
			            阻碍怪物: false,
			            效果描述: "攻击周围的敌人。",
			            数据: {
			                倒计时: -1,
			                爆炸时间: -1,
			                攻击力: 5 + (配置.强化 ? 3 : 0),
			                耐久: 配置.耐久 || (30 + (配置.强化 ? 20 : 0)),
			                原耐久: 配置.耐久 || (30 + (配置.强化 ? 20 : 0)),
			                冷却: 2,
			                冷却剩余: 0,
			            },
			            ...配置,
			        });
			    }
			
			    尝试互动() {
			        if (玩家.x !== this.x || 玩家.y !== this.y) {
			            return false;
			        }
			        if (
			            尝试收集物品(
			                new 护卫种子({ 耐久: this.自定义数据.get("耐久") }),
			                true
			            )
			        ) {
			            this.移除自身();
			            显示通知("成功回收了护卫种子！", "成功");
			            return true;
			        } else {
			            显示通知("背包已满，无法回收种子！", "错误");
			            return false;
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
			
			    更新倒计时() {
			        let 冷却剩余 = this.自定义数据.get("冷却剩余");
			        if (冷却剩余 > 0) {
			            this.自定义数据.set("冷却剩余", 冷却剩余 - 1);
			            return;
			        }
			        let 耐久 = this.自定义数据.get("耐久");
			        if (耐久 <= 0) {
			            this.移除自身();
			            显示通知(`${this.名称} 枯萎了。`, "信息");
			            return;
			        }
			
			        const 攻击范围 = 1;
			        for (let dy = -攻击范围; dy <= 攻击范围; dy++) {
			            for (let dx = -攻击范围; dx <= 攻击范围; dx++) {
			                const 目标X = this.x + dx;
			                const 目标Y = this.y + dy;
			                if (
			                    目标X >= 0 &&
			                    目标X < 地牢大小 &&
			                    目标Y >= 0 &&
			                    目标Y < 地牢大小
			                ) {
			                    const 单元格 = 地牢[目标Y]?.[目标X];
			                    if (
			                        单元格?.关联怪物 &&
			                        单元格.关联怪物.当前生命值 > 0
			                    ) {
			                        单元格.关联怪物.受伤(
			                            this.自定义数据.get("攻击力"),
			                            this
			                        );
			                        this.自定义数据.set("耐久", 耐久 - 1);
			                        this.自定义数据.set(
			                            "冷却剩余",
			                            this.自定义数据.get("冷却")
			                        );
			                        计划显示格子特效(
			                            [{ x: 目标X, y: 目标Y }],
			                            "00FF00"
			                        );
			                        return;
			                    }
			                }
			            }
			        }
			    }
			}
			
			class 远射种子 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "种子",
			            名称: "远射种子",
			            图标: 图标映射.种子,
			            品质: 3,
			            颜色索引: 2,
			            堆叠数量: 配置.数量 || 1,
			            最大堆叠数量: 16,
			            效果描述:
			                "种下一株永久存在的远射植物，它会远程攻击并击退敌人，可以用互动键收回。",
			            数据: {
			                耐久: 配置.耐久,
			            },
			            
			        });
			    }
			
			    使用() {
			        if (this.堆叠数量 <= 0) return false;
			        const 放置位置 = 寻找可放置位置(玩家.x, 玩家.y);
			        if (!放置位置) {
			            显示通知("周围没有合适的地方播种！", "错误");
			            return false;
			        }
			        const 远射植物实例 = new 远射植物({
			            强化: this.强化,
			            耐久: this.自定义数据.get("耐久"),
			        });
			        if (
			            放置物品到单元格(远射植物实例, 放置位置.x, 放置位置.y)
			        ) {
			            
			            this.堆叠数量--;
			            显示通知("种下了远射植物！", "成功");
			            return true;
			        }
			        return false;
			    }
			    获取提示() {
			        let 提示 = super.获取提示();
			        const 耐久 = this.自定义数据.get("耐久");
			        if (耐久 !== undefined && 耐久 !== null) {
			             const 临时植物 = new 远射植物({ 强化: this.强化 });
			             const 原耐久 = 临时植物.自定义数据.get("原耐久");
			             提示 += `\n剩余攻击次数: ${耐久}/${原耐久}`;
			        }
			        return 提示;
			    }
			}
			
			class 远射植物 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "植物",
			            名称: "远射植物",
			            图标: 图标映射.远射植物,
			            能否拾起: false,
			            是否正常物品: false,
			            阻碍怪物: false,
			            效果描述: "远程攻击敌人。",
			            
			            数据: {
			                倒计时: -1,
			                爆炸时间: -1,
			                攻击力: 4 + (配置.强化 ? 2 : 0),
			                攻击范围: 6,
			                冷却: 3,
			                冷却剩余: 0,
			                耐久: 配置.耐久 || (25 + (配置.强化 ? 15 : 0)),
			            原耐久: 配置.耐久 || (25 + (配置.强化 ? 15 : 0)),
			                
			                
			            },
			            ...配置,
			        });
			    }
			
			    尝试互动() {
			        if (玩家.x !== this.x || 玩家.y !== this.y) {
			            return false;
			        }
			        if (
			            尝试收集物品(
			                new 远射种子({ 耐久: this.自定义数据.get("耐久") }),
			                true
			            )
			        ) {
			            this.移除自身();
			            显示通知("成功回收了远射种子！", "成功");
			            return true;
			        } else {
			            显示通知("背包已满，无法回收种子！", "错误");
			            return false;
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
			
			    更新倒计时() {
			        let 冷却剩余 = this.自定义数据.get("冷却剩余");
			        if (冷却剩余 > 0) {
			            this.自定义数据.set("冷却剩余", 冷却剩余 - 1);
			            return;
			        }
			        let 耐久 = this.自定义数据.get("耐久");
			        if (耐久 <= 0) {
			            this.移除自身();
			            显示通知(`${this.名称} 枯萎了。`, "信息");
			            return;
			        }
			
			        let 最近怪物 = null;
			        let 最小距离 = Infinity;
			
			        所有怪物.forEach((怪物) => {
			            if (怪物.状态 === 怪物状态.活跃) {
			                const 距离 =
			                    Math.abs(this.x - 怪物.x) +
			                    Math.abs(this.y - 怪物.y);
			                if (
			                    距离 < 最小距离 &&
			                    距离 <= this.自定义数据.get("攻击范围")
			                ) {
			                    if (
			                        检查视线(
			                            this.x,
			                            this.y,
			                            怪物.x,
			                            怪物.y,
			                            this.自定义数据.get("攻击范围")
			                        )
			                    ) {
			                        最小距离 = 距离;
			                        最近怪物 = 怪物;
			                    }
			                }
			            }
			        });
			
			        if (最近怪物) {
			            最近怪物.受伤(this.自定义数据.get("攻击力"), this);
			            const 路径 = 获取直线路径(
			                this.x,
			                this.y,
			                最近怪物.x,
			                最近怪物.y
			            );
			            计划显示格子特效(路径, "FFA500");
			
			            const dx = 最近怪物.x - this.x;
			            const dy = 最近怪物.y - this.y;
			            let 方向DX = dx === 0 ? 0 : Math.sign(dx);
			            let 方向DY = dy === 0 ? 0 : Math.sign(dy);
			            if (Math.abs(dx) > Math.abs(dy)) {
			                方向DY = 0;
			            } else {
			                方向DX = 0;
			            }
			
			            const { x: 最终X, y: 最终Y } =
			                最近怪物.计算最大甩飞位置(
			                    最近怪物.x,
			                    最近怪物.y,
			                    方向DX,
			                    方向DY,
			                    1
			                );
			            if (最终X !== 最近怪物.x || 最终Y !== 最近怪物.y) {
			                const oldX = 最近怪物.x,
			                    oldY = 最近怪物.y;
			                最近怪物.恢复背景类型();
			                最近怪物.x = 最终X;
			                最近怪物.y = 最终Y;
			                最近怪物.保存新位置类型(最终X, 最终Y);
			                地牢[最终Y][最终X].类型 = 单元格类型.怪物;
			                地牢[最终Y][最终X].关联怪物 = 最近怪物;
			                最近怪物.处理地形效果();
			                最近怪物.绘制血条();
			                怪物动画状态.set(最近怪物, {
			                    旧逻辑X: oldX,
			                    旧逻辑Y: oldY,
			                    目标逻辑X: 最终X,
			                    目标逻辑Y: 最终Y,
			                    视觉X: oldX,
			                    视觉Y: oldY,
			                    动画开始时间: Date.now(),
			                    正在动画: true,
			                });
			            }
			
			            this.自定义数据.set("耐久", 耐久 - 1);
			            this.自定义数据.set(
			                "冷却剩余",
			                this.自定义数据.get("冷却")
			            );
			        }
			    }
			}
			
			class 追踪风弹 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "追踪风弹",
			            图标: 图标映射.追踪风弹,
			            品质: 3,
			            颜色索引: 1,
			            堆叠数量: 配置.数量 || 1,
			            最大堆叠数量: 16,
			            冷却回合: 1,
			            攻击力: 0,
			            攻击范围:25,
			            效果描述: "消耗品。发射一枚自动追踪敌人的气弹，命中后在3x3范围内造成眩晕。",
			            ...配置,
			        });
			    }
			
			    使用(目标怪物列表, 目标路径, 使用者 = 玩家) {
			        if (this.堆叠数量 <= 0 || this.自定义数据.get("冷却剩余") > 0) return false;
			
			        const 发射位置 = 寻找可放置位置(使用者.x, 使用者.y);
			        if (!发射位置?.x) return;
			
			        this.堆叠数量--;
			        if (this.堆叠数量 <= 0) {
			            处理销毁物品(this.唯一标识, true);
			        }
			        this.自定义数据.set("冷却剩余",this.最终冷却回合);
			        更新装备显示();
			        更新背包显示();
			        
			        const 弹头实例 = new 追踪风弹弹头({强化:this.强化});
			        放置怪物到单元格(弹头实例, 发射位置.x, 发射位置.y);
			        
			
			        return true;
			    }
			}
			class 泉水 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "生命之泉",
			            图标: 图标映射.泉水,
			            品质: 4,
			            颜色索引: 1,
			            能否拾起: false,
			            阻碍怪物: false,
			            是否正常物品: false,
			            效果描述: "互动一次即可完全恢复生命和能量。",
			            数据: {
			                已使用: false,
			                ...配置.数据,
			            },
			            ...配置,
			        });
			    }
			
			    使用() {
			        if (this.自定义数据.get("已使用")) {
			            显示通知("泉水已经干涸了。", "信息");
			            return false;
			        }
			        const 生命条 = document.querySelector(".health-bar");
			        const 能量条 = document.querySelector(".power-bar");
			        生命条.style.width = "100%";
			        能量条.style.width = "100%";
			        this.自定义数据.set("已使用", true);
			        const 新的永久Buffs = { 已获得效果: new Set() };
			                 永久Buffs = 新的永久Buffs;
			                 应用永久Buffs(); 
			
			        this.效果描述 = "泉水已经干涸了。";
			        显示通知("你感到一股清流涌遍全身，焕然一新！", "成功");
			        绘制();
			        return true;
			    }
			
			    尝试互动() {
			        return this.使用();
			    }
			}
			
			class 书架 extends 物品 {
			    constructor(配置 = {}) {
			        const hasContent =
			            配置.有内容 !== undefined
			                ? 配置.有内容
			                : prng() < 0.2;
			        super({
			            类型: "地形",
			            名称: hasContent ? "古老的书架" : "空书架",
			            图标: 图标映射.书架,
			            品质: 3,
			            颜色索引: 2,
			            能否拾起: false,
			            阻碍怪物: false,
			            是否正常物品: false,
			            效果描述: hasContent
			                ? "互动一次可以随机获得一个已解锁的卷轴或融合配方。"
			                : "这个书架上空空如也，积满了灰尘。",
			            数据: {
			                已使用: !hasContent,
			                ...配置.数据,
			            },
			            ...配置,
			        });
			    }
			
			    使用() {
			        if (this.自定义数据.get("已使用")) {
			            显示通知("书架上已经没有可读的书了。", "信息");
			            return false;
			        }
			
			        if (prng() < 0.7) {
			            const 可用卷轴 = 物品池["卷轴"].filter((item) => {
			                const 实例 = new item.类({});
			                return 实例.是否正常物品;
			            });
			            if (可用卷轴.length > 0) {
			                const 选中卷轴配置 =
			                    可用卷轴[
			                        Math.floor(prng() * 可用卷轴.length)
			                    ];
			                const 新卷轴 = new 选中卷轴配置.类({
			                    已解锁: true,
			                });
			                if (尝试收集物品(新卷轴, true)) {
			                    显示通知(
			                        `你从书中习得了《${新卷轴.名称}》！`,
			                        "成功"
			                    );
			                } else {
			                    显示通知(
			                        `你发现了一本《${新卷轴.名称}》，但背包满了！`,
			                        "错误"
			                    );
			                    return false;
			                }
			            }
			        } else {
			            const 可用配方 = [...程序生成配方列表];
			            if (可用配方.length > 0) {
			                const 选中配方 =
			                    可用配方[
			                        Math.floor(prng() * 可用配方.length)
			                    ];
			                if (
			                    !已发现的程序生成配方.some(
			                        (r) => r.说明 === 选中配方.说明
			                    )
			                ) {
			                    已发现的程序生成配方.push(选中配方);
			                    显示通知(
			                        `你发现了一张配方：${选中配方.说明}！`,
			                        "成功"
			                    );
			                } else {
			                    显示通知(
			                        "你又读了一遍熟悉的配方，温故而知新。",
			                        "信息"
			                    );
			                }
			            } else {
			                显示通知(
			                    "书架上落满了灰尘，什么也没找到。",
			                    "信息"
			                );
			            }
			        }
			
			        this.自定义数据.set("已使用", true);
			        this.名称 = "空书架";
			        this.效果描述 = "这个书架上空空如也，积满了灰尘。";
			
			        return true;
			    }
			
			    尝试互动() {
			        return this.使用();
			    }
			}
			class 神偷手 extends 武器类 {
			 constructor(配置 = {}) {
			     super({
			         名称: "神偷手",
			         图标: 图标映射.神偷手,
			         品质: 3,
			         颜色索引: 2, 
			         基础攻击力: 0, 
			         冷却回合: 15 - (配置.强化 ? 5 : 0),
			         攻击范围: 3, 
			         耐久: 15 + (配置.强化 ? 10 : 0),
			         原耐久: 15 + (配置.强化 ? 10 : 0),
			         效果描述: "对近处的敌人施展妙手空空之术。",
			         攻击目标数: 1, 
			         数据: {
			             能量消耗: 60 - (配置.强化 ? 20 : 0),
			             怪物偷窃成功率: 0.7 + (配置.强化 ? 0.2 : 0), 
			             商人偷窃成功率: 0.4 + (配置.强化 ? 0.15 : 0),
			         },
			         ...配置,
			     });
			 }
			
			 
			 使用(目标怪物列表, 目标路径, 使用者 = 玩家) {
			     if (this.自定义数据.get("冷却剩余") > 0) {
			         显示通知("手臂还在发麻，等会再偷！", "警告");
			         return true;//返回true以防止重复通知，下面同理
			     }
			     if (!扣除能量(this.自定义数据.get("能量消耗"))) {
			         显示通知("能量不足，无法施展妙手！", "错误");
			         return true;
			     }
			
			     const 目标 = this.寻找最近的目标(使用者);
			
			     if (!目标) {
			         显示通知("附近没有可以下手的东西...", "信息");
			         
			         const 能量条 = document.querySelector(".power-bar");
			         const 当前能量 = parseFloat(能量条.style.width) || 0;
			         能量条.style.width = `${Math.min(100, 当前能量 + this.自定义数据.get("能量消耗")/自定义全局设置.初始能量值*100)}%`;
			         return true;
			     }
			
			     
			     this.自定义数据.set("耐久", this.自定义数据.get("耐久") - 1);
			     if (this.自定义数据.get("耐久") <= 0) {
			         处理销毁物品(this.唯一标识, true);
			         显示通知(`${this.名称} 已损坏！`, "警告");
			     }
			     this.自定义数据.set("冷却剩余", this.最终冷却回合);
			     更新装备显示();
			
			     
			     if (目标 instanceof 神秘商人) {
			         this.处理商人偷窃(目标);
			     } else if (目标 instanceof 怪物) {
			         this.处理怪物偷窃(目标);
			     }
			
			     return true; 
			 }
			
			 寻找最近的目标(使用者) {
			     let 最近目标 = null;
			     let 最小距离 = Infinity;
			     const 范围 = this.最终攻击范围;
			
			     for (let dy = -范围; dy <= 范围; dy++) {
			         for (let dx = -范围; dx <= 范围; dx++) {
			             const x = 使用者.x + dx;
			             const y = 使用者.y + dy;
			             if (x < 0 || x >= 地牢大小 || y < 0 || y >= 地牢大小) continue;
			             
			             const 距离 = Math.abs(dx) + Math.abs(dy);
			             if (距离 < 最小距离) {
			                 const 单元格 = 地牢[y]?.[x];
			                 if (单元格) {
			                     const 潜在目标 = 单元格.关联怪物 || 单元格.关联物品;
			                     if (潜在目标 && (潜在目标 instanceof 怪物 || 潜在目标 instanceof 神秘商人)) {
			                          if(快速直线检查(使用者.x, 使用者.y, x, y, 范围)){
			                             最小距离 = 距离;
			                             最近目标 = 潜在目标;
			                         }
			                     }
			                 }
			             }
			         }
			     }
			     return 最近目标;
			 }
			
			 处理怪物偷窃(目标怪物) {
				if (目标怪物 && !(目标怪物 instanceof 大魔法师)
				 && !(目标怪物 instanceof 米诺陶) 
				 && !(目标怪物 instanceof 墓碑) && !(目标怪物 instanceof 王座守护者)
				 && !(目标怪物 instanceof 皇家守卫)
				 && !(目标怪物 instanceof 复活怪物)
				 && !(目标怪物 instanceof 巨人怪物)
				 && !(目标怪物 instanceof 追踪风弹弹头)
				 && !(目标怪物 instanceof 蜈蚣部位)
				 && !(目标怪物 instanceof 蜈蚣怪物)) {
			     if (!(目标怪物.掉落物) || 目标怪物.掉落物.length === 0) {
			         显示通知(`${目标怪物.类型} 身上空空如也！`, "信息");
			         return;
			     }
			
			     if (prng() < this.自定义数据.get("怪物偷窃成功率")) {
			         
			         const 被偷物品 = 克隆物品(目标怪物.掉落物); 
			         if (尝试收集物品(被偷物品, true)) {
			             显示通知(`成功偷取了 ${被偷物品.获取名称()}！`, "成功");
			
			             
			             const 旧生命值 = 目标怪物.当前生命值;
			             const 旧位置X = 目标怪物.x;
			             const 旧位置Y = 目标怪物.y;
			             const 旧房间ID = 目标怪物.房间ID;
			
			             
			             目标怪物.恢复背景类型(); 
			             所有怪物 = 所有怪物.filter(m => m !== 目标怪物);
			             怪物状态表.delete(目标怪物);
			             
			             
			             const 新普通怪物 = new 怪物({
			                 x: 旧位置X,
			                 y: 旧位置Y,
			                 房间ID: 旧房间ID,
			                 当前生命值: 旧生命值, 
			                 状态: 怪物状态.活跃,
			                 掉落物: new 金币({ 数量: 1 }), 
			             });
			             放置怪物到单元格(新普通怪物, 旧位置X, 旧位置Y);
			             添加日志(`${目标怪物.类型} 的宝物被夺走，变得普通了！`, '警告');
			             
			         } else {
			             显示通知("偷到了东西，但背包满了！", "错误");
			         }
			     } else {
			         
			         显示通知("失手了！被怪物发现了！", "警告");
			         目标怪物.仇恨 = 玩家;
			     }
				} else {
					显示通知("目标似乎无法被选中...", "信息");
				}
			 }
			
			 处理商人偷窃(商人) {
			     const 库存 = 商人.自定义数据.get("库存");
			     if (!库存 || 库存.length === 0) {
			         显示通知("这个商人已经没货了！", "信息");
			         return;
			     }
			
			     if (prng() < this.自定义数据.get("商人偷窃成功率")) {
			         
			         const 随机索引 = Math.floor(prng() * 库存.length);
			         const 被偷物品原型 = 库存.splice(随机索引, 1)[0]; 
			         const 被偷物品 = 克隆物品(被偷物品原型);
			
			         if (尝试收集物品(被偷物品, true)) {
			             显示通知(`成功从商人那里偷到了 ${被偷物品.获取名称()}！`, "成功");
			             
			             if(库存.length === 0) {
			                  this.商人消失(商人, "心满意足地");
			             }
			         } else {
			             显示通知("偷到了东西，但背包满了！", "错误");
			             库存.push(被偷物品原型); 
			         }
			     } else {
			         
			         显示通知("失手了！商人愤怒地召唤了神罚！", "错误");
			         this.商人闪电惩罚();
			         this.商人消失(商人, "愤怒地");
			     }
			 }
			 
			 商人闪电惩罚() {
			     
			     const 闪电伤害 = 50;
			     const 火焰强度 = 5;
			     const 火焰持续 = 5;
			     const 惩罚范围 = [{x: 玩家.x, y: 玩家.y}]; 
			
			     计划显示格子特效(惩罚范围, "FFFF00", 50);
			
			     伤害玩家(闪电伤害, "神秘商人");
			     
			     new 状态效果(
			         "火焰",
			         效果颜色编号映射[效果名称编号映射.火焰],
			         图标映射.火焰,
			         火焰持续, null, null, null, 火焰强度
			     );
			     添加日志("你被闪电点燃了！", "错误");
			
			     if (位置是否可用(玩家.x, 玩家.y, false)) {
			         放置物品到单元格(new 火焰物品({强化: true}), 玩家.x, 玩家.y);
			     }
			 }
			
			 商人消失(商人, 方式) {
			     if (商人.x !== null && 商人.y !== null && 地牢[商人.y]?.[商人.x]?.关联物品 === 商人) {
			         地牢[商人.y][商人.x].关联物品 = null;
			         if (地牢[商人.y][商人.x].类型 === 单元格类型.物品) {
			             地牢[商人.y][商人.x].类型 = null;
			         }
			         添加日志(`神秘商人${方式}消失了。`, '信息');
			         绘制();
			     }
			 }
			 
			 get 攻击力() {
			     return 0;
			 }
			}
			class 迅捷卷轴 extends 卷轴类 {
			    constructor(配置) {
			        super({
			            名称: "迅捷卷轴",
			            品质: 3,
			            效果描述: "激活后增加移动步数，效果可叠加，消耗能量",
			            能量消耗: 配置.能量消耗 ?? 4,
			            强化: 配置.强化 || false,
			            已解锁: 配置.已解锁 || false,
			        });
			        this.速度加成值 = 2;
			    }
			
			    计算总迅捷加成() {
			        let 激活的迅捷卷轴数量 = 0;
			        if (
			            typeof 当前激活卷轴列表 !== "undefined" &&
			            当前激活卷轴列表 instanceof Set
			        ) {
			            当前激活卷轴列表.forEach((卷轴) => {
			                if (卷轴 instanceof 迅捷卷轴) {
			                    激活的迅捷卷轴数量++;
			                }
			            });
			        } else {
			            console.warn(
			                "迅捷卷轴：无法访问或类型错误的 当前激活卷轴列表，无法计算加成。"
			            );
			            return 0;
			        }
			        return 激活的迅捷卷轴数量 * this.速度加成值;
			    }
			
			    使用() {
			        const 总加成 = this.计算总迅捷加成();
			        玩家属性.移动步数 = 初始玩家属性.移动步数 + 总加成;
			        return true;
			    }
			
			    卸下() {
			        const 总加成 = this.计算总迅捷加成();
			        const 计算后的步数 = 初始玩家属性.移动步数 + 总加成;
			        玩家属性.移动步数 = Math.max(
			            初始玩家属性.移动步数,
			            计算后的步数
			        );
			        return true;
			    }
			}
			class 神秘卷轴 extends 卷轴类 {
			    constructor(配置) {
			        super({
			            名称: "神秘卷轴",
			            品质: 3,
			            效果描述: "浪费能量的空白卷轴",
			            能量消耗: 15,
			            强化: 配置.强化 || false,
			            已解锁: 配置.已解锁 || false,
			        });
			    }
			    //使用时不卸下即视为每回合消耗能量，消耗能量在卷轴基类处理
			    使用() {
			        return true;
			    }
			    卸下() {
			        return true;
			    }
			}
			class 贪婪卷轴 extends 卷轴类 {
			    constructor(配置) {
			        super({
			            名称: "贪婪卷轴",
			            品质: 3,
			            效果描述: "赌狗！将怪物掉落率/装备耐久提高一倍吧！",
			            能量消耗: 5,
			            强化: 配置.强化 || false,
			            已解锁: 配置.已解锁 || false,
			        });
			    }
			
			    计算总倍率加成() {
			        let 激活的贪婪卷轴数量 = 0;
			        if (
			            typeof 当前激活卷轴列表 !== "undefined" &&
			            当前激活卷轴列表 instanceof Set
			        ) {
			            当前激活卷轴列表.forEach((卷轴) => {
			                if (卷轴 instanceof 贪婪卷轴) {
			                    激活的贪婪卷轴数量++;
			                }
			            });
			        } else {
			            console.warn(
			                "贪婪卷轴：无法访问或类型错误的 当前激活卷轴列表，无法计算加成。"
			            );
			            return 0;
			        }
			        return 激活的贪婪卷轴数量;
			    }
			
			    使用() {
			        const 总加成 = this.计算总倍率加成();
			        玩家属性.掉落倍率 = 初始玩家属性.掉落倍率 + 总加成;
			        return true;
			    }
			
			    卸下() {
			        const 总加成 = this.计算总倍率加成();
			        const 计算后的倍率 = 初始玩家属性.掉落倍率 + 总加成;
			        玩家属性.掉落倍率 = Math.max(
			            初始玩家属性.掉落倍率,
			            计算后的倍率
			        );
			        return true;
			    }
			}
			class 清净卷轴 extends 卷轴类 {
			    constructor(配置) {
			        super({
			            名称: "清净卷轴",
			            品质: 3,
			            效果描述: "消耗大量能量，激活后去除自身所有效果",
			            能量消耗: 10,
			            强化: 配置.强化 || false,
			            已解锁: 配置.已解锁 || false,
			        });
			    }
			
			    使用() {
			        if (!this.消耗能量()) return false;
			        玩家状态.forEach((item) => {
			            item.移除状态();
			        });
			        当前激活卷轴列表.delete(this);
			
			        显示通知("卷轴成功发挥作用", "成功");
			        绘制();
			        return true;
			    }
			}
			class 金币手枪 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "金币手枪",
			            图标: 图标映射.金币手枪,
			            品质: 3,
			            颜色索引: 2,
			            效果描述:
			                "发射直线子弹，中弹怪物会麻木，每发消耗2金币。",
			            基础攻击力: 1,
			            冷却回合: 1,
			            攻击范围: 40,
			            耐久: 配置.耐久 || 75,
			            强化: 配置.强化 || false,
			            不可破坏: 配置.不可破坏 || false,
			            数据: {
			                金币消耗: 2,
			            },
			        });
			    }
			    使用(目标怪物列表,目标路径,使用者=玩家) {
			        if (使用者 instanceof 宠物) return false;
			        const 金币列表 = [...玩家背包.values()].filter(
			            (i) => i instanceof 金币
			        );
			        const 总金币 = 金币列表.reduce(
			            (sum, i) => sum + i.堆叠数量,
			            0
			        );
			        if (总金币 < this.自定义数据.get("金币消耗")) {
			            显示通知("金币不足！", "错误");
			            return false;
			        }
			        const 攻击结果 = this.寻找直线目标();
			        if (!攻击结果) {
			            return false;
			        }
			
			        if (!扣除金币(this.自定义数据.get("金币消耗")))
			            return false;
			
			        super.使用([攻击结果.怪物]);
			        更新背包显示();
			        攻击结果.怪物.受伤冻结回合剩余 = 2;
			        计划显示格子特效(攻击结果.路径);
			        return true;
			    }
			    寻找直线目标() {
			        const 方向列表 = [
			            {
			                dx: 0,
			                dy: -1,
			                名称: "上",
			            },
			            {
			                dx: 0,
			                dy: 1,
			                名称: "下",
			            },
			            {
			                dx: -1,
			                dy: 0,
			                名称: "左",
			            },
			            {
			                dx: 1,
			                dy: 0,
			                名称: "右",
			            },
			        ];
			        let 最近目标 = null;
			        let 最小距离 = Infinity;
			        if (地牢[玩家.y][玩家.x].类型 === 单元格类型.怪物) {
			            return {
			                怪物: 地牢[玩家.y][玩家.x].关联怪物,
			                路径: [{ x: 玩家.x, y: 玩家.y }],
			            };
			        }
			        方向列表.forEach((方向) => {
			            let 当前X = 玩家.x + 方向.dx;
			            let 当前Y = 玩家.y + 方向.dy;
			            let 路径 = [];
			            for (let i = 0; i < 9999; i++) {
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
			                    const 距离 =
			                        Math.abs(当前X - 玩家.x) +
			                        Math.abs(当前Y - 玩家.y);
			                    if (距离 < 最小距离) {
			                        最近目标 = {
			                            怪物: 单元格.关联怪物,
			                            路径: 获取直线路径(
			                                玩家.x,
			                                玩家.y,
			                                当前X,
			                                当前Y
			                            ),
			                        };
			                        最小距离 = 距离;
			                    }
			                    break;
			                }
			                路径.push({
			                    x: 当前X,
			                    y: 当前Y,
			                });
			                当前X += 方向.dx;
			                当前Y += 方向.dy;
			            }
			        });
			        return 最近目标;
			    }
			    获取提示() {
			        return super.获取提示();
			    }
			}
			
			class 附魔卷轴 extends 卷轴类 {
			    constructor(配置) {
			        super({
			            名称: "附魔卷轴",
			            品质: 配置.品质 || 1,
			            效果描述: "为装备附加附魔",
			            能量消耗: 30,
			            已解锁: 配置.已解锁 || false,
			            强化: 配置.强化 || false,
			        });
			        this.可用次数 = 配置.可用次数 || 1;
			        this.附魔池 = [
			            this.火焰附魔,
			            this.保护附魔,
			            this.耐久附魔,
			            this.锋利附魔,
			            this.爆炸保护附魔,
			            this.连锁附魔,
			            this.荆棘附魔,
			        ];
			        this.效果名 = [
			            "火焰附魔",
			            "保护附魔",
			            "耐久附魔",
			            "锋利附魔",
			            "爆炸保护附魔",
			            "连锁附魔",
			            "荆棘附魔",
			        ];
			        const 效果索引 = Math.floor(
			            prng() * this.附魔池.length
			        );
			        this.附魔效果 = this.附魔池[效果索引];
			        this.当前附魔效果名 = this.效果名[效果索引];
			        if (!配置.品质) {
			            this.品质 = Math.floor(prng() * 6) || 1;
			            this.颜色索引 = this.品质 - 1;
			        }
			        this.效果描述 =
			            "为装备附加" +
			            this.当前附魔效果名 +
			            "(附魔等级由品质决定)";
			    }
			
			    使用() {
			        this.显示附魔界面();
			        return true;
			    }
			
			    显示附魔界面() {
			        玩家属性.允许移动 += 1;
			        const 弹窗 = this.创建附魔弹窗();
			        更新装备显示();
			        this.添加装备到弹窗(弹窗);
			        this.添加确认按钮(弹窗);
			        
			    }
			
			    添加确认按钮(弹窗) {
			        const 确认按钮 = document.createElement("button");
			        确认按钮.className = "附魔确认按钮";
			        确认按钮.innerHTML = "开始附魔";
			        确认按钮.addEventListener("click", () => {
			            const 选中装备 = 弹窗.querySelector(".可附魔.active");
			            if (选中装备) {
			                this.执行附魔(选中装备.__物品实例, 弹窗, 选中装备);
			            } else {
			                显示通知("请选择要附魔物品", "错误");
			            }
			        });
			        弹窗.querySelector(".附魔装备容器").after(确认按钮);
			    }
			
			    创建附魔弹窗() {
			        const 弹窗 = document.createElement("div");
			        弹窗.className = "附魔弹窗";
			        弹窗.innerHTML = `
			<div class="附魔头" >
			    <span class="附魔标题">选择要附魔的装备</span>
			    <button class="关闭按钮" click>×</button>
			</div >
			<div class="附魔装备容器"></div>
			<div class="附魔特效"></div>
			        `;
			        弹窗.querySelector(".关闭按钮").addEventListener(
			            "click",
			            () => {
			                弹窗.classList.add("关闭中");
			                setTimeout(() => {
			                    玩家属性.允许移动 -= 1;
			                    弹窗.remove();
			                    当前激活卷轴列表.delete(this);
			                    更新装备显示();
			                }, 300);
			            }
			        );
			        document.body.appendChild(弹窗);
			        return 弹窗;
			    }
			
			    添加装备到弹窗(弹窗) {
			        const 容器 = 弹窗.querySelector(".附魔装备容器");
			        Array.from({ length: 装备栏每页装备数 }, (_, i) =>
			            玩家装备.get(当前装备页 * 装备栏每页装备数 + i + 1)
			        )
			            .filter((v) => v != null)
			            .forEach((装备) => {
			                const 克隆元素 = 装备
			                    .生成显示元素("装备")
			                    .cloneNode(true);
			                克隆元素.style.margin = "-5px 0";
			                克隆元素.classList.remove("active");
			                克隆元素.classList.remove("hover");
			                克隆元素.removeAttribute("data-quality");
			                克隆元素.__物品实例 = 装备;
			                克隆元素.classList.add("可附魔");
			                克隆元素.addEventListener("click", (e) => {
			                    克隆元素.classList.add("active");
			                    容器.querySelectorAll(".物品条目").forEach(
			                        (el) => {
			                            if (el !== 克隆元素) {
			                                el.classList.remove("active");
			                            }
			                        }
			                    );
			                });
			                ["丢弃按钮", "使用按钮", "装备按钮"].forEach(
			                    (className) => {
			                        克隆元素.querySelector(
			                            `.${className} `
			                        )?.remove();
			                    }
			                );
			                容器.appendChild(克隆元素);
			            });
			    }
			
			    执行附魔(装备, 弹窗, 元素) {
			        const 成功 = this.附魔效果.call(this, 装备);
			
			        if (成功) {
			            元素.classList.add("附魔成功");
			            setTimeout(
			                () => 元素.classList.remove("附魔成功"),
			                1500
			            );
			
			            this.播放附魔特效(装备, 弹窗, 元素);
			            this.可用次数--;
			            if (this.可用次数 <= 0) {
			                处理销毁物品(this.唯一标识, true);
			            }
			            显示通知("附魔成功！装备绽放出神秘光芒", "成功");
			            弹窗.classList.add("关闭中");
			            当前激活卷轴列表.delete(this);
			            更新装备显示();
			
			            setTimeout(() => {
			                弹窗.remove();
			                玩家属性.允许移动 -= 1;
			            }, 2000);
			            return true;
			        } else {
			            显示通知("无法应用附魔！", "错误");
			            return false;
			        }
			    }
			
			    火焰附魔(装备) {
			        return this.添加附魔(装备, "火焰附魔", [
			            "武器",
			            "防御装备",
			        ]);
			    }
			    耐久附魔(装备) {
			        return this.添加附魔(装备, "耐久附魔", [
			            "武器",
			            "防御装备",
			        ]);
			    }
			    保护附魔(装备) {
			        return this.添加附魔(装备, "保护附魔", ["防御装备"]);
			    }
			    锋利附魔(装备) {
			        return this.添加附魔(装备, "锋利附魔", ["武器"]);
			    }
			    连锁附魔(装备) {
			        return this.添加附魔(装备, "连锁附魔", ["武器"]);
			    }
			    爆炸保护附魔(装备) {
			        return this.添加附魔(装备, "爆炸保护附魔", ["防御装备"]);
			    }
			    荆棘附魔(装备) {
			        return this.添加附魔(装备, "荆棘附魔", ["防御装备"]);
			    }
			    添加附魔(装备, 附魔种类, 允许装备列表) {
			        if (装备.自定义数据.get("附魔")) {
			            if (
			                !装备.自定义数据
			                    .get("附魔")
			                    .some(
			                        (附魔) =>
			                            附魔.种类 === 附魔种类 &&
			                            附魔.等级 >= this.品质
			                    ) &&
			                允许装备列表.includes(装备.类型)
			            ) {
			                if (!this.消耗能量()) {
			                    显示通知("能量不足！", "错误");
			                    return false;
			                }
			                let 成功附魔 = false;
			                装备.自定义数据
			                    .get("附魔")
			                    .forEach((item, index, arr) => {
			                        if (
			                            item.种类 === 附魔种类 &&
			                            item.等级 < this.品质
			                        ) {
			                            arr[index] = {
			                                种类: 附魔种类,
			                                等级: this.品质,
			                            };
			                            成功附魔 = true;
			                        }
			                    });
			                if (!成功附魔) {
			                    装备.自定义数据
			                        .get("附魔")
			                        .push({ 种类: 附魔种类, 等级: this.品质 });
			                }
			                return true;
			            }
			        }
			        return false;
			    }
			    播放附魔特效(装备, 弹窗, 装备元素) {
			        const 装备位置 = 装备元素.getBoundingClientRect();
			        const 中心X = 装备位置.left + 装备位置.width / 2;
			        const 中心Y = 装备位置.top + 装备位置.height / 2;
			
			        const 特效容器 = document.createElement("div");
			        特效容器.style = `
			        position: fixed;
			        left: ${中心X}px;
			        top: ${中心Y}px;
			        pointer-events: none;
			        z-index: 10001;
			        `;
			
			        document.body.appendChild(特效容器);
			
			        const 粒子数 = 12;
			
			        const 基础色相 = 260;
			
			        for (let i = 0; i < 粒子数; i++) {
			            const 粒子 = document.createElement("div");
			            粒子.className = "魔幻粒子";
			
			            const 角度 = prng() * Math.PI * 2;
			            const 距离 = 120 + prng() * 80;
			            const 目标X = Math.cos(角度) * 距离;
			            const 目标Y = Math.sin(角度) * 距离;
			            const 大小 = 12 + prng() * 16;
			            const 旋转 = prng() * 720;
			            const 色相偏移 = (prng() - 0.5) * 40;
			            const 亮度曲线 = 60 + prng() * 30;
			
			            粒子.style = `
			        --target-x: ${目标X}px;
			        --target-y: ${目标Y}px;
			        --size: ${大小}px;
			        --hue: ${基础色相 + 色相偏移};
			        transform: translateZ(0);
			        --lightness: ${亮度曲线}%;
			        --rotate: ${旋转}deg;
			        --delay: ${prng() * 0.4}s;
			        `;
			
			            特效容器.appendChild(粒子);
			        }
			
			        setTimeout(() => 特效容器.remove(), 2000);
			    }
			}
			class 易位卷轴 extends 卷轴类 {
			    constructor(配置) {
			        super({
			            名称: "易位卷轴",
			            品质: 4,
			            效果描述: "启用后，在画面中点选一个单位，与它互换位置。",
			            能量消耗: 55,
			            ...配置
			        });
			    }
			
			    使用() {
			        if (!this.消耗能量()) return false;
			        if (生存挑战激活) {
			        显示通知("强大的结界阻止了传送！", "错误");
			        //关闭传送菜单();
			        return false;
			    }
			        显示通知("请在地图上点击要交换位置的目标。", "信息", true);
			        物品点击监听器 = (clientX, clientY) => {
			            const rect = canvas.getBoundingClientRect();
			            const x = clientX - rect.left;
			            const y = clientY - rect.top;
			            const gridX = Math.floor(视口偏移X + x / 单元格大小);
			            const gridY = Math.floor(视口偏移Y + y / 单元格大小);
			
			            if (!检查视线(玩家.x, 玩家.y, gridX, gridY)) {
			                显示通知("目标不在视线范围内！", "错误");
			            }
			
			            const 目标单元格 = 地牢[gridY]?.[gridX];
			            const 目标实体 = 目标单元格?.关联怪物 || 目标单元格?.关联物品 || 当前出战宠物列表.some(p => p.x === gridX && p.y === gridY);
			
			            if (目标实体 && 目标实体 !== 玩家 && 目标实体.类型!=='楼梯') {
			                const 玩家旧X = 玩家.x;
			                const 玩家旧Y = 玩家.y;
			                const 目标旧X = 目标实体.x;
			                const 目标旧Y = 目标实体.y;
			                let isPlayerSpotValid = false;
			                if (目标实体 instanceof 怪物) {
			                    isPlayerSpotValid = 目标实体.位置合法(玩家旧X, 玩家旧Y);
			                    if (目标实体 instanceof 巨人怪物 || 目标实体 instanceof 巨人部位 || 目标实体 instanceof 蜈蚣怪物 || 目标实体 instanceof 蜈蚣部位) {
			                        const 能量条 = document.querySelector(".power-bar");
			            const 当前能量 = parseFloat(能量条.style.width) || 0;
			            if (能量条)
			                能量条.style.width = `${Math.min(
			                    100,
			                    当前能量 + this.自定义数据.get("能量消耗")/自定义全局设置.初始能量值*100
			                )}%`;
			            触发HUD显示();
			                    显示通知("无法交换：目标无法移动到你的位置！", "错误");
			                return true;
			                    }
			                } else {
			                    isPlayerSpotValid = 位置是否可用(玩家旧X, 玩家旧Y, false);
			                }
			
			                if (isPlayerSpotValid) {
			                    if (目标实体 instanceof 怪物) {
			                        目标实体.恢复背景类型();
			                    } else if (目标实体 instanceof 物品) {
			                        if(地牢[目标旧Y][目标旧X].关联物品 === 目标实体) {
			                            地牢[目标旧Y][目标旧X].关联物品 = null;
			                            地牢[目标旧Y][目标旧X].类型 = null;
			                        }
			                    }
			
			                    玩家.x = 目标旧X;
			                    玩家.y = 目标旧Y;
			                    处理玩家着陆效果(玩家旧X,玩家旧Y,玩家.x,玩家.y)
			                    目标实体.x = 玩家旧X;
			                    目标实体.y = 玩家旧Y;
			                    
			                    if (目标实体 instanceof 怪物) {
			                        目标实体.保存新位置类型(玩家旧X, 玩家旧Y);
			                        地牢[玩家旧Y][玩家旧X].类型 = 单元格类型.怪物;
			                        地牢[玩家旧Y][玩家旧X].关联怪物 = 目标实体;
			                    } else if (目标实体 instanceof 物品) {
			                         地牢[玩家旧Y][玩家旧X].类型 = 单元格类型.物品;
			                         地牢[玩家旧Y][玩家旧X].关联物品 = 目标实体;
			                    }
			
			                    显示通知(`与 ${目标实体.名称 || 目标实体.类型} 交换了位置！`, "成功");
			                    
			                    更新背包显示();
			                    更新装备显示();
			                    更新视口();
			                    
			                } else {
			                    const 能量条 = document.querySelector(".power-bar");
			            const 当前能量 = parseFloat(能量条.style.width) || 0;
			            if (能量条)
			                能量条.style.width = `${Math.min(
			                    100,
			                    当前能量 + this.自定义数据.get("能量消耗")/自定义全局设置.初始能量值*100
			                )}%`;
			            触发HUD显示();
			                    显示通知("无法交换：目标无法移动到你的位置！", "错误");
			                }
			            } else {
			                const 能量条 = document.querySelector(".power-bar");
			            const 当前能量 = parseFloat(能量条.style.width) || 0;
			            if (能量条)
			                能量条.style.width = `${Math.min(
			                    100,
			                    当前能量 + this.自定义数据.get("能量消耗")/自定义全局设置.初始能量值*100
			                )}%`;
			            触发HUD显示();
			                显示通知("无效的目标！", "错误");
			            }
			            物品点击监听器 = null;
			            当前激活卷轴列表.delete(this);
			            更新装备显示();
			        };
			        return true;
			    }
			}
			class 跃迁卷轴 extends 卷轴类 {
			    constructor(配置) {
			        super({
			            名称: "跃迁卷轴",
			            品质: 3,
			            效果描述: "随机传送到未访问房间，并解锁目标房间所有门",
			            强化: 配置.强化 || false,
			            能量消耗: 70,
			            已解锁: 配置.已解锁 || false,
			        });
			    }
			
			    使用() {
			        if (!this.消耗能量()) return false;
			
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
			        if (当前层数 % 5 === 0 && 当前层数>0) {
			            显示通知('当前地牢无法使用跃迁卷轴','错误');
			            return false;
			        }
			        const 有效房间 = 房间列表.filter(
			            (r) =>
			                r.id !== 房间地图[玩家.y][玩家.x] &&
			                !已访问房间.has(r.id)
			        );
			
			        let 目标房间;
			        if (有效房间.length > 0) {
			            目标房间 =
			                有效房间[
			                    Math.floor(prng() * 有效房间.length)
			                ];
			        } else {
			            const 所有可选房间 = 房间列表.filter(
			                (r) => r.id !== 房间地图[玩家.y][玩家.x]
			            );
			            if (所有可选房间.length > 0) {
			                目标房间 =
			                    所有可选房间[
			                        Math.floor(
			                            prng() * 所有可选房间.length
			                        )
			                    ];
			                显示通知(
			                    "没有可传送的未访问房间，随机传送。",
			                    "警告"
			                );
			            } else {
			                显示通知("没有可传送的房间。", "错误");
			                return false;
			            }
			        }
			
			        门实例列表.forEach((门) => {
			            if (门.房间ID === 目标房间.id) {
			                地牢[门.所在位置.y][门.所在位置.x].背景类型 =
			                    单元格类型.门;
			            }
			        });
			
			        玩家.x = 目标房间.x + Math.floor(目标房间.w / 2);
			        玩家.y = 目标房间.y + Math.floor(目标房间.h / 2);
			        已访问房间.add(目标房间.id);
			        更新视口();
			        绘制();
			        处理怪物回合();
			        显示通知(
			            `一阵风刮来，被传送到了 ${目标房间.id} 号房间`,
			            "成功"
			        );
			        当前激活卷轴列表.delete(this);
			
			        return true;
			    }
			}
			
			class 真言卷轴 extends 卷轴类 {
    constructor(配置) {
        super({
            名称: "真言卷轴",
            图标: 图标映射.真言卷轴,
            品质: 4,
            强化: 配置.强化 || false,
            效果描述: "揭示装备中所有卷轴的奥秘，每个卷轴消耗30能量。有使用次数限制。", // 效果描述已更新
            能量消耗: 30,
            已解锁: 配置.已解锁 || false,
            最大堆叠数量: 1, // 增加此项，确保不可堆叠
            数据: {
                // 核心改动：增加耐久度
                耐久: 配置.耐久 || 3 + (配置.强化 ? 2 : 0), // 普通3次，强化后5次
                原耐久: 3 + (配置.强化 ? 2 : 0),
            },
        });
    }

    使用() {
        // 1. 使用前检查耐久度
        if (this.自定义数据.get("耐久") <= 0) {
            显示通知(`${this.获取名称()} 的魔力已经耗尽！`, "错误");
            return false;
        }

        const 能量条 = document.querySelector(".power-bar");
        let 当前能量 = Math.max(
            Math.min(parseFloat(能量条.style.width), 100),
            0
        );

        let 解密数量 = 0;
        const 每次解密消耗 = 30;

        // 查找所有装备中未解锁的卷轴
        const 待解密卷轴 = [];
        Array.from({ length: 装备栏每页装备数 }, (_, i) =>
            玩家装备.get(当前装备页 * 装备栏每页装备数 + i + 1)
        )
            .filter((v) => v != null)
            .forEach((item) => {
                if (
                    item instanceof 卷轴类 &&
                    !item.自定义数据.get("已解锁")
                ) {
                    待解密卷轴.push(item);
                }
            });

        // 如果没有可解密的卷轴，则不消耗耐久
        if (待解密卷轴.length === 0) {
            显示通知("没有可解密的卷轴。", "信息");
            return false;
        }

        // 尝试解密
        待解密卷轴.forEach((item) => {
            if (当前能量 >= 每次解密消耗) {
                当前能量 -= 每次解密消耗;
                item.自定义数据.set("已解锁", true);
                解密数量++;
            }
        });

        // 只有成功解密了至少一个卷轴，才消耗耐久和能量
        if (解密数量 > 0) {
            扣除能量(
                Math.max(
                    Math.min(parseFloat(document.querySelector(".power-bar").style.width), 100),
                    0
                ) - 当前能量
            );

            // 2. 使用后消耗耐久
            const newDurability = this.自定义数据.get("耐久") - 1;
            this.自定义数据.set("耐久", newDurability);

            显示通知(`解密了 ${解密数量} 个神秘卷轴！`, "成功");

            // 3. 如果耐久耗尽，则销毁物品
            if (newDurability <= 0) {
                显示通知(`${this.获取名称()} 的魔力耗尽，化为了灰烬。`, "警告");
                处理销毁物品(this.唯一标识, true);
            }
        } else {
            显示通知(`能量不足，无法解密卷轴。`, "错误");
            return false; // 能量不足，不消耗耐久
        }
        当前激活卷轴列表.delete(this);
        更新装备显示();
        更新背包显示();

        return true;
    }

    获取提示() {
        if (this.自定义数据.get("已解锁")) {
            // 4. 更新提示信息以显示耐久度
            const lines = super.获取提示().split('\n');
            const effectIndex = lines.findIndex(line => line.startsWith('效果描述：'));
            
            // 在效果描述前插入耐久度信息
            if (effectIndex !== -1) {
                lines.splice(effectIndex, 0, `耐久：${this.自定义数据.get("耐久")} / ${this.自定义数据.get("原耐久")}`);
            } else {
                lines.push(`耐久：${this.自定义数据.get("耐久")} / ${this.自定义数据.get("原耐久")}`);
            }
            return lines.join('\n');
        } else {
            return "布满古老符文的卷轴，散发着神秘能量...";
        }
    }
}
			class 恐惧魔杖 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "恐惧魔杖",
			            图标: 图标映射.恐惧魔杖,
			            品质: 3,
			            基础攻击力: 1,
			            冷却回合: 5,
			            攻击范围: 4,
			            耐久: 配置?.耐久 || 40,
			            强化: 配置?.强化 || false,
			            效果描述: "使周围的非首领怪物陷入恐惧，远离施法者。",
			            攻击目标数: 99,
			            不可破坏: 配置?.不可破坏 || false,
			            附魔: 配置?.数据?.附魔 || [],
			            数据: {
			                恐惧持续时间: 3 + (配置?.强化 ? 2 : 0),
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
			
			        let 影响怪物数量 = 0;
			        const 范围 = this.最终攻击范围;
			        const 恐惧持续 = this.自定义数据.get("恐惧持续时间");
			        const 影响格子特效 = [];
			
			        for (let dx = -范围; dx <= 范围; dx++) {
			            for (let dy = -范围; dy <= 范围; dy++) {
			                const x = 使用者.x + dx;
			                const y = 使用者.y + dy;
			
			                if (
			                    x >= 0 &&
			                    x < 地牢大小 &&
			                    y >= 0 &&
			                    y < 地牢大小
			                ) {
			                    const 单元格 = 地牢[y][x];
			                    if (
			                        单元格?.关联怪物 &&
			                        单元格.关联怪物.当前生命值 > 0 &&
			                        !(单元格.关联怪物 instanceof 大魔法师) &&
			                        单元格.关联怪物.状态 === 怪物状态.活跃
			                    ) {
			                        if (检查视线(使用者.x, 使用者.y, x, y, 范围)) {
			                            const 怪物 = 单元格.关联怪物;
			                            new 状态效果(
			                                "恐惧",
			                                效果颜色编号映射[
			                                    效果名称编号映射.恐惧
			                                ],
			                                图标映射.恐惧,
			                                恐惧持续,
			                                null,
			                                null,
			                                怪物,
			                                1
			                            );
			                            影响怪物数量++;
			                            影响格子特效.push({ x, y });
			                        }
			                    }
			                }
			            }
			        }
			
			        if (影响格子特效.length > 0) {
			            计划显示格子特效(
			                影响格子特效,
			                效果颜色编号映射[效果名称编号映射.恐惧].slice(1),
			                50
			            );
			        }
			
			        this.自定义数据.set(
			            "耐久",
			            this.自定义数据.get("耐久") - this.耐久消耗
			        );
			        if (this.自定义数据.get("耐久") <= 0) {
			            处理销毁物品(this.唯一标识, true);
			            显示通知(`${this.名称} 已损坏！`, "警告");
			        }
			        this.自定义数据.set("冷却剩余", this.最终冷却回合);
			
			        if (影响怪物数量 > 0) {
			            显示通知(
			                `${this.名称} 使 ${影响怪物数量} 个怪物陷入恐惧！`,
			                "成功"
			            );
			        } else {
			            显示通知(`${this.名称} 未影响任何目标。`, "信息");
			        }
			        更新装备显示();
			        return 影响怪物数量 > 0 ? 1 : 0;
			    }
			
			    获取提示() {
			        let lines = super.获取提示().split("\n");
			        const specificEffectLines = [
			            `恐惧范围：周围 ${this.最终攻击范围} 格`,
			            `恐惧持续：${this.自定义数据.get("恐惧持续时间")} 回合`,
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
			let 调试输入数据 = null;
			let 调试无限生命 = false;
			let 调试无限能量 = false;
			            class 调试工具 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "工具",
			            名称: "调试工具",
			            图标: 图标映射.调试工具,
			            品质: 5,
			            颜色索引: 4,
			            最大堆叠数量: 1,
			            效果描述: "打开调试命令输入界面。",
			            数据: {},
			            ...配置,
			        });
			    }
			
			    使用() {
			        this.打开调试输入界面();
			        return true;
			    }
			
			    打开调试输入界面() {
			        if (界面可见性.背包) 切换背包显示();
			        玩家属性.允许移动++;
			
			        const 现有遮罩 = document.getElementById("调试输入遮罩");
			        if (现有遮罩) 现有遮罩.remove();
			
			        const 遮罩 = document.createElement("div");
			        遮罩.id = "调试输入遮罩";
			        遮罩.style.cssText = `
			            position: fixed; top: 0; left: 0; width: 100vw; height: 92vh;
			            background: rgba(0,0,0,0.75); z-index: 20000; display: flex;
			            align-items: center; justify-content: center; backdrop-filter: blur(5px);
			        `;
			
			        const 弹窗 = document.createElement("div");
			        弹窗.id = "调试输入弹窗";
			        弹窗.style.cssText = `
			            background: #2a2a2a; color: #e0e0e0; padding: 25px; border-radius: 12px;
			            box-shadow: 0 5px 25px rgba(0,0,0,0.6); display: flex; flex-direction: column;
			            gap: 15px; width: 90%; max-width: 600px; border: 1px solid #4caf50; max-height: 90vh; overflow-y: scroll;
			        `;
			
			        const 顶栏 = document.createElement("div");
			        顶栏.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding-bottom: 15px; border-bottom: 1px solid #444;";
			
			        const 标题 = document.createElement("h3");
			        标题.textContent = "调试工具";
			        标题.style.cssText = "color: #4caf50; text-align: center; margin: 0; flex-grow: 1;";
			
			        const 关闭按钮 = document.createElement("button");
			        关闭按钮.textContent = "×";
			        关闭按钮.className = "关闭按钮";
			        关闭按钮.style.fontSize = "1.5em";
			        关闭按钮.style.color = "#aaa";
			        关闭按钮.style.padding = "0 8px";
			
			        顶栏.appendChild(标题);
			        顶栏.appendChild(关闭按钮);
			
			        const 功能按钮容器 = document.createElement("div");
			        功能按钮容器.style.cssText = "display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; padding-bottom: 10px; border-bottom: 1px dashed #444;";
			
			        const 无限生命按钮 = document.createElement("button");
			        无限生命按钮.id = "debug-godmode-btn";
			        无限生命按钮.className = "菜单按钮";
			        无限生命按钮.textContent = 调试无限生命 ? "无限生命: 开" : "无限生命: 关";
			        if (调试无限生命) 无限生命按钮.style.borderColor = "#FFD700";
			
			        const 无限能量按钮 = document.createElement("button");
			        无限能量按钮.id = "debug-infenergy-btn";
			        无限能量按钮.className = "菜单按钮";
			        无限能量按钮.textContent = 调试无限能量 ? "无限能量: 开" : "无限能量: 关";
			        if (调试无限能量) 无限能量按钮.style.borderColor = "#2196F3";
			
			        [无限生命按钮, 无限能量按钮].forEach(btn => {
			            btn.style.padding = "8px 15px";
			            btn.style.fontSize = "0.9em";
			            btn.style.minWidth = "auto";
			            btn.style.margin = "0";
			        });
			
			        功能按钮容器.appendChild(无限生命按钮);
			        功能按钮容器.appendChild(无限能量按钮);
			
			        const GUI容器 = document.createElement("div");
			        GUI容器.style.cssText = "display: flex; flex-direction: column; gap: 15px;";
			
			        const 创建选择器区域 = (标签文本, selectId, propEditorId, ...buttons) => {
			            const 区域 = document.createElement("div");
			            区域.style.cssText = "display: flex; flex-direction: column; gap: 10px;";
			
			            const 顶行 = document.createElement("div");
			            顶行.style.cssText = "display: flex; align-items: center; gap: 10px;";
			
			            const 标签 = document.createElement("label");
			            标签.textContent = 标签文本;
			            标签.style.flexShrink = "0";
			
			            const 选择框 = document.createElement("select");
			            选择框.id = selectId;
			            选择框.style.cssText = `
			                flex-grow: 1; background: #1e1e1e; color: #e0e0e0;
			                border: 1px solid #444; border-radius: 5px; padding: 8px;
			            `;
			
			            顶行.appendChild(标签);
			            顶行.appendChild(选择框);
			            区域.appendChild(顶行);
			
			            const 属性编辑器容器 = document.createElement("div");
			            属性编辑器容器.id = propEditorId;
			            属性编辑器容器.style.cssText = `
			                display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;
			                background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; margin-top: -5px;
			            `;
			            区域.appendChild(属性编辑器容器);
			
			            const 按钮行 = document.createElement("div");
			            按钮行.style.cssText = "display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-start;";
			
			            buttons.forEach(btnConfig => {
			                const 按钮 = document.createElement("button");
			                按钮.id = btnConfig.id;
			                按钮.textContent = btnConfig.text;
			                按钮.className = "菜单按钮";
			                按钮.style.cssText = "padding: 8px 15px; font-size: 0.9em; min-width: auto; margin: 0;";
			                按钮行.appendChild(按钮);
			            });
			            区域.appendChild(按钮行);
			            return 区域;
			        };
			
			        const 物品选择区 = 创建选择器区域("物品:", "debug-item-select", "debug-item-prop-editor",
			            {id: "debug-give-item-btn", text: "给予"},
			            {id: "debug-spawn-item-btn", text: "在脚下生成"}
			        );
			        const 怪物选择区 = 创建选择器区域("怪物:", "debug-monster-select", "debug-monster-prop-editor",
			            {id: "debug-spawn-monster-btn", text: "在脚下生成"}
			        );
			
			        GUI容器.appendChild(物品选择区);
			        GUI容器.appendChild(怪物选择区);
			
			        const 分隔符 = document.createElement("div");
			        分隔符.textContent = "手动输入命令";
			        分隔符.style.cssText = "text-align: center; color: #888; margin: -5px 0;";
			
			        const 命令容器 = document.createElement("div");
			        命令容器.style.cssText = "display: flex; align-items: stretch; gap: 10px;";
			
			        const 命令输入框 = document.createElement("textarea");
			        命令输入框.id = "调试命令输入框";
			        命令输入框.placeholder = '放置物品:{"类名":"钢制长剑"}';
			        命令输入框.style.cssText = `
			            flex-grow: 1; min-height: 60px; background: #1e1e1e; color: #e0e0e0;
			            border: 1px solid #444; border-radius: 5px; padding: 10px; font-family: monospace;
			            resize: vertical;
			        `;
			
			        const 执行命令按钮 = document.createElement("button");
			        执行命令按钮.textContent = "执行";
			        执行命令按钮.className = "菜单按钮";
			        执行命令按钮.style.flexShrink = "0";
			
			        命令容器.appendChild(命令输入框);
			        命令容器.appendChild(执行命令按钮);
			
			        弹窗.appendChild(顶栏);
			        弹窗.appendChild(功能按钮容器);
			        弹窗.appendChild(GUI容器);
			        弹窗.appendChild(分隔符);
			        弹窗.appendChild(命令容器);
			
			        遮罩.appendChild(弹窗);
			        document.body.appendChild(遮罩);
			
			        const { items: allItems, monsters: allMonsters } = 获取所有可用的定义();
			
			        const 填充选择框 = (selectId, definitions, isMonster = false) => {
			            const 选择框 = document.getElementById(selectId);
			            const 选项 = [];
			            definitions.forEach(cfg => {
			                try {
			                    const 实例 = new cfg.类({});
			                    const text = isMonster ? 实例.类型 : 实例.名称;
			                    if (实例 && text) {
			                        选项.push({ text: text, value: cfg.类.name });
			                    }
			                } catch (e) {}
			            });
			
			            [...new Map(选项.map(item => [item.value, item])).values()]
			                .sort((a,b) => a.text.localeCompare(b.text, 'zh-Hans-CN'))
			                .forEach(opt => {
			                    const optionElement = document.createElement("option");
			                    optionElement.value = opt.value;
			                    optionElement.textContent = opt.text;
			                    选择框.appendChild(optionElement);
			                });
			        };
			
			        填充选择框("debug-item-select", allItems, false);
			        填充选择框("debug-monster-select", allMonsters, true);
			
			        const 创建字段 = (key, value, type = 'text') => {
			            const fieldWrapper = document.createElement('div');
			            fieldWrapper.style.cssText = `display: flex; align-items: center; gap: 5px; justify-content: space-between;`;
			
			            const label = document.createElement('label');
			            label.textContent = key;
			            label.style.cssText = 'font-size: 0.8em; color: #aaa; flex-shrink: 0;';
			
			            let input;
			            if (type === 'checkbox') {
			                input = document.createElement('input');
			                input.type = 'checkbox';
			                input.checked = !!value;
			                input.style.cssText = 'margin: 0; transform: scale(0.9);';
			            } else {
			                input = document.createElement('input');
			                input.type = type;
			                input.value = value;
			                input.style.cssText = 'background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; padding: 5px; width: 60%;';
			            }
			            input.id = `debug-prop-${key}`;
			
			            fieldWrapper.appendChild(label);
			            fieldWrapper.appendChild(input);
			            return fieldWrapper;
			        };
			
			        const 生成属性编辑器 = (itemClass, editorContainerId) => {
			            const editorContainer = document.getElementById(editorContainerId);
			            editorContainer.innerHTML = '';
			            if (!itemClass) return;
			
			            const tempInstance = new itemClass({});
			            editorContainer.appendChild(创建字段('强化', tempInstance.强化, 'checkbox'));
			
			            if (tempInstance instanceof 物品 && !(tempInstance instanceof 怪物)) {
			                editorContainer.appendChild(创建字段('品质', tempInstance.品质, 'number'));
			            }
			            if (tempInstance instanceof 武器类 || tempInstance instanceof 防御装备类) {
			                editorContainer.appendChild(创建字段('耐久', tempInstance.自定义数据.get('耐久'), 'number'));
			                editorContainer.appendChild(创建字段('不可破坏', tempInstance.自定义数据.get('不可破坏'), 'checkbox'));
			            }
			            if (tempInstance instanceof 武器类) {
			               editorContainer.appendChild(创建字段('基础攻击力', tempInstance.自定义数据.get('基础攻击力'), 'number'));
			               editorContainer.appendChild(创建字段('冷却回合', tempInstance.自定义数据.get('冷却回合'), 'number'));
			            }
			             if (tempInstance instanceof 防御装备类) {
			               editorContainer.appendChild(创建字段('防御力', tempInstance.自定义数据.get('防御力'), 'number'));
			            }
			            if (tempInstance instanceof 药水类) {
			                editorContainer.appendChild(创建字段('效果强度', tempInstance.自定义数据.get('效果强度'), 'number'));
			                editorContainer.appendChild(创建字段('基础持续时间', tempInstance.自定义数据.get('基础持续时间'), 'number'));
			            }
			             if (tempInstance instanceof 卷轴类) {
			               editorContainer.appendChild(创建字段('已解锁', tempInstance.自定义数据.get('已解锁'), 'checkbox'));
			            }
			            if (tempInstance instanceof 怪物) {
			                editorContainer.appendChild(创建字段('基础生命值', tempInstance.基础生命值, 'number'));
			                editorContainer.appendChild(创建字段('基础攻击力', tempInstance.基础攻击力, 'number'));
			            }
			        };
			
			        const itemSelect = document.getElementById('debug-item-select');
			        itemSelect.onchange = () => {
			            const className = itemSelect.value;
			            const ItemClass = window[className];
			            生成属性编辑器(ItemClass, 'debug-item-prop-editor');
			        };
			        生成属性编辑器(window[itemSelect.value], 'debug-item-prop-editor');
			
			        const monsterSelect = document.getElementById('debug-monster-select');
			        monsterSelect.onchange = () => {
			            const className = monsterSelect.value;
			            const MonsterClass = window[className];
			            生成属性编辑器(MonsterClass, 'debug-monster-prop-editor');
			        };
			        生成属性编辑器(window[monsterSelect.value], 'debug-monster-prop-editor');
			
			        const 获取编辑器配置 = (editorId) => {
			            const config = {};
			            const dataConfig = {};
			            const propInputs = document.querySelectorAll(`#${editorId} input`);
			            propInputs.forEach(input => {
			                const key = input.id.replace('debug-prop-', '');
			                const value = input.type === 'checkbox' ? input.checked : (isNaN(parseFloat(input.value)) ? input.value : parseFloat(input.value));
			
			                const dataKeys = ['耐久', '基础攻击力', '防御力', '冷却回合', '效果强度', '基础持续时间', '不可破坏', '已解锁', '基础生命值'];
			                if (dataKeys.includes(key)) {
			                    dataConfig[key] = value;
			                } else {
			                    config[key] = value;
			                }
			            });
			            if (Object.keys(dataConfig).length > 0) {
			                config.数据 = dataConfig;
			            }
			            return config;
			        };
			
			        const 关闭调试界面 = () => {
			            遮罩.remove();
			            玩家属性.允许移动--;
			            玩家属性.允许移动 = Math.max(0, 玩家属性.允许移动);
			        };
			
			        无限生命按钮.onclick = () => {
			            调试无限生命 = !调试无限生命;
			            无限生命按钮.textContent = 调试无限生命 ? "无限生命: 开" : "无限生命: 关";
			            无限生命按钮.style.borderColor = 调试无限生命 ? "#FFD700" : "";
			            if(调试无限生命) document.querySelector(".health-bar").style.width = "100%";
			        };
			
			        无限能量按钮.onclick = () => {
			            调试无限能量 = !调试无限能量;
			            无限能量按钮.textContent = 调试无限能量 ? "无限能量: 开" : "无限能量: 关";
			            无限能量按钮.style.borderColor = 调试无限能量 ? "#2196F3" : "";
			             if(调试无限能量) document.querySelector(".power-bar").style.width = "100%";
			        };
			
			        document.getElementById("debug-give-item-btn").onclick = () => {
			            const 类名 = document.getElementById("debug-item-select").value;
			            const 属性 = 获取编辑器配置('debug-item-prop-editor');
			            const 命令 = `给予物品:{"类名":"${类名}", "属性": ${JSON.stringify(属性)}}`;
			            命令输入框.value = 命令;
			            this.解析并执行命令(命令);
			        };
			
			        document.getElementById("debug-spawn-item-btn").onclick = () => {
			            const 类名 = document.getElementById("debug-item-select").value;
			            const 属性 = 获取编辑器配置('debug-item-prop-editor');
			            const 命令 = `放置物品:{"类名":"${类名}", "属性": ${JSON.stringify(属性)}}`;
			            命令输入框.value = 命令;
			            this.解析并执行命令(命令);
			        };
			
			        document.getElementById("debug-spawn-monster-btn").onclick = () => {
			            const 类名 = document.getElementById("debug-monster-select").value;
			            const 属性 = 获取编辑器配置('debug-monster-prop-editor');
			            const 命令 = `放置怪物:{"类名":"${类名}", "属性": ${JSON.stringify(属性)}}`;
			            命令输入框.value = 命令;
			            this.解析并执行命令(命令);
			        };
			
			        执行命令按钮.onclick = () => {
			            const 命令文本 = 命令输入框.value.trim();
			            if (命令文本) {
			                this.解析并执行命令(命令文本);
			            }
			        };
			
			        关闭按钮.onclick = 关闭调试界面;
			
			        命令输入框.focus();
			    }
			
			    解析并执行命令(命令文本) {
			        const [命令类型, ...参数部分] = 命令文本.split(":");
			        const 参数字符串 = 参数部分.join(":").trim();
			
			        try {
			            const 配置JSON = JSON.parse(参数字符串);
			            const 类名 = 配置JSON.类名;
			            const 属性 = 配置JSON.属性 || {};
			            const 类构造器 = window[类名];
			            let 新实例 = null
			
			            if (类构造器 && typeof 类构造器 === 'function') {
			                
			            新实例 = new 类构造器({});
			
			            if (!新实例.自定义数据) {
			                新实例.自定义数据 = new Map();
			            }
			
			            for (const [键, 值] of Object.entries(属性)) {
			                if (键 === '数据' && typeof 值 === 'object' && 值 !== null) {
			                    for (const [数据键, 数据值] of Object.entries(值)) {
			                        新实例.自定义数据.set(数据键, 数据值);
			                        if(数据键 === '基础生命值' && 新实例 instanceof 怪物) 新实例.当前生命值 = 数据值;
			                    }
			                } else {
			                    新实例[键] = 值;
			                    if(键 === '基础生命值' && 新实例 instanceof 怪物) 新实例.当前生命值 = 值;
			                }
			            }
			            }
			
			            switch (命令类型.trim().toLowerCase()) {
			                case "给予物品":
			                    if (尝试收集物品(新实例, true)) {
			                        显示通知(`已给予 ${新实例.获取名称()}`, "成功");
			                    }
			                    break;
			                case "放置物品":
			                    if (放置物品到单元格(新实例, 玩家.x, 玩家.y)) {
			                        显示通知(`成功放置 ${新实例.获取名称()}`, "成功");
			                    } else {
			                        显示通知(`无法在当前位置放置 ${类名}`, "错误");
			                    }
			                    break;
			                case "放置怪物":
			                    新实例.状态 = 怪物状态.活跃;
			                    if (放置怪物到单元格(新实例, 玩家.x, 玩家.y)) {
			                        显示通知(`成功放置 ${新实例.类型}`, "成功");
			                    } else {
			                        显示通知(`无法在当前位置放置 ${类名}`, "错误");
			                    }
			                    break;
			                case "切换楼层":
			                    const 目标层数 = parseInt(参数字符串);
			                    if (!isNaN(目标层数)) {
			                        切换楼层(目标层数);
			                        显示通知(`已切换到楼层 ${目标层数}`, "成功");
			                    } else {
			                        显示通知("无效的楼层号", "错误");
			                    }
			                    break;
			                default:
			                    显示通知("未知的调试命令", "错误");
			            }
			        } catch (错误) {
			            console.error("调试命令解析或执行错误:", 错误);
			            显示通知(`命令错误: ${错误.message}`, "错误");
			        }
			    }
			
			    获取提示() {
			        return `${this.获取名称()}\n类型：${
			            this.类型
			        }\n品质：${"★".repeat(this.品质)}\n效果：${this.效果描述}`;
			    }
			}
			class 磁铁 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "磁铁",
			            图标: 图标映射.磁铁,
			            品质: 3,
			            颜色索引: 2,
			            效果描述: "吸取周围3x3范围内的可拾取物品。",
			            基础攻击力: 0,
			            冷却回合: 4,
			            攻击范围: 0,
			            攻击目标数: 0,
			            耐久: 配置?.耐久 || 40,
			            原耐久: 配置?.耐久 || 40,
			            强化: 配置?.强化 || false,
			            数据: {
			                能量消耗: 25 - (配置.强化 ? 10 : 0),
			                吸取范围: 3,
			            },
			            ...配置,
			        });
			        if (this.强化) {
			            this.自定义数据.set('吸取范围', 5);
			            this.效果描述 = "吸取周围5x5范围内的可拾取物品。";
			        }
			    }
			
			    使用(目标怪物列表, 目标路径, 使用者 = 玩家) {
			        if (this.自定义数据.get("冷却剩余") > 0) {
			            显示通知("磁力还未充能完毕！", "警告");
			            return false;
			        }
			        if (this.自定义数据.get("耐久") <= 0) {
			            显示通知("磁铁的魔力已经耗尽。", "错误");
			            return false;
			        }
			        if (!扣除能量(this.自定义数据.get("能量消耗"))) {
			            显示通知("能量不足，无法激活磁铁！", "错误");
			            return false;
			        }
			
			        const 范围 = this.自定义数据.get('吸取范围');
			        const 半径 = Math.ceil(范围 / 2);
			        let 成功吸取数量 = 0;
			        const 待吸取物品列表 = [];
			
			        for (let dy = -半径; dy <= 半径; dy++) {
			            for (let dx = -半径; dx <= 半径; dx++) {
			                if (dx === 0 && dy === 0) continue;
			
			                const x = 使用者.x + dx;
			                const y = 使用者.y + dy;
			
			                if (x < 0 || x >= 地牢大小 || y < 0 || y >= 地牢大小) continue;
			
			                const 单元格 = 地牢[y]?.[x];
			                const 物品实例 = 单元格?.关联物品;
			                const 距离 = Math.abs(dx) + Math.abs(dy);
			
			                if (物品实例 && 物品实例.能否拾起 && 检查视线(使用者.x, 使用者.y, x, y, 范围 + 1)) {
			                    待吸取物品列表.push({ 物品: 物品实例, 单元格: 单元格, 距离: 距离 });
			                }
			            }
			        }
			
			        待吸取物品列表.sort((a, b) => a.距离 - b.距离);
			
			        if (待吸取物品列表.length === 0) {
			            显示通知("周围没有可吸取的物品。", "信息");
			            const 能量条 = document.querySelector(".power-bar");
			            const 当前能量 = parseFloat(能量条.style.width) || 0;
			            能量条.style.width = `${Math.min(100, 当前能量 + this.自定义数据.get("能量消耗")/自定义全局设置.初始能量值*100)}%`;
			            return false;
			        }
			
			        this.自定义数据.set("耐久", this.自定义数据.get("耐久") - 1);
			        if (this.自定义数据.get("耐久") <= 0) {
			            setTimeout(() => 处理销毁物品(this.唯一标识, true), 待吸取物品列表.length * 100 + 300);
			        }
			        this.自定义数据.set("冷却剩余", this.最终冷却回合);
			        更新装备显示();
			
			        const 动画延迟 = typeof gsap !== 'undefined' ? 100 : 0;
			        const 吸取间隔 = 45;
			        玩家属性.允许移动++;
			        const 吸取下一个物品 = (索引) => {
			            if (索引 >= 待吸取物品列表.length) {
			                if (成功吸取数量 > 0) {
			                    显示通知(`磁铁吸取了 ${成功吸取数量} 个物品！`, "成功");
			                }
			                if (this.自定义数据.get("耐久") <= 0) {
			                    显示通知(`${this.名称} 已损坏！`, "警告");
			                }
			                玩家属性.允许移动--
			                return;
			            }
			
			            const 当前物品数量 = [...玩家背包.values()].reduce((sum, i) => sum + (i.是否隐藏 ? 0 : 1), 0);
			            if (当前物品数量 >= 最大背包容量 && ![...玩家背包.values()].some(i => i.可堆叠于(待吸取物品列表[索引].物品))) {
			                if (成功吸取数量==0) {
			                    const 能量条 = document.querySelector(".power-bar");
			                    const 当前能量 = parseFloat(能量条.style.width) || 0;
			                    能量条.style.width = `${Math.min(100, 当前能量 + this.自定义数据.get("能量消耗")/自定义全局设置.初始能量值*100)}%`;
			                }
			                玩家属性.允许移动--
			                显示通知("背包已满，停止吸取！", "警告");
			                return;
			            }
			
			            const { 物品, 单元格 } = 待吸取物品列表[索引];
			            
			            
			
			            setTimeout(() => {
			            const 临时父元素 = document.createElement('div');
			                
			                if (尝试收集物品(物品, true)) {
			                    单元格.关联物品 = null;
			                    if (单元格.类型 === 单元格类型.物品) {
			                        单元格.类型 = null;
			                    }
			                    成功吸取数量++;
			                    
			            const 图标元素 = document.createElement('div');
			            图标元素.className = '物品图标';
			            图标元素.textContent = 物品.显示图标;
			            const color = 物品.颜色表[物品.颜色索引] || '#FFFFFF';
			            图标元素.style.color = color;
			            图标元素.style.textShadow = `0 0 8px ${color}`;
			            图标元素.style.fontSize = `${单元格大小 * 0.8}px`;
			            图标元素.style.position = 'fixed';
			            图标元素.style.display = 'flex';
			            图标元素.style.alignItems = 'center';
			            图标元素.style.justifyContent = 'center';
			            图标元素.style.width = `${单元格大小}px`;
			            图标元素.style.height = `${单元格大小}px`;
			            const 起始位置 = canvas.getBoundingClientRect();
			            图标元素.style.left = `${(物品.x - 当前相机X) * 单元格大小 + 起始位置.left}px`;
			            图标元素.style.top = `${(物品.y - 当前相机Y) * 单元格大小 + 起始位置.top}px`;
			            临时父元素.appendChild(图标元素);
			            document.getElementById('effectsContainer').appendChild(临时父元素);
			
			            创建并播放物品移动动画(临时父元素, () => document.getElementById('背包按钮'));
			                    更新背包显示();
			                    绘制();
			                } else {
			                     显示通知("背包已满，停止吸取！", "警告");
			                     玩家属性.允许移动--
			                     return;
			                }
			                
			                setTimeout(() => {吸取下一个物品(索引 + 1);临时父元素.remove();}, 吸取间隔);
			
			            }, 动画延迟);
			        };
			
			        吸取下一个物品(0);
			
			        return true;
			    }
			
			    获取提示() {
			        const 范围 = this.自定义数据.get('吸取范围');
			        const 能量消耗 = this.自定义数据.get('能量消耗');
			        return `${this.获取名称()}\n类型：${
			            this.类型
			        }\n品质：${"★".repeat(this.品质)}\n效果：${this.效果描述}\n吸取范围: ${范围}x${范围}\n能量消耗: ${能量消耗}`;
			    }
			}
			class 陷阱基类 extends 物品 {
			    constructor(配置 = {}) {
			        // 先准备好数据
			        const 基础数据 = {
			            已触发: false,
			            冷却回合: 3 + Math.floor(prng() * 2),
			            冷却剩余: 0,
			            ...配置.数据,
			        };
			
			        super({
			            类型: "陷阱",
			            能否拾起: true,
			            是否正常物品: false,
			            阻碍怪物: false,
			            // 核心修改：在父类构造时就根据数据决定图标
			            是否为隐藏物品: true,
			            颜色索引:4,
			            图标: 配置.激活后图标 || "V",
			            ...配置,
			            数据: 基础数据,
			        });
			        
			        // 将激活后的图标也存入自定义数据，以便后续使用
			        this.自定义数据.set('激活后图标', 配置.激活后图标 || "V");
			
			        if(!所有计时器.some(t => t.唯一标识 === this.唯一标识)) {
			        
			        if (游戏状态 === '地图编辑器') {
			            if (配置?.玩家放置) this.玩家放置=配置?.玩家放置
			            return;
			                
			            }
			            所有计时器.push(this);
			        }
			    }
			
			    当被收集(进入者) {
			        if (进入者 !== "玩家" || this.自定义数据.get("冷却剩余") > 0 || this.自定义数据.get("已发现")) return false;
			        if (玩家.x!==this.x||玩家.y!==this.y) return false;
			
			        
			        const 首次触发 = !this.自定义数据.get("已触发");
			        if (首次触发) {
			            this.自定义数据.set("已触发", true);
			            this.是否为隐藏物品 = false;
			            this.图标 = this.自定义数据.get('激活后图标'); // 从数据中读取激活后的图标
			            显示通知("你触发了一个陷阱！", "警告");
			        }
			        
			        this.触发效果(进入者);
			        
			        this.自定义数据.set("冷却剩余", this.自定义数据.get("冷却回合"));
			        计划显示格子特效([{ x: this.x, y: this.y }], "FF0000");
			        绘制();
			
			        return false; 
			    }
			    
			    更新倒计时() {
			        let 冷却 = this.自定义数据.get("冷却剩余");
			        if (冷却 > 0) {
			            this.自定义数据.set("冷却剩余", 冷却 - 1);
			        }
			    }
			    
			    触发效果(触发者) {
			    }
			
			    使用() { return false; }
			}
			
			class 隐形落石陷阱 extends 陷阱基类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "落石陷阱",
			            激活后图标: 图标映射.落石,
			            原图标: 图标映射.落石,
			            品质: 2,
			            效果描述: "从上方落下巨石造成伤害。",
			            数据: {
			                伤害: 15 + (配置.强化 ? 10 : 0),
			            },
			            ...配置,
			        });
			    }
			    触发效果(触发者) {
			        伤害玩家(this.自定义数据.get("伤害"), this.名称);
			    }
			}
			
			class 隐形地刺陷阱 extends 陷阱基类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "地刺陷阱",
			            激活后图标: 图标映射.地刺,
			            原图标: 图标映射.地刺,
			            品质: 2,
			            效果描述: "锋利的地刺从地面穿出，造成伤害并使你减速。",
			             数据: {
			                伤害: 10 + (配置.强化 ? 5 : 0),
			                减速回合: 3 + (配置.强化 ? 2 : 0),
			            },
			            ...配置,
			        });
			    }
			    触发效果(触发者) {
			        伤害玩家(this.自定义数据.get("伤害"), this.名称);
			        new 状态效果("缓慢", 效果颜色编号映射[效果名称编号映射.缓慢], "慢", this.自定义数据.get("减速回合"));
			    }
			}
			
			class 隐形毒气陷阱 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "陷阱",
			            名称: "隐形毒气陷阱",
			            图标: "☠️",
			            品质: 2,
			            能否拾起: true,
			            是否正常物品: false,
			            阻碍怪物: false,
			            是否为隐藏物品: true, 
			            效果描述: "一个隐藏的毒气陷阱。",
			            数据: {
			                激活后图标: 图标映射.毒气,
			                关联陷阱ID: 配置.关联陷阱ID || 0,
			                中毒强度: 配置.中毒强度||(2 + (配置.强化 ? 1 : 0)),
			                中毒持续: 5,
			                强化: 配置.强化 || false,
			            },
			            
			        });
			        this.图标="☠️";
			    }
			
			    当被收集(进入者) {
			        if (进入者 !== "玩家") return false;
			        if (this.自定义数据.get('已触发') || 玩家.x!==this.x||玩家.y!==this.y) return false;
			        this.自定义数据.set('已触发', true);
			        
			        const 强度 = this.自定义数据.get('中毒强度');
			        const 持续 = this.自定义数据.get('中毒持续');
			        new 状态效果("中毒", 效果颜色编号映射[效果名称编号映射.中毒], "☠️", 持续, null, null, null, 强度);
			        添加日志("你踩中了隐藏的毒气陷阱！", "错误");
			        
			        const 陷阱ID = this.自定义数据.get('关联陷阱ID');
			        if (陷阱ID!==undefined) {
			            揭示并激活陷阱群(陷阱ID, this.自定义数据.get('中毒持续'), this.自定义数据.get('中毒强度'));
			        }
			
			        return false;
			    }
			
			    使用() { return false; }
			}
			
			class 隐形失明陷阱 extends 陷阱基类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "失明陷阱",
			            激活后图标: 图标映射.失明,
			            原图标: 图标映射.失明,
			            品质: 3,
			            效果描述: "触发后会暂时剥夺你的视野。",
			             数据: {
			                失明持续: 15 + (配置.强化 ? 10 : 0),
			            },
			            ...配置,
			        });
			    }
			    触发效果(触发者) {
			        new 状态效果("失明", "#333333", "👁️‍🗨️", this.自定义数据.get("失明持续"));
			    }
			}
			
			class 召唤怪物陷阱 extends 陷阱基类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "召唤陷阱",
			            激活后图标: 图标映射.召唤陷阱,
			            原图标: 图标映射.召唤陷阱,
			            品质: 3,
			            效果描述: "一个不稳定的魔法阵，会召唤出地牢生物。",
			            数据: {
			               召唤数量: 配置.召唤数量 || (3 + (配置.强化 ? 3 : 0)),
			               怪物层级: 配置.怪物层级 || 当前层数===-1 ? 3 : 当前层数,
			            },
			            ...配置,
			        });
			    }
			    触发效果(触发者) {
			        let 已召唤数量 = 0;
			         for (let i = 0; i < this.自定义数据.get('召唤数量'); i++) {
			            
			            if (房间地图[this.y][this.x] && 房间地图[this.y][this.x] !== -1) {
			                const 候选怪物 = 怪物池["普通房间"].filter(m => this.自定义数据.get('怪物层级') >= m.最小层 && m.类.name !== "大魔法师");
			                if(候选怪物.length > 0) {
			                   const 选中配置 = 候选怪物[Math.floor(prng() * 候选怪物.length)];
			                   const 新怪物 = new 选中配置.类({强化: prng() < 0.2 + 当前层数 * 0.03, 状态: 怪物状态.活跃});
			                   if(放置怪物到房间(新怪物, 房间列表.find(t=>t.id==房间地图[this.y][this.x]))) {
			                       已召唤数量++;
			                   }
			                }
			            } else {
			                const 候选怪物 = 怪物池["普通房间"].filter(m => this.自定义数据.get('怪物层级') >= m.最小层 && m.类.name !== "巨人怪物" && m.类.name !== "蜈蚣怪物");
			                if(候选怪物.length > 0) {
			                   const 选中配置 = 候选怪物[Math.floor(prng() * 候选怪物.length)];
			                   let 放置位置=寻找可放置位置(玩家.x,玩家.y);
			                   const 新怪物 = new 选中配置.类({强化: prng() < 0.2 + 当前层数 * 0.03, 状态: 怪物状态.活跃,x:放置位置.x,y:放置位置.y});
			                   if(放置怪物到单元格(新怪物,放置位置.x,放置位置.y)) {
			                       已召唤数量++;
			                   }
			                }
			            }
			        }
			         if (已召唤数量 > 0) {
			            显示通知(`陷阱召唤了 ${已召唤数量} 只怪物！`, "警告");
			        }
			    }
			}
			
			class 烈焰触发陷阱 extends 陷阱基类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "烈焰陷阱",
			            激活后图标: 图标映射.烈焰陷阱,
			            原图标: 图标映射.烈焰陷阱,
			            品质: 4,
			            效果描述: "一个高温的符文，触发后会引燃整个房间。",
			             数据: {
			                引燃比例: 0.4 + (配置.强化 ? 0.2 : 0),
			            },
			            ...配置,
			        });
			    }
			    触发效果(触发者) {
			        const 房间ID = 房间地图[this.y]?.[this.x];
			        
			        let 房间 = 房间列表.find(t=>t.id==房间ID);
			        if (!房间) {
			            房间 = { id: -1, x: 玩家.x - 4, y: 玩家.y - 4, w: 8, h: 8, 类型:'房间'};
			        }
			        const 地板格子 = [];
			        for(let y = 房间.y; y < 房间.y + 房间.h; y++){
			            for(let x = 房间.x; x < 房间.x + 房间.w; x++){
			                if(位置是否可用(x, y, false)) {
			                    地板格子.push({x, y});
			                }
			            }
			        }
			        
			        const 燃烧数量 = Math.floor(地板格子.length * this.自定义数据.get('引燃比例'));
			        地板格子.sort(() => prng() - 0.5);
			        
			        for(let i=0; i < Math.min(燃烧数量, 地板格子.length); i++){
			            const {x, y} = 地板格子[i];
			            const 火焰 = new 火焰物品({强化: this.自定义数据.get('强化'),倒计时:9999});
			            放置物品到单元格(火焰, x, y);
			        }
			        显示通知("周围燃起了熊熊大火！", "错误");
			    }
			}
			
			class 隐形虫洞陷阱 extends 陷阱基类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "虫洞陷阱",
			            激活后图标: 图标映射.虫洞,
			            原图标: 图标映射.虫洞,
			            品质: 4,
			            效果描述: "不稳定的空间裂隙，会将你传送到一个固定的未知时空。",
			            ...配置,
			        });
			    }
			    
			    触发效果(触发者) {
			        // 检查陷阱是否已经决定了传送目标
			        if (生存挑战激活) {
			            return false;
			        }
			        if (!this.自定义数据.has('目标层数')) {
			            // 第一次触发：决定目标楼层并保存
			            let 可选层数 = 当前层数%5===4?[]:[当前层数 + 1]; 
			            for (let i = 0; i < 当前层数; i++) {
			                if (所有地牢层.has(i)) {
			                    可选层数.push(i);
			                }
			            }
			            const 目标层 = 可选层数[Math.floor(prng() * 可选层数.length)];
			            this.自定义数据.set('目标层数', 目标层);
			            // 此时不决定坐标，坐标将在楼层切换后决定
			        }
			
			        const 目标层数 = this.自定义数据.get('目标层数');
			        let 目标坐标 = this.自定义数据.get('目标坐标'); // 可能是 null 或已保存的坐标
			
			        if (目标层数 === undefined) {
			            显示通知("虫洞的目标不稳定，传送失败！", "错误");
			            this.自定义数据.set("冷却剩余", this.自定义数据.get("冷却回合"));
			            return;
			        }
			
			        显示通知(`你被吸入了不稳定的虫洞！即将前往第 ${目标层数} 层...`, "警告", true);
			        
			        const 传送回调 = () => {
			            let 最终目标坐标 = this.自定义数据.get('目标坐标');
			            if (!最终目标坐标) {
			                // 如果坐标未定（说明是第一次传送到新层）
			                最终目标坐标 = this.寻找随机合法坐标(目标层数);
			                this.自定义数据.set('目标坐标', 最终目标坐标);
			            }
			            // 手动修改玩家坐标
			            玩家.x = 最终目标坐标.x;
			            玩家.y = 最终目标坐标.y;
			
			            // 更新视觉和逻辑
			            更新视口();
			            绘制();
			            处理玩家着陆效果(玩家.x, 玩家.y, 玩家.x, 玩家.y);
			        };
			        
			        setTimeout(() => {
			            切换楼层(目标层数, false, null, false, 传送回调);
			        }, 500);
			    }
			
			    寻找随机合法坐标(目标层数) {
			        
			        const 可用房间 = 房间列表.filter(r => r.类型 === '房间');
			        
			        if (可用房间.length > 0) {
			            for (let 尝试 = 0; 尝试 < 50; 尝试++) {
			                const 随机房间 = 可用房间[Math.floor(prng() * 可用房间.length)];
			                if(!随机房间 || 上锁房间列表.some(r => r.id === 随机房间?.id)) continue;
			                const x = 随机房间.x + Math.floor(prng() * 随机房间.w);
			                const y = 随机房间.y + Math.floor(prng() * 随机房间.h);
			                if (地牢[y]?.[x] && [单元格类型.房间, 单元格类型.走廊].includes(地牢[y][x].背景类型)) {
			                    return { x, y };
			                }
			            }
			        }
			
			        for (let 尝试 = 0; 尝试 < 200; 尝试++) {
			            const x = Math.floor(prng() * 地牢大小);
			            const y = Math.floor(prng() * 地牢大小);
			            if (地牢[y]?.[x] && [单元格类型.房间, 单元格类型.走廊].includes(地牢[y][x].背景类型)) {
			                return {x, y};
			            }
			        }
			        
			        return { x: 玩家初始位置.x, y: 玩家初始位置.y };
			    }
			
			    获取提示() {
			        let baseTip = super.获取提示();
			        if (this.自定义数据.get("已触发")) {
			             if (this.自定义数据.has('目标层数')) {
			                const targetFloor = this.自定义数据.get('目标层数');
			                baseTip += `\n它似乎连接着第 ${targetFloor} 层。`;
			            } else {
			                baseTip += `\n一个未知的空间连接。`;
			            }
			        }
			        return baseTip;
			    }
			}
			
			class 远射陷阱 extends 怪物 {
			     constructor(配置 = {}) {
			        if (prng()<0.15) 配置.强化 = true;
			        super({
			            图标: 图标映射.远射陷阱,
			            类型: "远射陷阱",
			            基础生命值: 80 + (配置.强化 ? 40 : 0),
			            基础攻击力: 3 + (配置.强化 ? 3 : 0),
			            移动率: 0, 
			            掉落概率: 0,
			            基础攻击范围: 8,
			            跟踪距离: 12,
			            攻击冷却: 3 + (配置.强化 ? 1 : 0),
			            ...配置,
			        });
			        this.状态 = 怪物状态.活跃; 
			    }
			    
			    尝试移动() { return; }
			
			                
			    尝试攻击() {
			        if (this.攻击冷却回合剩余 > 0) {
			            this.攻击冷却回合剩余--;
			            return false;
			        }
			        if (!已访问房间.has(房间地图[this.y][this.x]) && 房间地图[this.y][this.x]!==-1) {
			            return false;
			        }
			        if(快速直线检查(this.x, this.y, 玩家.x, 玩家.y, this.攻击范围)) {
			            const 路径 = 获取直线路径(this.x, this.y, 玩家.x, 玩家.y);
			            if(路径 && 路径.length > 1) {
			                计划显示格子特效(路径.slice(1), "FF8C00");
			                伤害玩家(this.攻击力, this.类型);
			                this.攻击冷却回合剩余 = this.攻击冷却;
			
			
			                const 击退距离 = 1 + (this.强化 ? 1 : 0);
			                const dx = 玩家.x - this.x;
			                const dy = 玩家.y - this.y;
			                let 方向DX = 0, 方向DY = 0;
			
			                if(Math.abs(dx) > Math.abs(dy)){
			                    方向DX = Math.sign(dx);
			                } else {
			                    方向DY = Math.sign(dy);
			                }
			
			                if (方向DX !== 0 || 方向DY !== 0) {
			                    let 最终X = 玩家.x;
			                    let 最终Y = 玩家.y;
			
			                    for(let i=1; i <= 击退距离; i++) {
			                        const 尝试X = 玩家.x + 方向DX * i;
			                        const 尝试Y = 玩家.y + 方向DY * i;
			                        if(检查移动可行性(最终X, 最终Y, 尝试X, 尝试Y, true)) {
			                            最终X = 尝试X;
			                            最终Y = 尝试Y;
			                        } else {
			                            break;
			                        }
			                    }
			
			                    if(最终X !== 玩家.x || 最终Y !== 玩家.y) {
			                        const 旧玩家X = 玩家.x;
			                        const 旧玩家Y = 玩家.y;
			                        玩家.x = 最终X;
			                        玩家.y = 最终Y;
			                        处理玩家着陆效果(旧玩家X, 旧玩家Y, 玩家.x, 玩家.y);
			
			                        添加日志(`你被 ${this.类型} 击退了！`, "警告");
			                        绘制();
			                    }
			                }
			
			
			                return true;
			            }
			        }
			        return false;
			    }
			}
			class 狙击金币枪 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "狙击金币枪",
			            图标: 图标映射.狙击金币枪,
			            品质: 3,
			            基础攻击力: 10,
			            冷却回合: 2,
			            攻击范围: 99,
			            耐久: 配置?.耐久 || 25,
			            强化: 配置?.强化 || false,
			            效果描述: "消耗3金币，朝点击位置的怪物发射一枚可破坏墙体的子弹。对瞬移怪物必定命中。",
			            攻击目标数: 1,
			            数据: {
			                金币消耗: 3,
			                ...配置.数据,
			            },
			        });
			    }
			
			    使用(目标怪物列表,目标路径,使用者=玩家) {
			        if (使用者 instanceof 宠物) return;
			        if (this.自定义数据.get("冷却剩余") > 0) {
			            显示通知("枪械正在冷却！", "错误");
			            return true;
			        }
			        if (物品点击监听器) {
			            物品点击监听器 = null;
			            显示通知("取消了狙击模式。", "信息");
			            return true;
			        }
			
			        const 总金币 = [...玩家背包.values()].filter(i => i instanceof 金币).reduce((sum, i) => sum + i.堆叠数量, 0);
			        if (总金币 < this.自定义数据.get("金币消耗")) {
			            显示通知("金币不足！", "错误");
			            return true;
			        }
			
			        显示通知("狙击模式开启：请点击一个目标怪物。", "信息", true);
			        物品点击监听器 = (clientX, clientY) => {
			            const rect = canvas.getBoundingClientRect();
			            const x = clientX - rect.left;
			            const y = clientY - rect.top;
			            const gridX = Math.floor(视口偏移X + x / 单元格大小);
			            const gridY = Math.floor(视口偏移Y + y / 单元格大小);
			
			            const 目标单元格 = 地牢[gridY]?.[gridX];
			            const 目标怪物 = 目标单元格?.关联怪物;
			
			            if (目标怪物 && 目标怪物.状态 === 怪物状态.活跃) {
			                if (扣除金币(this.自定义数据.get("金币消耗"))) {
			                    let 路径 = 获取直线格子(玩家.x, 玩家.y, 目标怪物.x, 目标怪物.y);
			
			                    let 墙壁已穿透 = 0;
			                    for(const 节点 of 路径) {
			                        const 单元格 = 地牢[节点.y]?.[节点.x];
			                        if (单元格) {
			                            if (单元格.背景类型 === 单元格类型.墙壁) {
			                                
			                                墙壁已穿透++;
			                                if (墙壁已穿透>1) {
			                                    显示通知("墙壁太厚，子弹被阻挡！", "错误");
			                                    路径 = 获取直线格子(玩家.x, 玩家.y, 节点.x, 节点.y);
			                                    计划显示格子特效(路径.slice(1), "FFD700");
			                                    return false;
			                                }
			                            } else if (单元格.关联怪物) {
			                                单元格.关联怪物?.受伤(this.攻击力, this);
			                            }
			                        }
			                    }
			                    
			                    计划显示格子特效(路径.slice(1), "FFD700");
			                    
			
			                    目标怪物.受伤(this.攻击力, this);
			                    显示通知(`击中 ${目标怪物.类型}！`, "成功");
			
			                    this.自定义数据.set("耐久", this.自定义数据.get("耐久") - 1);
			                    if (this.自定义数据.get("耐久") <= 0) {
			                        处理销毁物品(this.唯一标识, true);
			                    }
			                    this.自定义数据.set("冷却剩余", this.最终冷却回合);
			                    更新装备显示();
			                } else {
			                    显示通知("金币不足，射击取消！", "错误");
			                }
			            } else {
			                显示通知("未击中有效目标。", "警告");
			            }
			            物品点击监听器 = null;
			        };
			        return true;
			    }
			}
			class 便携障碍物 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "工具",
			            名称: "便携障碍物",
			            图标: 图标映射.障碍物,
			            品质: 1,
			            颜色索引: 4,
			            堆叠数量: 配置.数量 || Math.ceil(7*prng()),
			            效果描述: "点击使用后，在地图上点击一次以放置。只能在障碍物本格回收。",
			            ...配置,
			        });
			    }
			
			    使用() {
			         if (玩家正在放置障碍物) {
			            玩家正在放置障碍物 = false;
			            显示通知("已取消放置障碍物。", "信息");
			            return false;
			        }
			        玩家正在放置障碍物 = true;
			        显示通知("请在地图上选择一个位置放置障碍物。", "信息", true);
			        return true;
			    }
			}
			
			class 已放置的障碍物 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "障碍物",
			            图标: 图标映射.障碍物,
			            品质: 1,
			            颜色索引: 4,
			            能否拾起: false,
			            是否正常物品: false,
			            阻碍怪物: true,
			            效果描述: "一个坚固的障碍物。",
			            ...配置,
			        });
			    }
			
			    尝试互动() {
			        if (玩家.x !== this.x || 玩家.y !== this.y) return false;
			
			        if (尝试收集物品(new 便携障碍物({数量: 1}), true)) {
			            if (地牢[this.y]?.[this.x]?.关联物品 === this) {
			                地牢[this.y][this.x].关联物品 = null;
			                if (地牢[this.y][this.x].类型 === 单元格类型.物品) {
			                   地牢[this.y][this.x].类型 = null;
			                }
			            }
			            显示通知("成功回收了障碍物！", "成功");
			            绘制();
			            return true;
			        } else {
			            显示通知("背包已满，无法回收！", "错误");
			            return false;
			        }
			    }
			}
			class 洗身砚 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "洗身砚",
			            图标: 图标映射.洗身砚,
			            品质: 4,
			            颜色索引: 1,
			            能否拾起: false,
			            是否正常物品: false,
			            阻碍怪物: true,
			            效果描述: "一座古朴的石砚，似乎能洗净尘世间的因果。",
			            数据: {
			                已使用: false,
			            },
			            ...配置,
			        });
			    }
			
			    尝试互动() {
			        if (this.自定义数据.get("已使用")) {
			            显示通知("石砚中的清水已经浑浊，失去了力量。", "信息");
			            return false;
			        }
			
			        显示自定义确认对话框(
			            "你确定要用这方石砚洗涤自身吗？<br>这会移除神龛和药水带来的负面效果",
			            () => this.使用()
			        );
			
			        return true;
			    }
			
			使用() {
			 if (this.自定义数据.get("已使用")) return false;
			
			 this.自定义数据.set("已使用", true);
			
			 
			 let 移除了诅咒 = false;
			 const 新的永久Buffs = { 已获得效果: new Set() };
			 if (永久Buffs && 永久Buffs.已获得效果) {
			     永久Buffs.已获得效果.forEach(effectId => {
			         const 效果定义 = 神龛效果列表.find(e => e.id === effectId);
			         if (效果定义 && 效果定义.类型 !== '诅咒') {
			             新的永久Buffs.已获得效果.add(effectId);
			             
			         } else if (效果定义 && 效果定义.类型 === '诅咒') {
			             移除了诅咒 = true; 
			         }
			     });
			 }
			 永久Buffs = 新的永久Buffs;
			 永久Buffs.已获得效果.forEach(effectId => {
			         const 效果定义 = 神龛效果列表.find(e => e.id === effectId);
			         if (效果定义) {
			             效果定义.apply()
			         }
			     });
			 应用永久Buffs(); 
			 
			 [...玩家状态].forEach(状态 => {
			     const 负面状态类型 = ["中毒", "缓慢", "腐蚀", "眩晕", "火焰", "恐惧", "牵制"];
			     if (负面状态类型.includes(状态.类型)) {
			         状态.移除状态();
			     }
			 });
			
			 this.效果描述 = "石砚中的清水已经浑浊，失去了力量。";
			 this.颜色索引 = 颜色表.length; 
			
			 if (移除了诅咒) {
			     显示通知("一阵清明流过全身，你感到了身上的诅咒之力已然消散。", "成功");
			 } else {
			     显示通知("清水洗涤了你的尘埃。", "信息");
			 }
			 
			 绘制();
			 return true;
			}
			
			    获取提示() {
			        return `${this.获取名称()}\n品质：${"★".repeat(this.品质)}\n${this.效果描述}`;
			    }
			}
			class 时空罗盘 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			类型: "工具",
			名称: "时空罗盘",
			图标: 图标映射.沙漏,
			品质: 5,
			颜色索引: 4,
			最大堆叠数量: 1,
			效果描述: "激活后，扭曲时间，令所有怪物跳过其行动回合。每次使用都会消耗其耐久。",
			强化: 配置.强化 || false,
			数据: {
			    耐久: 配置.耐久 || (15+ (配置.强化?15:0)),
			    原耐久: 配置.原耐久 || (15+ (配置.强化?15:0)),
			    能量消耗: 50,
			    跳过回合数: 3 + (配置.强化?3:0),
			    ...配置.数据,
			},
			...配置,
			        });
			    }
			
			    使用() {
			        if (this.自定义数据.get("耐久") <= 0) {
			显示通知("罗盘的能量已经耗尽！", "错误");
			return false;
			        }
			
			        if (!扣除能量(this.自定义数据.get("能量消耗"))) {
			显示通知("能量不足！", "错误");
			return false;
			        }
			
			        
			        跳过怪物回合剩余次数 += this.自定义数据.get("跳过回合数");
			        显示通知(`怪物凝固了！ (持续 ${this.自定义数据.get("跳过回合数")} 回合)`, "成功");
			
			        
			        this.自定义数据.set("耐久", this.自定义数据.get("耐久") - 1);
			        if (this.自定义数据.get("耐久") <= 0) {
			处理销毁物品(this.唯一标识, true);
			        }
			
			        更新装备显示();
			        return true;
			    }
			
			    获取提示() {
			        const lines = super.获取提示().split('\n');
			        // 移除多余的堆叠信息
			        const stackIndex = lines.findIndex(line => line.startsWith('堆叠：'));
			        if (stackIndex !== -1) {
			lines.splice(stackIndex, 1);
			        }
			        
			        const stats = [
			`能量消耗：${this.自定义数据.get("能量消耗")}`,
			`跳过回合：${this.自定义数据.get("跳过回合数")}`,
			`剩余次数：${this.自定义数据.get("耐久")} / ${this.自定义数据.get("原耐久")}`,
			        ];
			        
			        // 插入到品质行之后
			        const qualityIndex = lines.findIndex(line => line.startsWith('品质：'));
			        if (qualityIndex !== -1) {
			lines.splice(qualityIndex + 1, 0, ...stats);
			        } else {
			lines.unshift(...stats);
			        }
			        
			        return lines.join('\n');
			    }
			}
			
			class 毒气 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "毒气",
			            图标: 图标映射.毒气,
			            品质: 1,
			            颜色索引: 效果名称编号映射.中毒,
			            能否拾起: true,
			            是否正常物品: false,
			            阻碍怪物: false,
			            效果描述: "一片弥漫的毒气，接触的生物会中毒。",
			            数据: {
			                倒计时: 配置.倒计时 || (8 + (配置.强化 ? 4 : 0)),
			                来源: 配置.来源 || '玩家',
			                爆炸时间: 配置.爆炸时间 || (8 + (配置.强化 ? 4 : 0)),
			                中毒强度: 配置.中毒强度 || 2 + (配置.强化 ? 1 : 0),
			                中毒持续: 配置.中毒持续 || 5,
			            },
			            ...配置,
			        });
			    }
			
			    当被收集(进入者) {
			        if (this.自定义数据.get('来源') === '玩家' && 进入者 instanceof 怪物 && !(进入者 instanceof 幽灵怪物)) {
			            new 状态效果("中毒", this.获取毒气颜色(), "☠️", this.自定义数据.get("中毒持续"), null, null, 进入者, this.自定义数据.get("中毒强度"));
			            添加日志(`${进入者.类型} 进入了毒气！`, "警告");
			        } else if (this.自定义数据.get('来源') === '陷阱' && 进入者 === '玩家') {
			        const 强度 = this.自定义数据.get('中毒强度');
			        const 持续 = this.自定义数据.get('中毒持续');
			        new 状态效果("中毒", 效果颜色编号映射[效果名称编号映射.中毒], "☠️", 持续, null, null, null, 强度);
			        }
			        return false; 
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
			        绘制();
			    }
			    
			    获取毒气颜色() {
			        return 效果颜色编号映射[this.颜色索引] || "#008000";
			    }
			
			    get 颜色表() {
			        return 效果颜色编号映射;
			    }
			}
			
			class 毒气瓶 extends 物品 {
			     constructor(配置 = {}) {
			        super({
			            类型: "消耗品",
			            名称: "毒气瓶",
			            图标: 图标映射.毒气瓶,
			            品质: 2,
			            颜色索引: 效果名称编号映射.中毒,
			            堆叠数量: 配置.数量 || 1,
			            最大堆叠数量: 8,
			            效果描述: "在玩家周围3x3区域释放一片毒气云。",
			            强化: 配置.强化 || false,
			            ...配置,
			        });
			    }
			
			    使用() {
			        if (this.堆叠数量 <= 0) return false;
			
			        let 放置成功计数 = 0;
			        for (let dy = -1; dy <= 1; dy++) {
			            for (let dx = -1; dx <= 1; dx++) {
			                const 目标X = 玩家.x + dx;
			                const 目标Y = 玩家.y + dy;
			
			                if (位置是否可用(目标X, 目标Y, false)) {
			                    const 毒气实例 = new 毒气({ 强化: this.强化 });
			                    if (放置物品到单元格(毒气实例, 目标X, 目标Y)) {
			                         所有计时器.push(毒气实例);
			                         放置成功计数++;
			                    }
			                }
			            }
			        }
			
			        if (放置成功计数 > 0) {
			            this.堆叠数量--;
			            if (this.堆叠数量 <= 0) {
			                处理销毁物品(this.唯一标识, true);
			            }
			            显示通知(`释放了毒气云！`, "成功");
			            更新背包显示();
			            更新装备显示();
			            绘制();
			            return true;
			        } else {
			            显示通知("周围没有空间释放毒气！", "错误");
			            return false;
			        }
			    }
			    get 颜色表() {
			        return 效果颜色编号映射;
			    }
			}
			
			class 万能钥匙 extends 钥匙 {
			    constructor(配置 = {}) {
			        super({
			            ...配置,
			            名称: "万能钥匙",
			            图标: 图标映射.万能钥匙,
			            品质: 3,
			            颜色索引: 2,
			            效果描述: "这把钥匙似乎能打开任何锁。",
			            地牢层数: -1,
			            对应门ID: -1,
			        });
			    }
			    
			    可交互目标(门实例) {
			        if (门实例.类型 === "上锁的门") {
			            return true;
			        }
			        return false;
			    }
			    
			    获取名称() {
			        return `万能钥匙`;
			    }
			}
			
			class 陨石法杖 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "陨石法杖",
			            图标: 图标映射.陨石法杖,
			            品质: 4,
			            基础攻击力: 15 + (配置.强化 ? 10 : 0),
			            冷却回合: 14 - (配置.强化 ? 2 : 0),
			            攻击范围: 4,
			            耐久: 配置?.耐久 || 40,
			            强化: 配置?.强化 || false,
			            效果描述: "召唤数颗小型陨石轰击附近的敌人。",
			            数据: {
			                陨石数量: 3 + (配置.强化 ? 2 : 0),
			                爆炸范围: 2,
			            },
			            ...配置,
			        });
			    }
			
			    
			    使用(目标怪物列表,目标路径,使用者=玩家) {
			        if (this.堆叠数量 <= 0 || this.自定义数据.get("冷却剩余") > 0) return false;
			
			        const 范围 = this.最终攻击范围;
			        const 陨石数量 = this.自定义数据.get("陨石数量");
			        const 爆炸范围 = this.自定义数据.get("爆炸范围");
			        
			        const 候选怪物列表 = [];
			        const 怪物位置集合 = new Set();
			        
			        for (let y = 使用者.y - 范围; y <= 使用者.y + 范围; y++) {
			            for (let x = 使用者.x - 范围; x <= 使用者.x + 范围; x++) {
			                if (x < 0 || x >= 地牢大小 || y < 0 || y >= 地牢大小) continue;
			                const 距离 = Math.abs(x-使用者.x) + Math.abs(y-使用者.y);
			                if (距离 > 范围) continue;
			                
			                const 单元格 = 地牢[y]?.[x];
			                if (单元格 && 单元格.关联怪物 && 单元格.关联怪物.状态 === 怪物状态.活跃) {
			                    if (检查视线(使用者.x, 使用者.y, x, y, 范围)) {
			                         if (!怪物位置集合.has(`${x},${y}`)) {
			                            候选怪物列表.push(单元格.关联怪物);
			                            怪物位置集合.add(`${x},${y}`);
			                         }
			                    }
			                }
			            }
			        }
			
			        if (候选怪物列表.length === 0) {
			            显示通知("附近没有目标可供轰炸！", "错误");
			            return false;
			        }
			
			        const 目标点列表 = [];
			        if (候选怪物列表.length <= 陨石数量) {
			            // 如果怪物数量不多，直接以每个怪物为目标
			            候选怪物列表.forEach(m => 目标点列表.push({ x: m.x, y: m.y, 权重: 5 }));
			        } else {
			            // 怪物太多，需要聚类选择最优轰炸点
			            const 潜在轰炸点 = new Map();
			            候选怪物列表.forEach(怪物 => {
			                 for (let dy = -爆炸范围; dy <= 爆炸范围; dy++) {
			                    for (let dx = -爆炸范围; dx <= 爆炸范围; dx++) {
			                        const 落点X = 怪物.x + dx;
			                        const 落点Y = 怪物.y + dy;
			                        if (落点X < 0 || 落点X >= 地牢大小 || 落点Y < 0 || 落点Y >= 地牢大小) continue;
			                        
			                        const 单元格 = 地牢[落点Y]?.[落点X];
			                        if(单元格 && [单元格类型.房间, 单元格类型.走廊].includes(单元格.背景类型) && !单元格.关联物品?.阻碍怪物) {
			                            const key = `${落点X},${落点Y}`;
			                            if(!潜在轰炸点.has(key)){
			                                潜在轰炸点.set(key, {x: 落点X, y: 落点Y, 权重: 0});
			                            }
			                        }
			                    }
			                }
			            });
			
			            潜在轰炸点.forEach(落点 => {
			               let 覆盖怪物数 = 0;
			               候选怪物列表.forEach(怪物 => {
			                   if (Math.abs(怪物.x - 落点.x) <= 爆炸范围 && Math.abs(怪物.y - 落点.y) <= 爆炸范围) {
			                       覆盖怪物数++;
			                   }
			               });
			               落点.权重 = 覆盖怪物数;
			            });
			            
			            const 排序后的落点 = Array.from(潜在轰炸点.values()).sort((a, b) => b.权重 - a.权重);
			            for(let i = 0; i < Math.min(陨石数量, 排序后的落点.length); i++){
			                目标点列表.push(排序后的落点[i]);
			            }
			        }
			
			        if (目标点列表.length === 0) {
			             显示通知("没有合适的位置召唤陨石！", "错误");
			             return false;
			        }
			
			        目标点列表.forEach((目标点, index) => {
			           setTimeout(() => {
			               const 临时炸弹 = new 炸弹({ 强化: true }); 
			                临时炸弹.x = 目标点.x;
			                临时炸弹.y = 目标点.y;
			                临时炸弹.能否拾起 = false;
			                临时炸弹.自定义数据.set("爆炸范围", 爆炸范围);
			                临时炸弹.自定义数据.set("伤害", 17);
			                
			                临时炸弹.触发爆炸();
			           }, index * 120); // 陨石依次落下
			        });
			        
			        this.自定义数据.set("耐久", this.自定义数据.get("耐久") - this.耐久消耗);
			        if (this.自定义数据.get("耐久") <= 0) {
			            处理销毁物品(this.唯一标识, true);
			        }
			        this.自定义数据.set("冷却剩余", this.最终冷却回合);
			        更新装备显示();
			        显示通知("陨石从天而降！", "成功");
			        return true;
			    }
			}
			class 配方卷轴 extends 物品 {
			    constructor(配置 = {}) {
			        const recipe = 配置.recipeData || {
			            输入: ["未知物品A", "未知物品B"],
			            输出类: "未知物品C",
			            输出类名称: "未知物品C",
			            说明: "一个神秘的配方",
			        };
			        super({
			            类型: "其他",
			            名称: `配方: ${recipe.输出类名称 || recipe.输出类}`,
			            图标: 图标映射.卷轴,
			            品质: 2,
			            颜色索引: 1,
			            效果描述: `学习一个物品融合配方！`,
			            是否正常物品: true,
			            能否拾起: true,
			            数据: {
			                recipe: recipe,
			                层数: 配置.层数,
			                已解锁: true, // Recipe scrolls are always "readable"
			            },
			            ...配置,
			        });
			    }
			
			    使用() {
			        const recipe = this.自定义数据.get("recipe");
			        if (recipe) {
			            const recipeString = recipe.说明;
			            if (
			                !已发现的程序生成配方.some(
			                    (r) => r.说明 === recipeString
			                )
			            ) {
			                已发现的程序生成配方.push(recipe);
			                // Also add to the main 融合配方列表 so it can be used immediately
			                if (
			                    !融合配方列表.some(
			                        (r) => r.说明 === recipeString
			                    )
			                ) {
			                    融合配方列表.push(recipe);
			                }
			                显示通知(`学会了新配方: ${recipe.说明}`, "成功");
			
			                处理销毁物品(this, true);
			                return true;
			            } else {
			                显示通知("你已经知道这个配方了。", "信息");
			
			                return true;
			            }
			        }
			        return false;
			    }
			
			    获取提示() {
			        const recipe = this.自定义数据.get("recipe");
			        let desc = super.获取提示();
			        if (recipe && recipe.说明) {
			            desc += `\n配方内容: ${recipe.说明}`;
			        }
			        return desc;
			    }
			}
			class 湮灭卷轴 extends 卷轴类 {
			    constructor(配置) {
			        super({
			            名称: "湮灭卷轴",
			            品质: 3,
			            效果描述: "销毁所有已装备物品",
			            能量消耗: 0,
			            强化: 配置.强化 || false,
			            已解锁: 配置.已解锁 || false,
			        });
			    }
			
			    使用() {
			        if (!this.消耗能量()) return false;
			        let 销毁列表 = Array.from(
			            { length: 装备栏每页装备数 },
			            (_, i) =>
			                玩家装备.get(当前装备页 * 装备栏每页装备数 + i + 1)
			        ).filter((v) => v != null);
			
			        销毁列表.forEach((item) => {
			            const 槽位元素 = document.getElementById(
			                `装备槽${
			                    ((item.装备槽位 - 1) % 装备栏每页装备数) + 1
			                }`
			            ); // 修正槽位ID获取
			            if (槽位元素) {
			                // 确保槽位元素存在
			                const 烟花容器 = document.createElement("div");
			                烟花容器.style.position = "fixed";
			                const rect = 槽位元素.getBoundingClientRect();
			                烟花容器.style.left = `${
			                    rect.left + rect.width / 2
			                }px`;
			                烟花容器.style.top = `${
			                    rect.top + rect.height / 2
			                }px`;
			                烟花容器.style.zIndex = 99999;
			                document.body.appendChild(烟花容器);
			
			                for (let i = 0; i < 12; i++) {
			                    const 粒子 = document.createElement("div");
			                    粒子.className = "烟花粒子";
			                    粒子.innerHTML = [
			                        "✨",
			                        "❄️",
			                        "⚡",
			                        "⭐",
			                        "💥",
			                        "🔥",
			                    ][i % 6];
			                    粒子.style.color = "#fff";
			                    粒子.style.setProperty(
			                        "--tx",
			                        Math.cos((i * 30 * Math.PI) / 180)
			                    );
			                    粒子.style.setProperty(
			                        "--ty",
			                        Math.sin((i * 30 * Math.PI) / 180)
			                    );
			                    烟花容器.appendChild(粒子);
			                }
			                setTimeout(() => 烟花容器.remove(), 800);
			            }
			            item.取消装备();
			            处理销毁物品(item.唯一标识, true);
			        });
			        处理销毁物品(this.唯一标识, true);
			        更新背包显示();
			        更新装备显示();
			        显示通知(`湮灭了${销毁列表.length} 件装备`, "错误");
			        return true;
			    }
			}
			
			class 秘银锁甲 extends 防御装备类 {
			    constructor(配置) {
			        super({
			            名称: "秘银锁甲",
			            图标: 图标映射.秘银锁甲,
			            品质: 3,
			            防御力: 3,
			            效果描述: "轻盈而坚固的锁甲。",
			            耐久: 配置.耐久 || 150,
			            强化: 配置.强化 || false,
			            不可破坏: 配置.不可破坏 || false,
			        });
			    }
			    获取提示() {
			        return super.获取提示();
			    }
			}
			
			class 钢制板甲 extends 防御装备类 {
			    constructor(配置) {
			        super({
			            名称: "钢制板甲",
			            图标: 图标映射.钢制板甲,
			            品质: 2,
			            强化: 配置.强化 || false,
			            防御力: 1,
			            效果描述: "沉重的钢制板甲，提供基础防护。",
			            耐久: 配置.耐久 || 200,
			            不可破坏: 配置.不可破坏 || false,
			        });
			    }
			    获取提示() {
			        return super.获取提示();
			    }
			}
			
			class 锅盖 extends 防御装备类 {
			    constructor(配置) {
			        super({
			            名称: "锅盖",
			            图标: 图标映射.锅盖,
			            品质: 2,
			            强化: 配置.强化 || false,
			            防御力: 2,
			            效果描述: "笨重的锅盖，似乎可以用于防御。",
			            耐久: 配置.耐久 || 150,
			            不可破坏: 配置.不可破坏 || false,
			        });
			    }
			    获取提示() {
			        return super.获取提示();
			    }
			}
			
			class 冰盾 extends 防御装备类 {
			    constructor(配置) {
			        super({
			            名称: "冰盾",
			            图标: 图标映射.冰盾,
			            效果描述: `受击时有 ${(0.8 * 100).toFixed(
			                0
			            )}% 概率冻结攻击者 ${3} 回合。`,
			            品质: 3,
			            强化: 配置.强化 || false,
			            防御力: 2,
			            耐久: 配置.耐久 || 100,
			            不可破坏: 配置.不可破坏 || false,
			            数据: {
			                冻结概率: 0.8,
			                冻结回合: 3,
			            },
			        });
			    }
			
			    当被攻击(原始攻击力, 来源 = null) {
			        const 最终伤害 = super.当被攻击(原始攻击力, 来源);
			        if (
			            prng() < this.自定义数据.get("冻结概率") &&
			            来源 instanceof 怪物
			        ) {
			            const 攻击者 = 来源;
			            if (攻击者) {
			                const 冻结状态 = new 状态效果(
			                    "冻结",
			                    "#2196F3",
			                    "冻",
			                    this.自定义数据.get("冻结回合"),
			                    null,
			                    null,
			                    攻击者
			                );
			            }
			        }
			        return 最终伤害;
			    }
			    获取提示() {
			        return super.获取提示();
			    }
			}
			class 存档点 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "存档点",
			            图标: 图标映射.存档点,
			            品质: 5,
			            颜色索引: 1, 
			            能否拾起: false,
			            是否正常物品: false,
			            阻碍怪物: true,
			            效果描述: "互动后，你的重生点将被设置在此处。",
			            数据: {
			                目标X: 配置.数据?.目标X ?? null,
			                目标Y: 配置.数据?.目标Y ?? null,
			            },
			            ...配置,
			        });
			    }
			
			    尝试互动() {
			        const 目标X = this.自定义数据.get('目标X');
			        const 目标Y = this.自定义数据.get('目标Y');
			
			        if (目标X == null || 目标Y == null || isNaN(目标X) || isNaN(目标Y)) {
			            玩家初始位置.x = this.x;
			            玩家初始位置.y = this.y;
			        } else {
			            玩家初始位置.x = parseInt(目标X);
			            玩家初始位置.y = parseInt(目标Y);
			        }
			        
			        显示通知(`重生点已设置在 (${玩家初始位置.x}, ${玩家初始位置.y})！`, '成功');
			        计划显示格子特效([{x: 玩家初始位置.x, y: 玩家初始位置.y}], '4CAF50');
			        return true;
			    }
			
			    获取提示() {
			        const 目标X = this.自定义数据.get('目标X');
			        const 目标Y = this.自定义数据.get('目标Y');
			        let 提示 = super.获取提示();
			        if (目标X !== null && 目标Y !== null) {
			            提示 += `\n重生坐标: (${目标X}, ${目标Y})`;
			        } else {
			            提示 += `\n重生坐标: (当前位置)`;
			        }
			        return 提示;
			    }
			}
			class 重铸台 extends 物品 {
			 constructor(配置 = {}) {
			     const 最大耐久 = 5;
			     const 当前耐久 = 配置.耐久 ?? 最大耐久;
			     super({
			         类型: "工具",
			         名称: "重铸台",
			         图标: 图标映射.重铸台,
			         品质: 4,
			         颜色索引: 3,
			         最大堆叠数量: 1,
			         效果描述: `消耗金币，可将一件装备/武器的耐久完全修复。\n剩余使用次数：${当前耐久}/${最大耐久}`,
			         数据: {
			             耐久: 当前耐久,
			             最大耐久: 最大耐久,
			             ...配置.数据,
			         },
			     });
			 }
			
			 
			 计算修复消耗(物品) {
			     if (!物品 || !物品.自定义数据.has('原耐久')) return 0;
			     const 最大耐久 = 物品.自定义数据.get('原耐久');
			     const 当前耐久 = 物品.自定义数据.get('耐久');
			     const 已损失耐久百分比 = (最大耐久 - 当前耐久) / 最大耐久;
			
			     if (已损失耐久百分比 <= 0) return 0;
			
			     let 基础消耗 = 15; // 修复的基础费用
			     基础消耗 += 物品.品质 * 10; // 品质越高越贵
			     基础消耗 += 最大耐久 * 0.5; // 耐久上限越高越贵
			     if (物品.强化) {
			         基础消耗 *= 1.5; // 强化物品修复更贵
			     }
			     
			     // 最终消耗与损失的耐久度成正比
			     const 最终消耗 = Math.ceil(基础消耗 * 已损失耐久百分比);
			     return Math.max(1, 最终消耗); // 最低消耗1金币
			 }
			
			 使用() {
			     if (this.自定义数据.get("耐久") <= 0) {
			         显示通知("修复台的能量已经耗尽！", "错误");
			         return false;
			     }
			     显示修复界面(this);
			     return true;
			 }
			}
			
			class 火把 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "工具",
			            名称: "火把",
			            图标: 图标映射.火焰,
			            品质: 1,
			            颜色索引: 2,
			            堆叠数量: 配置.数量 || 1,
			            最大堆叠数量: 1,
			            效果描述: `装备后视野+${
			                2 + (配置.强化 ? 1 : 0)
			            }，丢地上光照${
			                3 + (配置.强化 ? 1 : 0)
			            }格。每回合消耗耐久。`,
			            强化: 配置.强化 || false,
			            数据: {
			                耐久: 配置.耐久 || 400 + (配置.强化 ? 400 : 0),
			                原耐久: 400 + (配置.强化 ? 400 : 0),
			                光照范围: 3 + (配置.强化 ? 1 : 0),
			                视野加成: 2 + (配置.强化 ? 1 : 0),
			                倒计时: 配置.耐久 || 400 + (配置.强化 ? 400 : 0),
			                爆炸时间: 配置.耐久 || 400 + (配置.强化 ? 400 : 0),
			                不可破坏: false,
			                ...配置.数据,
			            },
			        });
			        this.是否被丢弃 = 配置.是否被丢弃 ?? false;
			    }
			    生成显示元素(用途 = "背包") {
			        const 元素 = super.生成显示元素(用途);
			
			        if (
			            this.自定义数据.has("耐久") &&
			            this.自定义数据.has("原耐久") &&
			            用途 === "装备"
			        ) {
			            let 耐久标签 = 元素.querySelector(".耐久标签");
			            if (!耐久标签) {
			                耐久标签 = document.createElement("div");
			                耐久标签.className = "耐久标签";
			                元素.appendChild(耐久标签);
			            }
			
			            耐久标签.textContent = `耐久:${this.自定义数据.get(
			                "耐久"
			            )}`;
			        }
			        return 元素;
			    }
			
			    装备() {
			        const 装备成功 = super.装备();
			        if (装备成功) {
			            if (
			                !所有计时器.some(
			                    (t) => t.唯一标识 === this.唯一标识
			                )
			            ) {
			                所有计时器.push(this);
			            }
			            解冻药水();
			        }
			        return 装备成功;
			    }
			
			    取消装备() {
			        const 卸下成功 = super.取消装备();
			        if (卸下成功) {
			            所有计时器 = 所有计时器.filter(
			                (t) => t.唯一标识 !== this.唯一标识
			            );
			        }
			        return 卸下成功;
			    }
			
			    更新倒计时() {
			        let 当前耐久 = this.自定义数据.get("倒计时");
			        当前耐久--;
			        if (!this.是否被丢弃){
			            this.x=玩家.x
			            this.y=玩家.y
			        }
			        if (当前天气效果.includes("严寒")) {
			            当前耐久--;
			        }
			        this.自定义数据.set("倒计时", 当前耐久);
			        this.自定义数据.set("耐久", 当前耐久);
			
			        if (当前耐久 <= 0) {
			            this.触发爆炸();
			        }
			
			        if (this.已装备) {
			            更新装备显示();
			        }
			    }
			
			    触发爆炸() {
			        显示通知(`${this.名称} 燃尽熄灭了。`, "信息");
			
			        if (
			            this.x !== null &&
			            this.y !== null &&
			            地牢[this.y]?.[this.x]?.关联物品 === this
			        ) {
			            地牢[this.y][this.x].关联物品 = null;
			            地牢[this.y][this.x].类型 =
			                null;
			        }
			        所有计时器 = 所有计时器.filter(
			            (t) => t.唯一标识 !== this.唯一标识
			        );
			
			        if (玩家背包.has(this.唯一标识)) {
			            处理销毁物品(this.唯一标识, true);
			        }
			        绘制();
			    }
			
			    使用() {
			        if (!this.已装备) {
			            if (this.装备()) {
			                显示通知(`装备了 ${this.名称}`, "成功");
			                更新背包显示();
			                更新装备显示();
			                return true;
			            } else {
			                显示通知("装备槽已满！", "错误");
			                return false;
			            }
			        } else {
			            显示通知("火把已装备", "信息");
			            return false;
			        }
			    }
			
			    获取提示() {
			        return super.获取提示();
			    }
			
			    当被丢弃(x, y) {
			        this.x = x;
			        this.y = y;
			        if (
			            this.自定义数据.get("耐久") > 0 &&
			            !所有计时器.some((t) => t.唯一标识 === this.唯一标识)
			        ) {
			            所有计时器.push(this);
			        }
			        return true;
			    }
			    当被收集(进入者) {
			        if (进入者 !== "玩家") return;
			        所有计时器 = 所有计时器.filter(
			            (t) => t.唯一标识 !== this.唯一标识
			        );
			        return true;
			    }
			}
			
			            class 喷火枪 extends 武器类 {
			    constructor(配置) {
			        super({
			            名称: "喷火枪",
			            图标: 图标映射.喷火枪,
			            品质: 2,
			            基础攻击力: 4,
			            冷却回合: 4,
			            攻击范围: 2,
			            耐久: 配置?.耐久 || 100,
			            强化: 配置?.强化 || false,
			            效果描述:
			                "向四个方向喷射火焰，对距离3格的直线敌人造成范围伤害，并能点燃荆棘丛。",
			            攻击目标数: 1,
			            不可破坏: 配置?.不可破坏 || false,
			            附魔: 配置?.数据?.附魔 || [],
			            数据: {
			                火焰范围: 2,
			            },
			        });
			    }
			
			    使用(目标怪物,路径,使用者=玩家) {
			        if (
			            this.堆叠数量 <= 0 ||
			            this.自定义数据.get("冷却剩余") > 0
			        )
			            return 0;
			        if (当前天气效果.includes("严寒")) {
			            if (目标怪物)
			                显示通知("温度过低，武器打不着火了！", "警告");
			            return 0;
			        }
			        const 总攻击力 = this.攻击力;
			        let 总有效伤害 = 0;
			        const 击中怪物列表 = new Set();
			        const 火焰影响区域 = [];
			
			        const 火焰范围 = this.自定义数据.get("火焰范围");
			        const 目标X = 使用者.x;
			        const 目标Y = 使用者.y;
			
			        if (
			            目标X < 0 ||
			            目标X >= 地牢大小 ||
			            目标Y < 0 ||
			            目标Y >= 地牢大小
			        )
			            return;
			
			        const 当前方向火焰区 = [];
			        for (let 偏移 = -火焰范围; 偏移 <= 火焰范围; 偏移++) {
			            const 格子Y = 目标Y + 偏移;
			            if (格子Y >= 0 && 格子Y < 地牢大小) {
			                if (
			                    快速直线检查(
			                        使用者.x,
			                        使用者.y,
			                        目标X,
			                        格子Y,
			                        Math.abs(偏移)
			                    )
			                ) {
			                    当前方向火焰区.push({ x: 目标X, y: 格子Y });
			                }
			            }
			        }
			        for (let 偏移 = -火焰范围; 偏移 <= 火焰范围; 偏移++) {
			            const 格子X = 目标X + 偏移;
			            if (格子X >= 0 && 格子X < 地牢大小) {
			                if (
			                    快速直线检查(
			                        使用者.x,
			                        使用者.y,
			                        格子X,
			                        目标Y,
			                        Math.abs(偏移)
			                    )
			                ) {
			                    当前方向火焰区.push({ x: 格子X, y: 目标Y });
			                }
			            }
			        }
			
			        当前方向火焰区.forEach(({ x, y }) => {
			            火焰影响区域.push({ x, y });
			            const 单元格 = 地牢[y][x];
			            if (单元格?.关联物品 instanceof 荆棘丛) {
			                const 荆棘丛实例 = 单元格.关联物品;
			                所有计时器 = 所有计时器.filter(t => t.唯一标识 !== 荆棘丛实例.唯一标识);
			                const 火焰 = new 火焰物品({ 强化: this.强化 });
			                单元格.关联物品 = 火焰;
			                火焰.x = x;
			                火焰.y = y;
			                所有计时器.push(火焰);
			                添加日志(`荆棘丛在 (${x}, ${y}) 被点燃了！`, "警告");
			            } else if (
			                单元格 &&
			                单元格.关联物品 instanceof 祭坛类 &&
			                单元格.关联物品.自定义数据.get("激活条件") ===
			                    "火焰净化" &&
			                !单元格.关联物品.自定义数据.get("已激活")
			            ) {
			                单元格.关联物品.激活();
			            } else if (
			                单元格 &&
			                单元格.关联怪物 &&
			                单元格.关联怪物.当前生命值 > 0 &&
			                !击中怪物列表.has(单元格.关联怪物)
			            ) {
			                const 怪物 = 单元格.关联怪物;
			                const 原始血量 = 怪物.当前生命值;
			                怪物.受伤(总攻击力, "玩家");
			                const 实际伤害 = 原始血量 - 怪物.当前生命值;
			                if (实际伤害 > 0) {
			                    总有效伤害 += 实际伤害;
			                    击中怪物列表.add(怪物);
			                }
			            }
			        });
			
			        火焰影响区域.forEach((格子) =>
			            计划显示格子特效([格子], "FFA500")
			        );
			
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
			            Math.max(
			               this.最终冷却回合 -
			                    (this.强化 ? 1 : 0),
			                0
			            )
			        );
			
			        if (总有效伤害 > 0) {
			            显示通知(
			                `${this.名称} 对 ${
			                    击中怪物列表.size
			                } 个目标造成共 ${总有效伤害.toFixed(1)} 点伤害！`,
			                "成功"
			            );
			        } else if (火焰影响区域.length > 0) {
			            显示通知(`${this.名称} 喷射了火焰！`, "信息");
			        } else {
			            显示通知(`${this.名称} 未能喷射火焰！`, "警告");
			            return 0;
			        }
			
			        if (总有效伤害 > 0) {
			            const 受击怪物数组 = Array.from(击中怪物列表);
			            const 火焰等级 =
			                (this.自定义数据
			                    .get("附魔")
			                    ?.find((item) => item.种类 === "火焰附魔")
			                    ?.等级 || 0) + 2;
			            受击怪物数组.forEach((怪物) => {
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
			
			            const 连锁附魔 = this.自定义数据
			                .get("附魔")
			                ?.find((item) => item.种类 === "连锁附魔");
			            if (连锁附魔) {
			                const 连锁距离 = 连锁附魔.等级;
			                受击怪物数组.forEach((初始目标) => {
			                    if (初始目标.当前生命值 > 0) {
			                        this.触发连锁(
			                            初始目标,
			                            连锁距离,
			                            受击怪物数组
			                        );
			                    }
			                });
			            }
			        }
			        return 总有效伤害;
			    }
			
			    获取提示() {
			        return super.获取提示();
			    }
			}
			class 斜方刀 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "斜方刀",
			            图标: 图标映射.斜方刀,
			            品质: 2,
			            基础攻击力: 5,
			            冷却回合: 3,
			            攻击范围: 4,
			            耐久: 配置?.耐久 || 60,
			            强化: 配置?.强化 || false,
			            效果描述:
			                "向四个斜向挥出刀光，对路径上2格内的敌人造成伤害。",
			            攻击目标数: 8,
			            不可破坏: 配置?.不可破坏 || false,
			            附魔: 配置?.数据?.附魔 || [],
			            数据: {
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
			
			        const 总攻击力 = this.攻击力;
			        let 总有效伤害 = 0;
			        const 击中怪物列表 = new Set();
			        const 影响格子 = [];
			
			        // 定义四个斜向的方向向量
			        const 斜向列表 = [
			            { dx: -1, dy: -1 }, // 左上
			            { dx: 1, dy: -1 }, // 右上
			            { dx: -1, dy: 1 }, // 左下
			            { dx: 1, dy: 1 }, // 右下
			        ];
			
			        // 遍历每个斜向
			        斜向列表.forEach((方向) => {
			            // 每个方向延伸2格
			            for (let 距离 = 0; 距离 <= 2; 距离++) {
			                const 目标X = 使用者.x + 方向.dx * 距离;
			                const 目标Y = 使用者.y + 方向.dy * 距离;
			
			                const 上一步X = 使用者.x + 方向.dx * (距离 - 1);
			                const 上一步Y = 使用者.y + 方向.dy * (距离 - 1);
			
			                // 检查路径是否被阻挡
			                if (
			                    !检查移动可行性(上一步X, 上一步Y, 目标X, 目标Y)
			                ) {
			                    break; // 如果路径被墙壁阻挡，则停止在这个方向上继续延伸
			                }
			
			                if (
			                    目标X >= 0 &&
			                    目标X < 地牢大小 &&
			                    目标Y >= 0 &&
			                    目标Y < 地牢大小
			                ) {
			                    影响格子.push({ x: 目标X, y: 目标Y });
			                    const 单元格 = 地牢[目标Y]?.[目标X];
			
			                    if (
			                        单元格?.关联怪物 &&
			                        单元格.关联怪物.当前生命值 > 0 &&
			                        !击中怪物列表.has(单元格.关联怪物)
			                    ) {
			                        const 怪物 = 单元格.关联怪物;
			                        const 原始血量 = 怪物.当前生命值;
			                        怪物.受伤(总攻击力, "玩家");
			                        const 实际伤害 = 原始血量 - 怪物.当前生命值;
			
			                        if (实际伤害 > 0) {
			                            总有效伤害 += 实际伤害;
			                            击中怪物列表.add(怪物);
			                        }
			                    }
			                } else {
			                    break; // 超出边界，停止延伸
			                }
			            }
			        });
			
			        // 显示攻击特效
			        计划显示格子特效(影响格子, "C0C0C0"); // 银色刀光
			
			        // 处理武器消耗和冷却
			        this.自定义数据.set(
			            "耐久",
			            this.自定义数据.get("耐久") - this.耐久消耗
			        );
			        if (this.自定义数据.get("耐久") <= 0) {
			            处理销毁物品(this.唯一标识, true);
			            显示通知(`${this.名称} 已损坏！`, "警告");
			        }
			        this.自定义数据.set("冷却剩余", this.最终冷却回合);
			
			        if (击中怪物列表.size > 0) {
			            显示通知(
			                `${this.名称} 击中了 ${
			                    击中怪物列表.size
			                } 个目标，共造成 ${总有效伤害.toFixed(1)} 点伤害！`,
			                "成功"
			            );
			            const 所有击中怪物 = Array.from(击中怪物列表);
			            this.触发通用附魔(所有击中怪物);
			        } else {
			            显示通知(`${this.名称} 挥了个空！`, "信息");
			        }
			
			        更新装备显示();
			        return 总有效伤害;
			    }
			}
			class 神龛 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "神龛",
			            图标: 图标映射.神龛,
			            品质: 5,
			            颜色索引: 4,
			            能否拾起: false,
			            是否正常物品: false,
			            阻碍怪物: true,
			            效果描述: "一座散发着因果气息的古老神龛，许下你的愿望吧...",
			            数据: {
			                已许愿: false,
			            },
			            ...配置,
			        });
			    }
			
			    尝试互动() {
			        if (this.自定义数据.get("已许愿")) {
			            显示通知("神龛的回应已经结束，它陷入了沉寂。", "信息");
			            return false;
			        }
			        显示自定义确认对话框(
			            "你感觉到神龛正在呼唤你。你是否愿意献上你的一部分命运，来换取一个永久的祝福...或诅咒？",
			            () => this.执行许愿(神龛效果列表)
			        );
			
			        return true;
			    }
			
			    执行许愿(效果池) {
			        const 随机效果 = 效果池[Math.floor(prng() * 效果池.length)];
			        
			        随机效果.apply(); 
			        
			        
			        永久Buffs.已获得效果.add(随机效果.id);
			        应用永久Buffs();
			        this.自定义数据.set("已许愿", true);
			        
			        this.效果描述 = "神龛的力量已经与你的命运交织在了一起。";
			
			        const 提示类型 = 随机效果.类型 === '祝福' ? '成功' : '错误';
			        显示通知(`你的命运改变了！获得了${随机效果.类型}：【${随机效果.名称}】`, 提示类型, false, 4000);
			        添加日志(`【神龛】${随机效果.描述}`, 提示类型);
			        
			        绘制();
			    }
			
			    获取提示() {
			         if (this.自定义数据.get("已许愿")) {
			            return `${this.名称}\n${this.效果描述}`;
			        }
			        return `${this.名称}\n品质：${"★".repeat(this.品质)}\n${this.效果描述}`;
			    }
			}
			
			
			class 神秘商人 extends 物品 {
			    constructor(配置) {
			        super({
			            类型: "NPC",
			            名称: "神秘商人",
			            图标: 图标映射.神秘商人,
			            品质: 4,
			            颜色索引: 3,
			            能否拾起: false,
			            效果描述: "毫无卵用的奸商",
			            数据: {
			                库存: 配置.库存 || [],
			                商品层数: 配置.商品层数??当前层数??0,
			                刷新次数: 3, // 可交易次数
			            },
			        });
			        this.能否拾起 = false;
			        if (!配置.库存物品) {
			            this.生成库存(Math.max(this.自定义数据.get('商品层数'), 0));
			        }
			    }
			    使用() {
			        打开交易窗口(this);
			        return true;
			    }
			    生成库存(层数) {
			        this.自定义数据.set("库存", []);
			        const 品质权重 = [
			            { 品质: 1, 权重: 50 - 层数 * 5 },
			            { 品质: 2, 权重: 30 + 层数 * 3 },
			            { 品质: 3, 权重: 15 + 层数 * 2 },
			            { 品质: 4, 权重: 5 + 层数 * 1 },
			        ].filter((w) => w.权重 > 0);
			        let 已选中 = false;
			        let 尝试次数 = 0;
			        for (let i = 0; i < 3; i++) {
			            while (!已选中 && 尝试次数 < 100) {
			                let 选中品质 = 加权随机选择(品质权重);
			                if (选中品质) {
			                    const 候选物品 = Object.values(物品池)
			                        .flat()
			                        .filter((item) => {
			                            const 临时实例 = new item.类({
			                                库存物品: true,
			                            });
			                            return (
			                                item.品质 == 选中品质.品质 &&
			                                层数 >= item.最小层 &&
			                                临时实例.类型 !== "工具"
			                            );
			                        });
			
			                    if (候选物品.length > 0) {
			                        const 模板 =
			                            候选物品[
			                                Math.floor(
			                                    prng() * 候选物品.length
			                                )
			                            ];
			                        const 物品实例 = new 模板.类({
			                            数量: 1,
			                            强化:
			                                prng() <
			                                Math.min(0.85, 层数 * 0.15),
			                            已解锁: true,
			                            品质: 2 + Math.floor(prng() * 4),
			                        });
			                        if (
			                            !this.自定义数据
			                                .get("库存")
			                                .some(
			                                    (item) =>
			                                        item.名称 === 物品实例.名称
			                                ) &&
			                            物品实例.是否正常物品
			                        ) {
			                            this.自定义数据
			                                .get("库存")
			                                .push(物品实例);
			                            已选中 = true;
			                        }
			                    }
			                }
			                尝试次数++;
			            }
			            已选中 = false;
			            尝试次数 = 0;
			        }
			    }
			
			    获取价格(物品) {
			        const 基础价格 = 物品.品质 * 20 + (物品.强化 ? 20 : 0) + Math.floor(prng() * 15) - this.自定义数据.get('商品层数') * 2;
			        const 最终价格 = Math.floor(基础价格 * (玩家属性.商店价格倍率 || 1));
			        return Math.max(30, 最终价格);
			    }
			}
			class 探险家 extends 物品 {
			    constructor(配置) {
			        super({
			            类型: "NPC",
			            名称: "探险家",
			            图标: 图标映射.探险家,
			            品质: 3,
			            颜色索引: 3,
			            能否拾起: false,
			            是否正常物品: false, // 不直接出现在掉落池
			            效果描述:
			                "一位经验丰富的探险家，愿意用金币换取你的发现。",
			            数据: {
			                收购需求: [], // { 名称: "钢制长剑", 品质下限: 1, 强化需求: false, 数量: 1 }
			                需求层数: 配置.需求层数??当前层数??0,
			                交易次数: 5 + Math.floor(prng() * 6), // 随机交易次数
			            },
			        });
			        if (!配置.库存物品) {
			            this.生成收购需求(this.自定义数据.get('需求层数'));
			        }
			    }
			
			    生成收购需求(层数) {
			        this.自定义数据.set("收购需求", []);
			        const 需求数量 = 9 + Math.floor(prng() * 4);
			
			        const 可选物品池 = Object.values(物品池)
			            .flat()
			            // 排除非卖品
			            .filter((itemTmpl) => {
			                if (itemTmpl.类.name !== "探险家") {
			                    const tempInstance = new itemTmpl.类({
			                        库存物品: true,
			                    });
			                    return (
			                        tempInstance.是否正常物品 &&
			                        tempInstance.类型 !== "钥匙" &&
			                        tempInstance.类型 !== "金币" &&
			                        tempInstance.类型 !== "NPC" &&
			                        tempInstance.类型 !== "祭坛" &&
			                        tempInstance.类型 !== "工具" &&
			                        tempInstance.类型 !== "折跃门"
			                    );
			                }
			            });
			
			        if (可选物品池.length === 0) return;
			
			        const 已选名称 = new Set();
			
			        for (let i = 0; i < 需求数量; i++) {
			            let 尝试次数 = 0;
			            while (尝试次数 < 50) {
			                const 随机物品模板 =
			                    可选物品池[
			                        Math.floor(
			                            prng() * 可选物品池.length
			                        )
			                    ];
			                const 临时实例 = new 随机物品模板.类({});
			
			                if (已选名称.has(临时实例.名称)) {
			                    尝试次数++;
			                    continue;
			                }
			
			                const 强化需求 =
			                    随机物品模板.品质 >= 3 &&
			                    prng() < 0.3 + this.自定义数据.get('商品层数') * 0.05;
			
			                this.自定义数据.get("收购需求").push({
			                    名称: 临时实例.名称,
			                    强化需求: 强化需求,
			                    图标: 临时实例.图标,
			                    颜色索引: 临时实例.颜色索引,
			                    类名: 随机物品模板.类.name,
			                });
			                已选名称.add(临时实例.名称);
			                break;
			            }
			        }
			    }
			
			    计算收购价格(物品实例, 需求) {
			        let 基础价格 =
			            (物品实例.品质 * 20 + (需求.强化需求 ? 15 : 0)) * 0.8; // 比商人售价低一些
			
			        if (物品实例.强化 && (!需求.强化需求 || 需求.强化需求)) {
			            基础价格 += 10;
			        } else if (!物品实例.强化 && 需求.强化需求) {
			            return 0;
			        }
			
			        if (
			            物品实例.自定义数据?.has("耐久") &&
			            物品实例.自定义数据?.has("原耐久")
			        ) {
			            const 耐久比例 =
			                物品实例.自定义数据.get("耐久") /
			                物品实例.自定义数据.get("原耐久");
			            基础价格 *= 0.5 + 耐久比例 * 0.5;
			        }
			
			        if (物品实例.自定义数据?.has("附魔")) {
			            const 附魔数量 = (物品实例.自定义数据.get("附魔") || [])
			                .length;
			            const 附魔等级总和 = (
			                物品实例.自定义数据.get("附魔") || []
			            ).reduce((sum, e) => sum + e.等级, 0);
			            基础价格 += 附魔数量 * 2 + 附魔等级总和 * 1.5;
			        }
			
			        if (
			            物品实例 instanceof 卷轴类 &&
			            物品实例.自定义数据?.get("已解锁")
			        ) {
			            基础价格 *= 1.3;
			        }
			
			        if (
			            物品实例 instanceof 宠物 &&
			            物品实例.自定义数据?.has("等级")
			        ) {
			            基础价格 += 物品实例.自定义数据.get("等级") * 3;
			        }
			
			        return Math.max(
			            1,
			            Math.floor(基础价格 * (0.9 + prng() * 0.2))
			        ); // 90%-110% 浮动，最低1金币
			    }
			
			    使用() {
			        if (this.自定义数据.get("交易次数") <= 0) {
			            显示通知(
			                "我已经收够今天想要的东西了，下次再见！",
			                "信息"
			            );
			            return false;
			        }
			        打开收购窗口(this);
			        return true;
			    }
			}
			class 蛛网 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "陷阱",
			            名称: "蛛网",
			            图标: 图标映射.渔网陷阱,
			            品质: 1,
			            颜色索引: 5,
			            能否拾起: true,
			            是否正常物品: false,
			            阻碍怪物: false,
			            效果描述: "黏糊糊的蛛网，能缠住敌人。",
			            数据: {
			                倒计时: 15 + (配置.强化 ? 10 : 0),
			                爆炸时间: 15 + (配置.强化 ? 10 : 0),
			                牵制回合: 3 + (配置.强化 ? 1 : 0),
			            },
			            ...配置,
			        });
			        if (!所有计时器.some(t => t.唯一标识 === this.唯一标识)) {
			            所有计时器.push(this);
			        }
			    }
			    当被收集(进入者) {
			        const 目标 = 进入者 === "玩家" ? null : 进入者;
			        if (进入者 === "玩家") {
			             new 状态效果("牵制", "#FFFFFF", "🕸️", this.自定义数据.get("牵制回合"));
			        }
			        this.移除自身();
			        return false;
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
			            if (地牢[this.y]?.[this.x]?.类型 === 单元格类型.物品) {
			                地牢[this.y][this.x].类型 = null;
			            }
			        }
			        所有计时器 = 所有计时器.filter(item => item !== this);
			    }
			}
			class 渔网陷阱 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "陷阱",
			            名称: "渔网陷阱",
			            图标: 图标映射.渔网陷阱,
			            品质: 2,
			            颜色索引: 3,
			            能否拾起: false,
			            是否正常物品: false,
			            阻碍怪物: false,
			            效果描述: "黏糊糊的渔网，能缠住敌人。",
			            数据: {
			                倒计时: 999,
			                爆炸时间: 999,
			                牵制回合: 5,
			            },
			            ...配置,
			        });
			    }
			    当被收集(进入者) {
			        if (进入者 instanceof 怪物 && !(进入者 instanceof 幽灵怪物)) {
			            new 状态效果("牵制", "#FFFFFF", 图标映射.渔网陷阱, this.自定义数据.get("牵制回合"), null, null, 进入者);
			            添加日志(`${进入者.类型} 被渔网缠住了！`, "信息");
			            this.移除自身();
			        }
			        return false;
			    }
			    更新倒计时() {
			    }
			    移除自身() {
			        if (this.x !== null && this.y !== null && 地牢[this.y]?.[this.x]?.关联物品 === this) {
			            地牢[this.y][this.x].关联物品 = null;
			            if (地牢[this.y]?.[this.x]?.类型 === 单元格类型.物品) {
			                地牢[this.y][this.x].类型 = null;
			            }
			        }
			        所有计时器 = 所有计时器.filter(item => item !== this);
			    }
			}
			
			class 渔网 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "工具",
			            名称: "渔网",
			            图标: 图标映射.渔网,
			            品质: 2,
			            颜色索引: 3,
			            堆叠数量: 配置.数量 || 1,
			            最大堆叠数量: 16,
			            效果描述: "在脚下2x2的区域放置一张大网。",
			            ...配置,
			        });
			    }
			    使用() {
			        if (this.堆叠数量 <= 0) return false;
			        const 格子偏移 = [
			            { dx: 0, dy: 0 },
			            { dx: 1, dy: 0 },
			            { dx: 0, dy: 1 },
			            { dx: 1, dy: 1 },
			        ];
			        let 放置成功计数 = 0;
			        for (const 偏移 of 格子偏移) {
			            const 目标X = 玩家.x + 偏移.dx;
			            const 目标Y = 玩家.y + 偏移.dy;
			            if (位置是否可用(目标X, 目标Y, false)) {
			                const 网格陷阱实例 = new 渔网陷阱({});
			                if (放置物品到单元格(网格陷阱实例, 目标X, 目标Y)) {
			                    放置成功计数++;
			                }
			            }
			        }
			        if (放置成功计数 > 0) {
			            this.堆叠数量--;
			            if (this.堆叠数量 <= 0) {
			                处理销毁物品(this.唯一标识, true);
			            }
			            显示通知(`成功放置了 ${放置成功计数} 格渔网！`, "成功");
			            更新背包显示();
			            更新装备显示();
			            绘制();
			            return true;
			        } else {
			            显示通知("无法在此处放置渔网。", "错误");
			            return false;
			        }
			    }
			}
			
			class 充能魔杖 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "充能魔杖",
			            图标: 图标映射.充能魔杖,
			            品质: 4,
			            基础攻击力: 0,
			            冷却回合: 10,
			            攻击范围: 1,
			            耐久: 配置?.耐久 || 30,
			            强化: 配置?.强化 || false,
			            效果描述: "消耗大量能量释放强大的魔法。",
			            数据: {
			                能量消耗: 80 - (配置.强化 ? 20 : 0),
			            },
			            ...配置,
			        });
			    }
			    使用(目标怪物列表,目标路径,使用者=玩家) {
			        if (使用者 instanceof 宠物) return;
			        if (this.自定义数据.get("冷却剩余") > 0) {
			            显示通知("魔杖还在充能！", "警告");
			            return false;
			        }
			        if (!扣除能量(this.自定义数据.get("能量消耗"))) {
			            显示通知("能量不足！", "错误");
			            return false;
			        }
			        if (当前层数 % 5 === 0 && 当前层数>0) {
			            显示通知('当前地牢无法使用充能魔杖','错误');
			            return false;
			        }
			        const 效果池 = ["不伤玩家爆炸", "召唤植物", "大同", "分散"];
			        const 选中效果 = 效果池[Math.floor(prng() * 效果池.length)];
			        switch (选中效果) {
			            case "不伤玩家爆炸":
			                this.执行爆炸();
			                break;
			            case "召唤植物":
			                this.召唤植物();
			                break;
			            case "大同":
			                this.大同();
			                break;
			            case "分散":
			                this.分散();
			                break;
			        }
			        this.自定义数据.set("耐久", this.自定义数据.get("耐久") - 1);
			        if (this.自定义数据.get("耐久") <= 0) {
			            处理销毁物品(this.唯一标识, true);
			        }
			        this.自定义数据.set("冷却剩余", this.最终冷却回合);
			        更新装备显示();
			        return true;
			    }
			    执行爆炸() {
			        const 爆炸范围 = 4;
			        const 爆炸坐标 = [];
			        for (let dy = -爆炸范围; dy <= 爆炸范围; dy++) {
			            for (let dx = -爆炸范围; dx <= 爆炸范围; dx++) {
			                if (Math.sqrt(dx*dx + dy*dy) <= 爆炸范围) {
			                    爆炸坐标.push({x: 玩家.x + dx, y: 玩家.y + dy});
			                }
			            }
			        }
			        计划显示格子特效(爆炸坐标, "8A2BE2", 20);
			        爆炸坐标.forEach(({x, y}) => {
			            if (x >= 0 && x < 地牢大小 && y >= 0 && y < 地牢大小) {
			                const 单元格 = 地牢[y]?.[x];
			                if (单元格?.关联怪物) {
			                    单元格.关联怪物.受伤(25, this.名称);
			                    let 怪物 = 单元格.关联怪物;
			                    if (!怪物) return;
			                    if (怪物.当前生命值 > 0) {
			                        const dx = x - 玩家.x;
			                        const dy = y - 玩家.y;
			                        let dirX = 0;
			                        let dirY = 0;
			
			                        if (Math.abs(dx) > Math.abs(dy)) {
			                            dirX = Math.sign(dx);
			                        } else if (Math.abs(dy) > Math.abs(dx)) {
			                            dirY = Math.sign(dy);
			                        } else if (dx !== 0) {
			                            dirX = Math.sign(dx);
			                        } else if (dy !== 0) {
			                            dirY = Math.sign(dy);
			                        }
			
			                        if (dirX !== 0 || dirY !== 0) {
			                            const { x: 最终X, y: 最终Y } = 怪物.计算最大甩飞位置(x, y, dirX, dirY, 1);
			                            if(最终X !== x || 最终Y !== y) {
			                                const oldX = 怪物.x;
			                                const oldY = 怪物.y;
			                                怪物.恢复背景类型();
			                                怪物.x = 最终X;
			                                怪物.y = 最终Y;
			                                怪物.保存新位置类型(最终X, 最终Y);
			                                地牢[最终Y][最终X].类型 = 单元格类型.怪物;
			                                地牢[最终Y][最终X].关联怪物 = 怪物;
			                                怪物.处理地形效果();
			                                怪物动画状态.set(怪物, {
			                                    旧逻辑X: oldX,
			                                    旧逻辑Y: oldY,
			                                    目标逻辑X: 最终X,
			                                    目标逻辑Y: 最终Y,
			                                    视觉X: oldX,
			                                    视觉Y: oldY,
			                                    动画开始时间: Date.now(),
			                                    正在动画: true,
			                                });
			                            }
			                        }
			                    }
			                }
			            }
			        });
			        显示通知("魔杖释放了一股强大的能量波！", "成功");
			    }
			    召唤植物() {
			        const 召唤数量 = 5 + (this.强化 ? 2 : 0);
			        let 已召唤 = 0;
			        const 方向 = [[0,-2],[2,0],[0,2],[-2,0],[-1,-1],[1,-1],[1,1],[-1,1]];
			        方向.sort(() => prng() - 0.5);
			        for(const [dx, dy] of 方向) {
			            if (已召唤 >= 召唤数量) break;
			            const 目标X = 玩家.x + dx;
			            const 目标Y = 玩家.y + dy;
			            if (位置是否可用(目标X, 目标Y, false)) {
			                const 新植物 = new 魔力远射植物({强化: this.强化});
			                if(放置物品到单元格(新植物, 目标X, 目标Y)) {
			                    所有计时器.push(新植物);
			                    已召唤++;
			                }
			            }
			        }
			        显示通知(`魔杖召唤了 ${已召唤} 株魔力植物！`, "成功");
			    }
			    大同() {
			        const 范围 = 5;
			        let 影响数量 = 0;
			        for(let dy = -范围; dy <= 范围; dy++) {
			            for(let dx = -范围; dx <= 范围; dx++) {
			                const x = 玩家.x + dx;
			                const y = 玩家.y + dy;
			                if(x<0 || x>=地牢大小 || y<0 || y>=地牢大小) continue;
			                const 单元格 = 地牢[y]?.[x];
			                if(单元格?.关联怪物 && 单元格.关联怪物.类型 !== '怪物') {
			                    const 旧怪物 = 单元格.关联怪物;
			                    const 新怪物 = new 怪物({
			                        x: x, y: y, 房间ID: 旧怪物.房间ID, 状态: 怪物状态.活跃,
			                        当前生命值: Math.min(旧怪物.当前生命值, 23),
			                        基础生命值: 23,
			                    });
			                    旧怪物.恢复背景类型();
			                    所有怪物 = 所有怪物.filter(m => m !== 旧怪物);
			                    怪物状态表.delete(旧怪物);
			                    放置怪物到单元格(新怪物, x, y);
			                    影响数量++;
			                }
			            }
			        }
			        if (影响数量 > 0) {
			            计划显示格子特效([{x: 玩家.x, y: 玩家.y}], "FFFFFF");
			            显示通知(`大同之光净化了 ${影响数量} 只怪物！`, "成功");
			        } else {
			             显示通知("什么都没发生...", "信息");
			        }
			    }
			    分散() {
			         const 范围 = 8;
			         const 待分散怪物 = [];
			         for(let dy = -范围; dy <= 范围; dy++) {
			            for(let dx = -范围; dx <= 范围; dx++) {
			                const x = 玩家.x + dx;
			                const y = 玩家.y + dy;
			                if(x<0 || x>=地牢大小 || y<0 || y>=地牢大小) continue;
			                const 单元格 = 地牢[y]?.[x];
			                if(单元格?.关联怪物) {
			                    待分散怪物.push(单元格.关联怪物);
			                }
			            }
			         }
			         if(待分散怪物.length === 0) {
			            显示通知("附近没有怪物可以分散。", "信息");
			            return;
			         }
			
			         待分散怪物.forEach(怪物 => {
			            let 新X, 新Y, 尝试次数 = 0;
			            do {
			                新X = Math.floor(prng() * 地牢大小);
			                新Y = Math.floor(prng() * 地牢大小);
			                尝试次数++;
			            } while ((!位置是否可用(新X, 新Y, false) || (Math.abs(新X - 玩家.x) + Math.abs(新Y - 玩家.y) < 15)) && 尝试次数 < 200);
			
			            if (尝试次数 < 200) {
			                怪物.恢复背景类型();
			                怪物.x = 新X;
			                怪物.y = 新Y;
			                怪物.保存新位置类型(新X, 新Y);
			                地牢[新Y][新X].类型 = 单元格类型.怪物;
			                地牢[新Y][新X].关联怪物 = 怪物;
			            }
			         });
			         显示通知(`强大的能量将 ${待分散怪物.length} 只怪物传送到了未知的地方！`, "成功");
			         绘制();
			    }
			}
			
			class 魔力远射植物 extends 远射植物 {
			    constructor(配置 = {}) {
			        super({
			            名称: "魔力远射植物",
			            能否拾起: false,
			            
			            ...配置,
			        });
			        this.自定义数据.set('倒计时',25 + (配置.强化 ? 10 : 0))
			        this.自定义数据.set('攻击力',7 + (配置.强化 ? 7 : 0))
			    }
			    尝试互动() {
			        return false;
			    }
			    更新倒计时() {
			        if(this.自定义数据.get("耐久") <= 0) {
			            this.移除自身();
			            
			            return;
			        }
			        super.更新倒计时();
			        let 倒计时 = this.自定义数据.get("倒计时");
			        if(倒计时 > 0) {
			            this.自定义数据.set("倒计时", 倒计时 - 1);
			        } else {
			            this.移除自身();
			            
			        }
			    }
			}
			
			class 时间卷轴 extends 卷轴类 {
			    constructor(配置) {
			        super({
			            名称: "时间卷轴",
			            图标: 图标映射.时间卷轴,
			            品质: 4,
			            效果描述: "激活后，装备冷却和宠物恢复速度加快。持续消耗能量。",
			            能量消耗: 4,
			            强化: 配置.强化 || false,
			            已解锁: 配置.已解锁 || false,
			        });
			    }
			    使用() {
			        return true;
			    }
			    卸下() {
			        return true;
			    }
			}
			
			class 潜行靴子 extends 防御装备类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "潜行靴子",
			            图标: 图标映射.潜行靴子,
			            品质: 3,
			            防御力: 1,
			            效果描述: "装备后，只有在敌人视线内才会被追踪。",
			            耐久: 配置.耐久 || 120,
			            强化: 配置.强化 || false,
			        });
			    }
			}
			
			class 钩索 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            类型: "工具",
			            名称: "钩索",
			            图标: 图标映射.钩索,
			            品质: 3,
			            基础攻击力: 0,
			            最大堆叠数量: 1,
			            效果描述: "向你上次移动的方向发射钩索，将你拉向墙壁。",
			            强化: 配置?.强化 || false,
			            攻击范围: 0,
			            攻击目标数: 0,
			            数据: {
			                冷却回合: 5 - (配置.强化 ? 2 : 0),
			                攻击范围: 30 + (配置.强化 ? 20 : 0),
			                耐久: 50 + (配置.强化 ? 25 : 0),
			                原耐久: 50 + (配置.强化 ? 25 : 0),
			                冷却剩余: 0,
			            },
			            ...配置,
			        });
			    }
			    使用() {
			        if (玩家正在钩索) {
			            显示通知("正在使用钩索！", "警告");
			            return false;
			        }
			        if (this.自定义数据.get("冷却剩余") > 0) {
			            显示通知("钩索还未准备好！", "错误");
			            return false;
			        }
			        const 上次方向 = 移动历史[移动历史.length - 1];
			        if (!上次方向) {
			            显示通知("没有移动方向！", "错误");
			            return false;
			        }
			        let dx = 0, dy = 0;
			        if (上次方向 === "上") dy = -1;
			        else if (上次方向 === "下") dy = 1;
			        else if (上次方向 === "左") dx = -1;
			        else if (上次方向 === "右") dx = 1;
			        let 钩中点 = null;
			        for (let i = 1; i <= this.最终攻击范围; i++) {
			            const 检查X = 玩家.x + dx * i;
			            const 检查Y = 玩家.y + dy * i;
			            if (检查X < 0 || 检查X >= 地牢大小 || 检查Y < 0 || 检查Y >= 地牢大小) break;
			            const 单元格 = 地牢[检查Y]?.[检查X];
			            if (!单元格) break;
			            const 前一单元格 = 地牢[玩家.y + dy * (i-1)]?.[玩家.x + dx * (i-1)];
			            if(前一单元格 && !检查移动可行性(玩家.x, 玩家.y, 检查X, 检查Y, true)) {
			               钩中点 = { x: 玩家.x + dx * (i-1), y: 玩家.y + dy * (i-1) };
			               break;
			            }
			            const 目标房间ID = 房间地图[检查Y]?.[检查X];
			            const 目标房间已访问 = 目标房间ID === -1 || 已访问房间.has(目标房间ID);
			            if ([单元格类型.墙壁, 单元格类型.上锁的门].includes(单元格.背景类型) || (前一单元格.背景类型 === 单元格类型.门 && !目标房间已访问)) {
			                钩中点 = { x: 玩家.x + dx * (i-1), y: 玩家.y + dy * (i-1) };
			                break;
			            }
			        }
			        if (钩中点) {
			            
			            const 路径 = 广度优先搜索路径(玩家.x, 玩家.y, 钩中点.x, 钩中点.y, this.最终攻击范围, true);
			            if (路径.length > 1) {
			                this.自定义数据.set("冷却剩余", this.最终冷却回合);
			            this.自定义数据.set("耐久", this.自定义数据.get("耐久") - 1);
			            if(this.自定义数据.get("耐久") <= 0) 处理销毁物品(this.唯一标识, true);
			            更新装备显示();
			                this.开始高速移动(路径.slice(1));
			                return true;
			            }
			        }
			        显示通知("钩索没有勾住任何东西！", "错误");
			        return false;
			    }
			    开始高速移动(路径) {
			        玩家正在钩索 = true;
			        计划显示格子特效(路径, "778899", 5);
			        const 移动逻辑 = () => {
			            if (!玩家正在钩索 || 路径.length === 0) {
			                玩家正在钩索 = false;
			                clearTimeout(钩索移动定时器);
			                return;
			            }
			            const 步数 = Math.min(5, 路径.length);
			            const 目标节点 = 路径[步数 - 1];
			            if (检查移动可行性(玩家.x, 玩家.y, 目标节点.x, 目标节点.y)) {
			                const 旧X = 玩家.x;
			                const 旧Y = 玩家.y;
			                玩家.x = 目标节点.x;
			                玩家.y = 目标节点.y;
			                路径.splice(0, 步数);
			                const 触发中断 = 处理玩家着陆效果(旧X, 旧Y, 玩家.x, 玩家.y);
			                更新视口();
			                绘制();
			                if(触发中断) {
			                     玩家正在钩索 = false;
			                     clearTimeout(钩索移动定时器);
			                     return;
			                }
			            } else {
			                玩家正在钩索 = false;
			                clearTimeout(钩索移动定时器);
			                return;
			            }
			            钩索移动定时器 = setTimeout(移动逻辑, 80);
			        };
			        移动逻辑();
			    }
			    get 最终攻击范围() {
			        return this.自定义数据.get("攻击范围");
			    }
			}
			
			class 嗜血战斧 extends 武器类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "嗜血战斧",
			            图标: 图标映射.嗜血战斧,
			            品质: 4,
			            基础攻击力: 12 + (配置.强化 ? 8 : 0),
			            冷却回合: 4,
			            攻击范围: 2,
			            耐久: 配置?.耐久 || 80,
			            强化: 配置?.强化 || false,
			            效果描述: "一把沉重而锋利的战斧，可以劈开坚固的护甲。",
			            ...配置,
			        });
			    }
			}
			class 祭坛类 extends 物品 {
			    constructor(配置) {
			        super({
			            类型: "祭坛",
			            图标: 图标映射.祭坛,
			            是否正常物品: false,
			            品质: 4,
			            颜色索引: 3,
			            能否拾起: false,
			            数据: {
			                已激活: 配置?.数据?.已激活 || false,
			                激活条件: 配置?.数据?.激活条件 || null,
			                ...配置.数据,
			            },
			            ...配置,
			        });
			
			        if (!this.自定义数据.get("激活条件")) {
			            const 条件列表 = [
			                { 类型: "献祭生命", 权重: 25 },
			                { 类型: "火焰净化", 权重: 15 },
			                {
			                    类型: "力量考验",
			                    权重: 20,
			                    需求伤害: 50 + Math.floor(prng() * 21),
			                },
			                { 类型: "爆炸冲击", 权重: 15 },
			                { 类型: "物品献祭", 权重: 15 },
			                {
			                    类型: "能量灌注",
			                    权重: 10,
			                    能量消耗: 80 + Math.floor(prng() * 21),
			                },
			                { 类型: "冰霜封印", 权重: 10 },
			            ];
			            const 选中的条件 = 加权随机选择(条件列表);
			            this.自定义数据.set("激活条件", 选中的条件.类型);
			            if (选中的条件.需求伤害) {
			                this.自定义数据.set(
			                    "需求伤害",
			                    选中的条件.需求伤害
			                );
			                this.自定义数据.set("当前承受伤害", 0);
			            }
			            if (选中的条件.能量消耗) {
			                this.自定义数据.set(
			                    "能量消耗",
			                    选中的条件.能量消耗
			                );
			            }
			        }
			    }
			
			    尝试互动() {
			        if (this.自定义数据.get("已激活")) {
			            显示通知("这个祭坛的力量已经耗尽。", "信息");
			
			            return false;
			        }
			
			        const 条件 = this.自定义数据.get("激活条件");
			        let 提示信息 = `一个古老的祭坛，上面刻着奇怪的符号：`;
			
			        switch (条件) {
			            case "献祭生命":
			                提示信息 += `\n“以汝之血，换汝新生。”<br>提示：需要献祭大量生命`;
			                if (confirm(提示信息.replace(/<br>/g, "\n"))) {
			                    this.激活();
			                }
			                break;
			            case "火焰净化":
			                提示信息 += `\n“烈焰红火，洗褪尘埃。”<br>提示：需要用火焰灼烧`;
			                显示通知(提示信息, "信息", true, 3000);
			                break;
			            case "冰霜封印":
			                提示信息 += `\n“寒冰凝结，封印之力。”<br>提示：需要用冰霜武器冲击`;
			                显示通知(提示信息, "信息", true, 3000);
			                break;
			            case "力量考验":
			                const 需求伤害 = this.自定义数据.get("需求伤害");
			                const 当前伤害 =
			                    this.自定义数据.get("当前承受伤害") || 0;
			                提示信息 += `\n“力量击破障碍，火力带来胜利。”<br>提示：需要对祭坛造成足够伤害 (${当前伤害}/${需求伤害})。`;
			                显示通知(提示信息, "信息", true, 3000);
			                break;
			            case "爆炸冲击":
			                提示信息 += `\n“破碎带来重组，毁灭孕育机遇。”<br>提示：需要用剧烈的爆炸冲击`;
			                显示通知(提示信息, "信息", true, 3000);
			                break;
			            case "物品献祭":
			                提示信息 += `\n“等价交换，世间真理。”<br>提示：需要扣除背包中的物品`;
			                if (confirm(提示信息.replace(/<br>/g, "\n"))) {
			                    this.激活();
			                }
			                break;
			            case "能量灌注":
			                const 能量消耗 = this.自定义数据.get("能量消耗");
			                提示信息 += `\n“以意志之能量，闯浩瀚之云天。”<br>提示：需要灌注 ${能量消耗} 点能量`;
			                if (confirm(提示信息.replace(/<br>/g, "\n"))) {
			                    this.激活();
			                }
			                break;
			            default:
			                显示通知(提示信息, "信息", true, 3000);
			        }
			        return false;
			    }
			
			    当被攻击(伤害, 来源) {
			        if (this.自定义数据.get("已激活")) return;
			        const 条件 = this.自定义数据.get("激活条件");
			
			        if (条件 === "力量考验") {
			            let 当前伤害 = this.自定义数据.get("当前承受伤害") || 0;
			            当前伤害 += 伤害;
			            this.自定义数据.set("当前承受伤害", 当前伤害);
			
			            计划显示格子特效(
			                [{ x: this.x, y: this.y }],
			                "FFD700",
			                50
			            );
			
			            const 需求伤害 = this.自定义数据.get("需求伤害");
			            if (当前伤害 >= 需求伤害) {
			                this.激活();
			            } else {
			                显示通知(
			                    `祭坛吸收了你的力量... (${Math.floor(
			                        当前伤害
			                    )}/${需求伤害})`,
			                    "信息"
			                );
			            }
			        }
			    }
			
			    激活() {
			        if (this.自定义数据.get("已激活")) return false;
			
			        const 条件 = this.自定义数据.get("激活条件");
			        switch (条件) {
			            case "献祭生命":
			                const 当前生命 =
			                    parseFloat(
			                        document.querySelector(".health-bar").style
			                            .width
			                    ) || 0;
			                if (当前生命 > 75) {
			                    伤害玩家(75, this.名称);
			                } else {
			                    显示通知("血量不足，无法献祭！", "错误");
			                    return false;
			                }
			                break;
			            case "物品献祭":
			                const 可献祭物品 = [...玩家背包.values()].filter(
			                    (item) =>
			                        item.是否正常物品 &&
			                        !item.是否隐藏 &&
			                        item.类型 !== "钥匙" &&
			                        item.类型 !== "金币"
			                );
			                if (可献祭物品.length === 0) {
			                    显示通知("背包中没有可献祭的物品！", "错误");
			                    return false;
			                }
			                const 随机物品 =
			                    可献祭物品[
			                        Math.floor(
			                            prng() * 可献祭物品.length
			                        )
			                    ];
			                显示通知(
			                    `你献祭了 ${随机物品.获取名称()}...`,
			                    "信息"
			                );
			                处理销毁物品(随机物品.唯一标识, true);
			                break;
			            case "能量灌注":
			                if (!扣除能量(this.自定义数据.get("能量消耗"))) {
			                    显示通知("能量不足，无法激活祭坛！", "错误");
			                    return false;
			                }
			                break;
			        }
			
			        this.自定义数据.set("已激活", true);
			        this.图标 = "◎";
			        this.颜色索引 = 颜色表.length;
			        this.效果描述 = "祭坛的力量已经耗尽。";
			        计划显示格子特效([{ x: this.x, y: this.y }], "00FF00", 0);
			        显示通知(`${this.名称}被激活了！`, "成功");
			
			        this.给予奖励();
			
			        return true;
			    }
			
			    给予奖励() {}
			
			    获取提示() {
			        if (this.自定义数据.get("已激活")) {
			            return `${this.名称}\n力量已经耗尽。`;
			        }
			        const 条件 = this.自定义数据.get("激活条件");
			        let 提示 = `${this.名称}\n一个散发着微光的古老祭坛。\n激活条件：`;
			        switch (条件) {
			            case "献祭生命":
			                提示 += "献祭生命";
			                break;
			            case "火焰净化":
			                提示 += "火焰净化";
			                break;
			            case "冰霜封印":
			                提示 += "冰霜封印";
			                break;
			            case "力量考验":
			                提示 += `力量考验 (${
			                    this.自定义数据.get("当前承受伤害") || 0
			                }/${this.自定义数据.get("需求伤害")})`;
			                break;
			            case "爆炸冲击":
			                提示 += "爆炸冲击";
			                break;
			            case "物品献祭":
			                提示 += "物品献祭";
			                break;
			            case "能量灌注":
			                提示 += `能量灌注 (${this.自定义数据.get(
			                    "能量消耗"
			                )})`;
			                break;
			            default:
			                提示 += "未知";
			        }
			        return 提示;
			    }
			}
			class 物品祭坛 extends 祭坛类 {
			    constructor(配置) {
			        super({
			            名称: "物品祭坛",
			            效果描述: "激活后获得一件强大的物品！",
			            数据: {
			                库存: 配置?.数据?.库存 || [],
			                ...配置.数据,
			            },
			        });
			
			        if (
			            !this.自定义数据.get("已激活") &&
			            this.自定义数据.get("库存").length === 0
			        ) {
			            let 已选中 = false;
			            let 尝试次数 = 0;
			            if (!配置.库存物品) {
			                while (!已选中 && 尝试次数 < 100) {
			                    已选中 = this.生成库存();
			                    尝试次数++;
			                }
			            }
			        }
			    }
			
			    给予奖励() {
			        const 库存 = this.自定义数据.get("库存");
			        if (库存.length > 0) {
			            const 奖励物品 = 库存.shift();
			            if (尝试收集物品(奖励物品, false)) {
			                显示通知("你从祭坛获得了奖励！", "成功");
			            } else {
			                this.自定义数据.get("库存").unshift(奖励物品);
			                显示通知("背包已满，奖励无法领取！", "错误");
			            }
			        } else {
			            显示通知("祭坛中空空如也...", "信息");
			        }
			    }
			
			    生成库存() {
			        this.自定义数据.set("库存", []);
			        const 候选物品 = Object.values(物品池)
			            .flat()
			            .filter((itemCfg) => {
			                const 临时实例 = new itemCfg.类({ 库存物品: true });
			                return 临时实例.类型 !== "工具";
			            });
			        if (候选物品.length === 0) return false;
			        const 物品实例 = new 候选物品[
			            Math.floor(prng() * 候选物品.length)
			        ].类({ 强化: true, 已解锁: true });
			        if (
			            物品实例.是否正常物品 &&
			            !(物品实例 instanceof 神秘商人) &&
			            物品实例.类型 !== "工具"
			        ) {
			            this.自定义数据.get("库存").push(物品实例);
			            return true;
			        }
			        return false;
			    }
			}
			
			class 耐久祭坛 extends 祭坛类 {
			    constructor(配置) {
			        super({
			            名称: "耐久祭坛",
			            效果描述: "激活后修复所有已装备物品的耐久。",
			            ...配置,
			        });
			    }
			
			    给予奖励() {
			        let 修复发生 = false;
			        Array.from({ length: 装备栏每页装备数 }, (_, i) =>
			            玩家装备.get(当前装备页 * 装备栏每页装备数 + i + 1)
			        )
			            .filter((v) => v != null)
			            .forEach((装备) => {
			                if (装备.自定义数据.get("原耐久")) {
			                    装备.自定义数据.set(
			                        "耐久",
			                        装备.自定义数据.get("原耐久")
			                    );
			                    修复发生 = true;
			                }
			            });
			
			        if (修复发生) {
			            显示通知("所有装备的耐久都已完全恢复！", "成功");
			            更新装备显示();
			        } else {
			            显示通知("你没有需要修复的装备。", "信息");
			        }
			    }
			}
			
			class 背包扩容祭坛 extends 祭坛类 {
			    constructor(配置) {
			        super({
			            名称: "背包扩容祭坛",
			            效果描述: "激活后永久扩展你的背包容量！",
			            数据: {
			                扩容量: 2,
			                最大扩展至: 24,
			                ...配置.数据,
			            },
			        });
			    }
			
			    给予奖励() {
			        if (最大背包容量 >= this.自定义数据.get("最大扩展至")) {
			            显示通知("你的背包已经足够大了，无法再扩展。", "信息");
			            return;
			        }
			        最大背包容量 = Math.min(
			            this.自定义数据.get("最大扩展至"),
			            最大背包容量 + this.自定义数据.get("扩容量")
			        );
			        document.getElementById("最大容量").textContent =
			            最大背包容量;
			        更新背包显示();
			        显示通知(`背包容量已扩展至 ${最大背包容量}！`, "成功");
			    }
			}
			class 灵能盾牌 extends 防御装备类 {
			    constructor(配置 = {}) {
			        super({
			            名称: "灵能盾牌",
			            图标: 图标映射.灵能盾牌,
			            品质: 3,
			            颜色索引: 4,
			            防御力: 1 + (配置.强化 ? 1 : 0),
			            耐久: 配置.耐久 || 80 + (配置.强化 ? 40 : 0),
			            原耐久: 配置.原耐久 || 80 + (配置.强化 ? 40 : 0),
			            强化: 配置.强化 || false,
			            效果描述: "受击时概率恢复能量或闪避攻击。",
			            不可破坏: 配置.不可破坏 || false,
			            附魔: 配置.附魔 || [],
			            数据: {
			                能量恢复概率: 0.25 + (配置.强化 ? 0.1 : 0),
			                能量恢复量: 10 + (配置.强化 ? 5 : 0),
			                闪避触发概率: 0.15 + (配置.强化 ? 0.1 : 0),
			            },
			            ...配置,
			        });
			    }
			
			    当被攻击(原始攻击力, 来源 = null) {
			        let 剩余伤害 = super.当被攻击(原始攻击力, 来源);
			        if (prng() < this.自定义数据.get("能量恢复概率")) {
			            const 恢复量 = this.自定义数据.get("能量恢复量");
			            const 能量条 = document.querySelector(".power-bar");
			            const 当前能量 = parseFloat(能量条.style.width) || 0;
			            能量条.style.width = `${Math.min(
			                100,
			                当前能量 + 恢复量/自定义全局设置.初始能量值*100
			            )}%`;
			            触发HUD显示();
			        }
			
			        if (prng() < this.自定义数据.get("闪避触发概率")) {
			            显示通知("灵能盾牌闪避！", "成功");
			            添加日志(
			                `成功闪避了来自 ${
			                    来源 instanceof 怪物
			                        ? 来源.类型
			                        : 来源 || "未知来源"
			                } 的攻击！`,
			                "成功"
			            );
			            触发HUD显示();
			            return 0;
			        }
			        return 剩余伤害;
			    }
			
			    获取提示() {
			        let lines = super.获取提示().split("\n");
			        const effectDescIndex = lines.findIndex((line) =>
			            line.startsWith("效果描述：")
			        );
			        if (effectDescIndex !== -1) {
			            lines.splice(effectDescIndex, 1); // Remove the generic description
			        }
			
			        const 能量概率 = (
			            this.自定义数据.get("能量恢复概率") * 100
			        ).toFixed(0);
			        const 能量恢复 = this.自定义数据.get("能量恢复量");
			        const 闪避概率 = (
			            this.自定义数据.get("闪避触发概率") * 100
			        ).toFixed(0);
			
			        const specificEffectLines = [
			            `--- 特殊效果 ---`,
			            `能量恢复：${能量概率}%几率恢复 ${能量恢复} 点`,
			            `灵体闪避：${闪避概率}%几率完全闪避攻击`,
			        ];
			
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
			        lines.splice(insertIndex, 0, ...specificEffectLines);
			
			        return lines.filter(Boolean).join("\n");
			    }
			}
			class 毒液物品 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "地形",
			            名称: "毒液",
			            图标: 图标映射.毒液,
			            品质: 1,
			            颜色索引: 效果名称编号映射.中毒,
			            最大堆叠数量: 1,
			            能否拾起: true,
			            阻碍怪物: false,
			            是否正常物品: false,
			            是否为隐藏物品: false,
			            效果描述: "一滩剧毒的液体，接触会中毒。",
			            数据: {
			                倒计时: 配置.倒计时 || 5 + (配置.强化 ? 3 : 0),
			                爆炸时间: 5 + (配置.强化 ? 3 : 0),
			                中毒强度: 1 + (配置.强化 ? 2 : 0),
			                中毒持续: 4,
			                ...配置.数据,
			            },
			            ...配置,
			        });
			        if (!所有计时器.some((t) => t.唯一标识 === this.唯一标识)) {
			        
			        if (游戏状态 === '地图编辑器') {
			        if(配置?.玩家放置) this.玩家放置=配置?.玩家放置
			            return;
			                
			            }
			            所有计时器.push(this);
			        }
			    }
			
			    使用() {
			        return false;
			    }
			
			    当被收集(进入者) {
			        if (进入者 !== "玩家") return false;
			        if (this.x!==玩家.x||this.y!==玩家.y) return false;
			        new 状态效果(
			            "中毒",
			            this.获取毒液颜色(),
			            "☠️",
			            this.自定义数据.get("中毒持续"),
			            null,
			            null,
			            null,
			            this.自定义数据.get("中毒强度")
			        );
			        添加日志("你踩到了毒液，中毒了！", "错误");
			        this.移除自身();
			        return false;
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
			            if (地牢[this.y]?.[this.x]?.类型 === 单元格类型.物品)
			                地牢[this.y][this.x].类型 = null;
			        }
			        所有计时器 = 所有计时器.filter((item) => item !== this);
			        绘制();
			    }
			
			    获取提示() {
			        return `【毒液】\n剩余: ${this.自定义数据.get(
			            "倒计时"
			        )}回合\n接触会中毒(${this.自定义数据.get(
			            "中毒强度"
			        )}伤害/回合)`;
			    }
			
			    获取毒液颜色() {
			        return 效果颜色编号映射[this.颜色索引] || "#008000";
			    }
			
			    get 颜色表() {
			        return 效果颜色编号映射;
			    }
			}
			class 饰品 extends 物品 {
			    constructor(配置 = {}) {
			        super({
			            类型: "饰品",
			            最大堆叠数量: 1,
			            图标: 图标映射.饰品,
			            ...配置,
			        });
			    }
			    使用() {
			        return false;
			    }
			}
			
			class 陷阱先锋饰品 extends 饰品 {
			    constructor(配置 = {}) {
			        super({
			            名称: "陷阱先锋",
			            图标: 图标映射.陷阱先锋,
			            品质: 3,
			            颜色索引: 1,
			            效果描述: "装备后，宠物可以主动揭晓周围2格范围内的陷阱。",
			            ...配置,
			        });
			    }
			}
			
			class 飞毛腿饰品 extends 饰品 {
			    constructor(配置 = {}) {
			        super({
			            名称: "飞毛腿",
			            图标: 图标映射.飞毛腿,
			            品质: 2,
			            颜色索引: 2,
			            效果描述: "装备后，宠物移动步数+1。",
			            ...配置,
			        });
			    }
			}
			
			class 瞬间移动饰品 extends 饰品 {
			     constructor(配置 = {}) {
			        super({
			            名称: "瞬间移动",
			            图标: 图标映射.瞬间移动,
			            品质: 5,
			            颜色索引: 4,
			            效果描述: "当宠物距离你过远、无法正常寻路或切换楼层时，它会瞬间移动到你的身边。",
			            ...配置,
			        });
			    }
			}
			
			class 博士之卷饰品 extends 饰品 {
			     constructor(配置 = {}) {
			        super({
			            名称: "博士之卷",
			            图标: 图标映射.博士之卷,
			            品质: 3,
			            颜色索引: 2,
			            效果描述: "装备后，宠物击败怪物获得的经验翻倍。",
			            ...配置,
			        });
			    }
			}
			
			class 恢复之心饰品 extends 饰品 {
			     constructor(配置 = {}) {
			        super({
			            名称: "恢复之心",
			            图标: 图标映射.恢复之心,
			            品质: 2,
			            颜色索引: 0,
			            效果描述: "装备后，宠物在休眠状态下的生命恢复速度加快。",
			            ...配置,
			        });
			    }
			}
			
			class 以牙还牙饰品 extends 饰品 {
			     constructor(配置 = {}) {
			        super({
			            名称: "以牙还牙",
			            图标: 图标映射.以牙还牙,
			            品质: 4,
			            颜色索引: 4,
			            效果描述: "当宠物被非首领怪物击倒进入休眠时，会对该怪物造成一次强力反击伤害。",
			            ...配置,
			        });
			    }
			}
			class 嗅探之鼻饰品 extends 饰品 {
			    constructor(配置 = {}) {
			        super({
			            名称: "嗅探之鼻",
			            图标: 图标映射.嗅探之鼻,
			            品质: 3,
			            颜色索引: 2,
			            效果描述: "装备后，宠物在生命值低下时会主动寻找并“吃掉”你丢弃的物品和金币来恢复生命。",
			            ...配置,
			        });
			    }
			}
			class 宠物 extends 物品 {
			    constructor(配置 = {}) {
			        const 饰品栏数量 = 配置.饰品栏数量 || 2;
			        const 装备槽 = { 武器: null, 防具: null };
			        for (let i = 1; i <= 饰品栏数量; i++) {
			            装备槽[`饰品${i}`] = null;
			        }
			
			        super({
			            类型: "宠物",
			            名称: 配置.名称 || "宠物",
			            图标: 配置.图标 || 图标映射.宠物,
			            品质: 配置.品质 || 3,
			            颜色索引: 配置.颜色索引 || 2,
			            最大堆叠数量: 1,
			            堆叠数量: 配置.堆叠数量 || 1,
			            效果描述: 配置.效果描述 || "一只忠诚的伙伴。",
			            强化: 配置.强化 || false,
			            数据: {
			                等级: 配置.等级 || 1,
			                当前生命值:
			                    配置.当前生命值 || 配置.最大生命值 || 100,
			                最大生命值: 配置.最大生命值 || 100,
			                基础攻击力: 配置.基础攻击力 || 5,
			                基础防御力: 配置.基础防御力 || 2,
			                经验值: 配置.经验值 || 0,
			                升级所需经验: 配置.升级所需经验 || 20,
			                升级所需金币: 配置.升级所需金币 || 30,
			                技能: 配置.技能 || [],
			                饰品栏数量: 饰品栏数量,
			                装备: 装备槽,
			                休眠中: false,
			                每移动恢复量: 配置.每移动恢复量 || 1,
			                光源范围:1,
			                ...配置.数据,
			            },
			        });
			         if (this.强化) {
			            this.自定义数据.set(
			                "升级所需金币",
			                Math.round(
			                    this.自定义数据.get("升级所需金币") * 0.5
			                )
			            );
			            this.自定义数据.set(
			                "升级所需经验",
			                Math.round(
			                    this.自定义数据.get("升级所需经验") * 0.5
			                )
			            );
			        }
			        this.x = 配置.x ?? null;
			        this.y = 配置.y ?? null;
			        this.层数=配置?.层数?? 当前层数
			        this.是否已放置 = 配置.是否已放置 ?? false;
			        this.伤害来源缓存 = null;
			        this.回到玩家 = false;
			    }
			
			    get 移动距离() {
			        let 基础距离 = 1;
			        const 装备 = this.自定义数据.get("装备") || {};
			        const 飞毛腿列表 = Object.values(装备).filter(item => item instanceof 飞毛腿饰品);
			        基础距离 += 飞毛腿列表.length;
			        return 基础距离;
			    }
			    
			    使用() {
			        this.打开宠物管理窗口();
			        return true;
			    }
			    
			    放出或召回() {
			         if (this.是否已放置) {
			            if (尝试收集物品(this, true)) {
			                const index = 当前出战宠物列表.indexOf(this);
							if (index > -1) {
								当前出战宠物列表.splice(index, 1);
							}
			                this.是否已放置 = false;
			                this.x = null;
			                this.y = null;
			                显示通知(`已召回 ${this.名称}`, "成功");
			            } else {
			                显示通知("背包已满，无法召回宠物！", "错误");
			            }
			        } else {
			            const 放置位置 = 寻找可放置位置(玩家.x, 玩家.y);
			            if (!放置位置) {
			                显示通知("周围没有空间放置宠物！", "错误");
			                return;
			            }
			            if (this.已装备) {
			                玩家装备.delete(this.装备槽位);
			                this.已装备 = false;
			                this.装备槽位 = null;
			            }
			                玩家背包.delete(this.唯一标识);
			            this.是否已放置 = true;
			            this.x = 放置位置.x;
			            this.y = 放置位置.y;
			             this.层数=当前层数
			            当前出战宠物列表.push(this);
			            if (window.宠物管理窗口) {
			                let 窗口=window.宠物管理窗口
			                窗口.style.transform =
			                "translate(-50%, -50%) scale(0.9)";
			            窗口.style.opacity = 0;
			            setTimeout(() => {
			                玩家属性.允许移动 -= 1;
			                玩家属性.允许移动 = Math.max(0,玩家属性.允许移动)
			                窗口.remove();
			            }, 300);
			            window.宠物管理窗口 = null;
			            }
			            显示通知(`${this.名称} 已放出！`, "成功");
			        }
			        更新背包显示();
			        更新装备显示();
			    }
			    
			    尝试互动() {
			        if (!this.是否已放置) return false;
			        const 距离 = Math.abs(玩家.x - this.x) + Math.abs(玩家.y - this.y);
			        if (距离 <= 1) {
			            return this.使用();
			        }
			        return false;
			    }
			
			    寻找可拾取物品() {
			        if ([...玩家背包.values()].reduce((sum, i) => sum + (i.是否隐藏 ? 0 : 1), 0) >= 最大背包容量-1) {
			            return null;
			        }
			        let 最近物品 = null;
			        let 最小距离 = Infinity;
			        const 搜索范围 = 15;
			        for (let dy = -搜索范围; dy <= 搜索范围; dy++) {
			            for (let dx = -搜索范围; dx <= 搜索范围; dx++) {
			                const x = this.x + dx;
			                const y = this.y + dy;
			                if (x < 0 || x >= 地牢大小 || y < 0 || y >= 地牢大小) continue;
			                const 物品 = 地牢[y]?.[x]?.关联物品;
			                if (
			                    物品 &&
			                    !物品.是否被丢弃 &&
			                    (物品 instanceof 武器类 ||
			                     物品 instanceof 防御装备类 ||
			                     物品 instanceof 药水类 ||
			                     (物品 instanceof 卷轴类 && 物品.自定义数据.get("已解锁")))
			                ) {
			                    const 距离宠物 = Math.abs(this.x - x) + Math.abs(this.y - y);
			                    const 距离玩家 = Math.abs(玩家.x - this.x) + Math.abs(玩家.y - this.y);
			                    if (距离宠物 < 距离玩家) {
			                        if (距离宠物 < 最小距离) {
			                            最小距离 = 距离宠物;
			                            最近物品 = 物品;
			                        }
			                    }
			                }
			            }
			        }
			        return 最近物品;
			    }
			    寻找可食用的物品() {
			        let 最近物品 = null;
			        let 最小距离 = Infinity;
			        const 搜索范围 = 20;
			        for (let dy = -搜索范围; dy <= 搜索范围; dy++) {
			            for (let dx = -搜索范围; dx <= 搜索范围; dx++) {
			                const x = this.x + dx;
			                const y = this.y + dy;
			                if (x < 0 || x >= 地牢大小 || y < 0 || y >= 地牢大小) continue;
			                const 物品 = 地牢[y]?.[x]?.关联物品;
			                if (物品 instanceof 金币 || (物品 && 物品.是否被丢弃)) {
			                    const 距离 = Math.abs(this.x - x) + Math.abs(this.y - y);
			                    if (距离 < 最小距离) {
			                        最小距离 = 距离;
			                        最近物品 = 物品;
			                    }
			                }
			            }
			        }
			        return 最近物品;
			    }
			    
			    执行回合AI() {
			        if (this.自定义数据.get("休眠中") || !this.是否已放置 || this.层数!==当前层数) return;
			        const 嗅探之鼻 = Object.values(this.自定义数据.get("装备") || {}).find(item => item instanceof 嗅探之鼻饰品);
			        const isLowHealth = (this.自定义数据.get("当前生命值") / this.自定义数据.get("最大生命值")) < 0.4;
			
			        if (嗅探之鼻 && isLowHealth) {
			            const food = this.寻找可食用的物品();
			            if (food) {
			                const distance = Math.abs(this.x - food.x) + Math.abs(this.y - food.y);
			                if (distance <= 1) {
			                    const healAmount = (food.品质 || 1) * 10 + (food instanceof 金币 ? food.堆叠数量 : 0);
			                    this.自定义数据.set("当前生命值", Math.min(this.自定义数据.get("最大生命值"), this.自定义数据.get("当前生命值") + healAmount));
			                    
			                    const foodCell = 地牢[food.y][food.x];
			                    if (foodCell && foodCell.关联物品 === food) {
			                        foodCell.关联物品 = null;
			                        foodCell.类型 = null;
			                    }
			                    
			                    显示通知(`${this.名称} 吃掉了 ${food.获取名称()}，恢复了生命！`, "成功");
			                    
			                    
			
			                    if (this.自定义数据.get("当前生命值") < this.自定义数据.get("最大生命值")) {
			                        return; 
			                    }
			                } else {
			                    this.移动到(food);
			                    return;
			                }
			            }
			        }
			
			        const 武器 = this.自定义数据.get("装备")?.武器;
			        
			        const 陷阱先锋列表 = Object.values(this.自定义数据.get("装备") || {}).filter(item => item instanceof 陷阱先锋饰品);
			        if (陷阱先锋列表.length > 0) {
			            const 探测半径 = 2 + (陷阱先锋列表.length - 1);
			            let 发现陷阱 = false;
			            for (let dy = -探测半径; dy <= 探测半径; dy++) {
			                for (let dx = -探测半径; dx <= 探测半径; dx++) {
			                    const 目标X = this.x + dx;
			                    const 目标Y = this.y + dy;
			                    const 单元格 = 地牢[目标Y]?.[目标X];
			                    if (单元格 && 单元格.关联物品 && (单元格.关联物品 instanceof 陷阱基类 || 单元格.关联物品 instanceof 隐形毒气陷阱) && 单元格.关联物品.是否为隐藏物品) {
			                        let 陷阱 = 单元格.关联物品
			                        陷阱.是否为隐藏物品 = false;
			                陷阱.自定义数据.set("已触发", true);
			                陷阱.自定义数据.set("已发现", true);
			                陷阱.图标 = 陷阱.自定义数据.get('激活后图标');
			                        计划显示格子特效([{x: 目标X, y: 目标Y}], "00FFFF");
			                        发现陷阱 = true;
			                    }
			                }
			            }
			            if(发现陷阱) 显示通知(`${this?.名称} 发现了隐藏的陷阱！`, "信息");
			        }
			        const 距离玩家 = Math.abs(this.x - 玩家.x) + Math.abs(this.y - 玩家.y);
			        if (距离玩家 > 15) this.回到玩家 = true
			
			        const 目标物品 = this.寻找可拾取物品();
			        if (目标物品 &&!this.回到玩家) {
			            const 距离物品 = Math.abs(this.x - 目标物品.x) + Math.abs(this.y - 目标物品.y);
			            
			            
			            if (距离物品 <= 1) {
			                const 拾取物品实例 = 地牢[目标物品.y][目标物品.x].关联物品;
			                if (尝试收集物品(拾取物品实例, true)) {
			                    地牢[目标物品.y][目标物品.x].关联物品 = null;
			                    if (地牢[目标物品.y][目标物品.x].类型 === 单元格类型.物品) {
			                        地牢[目标物品.y][目标物品.x].类型 = null;
			                    }
			                    显示通知(`${this.名称} 为你捡起了 ${拾取物品实例.获取名称()}！`, "成功");
			                    
			                }
			            } else {
			                
			                this.移动到(目标物品);
			            }
			            return;
			        }
			        
			        const 目标敌人 = this.寻找最近怪物目标();
			        
			        if (目标敌人 &&!this.回到玩家) {
			            const 武器攻击范围 = 武器?.最终攻击范围 || 1;
			            const 距离 = Math.abs(this.x - 目标敌人.x) + Math.abs(this.y - 目标敌人.y);
			
			            if (距离 <= 武器攻击范围) {
			                this.攻击([目标敌人]);
			            } else {
			                this.移动到(目标敌人);
			            }
			            return;
			        }
			        
			        
			        if (距离玩家 > 3) {
			             this.移动到(玩家);
			        } else {
			            this.回到玩家 = false
			        }
			    }
			
			    攻击(目标怪物列表) {
			        if (this.自定义数据.get("休眠中") || !this.是否已放置) return;
			        const 武器 = this.自定义数据.get("装备")?.武器;
			        
			        if (武器 && 武器.堆叠数量 > 0 && (武器.自定义数据.get("冷却剩余") ?? 0) === 0) {
			            const { 怪物, 路径 } = 获取周围怪物(武器.自定义数据.get("攻击目标数"), 武器.最终攻击范围, {x:this.x,y:this.y});
			            if(怪物 !== null) {
			                const 目标怪物们 = 怪物.filter(m => 目标怪物列表.includes(m));
			                if (目标怪物们.length > 0) {
			                    武器.使用(目标怪物们, 路径,this);
			                }
			            }
			        } else { 
			            let 总伤害 = this.自定义数据.get("基础攻击力");
			            目标怪物列表.forEach(怪物 => {
			                if (怪物.当前生命值 > 0) {
			                    怪物.受伤(总伤害, this);
			                    
			                    计划显示格子特效(获取直线路径(this.x,this.y,怪物.x,怪物.y));
			                }
			            });
			            添加日志(`${this.名称} 攻击了 ${目标怪物列表.map(m=>m.类型).join(', ')}, 造成 ${总伤害} 点伤害`, "信息");
			        }
			        this.触发技能("攻击", 目标怪物列表);
			    }
			
			    寻找最近怪物目标() {
			        let 最近距离 = Infinity;
			        let 最近目标 = null;
			
			        所有怪物.forEach(怪物 => {
			            if (怪物.状态 === 怪物状态.活跃 && 怪物.当前生命值 > 0 && !(怪物 instanceof 远射陷阱) && !(怪物 instanceof 巡逻怪物)) {
			                const 距离 = Math.abs(this.x - 怪物.x) + Math.abs(this.y - 怪物.y);
			                if (距离 < 最近距离) {
			                    if (检查视线(this.x, this.y, 怪物.x, 怪物.y, 15)) {
			                        最近距离 = 距离;
			                        最近目标 = 怪物;
			                    }
			                }
			            }
			        });
			        return 最近目标;
			    }
			
			    移动到(目标实体) {
			        let 路径 = 广度优先搜索路径(this.x, this.y, 目标实体.x, 目标实体.y, 999, true);
			        const 瞬间移动 = Object.values(this.自定义数据.get("装备") || {}).find(item => item instanceof 瞬间移动饰品);
			        
			        if (!路径 || 路径.length <= 1 || 路径.length > 15) {
			             if (瞬间移动 && (玩家.x==目标实体.x&&玩家.y==目标实体.y)) {
			                this.瞬移到玩家身旁();
			                return;
			             } else {
			             路径 = 广度优先搜索路径(this.x, this.y, 目标实体.x, 目标实体.y, 999, true,true,true);
			             if (!路径) {
			             let bestMove = null;
			            let minDistance = Math.abs(this.x - 目标实体.x) + Math.abs(this.y - 目标实体.y); // 从当前距离开始比较
			            const directions = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }];

			            for (const { dx, dy } of directions) {
			                const newX = this.x + dx;
			                const newY = this.y + dy;
			
			                // 检查相邻格子是否是有效的移动目的地
			                if (位置是否可用(newX, newY, false, true) && 快速检查相邻移动(this.x, this.y, newX, newY)) {
			                    const distance = Math.abs(newX - 目标实体.x) + Math.abs(newY - 目标实体.y);
			                    if (distance < minDistance) {
			                        minDistance = distance;
			                        bestMove = { x: newX, y: newY };
			                    }
			                }
			            }
			            
			
			            if (bestMove) {
			                // 移动到找到的最佳相邻格子
			                const 旧x = this.x;
			                const 旧y = this.y;
			                this.x = bestMove.x;
			                this.y = bestMove.y;
			
			                // 触发移动动画
			                怪物动画状态.set(this, {
			                    旧逻辑X: 旧x,
			                    旧逻辑Y: 旧y,
			                    目标逻辑X: this.x,
			                    目标逻辑Y: this.y,
			                    视觉X: 旧x,
			                    视觉Y: 旧y,
			                    动画开始时间: Date.now(),
			                    正在动画: true,
			                });
			            } 
			             }
			             }
			             
			        }
			
			        const 步数 = Math.min(this.移动距离, 路径.length - 1);
			        const 下一步 = 路径[步数];
			
			        if (下一步) {
			            const 目标单元格 = 地牢[下一步.y]?.[下一步.x];
			            if (目标单元格 && !目标单元格.关联怪物 && !(下一步.x === 玩家.x && 下一步.y === 玩家.y) && 位置是否可用(下一步.x,下一步.y,false,true) && (已访问房间.has(房间地图[下一步.y][下一步.x])||房间地图[下一步.y][下一步.x]==-1)) {
			                const 旧x = this.x;
			                const 旧y = this.y;
			                
			                this.x = 下一步.x;
			                this.y = 下一步.y;
			
			                怪物动画状态.set(this, {
			                    旧逻辑X: 旧x,
			                    旧逻辑Y: 旧y,
			                    目标逻辑X: this.x,
			                    目标逻辑Y: this.y,
			                    视觉X: 旧x,
			                    视觉Y: 旧y,
			                    动画开始时间: Date.now(),
			                    正在动画: true,
			                });
			            }
			        } else if(瞬间移动) {
			             this.瞬移到玩家身旁();
			        }
			    }
			
			    瞬移到玩家身旁() {
			        const 瞬移位置 = 寻找可放置位置(玩家.x, 玩家.y);
			        if (瞬移位置) {
			            const oldX = this.x;
			            const oldY = this.y;
			            this.x = 瞬移位置.x;
			            this.y = 瞬移位置.y;
			             this.层数=当前层数
			            //计划显示格子特效([{x: oldX, y: oldY}, {x: this.x, y: this.y}], "8A2BE2");
			            //显示通知(`${this.名称} 瞬间移动到了你的身边！`, "信息");
			            绘制();
			        }
			    }
			
			    当玩家攻击(目标怪物列表) {
			        if (this.自定义数据.get("休眠中")) return;
			        this.触发技能("攻击", 目标怪物列表);
			    }
			    
			    当玩家被攻击(原始攻击力, 来源) {
			        if (this.自定义数据.get("休眠中")) return 原始攻击力;
			        this.伤害来源缓存 = 来源;
			
			        let 最终攻击力 = 原始攻击力;
			
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
			        const 宠物承担伤害 = Math.ceil(最终攻击力 * 承担比例);
			        this.受伤(宠物承担伤害, 来源);
			
			        this.触发技能("被攻击", 来源);
			        return 最终攻击力 * (1 - 承担比例);
			    }

			    受伤(伤害值, 来源 = null) {
			        let 当前生命值 = this.自定义数据.get("当前生命值");
			        if (this.是否已放置 && 地牢[this.y]?.[this.x]?.关联物品 instanceof 烟雾) {
			            添加日志(`${this.名称} 被烟雾保护了！`, "成功");
			            return;
			        }
			        当前生命值 = Math.max(0, 当前生命值 - 伤害值);
			        this.自定义数据.set("当前生命值", 当前生命值);
			        this.更新宠物管理窗口();

			        if (来源 instanceof 怪物 && this.是否已放置) {
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

			            if (位置是否可用(新X, 新Y, false, false) && 检查移动可行性(this.x, this.y, 新X, 新Y)) {
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
			                添加日志(`${this.名称} 被击退了！`, "警告");
			            }
			        }

			        if (当前生命值 <= 0) {
			            const 以牙还牙列表 = Object.values(this.自定义数据.get("装备") || {}).filter(item => item instanceof 以牙还牙饰品);
			            const 伤害来源 = 来源 || this.伤害来源缓存;
			            
			            if (以牙还牙列表.length > 0 && 伤害来源 instanceof 怪物 && !(伤害来源 instanceof 大魔法师) && !(伤害来源 instanceof 米诺陶) && !(伤害来源 instanceof 王座守护者)) {
			                const 报复伤害 = this.自定义数据.get("最大生命值") * 0.8 * 以牙还牙列表.length;
			                伤害来源.受伤(报复伤害, this);
			                显示通知(`${this.名称} 发动了以牙还牙，对 ${伤害来源.类型} 造成了 ${报复伤害.toFixed(0)} 点伤害！`, "警告");
			            }
			            this.进入休眠();
			        }
			        this.伤害来源缓存 = null;
			        this.触发技能("被攻击", 来源);
			    }
			
			    进入休眠() {
			        this.自定义数据.set("休眠中", true);
			        添加日志(`${this.名称} 生命值过低，进入休眠！`, "警告");
			    }
			
			    恢复生命值() {
			        if (!this.自定义数据.get("休眠中")) return;
			
			        let 当前生命值 = this.自定义数据.get("当前生命值");
			        const 最大生命值 = this.自定义数据.get("最大生命值");
			        const 时间加速 = 当前激活卷轴列表.has(Array.from(当前激活卷轴列表).find(item => item instanceof 时间卷轴));
			        const 基础恢复量 = this.自定义数据.get("每移动恢复量");
			        const 恢复之心列表 = Object.values(this.自定义数据.get("装备") || {}).filter(item => item instanceof 恢复之心饰品);
			        const 恢复倍率 = 1 + 恢复之心列表.length;
			        const 恢复量 = (时间加速 ? 基础恢复量 * 2 : 基础恢复量) * 恢复倍率;
			        当前生命值 = Math.min(最大生命值, 当前生命值 + 恢复量);
			        this.自定义数据.set("当前生命值", 当前生命值);
			        this.更新宠物管理窗口();
			        if (
			            当前生命值 >= 最大生命值 &&
			            this.自定义数据.get("休眠中")
			        ) {
			            this.自定义数据.set("休眠中", false);
			            显示通知(`${this.名称}已恢复，退出休眠！`, "成功");
			        }
			    }
			    升级() {
			        const 当前等级 = this.自定义数据.get("等级");
			        const 升级所需金币 = this.自定义数据.get("升级所需金币");
			        if (
			            this.自定义数据.get("升级所需经验") <=
			            this.自定义数据.get("经验值")
			        ) {
			            if (扣除金币(升级所需金币)) {
			                this.自定义数据.set("等级", 当前等级 + 1);
			                this.自定义数据.set(
			                    "最大生命值",
			                    this.自定义数据.get("最大生命值") + 20
			                );
			                this.自定义数据.set(
			                    "当前生命值",
			                    this.自定义数据.get("最大生命值")
			                ); 
			                this.自定义数据.set(
			                    "基础攻击力",
			                    this.自定义数据.get("基础攻击力") + 2
			                );
			                this.自定义数据.set(
			                    "基础防御力",
			                    this.自定义数据.get("基础防御力") + 1
			                );
			                this.自定义数据.set(
			                    "升级所需经验",
			                    Math.floor(
			                        this.自定义数据.get("升级所需经验") * 1.5
			                    )
			                );
			                this.自定义数据.set(
			                    "升级所需金币",
			                    Math.floor(
			                        this.自定义数据.get("升级所需金币") * 1.2
			                    )
			                );
			                显示通知(`${this.名称}升级成功！`, "成功");
			                this.更新宠物管理窗口();
			                return true;
			            } else {
			                显示通知("金币不足，无法升级！", "错误");
			                return false;
			            }
			        } else {
			            显示通知("经验不足，无法升级！", "错误");
			            return false;
			        }
			    }
			    获得经验(经验值) {
			        let 最终经验 = 经验值;
			        const 博士之卷列表 = Object.values(this.自定义数据.get("装备") || {}).filter(item => item instanceof 博士之卷饰品);
			        博士之卷列表.forEach(() => {
			            最终经验 *= 2;
			        });
			        let 当前经验 = this.自定义数据.get("经验值") + 最终经验;
			        this.自定义数据.set("经验值", 当前经验);
			    }
			    装备物品(物品, 槽位) {
			        const isAccessorySlot = 槽位.startsWith("饰品");
			        const maxAccessorySlots = this.自定义数据.get("饰品栏数量") || 0;
			        if (isAccessorySlot) {
			            const slotNum = parseInt(槽位.slice(2), 10);
			            if(isNaN(slotNum) || slotNum <= 0 || slotNum > maxAccessorySlots) {
			               显示通知("无效的宠物饰品槽位", "错误");
			               return;
			            }
			        }
			        if (!["武器", "防具"].includes(槽位) && !isAccessorySlot) {
			            显示通知("无效的宠物装备槽位", "错误");
			            return;
			        }
			        if (
			            (槽位 === "武器" && !(物品 instanceof 武器类)) ||
			            (槽位 === "防具" && !(物品 instanceof 防御装备类)) ||
			            (isAccessorySlot && 物品.类型 !== "饰品")
			        ) {
			            显示通知("该物品不能装备到此槽位", "错误");
			            return;
			        }
			        if (this.自定义数据.get("装备")[槽位]) {
			            this.卸下装备(槽位);
			        }
			        物品.是否隐藏 = true;
			        卸下装备槽物品(物品.装备槽位); 
			        this.自定义数据.get("装备")[槽位] = 物品;
			        显示通知(`${this.名称}装备了${物品.获取名称()}`, "成功");
			        this.更新宠物管理窗口();
			    }
			    卸下装备(槽位) {
			        const 装备 = this.自定义数据.get("装备");
			        if (
			            装备 &&
			            装备[槽位] &&
			            [...玩家背包.values()].reduce(
			                (sum, i) => sum + (i.是否隐藏 ? 0 : 1),
			                0
			            ) < 最大背包容量
			        ) {
			            const 卸下物品 = 装备[槽位];
			            装备[槽位] = null;
			            卸下物品.是否隐藏 = false;
			            显示通知(
			                `${this.名称}卸下了${卸下物品.获取名称()}`,
			                "成功"
			            );
			            this.自定义数据.set("装备", 装备);
			            this.更新宠物管理窗口();
			            更新背包显示();
			        } else {
			            显示通知("背包已满！", "错误");
			        }
			    }
			    触发技能(时机, 额外参数) {
			        const 技能列表 = this.自定义数据.get("技能");
			        if (!技能列表) return;
			        技能列表.forEach((技能) => {
			            if (技能.时机 === 时机 && prng() > 0.5) {
			                this.技能效果[技能.索引](this, 额外参数);
			            }
			        });
			    }
			    打开宠物管理窗口() {
			        if (界面可见性.背包) 切换背包显示();
			        玩家属性.允许移动 += 1;
			        if (window.宠物管理窗口) {
			            显示通知("一次只能打开一个宠物管理窗口", "错误");
			            玩家属性.允许移动 -= 1;
			            return;
			        }
			        const 窗口 = document.createElement("div");
			        窗口.className = "宠物管理窗口";
			        window.宠物管理窗口 = 窗口;
			        const 基本信息面板 = this.创建基本信息面板();
			        const 装备面板 = this.创建装备面板();
			        const 饰品面板 = this.创建饰品面板();
			        const 技能面板 = this.创建技能面板();
			        const 交互按钮容器 = document.createElement("div");
			        交互按钮容器.style.display = 'flex';
			        交互按钮容器.style.gap = '10px';
			        const 放出召回按钮 = document.createElement("button");
			        放出召回按钮.className = "通用按钮";
			        放出召回按钮.textContent = this.是否已放置 ? "召回宠物" : "放出宠物";
			        放出召回按钮.onclick = () => {
			            this.放出或召回();
			            放出召回按钮.textContent = this.是否已放置 ? "召回宠物" : "放出宠物";
			        };
			        const 升级按钮 = document.createElement("button");
			        升级按钮.className = "通用按钮";
			        升级按钮.textContent = `升级宠物（${this.自定义数据.get("升级所需金币")} 金币）`;
			        升级按钮.addEventListener("click", () => {
			            this.升级();
			            this.更新基本信息面板(基本信息面板); 
			            升级按钮.textContent = `升级宠物（${this.自定义数据.get("升级所需金币")} 金币）`;
			        });
			        交互按钮容器.appendChild(放出召回按钮);
			        交互按钮容器.appendChild(升级按钮);
			        const 关闭按钮 = document.createElement("button");
			        关闭按钮.className = "关闭按钮";
			        关闭按钮.textContent = "×";
			        关闭按钮.onclick = () => {
			            窗口.style.transform =
			                "translate(-50%, -50%) scale(0.9)";
			            窗口.style.opacity = 0;
			            setTimeout(() => {
			                玩家属性.允许移动 -= 1;
			                窗口.remove();
			            }, 300);
			            window.宠物管理窗口 = null;
			        };
			        窗口.appendChild(关闭按钮);
			        窗口.appendChild(基本信息面板);
			        窗口.appendChild(装备面板);
			        窗口.appendChild(饰品面板);
			        窗口.appendChild(技能面板);
			        窗口.appendChild(交互按钮容器);
			        document.body.appendChild(窗口);
			    }
			    更新宠物管理窗口() {
			        if (!window.宠物管理窗口) return;
			        const 基本信息面板 =
			            window.宠物管理窗口.querySelector(".宠物基本信息面板");
			        if (基本信息面板) this.更新基本信息面板(基本信息面板);
			        const 装备面板容器 = window.宠物管理窗口.querySelector(".宠物装备面板");
			        if (装备面板容器) {
			            const 新装备面板 = this.创建装备面板();
			            装备面板容器.replaceWith(新装备面板);
			        }
			        const 饰品面板容器 = window.宠物管理窗口.querySelector(".宠物饰品面板");
			        if(饰品面板容器) {
			            const 新饰品面板 = this.创建饰品面板();
			            饰品面板容器.replaceWith(新饰品面板);
			        }
			        const 升级按钮 = window.宠物管理窗口.querySelectorAll('.通用按钮')[6];
			        if (升级按钮) {
			             升级按钮.textContent = `升级宠物（${this.自定义数据.get("升级所需金币")} 金币）`;
			        }
			    }
			    创建基本信息面板() {
			        const 面板 = document.createElement("div");
			        面板.className = "宠物基本信息面板";
			        this.更新基本信息面板(面板);
			        return 面板;
			    }
			    更新基本信息面板(面板) {
			        const data = this.自定义数据;
			        面板.innerHTML = `
			<h3>${this.名称} (等级 ${data.get("等级")})</h3>
			<div class="宠物状态栏">
			     <span>生命:</span>
			     <div class="条容器">
			        <div class="宠物血量条" style="width: ${Math.max(0, (data.get("当前生命值") / data.get("最大生命值")) * 100)}%;"></div>
			        <span class="宠物血量文本">${data.get("当前生命值")} / ${data.get("最大生命值")}</span>
			    </div>
			     <span>经验:</span>
			    <div class="宠物经验条容器">
			        <div class="宠物经验条" style="width: ${Math.min(100, (data.get("经验值") / data.get("升级所需经验")) * 100)}%;"></div>
			        <span class="宠物经验文本">${data.get("经验值")} / ${data.get("升级所需经验")}</span>
			    </div>
			</div>
			<div class="宠物属性">
			    <span>攻击力: ${data.get("基础攻击力")}</span>
			    <span>防御力: ${data.get("基础防御力")}</span>
			</div>
			<p style="text-align: center; margin-top: 10px;">状态: ${data.get("休眠中") ? "休眠中" : "活跃"}</p>
			        `;
			    }
			    创建装备面板() {
			        const 面板 = document.createElement("div");
			        面板.className = "宠物装备面板";
			        面板.innerHTML = "<h4>装备</h4>";
			        const 武器槽 = this.创建装备槽("武器");
			        const 防具槽 = this.创建装备槽("防具");
			        面板.appendChild(武器槽);
			        面板.appendChild(防具槽);
			        return 面板;
			    }
			    创建饰品面板() {
			        const 面板 = document.createElement("div");
			        面板.className = "宠物饰品面板";
			        面板.innerHTML = "<h4>饰品</h4>";
			
			        const 饰品槽容器 = document.createElement("div");
			        饰品槽容器.className = "宠物装备格子容器"; 
			        
			        const 饰品栏数量 = this.自定义数据.get("饰品栏数量") || 0;
			        饰品槽容器.style.gridTemplateColumns = `repeat(${饰品栏数量}, 1fr)`; 
			
			        for (let i = 1; i <= 饰品栏数量; i++) {
			            const 饰品槽 = this.创建装备槽(`饰品${i}`);
			            饰品槽容器.appendChild(饰品槽);
			        }
			
			        面板.appendChild(饰品槽容器);
			        return 面板;
			    }
			    创建装备槽(槽位类型) {
			        const 槽 = document.createElement("div");
			        槽.className = "宠物装备槽";
			        槽.dataset.槽位 = 槽位类型;
			        const 槽位名 = document.createElement("span");
			        槽位名.className = "宠物装备槽位名";
			        槽位名.textContent = 槽位类型;
			        槽.appendChild(槽位名);
			        const 已装备物品 = this.自定义数据.get("装备")[槽位类型];
			        if (已装备物品 && (已装备物品?.自定义数据?.get('耐久')>0 ||!(已装备物品 instanceof 武器类 || 已装备物品 instanceof 防御装备类))) {
			            const 物品元素 = this.创建装备物品元素(已装备物品, 槽位类型);
			            槽.appendChild(物品元素);
			        } else {
			            const 选择按钮 = document.createElement("button");
			            选择按钮.className = "通用按钮";
			            选择按钮.textContent = `装备${槽位类型}`;
			            选择按钮.addEventListener("click", () => {
			                if(槽位类型.startsWith('饰品')) {
			                    this.显示饰品选择(槽位类型);
			                } else {
			                    this.显示装备选择(槽位类型);
			                }
			            });
			            槽.appendChild(选择按钮);
			        }
			        return 槽;
			    }
			    创建装备物品元素(物品, 槽位类型) {
			        const 元素 = document.createElement("div");
			        元素.className = "宠物已装备物品";
			        const 图标 = document.createElement("span");
			        图标.className = "宠物装备图标";
			        图标.textContent = 物品.图标;
			        图标.style.color = 物品.颜色表[物品.颜色索引];
			        const 名称 = document.createElement("span");
			        名称.className = "宠物装备名称";
			        名称.textContent = 物品.获取名称();
			        const 卸下按钮 = document.createElement("button");
			        卸下按钮.className = "通用按钮";
			        卸下按钮.textContent = "卸下";
			        卸下按钮.addEventListener("click", () => {
			            this.卸下装备(槽位类型); 
			            this.更新宠物管理窗口();
			        });
			        元素.appendChild(图标);
			        元素.appendChild(名称);
			        元素.appendChild(卸下按钮);
			        return 元素;
			    }
			    显示饰品选择(槽位类型) {
			        this.显示装备选择(槽位类型, '饰品');
			    }
			    显示装备选择(槽位类型, 物品类型过滤 = null) {
			        const 遮罩 = document.createElement("div");
			        遮罩.className = "宠物装备选择遮罩";
			        const 弹窗 = document.createElement("div");
			        弹窗.className = "宠物装备选择弹窗";
			        const 标题 = document.createElement("h4");
			        标题.textContent = `选择${槽位类型}`;
			        弹窗.appendChild(标题);
			        const 物品列表 = document.createElement("div");
