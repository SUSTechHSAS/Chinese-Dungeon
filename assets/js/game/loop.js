function 处理回合逻辑() {
			    if (玩家属性.允许移动 > 0) return;
			    if (地牢.length !== 地牢大小) return;
			    
			    玩家总移动回合数++;
			    更新胜利条件显示();
			    处理传送带效果();
			    更新武器冷却();
			    
			    if (当前出战宠物列表.length > 0) {
					当前出战宠物列表.forEach(pet => {if(pet.层数==当前层数) pet.执行回合AI()});
				}
				if(当前天气效果.includes('深夜')) 更新光源地图();
				if(房间列表.find(item=>item.id==房间地图[玩家.y][玩家.x])?.类型==='黑暗房间') 更新光源地图();
			
			    if (跳过怪物回合剩余次数 > 0) {
			    跳过怪物回合剩余次数--;
			    添加日志(`时空扭曲，怪物们停止了行动... (剩余 ${跳过怪物回合剩余次数} 回合)`, "信息");
			} else {
			    处理怪物回合();
			}
			绘制小地图();
			    所有怪物.forEach((m) => {
			        m.绘制血条();
			    });
			    处理天气效果();
			    更新物体指示器();
			    if (当前层数 === 5) {
			        const 怪物数量下限 = 10;
			        if (所有怪物.length < 怪物数量下限) {
			            const 需生成数量 = 怪物数量下限 - 所有怪物.length;
			            生成迷宫怪物(需生成数量);
			        }
			    }
			    const 能量条 = document.querySelector(".power-bar");
			    const 当前能量 = parseFloat(能量条?.style.width) || 100;
			    let 能量变化 = 0;
			    if(当前能量 < 70) 能量变化 += (Math.round(prng() * 5) / 5)/自定义全局设置.初始能量值*100;
			    if(玩家属性.能量流失 > 0) 能量变化 -= 玩家属性.能量流失/自定义全局设置.初始能量值*100;
			
			    if (能量条 && 能量变化 !== 0) {
			         能量条.style.width = `${Math.max(0, Math.min(100, 当前能量 + 能量变化))}%`;
			    }
			    玩家状态.forEach((item) => {
			        item.更新状态();
			    });
			    所有计时器.forEach((item) => {
			        if(item) item?.更新倒计时();
			    });
			    if (房间列表.length>0) {
			    房间列表.forEach(房间 => {
			        if (房间?.isSurvivalChallenge) {
			            const monstersInRoom = 所有怪物.filter(m => m.房间ID === 房间.id);
			            if (monstersInRoom.length === 0) {
			                 let 石碑 = null;
			                 for(const row of 地牢) {
			                    for(const cell of row) {
			                        if(cell.关联物品 instanceof 挑战石碑 && cell.关联物品.自定义数据.get("已激活") && 房间地图[cell.y][cell.x] === 房间.id) {
			                            石碑 = cell.关联物品;
			                            break;
			                        }
			                    }
			                    if(石碑) break;
			                 }
			                if(石碑) {
			                    石碑.刷新生存挑战下一波(房间);
			                }
			            }
			        }
			    });
			    }
			    Array.from({ length: 装备栏每页装备数 }, (_, i) =>
			        玩家装备.get(当前装备页 * 装备栏每页装备数 + i + 1)
			    )
			        .filter((v) => v != null)
			        .forEach((装备) => {
			            if (装备 instanceof 宠物) {
			                装备.恢复生命值();
			            }
			        });
				当前出战宠物列表.forEach(pet => pet.恢复生命值());
			    
			    更新界面状态();
			    if (房间列表.length>0) {
			    房间列表.forEach((房间) => {
			        if (
			            房间.类型 === "挑战房间" &&
			            房间.挑战状态 &&
			            房间.挑战状态.进行中
			        ) {
			            房间.挑战状态.波次当前回合数--;
			            房间.挑战状态.波次内怪物 =
			                房间.挑战状态.波次内怪物.filter(
			                    (m) => m.当前生命值 > 0 && 所有怪物.includes(m)
			                );
			
			            if (房间.挑战状态.波次内怪物.length === 0) {
			                添加日志(
			                    `房间 ${房间.id} 第 ${房间.挑战状态.当前波次} 波怪物已清除！`,
			                    "成功"
			                );
			                刷新挑战房间下一波(房间);
			            } else if (
			                房间.挑战状态.当前波次 < 房间.挑战状态.总波次
			            ) {
			                if (房间.挑战状态.波次当前回合数 <= 0) {
			                    添加日志(
			                        `房间 ${房间.id} 第 ${房间.挑战状态.当前波次} 波时间到！`,
			                        "警告"
			                    );
			                    刷新挑战房间下一波(房间);
			                }
			            }
			        }
			    });
			    }
			}

