function 更新视口(直接更新 = false, x = 玩家.x, y = 玩家.y) {
			    const 视野偏移 = Math.floor(相机显示边长 / 2);
			    let 目标X = x - 视野偏移;
			    let 目标Y = y - 视野偏移;
			
			    const 检查视口碰撞 = (试探X, 试探Y) => {
			        for (let viewY = 0; viewY < 相机显示边长; viewY++) {
			            for (let viewX = 0; viewX < 相机显示边长; viewX++) {
			                const worldX = 试探X + viewX;
			                const worldY = 试探Y + viewY;
			
			                if (worldX < 0 || worldX >= 地牢大小 || worldY < 0 || worldY >= 地牢大小) continue;
			
			                const 单元格 = 地牢[worldY]?.[worldX];
			                if (单元格?.关联物品?.阻碍视野 && 游戏状态!=='地图编辑器') {
			                    return false; 
			                }
			            }
			        }
			        return true;
			    };
			
			    let 最终目标X = 当前相机X;
			    let 最终目标Y = 当前相机Y;
			
			    let 试探X = Math.max(0, Math.min(目标X, 地牢大小 - 相机显示边长));
			    if (检查视口碰撞(Math.floor(试探X), Math.floor(当前相机Y))) {
			        最终目标X = 试探X;
			    } else {
			        最终目标X = Math.floor(当前相机X);
			    }
			
			    let 试探Y = Math.max(0, Math.min(目标Y, 地牢大小 - 相机显示边长));
			    if (检查视口碰撞(Math.floor(最终目标X), Math.floor(试探Y))) {
			        最终目标Y = 试探Y;
			    } else {
			        最终目标Y = Math.floor(当前相机Y);
			    }
			
			    if (相机目标X !== 最终目标X || 相机目标Y !== 最终目标Y) {
			        相机锁定 = true;
			        相机目标X = 最终目标X;
			        相机目标Y = 最终目标Y;
			        if (直接更新) {
			            视口偏移X = Math.floor(最终目标X);
			            视口偏移Y = Math.floor(最终目标Y);
			            当前相机X = 最终目标X;
			            当前相机Y = 最终目标Y;
			        }
			    }
			}

