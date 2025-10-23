			
			let touchStartX = 0;
			let touchStartY = 0;
			let touchCurrentX = 0;
			let touchCurrentY = 0;
			let touchStartTime = 0;
			let isSwiping = false;
			let swipeMoveInterval = null;
			const swipeThreshold = 15; // 移动超过才识别为滑动
			const tapTimeThreshold = 75; // 毫秒内的触摸视为点击
			let 地图标记 = new Map();
			let 大地图状态 = {
    可见: false,
    缩放等级: 1.0,
    最小缩放: 0.2,
    最大缩放: 5.0,
    平移X: 0,
    平移Y: 0,
    拖拽中: false,
    拖拽起始X: 0,
    拖拽起始Y: 0,
    上次平移X: 0,
    上次平移Y: 0,
    动画帧ID: null,
    悬停信息: null,
    当前查看楼层: 0,
    标记模式: false,
    传送模式: false,
};

const 大地图画布 = document.getElementById('大地图画布');
const 大地图画布容器 = document.getElementById('大地图画布容器');
const 大地图遮罩 = document.getElementById('大地图遮罩');
const 大地图信息 = document.getElementById('大地图信息');

document.getElementById('小地图容器').addEventListener('click', 打开大地图);
document.getElementById('关闭大地图按钮').addEventListener('click', 关闭大地图);
document.getElementById('大地图缩放放大按钮').addEventListener('click', () => 调整大地图缩放(1.2));
document.getElementById('大地图缩放缩小按钮').addEventListener('click', () => 调整大地图缩放(1 / 1.2));
document.getElementById('大地图居中按钮').addEventListener('click', () => 居中大地图(true));
document.getElementById('大地图上一层按钮').addEventListener('click', () => 切换大地图楼层(-1));
document.getElementById('大地图下一层按钮').addEventListener('click', () => 切换大地图楼层(1));
document.getElementById('大地图标记模式按钮').addEventListener('click', 切换大地图标记模式);
document.getElementById('大地图传送按钮').addEventListener('click', 切换大地图传送模式);

function 打开大地图() {
    if (大地图状态.可见) return;
    if ((是否是自定义关卡 || 游戏状态 === '编辑器游玩') && 自定义全局设置.禁用大地图 && !开发者模式) {
显示通知("此关卡禁用了大地图。", "警告");
return;
}
if (
			        (当前天气效果.includes("诡魅") ||
			        当前天气效果.includes("深夜")) &&
			        游戏状态!=="地图编辑器"
			    ) {
			    return;
			    }
    大地图状态.可见 = true;
    大地图状态.当前查看楼层 = 当前层数;
    大地图状态.标记模式 = false;
    document.getElementById('大地图标记模式按钮').classList.remove('active');
    玩家属性.允许移动++;
    const 传送按钮 = document.getElementById('大地图传送按钮');
    if (开发者模式) {
传送按钮.style.display = 'block';
传送按钮.classList.remove('active');
传送按钮.style.borderColor = '';
} else {
传送按钮.style.display = 'none';
}

    大地图遮罩.style.display = 'flex';
    requestAnimationFrame(() => {
        大地图遮罩.classList.add('显示');
    });

    居中大地图(false);
    添加大地图事件监听();
    大地图状态.动画帧ID = requestAnimationFrame(绘制大地图循环);
    更新大地图楼层显示();
}

function 切换大地图标记模式() {
大地图状态.标记模式 = !大地图状态.标记模式;
const 按钮 = document.getElementById('大地图标记模式按钮');
const 传送按钮 = document.getElementById('大地图传送按钮');
if (大地图状态.标记模式) {
    大地图状态.传送模式 = false;
    传送按钮.classList.remove('active');
    传送按钮.style.borderColor = '';

    按钮.classList.add('active');
    按钮.style.borderColor = '#2196f3';
    大地图画布容器.style.cursor = 'crosshair';
    显示通知("标记模式已开启", "信息");
} else {
    按钮.classList.remove('active');
    按钮.style.borderColor = '';
    大地图画布容器.style.cursor = 'grab';
    显示通知("标记模式已关闭", "信息");
}

}
function 切换大地图传送模式() {
大地图状态.传送模式 = !大地图状态.传送模式;
const 按钮 = document.getElementById('大地图传送按钮');
const 标记按钮 = document.getElementById('大地图标记模式按钮');
if (大地图状态.传送模式) {
    大地图状态.标记模式 = false;
    标记按钮.classList.remove('active');
    标记按钮.style.borderColor = '';

    按钮.classList.add('active');
    按钮.style.borderColor = '#f44336';
    大地图画布容器.style.cursor = 'crosshair';
    显示通知("传送模式已开启", "信息");
} else {
    按钮.classList.remove('active');
    按钮.style.borderColor = '';
    大地图画布容器.style.cursor = 'grab';
    显示通知("传送模式已关闭", "信息");
}

}
function 切换大地图楼层(方向) {
    const 查看楼层 = 大地图状态.当前查看楼层 + 方向;
    if (查看楼层 === 当前层数 || 所有地牢层.has(查看楼层)) {
        大地图状态.当前查看楼层 = 查看楼层;
        居中大地图(false);
        更新大地图楼层显示();
    } else {
        显示通知(`无法查看第 ${查看楼层} 层的地图。`, "警告");
    }
}

