function 切换背包显示() {
			    const 弹窗 = document.querySelector(".背包弹窗");
			    const 融合窗口 = document.getElementById("融合窗口");
			    const 背包标题元素 = 弹窗.querySelector(":scope > .弹窗头部 > h3");
			    const 当前状态 = 弹窗.classList.contains("显示中");
			    
			    if (当前状态) {
			        玩家属性.允许移动 -= 1;
			        融合窗口.style.display = 'none';
			        融合窗口.classList.remove("显示中");
			        document.querySelectorAll(".物品条目").forEach((el) => {
			            el.classList.remove("active");
			            if (el.__物品实例) {
			                el.__物品实例.isActive = false;
			            }
			        });
			    } else {
			        玩家属性.允许移动 += 1;
			        if (游戏状态 === '地图编辑器') {
			             融合窗口.style.display = 'none';
			             
			             if (背包标题元素) {
			                背包标题元素.innerHTML = `编辑器工具箱`;
			             }
			        } else {
			            更新融合窗口();
			            融合窗口.style.display = "flex";
			            requestAnimationFrame(() => {
			                融合窗口.classList.add("显示中");
			                融合窗口.style.opacity = 1;
			                融合窗口.style.transform = "translateX(0)";
			                融合窗口.style.pointerEvents = "auto";
			                融合窗口.style["flex-direction"] = "row";
			            });
			            if (背包标题元素) {
			                背包标题元素.innerHTML = `背包 (容量：<span id="当前容量">0</span>/<span id="最大容量">${最大背包容量}</span>)`;
			            }
			            更新背包显示();
			        }
			    }
			    
			    界面可见性.背包 = !当前状态;
			    
			    弹窗.classList.toggle("显示中", !当前状态);
			    document.getElementById("浮动提示框").style.display = "none";
			}

function 使用装备槽物品(槽位编号) {
			    const 物品实例 = 玩家装备.get(槽位编号);
			
			    if (!物品实例) return;
			
			    // 无需考虑堆叠
			    if (物品实例.类型 === "武器") {
			        if (
			            物品实例.堆叠数量 > 0 &&
			            物品实例.自定义数据.get("冷却剩余") == 0
			        ) {
			            const { 怪物, 路径 } = 获取周围怪物(
			                物品实例.自定义数据.get("攻击目标数"),
			                物品实例.最终攻击范围
			            );
			            if (怪物 !== null) {
			                if (物品实例.使用(怪物, 路径,玩家)) {
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
			                                装备.当玩家攻击(怪物);
			                            }
			                        });
			                    更新装备显示();
			                    绘制();
			                    return true;
			                }
			            } else {
			                if (当前天气效果.includes("诡魅")) {
			                    显示通知(
			                        "太远了...看不清怪物的真实位置了...",
			                        "错误"
			                    );
			                } else {
			                    if(物品实例.自定义数据.get("攻击目标数")>0) 显示通知("附近没有目标", "错误");
			                }
			            }
			        } else {
			            显示通知("武器还未准备好", "错误");
			            return false;
			        }
			    }
			    if (物品实例.类型 === "卷轴") {
			        显示通知("请使用卷轴键使用该物品", "错误");
			        return false;
			    }
			    if (物品实例.使用()) {
			        if (物品实例.堆叠数量 <= 0) {
			            if (物品实例.装备槽位)
			                玩家装备.delete(物品实例.装备槽位);
			            玩家背包.delete(物品实例.唯一标识);
			        }
			        更新背包显示();
			        更新装备显示();
			        显示通知("已使用物品", "成功");
			        return true;
			    } else {
			        if (物品实例.类型 !== "武器") {
			            显示通知("无法使用该物品", "错误");
			        }
			    }
			    return false;
			}

function 更新背包显示() {
			    const 容器 = document.getElementById("背包物品栏");
			    document.getElementById("最大容量").textContent = 最大背包容量;
			
			    const domItemMap = new Map();
			    for (const child of 容器.children) {
			        if (child.__物品实例) {
			            domItemMap.set(child.__物品实例.唯一标识, child);
			        }
			    }
			
			    const backpackItemSymbols = new Set(玩家背包.keys());
			
			    for (const [symbol, item] of 玩家背包.entries()) {
			        if (item.是否隐藏) {
			            if (domItemMap.has(symbol)) {
			                domItemMap.get(symbol).remove();
			                domItemMap.delete(symbol);
			            }
			            continue;
			        }
			
			        let 元素 = domItemMap.get(symbol);
			
			        if (元素) {
			            const 堆叠元素 = 元素.querySelector(".物品堆叠");
			            if (item.堆叠数量 > 1) {
			                if (堆叠元素) {
			                    堆叠元素.textContent = `x${item.堆叠数量}`;
			                } else {
			                    const newStackEl = document.createElement("div");
			                    newStackEl.className = "物品堆叠";
			                    newStackEl.textContent = `x${item.堆叠数量}`;
			                    元素.appendChild(newStackEl);
			                }
			            } else {
			                if (堆叠元素) 堆叠元素.remove();
			            }
			            
			            const 名称元素 = 元素.querySelector('.物品名称');
			            if (名称元素) 名称元素.textContent = item.获取名称();
			
			            domItemMap.delete(symbol);
			        } else {
			            元素 = item.生成显示元素();
			            容器.appendChild(元素);
			        }
			    }
			
			    for (const symbolToDelete of domItemMap.keys()) {
			         domItemMap.get(symbolToDelete).remove();
			    }
			
			    document.getElementById("当前容量").textContent = [...玩家背包.values()].reduce((sum, i) => sum + (i.是否隐藏 ? 0 : 1), 0);
			}

function 切换装备页(方向) {
			    const 旧页 = 当前装备页;
			    当前装备页 += 方向;
			
			    let 最高槽位 = 最大背包容量;
			    const 最大有效页 = Math.min(最大装备页-1,Math.max(0, Math.ceil(最高槽位 / 装备栏每页装备数) - 1));
			
			    当前装备页 = Math.max(0, Math.min(当前装备页, 最大有效页));
			
			    if (当前装备页 !== 旧页) {
			        更新装备显示();
			
			        const 装备栏元素 = document.querySelector(".装备栏");
			        if (装备栏元素) {
			            装备栏元素.style.transition = "transform 0.1s ease-out";
			            装备栏元素.style.transform = `translateX(${
			                方向 > 0 ? "-" : ""
			            }5px)`;
			            setTimeout(() => {
			                装备栏元素.style.transform = "";
			            }, 100);
			        }
			    }
			}