function 动画帧() {
			    if (!动画帧运行过) {
			        动画帧运行过 = true;
			        已初始化--;
			    }
			    const dx = 相机目标X - 当前相机X;
			    const dy = 相机目标Y - 当前相机Y;
			
			    当前相机X += dx * 相机移动速度;
			    当前相机Y += dy * 相机移动速度;
			    const 当前时间 = Date.now();
			    // 检测移动完成
			    if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
			        当前相机X = 相机目标X;
			        当前相机Y = 相机目标Y;
			
			        
			
			        更新物体指示器();
			    }
			    if (待显示格子特效队列.length > 0) {
			        for (let i = 待显示格子特效队列.length - 1; i >= 0; i--) {
			            const 路径数据 = 待显示格子特效队列[i];
			            显示格子特效(
			                路径数据.路径,
			                路径数据.颜色,
			                路径数据.间隔
			            );
			        }
			        待显示格子特效队列 = [];
			    }
			
			    if (活动DOM特效.length > 0) {
			        const 画布RectUpdate = canvas.getBoundingClientRect(); // 获取最新的画布位置信息
			        活动DOM特效.forEach((item) => {
			            // 检查元素是否还存在于 DOM 中，防止意外移除导致错误
			            if (document.body.contains(item.element)) {
			                // 使用平滑插值的相机位置 (当前相机X/Y) 计算屏幕坐标
			                const 屏幕X =
			                    (item.worldX - 当前相机X) * 单元格大小;
			                const 屏幕Y =
			                    (item.worldY - 当前相机Y) * 单元格大小;
			                // 更新 DOM 元素的屏幕位置
			                item.element.style.left = `${
			                    屏幕X + 画布RectUpdate.left
			                }px`;
			                item.element.style.top = `${
			                    屏幕Y + 画布RectUpdate.top
			                }px`;
			            } else {
			                // 如果元素意外地不在 DOM 中了，从跟踪数组中清理掉
			                活动DOM特效 = 活动DOM特效.filter(
			                    (trackedItem) =>
			                        trackedItem.element !== item.element
			                );
			            }
			        });
			    }
			    所有怪物.forEach((怪物) => {
			        const 动画状态 = 怪物动画状态.get(怪物);
			        if (动画状态?.正在动画) {
			            const 已过时间 = 当前时间 - 动画状态.动画开始时间;
			            const t = Math.min(1, 已过时间 / 怪物移动动画时长); // 插值因子 (0 到 1)
			
			            // 使用线性插值计算视觉逻辑坐标
			            动画状态.视觉X =
			                动画状态.旧逻辑X +
			                (动画状态.目标逻辑X - 动画状态.旧逻辑X) * t;
			            动画状态.视觉Y =
			                动画状态.旧逻辑Y +
			                (动画状态.目标逻辑Y - 动画状态.旧逻辑Y) * t;
			
			            // 如果动画完成
			            if (t >= 1) {
			                动画状态.正在动画 = false;
			                动画状态.视觉X = 动画状态.目标逻辑X; // 确保最终位置精确
			                动画状态.视觉Y = 动画状态.目标逻辑Y;
			            }
			        }
			    });
			    const 动画状态玩家 = 玩家动画状态;
			if (动画状态玩家.正在动画) {
			    const 已过时间 = 当前时间 - 动画状态玩家.动画开始时间;
			    const 动画时长 = 120;
			    const t = Math.min(1, 已过时间 / 动画时长);
			
			    动画状态玩家.视觉X = 动画状态玩家.旧逻辑X + (动画状态玩家.目标逻辑X - 动画状态玩家.旧逻辑X) * t;
			    动画状态玩家.视觉Y = 动画状态玩家.旧逻辑Y + (动画状态玩家.目标逻辑Y - 动画状态玩家.旧逻辑Y) * t;
			
			    if (t >= 1) {
			        动画状态玩家.正在动画 = false;
			    }
			}
			当前出战宠物列表.forEach(pet => {
    if (!pet || !pet.是否已放置) return;

    const 动画状态 = 怪物动画状态.get(pet);
    if (动画状态?.正在动画) {
        const 已过时间 = 当前时间 - 动画状态.动画开始时间;
        const t = Math.min(1, 已过时间 / 怪物移动动画时长); // 插值因子 (0 到 1)

        // 使用线性插值计算视觉逻辑坐标
        动画状态.视觉X =
            动画状态.旧逻辑X +
            (动画状态.目标逻辑X - 动画状态.旧逻辑X) * t;
        动画状态.视觉Y =
            动画状态.旧逻辑Y +
            (动画状态.目标逻辑Y - 动画状态.旧逻辑Y) * t;

        // 如果动画完成
        if (t >= 1) {
            动画状态.正在动画 = false;
            动画状态.视觉X = 动画状态.目标逻辑X; // 确保最终位置精确
            动画状态.视觉Y = 动画状态.目标逻辑Y;
        }
    }
});
			    if (待显示爆炸范围.length > 0) {
			        const 画布RectExplosion = canvas.getBoundingClientRect();
			
			        待显示爆炸范围.forEach((explosionData) => {
			             if (explosionData && explosionData.爆炸范围.length > 0) {
			             const 特效容器 = document.getElementById("effectsContainer");
			                explosionData.爆炸范围.forEach(({ x, y, 距离 }) => {
			                    const 屏幕X = (x - 当前相机X) * 单元格大小;
			                    const 屏幕Y = (y - 当前相机Y) * 单元格大小;
			                    if (
			                        屏幕X + 单元格大小 < 0 || 
			                        屏幕X > 画布RectExplosion.width || 
			                        屏幕Y + 单元格大小 < 0 || 
			                        屏幕Y > 画布RectExplosion.height
			                    ) {
			                        return;
			                    }
			                    const 特效 = document.createElement("div");
			                    特效.style.cssText = `
			                        position: absolute;
			                        left: ${屏幕X + 画布RectExplosion.left}px;
			                        top: ${屏幕Y + 画布RectExplosion.top}px;
			                        width: ${单元格大小}px;
			                        height: ${单元格大小}px;
			                        background: ${获取爆炸颜色(距离, explosionData.范围)};
			                        opacity: 0.7;
			                        animation: 爆炸闪烁 ${0.4 + (距离 / explosionData.范围) * 0.1}s;
			                        pointer-events: none;
			                        z-index: 999;
			                    `;
			
			                    特效容器.appendChild(特效);
			
			                    const worldX = x;
			                    const worldY = y;
			                    const effectData = {
			                        element: 特效,
			                        worldX: worldX,
			                        worldY: worldY,
			                    };
			                    活动DOM特效.push(effectData);
			
			                    setTimeout(() => {
			                        特效.remove();
			                        活动DOM特效 = 活动DOM特效.filter(
			                            (item) => item.element !== 特效
			                        );
			                    }, 500); 
			                });
			            }
			        });
			
			        待显示爆炸范围 = [];
			    }
			
			    if (
			        (游戏状态 === "图鉴" || 游戏状态 === "游戏中" || 游戏状态 === "编辑器游玩") &&
			        当前时间 - 上次自动回合时间 >= 自动回合间隔 &&
			        切换动画
			    ) {
			        if (!死亡界面已显示 && 玩家属性.允许移动 <= 0) {
			            处理回合逻辑();
			            上次自动回合时间 = 当前时间;
			        }
			    }
			
			    // 更新整数视口
			    视口偏移X = Math.floor(当前相机X);
			    视口偏移Y = Math.floor(当前相机Y);
			
			    if (所有传送门.length > 0 && 游戏状态 !== '地图编辑器') {
			    //处理沉浸式传送门();
			    绘制()
			} else {
			    绘制();
			}
			    requestAnimationFrame(动画帧);
			}

