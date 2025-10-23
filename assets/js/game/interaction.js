function 处理地图单击(e) {
			    处理点击(e.clientX, e.clientY);
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