function 更新大地图楼层显示() {
    const 标题 = document.getElementById('大地图楼层标题');
    if (标题) {
        标题.textContent = `地牢地图 - 第 ${大地图状态.当前查看楼层} 层`;
    }
    document.getElementById('大地图上一层按钮').disabled = !所有地牢层.has(大地图状态.当前查看楼层 - 1) && (大地图状态.当前查看楼层 - 1) !== 当前层数;
    document.getElementById('大地图下一层按钮').disabled = !所有地牢层.has(大地图状态.当前查看楼层 + 1) && (大地图状态.当前查看楼层 + 1) !== 当前层数;
}

function 绘制大地图() {
    const ctx = 大地图画布.getContext('2d');
    const 容器宽度 = 大地图画布容器.clientWidth;
    const 容器高度 = 大地图画布容器.clientHeight;

    大地图画布.width = 容器宽度 * window.devicePixelRatio;
    大地图画布.height = 容器高度 * window.devicePixelRatio;
    大地图画布.style.width = `${容器宽度}px`;
    大地图画布.style.height = `${容器高度}px`;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--canvas-bg').trim();
    ctx.fillRect(0, 0, 容器宽度, 容器高度);

    ctx.save();
    ctx.translate(大地图状态.平移X, 大地图状态.平移Y);
    ctx.scale(大地图状态.缩放等级, 大地图状态.缩放等级);

    const floorData = 大地图状态.当前查看楼层 === 当前层数
        ? { 地牢, 房间列表, 所有怪物, 玩家位置: 玩家, 已访问房间,地牢生成方式,已揭示洞穴格子 }
        : 所有地牢层.get(大地图状态.当前查看楼层);

    if (!floorData) {
        ctx.restore();
        return;
    }

    const 单元格尺寸 = 16;
    const 玩家定位器地图 = Array.from(玩家装备.values()).find(item => item instanceof 定位器地图);
    const 墙壁线宽 = 2 / 大地图状态.缩放等级;

    let localDungeon = floorData.地牢;
    let 下楼房间 = null
    if (!localDungeon) localDungeon = floorData.地牢数组;
    
    for (let y = 0; y < localDungeon.length; y++) {
        for (let x = 0; x < localDungeon[y].length; x++) {
            const 单元格 = localDungeon[y][x];
            if (!单元格) continue;
            if(floorData.地牢生成方式 === 'cave' && (!floorData.已揭示洞穴格子.has(`${x},${y}`)&&!(玩家定位器地图&&单元格.类型==单元格类型.楼梯下楼)) && 游戏状态!=="地图编辑器") continue;

            let 颜色 = '#000';
            if (单元格.背景类型 === 单元格类型.房间) 颜色 = "#3a506b";
            else if (单元格.背景类型 === 单元格类型.走廊) 颜色 = "#2b2d42";
            else if (单元格.背景类型 === 单元格类型.门) 颜色 = "#8b4513";
            else if (单元格.背景类型 === 单元格类型.上锁的门) 颜色 = 颜色表[单元格.颜色索引];

            ctx.fillStyle = 颜色;
            ctx.fillRect(x * 单元格尺寸, y * 单元格尺寸, 单元格尺寸, 单元格尺寸);
            if (单元格.isOneWay && 单元格.oneWayAllowedDirection && [单元格类型.门, 单元格类型.上锁的门].includes(单元格.背景类型)) {
                            ctx.save();
			                ctx.font = `${单元格尺寸 * 0.7}px Arial`;
			                ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
			                ctx.textAlign = "center";
			                ctx.textBaseline = "middle";
			                let arrow = "";
			
			                if (单元格.oneWayAllowedDirection === "N") arrow = "↑";
			                else if (单元格.oneWayAllowedDirection === "S") arrow = "↓";
			                else if (单元格.oneWayAllowedDirection === "E") arrow = "→";
			                else if (单元格.oneWayAllowedDirection === "W") arrow = "←";
			
			                const arrowX = x*单元格尺寸 + 单元格尺寸 / 2;
			                const arrowY = y*单元格尺寸 + 单元格尺寸 / 2;
			
			                ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
			                ctx.shadowBlur = 3;
			                ctx.shadowOffsetX = 1;
			                ctx.shadowOffsetY = 1;
			                ctx.fillText(arrow, arrowX, arrowY);
                            ctx.restore();
			            }
            

            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 墙壁线宽;
            ctx.beginPath();
            if (单元格.墙壁.上) { ctx.moveTo(x * 单元格尺寸, y * 单元格尺寸); ctx.lineTo((x + 1) * 单元格尺寸, y * 单元格尺寸); }
            if (单元格.墙壁.右) { ctx.moveTo((x + 1) * 单元格尺寸, y * 单元格尺寸); ctx.lineTo((x + 1) * 单元格尺寸, (y + 1) * 单元格尺寸); }
            if (单元格.墙壁.下) { ctx.moveTo((x + 1) * 单元格尺寸, (y + 1) * 单元格尺寸); ctx.lineTo(x * 单元格尺寸, (y + 1) * 单元格尺寸); }
            if (单元格.墙壁.左) { ctx.moveTo(x * 单元格尺寸, (y + 1) * 单元格尺寸); ctx.lineTo(x * 单元格尺寸, y * 单元格尺寸); }
            ctx.stroke();
            const item = 单元格.关联物品;
            let shouldDraw = false;

            
        
            if (单元格.关联物品 && !单元格.关联物品.是否为隐藏物品) {
                if (item.类型 === '楼梯') {
                if (单元格.类型 === 单元格类型.楼梯上楼) {
                    shouldDraw = true;
                } else if (单元格.类型 === 单元格类型.楼梯下楼) {
                    shouldDraw = true;
                    if (玩家定位器地图){
                    if (房间地图[y][x]>0) 下楼房间=房间地图[y][x]
                    floorData?.已揭示洞穴格子?.add(`${x},${y}`);
                    }
                    
                }
                if (shouldDraw) {
                ctx.fillStyle ='#fff'
                ctx.font = `${单元格尺寸 * 0.8}px color-emoji`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(item.图标, (x + 0.5) * 单元格尺寸, (y + 0.5) * 单元格尺寸);
                
            }
            continue;
            }

            
                 ctx.fillStyle = 单元格.关联物品.颜色表[单元格.关联物品.颜色索引];
                 ctx.font = `${单元格尺寸 * 0.8}px color-emoji`;
                 ctx.textAlign = "center";
                 ctx.textBaseline = "middle";
                 ctx.fillText(单元格.关联物品.图标, (x + 0.5) * 单元格尺寸, (y + 0.5) * 单元格尺寸);
            }
        }
    }
    
    if (floorData.所有怪物) {
        floorData.所有怪物.forEach(怪物 => {
            const 房间ID = 房间地图[怪物.y][怪物.x];
            if(floorData.地牢生成方式 === 'cave' && !floorData.已揭示洞穴格子.has(`${怪物.x},${怪物.y}`)&& 游戏状态!=="地图编辑器") return;
            if (怪物.强化) {
                ctx.fillStyle = '#f00';
                ctx.font = `${单元格尺寸 * 0.8}px color-emoji`;
                if (怪物 instanceof 巨人怪物) ctx.fillStyle = ctx.font = `${单元格尺寸 * 1.8}px color-emoji`;
            } else {
                ctx.fillStyle = '#fff';
                ctx.font = `${单元格尺寸 * 0.8}px color-emoji`;
                if (怪物 instanceof 巨人怪物) ctx.font = `${单元格尺寸 * 1.8}px color-emoji`;
            }
            
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            if (怪物 instanceof 巨人怪物) {
                ctx.fillText(怪物.图标, (怪物.x + 1) * 单元格尺寸, (怪物.y + 1) * 单元格尺寸);
                return;
            }
            ctx.fillText(怪物.图标, (怪物.x + 0.5) * 单元格尺寸, (怪物.y + 0.5) * 单元格尺寸);
        });
    }


if (当前出战宠物列表 && 当前出战宠物列表.length) {
当前出战宠物列表.forEach(pet => {
if (!pet || !pet.是否已放置) return;

 if (pet.层数!==大地图状态.当前查看楼层) return
const sx = pet.x * 单元格尺寸 + 单元格尺寸 / 2;
const sy = pet.y * 单元格尺寸 + 单元格尺寸 / 2;
ctx.font = `${Math.max(10, Math.floor(单元格尺寸 * 0.9))}px system-ui`;
ctx.textAlign = "center";
ctx.textBaseline = "middle";
const 图标 = pet.图标 || 图标映射.宠物 || "🐾";
ctx.fillStyle =  pet.颜色表[pet.颜色索引]||"#ffffff";
ctx.fillText(图标, sx, sy);
});
}
房间列表.forEach(房间 => {
const 已访问 = floorData?.已访问房间?.has(房间.id);
if  ((已访问 && 房间.id!==下楼房间)||开发者模式||游戏状态==="地图编辑器") return;
const rx = 房间.x * 单元格尺寸;
const ry = 房间.y * 单元格尺寸;

ctx.fillStyle ="#000f";
ctx.fillRect(rx, ry, 房间.w * 单元格尺寸, 房间.h * 单元格尺寸);

});
    const 玩家位置 = floorData.玩家位置;
    if (玩家位置) {
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.arc((玩家位置.x + 0.5) * 单元格尺寸, (玩家位置.y + 0.5) * 单元格尺寸, 单元格尺寸 * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2 / 大地图状态.缩放等级;
        ctx.stroke();
    }

    const markers = 地图标记.get(大地图状态.当前查看楼层) || [];
    markers.forEach(marker => {
        ctx.font = `${单元格尺寸*1.5}px color-emoji`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(marker.icon, (marker.x + 1) * 单元格尺寸, (marker.y + 1) * 单元格尺寸);
    });

    ctx.restore();
    
    if (大地图状态.悬停信息) {
        大地图信息.textContent = 大地图状态.悬停信息;
        大地图信息.style.display = 'block';
    } else {
        大地图信息.style.display = 'none';
    }
}

function 大地图拖拽开始(事件) {
    事件.preventDefault();
    const rect = 大地图画布容器.getBoundingClientRect();
        const x = (事件.clientX || 事件.touches[0].clientX) - rect.left;
        const y = (事件.clientY || 事件.touches[0].clientY) - rect.top;

        const 世界X = Math.floor((x - 大地图状态.平移X) / (16 * 大地图状态.缩放等级));
        const 世界Y = Math.floor((y - 大地图状态.平移Y) / (16 * 大地图状态.缩放等级));
    if (大地图状态.标记模式) {
        

        const markers = 地图标记.get(大地图状态.当前查看楼层) || [];
        const existingIndex = markers.findIndex(m => m.x === 世界X && m.y === 世界Y);

        if (existingIndex > -1) {
            markers.splice(existingIndex, 1);
        } else {
            const icon = prompt("输入标记图标 (例如: ❓, 💀, 💰):", "⭐");
            if (icon) {
                markers.push({ x: 世界X, y: 世界Y, icon: icon });
            }
        }
        地图标记.set(大地图状态.当前查看楼层, markers);
        切换大地图标记模式()
        绘制小地图();
        return;
    }
    if (大地图状态.传送模式) {
    if (大地图状态.当前查看楼层 === 当前层数) {
        if (位置是否可用(世界X, 世界Y, false)) {
            玩家.x = 世界X;
            玩家.y = 世界Y;
            更新视口(true);
            处理玩家着陆效果(世界X, 世界Y, 世界X, 世界Y);
            if (生存挑战激活) {
			        显示通知("强大的结界阻止了传送！", "错误");
			        关闭大地图();
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
            显示通知(`已传送到 (${世界X}, ${世界Y})`, "成功");
            关闭大地图();
        } else {
            显示通知("无法传送到该位置！", "错误");
            切换大地图传送模式()
        }
    } else {
        显示通知("只能在当前楼层进行传送！", "错误");
    }
    return;
}
    大地图状态.拖拽中 = true;
    大地图状态.拖拽起始X = (事件.clientX || 事件.touches[0].clientX);
    大地图状态.拖拽起始Y = (事件.clientY || 事件.touches[0].clientY);
    大地图状态.上次平移X = 大地图状态.平移X;
    大地图状态.上次平移Y = 大地图状态.平移Y;
    大地图画布容器.style.cursor = 'grabbing';
}


function 关闭大地图() {
    if (!大地图状态.可见) return;
    大地图状态.可见 = false;
    玩家属性.允许移动 = Math.max(0, 玩家属性.允许移动 - 1);

    大地图遮罩.classList.remove('显示');
    setTimeout(() => {
        let 按钮 = document.getElementById('大地图标记模式按钮');
        大地图遮罩.style.display = 'none';
        大地图状态.标记模式 =false
        按钮.classList.remove('active');
        按钮.style.borderColor = '';
        按钮 = document.getElementById('大地图传送按钮');
        按钮.classList.remove('active');
    按钮.style.borderColor = '';
    大地图状态.传送模式 =false
    }, 400);

    移除大地图事件监听();
    if (大地图状态.动画帧ID) {
        cancelAnimationFrame(大地图状态.动画帧ID);
        大地图状态.动画帧ID = null;
    }
}

function 绘制大地图循环() {
    if (!大地图状态.可见) return;
    绘制大地图();
    大地图状态.动画帧ID = requestAnimationFrame(绘制大地图循环);
}


function 居中大地图(带动画) {
     if(大地图状态.当前查看楼层 != 当前层数) return;
    const 容器宽度 = 大地图画布容器.clientWidth;
    const 容器高度 = 大地图画布容器.clientHeight;
    const 单元格尺寸 = 16;
    
    const 目标平移X = 容器宽度 / 2 - (玩家.x + 0.5) * 单元格尺寸 * 大地图状态.缩放等级;
    const 目标平移Y = 容器高度 / 2 - (玩家.y + 0.5) * 单元格尺寸 * 大地图状态.缩放等级;

    if (带动画 && typeof gsap !== 'undefined') {
        gsap.to(大地图状态, {
            平移X: 目标平移X,
            平移Y: 目标平移Y,
            duration: 0.4,
            ease: 'power2.out'
        });
    } else {
        大地图状态.平移X = 目标平移X;
        大地图状态.平移Y = 目标平移Y;
    }
}

function 调整大地图缩放(缩放因子, 缩放中心X = null, 缩放中心Y = null) {
    const 容器 = 大地图画布容器;
    if(缩放中心X === null) 缩放中心X = 容器.clientWidth / 2;
    if(缩放中心Y === null) 缩放中心Y = 容器.clientHeight / 2;

    const 旧缩放等级 = 大地图状态.缩放等级;
    let 新缩放等级 = 旧缩放等级 * 缩放因子;
    新缩放等级 = Math.max(大地图状态.最小缩放, Math.min(大地图状态.最大缩放, 新缩放等级));
    
    const 实际缩放因子 = 新缩放等级 / 旧缩放等级;
    if (Math.abs(实际缩放因子 - 1) < 0.001) return;

    大地图状态.缩放等级 = 新缩放等级;
    
    const 鼠标世界X = (缩放中心X - 大地图状态.平移X) / 旧缩放等级;
    const 鼠标世界Y = (缩放中心Y - 大地图状态.平移Y) / 旧缩放等级;
    
    大地图状态.平移X = 缩放中心X - 鼠标世界X * 新缩放等级;
    大地图状态.平移Y = 缩放中心Y - 鼠标世界Y * 新缩放等级;
}
function 大地图拖拽移动(事件) {
    if (!大地图状态.拖拽中) return;
    事件.preventDefault();
    const 当前X = (事件.clientX || 事件.touches[0].clientX);
    const 当前Y = (事件.clientY || 事件.touches[0].clientY);
    const 偏移X = 当前X - 大地图状态.拖拽起始X;
    const 偏移Y = 当前Y - 大地图状态.拖拽起始Y;
    大地图状态.平移X = 大地图状态.上次平移X + 偏移X;
    大地图状态.平移Y = 大地图状态.上次平移Y + 偏移Y;
}

function 大地图拖拽结束(事件) {
    大地图状态.拖拽中 = false;
    大地图画布容器.style.cursor = 'grab';
}

function 大地图滚轮缩放(事件) {
    事件.preventDefault();
    const 缩放因子 = 事件.deltaY < 0 ? 1.1 : 1 / 1.1;
    const rect = 大地图画布容器.getBoundingClientRect();
    const 缩放中心X = 事件.clientX - rect.left;
    const 缩放中心Y = 事件.clientY - rect.top;
    调整大地图缩放(缩放因子, 缩放中心X, 缩放中心Y);
}

let 大地图上次触摸距离 = 0;
function 大地图触摸开始(事件) {
    if (事件.touches.length === 2) {
        事件.preventDefault();
        大地图状态.拖拽中 = false; 
        const t1 = 事件.touches[0];
        const t2 = 事件.touches[1];
        大地图上次触摸距离 = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
    } else if (事件.touches.length === 1) {
        大地图拖拽开始(事件);
    }
}

function 大地图触摸移动(事件) {
    if (事件.touches.length === 2) {
        事件.preventDefault();
        const t1 = 事件.touches[0];
        const t2 = 事件.touches[1];
        const 当前触摸距离 = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const 缩放因子 = 当前触摸距离 / 大地图上次触摸距离;
        大地图上次触摸距离 = 当前触摸距离;
        
        const rect = 大地图画布容器.getBoundingClientRect();
        const 中心X = (t1.clientX + t2.clientX) / 2 - rect.left;
        const 中心Y = (t1.clientY + t2.clientY) / 2 - rect.top;
        
        调整大地图缩放(缩放因子, 中心X, 中心Y);

    } else if (事件.touches.length === 1) {
        大地图拖拽移动(事件);
    }
}

function 大地图触摸结束(事件) {
     if (事件.touches.length < 2) {
        大地图上次触摸距离 = 0;
    }
    if (事件.touches.length < 1) {
        大地图拖拽结束(事件);
    }
}

function 大地图悬停信息(事件) {
    const rect = 大地图画布容器.getBoundingClientRect();
    const x = 事件.clientX - rect.left;
    const y = 事件.clientY - rect.top;

    const 单元格尺寸 = 16 * 大地图状态.缩放等级;
    const 世界X = Math.floor((x - 大地图状态.平移X) / (16 * 大地图状态.缩放等级));
    const 世界Y = Math.floor((y - 大地图状态.平移Y) / (16 * 大地图状态.缩放等级));

    const 房间ID = 房间地图[世界Y]?.[世界X];
    if (房间ID !== undefined && 房间ID !== -1 && (已访问房间.has(房间ID)||开发者模式||游戏状态=="地图编辑器")) {
        const room = 房间列表.find(r => r && r.id === 房间ID);
        if (room) {
            大地图状态.悬停信息 = `房间 ${room.id}: ${room.名称 || '未命名'} (${room.类型 || '普通'})`;
            return;
        }
    }
    大地图状态.悬停信息 = `(${世界X}, ${世界Y})`;
}

function 添加大地图事件监听() {
    大地图画布容器.addEventListener('mousedown', 大地图拖拽开始);
    window.addEventListener('mousemove', 大地图拖拽移动);
    window.addEventListener('mouseup', 大地图拖拽结束);
    大地图画布容器.addEventListener('wheel', 大地图滚轮缩放, { passive: false });
    
    大地图画布容器.addEventListener('touchstart', 大地图触摸开始, { passive: false });
    大地图画布容器.addEventListener('touchmove', 大地图触摸移动, { passive: false });
    大地图画布容器.addEventListener('touchend', 大地图触摸结束);
    大地图画布容器.addEventListener('mousemove', 大地图悬停信息);
}

function 移除大地图事件监听() {
    大地图画布容器.removeEventListener('mousedown', 大地图拖拽开始);
    window.removeEventListener('mousemove', 大地图拖拽移动);
    window.removeEventListener('mouseup', 大地图拖拽结束);
    大地图画布容器.removeEventListener('wheel', 大地图滚轮缩放);

    大地图画布容器.removeEventListener('touchstart', 大地图触摸开始);
    大地图画布容器.removeEventListener('touchmove', 大地图触摸移动);
    大地图画布容器.removeEventListener('touchend', 大地图触摸结束);
    大地图画布容器.removeEventListener('mousemove', 大地图悬停信息);
}