function 绘制() {
			
			    const 缓冲区域 = 1;
			    const 起始X = Math.max(0, Math.floor(当前相机X - 缓冲区域));
			    const 结束X = Math.min(
			        地牢大小,
			        起始X + 相机显示边长 + 缓冲区域 * 2
			    );
			    const 起始Y = Math.max(0, Math.floor(当前相机Y - 缓冲区域));
			    const 结束Y = Math.min(
			        地牢大小,
			        起始Y + 相机显示边长 + 缓冲区域 * 2
			    );
			    const 清理X = (起始X - 当前相机X) * 单元格大小 - 单元格大小;
			    const 清理Y = (起始Y - 当前相机Y) * 单元格大小 - 单元格大小;
			    const 清理宽 = (结束X - 起始X + 2) * 单元格大小;
			    const 清理高 = (结束Y - 起始Y + 2) * 单元格大小;
			    ctx.clearRect(清理X, 清理Y, 清理宽, 清理高);
			
			    const 小数偏移X = (当前相机X % 1) * 单元格大小;
			    const 小数偏移Y = (当前相机Y % 1) * 单元格大小;
			
			    for (let y = 起始Y; y < 结束Y; y++) {
			        for (let x = 起始X; x < 结束X; x++) {
			            if (地牢.length > 0 && 地牢[y]?.[x]) {
			                地牢[y][x].绘制();
			            }
			        }
			    }
			    
			    if (moveQueue.length > 0) {
			        drawPath(moveQueue);
			    }
			    
			    所有怪物.forEach((怪物实例) => {
			        if (怪物实例 instanceof 巨人部位) return;
			
			        const 动画状态 = 怪物动画状态.get(怪物实例);
			        let 绘制逻辑X = 怪物实例.x;
			        let 绘制逻辑Y = 怪物实例.y;
			        const 正在动画 = 动画状态?.正在动画;
			
			        if (正在动画) {
			            绘制逻辑X =
			                动画状态.视觉X !== undefined
			                    ? 动画状态.视觉X
			                    : 怪物实例.x;
			            绘制逻辑Y =
			                动画状态.视觉Y !== undefined
			                    ? 动画状态.视觉Y
			                    : 怪物实例.y;
			        }
			
			        const 怪物视口X = 绘制逻辑X - 视口偏移X;
			        const 怪物视口Y = 绘制逻辑Y - 视口偏移Y;
			        const 怪物所在房间ID = 房间地图[怪物实例.y]?.[怪物实例.x];
			        const 怪物所在房间 =
			            怪物所在房间ID !== -1 ? 房间列表[怪物所在房间ID] : null;
			        if (
			            怪物视口X >= -缓冲区域 &&
			            怪物视口X < 相机显示边长 + 缓冲区域 &&
			            怪物视口Y >= -缓冲区域 &&
			            怪物视口Y < 相机显示边长 + 缓冲区域 &&
			            (怪物实例.隐身中 ?? false) === false &&
			            (怪物所在房间ID === -1 ||
			                已访问房间.has(怪物所在房间ID) ||
			                (玩家属性.透视 && !当前天气效果.includes("诡魅") && !当前天气效果.includes("深夜")) ||
			                游戏状态 === "图鉴" ||
			                游戏状态 === '地图编辑器') &&
			            (
			                !(玩家状态.some(s => s.类型 === '失明') || (当前天气效果.includes("深夜")&& 游戏状态 !== '地图编辑器') ||
			                    (怪物所在房间 &&
			                        怪物所在房间.类型 === "黑暗房间") && 游戏状态 !== '地图编辑器') ||
			                是否在光源范围内(怪物实例.x, 怪物实例.y)
			            ) && 
			            !(地牢生成方式 === 'cave' && !已揭示洞穴格子.has(`${怪物实例.x},${怪物实例.y}`) && 游戏状态 !== '地图编辑器' && !玩家属性.透视)
			        ) {
			            let 怪物屏幕X, 怪物屏幕Y, 怪物图标大小;
			            if (怪物实例 instanceof 巨人怪物) {
			                怪物屏幕X = (绘制逻辑X - 当前相机X + 1) * 单元格大小;
			                怪物屏幕Y = (绘制逻辑Y - 当前相机Y + 1) * 单元格大小;
			                怪物图标大小 = 单元格大小 * 1.8;
			            } else {
			                怪物屏幕X = (绘制逻辑X - 当前相机X + 0.5) * 单元格大小;
			                怪物屏幕Y = (绘制逻辑Y - 当前相机Y + 0.5) * 单元格大小;
			                怪物图标大小 = 单元格大小 * 0.8;
			            }
			
			            ctx.font = `${怪物图标大小}px color-emoji`;
			            ctx.textAlign = "center";
			            ctx.textBaseline = "middle";
			
			            if (怪物实例.受击动画 && !(怪物实例 instanceof 蜈蚣部位)) {
			                ctx.fillStyle = "#FF0000";
			            } else {
			                ctx.fillStyle = 怪物实例.颜色 || "#FFFFFF";
			            }
			
			            if (怪物实例 instanceof 巡逻怪物) {
			                ctx.save();
			                ctx.translate(怪物屏幕X, 怪物屏幕Y);
			                const dir = 怪物实例.巡逻方向;
			                if (dir === 'S') {
			                    ctx.rotate(-Math.PI / 2);
			                } else if (dir === 'N') {
			                    ctx.rotate(Math.PI / 2);
			                } else if (dir === 'E') {
			                    ctx.scale(-1, 1);
			                }
			                ctx.fillText(怪物实例.图标, 0, 0);
			                ctx.restore();
			            } else if (怪物实例 instanceof 蜈蚣怪物) {
                ctx.save();
                ctx.translate(怪物屏幕X, 怪物屏幕Y);
                switch (怪物实例.朝向) {
                    case 'E': ctx.scale(-1, 1); break;
                    case 'N': ctx.rotate(Math.PI / 2); break;
                    case 'S': ctx.rotate(-Math.PI / 2); break;
                    case 'W': 
                    default:
                        break;
                }
                ctx.fillText(怪物实例.图标, 0, 0);
                ctx.restore();
            } else {
			                ctx.fillText(怪物实例.图标, 怪物屏幕X, 怪物屏幕Y);
			            }
			            怪物实例.绘制增益效果(怪物屏幕X, 怪物屏幕Y);
			
			            const 怪物当前状态 = 怪物状态表.get(怪物实例);
			            if (怪物当前状态) {
			                ctx.fillStyle = 怪物当前状态.颜色 || "#FFFFFF";
			                ctx.font = `${单元格大小 * 0.5}px Arial`;
			                const 状态图标X = 怪物屏幕X + 单元格大小 * 0.3;
			                const 状态图标Y = 怪物屏幕Y - 单元格大小 * 0.3;
			                ctx.fillText(
			                    怪物当前状态.图标 || "?",
			                    状态图标X,
			                    状态图标Y
			                );
			            } else if (怪物实例.强化 && 怪物实例.类型 != "伪装怪物") {
			                ctx.fillStyle = "#FF0000";
			                ctx.font = `${单元格大小 * 0.5}px Arial`;
			                const 强化标记X = 怪物屏幕X + 单元格大小 * 0.3;
			                const 强化标记Y = 怪物屏幕Y - 单元格大小 * 0.3;
			                ctx.fillText("强", 强化标记X, 强化标记Y);
			            }
			            if(游戏状态 !== '地图编辑器') 怪物实例.绘制血条();
			        }
			    });
				当前出战宠物列表.forEach(pet => {
					const 宠物所在房间ID = 房间地图[pet?.y]?.[pet?.x];
			        const 宠物所在房间 =
			            宠物所在房间ID !== -1 ? 房间列表[宠物所在房间ID] : null;
    if (pet && pet.是否已放置  && pet.层数==当前层数 && (
        !(玩家状态.some(s => s.类型 === '失明') || 当前天气效果.includes("深夜") ||
            (宠物所在房间 &&
                宠物所在房间.类型 === "黑暗房间") && 游戏状态 !== '地图编辑器') ||
        是否在光源范围内(pet.x, pet.y)
    ) && !(地牢生成方式 === 'cave' && !已揭示洞穴格子.has(`${pet.x},${pet.y}`) && 游戏状态 !== '地图编辑器' && !玩家属性.透视)) {
        const 动画状态 = 怪物动画状态.get(pet);
			        let 绘制逻辑X = pet.x;
			        let 绘制逻辑Y = pet.y;
			        const 正在动画 = 动画状态?.正在动画;
			
			        if (正在动画) {
			            绘制逻辑X = 动画状态.视觉X !== undefined ? 动画状态.视觉X : pet.x;
			            绘制逻辑Y = 动画状态.视觉Y !== undefined ? 动画状态.视觉Y : pet.y;
			        }
			        
			        const 宠物屏幕X = (绘制逻辑X - 当前相机X + 0.5) * 单元格大小;
			        const 宠物屏幕Y = (绘制逻辑Y - 当前相机Y + 0.5) * 单元格大小;
			
			        ctx.font = `${单元格大小 * 0.8}px color-emoji`;
			        ctx.textAlign = "center";
			        ctx.textBaseline = "middle";
			        ctx.fillStyle = pet.颜色表[pet.颜色索引] || '#FFFFFF';
			        ctx.shadowColor = pet.颜色表[pet.颜色索引] || '#FFFFFF';
			        ctx.shadowBlur = 10;
			        ctx.fillText(pet.图标, 宠物屏幕X, 宠物屏幕Y);
			        ctx.shadowBlur = 0;
			
			        const 血条高度 = 4;
			        const 血条Y = (绘制逻辑Y - 当前相机Y) * 单元格大小 - 6;
			        const 宽度 = 单元格大小;
			        const 血条X = (绘制逻辑X - 当前相机X) * 单元格大小;
			        
			        const 血量百分比 = Math.max(0, (pet.自定义数据.get("当前生命值") / pet.自定义数据.get("最大生命值")) * 100);
			        ctx.fillStyle = '#444';
			        ctx.fillRect(血条X, 血条Y, 宽度, 血条高度);
			        ctx.fillStyle = '#33cc33';
			        ctx.fillRect(血条X, 血条Y, 宽度 * (血量百分比 / 100), 血条高度);
    }
});
			    
			    if(编辑器状态.正在划区 || (编辑器状态.正在复制选区 && 编辑器状态.当前选中?.名称 === '复制工具')) {
			        ctx.save();
			        ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';
			        ctx.strokeStyle = '#0096FF';
			        ctx.lineWidth = 2;
			        const 起点 = 编辑器状态.正在划区 ? 编辑器状态.划区起点 : 编辑器状态.复制起点;
			        const startScreenX = (起点.x - 当前相机X) * 单元格大小;
			        const startScreenY = (起点.y - 当前相机Y) * 单元格大小;
			        const currentScreenX = (玩家.x - 当前相机X) * 单元格大小;
			        const currentScreenY = (玩家.y - 当前相机Y) * 单元格大小;
			        const rectX = Math.min(startScreenX, currentScreenX);
			        const rectY = Math.min(startScreenY, currentScreenY);
			        const rectW = Math.abs(startScreenX - currentScreenX) + 单元格大小;
			        const rectH = Math.abs(startScreenY - currentScreenY) + 单元格大小;
			        ctx.fillRect(rectX, rectY, rectW, rectH);
			        ctx.strokeRect(rectX, rectY, rectW, rectH);
			        ctx.restore();
			    } else if (编辑器剪贴板 && 编辑器状态.当前选中?.名称 === '复制工具') {
			        ctx.save();
			        ctx.globalAlpha = 0.6;
			        const { 宽度, 高度, 数据, 只包含实体 } = 编辑器剪贴板;
			        for (const 条目 of 数据) {
			            const 目标X = 玩家.x + 条目.相对X;
			            const 目标Y = 玩家.y + 条目.相对Y;
			            const screenX = (目标X - 当前相机X) * 单元格大小;
			            const screenY = (目标Y - 当前相机Y) * 单元格大小;
			
			            if (只包含实体) {
			                ctx.fillStyle = 'rgba(200, 200, 255, 0.4)';
			                ctx.fillRect(screenX, screenY, 单元格大小, 单元格大小);
			            } else {
			                const tempCell = 克隆单元格(条目.单元格克隆);
			                tempCell.x = 目标X;
			                tempCell.y = 目标Y;
			                tempCell.绘制();
			            }
			        }
			        ctx.restore();
			    }
			    if (游戏状态 === '地图编辑器' && 编辑器状态.模式 === '设置起点') {
			        ctx.save();
			        ctx.fillStyle = 'rgba(76, 175, 80, 0.5)';
			        const 屏幕X = (玩家初始位置.x - 当前相机X) * 单元格大小;
			        const 屏幕Y = (玩家初始位置.y - 当前相机Y) * 单元格大小;
			        ctx.fillRect(屏幕X, 屏幕Y, 单元格大小, 单元格大小);
			        ctx.restore();
			    }
			    const 玩家动画 = 玩家动画状态;
			let 玩家绘制X = 玩家.x;
			let 玩家绘制Y = 玩家.y;
			
			if (玩家动画.正在动画) {
			    玩家绘制X = 玩家动画.视觉X;
			    玩家绘制Y = 玩家动画.视觉Y;
			}
			
			const 玩家屏幕X = (玩家绘制X - 当前相机X + 0.5) * 单元格大小;
			const 玩家屏幕Y = (玩家绘制Y - 当前相机Y + 0.5) * 单元格大小;
			
			if (moveQueue.length > 0) {
			    drawPath(moveQueue);
			}
			
			const hexArray_ = [];
			if (玩家状态.length > 0) {
			    玩家状态.forEach((item) => {
			        hexArray_.push(item.颜色);
			    });
			    ctx.fillStyle = blendColors(hexArray_);
			} else {
			    ctx.fillStyle = "#ff4444";
			}
			ctx.beginPath();
			ctx.arc(玩家屏幕X, 玩家屏幕Y, 单元格大小 / 3, 0, Math.PI * 2);
			
			ctx.fill();
			ctx.stroke();
			}

function 绘制小地图() {
			    if (地牢.length !== 地牢大小) return;
			    const 小地图 = document.getElementById("小地图");
			    if (
			        (当前天气效果.includes("诡魅") ||
			        当前天气效果.includes("深夜")) &&
			        游戏状态!=="地图编辑器"
			    ) {
			        小地图Ctx.fillStyle = "#000000";
			        小地图Ctx.fillRect(0, 0, 小地图.width, 小地图.height);
			
			        小地图Ctx.fillStyle = "#555";
			        小地图Ctx.font = "20px Arial";
			        小地图Ctx.textAlign = "center";
			        小地图Ctx.textBaseline = "middle";
			        小地图Ctx.fillText(
			            "地图受到干扰",
			            小地图.width / 2,
			            小地图.height / 2
			        );
			        return;
			    }
			    
			    const 缩放比例 = 3;
			    小地图Ctx.fillStyle = "#1a1a1a";
			    小地图Ctx.fillRect(0, 0, 小地图.width, 小地图.height);
			    if (地牢.length > 0) {
			        for (let y = 0; y < 地牢大小; y++) {
			            for (let x = 0; x < 地牢大小; x++) {
			                const 物品 = 地牢[y]?.[x]?.关联物品;
			                if (地牢生成方式 === 'cave' && !已揭示洞穴格子.has(`${x},${y}`) && 游戏状态 !== '地图编辑器') continue;
			                if (
			                    物品 &&
			                    (物品 instanceof 护卫植物 ||
			                        物品 instanceof 远射植物) &&
			                    已访问房间.has(房间地图[y][x])
			                ) {
			                    小地图Ctx.fillStyle = "#228B22";
			                    小地图Ctx.beginPath();
			                    小地图Ctx.arc(
			                        x * 缩放比例 + 缩放比例 / 2,
			                        y * 缩放比例 + 缩放比例 / 2,
			                        缩放比例 * 0.7,
			                        0,
			                        Math.PI * 2
			                    );
			                    小地图Ctx.fill();
			                }
			                if (物品 && 物品 instanceof 旗帜) {
			                    小地图Ctx.fillStyle = "#FFD700";
			                    小地图Ctx.font = `${缩放比例 * 4}px color-emoji`;
			                    小地图Ctx.textAlign = "center";
			                    小地图Ctx.textBaseline = "middle";
			                    小地图Ctx.fillText(物品.图标, x * 缩放比例 + 缩放比例 / 2, y * 缩放比例 + 缩放比例 / 2);
			                }
			                if (地牢[y][x]?.背景类型 === 单元格类型.走廊) {
			                    小地图Ctx.strokeStyle = "#666666";
			                    小地图Ctx.strokeRect(
			                        x * 缩放比例,
			                        y * 缩放比例,
			                        缩放比例,
			                        缩放比例
			                    );
			                }
			            }
			        }
			    }
			
			    房间列表.forEach((房间) => {
			        if (!房间) return;
			        const 已访问 = 已访问房间.has(房间.id);
			        const 是上锁房间 = 上锁房间列表.some(
			            (r) => r.id === 房间.id
			        );
			
			        if (是上锁房间) {
			            const 颜色索引 = 上锁房间列表.find(
			                (r) => r.id === 房间.id
			            ).颜色索引;
			            小地图Ctx.strokeStyle = 颜色表[颜色索引] || "#FFD700";
			        } else {
			            小地图Ctx.strokeStyle = 已访问 ? "#4caf50" : "#666666";
			        }
			
			        小地图Ctx.strokeRect(
			            房间.x * 缩放比例,
			            房间.y * 缩放比例,
			            房间.w * 缩放比例,
			            房间.h * 缩放比例
			        );
			
			        if (已访问) {
			            小地图Ctx.fillStyle = "#4caf5022";
			            小地图Ctx.fillRect(
			                房间.x * 缩放比例,
			                房间.y * 缩放比例,
			                房间.w * 缩放比例,
			                房间.h * 缩放比例
			            );
			        }
			    });
			    传送点列表.forEach((点) => {
			        if (点.层数 === 当前层数) {
			            const 传送点X = 点.x * 缩放比例 + 缩放比例 / 2;
			            const 传送点Y = 点.y * 缩放比例 + 缩放比例 / 2;
			            const 半径 = 缩放比例 * 0.8;
			
			            小地图Ctx.shadowColor = "#FF00FF";
			            小地图Ctx.shadowBlur = 8;
			
			            小地图Ctx.fillStyle = "#FF00FF";
			            小地图Ctx.beginPath();
			            小地图Ctx.arc(传送点X, 传送点Y, 半径, 0, Math.PI * 2);
			            小地图Ctx.fill();
			
			            小地图Ctx.shadowBlur = 0;
			            小地图Ctx.fillStyle = "#FFFFFF";
			            小地图Ctx.beginPath();
			            小地图Ctx.arc(
			                传送点X,
			                传送点Y,
			                半径 * 0.3,
			                0,
			                Math.PI * 2
			            );
			            小地图Ctx.fill();
			        }
			    });
			
			    if (上次死亡地点 && 上次死亡地点.层数 === 当前层数) {
			        const 死亡X = 上次死亡地点.x * 缩放比例;
			        const 死亡Y = 上次死亡地点.y * 缩放比例;
			        const 标记尺寸 = 缩放比例 * 2.5;
			
			        小地图Ctx.shadowColor = "rgba(255, 0, 0, 0.8)";
			        小地图Ctx.shadowBlur = 10;
			
			        小地图Ctx.fillStyle = "rgba(200, 0, 0, 0.8)";
			        小地图Ctx.beginPath();
			        小地图Ctx.arc(
			            死亡X + 缩放比例 / 2,
			            死亡Y + 缩放比例 / 2,
			            标记尺寸 * 0.5,
			            0,
			            Math.PI * 2
			        );
			        小地图Ctx.fill();
			
			        小地图Ctx.shadowBlur = 0;
			
			        小地图Ctx.font = `${标记尺寸 * 0.8}px color-emoji`;
			        小地图Ctx.textAlign = "center";
			        小地图Ctx.textBaseline = "middle";
			        小地图Ctx.fillStyle = "#FFFFFF";
			        小地图Ctx.fillText(
			            图标映射.死亡图标,
			            死亡X + 缩放比例 / 2,
			            死亡Y + 缩放比例 / 2 + 标记尺寸 * 0.05
			        );
			    }
			
			    小地图Ctx.shadowColor = "transparent";
			    小地图Ctx.shadowBlur = 0;
			
			    小地图Ctx.fillStyle = "#ff0000";
			    小地图Ctx.beginPath();
			    小地图Ctx.arc(
			        玩家.x * 缩放比例,
			        玩家.y * 缩放比例,
			        Math.max(3, 缩放比例 / 2),
			        0,
			        Math.PI * 2
			    );
			    小地图Ctx.fill();
			    小地图Ctx.strokeStyle = "#ffffff";
			    小地图Ctx.lineWidth = 2;
			    小地图Ctx.stroke();
			    当前出战宠物列表.forEach(pet => {
    if (pet && pet.是否已放置  && pet.层数==当前层数 ) {
        const 宠物X = pet.x * 缩放比例;
        const 宠物Y = pet.y * 缩放比例;
        const 宠物图标半径 = Math.max(2, 缩放比例 / 2.5);

        小地图Ctx.fillStyle = "#2196F3";
        小地图Ctx.beginPath();
        小地图Ctx.arc(
            宠物X,
            宠物Y,
            宠物图标半径,
            0,
            Math.PI * 2
        );
        小地图Ctx.fill();
        小地图Ctx.strokeStyle = "#FFFFFF";
        小地图Ctx.lineWidth = 1;
        小地图Ctx.stroke();
    }
});
const markers = 地图标记.get(当前层数) || [];
			    markers.forEach(marker => {
			        小地图Ctx.fillStyle = "#FFD700";
			        小地图Ctx.font = `${缩放比例 * 3}px color-emoji`;
			        小地图Ctx.textAlign = "center";
			        小地图Ctx.textBaseline = "middle";
			        小地图Ctx.fillText(marker.icon, marker.x * 缩放比例 + 缩放比例, marker.y * 缩放比例 + 缩放比例);
			    });
			
			    小地图Ctx.shadowColor = "transparent";
			    小地图Ctx.shadowBlur = 0;
			
			    小地图Ctx.fillStyle = "#ff0000";
			    小地图Ctx.beginPath();
			    小地图Ctx.arc(
			        玩家.x * 缩放比例,
			        玩家.y * 缩放比例,
			        Math.max(3, 缩放比例 / 2),
			        0,
			        Math.PI * 2
			    );
			    小地图Ctx.fill();
			    小地图Ctx.strokeStyle = "#ffffff";
			    小地图Ctx.lineWidth = 2;
			    小地图Ctx.stroke();
			    当前出战宠物列表.forEach(pet => {
    if (pet && pet.是否已放置 && pet.层数==当前层数 ) {
        const 宠物X = pet.x * 缩放比例;
        const 宠物Y = pet.y * 缩放比例;
        const 宠物图标半径 = Math.max(2, 缩放比例 / 2.5);

        小地图Ctx.fillStyle = "#2196F3";
        小地图Ctx.beginPath();
        小地图Ctx.arc(
            宠物X,
            宠物Y,
            宠物图标半径,
            0,
            Math.PI * 2
        );
        小地图Ctx.fill();
        小地图Ctx.strokeStyle = "#FFFFFF";
        小地图Ctx.lineWidth = 1;
        小地图Ctx.stroke();
    }
});
			
			    const 视野半径 = Math.floor(相机显示边长 / 2);
			    const 视野框X = (玩家.x - 视野半径) * 缩放比例;
			    const 视野框Y = (玩家.y - 视野半径) * 缩放比例;
			    const 视野框尺寸 = 相机显示边长 * 缩放比例;
			
			    小地图Ctx.strokeStyle = "#ffd700";
			    小地图Ctx.lineWidth = 1;
			    小地图Ctx.strokeRect(视野框X, 视野框Y, 视野框尺寸, 视野框尺寸);
			}

