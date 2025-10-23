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
			document.addEventListener("touchstart", (e) => {
			    if (window.innerWidth >= 769) return;
			    const isBackpackVisible = document.querySelector(".背包弹窗.显示中");
			    if (isBackpackVisible && document.getElementById('浮动提示框').style.display !== 'none') {
			        document.getElementById('浮动提示框').style.display = 'none';
			    }
			});
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
			async function startAutoMove() {
			    if (moveQueue.length === 0) return;
			    isAutoMoving = true;
			    const moveInterval = setInterval(() => {
			        if (moveQueue.length === 0) {
			            clearInterval(moveInterval);
			            return;
			        }
			        if (玩家属性.允许移动 <= 0) {
			            let targetIndex = Math.min(
			                玩家属性.移动步数 - 1,
			                moveQueue.length - 1
			            );
			            let validMove = true;
			            // 检查直线可行性
			            for (let i = 0; i <= targetIndex; i++) {
			                if (
			                    !检查直线移动可行性(
			                        玩家.x,
			                        玩家.y,
			                        moveQueue[i].x,
			                        moveQueue[i].y
			                    )
			                ) {
			                    targetIndex = i - 1;
			                    validMove = false;
			                    break;
			                }
			            }
			            if (targetIndex >= 0 && validMove) {
			                const target = moveQueue[targetIndex];
			                移动玩家(
			                    target.x - 玩家.x,
			                    target.y - 玩家.y,
			                    false
			                );
			                moveQueue = moveQueue.slice(targetIndex + 1);
			            } else {
			                // 无法多格移动时单格移动
			                const target = moveQueue.shift();
			                移动玩家(
			                    target.x - 玩家.x,
			                    target.y - 玩家.y,
			                    false
			                );
			            }
			        }
			    }, 移动间隔); // 间隔时间
			}
			function 打开配方书() {
			    if (
			        游戏状态 === "游戏中" &&
			        玩家属性.允许移动 > 0 &&
			        document.getElementById("配方书遮罩").style.display ===
			            "block"
			    )
			        return;
			    if (游戏状态 === "地图编辑器" || 游戏状态 === "死亡界面" || 游戏状态==="胜利"||游戏状态==="图鉴选择") return;
			    if (游戏状态 === "游戏中") 玩家属性.允许移动++;
			
			    const 遮罩 = document.getElementById("配方书遮罩");
			    const 窗口 = document.getElementById("配方书窗口");
			    const 内容容器 = document.getElementById("配方书内容容器");
			    const 关闭按钮 = document.getElementById("关闭配方书按钮");
			
			    内容容器.innerHTML = "";
			
			    const 所有已知配方 = new Map();
			
			    融合配方列表.forEach((配方) => {
			        if (配方.说明) {
			            所有已知配方.set(配方.说明, 配方);
			        } else {
			            const inputNames = 配方.输入.join(" + ");
			            const outputName = 配方.输出类名称 || 配方.输出类;
			            const tempDesc = `${inputNames} = ${outputName}`;
			            所有已知配方.set(tempDesc, { ...配方, 说明: tempDesc });
			        }
			    });
			    已发现的程序生成配方.forEach((配方) => {
			        if (配方.说明) {
			            所有已知配方.set(配方.说明, 配方);
			        }
			    });
			
			    if (所有已知配方.size === 0) {
			        内容容器.innerHTML =
			            "<p style='text-align: center; color: #888;'>尚未发现任何配方。</p>";
			    } else {
			        所有已知配方.forEach((配方) => {
			            const 配方条目 = document.createElement("div");
			            配方条目.style.cssText = `
			            background: rgba(255, 255, 255, 0.05);
			            padding: 10px 15px;
			            border: 1px solid rgba(76, 175, 80, 0.3);
			            border-radius: 6px;
			            font-size: 0.95em;
			            line-height: 1.5;
			            color: #e0e0e0;
			            text-align: left;
			        `;
			            配方条目.textContent =
			                配方.说明 ||
			                `${配方.输入.join(" + ")} → ${
			                    配方.输出类名称 || 配方.输出类
			                }`;
			            内容容器.appendChild(配方条目);
			        });
			    }
			
			    关闭按钮.onclick = 关闭配方书;
			
			    遮罩.style.display = "block";
			    窗口.style.opacity = 0;
			    窗口.style.transform = "translate(-50%, -50%) scale(0.9)";
			    requestAnimationFrame(() => {
			        窗口.style.transition =
			            "opacity 0.3s ease, transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
			        窗口.style.opacity = 1;
			        窗口.style.transform = "translate(-50%, -50%) scale(1)";
			    });
			}
			
			function 关闭配方书() {
			    const 遮罩 = document.getElementById("配方书遮罩");
			    const 窗口 = document.getElementById("配方书窗口");
			    if (!遮罩 || !窗口 || 遮罩.style.display === "none") return;
			
			    窗口.style.transition =
			        "opacity 0.3s ease, transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
			    窗口.style.opacity = 0;
			    窗口.style.transform = "translate(-50%, -50%) scale(0.9)";
			    setTimeout(() => {
			        遮罩.style.display = "none";
			        if (游戏状态 === "游戏中") {
			            玩家属性.允许移动--;
			            玩家属性.允许移动 = Math.max(0, 玩家属性.允许移动);
			        }
			    }, 300);
			}
			
			function 应用永久Buffs() {
			    // 先重置为初始值
			    玩家属性 = {...初始玩家属性}
			
			    // 应用永久Buff
			    Object.keys(永久Buffs).forEach(key => {
			        if (key !== '已获得效果') {
			            if (typeof 玩家属性[key] === 'number' && typeof 永久Buffs[key] === 'number') {
			                玩家属性[key] = (玩家属性[key] || 0) + 永久Buffs[key];
			            } else {
			                玩家属性[key] = 永久Buffs[key];
			            }
			        }
			    });
			
			    // 确保已获得的效果列表也同步
			    玩家属性.已获得神龛效果 = Array.from(永久Buffs.已获得效果);
			    
			
			}
			function 检查直线移动可行性(
			    fromX,
			    fromY,
			    toX,
			    toY,
			    未解锁房间视作障碍 = false
			) {
			    const dx = toX - fromX;
			    const dy = toY - fromY;
			
			    if (dx !== 0 && dy !== 0) return false; // 禁止斜向移动
			
			    const steps = Math.max(Math.abs(dx), Math.abs(dy));
			    const dirX = dx > 0 ? 1 : dx < 0 ? -1 : 0;
			    const dirY = dy > 0 ? 1 : dy < 0 ? -1 : 0;
			
			    for (let i = 1; i <= steps; i++) {
			        const x = fromX + dirX * i;
			        const y = fromY + dirY * i;
			
			        if (x < 0 || x >= 地牢大小 || y < 0 || y >= 地牢大小)
			            return false;
			        if (
			            !检查移动可行性(
			                x - dirX,
			                y - dirY,
			                x,
			                y,
			                未解锁房间视作障碍
			            )
			        )
			            return false;
			    }
			
			    return true;
			}
			const 主菜单容器 = document.getElementById("主菜单容器");
			const 新建游戏按钮 = document.getElementById("新建游戏按钮");
			const 读取存档按钮 = document.getElementById("读取存档按钮");
			const 图鉴按钮 = document.getElementById("图鉴按钮");
			const 读凭证按钮 = document.getElementById("读凭证按钮");
			const 地图编辑器按钮 = document.getElementById("地图编辑器按钮");
			地图编辑器按钮.addEventListener("click", () => {
			    进入地图编辑器();
			});
			function 收集所有定义() {
			    const definitions = 获取所有可用的定义();
			    所有物品定义 = definitions.items;
			    所有怪物定义 = definitions.monsters;
			}
			
			function 显示主菜单() {
			    游戏状态 = "主菜单";
			    所有地牢层.clear();
			    document.body.classList.remove("游戏进行中", "地图编辑器模式", "编辑器游玩模式", "初始化");
			    主菜单容器.style.display = 'flex';
			    主菜单容器.style.pointerEvents = "auto";
			    document.getElementById('编辑器工具栏').style.display = 'none';
			    document.getElementById('笔刷工具容器').style.display = 'none';
			    document.getElementById('返回编辑器按钮').style.display = 'none';
			
			    const 死亡遮罩 = document.getElementById("死亡遮罩");
			    if (死亡遮罩) 死亡遮罩.remove();
			    死亡界面已显示 = false;
			    if (typeof gsap === 'undefined') {
			        
			        return;
			    }
			
			    const 动画时间线 = gsap.timeline();
			    
			    gsap.set(主菜单容器, { autoAlpha: 1 });
			    gsap.set("#游戏标题", { autoAlpha: 0, y: -40, scale: 0.5 });
			    gsap.set("#菜单选项 .菜单按钮", { autoAlpha: 0, y: 10 });
			
			    动画时间线
			        .to("#游戏标题", {
			autoAlpha: 1,
			y: 0,
			scale: 1,
			duration: 0.5,
			ease: "expo.out",
			delay: 0.3,
			        })
			        .to(
			"#菜单选项 .菜单按钮",
			{
			    autoAlpha: 1,
			    y: 0,
			    duration: 0.2,
			    stagger: 0.1,
			    ease: "power2.out",
			},
			"-=0.6" 
			        );
			}
			
			function 隐藏主菜单() {
			    主菜单容器.style.display = "none";
			    游戏状态 = "游戏中";
			    if (typeof gsap === 'undefined') {
			        游戏状态 = "游戏中";
			        document.body.classList.add("游戏进行中");
			        return;
			    }
			    
			    gsap.to("#主菜单容器", {
			        autoAlpha: 0,
			        duration: 0.9,
			        ease: "power2.in",
			        onComplete: () => {
			
			document.body.classList.add("游戏进行中");
			
			        }
			    });
			}
			
			function 显示游戏模式选择() {
			    主菜单容器.style.display = 'none';
			    游戏模式选择菜单.style.display = 'flex';
			
			    if (typeof gsap === 'undefined') {
			        游戏模式选择菜单.style.opacity = '1';
			        游戏模式选择菜单.style.pointerEvents = 'auto';
			        document.getElementById("游戏模式标题").style.opacity = '1';
			        document.getElementById("游戏模式标题").style.transform = 'translateY(0px)';
			        document.querySelectorAll("#游戏模式选项 .菜单按钮, #返回主菜单按钮").forEach(按钮 => {
			按钮.style.opacity = '1';
			按钮.style.transform = 'translateY(0px)';
			        });
			    } else {
			        const 动画时间线 = gsap.timeline();
			        gsap.set(游戏模式选择菜单, { autoAlpha: 0 });
			    gsap.set("#游戏模式标题", { autoAlpha: 0, y: -30 });
			    gsap.set("#游戏模式选项 .菜单按钮, #返回主菜单按钮", { autoAlpha: 0, y: 20 });
			
			    动画时间线
			        .to(游戏模式选择菜单, { autoAlpha: 1, duration: 0.2 })
			        .to("#游戏模式标题", { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" })
			        .to("#游戏模式选项 .菜单按钮, #返回主菜单按钮", { 
			autoAlpha: 1, 
			y: 0, 
			duration: 0.3, 
			stagger: 0.1, 
			ease: "power2.out" 
			        }, "-=0.5");
			    }
			}
			
			function 隐藏游戏模式选择() {
			    if (typeof gsap === 'undefined') {
			        游戏模式选择菜单.style.display = 'none';
			        return;
			    }
			    gsap.to(游戏模式选择菜单, {
			        autoAlpha: 0,
			        duration: 0.3,
			        ease: "power2.in",
			        onComplete: () => {
			游戏模式选择菜单.style.display = 'none';
			        }
			    });
			}
			
function 启动游戏(存档数据 = null, 是否是创意关卡 = false, 种子 = null, 职业 = null) {
			    程序生成配方列表 = [];
			    已发现的程序生成配方 = [];
			
			    if (存档数据) {
			        console.log("正在加载存档...", 存档数据);
			        try {
			            当前游戏种子 = 存档数据.当前游戏种子 || Date.now().toString();
			            初始化随机数生成器(当前游戏种子);
			            生成怪物引入计划();

			            恢复游戏状态(存档数据, 是否是创意关卡);
			            处理玩家着陆效果(玩家.x,玩家.y,玩家.x,玩家.y)
			            if (存档数据.配方信息) {
			                程序生成配方列表 =
			                    存档数据.配方信息.程序生成配方列表 || [];
			                已发现的程序生成配方 =
			                    存档数据.配方信息.已发现的程序生成配方 || [];
			                
			                已发现的程序生成配方.forEach((discoveredRecipe) => {
			                    if (
			                        !融合配方列表.some(
			                            (r) => r.说明 === discoveredRecipe.说明
			                        )
			                    ) {
			                        融合配方列表.push(discoveredRecipe);
			                    }
			                });
			            }
			            if (是否是创意关卡) 是否是自定义关卡 = true;
			            if (存档数据.强制动画模式) 切换动画 = 存档数据.强制动画模式;
			
			            初始化canvas();
			            
			            
			            更新视口();
			            更新背包显示();
			            更新装备显示();
			            更新界面状态();
			            更新物体指示器();
			
			            最高教程阶段 = 存档数据.教程?.最高阶段 || 6;
			            是否为教程层 = false;
			            document.getElementById("跳过教程按钮").style.display =
			                "none";
			            
			            显示通知("存档加载成功！", "成功");
			            处理沉浸式传送门();
			            绘制();
			        } catch (错误) {
			            console.error("加载存档失败:", 错误);
			            显示通知("加载存档失败", "错误");
			            显示主菜单();
			        }
			    } else {
			        重置所有游戏状态();
			        初始化canvas();
			        当前游戏种子 = 种子 || Date.now().toString();
			        初始化随机数生成器(当前游戏种子);
			        生成怪物引入计划();
			        if(职业) 玩家职业 = 职业;
			        
			        
			        if (window.innerWidth < 769) {
			            document
			                .getElementById("小地图容器")
			                .classList.add("隐藏");
			        }
			        
			        当前层数 = null;
			        游戏开始时间 = Date.now();
			        进入教程层();
			        
			    }
			    if(已初始化 > 0) 动画帧();
			    if(已初始化 > 0) 初始化装备系统();
			    if(已初始化 > 0) 初始化背包事件监听();
			    绘制小地图();
			    更新洞穴视野();
			    隐藏主菜单();
			    
			}
			function 揭示并激活陷阱群(陷阱ID, 中毒持续, 中毒强度) {
			    const 待转换列表 = [];
			    for (let y = 0; y < 地牢大小; y++) {
			        for (let x = 0; x < 地牢大小; x++) {
			            const 物品 = 地牢[y]?.[x]?.关联物品;
			            if (物品 instanceof 隐形毒气陷阱 && 物品.自定义数据.get('关联陷阱ID') === 陷阱ID) {
			                待转换列表.push({x, y, 物品});
			            }
			        }
			    }
			
			    if (待转换列表.length > 0) {
			         显示通知(`陷阱被激活了，周围的毒气喷涌而出！`, "警告", true);
			    }
			
			    待转换列表.forEach(条目 => {
			        const {x, y, 物品} = 条目;
			        if(地牢[y]?.[x]?.关联物品 === 物品) {
			            const 新毒气 = new 毒气({
			                中毒持续:中毒持续,
			                中毒强度:中毒强度,
			                来源:'陷阱',
			
			                    倒计时: 9999,
			                    爆炸时间: 9999,
			            });
			            地牢[y][x].关联物品 = null;
			            地牢[y][x].类型 = null;
			            if (放置物品到单元格(新毒气, x, y)) {
			               所有计时器.push(新毒气);
			            }
			        }
			    });
			    绘制();
			}
			
			function 生成毒气陷阱群(房间) {
			    if (房间.id === 0 || 房间.类型 !== '房间') return;
			
			    const 模式 = prng() < 0.5 ? '十字' : 'X形';
			    let 长度 = 2 + Math.floor(prng() * 2);
			
			    let 放置成功 = false;
			    for (let 尝试 = 0; 尝试 < 100; 尝试++) {
			        const 中心X = 房间.x + 1 + Math.floor(prng() * (房间.w - 2));
			        const 中心Y = 房间.y + 1 + Math.floor(prng() * (房间.h - 2));
			
			        const 陷阱坐标 = [];
			        if (位置是否可用(中心X, 中心Y, false)) {
			            陷阱坐标.push({ x: 中心X, y: 中心Y });
			        } else {
			            continue;
			        }
			
			        const 方向集 = 模式 === '十字'
			            ? [[1, 0], [-1, 0], [0, 1], [0, -1]]
			            : [[1, 1], [-1, -1], [1, -1], [-1, 1]];
			
			        let 路径失败 = false;
			        for (const [dx, dy] of 方向集) {
			            let prevX = 中心X;
			            let prevY = 中心Y;
			            for (let i = 1; i <= 长度; i++) {
			                const currX = 中心X + i * dx;
			                const currY = 中心Y + i * dy;
			
			                if (检查移动可行性(prevX, prevY, currX, currY, false) && 位置是否可用(currX, currY, false) && ((地牢[currY][currX].背景类型==单元格类型.房间 && 地牢生成方式 == 'default')||地牢生成方式 == 'cave')) {
			                    陷阱坐标.push({ x: currX, y: currY });
			                    prevX = currX;
			                    prevY = currY;
			                } else {
			                    路径失败 = true;
			                    break;
			                }
			            }
			        }
			        if (路径失败) {
			            路径失败 = false;
			            continue;
			        }
			
			        const 最终坐标列表 = [...new Map(陷阱坐标.map(item => [`${item.x},${item.y}`, item])).values()];
			        const 是否全部可用 = 最终坐标列表.every(pos => 位置是否可用(pos.x, pos.y, false));
			
			        if (是否全部可用 && 最终坐标列表.length > 2) {
			            const 陷阱ID = 生成时间随机数(15);
			            const 强化 = prng() < 0.15 + 当前层数 * 0.02;
			
			            最终坐标列表.forEach(pos => {
			                 const 新陷阱 = new 隐形毒气陷阱({强化: 强化, 关联陷阱ID: 陷阱ID});
			                 放置物品到单元格(新陷阱, pos.x, pos.y);
			            });
			            放置成功 = true;
			            break;
			        }
			        if (尝试 % 50 === 0) 长度 = 2 + Math.floor(prng() * 2);
			    }
			}
			function 生成时间随机数(length = 16) {
			  const timestamp = Date.now().toString(); // 13位
			  const randomLen = length - timestamp.length;
			  if (randomLen <= 0) {
			    // 长度过短，直接截取时间戳部分
			    return Number(timestamp.slice(0, length));
			  }
			  const randomStr = Math.floor(prng() * (10 ** randomLen))
			    .toString()
			    .padStart(randomLen, '0');
			  return Number(timestamp + randomStr);
			}
			
			function 重置所有游戏状态() {
			    融合区物品 = [null, null, null, null];
			    融合结果 = null;
			    传送点列表 = [];
			    所有怪物.forEach((m) => {
			        m.绘制血条(true);
			    });
			    所有怪物.forEach((怪物) => {
			        怪物动画状态.delete(怪物);
			    });
			    地牢 = [];
			    房间列表 = [];
			    上锁房间列表 = [];
			    
			    游戏开始时间 = null;
			    上次死亡地点 = null;
			    调试无限生命=false
			    调试无限能量=false
			    玩家仆从列表 = [];
			    所有怪物 = [];
			    if(地牢生成方式==='cave') 已揭示洞穴格子.clear();
			    
			    所有计时器 = [];
			    当前天气效果=[];
			    玩家死亡次数 = 0;
			    //当前关卡存档数据字符串 = null; 这是重置创意关卡的字符串
			    红蓝开关状态 = '红';
			    绿紫开关状态 = '绿';
			    自定义全局设置 = {
			    初始生命值: 100,
			    初始能量值: 100,
			    初始背包容量: 12,
			    玩家属性: {
			        移动步数: 1,
			        攻击加成: 0,
			        防御加成: 0,
			        死亡次数限制: 0,
			    },
			    胜利条件: {
			        回合数限制: 0,
			        伤害限制: 0,
			        生命下限: 0,
			        清除所有怪物: false,
			    },
			    全局天气: [],
			    禁用传送菜单: false,
			    诡魅天气怪物层级: 1,
			    奖励物品层级: 1,
			};
			        初始玩家属性 = {
			    移动步数: 1,
			    攻击加成: 0,
			    防御加成: 0,
			    掉落倍率: 1,
			    透视: false,
			    允许移动: 0,
			    能挖掘墙壁: false,
			    最大生命值加成: 0,
			    怪物反伤: false,
			    挑战波数增加: 0,
			    随机掉落: false,
			    初始能量加成: 0,
			    耐久消耗减免: 0,
			    能量流失: 0,
			    商店价格倍率: 1,
			    已获得神龛效果: [],
			};
			编辑器状态 = {
			    当前选中: null, 
			    模式: '编辑',
			    选中实例: null, 
			    相机速度: 1,
			    正在划区: false,
			    划区起点: { x: 0, y: 0 },
			    上次放置的背景: null,
				笔刷模式: '单个',
				笔刷形状: '圆形',
				笔刷半径: 3,
			};
			    玩家背包 = new Map();
			    玩家装备 = new Map();
			    门实例列表 = new Map();
			    已访问房间 = new Set();
			    房间地图 = Array(地牢大小)
			        .fill()
			        .map(() => Array(地牢大小).fill(-1));
			    玩家初始位置 = { x: 0, y: 0 };
			    玩家.x = 0;
			    玩家.y = 0;
			    当前层数 = 0; // 不进入教程
			    
			    永久Buffs = { 已获得效果: new Set() };
			    玩家状态.forEach((m) => {
			        m.移除状态();
			    });
			    if (当前激活卷轴列表.size > 0) {
			        当前激活卷轴列表.forEach((卷轴) => {
			            当前激活卷轴列表.delete(卷轴);
			            卷轴.卸下();
			        });
			    }
			    是否是自定义关卡 = false;
			    玩家属性 = { ...初始玩家属性 };
			    玩家状态 = [];
			    移动历史 = [];
			    已击杀怪物数 = 0;
			    NPC互动中 = false;
			    当前NPC = null;
			    死亡界面已显示 = false;
			    教程阶段 = 0;
			    最高教程阶段 = 0;
			    是否为教程层 = false;
			    日志历史 = [];
			    最大背包容量 = 12;
			    玩家总移动回合数 = 0;
			    玩家总受到伤害 = 0;
			    Object.keys(胜利条件提示元素组).forEach(键 => {
			        if (胜利条件提示元素组[键]) {
			            胜利条件提示元素组[键].销毁();
			            胜利条件提示元素组[键] = null;
			        }
			    });
			
			    document.getElementById("背包物品栏").innerHTML = "";
			    document
			        .querySelectorAll(".装备槽")
			        .forEach((槽) => (槽.innerHTML = ""));
			    document.getElementById("logContent").innerHTML = ""; // 清空日志面板内容
			
			    document.querySelector(".health-bar").style.width = "100%";
			    document.querySelector(".power-bar").style.width = "100%";
			    怪物追踪提示.更新({ 内容: `追踪怪物：0` });
			    击杀提示.更新({ 内容: `已击杀怪物：0` });
			
			    界面可见性 = { hud: false, 背包: false };
			    if (开发者模式) {
try {
尝试收集物品(new 调试工具({}), true);
} catch (e) {}
}
			}
			function 打开全局设置窗口() {
			    const 窗口 = document.getElementById("全局设置窗口");
			    
			    document.getElementById('设置_初始生命值').value = 自定义全局设置.初始生命值;
			    document.getElementById('设置_初始能量值').value = 自定义全局设置.初始能量值;
			    document.getElementById('设置_初始背包容量').value = 自定义全局设置.初始背包容量;
			    document.getElementById('设置_初始移动步数').value = 自定义全局设置.玩家属性.移动步数;
			    document.getElementById('设置_初始攻击加成').value = 自定义全局设置.玩家属性.攻击加成;
			    document.getElementById('设置_初始防御加成').value = 自定义全局设置.玩家属性.防御加成;
			
			    document.getElementById('设置_禁用传送菜单').checked = 自定义全局设置.禁用传送菜单 || false;
			    document.getElementById('设置_禁用大地图').checked = 自定义全局设置.禁用大地图 || false;
			    document.getElementById('设置_回合数限制').value = 自定义全局设置.胜利条件.回合数限制;
			    document.getElementById('设置_伤害限制').value = 自定义全局设置.胜利条件.伤害限制;
			    document.getElementById('设置_生命下限').value = 自定义全局设置.胜利条件.生命下限;
			    document.getElementById('设置_清除所有怪物').checked = 自定义全局设置.胜利条件.清除所有怪物 || false;
			    document.getElementById('设置_死亡次数限制').value = 自定义全局设置.胜利条件.死亡次数限制 || 0;
			    
			    document.getElementById('设置_相机视野大小').value = 相机显示边长;
			    document.getElementById('设置_诡魅天气怪物层级').value = 自定义全局设置.诡魅天气怪物层级?? 1;
			    document.getElementById('设置_奖励物品层级').value = 自定义全局设置.奖励物品层级?? 1;
			    
			    const 天气容器 = document.getElementById('天气选择容器');
			    天气容器.innerHTML = '';
			    所有天气列表.forEach(天气 => {
			        const 选项包装 = document.createElement('div');
			        选项包装.className = '天气选项';
			        const 复选框 = document.createElement('input');
			        复选框.type = 'checkbox';
			        复选框.id = `天气_${天气}`;
			        复选框.value = 天气;
			        if (自定义全局设置.全局天气.includes(天气)) {
			            复选框.checked = true;
			        }
			        const 标签 = document.createElement('label');
			        标签.htmlFor = `天气_${天气}`;
			        标签.textContent = 天气;
			
			        选项包装.appendChild(复选框);
			        选项包装.appendChild(标签);
			        天气容器.appendChild(选项包装);
			    });
			
			    窗口.style.display = 'block';
			    窗口.style.opacity = 0;
			    窗口.style.transform = 'translate(-50%, -50%) scale(0.9)';
			    requestAnimationFrame(() => {
			        窗口.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
			        窗口.style.opacity = 1;
			        窗口.style.transform = 'translate(-50%, -50%) scale(1)';
			    });
			
			    document.getElementById('编辑器保存按钮').onclick = 下载地图文件;
			    document.getElementById('编辑器加载按钮').onclick = () => {
			        const 文件输入控件 = document.getElementById("存档文件输入");
			        文件输入控件.value = '';
			        文件输入控件.onchange = (事件) => {
			            const 文件 = 事件.target.files[0];
			            if (文件) {
			                const reader = new FileReader();
			                reader.onload = (读取事件) => {
			                    const 存档字符串 = 读取事件.target.result;
			                    try {
			                        const 预览数据 = JSON.parse(存档字符串);
									if (!开发者模式) {
			                        if (预览数据.isPublished) {
			                            显示通知("编辑器不能加载已发布的创意关卡！", "错误");
			                            return;
			                        }
								}
			                        if (预览数据.版本 && 预览数据.所有地牢层数据) {
			                            显示楼层选择窗口(存档字符串);
			                        } else {
			                            saveEditorState();
			                            导入地图(存档字符串);
			                        }
			                    } catch (e) {
			                        显示通知("文件格式错误或无法识别！", "错误");
			                    }
			                };
			                reader.readAsText(文件);
			            }
			        };
			        文件输入控件.click();
			        关闭全局设置窗口();
			    };
			    document.getElementById('编辑器设置起点按钮').onclick = () => {
			        if (编辑器状态.模式 === '设置起点') {
			            编辑器状态.模式 = 旧编辑器状态 || '编辑';
			            显示通知("已取消设置起点", "信息");
			        } else {
			            旧编辑器状态 = 编辑器状态.模式;
			            编辑器状态.模式 = '设置起点';
			            显示通知("请在地图上点击设置玩家起点", "信息");
			        }
			        关闭全局设置窗口();
			    };
			    document.getElementById('编辑器模板按钮').onclick = () => {
			        地牢生成方式 = 'default';
			        generateDungeonTemplate();
			        const 互动按钮元素 = document.getElementById('互动按钮');
			        if(互动按钮元素) 互动按钮元素.style.background = '';
			        关闭全局设置窗口();
			    };
			    document.getElementById('编辑器洞穴模板按钮').onclick = () => {
    地牢生成方式 = 'cave';
			        generateDungeonTemplate();
    const 互动按钮元素 = document.getElementById('互动按钮');
    if(互动按钮元素) 互动按钮元素.style.background = '';
    关闭全局设置窗口();
};
document.getElementById('编辑器迷宫模板按钮').onclick = () => {
    地牢生成方式 = 'maze';
			        generateDungeonTemplate();
    const 互动按钮元素 = document.getElementById('互动按钮');
    if(互动按钮元素) 互动按钮元素.style.background = '';
    关闭全局设置窗口();
};
			    document.getElementById('关闭全局设置按钮').onclick = 关闭全局设置窗口;
			    document.getElementById('保存全局设置按钮').onclick = 保存全局设置;
			}
			
			function 关闭全局设置窗口() {
			    
			    const 窗口 = document.getElementById("全局设置窗口");
			    if (!窗口 || 窗口.style.display === 'none') return;
			
			    窗口.style.opacity = 0;
			    窗口.style.display = 'none'
			    窗口.style.transform = 'translate(-50%, -50%) scale(0.9)';
			}
			function 显示楼层选择窗口(存档字符串) {
			    const 存档数据 = JSON.parse(存档字符串);
			    const 楼层列表容器 = document.getElementById('楼层选择列表');
			    const 遮罩 = document.getElementById('楼层选择遮罩');
			    楼层列表容器.innerHTML = ''; 
			
			    const 楼层号列表 = Object.keys(存档数据.所有地牢层数据);
			
			    if (楼层号列表.length === 0) {
			        显示通知("此存档中没有找到楼层数据。", "错误");
			        return;
			    }
			
			    楼层号列表.forEach(楼层号 => {
			        const 按钮 = document.createElement('button');
			        按钮.className = '菜单按钮';
			        按钮.textContent = `第 ${楼层号} 层`;
			        按钮.onclick = () => {
			            const 选中楼层数据 = 存档数据.所有地牢层数据[楼层号];
			            
			            const 伪造的地图数据 = {
			                所有传送门:存档数据.所有传送门,
			                编辑器状态数据: {},
			                所有地牢层数据: {
			                    "-1": 选中楼层数据
			                },
			                当前层数: -1,
			                玩家: {
			                    x: 选中楼层数据.玩家初始位置?.x ?? 50,
			                    y: 选中楼层数据.玩家初始位置?.y ?? 50,
			                    属性: {},
			                    背包: [],
			                    装备: [],
			                }
			            };
			            
			            saveEditorState();
			            导入地图(JSON.stringify(伪造的地图数据));
			            自定义全局设置 = 存档数据.自定义全局设置;
			            const 初始房间 = 房间列表.find(r => r.id === 0);
			    if (初始房间) {
			        初始房间.已探索 = true;
			    }
			    if (parseInt(楼层号,10)!==-1){
			
			    let 胜利旗帜位置 = null;
			    for (let y = 0; y < 地牢大小; y++) {
			        for (let x = 0; x < 地牢大小; x++) {
			            const cell = 地牢[y][x];
			            if (cell.关联物品 && (cell.类型 === 单元格类型.楼梯下楼 || cell.类型 === 单元格类型.楼梯上楼)) {
			                if (cell.类型 === 单元格类型.楼梯下楼) {
			                    胜利旗帜位置 = {x, y};
			                }
			                cell.关联物品 = null;
			                cell.类型 = null;
			            } else if (cell.关联物品 instanceof 寻宝戒指) {
			                cell.关联物品.自定义数据.set('生效层数',-1);
			            } else if (cell.关联物品 instanceof 隐形虫洞陷阱) {
			                cell.关联物品 = null;
			                cell.类型 = null;
			                
			            } else if (cell.关联物品 instanceof 配方卷轴) {
			                cell.关联物品 = null;
			                cell.类型 = null;
			                
			            } else if (cell.关联物品 instanceof 召唤怪物陷阱) {
			                cell.关联物品.自定义数据.set('怪物层级',当前层数);
			            } else if (cell.关联物品 instanceof 钥匙) {
			                cell.关联物品.自定义数据.set('地牢层数',-1);
			            } else if (cell.关联物品 instanceof 神秘商人) {
			                cell.关联物品.自定义数据.set('商品层数',当前层数);
			                cell.关联物品.生成库存(Math.max(cell.关联物品.自定义数据.get('商品层数'), 0));
			            } else if (cell.关联物品 instanceof 探险家) {
			                cell.关联物品.自定义数据.set('需求层数',当前层数);
			                cell.关联物品.生成收购需求(cell.关联物品.自定义数据.get('需求层数'));
			            }
			        }
			    }
			    if (胜利旗帜位置) {
			        放置物品到单元格(new 旗帜(), 胜利旗帜位置.x, 胜利旗帜位置.y);
			    }
			    }
			
			    //生成并放置随机配方卷轴(当前层数);
			    
			    游戏状态 = '地图编辑器';
			    红蓝开关状态 = '红';
			    绿紫开关状态 = '绿';
			    当前层数 = -1;
			    处理房间状态();
			            关闭楼层选择窗口();
			        };
			        楼层列表容器.appendChild(按钮);
			    });
			
			    document.getElementById('关闭楼层选择按钮').onclick = 关闭楼层选择窗口;
			    遮罩.style.display = 'block';
			}
			
			function 关闭楼层选择窗口() {
			    const 遮罩 = document.getElementById('楼层选择遮罩');
			    if (遮罩) {
			        遮罩.style.display = 'none';
			    }
			}
			function 处理HUD切换按钮点击() {
			    if (游戏状态 === '地图编辑器') {
			        切换编辑器工具栏模式();
			    } else {
			        切换HUD模式();
			    }
			}
			
			function 保存全局设置() {
			    自定义全局设置.初始生命值 = parseInt(document.getElementById('设置_初始生命值').value) || 100;
			    自定义全局设置.初始能量值 = parseInt(document.getElementById('设置_初始能量值').value) || 100;
			    自定义全局设置.初始背包容量 = parseInt(document.getElementById('设置_初始背包容量').value) || 12;
			    
			    自定义全局设置.玩家属性.移动步数 = parseInt(document.getElementById('设置_初始移动步数').value) || 1;
			    自定义全局设置.玩家属性.攻击加成 = parseInt(document.getElementById('设置_初始攻击加成').value) || 0;
			    自定义全局设置.玩家属性.防御加成 = parseInt(document.getElementById('设置_初始防御加成').value) || 0;
			
			    自定义全局设置.禁用传送菜单 = document.getElementById('设置_禁用传送菜单').checked;
			    自定义全局设置.禁用大地图 = document.getElementById('设置_禁用大地图').checked;
			    自定义全局设置.胜利条件.回合数限制 = parseInt(document.getElementById('设置_回合数限制').value) || 0;
			    自定义全局设置.胜利条件.伤害限制 = parseInt(document.getElementById('设置_伤害限制').value) || 0;
			    自定义全局设置.胜利条件.生命下限 = parseInt(document.getElementById('设置_生命下限').value) || 0;
			    自定义全局设置.胜利条件.清除所有怪物 = document.getElementById('设置_清除所有怪物').checked;
			    自定义全局设置.胜利条件.死亡次数限制 = parseInt(document.getElementById('设置_死亡次数限制').value) || 0;
			
			    const 新视野大小 = parseInt(document.getElementById('设置_相机视野大小').value);
			    if (新视野大小) {
			        相机显示边长 = 新视野大小;
			        初始化canvas();
			        更新视口();
			        绘制();
			    }
			
			    自定义全局设置.诡魅天气怪物层级 = parseInt(document.getElementById('设置_诡魅天气怪物层级').value)?? 1;
			    自定义全局设置.奖励物品层级 = parseInt(document.getElementById('设置_奖励物品层级').value) || 1;
			
			    自定义全局设置.全局天气 = [];
			    document.querySelectorAll('#天气选择容器 input:checked').forEach(复选框 => {
			        自定义全局设置.全局天气.push(复选框.value);
			    });
			    当前天气效果=[...自定义全局设置.全局天气];
			    显示通知("全局设置已保存！", "成功");
			    关闭全局设置窗口();
			}
			
			async function 生成签名(dataString) {
			    const textToEncode = dataString + 数据完整性密钥;
			    const encoder = new TextEncoder();
			    const data = encoder.encode(textToEncode);
			    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
			    const hashArray = Array.from(new Uint8Array(hashBuffer));
			    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
			    return hashHex;
			}
			function 检查胜利条件() {
			    const 条件 = 自定义全局设置.胜利条件;
			    const 生命条 = document.querySelector(".health-bar");
			    const 当前生命 = parseFloat(生命条.style.width) || 100;
			
			    let 失败消息 = [];
			    if (条件.死亡次数限制 > 0 && 玩家死亡次数 >= 条件.死亡次数限制) {
			        失败消息.push(`超过了最大死亡次数 (${条件.死亡次数限制-1})`);
			        
			    }
			    if (条件.回合数限制 > 0 && 玩家总移动回合数 > 条件.回合数限制) {
			        失败消息.push(`超过了回合数限制 (${玩家总移动回合数}/${条件.回合数限制})`);
			    }
			    if (条件.伤害限制 > 0 && 玩家总受到伤害 > 条件.伤害限制) {
			        失败消息.push(`承受伤害过多 (${玩家总受到伤害.toFixed(1)}/${条件.伤害限制})`);
			    }
			    if (条件.生命下限 > 0 && 当前生命 < 条件.生命下限) {
			        失败消息.push(`生命值过低 (${当前生命.toFixed(1)}% / ${条件.生命下限}%)`);
			    }
			
			    if (失败消息.length > 0) {
			        显示通知(`胜利条件未达成：${失败消息.join('，')}。`, '错误', true);
			    } else {
			        显示胜利界面();
			    }
			}
			const 游戏模式选择菜单 = document.getElementById("游戏模式选择菜单");
			const 返回主菜单按钮 = document.getElementById("返回主菜单按钮");
			const 无尽地牢按钮 = document.getElementById("无尽地牢按钮");
			const 创意关卡按钮 = document.getElementById("创意关卡按钮");
			const 创意关卡文件输入 = document.getElementById("创意关卡文件输入");
			
			
			
			async function 导入创意关卡(存档字符串) {
			    try {
			        const 存档数据 = JSON.parse(存档字符串);
			        if (!存档数据.isPublished) {
			            显示通知("这不是一个已发布的创意关卡文件！", "错误");
			            return false;
			        }
			
			        // --- 验证签名开始 ---
			        const 接收到的签名 = 存档数据.signature;
			        if (!接收到的签名) {
			            显示通知("加载失败：关卡文件缺少签名，可能已损坏或来自旧版本。", "错误");
			            return false;
			        }
			
			        delete 存档数据.signature; // 从数据中移除签名以进行校验
			        const 待验证数据字符串 = JSON.stringify(存档数据);
			        const 预期签名 = await 生成签名(待验证数据字符串);
			
			        if (接收到的签名 !== 预期签名) {
			            显示通知("加载失败：关卡文件已被篡改或已损坏！", "错误");
			            return false;
			        }
			        // --- 验证签名结束 ---
			
			        
			        if (存档数据.游戏版本 && 存档数据.游戏版本 > 游戏版本) {
			    显示通知(`存档版本 (${存档数据.游戏版本}) 高于当前游戏版本 (${游戏版本})，无法加载！`, "错误");
			    显示主菜单();
			    return false;
			}
			        启动游戏(存档数据, true);
			        当前关卡存档数据字符串 = 存档字符串;
			        if (存档数据.关卡标题) {
			            显示通知(`欢迎来到：${存档数据.关卡标题}`, "信息", true, 4000);
			        }
			        return true;
			    } catch (error) {
			        console.error("加载创意关卡时出错:", error);
			        显示通知("加载创意关卡失败，文件格式错误或数据损坏。", "错误");
			        return false;
			    }
			}
			function 重置创意关卡() {
			    if (!是否是自定义关卡) return;
			    if (!当前关卡存档数据字符串) {
			        显示通知("无法重置：未找到关卡数据！", "错误");
			        return;
			    }
			
			    显示自定义确认对话框(
			        "你确定要重新开始当前关卡吗？<br>所有进度都将被重置。",
			        () => {
			            关闭设置菜单(); 
			            
			            setTimeout(() => {
			                启动游戏(JSON.parse(当前关卡存档数据字符串), true);
			            }, 310);
			        }
			    );
			}
			async function 发布关卡() {
			    if (!编辑器状态备份) {
			        显示通知("找不到原始地图状态，发布失败！", "错误");
			        return;
			    }
			
			    const 关卡标题 = prompt("请输入关卡标题：", "我的创意关卡");
			    if (关卡标题 === null || 关卡标题.trim() === "") {
			        显示通知("已取消发布。", "信息");
			        return;
			    }
			        
			    try {
			        const 地图数据 = JSON.parse(编辑器状态备份);
			        地图数据.玩家.属性.允许移动 = 0;
			        
			        地图数据.玩家.x = 玩家初始位置.x;
			        地图数据.玩家.y = 玩家初始位置.y;
			        
			        地图数据.关卡标题 = 关卡标题;
			        地图数据.isPublished = true;
			        地图数据.强制动画模式 = 切换动画;
			        delete 地图数据.编辑器状态数据;
			        delete 地图数据.配方信息;
			
			        // --- 签名开始 ---
			        delete 地图数据.signature; // 确保先移除旧签名（如果有）
			        const 数据字符串 = JSON.stringify(地图数据);
			        地图数据.signature = await 生成签名(数据字符串); // 生成并附加签名
			        // --- 签名结束 ---
			        
			        const 地图字符串最终 = JSON.stringify(地图数据);
			        const 数据块 = new Blob([地图字符串最终], { type: 'application/json' });
			        const 下载链接 = URL.createObjectURL(数据块);
			        const 链接元素 = document.createElement('a');
			        链接元素.href = 下载链接;
			        const 时间戳 = new Date().toISOString().replace(/[:.]/g, "-");
			        链接元素.download = `${关卡标题}_${时间戳}.json`;
			        document.body.appendChild(链接元素);
			        链接元素.click();
			        document.body.removeChild(链接元素);
			        URL.revokeObjectURL(下载链接);
			        显示通知('关卡已成功发布!', '成功');
			    } catch (e) {
			        显示通知('发布关卡时发生错误！', '错误');
			        console.error(e);
			    }
			}
			
			if (新建游戏按钮) {
			    
			    新建游戏按钮.addEventListener("click", 显示游戏模式选择);
			}
			const 无尽洞穴按钮 = document.getElementById("无尽洞穴按钮");
if (无尽洞穴按钮) {
    无尽洞穴按钮.addEventListener("click", () => {
        地牢生成方式 = 'cave'; // 设置为洞穴生成器
        document.getElementById('种子筛选器按钮').style.display='none';
        显示职业选择界面();
    });
}
const 无尽迷宫按钮 = document.getElementById("无尽迷宫按钮");
if (无尽迷宫按钮) {
    无尽迷宫按钮.addEventListener("click", () => {
        地牢生成方式 = 'maze'; // 设置为迷宫生成器
        
        显示职业选择界面();
    });
}
			if (返回主菜单按钮) {
			    返回主菜单按钮.addEventListener("click", () => {
			        隐藏游戏模式选择();
			        显示主菜单();
			    });
			}
			
			if (无尽地牢按钮) {
			    无尽地牢按钮.addEventListener("click", () => {
			        地牢生成方式 = 'default';
			        //隐藏游戏模式选择();
			        document.getElementById('种子筛选器按钮').style.display='flex';
			        显示职业选择界面();
			    });
			}
			function 净化HTML(文本) {
			    if (typeof 文本 !== 'string') return '';
			    const 映射表 = {
			        '<': '&lt;',
			        '>': '&gt;',
			    };
			    return 文本.replace(/[&<>"']/g, (匹配) => 映射表[匹配]);
			}
			
			function 显示创意关卡浏览器() {
			    隐藏游戏模式选择();
			    const 浏览器容器 = document.getElementById("创意关卡浏览器");
			    const 返回按钮 = document.getElementById('返回游戏模式选择按钮');
			    const 标题 = 浏览器容器.querySelector('h2');
			    const 上传区域 = document.getElementById('上传区域');
			    const 搜索区域 = document.getElementById('搜索与列表区域');
			    if (typeof gsap === 'undefined') {
			        刷新关卡列表()
			        return;
			    }
			    
			    const 动画时间线 = gsap.timeline({
			        onComplete: 刷新关卡列表
			    });
			
			    gsap.set(浏览器容器, { autoAlpha: 0 });
			    gsap.set(返回按钮, { autoAlpha: 0, scale: 0.8 });
			    gsap.set(标题, { autoAlpha: 0, y: -30 });
			    gsap.set([上传区域, 搜索区域], { autoAlpha: 0, y: 30 });
			
			    动画时间线
			        .to(浏览器容器, { 
			autoAlpha: 1, 
			duration: 0.4, 
			ease: "power2.inOut",
			onStart: () => {
			    浏览器容器.style.display = 'flex';
			}
			        })
			        .to(返回按钮, { 
			autoAlpha: 1, 
			scale: 1, 
			duration: 0.5, 
			ease: 'back.out(1.7)' 
			        }, "-=0.2")
			        .to(标题, { 
			autoAlpha: 1, 
			y: 0, 
			duration: 0.6, 
			ease: 'power2.out' 
			        }, '<')
			        .to([上传区域, 搜索区域], { 
			autoAlpha: 1, 
			y: 0, 
			duration: 0.5, 
			stagger: 0.1, 
			ease: 'power2.out' 
			        }, "-=0.4");
			}
			
			function 隐藏创意关卡浏览器() {
			    const 浏览器容器 = document.getElementById("创意关卡浏览器");
			    const 返回按钮 = document.getElementById('返回游戏模式选择按钮');
			    const 标题 = 浏览器容器.querySelector('h2');
			    const 上传区域 = document.getElementById('上传区域');
			    const 搜索区域 = document.getElementById('搜索与列表区域');
			    if (typeof gsap === 'undefined') {
			        浏览器容器.style.display = 'none';
			        显示游戏模式选择();
			        return;
			    }
			    
			    gsap.to([返回按钮, 标题, 上传区域, 搜索区域], { 
			        autoAlpha: 0, 
			        y: 15, 
			        duration: 0.1, 
			        ease: 'power2.in' 
			    });
			
			    gsap.to(浏览器容器, {
			        autoAlpha: 0,
			        duration: 0.2,
			        ease: "power2.in",
			        onComplete: () => {
			浏览器容器.style.display = 'none';
			显示游戏模式选择();
			        }
			    });
			}
			function safeEncode(str) {
			    
			    return btoa(unescape(encodeURIComponent(str)));
			}
			
			function safeDecode(str) {
			    
			    try {
			        return decodeURIComponent(escape(atob(str)));
			    } catch (e) {
			        console.warn("Base64解码失败，返回原始字符串:", str, e);
			        return str;
			    }
			}
			
			window.addEventListener('load', () => {
			    try {
			        if (window.location.hash && window.location.hash.startsWith('#levelData=')) {
			const encodedData = window.location.hash.substring('#levelData='.length);
			const decodedDataString = decodeURIComponent(escape(atob(encodedData)));
			const levelData = JSON.parse(decodedDataString);
			
			// 隐藏主菜单，直接启动游戏
			const 主菜单容器 = document.getElementById("主菜单容器");
			主菜单容器.style.display = 'none';
			
			启动游戏(levelData, true); 
			
			// 清理 hash，防止刷新时重复加载
			history.pushState("", document.title, window.location.pathname + window.location.search);
			        }
			    } catch (error) {
			        console.error("从URL加载关卡失败:", error);
			        alert("加载创意关卡失败，数据可能已损坏！将返回主菜单。");
			        // 如果加载失败，确保主菜单能够正常显示
			        const 主菜单容器 = document.getElementById("主菜单容器");
			        主菜单容器.style.display = 'flex';
			    }
			});
			
			async function 上传关卡处理函数() {
			    const fileInput = document.getElementById('关卡文件输入');
			    const titleInput = document.getElementById('关卡标题输入');
			    const authorInput = document.getElementById('关卡作者输入');
			    const tagsInput = document.getElementById('关卡标签输入');
			    const passwordInput = document.getElementById('关卡上传密码输入');
			    
			    const originalFile = fileInput.files[0];
			    const title = 净化HTML(titleInput.value);
			    const author = 净化HTML(authorInput.value);
			    const tags = tagsInput.value.split(',').map(s => 净化HTML(s.trim())).filter(Boolean);
			    const password = passwordInput.value;
			
			    if (!originalFile || !title || !password) {
			        显示通知("必须选择关卡文件、填写标题和设置删除密码！", "错误");
			        return;
			    }
			    if (!originalFile.name.endsWith('.json')) {
			        显示通知("请上传.json格式的关卡文件！", "错误");
			        return;
			    }
			
			    const reader = new FileReader();
			    reader.onload = async (e) => {
			        const fileContent = e.target.result;
			        try {
			            const levelData = JSON.parse(fileContent);
			            const levelGameVersion = levelData.游戏版本;
			
			            if (!levelGameVersion) {
			                 throw new Error("关卡文件缺少必需的游戏版本信息！");
			            }
			
			            if (!levelData.isPublished) {
			                throw new Error("只能上传已发布的创意关卡文件！");
			            }
			            const receivedSignature = levelData.signature;
			            if (!receivedSignature) {
			                throw new Error("关卡文件缺少签名，可能已损坏或来自旧版本。");
			            }
			            delete levelData.signature;
			            const dataToVerifyString = JSON.stringify(levelData);
			            const expectedSignature = await 生成签名(dataToVerifyString);
			            if (receivedSignature !== expectedSignature) {
			                throw new Error("关卡文件签名验证失败，可能已被篡改！");
			            }
			            
			            const encodedFileName = safeEncode(originalFile.name);
			            const newSafeFile = new File([fileContent], encodedFileName, {
			                type: originalFile.type,
			                lastModified: originalFile.lastModified,
			            });
			            显示通知('开始上传创意关卡','信息');
			            
			            await uploadLevel(newSafeFile, { title, author, tags, version: levelGameVersion, password });
			            
			            显示通知('关卡上传成功！', '成功');
			            fileInput.value = '';
			            titleInput.value = '';
			            authorInput.value = '';
			            tagsInput.value = '';
			            passwordInput.value = '';
			            刷新关卡列表();
			
			        } catch (error) {
			            console.error("上传验证失败:", error);
			            显示通知('上传失败: ' + error.message, '错误');
			        }
			    };
			    reader.onerror = () => {
			        显示通知('读取文件失败！', '错误');
			    };
			    reader.readAsText(originalFile);
			}
			
			async function uploadLevel(file, {title, author, tags, version, password}) {
			  const storagePath = Date.now() + '_' + file.name;
			  
			  const { error } = await supabase.storage.from('levels').upload(
			      storagePath, 
			      file
			  );
			
			  if(error) throw error;
			
			  const { data: { publicUrl } } = supabase.storage.from('levels').getPublicUrl(storagePath);
			  
			  const { error: err2 } = await supabase.from('levels').insert([{
			      filename: file.name, 
			      title: safeEncode(title),
			      author: safeEncode(author),
			      file_url: publicUrl,
			      tags: tags.map(tag => safeEncode(tag)),
			      version: safeEncode(version),
			      upload_password: password
			  }]);
			  if(err2) throw err2;
			}
			
			async function searchLevels({keyword}) {
			    if (!supabase) {
			        throw new Error("Supabase 客户端未初始化。");
			    }
			    if (!keyword) {
			        return getLevelList();
			    }
			    let { data, error } = await supabase.rpc('search_levels_decoded', {
			        search_keyword: keyword
			    });
			
			    if (error) {
			        console.error("搜索关卡时出错 (RPC):", error);
			        throw error;
			    }
			    return data;
			}
			
			async function getLevelList() {
			  let { data, error } = await supabase.from('levels').select('*, clearances').order('uploaded_at',{ascending:false}).limit(20);
			  if (error) throw error;
			  return data;
			}
			
			async function 刷新关卡列表() {
			    const kw = document.getElementById('搜索关卡输入').value;
			    const listElement = document.getElementById('关卡列表');
			    listElement.innerHTML = '<li>正在加载...</li>';
			
			    try {
			        const lv = kw ? await searchLevels({ keyword: kw }) : await getLevelList();
			        listElement.innerHTML = '';
			
			        if (lv && lv.length > 0) {
			lv.forEach(l => {
			    const decodedTitle = safeDecode(l.title || '');
			    const decodedAuthor = safeDecode(l.author || '');
			    const playCount = l.play_count || 0;
			    const likes = l.likes || 0;
			    const clearances = l.clearances || 0;
			
			    const listItem = document.createElement('li');
			    listItem.style.cssText = "background: rgba(255,255,255,0.08); padding: 15px; border-radius: 6px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;";
			    
			    listItem.addEventListener('click', () => 显示关卡详情(l));
			
			    const contentDiv = document.createElement('div');
			    
			    const titleElement = document.createElement('b');
			    titleElement.style.cssText = "font-size: 1.2em; color: #fff;";
			    titleElement.textContent = decodedTitle;
			    
			    const statsDiv = document.createElement('div');
			    statsDiv.style.cssText = "display: flex; align-items: center; gap: 15px; margin-top: 5px; flex-wrap: wrap;";
			
			    const authorSpan = document.createElement('span');
			    authorSpan.style.cssText = "color: #aaa; font-size: 0.9em;";
			    authorSpan.textContent = `by ${decodedAuthor || '匿名作者'}`;
			
			    const playSpan = document.createElement('span');
			    playSpan.style.cssText = "color: #4caf50; font-size: 0.9em;";
			    playSpan.textContent = `👁️ ${playCount}`;
			
			    const likeSpan = document.createElement('span');
			    likeSpan.style.cssText = "color: #66bb6a; font-size: 0.9em;";
			    likeSpan.textContent = `👍 ${likes}`;
			    
			    const clearanceSpan = document.createElement('span');
			    clearanceSpan.style.cssText = "color: #ffd700; font-size: 0.9em;";
			    clearanceSpan.textContent = `🏆 ${clearances}`;
			
			    statsDiv.appendChild(authorSpan);
			    statsDiv.appendChild(playSpan);
			    statsDiv.appendChild(likeSpan);
			    statsDiv.appendChild(clearanceSpan);
			
			    contentDiv.appendChild(titleElement);
			    contentDiv.appendChild(statsDiv);
			
			    const arrowSpan = document.createElement('span');
			    arrowSpan.style.cssText = "font-size: 1.5em; color: #666;";
			    arrowSpan.textContent = '>';
			
			    listItem.appendChild(contentDiv);
			    listItem.appendChild(arrowSpan);
			    
			    listElement.appendChild(listItem);
			});
			if (typeof gsap === 'undefined') {
			        return;
			    }
			gsap.fromTo(listElement.children, 
			    { autoAlpha: 0, y: 20 }, 
			    { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
			);
			
			        } else {
			listElement.innerHTML = '<li style="text-align: center; color: #888; padding: 20px;">没有找到关卡。</li>';
			        }
			    } catch (error) {
			        console.error("获取关卡列表失败:", error);
			        listElement.innerHTML = '<li style="text-align: center; color: #888; padding: 20px;">加载失败，请检查网络并刷新。</li>';
			    }
			}
			async function 游玩创意关卡(url, level_id) {
			    try {
			        显示通知('正在加载关卡...', '信息', true);
			        当前关卡ID = level_id;
			
			        if (supabase && level_id) {
			            const { error } = await supabase.rpc('increment_play_count', {
			                level_id_to_increment: level_id
			            });
			            if (error) {
			                console.error('增加游玩次数失败:', error);
			            }
			        }
			
			        let levelDataString;
			
			        if (当前加载的关卡数据缓存 && 当前加载的关卡数据缓存.id == level_id) {
			            levelDataString = 当前加载的关卡数据缓存.data;
			        } else {
			            const response = await fetch(url);
			            if (!response.ok) {
			                throw new Error(`网络响应错误: ${response.statusText}`);
			            }
			            levelDataString = await response.text();
			        }
			        
			        document.getElementById('关卡详情界面').style.display = 'none';
			    document.getElementById('创意关卡浏览器').style.display = 'none';
			        await 导入创意关卡(levelDataString);
			
			    } catch (error) {
			        console.error('加载创意关卡失败:', error);
			        显示通知('加载创意关卡失败: ' + error.message, '错误');
			        当前关卡ID = null;
			    }
			}
			
			
			async function 显示关卡详情(关卡数据) {
			    const 详情界面 = document.getElementById('关卡详情界面');
			    const 左侧 = document.getElementById('关卡详情_左侧');
			    const 右侧 = document.getElementById('关卡详情_右侧');
			    const 返回浏览器按钮 = document.getElementById('返回浏览器按钮');
			    if (typeof gsap !== 'undefined') {
			        gsap.set(详情界面, { autoAlpha: 0 });
			    gsap.set(左侧, { autoAlpha: 0, x: -50 });
			    gsap.set(右侧, { autoAlpha: 0, x: 50 });
			    gsap.set(返回浏览器按钮, { autoAlpha: 0, y: 20 });
			    
			    const 动画时间线 = gsap.timeline();
			    动画时间线
			        .to(详情界面, { 
			autoAlpha: 1, 
			duration: 0.3, 
			ease: "power2.inOut",
			onStart: () => {
			    详情界面.style.display = 'flex';
			}
			        })
			        .to([左侧, 右侧], { 
			autoAlpha: 1, 
			x: 0, 
			duration: 0.6, 
			stagger: 0.1, 
			ease: 'power2.out' 
			        }, "-=0.1")
			        .to(返回浏览器按钮, { 
			autoAlpha: 1, 
			y: 0, 
			duration: 0.5, 
			ease: 'power2.out' 
			        }, "-=0.4");
			        
			    }
			    
			
			    const 小地图画布 = document.getElementById('详情_小地图');
			    const 小地图上下文 = 小地图画布.getContext('2d');
			    小地图上下文.clearRect(0, 0, 小地图画布.width, 小地图画布.height);
			    小地图上下文.fillStyle = "#000";
			    小地图上下文.fillRect(0, 0, 小地图画布.width, 小地图画布.height);
			    小地图上下文.fillStyle = "#555";
			    小地图上下文.font = "20px Arial";
			    小地图上下文.textAlign = "center";
			    小地图上下文.textBaseline = "middle";
			    小地图上下文.fillText("加载中...", 小地图画布.width / 2, 小地图画布.height / 2);
			
			    document.getElementById('详情_标题').textContent = safeDecode(关卡数据.title || '无标题');
			    document.getElementById('详情_作者').textContent = `作者: ${safeDecode(关卡数据.author || '匿名')}`;
			    document.getElementById('详情_版本').textContent = `游戏版本: v${safeDecode(关卡数据.version || '未知')}`;
			    document.getElementById('详情_游玩次数').textContent = `👁️ ${关卡数据.play_count || 0}`;
			    document.getElementById('详情_通关次数').textContent = `🏆 ${关卡数据.clearances || 0}`;
			    document.getElementById('详情_赞').textContent = `👍 ${关卡数据.likes || 0}`;
			    document.getElementById('详情_踩').textContent = `👎 ${关卡数据.dislikes || 0}`;
			
			    const 按钮容器 = document.getElementById('详情_操作按钮容器');
			    按钮容器.innerHTML = '';
			
			    const 创建按钮 = (文本, 类名, 点击事件) => {
			        const 按钮 = document.createElement('button');
			        按钮.className = `菜单按钮 ${类名}`;
			        按钮.textContent = 文本;
			        按钮.addEventListener('click', 点击事件);
			        return 按钮;
			    };
			    
			    const 游玩按钮 = 创建按钮('开始游玩', '', () => 游玩创意关卡(关卡数据.file_url, 关卡数据.id));
			    
			    const 评价按钮容器 = document.createElement('div');
			    评价按钮容器.style.cssText = "display: flex; gap: 1rem; justify-content: center;";
			    
			    const 点赞按钮 = 创建按钮('赞 👍', '', () => 点赞或点踩(关卡数据.id, 'likes'));
			    点赞按钮.style.cssText = "flex-grow: 1; padding: 8px 16px; font-size: 1em; min-width: 120px;";
			    
			    const 点踩按钮 = 创建按钮('踩 👎', '', () => 点赞或点踩(关卡数据.id, 'dislikes'));
			    点踩按钮.style.cssText = "flex-grow: 1; padding: 8px 16px; font-size: 1em; min-width: 120px;";
			
			    评价按钮容器.appendChild(点赞按钮);
			    评价按钮容器.appendChild(点踩按钮);
			
			    const 删除按钮 = 创建按钮('删除关卡', '', () => 删除关卡(关卡数据.id));
			    删除按钮.style.background = 'rgba(200, 50, 50, 0.2)';
			    删除按钮.style.borderColor = '#f44336';
			
			    按钮容器.appendChild(游玩按钮);
			    按钮容器.appendChild(评价按钮容器);
			    按钮容器.appendChild(删除按钮);
			
			    try {
			        const response = await fetch(关卡数据.file_url);
			        const levelDataString = await response.text();
			        const levelData = JSON.parse(levelDataString);
			        当前加载的关卡数据缓存 = { id: 关卡数据.id, data: levelDataString };
			        绘制详情小地图(levelData, '详情_小地图');
			    } catch(e) {
			        console.error("加载小地图失败:", e);
			        小地图上下文.clearRect(0, 0, 小地图画布.width, 小地图画布.height);
			        小地图上下文.fillStyle = "#000";
			        小地图上下文.fillRect(0, 0, 小地图画布.width, 小地图画布.height);
			        小地图上下文.fillStyle = "#800";
			        小地图上下文.fillText("地图预览加载失败", 小地图画布.width / 2, 小地图画布.height / 2);
			    }
			}
			function 绘制详情小地图(关卡数据, 画布ID) {
			    const 楼层数据 = 关卡数据.所有地牢层数据[关卡数据.当前层数];
			    if (!楼层数据) return;
			
			    const 小地图 = document.getElementById(画布ID);
			    const 小地图Ctx = 小地图.getContext("2d");
			    小地图.width = 300;
			    小地图.height = 300;
			
			    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
			
			    const 更新边界 = (x, y) => {
			        minX = Math.min(minX, x);
			        minY = Math.min(minY, y);
			        maxX = Math.max(maxX, x);
			        maxY = Math.max(maxY, y);
			    };
			
			    if (楼层数据.房间列表) {
			        楼层数据.房间列表.forEach(房间 => {
			            if (房间) {
			                更新边界(房间.x, 房间.y);
			                更新边界(房间.x + 房间.w - 1, 房间.y + 房间.h - 1);
			            }
			        });
			    }
			
			    if (楼层数据.序列化地牢格子) {
			        楼层数据.序列化地牢格子.forEach((row, y) => {
			            row.forEach((cellData, x) => {
			                if (cellData && cellData.背景类型 === 2) { 
			                    更新边界(x, y);
			                }
			            });
			        });
			    }
			
			    if (minX === Infinity) {
			        小地图Ctx.fillStyle = "#000";
			        小地图Ctx.fillRect(0, 0, 小地图.width, 小地图.height);
			        小地图Ctx.fillStyle = "#555";
			        小地图Ctx.font = "20px Arial";
			        小地图Ctx.textAlign = "center";
			        小地图Ctx.textBaseline = "middle";
			        小地图Ctx.fillText("无地图数据", 小地图.width / 2, 小地图.height / 2);
			        return;
			    }
			
			    const mapWidth = maxX - minX + 1;
			    const mapHeight = maxY - minY + 1;
			    const padding = 10;
			
			    const 缩放比例 = Math.min(
			        (小地图.width - padding * 2) / mapWidth,
			        (小地图.height - padding * 2) / mapHeight
			    );
			
			    const offsetX = (小地图.width - mapWidth * 缩放比例) / 2;
			    const offsetY = (小地图.height - mapHeight * 缩放比例) / 2;
			
			    小地图Ctx.fillStyle = "#1a1a1a";
			    小地图Ctx.fillRect(0, 0, 小地图.width, 小地图.height);
			    
			    小地图Ctx.strokeStyle = "#666666";
			    小地图Ctx.lineWidth = 0.5;
			    if (楼层数据.序列化地牢格子) {
			        楼层数据.序列化地牢格子.forEach((row, y) => {
			            row.forEach((cellData, x) => {
			                if (cellData && cellData.背景类型 === 单元格类型.走廊) { 
			                    const drawX = (x - minX) * 缩放比例 + offsetX;
			                    const drawY = (y - minY) * 缩放比例 + offsetY;
			                    小地图Ctx.strokeRect(drawX, drawY, 缩放比例, 缩放比例);
			                }
			            });
			        });
			    }
			
			    if (楼层数据.房间列表) {
			        楼层数据.房间列表.forEach(房间 => {
			            if (!房间) return;
			            const 是上锁房间 = 楼层数据.上锁房间列表?.some(r => r.id === 房间.id);
			            
			            小地图Ctx.strokeStyle = 是上锁房间 ? "#FFD700" : "#4caf50";
			            小地图Ctx.lineWidth = 1;
			
			            const drawX = (房间.x - minX) * 缩放比例 + offsetX;
			            const drawY = (房间.y - minY) * 缩放比例 + offsetY;
			            const drawW = 房间.w * 缩放比例;
			            const drawH = 房间.h * 缩放比例;
			
			            小地图Ctx.strokeRect(drawX, drawY, drawW, drawH);
			            小地图Ctx.fillStyle = "#4caf5022";
			            小地图Ctx.fillRect(drawX, drawY, drawW, drawH);
			        });
			    }
			    
			    if (楼层数据.序列化地上物品) {
			        楼层数据.序列化地上物品.forEach(itemData => {
			            if (itemData && itemData.类名 === '旗帜') {
			                const 物品配置 = itemData.配置;
			                小地图Ctx.fillStyle = "#FFD700";
			                小地图Ctx.font = `${缩放比例 * 2}px color-emoji`;
			                小地图Ctx.textAlign = "center";
			                小地图Ctx.textBaseline = "middle";
			                小地图Ctx.fillText(物品配置.图标, (物品配置.x - minX) * 缩放比例 + offsetX + (缩放比例 / 2), (物品配置.y - minY) * 缩放比例 + offsetY + (缩放比例 / 2));
			            }
			        });
			    }
			
			    const 玩家起始点 = 楼层数据.玩家初始位置 || {x: 50, y: 50};
			    if (玩家起始点) {
			        小地图Ctx.fillStyle = "#ff0000";
			        小地图Ctx.beginPath();
			        小地图Ctx.arc(
			            (玩家起始点.x - minX) * 缩放比例 + offsetX,
			            (玩家起始点.y - minY) * 缩放比例 + offsetY,
			            Math.max(2, 缩放比例 * 0.75),
			            0,
			            Math.PI * 2
			        );
			        小地图Ctx.fill();
			        小地图Ctx.strokeStyle = "#ffffff";
			        小地图Ctx.lineWidth = 0.5;
			        小地图Ctx.stroke();
			    }
			}
			function 隐藏关卡详情() {
			    const 详情界面 = document.getElementById('关卡详情界面');
			    const 左侧 = document.getElementById('关卡详情_左侧');
			    const 右侧 = document.getElementById('关卡详情_右侧');
			    const 返回浏览器按钮 = document.getElementById('返回浏览器按钮');
			    if (typeof gsap === 'undefined') {
			        详情界面.style.display = 'none';
			        当前加载的关卡数据缓存 = null;
			        return;
			    }
			    gsap.to([左侧, 右侧, 返回浏览器按钮], { 
			        autoAlpha: 0, 
			        y: 10, 
			        duration: 0.3, 
			        ease: 'power2.in' 
			    });
			    
			    gsap.to(详情界面, {
			        autoAlpha: 0,
			        duration: 0.4,
			        ease: "power2.in",
			        onComplete: () => {
			详情界面.style.display = 'none';
			当前加载的关卡数据缓存 = null;
			        }
			    });
			}
			
			async function 点赞或点踩(关卡ID, 操作类型) {
			    const 投票记录键 = `voted_${关卡ID}`;
			    if (localStorage.getItem(投票记录键)) {
			        显示通知("你已经对这个关卡投过票了！", "警告");
			        return;
			    }
			
			    try {
			        const rpc名称 = 操作类型 === 'likes' ? 'increment_likes' : 'increment_dislikes';
			        const { error } = await supabase.rpc(rpc名称, {
			            level_id_to_increment: 关卡ID
			        });
			
			        if (error) throw error;
			        
			        localStorage.setItem(投票记录键, 'true');
			        显示通知("投票成功！", "成功");
			
			        const 计数元素 = document.getElementById(操作类型 === 'likes' ? '详情_赞' : '详情_踩');
			        const [图标, 旧计数值] = 计数元素.textContent.split(' ');
			        计数元素.textContent = `${图标} ${parseInt(旧计数值) + 1}`;
			
			    } catch (error) {
			        console.error('投票失败:', error);
			        显示通知('投票失败: ' + error.message, '错误');
			    }
			}
			
			            async function 删除关卡(关卡ID) {
			    const 密码 = prompt("请输入你上传时设置的删除密码：");
			    if (密码 === null) return;
			    if (密码.trim() === "") {
			        显示通知("密码不能为空！", "错误");
			        return;
			    }
			
			    try {
			        显示通知("正在验证密码...", "信息");
			        const { data: fileUrl, error: rpcError } = await supabase.rpc('verify_level_password_and_get_url', {
			            level_id_to_check: 关卡ID,
			            password_to_check: 密码
			        });
			
			        if (rpcError) throw rpcError;
			
			        if (fileUrl === 'LEVEL_NOT_FOUND' || fileUrl === 'PASSWORD_INCORRECT' || !fileUrl) {
			            显示通知("删除失败：密码错误或关卡不存在。", '错误');
			            return;
			        }
			        
			        显示通知("正在从存储中删除文件...", "信息");
			        const filePath = fileUrl.split('/levels/')[1];
			        const { error: storageError } = await supabase.storage.from('levels').remove([filePath]);
			
			        if (storageError) {
			            console.error("存储文件删除失败:", storageError);
			            throw new Error("存储文件删除失败: " + storageError.message);
			        }
			
			        显示通知("正在删除数据库记录...", "信息");
			        const { error: dbError } = await supabase
			            .from('levels')
			            .delete()
			            .match({ id: 关卡ID });
			
			        if (dbError) throw dbError;
			
			        显示通知('关卡已成功删除！', '成功');
			        隐藏关卡详情();
			        刷新关卡列表();
			
			    } catch (error) {
			        console.error('删除关卡时出错:', error);
			        显示通知('删除关卡时出错: ' + error.message, '错误');
			    }
			}
			
			
			function 显示胜利界面() {
			    if (游戏状态 === '图鉴') return;
			
			    const 是编辑器游玩模式 = 游戏状态 === '编辑器游玩';
			    游戏状态 = "胜利";
			    if (是否是自定义关卡 && 当前关卡ID) {
			        supabase.rpc('increment_clearances', { level_id_to_increment: 当前关卡ID }).then(({ error }) => {
			            if (error) console.error('增加通关次数失败:', error);
			        });
			    }
			
			    const 胜利遮罩 = document.createElement("div");
			    胜利遮罩.id = "死亡遮罩";
			    胜利遮罩.style.background = 'linear-gradient(45deg, rgba(0, 20, 0, 0.9) 0%, rgba(0, 60, 0, 0.95) 100%)';
			
			    let 按钮HTML = ``;
			    if (是编辑器游玩模式 && !临时测试) {
			        按钮HTML = `
			            <button class="重生按钮" id="返回编辑器按钮_胜利界面" style="border-color: #ffd700;">返回编辑器</button>
			            <button class="重生按钮" id="发布关卡按钮" style="border-color: #4caf50;">发布关卡</button>
			        `;
			    } else {
			         按钮HTML = `<button class="重生按钮" id="返回主菜单按钮_胜利" style="border-color: #ffd700;">返回主菜单</button>`;
			    }
			        
			    胜利遮罩.innerHTML = `
			        <div class="死亡内容容器" style="border-color: #ffd700;">
			            <div class="骷髅容器">
			                <div class="动态骷髅" style="text-shadow: 0 0 30px #ffd700; animation: none;">🏆</div>
			            </div>
			            <h2 style="color: #ffd700; text-shadow: 0 0 10px #ffd700;">胜利！</h2>
			            <div class="重生选项" style="flex-direction: row; gap: 15px;">
			                ${按钮HTML}
			            </div>
			        </div>
			    `;
			    
			    if (是编辑器游玩模式) {
			        document.getElementById('返回编辑器按钮').style.display = 'none';
			        胜利遮罩.querySelector("#返回编辑器按钮_胜利界面").addEventListener("click", () => {
			            胜利遮罩.remove();
			            返回编辑器模式(); 
			        });
			        胜利遮罩.querySelector("#发布关卡按钮").addEventListener("click", () => {
			            发布关卡();
			            胜利遮罩.remove();
			            返回编辑器模式();
			        });
			    } else {
			        胜利遮罩.querySelector("#返回主菜单按钮_胜利").addEventListener("click", () => {
			            胜利遮罩.remove();
			            
			            重置所有游戏状态();
			            显示主菜单();
			        });
			    }
			
			    document.body.appendChild(胜利遮罩);
			}
			
			function 切换编辑器工具栏模式() {
			    const 模式顺序 = ['常显', '常隐'];
			    const 当前索引 = 模式顺序.indexOf(编辑器工具栏模式);
			    编辑器工具栏模式 = 模式顺序[(当前索引 + 1) % 模式顺序.length];
			    应用编辑器工具栏模式();
			    显示通知(`工具栏模式: ${编辑器工具栏模式}`, '信息');
			}
			
			function 应用编辑器工具栏模式() {
			    const 工具栏 = document.getElementById('编辑器工具栏');
			    const 笔刷栏 = document.getElementById('笔刷工具容器');
			    
			    const 切换按钮 = document.getElementById('hudToggle');
			    
			    const 图标 = {  '常显': '👁️', '常隐': '😑' };
			    切换按钮.textContent = 图标[编辑器工具栏模式];
			
			    
			    
			    const hideToolbar = () => {
			        工具栏.style.opacity = '0';
			        工具栏.style.pointerEvents = 'none';
			        笔刷栏.style.opacity = '0';
			        笔刷栏.style.pointerEvents = 'none';
			    };
			
			    const showToolbar = () => {
			        工具栏.style.opacity = '1';
			        工具栏.style.pointerEvents = 'auto';
			        笔刷栏.style.opacity = '1';
			        笔刷栏.style.pointerEvents = 'auto';
			    };
			
			    if (编辑器工具栏模式 === '常显') {
			        showToolbar();
			        工具栏.onmouseenter = null;
			        工具栏.onmouseleave = null;
			    } else if (编辑器工具栏模式 === '常隐') {
			        hideToolbar();
			        工具栏.onmouseenter = null;
			        工具栏.onmouseleave = null;
			    } 
			}
			function 编辑器鼠标按下处理(e) { 编辑器画布事件处理(e.clientX, e.clientY, 'start', e); }
			function 编辑器鼠标移动处理(e) { 编辑器画布事件处理(e.clientX, e.clientY, 'move', e); }
			function 编辑器鼠标抬起处理(e) { 编辑器画布事件处理(e.clientX, e.clientY, 'end', e); }
			function 编辑器触摸开始处理(e) { const touch = e.touches[0]; 编辑器画布事件处理(touch.clientX, touch.clientY, 'start', e); }
			function 编辑器触摸移动处理(e) { const touch = e.touches[0]; 编辑器画布事件处理(touch.clientX, touch.clientY, 'move', e); }
			function 编辑器触摸结束处理(e) { const touch = e.changedTouches[0]; 编辑器画布事件处理(touch.clientX, touch.clientY, 'end', e); }
			function 进入地图编辑器() {
			    document.getElementById("全局设置窗口").style.display = 'none';
			    游戏状态 = "地图编辑器";
			    document.body.classList.add("地图编辑器模式");
			    document.body.classList.remove("游戏进行中", "编辑器游玩模式");
			    隐藏主菜单();
			
			    重置所有游戏状态();
			    
			    游戏状态 = "地图编辑器";
			    最高教程阶段 = 6;
			    document.body.classList.add("地图编辑器模式");
			
			    地牢 = Array(地牢大小).fill().map((_, y) => Array(地牢大小).fill().map((_, x) => new 单元格(x, y)));
			    
			    当前层数 = -1; 
			    玩家初始位置 = { x: Math.floor(地牢大小 / 2), y: Math.floor(地牢大小 / 2) };
			    玩家.x = 玩家初始位置.x;
			    玩家.y = 玩家初始位置.y;
			
			    初始化canvas();
			    if(已初始化 > 0) 初始化装备系统();
			    if(已初始化 > 0) 初始化背包事件监听();
			    初始化编辑器工具栏();
			    应用编辑器工具栏模式();
			    
			    获取所有可用的定义(); 
			    
			    玩家背包.clear(); 
			    填充编辑器背包();
			    
			    const canvasElement = document.getElementById('dungeonCanvas');
			    canvas.removeEventListener("touchstart", 处理地图点击);
			    canvas.removeEventListener("click", 处理地图单击);
			
			    canvas.addEventListener('mousedown', 编辑器鼠标按下处理);
			    canvas.addEventListener('mousemove', 编辑器鼠标移动处理);
			    canvas.addEventListener('mouseup', 编辑器鼠标抬起处理);
			    canvas.addEventListener('touchstart', 编辑器触摸开始处理);
			    canvas.addEventListener('touchmove', 编辑器触摸移动处理);
			    canvas.addEventListener('touchend', 编辑器触摸结束处理);
			    canvas.addEventListener('contextmenu', 编辑器右键处理);
			
			    更新视口();
			    生成怪物引入计划();
			    const 初始房间大小 = 10;
const 房间起始X = Math.floor(玩家初始位置.x - 初始房间大小 / 2);
const 房间起始Y = Math.floor(玩家初始位置.y - 初始房间大小 / 2);
const 初始房间 = {
    x: 房间起始X, y: 房间起始Y, w: 初始房间大小, h: 初始房间大小,
    id: 0, 名称: '房间_0', 类型: '房间', 已探索: true, 门: []
};
房间列表.push(初始房间);
房间列表.sort((a,b)=>a.id-b.id)
放置房间(初始房间);
生成墙壁();
//已访问房间.add(0);
			    绘制小地图();
			    if(已初始化 > 0) 动画帧();
			    
			    saveEditorState();
			    updateUndoRedoButtons();
			    显示通知("已进入地图编辑器", "信息");
			}
			function 初始化编辑器工具栏() {
			    const 工具栏 = document.getElementById("编辑器工具栏");
			    工具栏.style.display = 'flex';
			
			    document.getElementById('全局设置按钮').onclick = 打开全局设置窗口;
			    document.getElementById('编辑器撤回按钮').onclick = undoEditorAction;
			    document.getElementById('编辑器重做按钮').onclick = redoEditorAction;
			    
			    
			    document.getElementById('编辑器游玩按钮').onclick = 进入编辑器游玩模式;
			    document.getElementById('返回编辑器按钮').onclick = 返回编辑器模式;

				const 笔刷工具容器 = document.getElementById('笔刷工具容器');
				const 笔刷设置容器 = document.getElementById('笔刷设置容器');
				const 工具选择 = document.getElementById('编辑器工具选择');
				const 形状选择 = document.getElementById('笔刷形状选择');
				const 尺寸滑块 = document.getElementById('笔刷尺寸滑块');
				const 尺寸值 = document.getElementById('笔刷尺寸值');

				工具选择.onchange = () => {
					编辑器状态.笔刷模式 = 工具选择.value;
					笔刷设置容器.style.display = (编辑器状态.笔刷模式 === '笔刷') ? 'flex' : 'none';
				};

				形状选择.onchange = () => {
					编辑器状态.笔刷形状 = 形状选择.value;
				};

				尺寸滑块.oninput = () => {
					编辑器状态.笔刷半径 = parseInt(尺寸滑块.value);
					尺寸值.textContent = 尺寸滑块.value;
				};
			}
			let 编辑器状态备份 = null;
			let 编辑器玩家 = {...玩家};
			
			function saveEditorState() {
			    const currentState = 导出地图();
			    if (undoStack.length > 0 && undoStack[undoStack.length - 1] === currentState) {
			        return;
			    }
			    undoStack.push(currentState);
			    if (undoStack.length > MAX_UNDO_STEPS) {
			        undoStack.shift();
			    }
			    redoStack = [];
			    updateUndoRedoButtons();
			}
			
			function undoEditorAction() {
			    if (undoStack.length <= 1) {
			        显示通知("没有更多可撤回的操作", "警告");
			        return;
			    }
			    
			    const currentState = undoStack.pop();
			    redoStack.push(currentState);
			    编辑器玩家 = {...玩家}
			    
			    const previousState = undoStack[undoStack.length - 1];
			    导入地图(previousState);
			    
			    updateUndoRedoButtons();
			    玩家.x=编辑器玩家.x
			    玩家.y=编辑器玩家.y
			    更新视口()
			}
			
			function redoEditorAction() {
			    if (redoStack.length === 0) {
			        显示通知("没有可重做的操作", "警告");
			        return;
			    }
			    
			    const nextState = redoStack.pop();
			    undoStack.push(nextState);
			    let 编辑器玩家 = {...玩家}
			    导入地图(nextState);
			    玩家.x=编辑器玩家.x
			    玩家.y=编辑器玩家.y
			    更新视口()
			    updateUndoRedoButtons();
			}
			
			function updateUndoRedoButtons() {
			    const undoButton = document.getElementById('编辑器撤回按钮');
			    const redoButton = document.getElementById('编辑器重做按钮');
			    if(undoButton) undoButton.disabled = undoStack.length <= 1;
			    if(redoButton) redoButton.disabled = redoStack.length === 0;
			}
			
			            function generateDungeonTemplate() {
			    const levelInput = prompt("请输入要生成的模板地牢层数 (例如: 3):", "3");
			    if (levelInput === null) return;
			    
			    const levelNumber = parseInt(levelInput);
			    if (isNaN(levelNumber) || levelNumber < 0) {
			        显示通知("请输入一个有效的非负整数层数！", "错误");
			        return;
			    }
			
			    if (!confirm(`确定要生成第 ${levelNumber} 层的模板吗？这将覆盖当前编辑器中的所有内容。`)) {
			        return;
			    }
			
			    saveEditorState();
			    
			    重置所有游戏状态();
			    游戏状态 = '游戏中';
			    当前层数 = levelNumber;
			    if (当前层数 === 5) {
			            //初始化随机数生成器(当前游戏种子);
			            生成迷宫关卡();
			        } else if (当前层数 === 10) {
			            //初始化随机数生成器(当前游戏种子);
			            生成法师图书馆();
			        } else if (当前层数 === 15) {
			            //初始化随机数生成器(当前游戏种子);
			            生成最终首领楼层();
			        } else {
			    生成地牢();
			    //更新洞穴视野();
			    }
			    
			    const 初始房间 = 房间列表.find(r => r.id === 0);
			    if (初始房间) {
			        初始房间.已探索 = true;
			    }
			
			    let 胜利旗帜位置 = null;
			    for (let y = 0; y < 地牢大小; y++) {
			        for (let x = 0; x < 地牢大小; x++) {
			            const cell = 地牢[y][x];
			            if (cell.关联物品 && (cell.类型 === 单元格类型.楼梯下楼 || cell.类型 === 单元格类型.楼梯上楼)) {
			                if (cell.类型 === 单元格类型.楼梯下楼) {
			                    胜利旗帜位置 = {x, y};
			                }
			                cell.关联物品 = null;
			                cell.类型 = null;
			            } else if (cell.关联物品 instanceof 寻宝戒指) {
			                cell.关联物品.自定义数据.set('生效层数',-1);
			            } else if (cell.关联物品 instanceof 隐形虫洞陷阱) {
			                cell.关联物品 = null;
			                cell.类型 = null;
			                
			            } else if (cell.关联物品 instanceof 配方卷轴) {
			                cell.关联物品 = null;
			                cell.类型 = null;
			                
			            } else if (cell.关联物品 instanceof 召唤怪物陷阱) {
			                cell.关联物品.自定义数据.set('怪物层级',当前层数);
			            } else if (cell.关联物品 instanceof 钥匙) {
			                cell.关联物品.自定义数据.set('地牢层数',-1);
			            } else if (cell.关联物品 instanceof 神秘商人) {
			                cell.关联物品.自定义数据.set('商品层数',当前层数);
			                cell.关联物品.生成库存(Math.max(cell.关联物品.自定义数据.get('商品层数'), 0));
			            } else if (cell.关联物品 instanceof 探险家) {
			                cell.关联物品.自定义数据.set('需求层数',当前层数);
			                cell.关联物品.生成收购需求(cell.关联物品.自定义数据.get('需求层数'));
			            }
			        }
			    }
			    if (胜利旗帜位置) {
			        放置物品到单元格(new 旗帜(), 胜利旗帜位置.x, 胜利旗帜位置.y);
			    }
			
			    生成并放置随机配方卷轴(当前层数);
			    
			    游戏状态 = '地图编辑器';
			    当前层数 = -1;
			    处理房间状态();
			    更新编辑器快速访问栏();
			    
			    填充编辑器背包();
			    绘制小地图();
			
			    更新视口();
			    
			    saveEditorState();
			    显示通知(`已生成第 ${levelNumber} 层地牢模板。`, '成功');
			}
			function 返回编辑器模式() {
			    游戏状态 = '地图编辑器';
			    if (编辑器状态备份) {
			        编辑器玩家 = {...玩家}
			        导入地图(编辑器状态备份);
			        if (位置是否可用(编辑器玩家.x,编辑器玩家.y,false)) {
			        玩家.x=编辑器玩家.x
			        玩家.y=编辑器玩家.y
			        }
			        更新视口()
			        编辑器状态备份 = null;
			    }
			    临时测试 = false;
			    
			    编辑器状态.模式 = '编辑';
			    document.body.classList.add('地图编辑器模式');
			    document.body.classList.remove('游戏进行中');
			    document.body.classList.remove('编辑器游玩模式');
			    document.getElementById('编辑器工具栏').style.display = 'flex';
			   
			    document.getElementById('返回编辑器按钮').style.display = 'none';
			    应用编辑器工具栏模式();
			
			    canvas.removeEventListener("touchstart", 处理地图点击);
			    canvas.removeEventListener("click", 处理地图单击);
			
			    canvas.addEventListener('mousedown', 编辑器鼠标按下处理);
			    canvas.addEventListener('mousemove', 编辑器鼠标移动处理);
			    canvas.addEventListener('mouseup', 编辑器鼠标抬起处理);
			    canvas.addEventListener('touchstart', 编辑器触摸开始处理);
			    canvas.addEventListener('touchmove', 编辑器触摸移动处理);
			    canvas.addEventListener('touchend', 编辑器触摸结束处理);
			    canvas.addEventListener('contextmenu', 编辑器右键处理);
			
			    玩家背包.clear();
			    填充编辑器背包();
			    
			    更新编辑器快速访问栏();
			
			    绘制();
			    
			}
			
			function 创建并放置房间(起始横坐标, 起始纵坐标, 结束横坐标, 结束纵坐标) {
			    const 左上角横坐标 = Math.min(起始横坐标, 结束横坐标);
			    const 左上角纵坐标 = Math.min(起始纵坐标, 结束纵坐标);
			    const 宽度 = Math.abs(起始横坐标 - 结束横坐标) + 1;
			    const 高度 = Math.abs(起始纵坐标 - 结束纵坐标) + 1;
			
			    for(let 纵坐标=左上角纵坐标; 纵坐标 < 左上角纵坐标 + 高度; 纵坐标++) {
			        for(let 横坐标=左上角横坐标; 横坐标 < 左上角横坐标 + 宽度; 横坐标++) {
			            if (房间地图[纵坐标]?.[横坐标] !== -1 && 房间地图[纵坐标]?.[横坐标] !== undefined) {
			                显示通知("无法创建房间，与其他房间重叠！", "错误");
			                return;
			            }
			        }
			    }
			
			    let 新ID = 房间列表.length
			    
			        let i = 0
			        while(房间列表.some(item=>item.id==房间列表.length+i)) {
			        i++;
			        
			        }
			        新ID=房间列表.length+i
			    
			    
			    const 新房间 = {
			        x: 左上角横坐标, y: 左上角纵坐标,
			        w: 宽度,
			        h: 高度,
			        id: 新ID,
			        名称: `房间_${新ID}`,
			        类型: '房间',
			        已探索: false,
			        门: []
			    };
			
			    for(let 纵坐标 = 左上角纵坐标; 纵坐标 < 左上角纵坐标 + 高度; 纵坐标++) {
			        for(let 横坐标 = 左上角横坐标; 横坐标 < 左上角横坐标 + 宽度; 横坐标++) {
			            地牢[纵坐标][横坐标].背景类型 = 单元格类型.房间;
			            
			            房间地图[纵坐标][横坐标] = 新ID;
			        }
			    }
			    房间列表[新ID] = 新房间;
			   
			    const 边缘格子列表 = [];
			    for (let 纵坐标 = 左上角纵坐标; 纵坐标 < 左上角纵坐标 + 高度; 纵坐标++) {
			        for (let 横坐标 = 左上角横坐标; 横坐标 < 左上角横坐标 + 宽度; 横坐标++) {
			            if (横坐标 === 左上角横坐标 || 横坐标 === 左上角横坐标 + 宽度 - 1 || 纵坐标 === 左上角纵坐标 || 纵坐标 === 左上角纵坐标 + 高度 - 1) {
			                边缘格子列表.push({x: 横坐标, y: 纵坐标});
			            }
			        }
			    }
			    
			    for(const 格子坐标 of 边缘格子列表) {
			        const 方向列表 = [{dx:0, dy:-1}, {dx:0, dy:1}, {dx:-1, dy:0}, {dx:1, dy:0}];
			        for (const 方向 of 方向列表) {
			            const 邻居横坐标 = 格子坐标.x + 方向.dx;
			            const 邻居纵坐标 = 格子坐标.y + 方向.dy;
			            
			            
			            if (邻居横坐标 < 0 || 邻居横坐标 >= 地牢大小 || 邻居纵坐标 < 0 || 邻居纵坐标 >= 地牢大小) continue;
			            
			            const 邻居单元格 = 地牢[邻居纵坐标][邻居横坐标];
			            
			            
			            if (邻居单元格 && (邻居单元格.背景类型 === 单元格类型.门 || 邻居单元格.背景类型 === 单元格类型.上锁的门)) {
			                const 门实例 = 门实例列表.get(邻居单元格.标识);
			                
			                if (门实例) {
			                    // 1. 将门关联到新房间
			                    门实例.房间ID = 新房间.id;
			                    
			                    // 2. 将门添加到新房间的门列表中（防止重复）
			                    if (!新房间.门.some(门位置 => 门位置.x === 邻居横坐标 && 门位置.y === 邻居纵坐标)) {
			                        新房间.门.push({x: 邻居横坐标, y: 邻居纵坐标});
			                    }
			                    
			                    // 3. 同步属性
			                    const 是否房间已上锁 = 上锁房间列表.some(房间 => 房间.id === 新房间.id);
			                    const 房间颜色索引 = 是否房间已上锁 ? 上锁房间列表.find(房间 => 房间.id === 新房间.id).颜色索引 : 颜色表.length;
			
			                    邻居单元格.背景类型 = 是否房间已上锁 ? 单元格类型.上锁的门 : 单元格类型.门;
			                    门实例.是否上锁 = 是否房间已上锁;
			                    
			                    // 同步颜色索引
			                    邻居单元格.颜色索引 = 房间颜色索引;
			                }
			            }
			    
			        }
			    }
			   
			
			    生成墙壁();
			    绘制();
			    打开属性编辑器(新房间, 左上角横坐标, 左上角纵坐标);
			}
			
			function 填充编辑器背包() {
			    const 容器 = document.getElementById("背包物品栏");
			    const 弹窗 = document.querySelector(".背包弹窗");
			    
			    容器.innerHTML = "";
			    玩家背包.clear(); 
			    
			    const { items: allItems, monsters: allMonsters } = 获取所有可用的定义();
			
			    const 分区 = {
			        '工具': [],
			        '背景': [],
			        '物品': [],
			        '怪物': []
			    };
			
			    const 工具和地形 = [
			        { 名称: '手形/编辑', 类型: '工具', 图标: 图标映射.手形 },
			        { 名称: '删除工具', 类型: '工具', 图标: 图标映射.删除 },
			        { 名称: '房间工具', 类型: '工具', 图标: 图标映射.房间工具 },
			        { 名称: '复制工具', 类型: '工具', 图标: 图标映射.复制工具 },
			        { 名称: '房间编辑工具', 类型: '工具', 图标: 图标映射.房间编辑 },
			        { 名称: '房间地板', 类型: '背景', 绘制类型: 单元格类型.房间, 图标: 图标映射.地板 },
			        { 名称: '走廊', 类型: '背景', 绘制类型: 单元格类型.走廊, 图标: 图标映射.走廊 },
			        { 名称: '墙壁', 类型: '背景', 绘制类型: 单元格类型.墙壁, 图标: 图标映射.墙壁 },
			        { 名称: '门', 类型: '背景', 绘制类型: 单元格类型.门, 图标: 图标映射.门 },
			        { 名称: '上锁的门', 类型: '背景', 绘制类型: 单元格类型.上锁的门, 图标: 图标映射.锁 },
			        { 名称: '卷轴滚动墙', 类型: '物品', 图标: 图标映射.卷轴滚动墙, 类: 卷轴滚动墙 },
			        { 名称: '刷怪笼', 类型: '物品', 类: 刷怪笼, 图标: 图标映射.刷怪笼 },
			        { 名称: '传送带', 类型: '物品', 类: 传送带, 图标: 图标映射.传送带 },
			        { 名称: '红蓝开关', 类型: '物品', 类: 红蓝开关, 图标: 图标映射.红蓝开关},
			        { 名称: '红砖块', 类型: '物品', 类: 红砖块, 图标: 图标映射.红砖块},
			        { 名称: '蓝砖块', 类型: '物品', 类: 蓝砖块, 图标: 图标映射.蓝砖块},
			        { 名称: '绿紫开关', 类型: '物品', 类: 绿紫开关, 图标: 图标映射.绿紫开关 },
			        { 名称: '绿砖块', 类型: '物品', 类: 绿砖块, 图标: 图标映射.绿砖块 },
			        { 名称: '紫砖块', 类型: '物品', 类: 紫砖块, 图标: 图标映射.紫砖块 },
			        { 名称: '开关脉冲器', 类型: '物品', 图标: 图标映射.开关脉冲器, 类: 开关脉冲器 },
			        { 名称: '钥匙', 类型: '物品', 类: 钥匙,默认配置:{地牢层数:-1} },
			        { 名称: '胜利旗帜', 类型: '物品', 图标: 图标映射.旗帜, 类: 旗帜 },
			        { 名称: '告示牌', 类型: '物品', 图标: 图标映射.告示牌, 类: 告示牌 },
			        { 名称: '存档点', 类型: '物品', 图标: 图标映射.存档点, 类: 存档点 },
			        { 名称: '传送门', 类型: '物品', 图标: 图标映射.传送门, 类: 传送门 },
			        { 名称: '沉浸式传送门', 类型: '物品', 类: 沉浸式传送门, 图标: 图标映射.沉浸式传送门 },
			    ];
			
			    分区.工具.push(...工具和地形.filter(t => t.类型 === '工具'));
			    分区.背景.push(...工具和地形.filter(t => t.类型 === '背景'));
			    分区.物品.push(...工具和地形.filter(t => t.类型 === '物品'));
			    分区.物品.push(...allItems.filter(item => item.类.name !== '隐形虫洞陷阱' && item.类.name !== '配方卷轴'));
			    分区.怪物.push(...allMonsters);
			    分区.怪物.push({ 类: 巡逻怪物 }, { 类: 同步怪物 });
			    
			    Object.keys(分区).forEach(分区名 => {
			        const 分区标题 = document.createElement('h4');
			        分区标题.textContent = 分区名;
			        分区标题.style.cssText = "width: 100%; text-align: center; color: #4caf50; border-bottom: 1px solid #4caf50; margin: 10px 0; padding-bottom: 5px;";
			        容器.appendChild(分区标题);
			
			        const addedNames = new Set();
			        分区[分区名].forEach(def => {
			let 实例;
			let itemElem;
			let isVirtual = false;
			let itemName;
			if (def.类型 === '背景' || def.类型 === '工具') {
			        实例 = { 
			        名称: def.名称, 
			        图标: def.图标, 
			        品质: 1, 
			        颜色索引: 5, 
			        获取名称: () => def.名称, 
			        显示图标: def.图标, 
			        类型: 分区名, 
			        绘制类型: def.绘制类型,
			        类: def.类,
			    };
			    itemName = def.名称;
			    isVirtual = true;
			} else if (分区名 === '怪物') {
			    实例 = new def.类({玩家放置:true});
			    itemName = 实例.类型;
			    实例.名称 = itemName;
			    isVirtual = false;
			} else {
			    
			    const Cls = def.类 || def;
			    
			    const 构造配置 = def.默认配置 || {};
			    实例 = new Cls(构造配置);
			    itemName = 实例.名称;
			    实例.堆叠数量 = 1;
			    if (实例 instanceof 卷轴类) {
			        实例.自定义数据.set('已解锁', true);
			    }
			    isVirtual = false;
			}
			
			if (!itemName || addedNames.has(itemName)) return;
			addedNames.add(itemName);
			
			if (isVirtual) {
			    if (def.类) {
			        实例 = new def.类({});
			        isVirtual = false;
			    }
			}
			
			if (isVirtual) {
			    itemElem = document.createElement('div');
			    itemElem.className = '物品条目 hover';
			    itemElem.innerHTML = `
			        <div class="物品图标" style="font-size: 2em; color: ${实例.颜色 || '#FFFFFF'};">${实例.图标 || 实例.显示图标}</div>
			        <div class="物品名称">${实例.名称 || 实例.获取名称()}</div>
			    `;
			} else if (实例 instanceof 怪物) {
			    itemElem = document.createElement('div');
			    itemElem.className = '物品条目 hover';
			    itemElem.innerHTML = `
			        <div class="物品图标" style="font-size: 2em; color: ${实例.颜色 || '#FFFFFF'};">${实例.图标}</div>
			        <div class="物品名称">${实例.类型}</div>
			    `;
			} else {
			        if (实例 && typeof 实例?.生成显示元素 === 'function') {
			        itemElem = 实例?.生成显示元素();
			        itemElem?.querySelectorAll('.装备按钮, .丢弃按钮, .使用按钮, .上屏按钮')?.forEach(btn => btn?.remove());
			    }
			}
			
			if (itemElem) {
			    itemElem.onclick = (e) => {
			        e.stopPropagation();
			        设置编辑器选中项(实例);
			        document.querySelectorAll('#背包物品栏 .物品条目').forEach(el => el.classList.remove('active'));
			        itemElem.classList.add('active');
			        显示通知(`已选中: ${实例.名称 || 实例.类型}`, '信息');
			    };
			
			    容器.appendChild(itemElem);
			}
			        });
			    });
			}
			function 推开生物(x, y) {
			    const 单元格 = 地牢[y]?.[x];
			    if (!单元格 || !单元格.关联怪物) return;
			
			    const 怪物 = 单元格.关联怪物;
			    const 方向 = [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [1, -1], [-1, 1], [1, 1]];
			
			    for (const [dx, dy] of 方向) {
			        const 新X = x + dx;
			        const 新Y = y + dy;
			        const 目标单元格 = 地牢[新Y]?.[新X];
			        if (位置是否可用(新X,新Y,false)) {
			怪物.恢复背景类型();
			怪物.x = 新X;
			怪物.y = 新Y;
			怪物.处理地形效果()
			怪物.保存新位置类型(新X, 新Y);
			地牢[新Y][新X].类型 = 单元格类型.怪物;
			地牢[新Y][新X].关联怪物 = 怪物;
			添加日志(`${怪物.类型} 被砖块顶到了 (${新X}, ${新Y})!`, "信息");
			怪物动画状态.set(怪物, {
			    旧逻辑X: x,
			    旧逻辑Y: y,
			    目标逻辑X: 新X,
			    目标逻辑Y: 新Y,
			    视觉X: x,
			    视觉Y: y,
			    动画开始时间: Date.now(),
			    正在动画: true,
			});
			return;
			        }
			    }
			}
			function 更新所有门朝向() {
			    for (let 纵坐标 = 0; 纵坐标 < 地牢大小; 纵坐标++) {
			        for (let 横坐标 = 0; 横坐标 < 地牢大小; 横坐标++) {
			            const 单元格对象 = 地牢[纵坐标]?.[横坐标];
			            if (单元格对象 && (单元格对象.背景类型 === 单元格类型.门 || 单元格对象.背景类型 === 单元格类型.上锁的门)) {
			                let 方向 = 'NS'; 
			                const 左邻居可通行 = 地牢[纵坐标]?.[横坐标 - 1] && 地牢[纵坐标][横坐标 - 1].背景类型 !== 单元格类型.墙壁;
			                const 右邻居可通行 = 地牢[纵坐标]?.[横坐标 + 1] && 地牢[纵坐标][横坐标 + 1].背景类型 !== 单元格类型.墙壁;
			                if (左邻居可通行 && 右邻居可通行) {
			                    方向 = 'EW';
			                }
			                单元格对象.doorOrientation = 方向;
			            }
			        }
			    }
			}
			
			function 编辑器放置逻辑(横坐标, 纵坐标) {
			    if (编辑器状态.当前选中?.名称 === '房间编辑工具') {
			        const 房间标识 = 房间地图[纵坐标]?.[横坐标];
			        if (房间标识 !== -1 && 房间列表[房间标识]) {
			打开属性编辑器(房间列表[房间标识], 横坐标, 纵坐标);
			        } else {
			const 单元格对象 = 地牢[纵坐标]?.[横坐标];
			if (单元格对象) 打开属性编辑器(单元格对象, 横坐标, 纵坐标);
			        }
			        return;
			    }
			    const 选中项 = 编辑器状态.当前选中;
			    const 单元格对象 = 地牢[纵坐标]?.[横坐标];
			    if (!单元格对象) return;
			
			    if (!选中项 || 编辑器状态.模式 === '编辑') {
			        打开属性编辑器(单元格对象, 横坐标, 纵坐标);
			        return;
			    }
			
			    if (选中项.名称 === '删除工具') {
			        if (单元格对象.关联物品 || 单元格对象.关联怪物) {
			if (单元格对象.关联物品) {
			所有计时器 = 所有计时器.filter(计时器 => 计时器.唯一标识.toString() !== 单元格对象.关联物品?.唯一标识.toString());
			所有传送门 = 所有传送门.filter(item => item.唯一标识.toString() !== 单元格对象.关联物品?.唯一标识.toString());
			        if (单元格对象.关联物品.唯一标识 && 玩家背包.has(单元格对象.关联物品.唯一标识)) {
			        处理销毁物品(单元格对象.关联物品.唯一标识, true);
			        }
			        
			        单元格对象.关联物品 = null;
			}
			if (单元格对象.关联怪物) {
			    let 现有怪物=单元格对象.关联怪物
			    if (现有怪物 instanceof 蜈蚣怪物) {
			        现有怪物?.身体部位?.forEach(item=>{item.移除自身(true)})
			        现有怪物.移除自身()
			    } else if (现有怪物 instanceof 蜈蚣部位) {
			        现有怪物?.主体?.身体部位?.forEach(item=>{item.移除自身(true)})
			        现有怪物.主体?.移除自身()
			    }
			    所有怪物 = 所有怪物.filter(怪物 => 怪物 !== 单元格对象.关联怪物);
			    单元格对象.关联怪物 = null;
			}
			单元格对象.类型 = null;
			        } else {
			重置单元格(横坐标, 纵坐标);
			        }
			    } else {
			        const 现有怪物 = 单元格对象.关联怪物;
			        const 现有物品 = 单元格对象.关联物品;
			
			        const 是放置怪物 = 选中项 instanceof 怪物;
			        const 是放置物品或背景 = 选中项 instanceof 物品 || 选中项.类型 === '背景';
			        
			        if (是放置怪物) {
			if (现有怪物) {
			    if (现有怪物 instanceof 蜈蚣怪物) {
			        现有怪物?.身体部位?.forEach(item=>{item.移除自身(true)})
			        现有怪物.移除自身()
			    } else if (现有怪物 instanceof 蜈蚣部位) {
			        现有怪物?.主体?.身体部位?.forEach(item=>{item.移除自身(true)})
			        现有怪物.主体?.移除自身()
			    }
			    所有怪物 = 所有怪物.filter(怪物 => 怪物 !== 现有怪物);
			}
			if (现有物品 && 现有物品.阻碍怪物) {
			所有计时器 = 所有计时器.filter(计时器 => 计时器.唯一标识.toString() !== 单元格对象.关联物品?.唯一标识.toString());
			所有传送门 = 所有传送门.filter(item => item.唯一标识.toString() !== 单元格对象.关联物品?.唯一标识.toString());
			    单元格对象.关联物品 = null;
			    
			}
			单元格对象.关联怪物 = null;
			        } else if (是放置物品或背景) {
			if (现有怪物 && 选中项.阻碍怪物) {
			    所有怪物 = 所有怪物.filter(怪物 => 怪物 !== 现有怪物);
			    单元格对象.关联怪物 = null;
			    清除怪物 = true;
			}
			if (现有物品) {
			    所有计时器 = 所有计时器.filter(计时器 => 计时器.唯一标识.toString() !== 单元格对象.关联物品?.唯一标识.toString());
			    所有传送门 = 所有传送门.filter(item => item.唯一标识.toString() !== 单元格对象.关联物品?.唯一标识.toString());
			    单元格对象.关联物品 = null;
			    
			}
			        }
			
			        if (选中项.类型 === '背景') {
			if (编辑器状态.上次放置的背景) {
			    单元格对象.阻碍视野 = 编辑器状态.上次放置的背景.阻碍视野;
			    
			}
			编辑器状态.上次放置的背景 = 单元格对象;
			if ([单元格类型.门, 单元格类型.上锁的门].includes(单元格对象.背景类型) && 单元格对象.标识) {
			    const 门实例 = 门实例列表.get(单元格对象.标识);
			    if (门实例) {
			        if (门实例.房间ID !== null && 房间列表[门实例.房间ID]) {
			            const 房间 = 房间列表[门实例.房间ID];
			            房间.门 = 房间.门.filter(门坐标 => !(门坐标.x === 横坐标 && 门坐标.y === 纵坐标));
			        }
			        const 配对位置 = 单元格对象.配对单元格位置;
			        if (配对位置) {
			            const 配对单元格 = 地牢[配对位置.y]?.[配对位置.x];
			            if (配对单元格) {
			                    const 配对房间 = 房间列表[门实例.房间ID];
			                    if (配对房间) {
			                            配对房间.门 = 配对房间.门.filter(门坐标 => 
			                                !(门坐标.x === 配对位置.x && 门坐标.y === 配对位置.y)
			                            );
			                    }
			                    配对单元格.背景类型 = 单元格类型.墙壁;
			                    配对单元格.类型 = 单元格类型.墙壁;
			                    配对单元格.标识 = null;
			                    配对单元格.钥匙ID = null;
			                    配对单元格.配对单元格位置 = null;
			                    配对单元格.doorOrientation = null;
			            }
			        }
			        门实例列表.delete(单元格对象.标识);
			    }
			}
			单元格对象.背景类型 = 选中项.绘制类型;
			单元格对象.类型 = 选中项.绘制类型;
			所有计时器 = 所有计时器.filter(计时器 => 计时器.唯一标识.toString() !== 单元格对象.关联物品?.唯一标识.toString());
			所有传送门 = 所有传送门.filter(item => item.唯一标识.toString() !== 单元格对象.关联物品?.唯一标识.toString());
			单元格对象.关联物品 = null; 
			单元格对象.关联怪物 = null;
			if (选中项.绘制类型 === 单元格类型.门 || 选中项.绘制类型 === 单元格类型.上锁的门) {
			    let 方向 = 'NS'; 
			    const 左邻居可通行 = 地牢[纵坐标]?.[横坐标 - 1] && 地牢[纵坐标][横坐标 - 1].背景类型 !== 单元格类型.墙壁;
			    const 右邻居可通行 = 地牢[纵坐标]?.[横坐标 + 1] && 地牢[纵坐标][横坐标 + 1].背景类型 !== 单元格类型.墙壁;
			    if(左邻居可通行 && 右邻居可通行) {
			        方向 = 'EW';
			    }
			    单元格对象.doorOrientation = 方向;
			
			    const 最近房间 = 寻找最近的房间(横坐标, 纵坐标);
			    const 门实例 = new 门({ 关联房间ID: 最近房间 ? 最近房间.id : null, 位置: { x: 横坐标, y: 纵坐标 } });
			    if(选中项.绘制类型 === 单元格类型.上锁的门) {
			        门实例.是否上锁 = true;
			    }
			    单元格对象.标识 = 门实例.唯一标识;
			    单元格对象.钥匙ID = null;
			    门实例列表.set(门实例.唯一标识, 门实例);
			    if (最近房间) {
			        最近房间.门.push({ x: 横坐标, y: 纵坐标 });
			    }
			    if (选中项.绘制类型 === 单元格类型.上锁的门) {
			        单元格对象.颜色索引 = 0;
			    }
			} else {
			    单元格对象.标识 = null;
			    单元格对象.doorOrientation = null;
			}
			生成墙壁();
			更新所有门朝向();
			        } else if (选中项 instanceof 物品) {
			 let 实例;
			if (选中项 instanceof 传送带 && 上次放置的传送带) {
			    const 最后方向 = 上次放置的传送带.自定义数据.get('方向') || 'E';
			    实例 = new 传送带({ 数据: { 方向: 最后方向 } });
			} else if (选中项 instanceof 开关脉冲器 && 上次放置的开关脉冲器) {
			    const 冷却回合 = 上次放置的开关脉冲器.自定义数据.get('冷却回合') || 1;
			    实例 = new 开关脉冲器({ 方向: 冷却回合 });
			} else if (选中项 instanceof 沉浸式传送门){
			    实例 = new 沉浸式传送门({ 传送门ID:所有传送门.slice(-1)[0]?.自定义数据?.get('传送门ID')??0 });
			} else if (选中项 instanceof 隐形毒气陷阱 && 上次放置的隐形毒气陷阱) {
			    const id = 上次放置的隐形毒气陷阱.自定义数据.get('关联陷阱ID') || 0;
			    const 强度 = 上次放置的隐形毒气陷阱.自定义数据.get('中毒强度') || 0;
			    实例 = new 隐形毒气陷阱({ 关联陷阱ID: id,中毒强度:强度 });
			} else {
			    实例 = 克隆物品(选中项, { 玩家放置: true });
			}
			if (实例 instanceof 卷轴类) 实例.已解锁=false;
			
			if(放置物品到单元格(实例, 横坐标, 纵坐标,单元格类型.物品,false,true)) {
			    if(实例 instanceof 传送带) {
			        上次放置的传送带 = 实例;
			    }else if(实例 instanceof 隐形毒气陷阱) {
			        上次放置的隐形毒气陷阱 = 实例;
			    }
			}
			        } else if (是放置怪物) {
			const 实例 = new 选中项.constructor({x:横坐标,y:纵坐标});
			实例.状态 = 怪物状态.休眠;
			放置怪物到单元格(实例, 横坐标, 纵坐标);
			        }
			    }
			    
			}
			            function 寻找最近的房间(x, y) {
			    let 最近房间 = null;
			    let 最小距离 = Infinity;
			    房间列表.forEach(room => {
			        if (!room) return;
			        const 中心X = room.x + Math.floor(room.w / 2);
			        const 中心Y = room.y + Math.floor(room.h / 2);
			        const 距离 = Math.abs(x - 中心X) + Math.abs(y - 中心Y);
			        if (距离 < 最小距离) {
			            最小距离 = 距离;
			            最近房间 = room;
			        }
			    });
			    return 最近房间;
			}
			
			function 更新编辑器快速访问栏() {
			    for (let i = 1; i <= 装备栏每页装备数; i++) {
			        const 槽位 = document.getElementById(`装备槽${i}`);
			        if (!槽位) continue;
			        槽位.innerHTML = "";
			
			        const 物品实例 = 编辑器最近使用列表[i - 1];
			        if (物品实例) {
			            const isVirtual = !(物品实例 instanceof 物品) && !(物品实例 instanceof 怪物);
			            const 克隆元素 = document.createElement('div');
			            克隆元素.className = '物品条目';
			            克隆元素.innerHTML = `
			                <div class="物品图标" style="color: ${'#FFFFFF'};">${物品实例.图标 || 物品实例.显示图标}</div>
			                <div class="物品名称">${物品实例.名称 || 物品实例.类型}</div>
			            `;
			             const 图标元素 = 克隆元素.querySelector(".物品图标");
			            图标元素.style.fontSize = '2.5em';
			            if (!isVirtual) {
			                if (物品实例 instanceof 怪物) {
			                    图标元素.style.color = 物品实例.颜色 || '#FFFFFF'; 
			                    图标元素.style.textShadow = `0 0 8px ${物品实例.颜色 || '#FFFFFF'}`;
			                } else if (物品实例.颜色表) {
			                    图标元素.style.color = 物品实例.颜色表[物品实例.颜色索引];
			                    图标元素.style.textShadow = `0 0 8px ${物品实例.颜色表[物品实例.颜色索引]}`;
			                }
			            }
			            克隆元素.onclick = () => {
			                设置编辑器选中项(物品实例);
			                //显示通知(`已从快速访问栏选中: ${物品实例.名称 || 物品实例.获取名称()}`, '信息');
			            };
			            槽位.appendChild(克隆元素);
			        }
			    }
			}
			
			function 设置编辑器选中项(实例) {
			    if (编辑器状态.模式 === '传送') {
			        编辑器状态.模式 = '编辑';
			        const 互动按钮元素 = document.getElementById('互动按钮');
			        if(互动按钮元素) 互动按钮元素.style.background = '';
			    }
			
			    if (实例.名称 === '手形/编辑') {
			        编辑器状态.当前选中 = null;
			        编辑器状态.模式 = '编辑';
					document.getElementById('笔刷工具容器').style.display = 'none';
			    } else {
			        编辑器状态.当前选中 = 实例;
			        编辑器状态.模式 = '绘制';
					if (实例.类型 === '背景') {
						document.getElementById('笔刷工具容器').style.display = 'flex';
					} else {
						document.getElementById('笔刷工具容器').style.display = 'none';
					}
			    }
			    
			    const 现有索引 = 编辑器最近使用列表.findIndex(item => (item.名称 || item.类型 || item.获取名称()) === (实例.名称 || 实例.类型 || 实例.获取名称()));
			    if (现有索引 !== -1) {
			        编辑器最近使用列表.splice(现有索引, 1);
			    }
			    编辑器最近使用列表.unshift(实例);
			    if (编辑器最近使用列表.length > 装备栏每页装备数) {
			        编辑器最近使用列表.pop();
			    }
			    更新编辑器快速访问栏();
			}
			
			function 重置单元格(横坐标, 纵坐标) {
			    const 单元格 = 地牢[纵坐标]?.[横坐标];
			    if (!单元格) return;
			
			    if (单元格.关联物品) {
			if (单元格.关联物品.唯一标识 && 玩家背包.has(单元格.关联物品.唯一标识)) {
			处理销毁物品(单元格.关联物品.唯一标识, true);
			}
			
			    所有计时器 = 所有计时器.filter(计时器 => 计时器.唯一标识.toString() !== 单元格.关联物品.唯一标识.toString());
			    所有传送门 = 所有传送门.filter(item => item.唯一标识.toString() !== 单元格.关联物品?.唯一标识.toString());
			
			单元格.关联物品 = null;
			    }
			    if (单元格.关联怪物) {
			        let 现有怪物=单元格.关联怪物
			        if (现有怪物 instanceof 蜈蚣怪物) {
			        现有怪物?.身体部位?.forEach(item=>{item.移除自身(true)})
			        现有怪物.移除自身()
			    } else if (现有怪物 instanceof 蜈蚣部位) {
			        现有怪物?.主体?.身体部位?.forEach(item=>{item.移除自身(true)})
			        现有怪物.主体?.移除自身()
			    }
			        所有怪物 = 所有怪物.filter(怪物 => 怪物 !== 单元格.关联怪物);
			        单元格.关联怪物 = null;
			    }
			    
			    if (单元格.标识 && 门实例列表.has(单元格.标识)) {
			        const 门实例 = 门实例列表.get(单元格.标识);
			        if (门实例.房间ID !== null && 房间列表[门实例.房间ID]) {
			房间列表[门实例.房间ID].门 = 房间列表[门实例.房间ID].门.filter(门坐标 => !(门坐标.x === 横坐标 && 门坐标.y === 纵坐标));
			        }
			        门实例列表.delete(单元格.标识);
			    }
			    
			    单元格.类型 = null;
			    单元格.背景类型 = 单元格类型.墙壁;
			    单元格.标识 = null;
			    单元格.钥匙ID = null;
			    单元格.颜色索引 = 颜色表.length;
			    单元格.墙壁 = { 上: false, 右: false, 下: false, 左: false };
			    单元格.是否强制墙壁 = false
			    单元格.阻碍视野 = false
			    
			    const 邻居方向 = {
			        上: {x: 横坐标, y: 纵坐标-1, 墙: '下'},
			        下: {x: 横坐标, y: 纵坐标+1, 墙: '上'},
			        左: {x: 横坐标-1, y: 纵坐标, 墙: '右'},
			        右: {x: 横坐标+1, y: 纵坐标, 墙: '左'},
			    };
			
			    for (const 方向 in 邻居方向) {
			        const 邻居 = 邻居方向[方向];
			        const 邻居单元格 = 地牢[邻居.y]?.[邻居.x];
			        if(邻居单元格) {
			邻居单元格.墙壁[邻居.墙] = false;
			        }
			    }
			    
			    生成墙壁();
			    绘制();
			}
			function 编辑器右键处理(e) {
			    e.preventDefault();
			    const rect = canvas.getBoundingClientRect();
			    const x = e.clientX - rect.left;
			    const y = e.clientY - rect.top;
			    const gridX = Math.floor(当前相机X + x / 单元格大小);
			    const gridY = Math.floor(当前相机Y + y / 单元格大小);
			    if (gridX < 0 || gridX >= 地牢大小 || gridY < 0 || gridY >= 地牢大小) return;
			    打开属性编辑器(地牢[gridY][gridX], gridX, gridY);
			}
			
			function 从当前位置开始游玩() {
			    临时测试 = true;
			    
			    处理房间状态();
			    编辑器状态备份 = 导出地图();
			    编辑器玩家 = {...玩家}
			    if (!编辑器状态备份) {
			        显示通知("无法备份地图状态，无法进入游玩模式。", "错误");
			        return;
			    }
			    游戏状态 = '编辑器游玩';
			    document.body.classList.remove('地图编辑器模式');
			    document.body.classList.add('编辑器游玩模式');
			    document.body.classList.add('游戏进行中');
			    document.getElementById('编辑器工具栏').style.display = 'none';
			    document.getElementById('笔刷工具容器').style.display = 'none';
			    document.getElementById('返回编辑器按钮').style.display = 'block';
			
			    canvas.removeEventListener('mousedown', 编辑器鼠标按下处理);
			    canvas.removeEventListener('mousemove', 编辑器鼠标移动处理);
			    canvas.removeEventListener('mouseup', 编辑器鼠标抬起处理);
			    canvas.removeEventListener('touchstart', 编辑器触摸开始处理);
			    canvas.removeEventListener('touchmove', 编辑器触摸移动处理);
			    canvas.removeEventListener('touchend', 编辑器触摸结束处理);
			    canvas.removeEventListener('contextmenu', 编辑器右键处理);
			    
			    canvas.addEventListener("touchstart", 处理地图点击);
			    canvas.addEventListener("click", 处理地图单击);
			    
			    document.getElementById("背包物品栏").innerHTML = '';
			    玩家背包.clear();
			    const 背包弹窗 = document.querySelector('.背包弹窗');
			    const 背包标题元素 = 背包弹窗.querySelector(':scope > .弹窗头部 > h3');
			    if(背包标题元素){
			        背包标题元素.innerHTML = `背包 (容量：<span id="当前容量">0</span>/<span id="最大容量">${最大背包容量}</span>)`;
			    }
			    const 互动按钮元素 = document.getElementById('互动按钮');
			    if(互动按钮元素) 互动按钮元素.style.background = '';
			
			    Object.assign(玩家属性, 自定义全局设置.玩家属性);
			    玩家属性.最大生命值加成 = 自定义全局设置.初始生命值 - 100;
			    初始玩家属性 = {...玩家属性};
			    最大背包容量 = 自定义全局设置.初始背包容量;
			    document.querySelector(".health-bar").style.width = "100%";
			    document.querySelector(".power-bar").style.width = `100%`;
			    玩家总移动回合数 = 0;
			    玩家总受到伤害 = 0;
			    当前天气效果 = [...自定义全局设置.全局天气];
			    if (当前天气效果.length > 0) {
			        显示通知(`当前天气: ${当前天气效果.join(', ')}`, '信息', true);
			    }
			
			    
			    玩家属性.允许移动 = 0;
			    const 玩家起始房间ID = 房间地图[玩家.y]?.[玩家.x];
			    if (玩家起始房间ID !== -1 && 玩家起始房间ID !== undefined) {
			        已访问房间.add(玩家起始房间ID);
			    }
			    
			    更新装备显示();
			    更新背包显示();
			    更新视口();
			    更新胜利条件显示();
			    处理沉浸式传送门();
			    显示通知('已进入游玩模式。点击左上角按钮返回。', '信息');
			}
			function 克隆物品编辑器(原始物品) {
			    if (!原始物品 || typeof 原始物品.constructor !== 'function') {
			        return null;
			    }
			    const 构造器 = 原始物品.constructor;
			    const 克隆实例 = new 构造器({});
			
			    for (const 键 in 原始物品) {
			        if (Object.hasOwnProperty.call(原始物品, 键)) {
			            if (键 === "自定义数据" && 原始物品.自定义数据 instanceof Map) {
			                克隆实例.自定义数据 = new Map(原始物品.自定义数据);
			            } else if (键 !== '唯一标识' && 键 !== '显示元素' && 键 !== 'isActive' && 键 !== '已装备' && 键 !== '装备槽位') {
			                克隆实例[键] = 原始物品[键];
			            }
			        }
			    }
			    克隆实例.唯一标识 = Symbol(Date.now().toString() + prng().toString());
			    return 克隆实例;
			}
			
			function 克隆怪物编辑器(原始怪物) {
			    if (!原始怪物 || typeof 原始怪物.constructor !== 'function' || 原始怪物 instanceof 巨人怪物 || 原始怪物 instanceof 巨人部位 || 原始怪物 instanceof 蜈蚣怪物 || 原始怪物 instanceof 蜈蚣部位) {
			        return null; //未开发
			    }
			    const 配置 = {}
			    for (const 键 in 原始怪物) {
			        if (Object.hasOwnProperty.call(原始怪物, 键)) {
			            if (键!== '掉落物') {
			                配置[键] = 原始怪物[键];
			            }
			        }
			    }
			    const 构造器 = 原始怪物.constructor;
			    const 克隆实例 = new 构造器(配置);
			    for (const 键 in 原始怪物) {
			        if (Object.hasOwnProperty.call(原始怪物, 键)) {
			            
			            if (键 === '掉落物' && 原始怪物.掉落物) {
			                克隆实例.掉落物 = 克隆物品编辑器(原始怪物.掉落物);
			            } else {
			                if(原始怪物[键] && 键!=='巡逻方向') 克隆实例[键] = 原始怪物[键];
			            }
			        }
			    }
			    return 克隆实例;
			}
			
			function 克隆单元格(原始单元格) {
			    const 克隆实例 = new 单元格(原始单元格.x, 原始单元格.y);
			    for (const 键 in 原始单元格) {
			        
			            if (键 === '关联物品' && 原始单元格.关联物品) {
			                克隆实例.关联物品 = 克隆物品编辑器(原始单元格.关联物品);
			            } else if (键 === '关联怪物' && 原始单元格.关联怪物) {
			                克隆实例.关联怪物 = 克隆怪物编辑器(原始单元格.关联怪物);
			            } else if (键 === '墙壁' || 键 === '配对单元格位置') {
			                克隆实例[键] = { ...原始单元格[键] };
			            } else if (键 !== '唯一标识') {
			                克隆实例[键] = 原始单元格[键];
			            }
			        
			    }
			    return 克隆实例;
			}
			
			function 编辑器复制选区(x1, y1, x2, y2) {
			    const 左上角X = Math.min(x1, x2);
			    const 左上角Y = Math.min(y1, y2);
			    const 右下角X = Math.max(x1, x2);
			    const 右下角Y = Math.max(y1, y2);
			
			    const 复制的数据 = [];
			    let 只包含实体 = true;
			
			    for (let y = 左上角Y; y <= 右下角Y; y++) {
			        for (let x = 左上角X; x <= 右下角X; x++) {
			            const 原始单元格 = 地牢[y]?.[x];
			            if (原始单元格) {
			                复制的数据.push({
			                    相对X: x - 左上角X,
			                    相对Y: y - 左上角Y,
			                    单元格克隆: 克隆单元格(原始单元格)
			                });
			                if (!原始单元格.关联物品 && !原始单元格.关联怪物) {
			                    只包含实体 = false;
			                }
			            }
			        }
			    }
			
			    if (复制的数据.length === 0) {
			        显示通知("选区为空，未复制任何内容。", "警告");
			        return;
			    }
			
			    编辑器剪贴板 = {
			        宽度: 右下角X - 左上角X + 1,
			        高度: 右下角Y - 左上角Y + 1,
			        数据: 复制的数据,
			        只包含实体: 只包含实体
			    };
			
			    显示通知(`已复制 ${编辑器剪贴板.宽度}x${编辑器剪贴板.高度} 的区域。再次点击以粘贴。`, "成功");
			    绘制();
			}
			
			function 编辑器粘贴选区(粘贴左上角X, 粘贴左上角Y) {
			    if (!编辑器剪贴板) return;
			    saveEditorState();
			
			    const { 宽度, 高度, 数据, 只包含实体 } = 编辑器剪贴板;
			    const 门映射 = new Map();
			
			    for (const 条目 of 数据) {
			        const 目标X = 粘贴左上角X + 条目.相对X;
			        const 目标Y = 粘贴左上角Y + 条目.相对Y;
			
			        if (目标X < 0 || 目标X >= 地牢大小 || 目标Y < 0 || 目标Y >= 地牢大小) continue;
			
			        const 目标单元格 = 地牢[目标Y][目标X];
			        const 源单元格克隆 = 条目.单元格克隆;
			
			        
			
			        if (只包含实体) {
			            if (源单元格克隆.关联物品) {
			                放置物品到单元格(源单元格克隆.关联物品, 目标X, 目标Y);
			            }
			            if (源单元格克隆.关联怪物) {
			                放置怪物到单元格(源单元格克隆.关联怪物, 目标X, 目标Y);
			            }
			            目标单元格.类型 = 源单元格克隆.类型;
			        } else {
			            重置单元格(目标X, 目标Y);
			            目标单元格.背景类型 = 源单元格克隆.背景类型;
			            目标单元格.类型 = 源单元格克隆.类型;
			            目标单元格.墙壁 = { ...源单元格克隆.墙壁 };
			            目标单元格.颜色索引 = 源单元格克隆.颜色索引;
			            目标单元格.是否强制墙壁 = 源单元格克隆.是否强制墙壁;
			            目标单元格.阻碍视野 = 源单元格克隆.阻碍视野;
			
			            if (源单元格克隆.关联物品) {
			                放置物品到单元格(源单元格克隆.关联物品, 目标X, 目标Y);
			            }
			            if (源单元格克隆.关联怪物) {
			                放置怪物到单元格(源单元格克隆.关联怪物, 目标X, 目标Y);
			            }
			
			            if (源单元格克隆.标识) {
			                if (!门映射.has(源单元格克隆.标识.toString())) {
			                    门映射.set(源单元格克隆.标识.toString(), new 门({ 关联房间ID: null, 位置: { x: 目标X, y: 目标Y } }));
			                }
			                const 新门实例 = 门映射.get(源单元格克隆.标识.toString());
			                目标单元格.标识 = 新门实例.唯一标识;
			                门实例列表.set(新门实例.唯一标识, 新门实例);
			            }
			        }
			    }
			
			    生成墙壁();
			    绘制();
			    显示通知("粘贴完成。", "成功");
			    编辑器剪贴板 = null; 
			}
			function 编辑器画布事件处理(clientX, clientY, eventType, originalEvent) {
			    if (游戏状态!=='地图编辑器') return;
			    if (originalEvent.buttons === 2) {
			        return;
			    }
			     if (
			        document.getElementById('编辑器属性面板遮罩').style.display === 'block' ||
			        originalEvent.target.closest('.背包弹窗') ||
			        originalEvent.target.closest('#编辑器工具栏')
			    ) {
			        if(eventType === 'start' || eventType === 'move') {
			             编辑器状态.正在划区 = false; 
			             编辑器状态.正在复制选区 = false;
			        }
			        return;
			    }
			    originalEvent.preventDefault();
			
			    const rect = canvas.getBoundingClientRect();
			    const x = clientX - rect.left;
			    const y = clientY - rect.top;
			    const gridX = Math.floor(当前相机X + x / 单元格大小);
			    const gridY = Math.floor(当前相机Y + y / 单元格大小);
			    
			    if (gridX < 0 || gridX >= 地牢大小 || gridY < 0 || gridY >= 地牢大小) return;
			    
			    const now = Date.now();
			    const DOUBLE_CLICK_TIME = 300; 
			    
			
			    if (eventType === 'start') {
			        
			        if (now - (编辑器状态.上次点击时间 || 0) < DOUBLE_CLICK_TIME && 编辑器状态.上次点击格子 && 编辑器状态.上次点击格子.x === gridX && 编辑器状态.上次点击格子.y === gridY) {
			             saveEditorState();
			             编辑器状态.正在划区 = true;
			             编辑器状态.划区起点 = { x: gridX, y: gridY };
			             玩家.x = gridX;
			             玩家.y = gridY;
			        } else {
			            
			            计划显示格子特效([{ x: gridX, y: gridY }], "FFFFFF", 0);
			            if(编辑器状态.模式 === '传送') {
			               玩家.x = gridX;
			               玩家.y = gridY;
			               更新视口();
			               绘制();
			            } else if (编辑器状态.模式 === '设置起点') {
			                saveEditorState();
			                const 房间ID = 房间地图[gridY]?.[gridX];
			                if (房间ID === undefined) {
			                    显示通知("玩家起点必须设置在地牢内！", "错误");
			                    return;
			                }
			                
			                玩家初始位置.x = gridX;
			                玩家初始位置.y = gridY;
			                显示通知(`玩家起点已设置为 (${gridX}, ${gridY})`, '成功');
			                编辑器状态.模式 = 旧编辑器状态;
			                编辑器状态.上次点击时间 = now;
			                编辑器状态.上次点击格子 = { x: gridX, y: gridY };
			                绘制小地图();
			                return;
			            } else if (编辑器状态.当前选中?.名称 === '房间工具') {
			            saveEditorState();
			                编辑器状态.正在划区 = true;
			                编辑器状态.划区起点 = { x: gridX, y: gridY };
			                玩家.x = gridX;
			                玩家.y = gridY;
			            } else if (编辑器状态.当前选中?.名称 === '复制工具') {
			            if (编辑器剪贴板) {
			                编辑器粘贴选区(gridX, gridY);
			            } else {
			                saveEditorState();
			                编辑器状态.正在复制选区 = true;
			                编辑器状态.复制起点 = { x: gridX, y: gridY };
			            }
			            } else if (编辑器状态.当前选中?.类型 === '背景' && 编辑器状态.笔刷模式 === '油漆桶') {
							油漆桶填充(gridX, gridY, 编辑器状态.当前选中.绘制类型);
						} else if (编辑器状态.当前选中?.类型 === '背景' && 编辑器状态.笔刷模式 === '笔刷') {
							saveEditorState();
							笔刷绘制(gridX, gridY);
						} else {
							saveEditorState();
			                编辑器放置逻辑(gridX, gridY);
			            }
			        }
			        编辑器状态.上次点击时间 = now;
			        编辑器状态.上次点击格子 = { x: gridX, y: gridY };
			    } else if (eventType === 'move' && (编辑器状态.正在划区 || 编辑器状态.正在复制选区)) {
			        玩家.x = gridX;
			        玩家.y = gridY;
			    } else if (eventType === 'end') {
			        if (编辑器状态.正在复制选区) {
			            编辑器状态.正在复制选区 = false;
			            编辑器复制选区(编辑器状态.复制起点.x, 编辑器状态.复制起点.y, gridX, gridY);
			            更新所有门朝向();
			        } else if (编辑器状态.正在划区) {
			            编辑器状态.正在划区 = false;
			            const 起始横坐标 = 编辑器状态.划区起点.x;
			            const 起始纵坐标 = 编辑器状态.划区起点.y;
			            if (编辑器状态.当前选中?.名称 === '房间工具') {
			                 创建并放置房间(起始横坐标, 起始纵坐标, gridX, gridY);
			                 更新所有门朝向();
			            } else {
			                const 左上角横坐标 = Math.min(起始横坐标, gridX);
			                const 左上角纵坐标 = Math.min(起始纵坐标, gridY);
			                const 右下角横坐标 = Math.max(起始横坐标, gridX);
			                const 右下角纵坐标 = Math.max(起始纵坐标, gridY);
			
			                for (let 纵 = 左上角纵坐标; 纵 <= 右下角纵坐标; 纵++) {
			                    for (let 横 = 左上角横坐标; 横 <= 右下角横坐标; 横++) {
			                        编辑器放置逻辑(横, 纵);
			                    }
			                }
			            }
			            
			        }
			        更新视口();
			        生成墙壁();
			        saveEditorState();
			    } else if(eventType === 'move' && (originalEvent.buttons === 1 || originalEvent.touches)) {
			        if (编辑器状态.当前选中?.类型 === '背景' && 编辑器状态.笔刷模式 === '笔刷') {
						笔刷绘制(gridX, gridY);
					} else if (编辑器状态.当前选中 && 编辑器状态.当前选中.名称 !== '房间工具' && 编辑器状态.当前选中.名称 !== '复制工具') {
						 编辑器放置逻辑(gridX, gridY);
					}
			    }
			    绘制小地图();
			}
			    
			            function 更新胜利条件显示() {
			    const 条件 = 自定义全局设置.胜利条件;
			    const 有效条件 = Object.values(条件).some(val => val > 0);
			
			    const 清理提示 = (提示类型) => {
			        if (胜利条件提示元素组[提示类型]) {
			            胜利条件提示元素组[提示类型].销毁();
			            胜利条件提示元素组[提示类型] = null;
			        }
			    };
			
			    if (!有效条件 || (游戏状态 !== '编辑器游玩' && 游戏状态 !== '游戏中')) {
			        Object.keys(胜利条件提示元素组).forEach(清理提示);
			        return;
			    }
			
			    if (!胜利条件提示元素组.标题) {
			        胜利条件提示元素组.标题 = new 文本元素({内容: "胜利条件:"});
			        const 标题元素 = 胜利条件提示元素组.标题.容器元素.querySelector('.hud-label');
			        if (标题元素) 标题元素.style.fontWeight = 'bold';
			        胜利条件提示元素组.标题.容器元素.style.marginTop = '8px';
			        胜利条件提示元素组.标题.容器元素.style.borderTop = '1px dashed #444';
			        胜利条件提示元素组.标题.容器元素.style.paddingTop = '8px';
			    }
			    
			    if (条件.回合数限制 > 0) {
			        if (!胜利条件提示元素组.回合) {
			            胜利条件提示元素组.回合 = new 进度条元素({图标: 图标映射.沙漏, 初始值: 0});
			        }
			        const 进度 = Math.min(100, (玩家总移动回合数 / 条件.回合数限制) * 100);
			        const 颜色 = 玩家总移动回合数 > 条件.回合数限制 ? '#ff4444' : '#4caf50';
			        胜利条件提示元素组.回合.更新({
			            数值: 100 - 进度,
			            标签: `${玩家总移动回合数} / ${条件.回合数限制}`,
			            颜色: 颜色
			        });
			    } else {
			        清理提示('回合');
			    }
			
			    if (条件.伤害限制 > 0) {
			        if (!胜利条件提示元素组.伤害) {
			            胜利条件提示元素组.伤害 = new 进度条元素({图标: 图标映射.爱心, 初始值: 0});
			        }
			        const 进度 = Math.min(100, (玩家总受到伤害 / 条件.伤害限制) * 100);
			        const 颜色 = 玩家总受到伤害 > 条件.伤害限制 ? '#ff4444' : '#4caf50';
			        胜利条件提示元素组.伤害.更新({
			            数值: 100 - 进度,
			            标签: `${玩家总受到伤害.toFixed(1)} / ${条件.伤害限制}`,
			            颜色: 颜色
			        });
			    } else {
			        清理提示('伤害');
			    }
			
			    if (条件.生命下限 > 0) {
			        if (!胜利条件提示元素组.生命) {
			            胜利条件提示元素组.生命 = new 进度条元素({图标: 图标映射.修补心, 初始值: 100});
			        }
			        const 当前生命 = parseFloat(document.querySelector(".health-bar")?.style.width) || 100;
			        const 颜色 = 当前生命 < 条件.生命下限 ? '#ff4444' : '#4caf50';
			        胜利条件提示元素组.生命.更新({
			            数值: 当前生命,
			            标签: `> ${条件.生命下限}%`,
			            颜色: 颜色
			        });
			    } else {
			        清理提示('生命');
			    }
			    if (条件.死亡次数限制 > 0) {
			        if (!胜利条件提示元素组.死亡) {
			            胜利条件提示元素组.死亡 = new 进度条元素({图标: 图标映射.死亡图标, 初始值: 100});
			        }
			        const 进度 = Math.min(100, (玩家死亡次数 / 条件.死亡次数限制) * 100);
			        const 颜色 = 玩家死亡次数 >= 条件.死亡次数限制 ? '#ff4444' : '#4caf50';
			        胜利条件提示元素组.死亡.更新({
			            数值: 100 - 进度,
			            标签: `${玩家死亡次数} / ${条件.死亡次数限制}`,
			            颜色: 颜色
			        });
			    } else {
			        清理提示('死亡');
			    }
			}
			function 处理房间状态() {
			    if (游戏状态 !== "地图编辑器") return;
			    
			    房间列表.forEach(房间 => {
			        if (!房间) return;
			
			        if (房间.已探索) {
			            已访问房间.add(房间.id);
			        } else {
			            已访问房间.delete(房间.id);
			        }
			        if (房间.挑战状态) {
			            房间.挑战状态.已完成 = false;
			        }
			    });
			}
			
			
			function 打开属性编辑器(对象, 横坐标, 纵坐标) {
			    const 遮罩 = document.getElementById('编辑器属性面板遮罩');
			    const 面板 = document.getElementById('编辑器属性面板');
			    const 标题 = document.getElementById('属性面板标题');
			    const 内容 = document.getElementById('属性面板内容');
			    const 保存按钮 = document.getElementById('保存属性按钮');
			    const 删除按钮 = document.getElementById('删除对象按钮');
			    const 关闭按钮 = document.getElementById('关闭属性面板按钮');
			
			    内容.innerHTML = '';
			    const 当前单元格 = 地牢[纵坐标]?.[横坐标];
			    let 目标对象;
			    let 是房间编辑器 = false;
			    let 房间标识 = 房间地图[纵坐标]?.[横坐标];
			    let 是上锁房间 = 上锁房间列表.some(房间 => 房间.id === 房间标识);
			
			    if (编辑器状态.当前选中?.名称 === '房间编辑工具' && 房间标识 !== -1 && 房间列表[房间列表.findIndex(item=>item?.id==房间标识)]) {
			        目标对象 = 房间列表[房间列表.findIndex(item=>item?.id==房间标识)];
			        是房间编辑器 = true;
			    } else if (对象.id !== undefined && 房间列表[房间列表.findIndex(item=>item?.id==对象.id)] === 对象) {
			        目标对象 = 对象;
			        是房间编辑器 = true;
			    } else {
			        目标对象 = 当前单元格.关联物品 || 当前单元格.关联怪物 || (([单元格类型.门, 单元格类型.上锁的门].includes(当前单元格.背景类型) && 门实例列表.get(当前单元格.标识)) ? 门实例列表.get(当前单元格.标识) : 当前单元格);
			    }
			    
			    标题.textContent = `编辑 (${横坐标}, ${纵坐标}) ${目标对象.名称 || 目标对象.类型 || '单元格'}`;
			    编辑器状态.选中实例 = 目标对象;
			
			    const 当前编辑对象 = 目标对象;
			    
			    const 创建字段 = (键, 值, 父对象, 是自定义数据 = false, 待更新对象 = 父对象) => {
			        const 包装元素 = document.createElement('div');
			        包装元素.style.cssText = 'margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;';
			        const 标签 = document.createElement('label');
			        
			        let 显示文本 = 键;
			        if (键 === 'isOneWay') {
			显示文本 = '是否单向';
			if (父对象 instanceof 单元格 && ![单元格类型.门, 单元格类型.上锁的门].includes(父对象.背景类型)) return null;
			        }
			        if (键 === 'oneWayAllowedDirection') 显示文本 = '允许方向';
			
			        标签.textContent = 显示文本;
			        标签.style.marginRight = '10px';
			        包装元素.appendChild(标签);
			        
			        let 输入框;
			        if (键 === 'oneWayAllowedDirection' && (父对象 instanceof 门 || (父对象 instanceof 单元格 && [单元格类型.门, 单元格类型.上锁的门].includes(父对象.背景类型)))) {
			输入框 = document.createElement('select');
			const 门方向 = (父对象 instanceof 门 ? 地牢[父对象.所在位置.y][父对象.所在位置.x].doorOrientation : 父对象.doorOrientation);
			let 方向选项 = ['无'];
			if (门方向 === 'NS') {
			    方向选项.push('N', 'S');
			} else if (门方向 === 'EW') {
			    方向选项.push('E', 'W');
			}
			方向选项.forEach(方向 => {
			    const 选项 = document.createElement('option');
			    选项.value = 方向 === '无' ? '' : 方向;
			    选项.textContent = 方向;
			    if (选项.value === (值 || '')) 选项.selected = true;
			    输入框.appendChild(选项);
			});
			        } else if (键 === '关联房间ID' && 父对象 instanceof 门) {
			    输入框 = document.createElement('select');
			    const 默认选项 = document.createElement('option');
			    默认选项.value = "-1";
			    默认选项.textContent = "无";
			    输入框.appendChild(默认选项);
			    房间列表.forEach(房间 => {
			    if(房间) {
			        const 选项 = document.createElement('option');
			        选项.value = 房间.id;
			        选项.textContent = `${房间.名称} (ID: ${房间.id})`;
			        if (房间.id === 值) 选项.selected = true;
			        输入框.appendChild(选项);
			    }
			    });
			        } else if (键 === '钥匙对应房间ID' && 父对象 === null) {
			输入框 = document.createElement('select');
			const 默认选项 = document.createElement('option');
			默认选项.value = "-1";
			默认选项.textContent = "万能钥匙";
			if (parseInt(值) === -1) 默认选项.selected = true;
			输入框.appendChild(默认选项);
			上锁房间列表.forEach(上锁房间 => {
			    const 房间 = 房间列表[房间列表.findIndex(item=>item?.id==上锁房间.id)];
			    if (房间) {
			        const 选项 = document.createElement('option');
			        选项.value = 房间.id;
			        选项.textContent = `${房间.名称 || `房间 ${房间.id}`}`;
			        if (房间.id === parseInt(值)) {
			            选项.selected = true;
			        }
			        输入框.appendChild(选项);
			    }
			});
			        } else if (键 === '对应门ID' && 父对象 instanceof 钥匙) {
			输入框 = document.createElement('select');
			
			const 默认选项 = document.createElement('option');
			默认选项.value = "-1";
			默认选项.textContent = "万能钥匙";
			if (parseInt(值) === -1) 默认选项.selected = true;
			输入框.appendChild(默认选项);
			
			上锁房间列表.forEach(上锁房间 => {
			    const 房间 = 房间列表[房间列表.findIndex(item=>item?.id==上锁房间.id)];
			    if (房间) {
			        const 选项 = document.createElement('option');
			        选项.value = 房间.id;
			        选项.textContent = `${房间.名称 || `房间 ${房间.id}`}`;
			        if (房间.id === parseInt(值)) {
			            选项.selected = true;
			        }
			        输入框.appendChild(选项);
			    }
			});
			        } else if (键 === '颜色索引' && ((父对象 instanceof 单元格 && [单元格类型.门, 单元格类型.上锁的门].includes(父对象.背景类型)) || 父对象 instanceof 门 || 父对象 instanceof 钥匙 || 是房间编辑器)) {
			输入框 = document.createElement('select');
			颜色名表.forEach((名称, 索引) => {
			    const 选项 = document.createElement('option');
			    选项.value = 索引;
			    选项.textContent = 名称;
			    if (索引 === parseInt(值)) 选项.selected = true;
			    输入框.appendChild(选项);
			});
			        }
			        else if (键 === '材质' && 父对象 instanceof 物品) {
			输入框 = document.createElement('select');
			const 材料列表 = Object.values(材料);
			材料列表.forEach(材质 => {
			    const 选项 = document.createElement('option');
			    选项.value = 材质;
			    选项.textContent = 材质;
			    if (材质 === 值) 选项.selected = true;
			    输入框.appendChild(选项);
			});
			        } else if (typeof 值 === 'boolean') {
			输入框 = document.createElement('input');
			输入框.type = 'checkbox';
			输入框.checked = 值;
			        } else if (键 === '类型' && 父对象.id !== undefined) { 
			输入框 = document.createElement('select');
			const 类型列表 = ['房间', '挑战房间', '单向房间', '黑暗房间', '隐藏解谜棋盘', '隐藏罐子房间', '隐藏植物房间', '隐藏书库房间', '隐藏药水房间'];
			类型列表.forEach(类型 => {
			    const 选项 = document.createElement('option');
			    选项.value = 类型;
			    选项.textContent = 类型;
			    if (类型 === 值) 选项.selected = true;
			    输入框.appendChild(选项);
			});
			        } else if (typeof 值 === 'number') {
			输入框 = document.createElement('input');
			输入框.type = 'number';
			输入框.value = 值;
			输入框.style.width = '100px';
			        } else {
			输入框 = document.createElement('input');
			输入框.type = 'text';
			输入框.value = 值;
			输入框.style.width = '150px';
			        }
			        输入框.style.marginLeft = 'auto';
			        输入框.dataset.key = 键;
			        输入框.dataset.isCustom = 是自定义数据;
			        输入框.dataset.parent = 待更新对象 === 'isLockedFlag' ? 'isLockedFlag' : (是自定义数据 ? 'customData' : 'direct');
			        if (待更新对象 === '挑战状态') {
			输入框.dataset.parentKey = '挑战状态';
			        }
			        包装元素.appendChild(输入框);
			        return 包装元素;
			    };
			
			        if (目标对象 instanceof 刷怪笼) {
			        const { monsters } = 获取所有可用的定义();
			        const monsterOptions = monsters.map(m => {
			            const instance = new m.类({});
			            return { name: instance.类型, value: m.类.name };
			        }).filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
			        
			        const spawnerRow = 创建字段('生成物类名', 目标对象.自定义数据.get('生成物类名'), 目标对象, true);
			        const spawnerSelect = document.createElement('select');
			        monsterOptions.forEach(opt => {
			            const option = document.createElement('option');
			            option.value = opt.value;
			            option.textContent = opt.name;
			            if(opt.value === 目标对象.自定义数据.get('生成物类名')) option.selected = true;
			            spawnerSelect.appendChild(option);
			        });
			        spawnerSelect.dataset.key = '生成物类名';
			        spawnerSelect.dataset.isCustom = 'true';
			        spawnerRow.replaceChild(spawnerSelect, spawnerRow.querySelector('input'));
			        spawnerSelect.style.marginLeft = 'auto';
			        内容.appendChild(spawnerRow);
			
			        const patrolRow = 创建字段('巡逻方向', 目标对象.自定义数据.get('巡逻方向'), 目标对象, true);
			        const patrolSelect = document.createElement('select');
			        ['N', 'S', 'E', 'W'].forEach(dir => {
			            const option = document.createElement('option');
			            option.value = dir;
			            option.textContent = dir;
			            if (dir === 目标对象.自定义数据.get('巡逻方向')) option.selected = true;
			            patrolSelect.appendChild(option);
			        });
			        patrolSelect.dataset.key = '巡逻方向';
			        patrolSelect.dataset.isCustom = 'true';
			        patrolRow.replaceChild(patrolSelect, patrolRow.querySelector('input'));
			        patrolSelect.style.marginLeft = 'auto';
			        内容.appendChild(patrolRow);
			    }
			    
			    if (目标对象 instanceof 传送带) {
			        const directionRow = 创建字段('方向', 目标对象.自定义数据.get('方向'), 目标对象, true);
			        const directionSelect = document.createElement('select');
			        ['N', 'S', 'E', 'W'].forEach(dir => {
			const option = document.createElement('option');
			option.value = dir;
			option.textContent = dir;
			if (dir === 目标对象.自定义数据.get('方向')) option.selected = true;
			directionSelect.appendChild(option);
			        });
			        directionSelect.dataset.key = '方向';
			        directionSelect.dataset.isCustom = 'true';
			        directionRow.replaceChild(directionSelect, directionRow.querySelector('input'));
			        directionSelect.style.marginLeft = 'auto';
			        内容.appendChild(directionRow);
			        
			    }
			    
			    if (目标对象 instanceof 巡逻怪物) {
			        const patrolRow = 创建字段('巡逻方向', 目标对象.巡逻方向, 目标对象);
			        const patrolSelect = document.createElement('select');
			        ['N', 'S', 'E', 'W'].forEach(dir => {
			const option = document.createElement('option');
			option.value = dir;
			option.textContent = dir;
			if (dir === 目标对象.巡逻方向) option.selected = true;
			patrolSelect.appendChild(option);
			        });
			        patrolSelect.dataset.key = '巡逻方向';
			        patrolRow.replaceChild(patrolSelect, patrolRow.querySelector('input'));
			        patrolSelect.style.marginLeft = 'auto';
			        内容.appendChild(patrolRow);
			    }
			
			    if (目标对象 instanceof 怪物) {
			        const 掉落物行 = 创建字段('掉落物', null, 目标对象);
			        const 掉落物选择器 = document.createElement('select');
			        掉落物选择器.dataset.key = '掉落物';
			    
			        const 保留选项 = document.createElement('option');
			        保留选项.value = 'original';
			        保留选项.textContent = '保留原样';
			        掉落物选择器.appendChild(保留选项);
			    
			        const 无掉落选项 = document.createElement('option');
			        无掉落选项.value = 'null';
			        无掉落选项.textContent = '无';
			        掉落物选择器.appendChild(无掉落选项);
			    
			        const { items: allItems } = 获取所有可用的定义();
			        const addedItemNames = new Set();
			    
			        const 可掉落物品定义 = allItems.filter(def => {
			try {
			    const 实例 = new def.类({});
			    const 可掉落类型 = ['武器', '防御装备', '药水', '卷轴', '饰品', '消耗品', '钥匙', '金币', '工具'];
			    return 可掉落类型.includes(实例.类型)
			} catch (e) {
			    return false;
			}
			        });
			        
			
			        可掉落物品定义.forEach(itemDef => {
			const 实例 = new itemDef.类({});
			const itemName = 实例.名称;
			if (!(实例 instanceof 万能钥匙) && itemName && !addedItemNames.has(itemName)) {
			    const 选项 = document.createElement('option');
			    选项.value = itemDef.类.name;
			    选项.textContent = itemName;
			    掉落物选择器.appendChild(选项);
			    addedItemNames.add(itemName);
			}
			        });
			    
			        if (目标对象.掉落物 && 目标对象.掉落物.constructor) {
			掉落物选择器.value = 目标对象.掉落物.constructor.name;
			        } else if (目标对象.掉落物 === null) {
			    掉落物选择器.value = 'null';
			        } else {
			掉落物选择器.value = 'original';
			        }
			    
			        掉落物行.replaceChild(掉落物选择器, 掉落物行.querySelector('input'));
			        掉落物选择器.style.marginLeft = 'auto';
			        内容.appendChild(掉落物行);
			    
			        const 钥匙ID容器 = document.createElement('div');
			        const 钥匙ID行 = 创建字段('钥匙对应房间ID', (目标对象.掉落物 instanceof 钥匙 ? 目标对象.掉落物.自定义数据.get('对应门ID') : -1), null);
			        钥匙ID容器.appendChild(钥匙ID行);
			        内容.appendChild(钥匙ID容器);
			    
			        const 更新钥匙ID可见性 = () => {
			钥匙ID容器.style.display = 掉落物选择器.value === '钥匙' ? 'flex' : 'none';
			        };
			    
			        掉落物选择器.onchange = 更新钥匙ID可见性;
			        更新钥匙ID可见性(); 
			    }
			
			    if (目标对象 instanceof 挑战石碑) {
			        const 奖励容器 = document.createElement('div');
			        奖励容器.id = 'custom-reward-container';
			        奖励容器.innerHTML = '<h5 style="margin-top: 15px; border-top: 1px solid #444; padding-top: 10px;">自定义奖励</h5>';
			        
			        const 奖励列表 = 目标对象.自定义数据.get('自定义奖励') || [];
			        const { items: 所有可用物品 } = 获取所有可用的定义();
			
			        const 重绘奖励列表 = () => {
			    奖励容器.querySelectorAll('.reward-item').forEach(el => el.remove());
			    奖励列表.forEach((奖励, 索引) => {
			            const 奖励行 = document.createElement('div');
			            奖励行.className = 'reward-item';
			            奖励行.style.cssText = 'display: flex; gap: 5px; align-items: center; margin-bottom: 5px;';
			            const 选择框 = document.createElement('select');
			            所有可用物品.forEach(itemDef => {
			                const 选项 = document.createElement('option');
			                选项.value = itemDef.类.name;
			                const 实例 = new itemDef.类({});
			                选项.textContent = 实例.名称 || 实例.类型;
			                if(奖励.类名 === itemDef.类.name) 选项.selected = true;
			                选择框.appendChild(选项);
			            });
			            选择框.onchange = () => {
			                奖励列表[索引].类名 = 选择框.value;
			                奖励列表[索引].配置 = {}; 
			            };
			
			            const 删除按钮 = document.createElement('button');
			            删除按钮.textContent = '×';
			            删除按钮.onclick = () => {
			            奖励列表.splice(索引, 1);
			            重绘奖励列表();
			            };
			            奖励行.appendChild(选择框);
			            奖励行.appendChild(删除按钮);
			            奖励容器.appendChild(奖励行);
			    });
			        };
			
			        const 添加奖励按钮 = document.createElement('button');
			        添加奖励按钮.textContent = '添加奖励物品';
			        添加奖励按钮.className = '菜单按钮';
			        添加奖励按钮.style.cssText = "padding: 5px 10px; font-size: 0.8em; margin-top: 5px;";
			        添加奖励按钮.onclick = () => {
			奖励列表.push({ 类名: 所有可用物品[0].类.name, 配置: {} });
			重绘奖励列表();
			        };
			
			        重绘奖励列表();
			        奖励容器.appendChild(添加奖励按钮);
			        内容.appendChild(奖励容器);
			    }
			
			    if (!(当前编辑对象 instanceof 物品) && !(当前编辑对象 instanceof 怪物) && !(当前编辑对象 instanceof 门) && !(当前编辑对象.id !== undefined)) {
			        const 墙壁包装器 = document.createElement('div');
			        墙壁包装器.innerHTML = '<h5>墙壁</h5>';
			        墙壁包装器.style.border = '1px solid #555';
			        墙壁包装器.style.padding = '10px';
			        墙壁包装器.style.borderRadius = '8px';
			        ['上', '下', '左', '右'].forEach(方向 => {
			墙壁包装器.appendChild(创建字段(方向, 当前单元格.墙壁[方向], 当前单元格.墙壁));
			        });
			        内容.appendChild(墙壁包装器);
			        内容.appendChild(创建字段('是否强制墙壁', 当前单元格.是否强制墙壁, 当前单元格));
			        编辑器状态.上次放置的背景 = 当前编辑对象;
			    }
			
			    if (是房间编辑器) {
			        内容.appendChild(创建字段('id', 当前编辑对象.id, 当前编辑对象));
			        内容.appendChild(创建字段('名称', 当前编辑对象.名称, 当前编辑对象));
			        内容.appendChild(创建字段('类型', 当前编辑对象.类型, 当前编辑对象));
			        内容.appendChild(创建字段('已探索', 当前编辑对象.已探索 || false, 当前编辑对象));
			        内容.appendChild(创建字段('是否上锁', 是上锁房间, 当前编辑对象, false, 'isLockedFlag'));
			        内容.appendChild(创建字段('颜色索引', 当前编辑对象.颜色索引 || 0, 当前编辑对象));
			        const 挑战设置容器 = document.createElement('div');
			        挑战设置容器.innerHTML = '<h5 style="margin-top: 15px; border-top: 1px solid #444; padding-top: 10px;">挑战房间属性</h5>';
			                    if((当前编辑对象?.挑战状态?.当前波次 === undefined)) 当前编辑对象.挑战状态 = { 进行中: false, 已完成: false, 当前波次: 0, 总波次: 5, 波次最大回合数: 30, 波次当前回合数: 0, 波次内怪物: [], 原始门数据: [],挑战怪物层级:1 };
			        
			        const 挑战状态 = 当前编辑对象.挑战状态 || {};
			        const 总波次 = 挑战状态.总波次 ?? 5;
			        const 波次最大回合数 = 挑战状态.波次最大回合数 ?? 30;
			        const 挑战怪物层级 = 挑战状态.挑战怪物层级 ?? 1;
			
			        挑战设置容器.appendChild(创建字段('总波次', 总波次, 当前编辑对象, false, '挑战状态'));
			        挑战设置容器.appendChild(创建字段('波次最大回合数', 波次最大回合数, 当前编辑对象, false, '挑战状态'));
			        挑战设置容器.appendChild(创建字段('挑战怪物层级', 挑战怪物层级, 当前编辑对象, false, '挑战状态'));
			        
			        const 怪物池容器 = document.createElement('div');
			        怪物池容器.innerHTML = '<p style="margin: 10px 0 5px 0; font-size: 0.9em; color: #ccc;">候选怪物 (默认使用层级生成)</p>';
			        怪物池容器.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px;';
			        
			        const 默认怪物层级 = 挑战怪物层级 === -1 ? (当前层数 ?? 0) : 挑战怪物层级;
			        const 默认池 = new Set(怪物池["上锁房间"].filter(m => m.最小层 <= 默认怪物层级).map(cfg => cfg.类.name));
			        const 当前候选怪物池 = new Set(挑战状态.候选怪物池 || 默认池);
			        const { monsters: allMonsters } = 获取所有可用的定义();
			
			        allMonsters.forEach(def => {
			const 怪物实例 = new def.类({玩家放置:true});
			const 包装 = document.createElement('div');
			包装.style.display = 'flex';
			包装.style.alignItems = 'center';
			const 复选框 = document.createElement('input');
			复选框.type = 'checkbox';
			复选框.id = `monster-check-${怪物实例.类型}`;
			复选框.dataset.className = def.类.name;
			复选框.checked = 当前候选怪物池.has(def.类.name);
			const 标签 = document.createElement('label');
			标签.htmlFor = 复选框.id;
			标签.textContent = 怪物实例.类型;
			标签.style.marginLeft = '5px';
			包装.appendChild(复选框);
			包装.appendChild(标签);
			怪物池容器.appendChild(包装);
			        });
			        挑战设置容器.appendChild(怪物池容器);
			
			        内容.appendChild(挑战设置容器);
			    } else if (目标对象 instanceof 传送门) {
			        内容.appendChild(创建字段('是否随机', 目标对象.自定义数据.get('是否随机'), 目标对象, true));
			        const 目标X字段 = 创建字段('目标X', 目标对象.自定义数据.get('目标X'), 目标对象, true);
			        const 目标Y字段 = 创建字段('目标Y', 目标对象.自定义数据.get('目标Y'), 目标对象, true);
			        内容.appendChild(目标X字段);
			        内容.appendChild(目标Y字段);
			    
			        const isRandomCheckbox = 内容.querySelector('input[data-key="是否随机"]');
			        const updateVisibility = () => {
			const isChecked = isRandomCheckbox.checked;
			目标X字段.style.display = isChecked ? 'none' : 'flex';
			目标Y字段.style.display = isChecked ? 'none' : 'flex';
			        };
			        isRandomCheckbox.addEventListener('change', updateVisibility);
			        updateVisibility();
			} else if (目标对象 instanceof 告示牌) {
			        const 文本区域 = document.createElement('textarea');
			        文本区域.value = 目标对象.自定义数据.get('内容') || '';
			        文本区域.style.width = '100%';
			        文本区域.style.minHeight = '100px';
			        文本区域.dataset.key = '内容';
			        文本区域.dataset.isCustom = 'true';
			        内容.appendChild(文本区域);
			    } else if (目标对象 instanceof 存档点) {
			        内容.appendChild(创建字段('目标X', 目标对象.自定义数据.get('目标X'), 目标对象, true));
			        内容.appendChild(创建字段('目标Y', 目标对象.自定义数据.get('目标Y'), 目标对象, true));
			    }
			    else if (目标对象 instanceof 开关脉冲器) {
			        const 状态行 = 创建字段('监测状态', 目标对象.自定义数据.get('监测状态'), 目标对象, true);
			        const 状态选择 = document.createElement('select');
			        ['红', '蓝', '绿', '紫'].forEach(状态 => {
			const 选项 = document.createElement('option');
			选项.value = 状态.toLowerCase();
			选项.textContent = 状态;
			if (选项.value === 目标对象.自定义数据.get('监测状态')) 选项.selected = true;
			状态选择.appendChild(选项);
			        });
			        状态选择.dataset.key = '监测状态';
			        状态选择.dataset.isCustom = 'true';
			        状态行.replaceChild(状态选择, 状态行.querySelector('input'));
			        状态选择.style.marginLeft = 'auto';
			        内容.appendChild(状态行);
			        内容.appendChild(创建字段('脉冲范围', 目标对象.自定义数据.get('脉冲范围'), 目标对象, true));
			        内容.appendChild(创建字段('脉冲冷却', 目标对象.自定义数据.get('脉冲冷却'), 目标对象, true));
			    } else {
			        for (const 键 in 目标对象) {
			if (Object.hasOwnProperty.call(目标对象, 键) && ['string', 'number', 'boolean'].includes(typeof 目标对象[键])) {
			        if (键 === 'id' || 键 === '已连接' || 键 === 'x' || 键 === 'y' || 键 === '是否强制墙壁' || 键 === '材质' || 键 === '掉落物' || 键 === '巡逻方向') continue;
			        let 控件 = 创建字段(键, 目标对象[键], 目标对象);
			        if(控件) 内容.appendChild(控件);
			}
			        }
			        if (目标对象 instanceof 物品) {
			内容.appendChild(创建字段('材质', 目标对象.材质, 目标对象));
			        }
			    }
			    
			    if (目标对象 instanceof 门) {
			内容.appendChild(创建字段('关联房间ID', 目标对象.房间ID, 目标对象));
			
			内容.appendChild(创建字段('颜色索引', 当前单元格.颜色索引, 目标对象));
			            const hr = document.createElement('hr');
			hr.style.borderColor = '#444';
			内容.appendChild(hr);
			
			const oneWayTitle = document.createElement('h5');
			oneWayTitle.textContent = "单向门设置";
			内容.appendChild(oneWayTitle);
			
			const isOneWayCheckbox = 创建字段('isOneWay', 当前单元格.isOneWay, 当前单元格);
			const oneWayDirectionSelect = 创建字段('oneWayAllowedDirection', 当前单元格.oneWayAllowedDirection, 当前单元格);
			
			内容.appendChild(isOneWayCheckbox);
			内容.appendChild(oneWayDirectionSelect);
			
			const checkboxInput = isOneWayCheckbox.querySelector('input[type="checkbox"]');
			const selectContainer = oneWayDirectionSelect;
			
			selectContainer.style.display = checkboxInput.checked ? 'flex' : 'none';
			checkboxInput.addEventListener('change', () => {
			    selectContainer.style.display = checkboxInput.checked ? 'flex' : 'none';
			});
			    }
			    
			    if (目标对象 instanceof 钥匙) {
			        内容.appendChild(创建字段('对应门ID', 目标对象.自定义数据.get('对应门ID'), 目标对象, true));
			        内容.appendChild(创建字段('地牢层数', 目标对象.自定义数据.get('地牢层数'), 目标对象, true));
			        内容.appendChild(创建字段('颜色索引', 目标对象.颜色索引, 目标对象, false));
			    }
			
			    if (目标对象 instanceof 罐子) {
			        const 罐子标题 = document.createElement('h5');
			        罐子标题.textContent = '罐子内容';
			        内容.appendChild(罐子标题);
			
			        const 类型选择器 = document.createElement('select');
			        类型选择器.dataset.key = '内容物类型';
			        ['随机', '物品', '怪物'].forEach(类型 => {
			const 选项 = document.createElement('option');
			选项.value = 类型;
			选项.textContent = 类型;
			if (类型 === (目标对象.自定义数据.get('内容物类型') || '随机')) 选项.selected = true;
			类型选择器.appendChild(选项);
			        });
			        const 类型行 = 创建字段('内容物类型', null, 目标对象, true);
			        类型行.replaceChild(类型选择器, 类型行.querySelector('input'));
			        类型选择器.style.marginLeft = 'auto'; 
			        内容.appendChild(类型行);
			
			        const 类名选择器容器 = document.createElement('div');
			        const 类名选择器 = document.createElement('select');
			        类名选择器容器.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
			        类名选择器.dataset.key = '内容物类名';
			        const 随机层数容器 = document.createElement('div');
			        随机层数容器.style.display = 'none';
			        随机层数容器.appendChild(创建字段('随机层数', 目标对象.自定义数据.get('随机层数') || 999, 目标对象, true));
			
			        const 更新类名选项 = () => {
			const 选定类型 = 类型选择器.value;
			类名选择器.innerHTML = '';
			随机层数容器.style.display = 'none';
			类名选择器容器.style.display = 'none';
			
			if (选定类型 === '随机') {
			    随机层数容器.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
			} else {
			    类名选择器容器.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
			    const 无选项 = document.createElement('option');
			    无选项.value = '';
			    无选项.textContent = '无';
			    类名选择器.appendChild(无选项);
			
			    const 定义池 = 选定类型 === '物品' ? 获取所有可用的定义().items : 获取所有可用的定义().monsters;
			    定义池.forEach(定义 => {
			        const 实例 = new 定义.类({});
			        const 选项 = document.createElement('option');
			        选项.value = 定义.类.name;
			        选项.textContent = 实例.名称 || 实例.类型;
			        if (选项.value === 目标对象.自定义数据.get('内容物类名')) 选项.selected = true;
			        类名选择器.appendChild(选项);
			    });
			}
			        };
			        
			        类型选择器.onchange = 更新类名选项;
			        const 类名行 = 创建字段('内容物类名', null, 目标对象, true);
			        类名行.replaceChild(类名选择器, 类名行.querySelector('input'));
			        类名选择器.style.marginLeft = 'auto'; 
			        类名选择器容器.appendChild(类名行);
			        内容.appendChild(类名选择器容器);
			        内容.appendChild(随机层数容器);
			        更新类名选项();
			
			    }
			
			    if (目标对象.自定义数据 instanceof Map && !(目标对象 instanceof 告示牌)) {
			const 自定义标题 = document.createElement('h5');
			自定义标题.textContent = '自定义数据';
			自定义标题.style.marginTop = '15px';
			内容.appendChild(自定义标题);
			        目标对象.自定义数据.forEach((值, 键) => {
			    if (['string', 'number', 'boolean'].includes(typeof 值)) {
			    if (!['对应门ID', '地牢层数', '内容物类型', '内容物类名', '随机层数', '是否随机', '目标X', '目标Y', '自定义奖励','方向','巡逻方向', '监测状态', '脉冲范围', '脉冲冷却'].includes(键)) {
			        if (键 === '生成物类名' && 目标对象 instanceof 刷怪笼) return;
			        内容.appendChild(创建字段(键, 值, 目标对象, true));
			    }
			    }
			        });
			    }
			
			    保存按钮.onclick = () => {
			        saveEditorState();
			        if (当前编辑对象 instanceof 怪物) {
			const 掉落物选择 = 内容.querySelector('select[data-key="掉落物"]')?.value;
			if (掉落物选择 === 'original') {
			} else if (掉落物选择 === 'null') {
			    当前编辑对象.掉落物 = null;
			    当前编辑对象.掉落概率 = 0
			} else {
			    const ItemClass = window[掉落物选择];
			    if (ItemClass) {
			        let config = {};
			        if (掉落物选择 === '钥匙') {
			            const 钥匙ID行 = 内容.querySelector('select[data-key="钥匙对应房间ID"]');
			            const 房间ID = 钥匙ID行 ? parseInt(钥匙ID行.value, 10) : -1;
			            let 颜色索引 = 0;
			            if (房间ID !== -1) {
			                const 对应上锁房间 = 上锁房间列表.find(r => r.id === 房间ID);
			                if (对应上锁房间) 颜色索引 = 对应上锁房间.颜色索引 || 0;
			            }
			            config = { 对应门ID: 房间ID, 颜色索引: 颜色索引,地牢层数:-1 };
			        }
			        当前编辑对象.掉落物 = new ItemClass(config);
			    }
			}
			        }
			
			        if (当前编辑对象 instanceof 挑战石碑) {
			    const 奖励列表 = [];
			    内容.querySelectorAll('.reward-item').forEach(奖励行 => {
			            const 类名 = 奖励行.querySelector('select').value;
			            if (类名) {
			                奖励列表.push({ 类名: 类名, 配置: {} }); 
			            }
			    });
			    当前编辑对象.自定义数据.set('自定义奖励', 奖励列表);
			        }
			
			        if (当前编辑对象 instanceof 罐子) {
			const 类型选择器 = 内容.querySelector('select[data-key="内容物类型"]');
			const 类名选择器 = 内容.querySelector('select[data-key="内容物类名"]');
			const 随机层数输入框 = 内容.querySelector('input[data-key="随机层数"]');
			if (类型选择器 && 类名选择器 && 随机层数输入框) {
			    const 选定类型 = 类型选择器.value;
			    当前编辑对象.自定义数据.set('内容物类型', 选定类型);
			    if (选定类型 === '随机') {
			        当前编辑对象.自定义数据.set('随机层数', parseInt(随机层数输入框.value, 10) || 999);
			        当前编辑对象.自定义数据.delete('内容物类名');
			    } else {
			        当前编辑对象.自定义数据.set('内容物类名', 类名选择器.value);
			        当前编辑对象.自定义数据.delete('随机层数');
			    }
			}
			        }
			
			        内容.querySelectorAll('input, select, textarea').forEach(输入框 => {
			const 键 = 输入框.dataset.key;
			if (键==='掉落物') return;
			const 是自定义数据 = 输入框.dataset.isCustom === 'true';
			let 值 = 输入框.value;
			if (输入框.type === 'checkbox') 值 = 输入框.checked;
			else if (输入框.type === 'number' && !Number.isNaN(parseFloat(值))) 值 = parseFloat(值);
			            else if (输入框.tagName === 'SELECT' && 键 !== '类型' && 键 !== 'oneWayAllowedDirection' && 键 !== '对应门ID' && 键 !== '材质' && 键 !== '掉落物' && 键 !== '内容物类型' && 键 !== '内容物类名' && 键 !== '钥匙对应房间ID' && 键 !== '方向' && 键 !== '巡逻方向' && 键 !== '生成物类名' && 键 !== '监测状态') 值 = parseInt(值, 10);
			
			if (['上', '下', '左', '右'].includes(键)) {
			        当前单元格.墙壁[键] = 值;
			} else if(是自定义数据) {
			    if(键 === '对应门ID') 值 = parseInt(值, 10);
			    if (!['内容物类型', '内容物类名', '随机层数'].includes(键)) {
			
			            当前编辑对象.自定义数据.set(键, 值);
			        
			        if (当前编辑对象 instanceof 传送带) {
			            
			            上次放置的传送带 = 当前编辑对象;
			        }
			        if (当前编辑对象 instanceof 开关脉冲器) {
			            
			            上次放置的开关脉冲器 = 当前编辑对象;
			        }
			        if (当前编辑对象 instanceof 隐形毒气陷阱) {
			            
			            上次放置的隐形毒气陷阱 = 当前编辑对象;
			        }
			    }
			} else {
			    if (键 === '是否强制墙壁') {
			        当前单元格.是否强制墙壁 = 值;
			    } else if(输入框.dataset.parent === 'isLockedFlag'){
			        const 房间 = 当前编辑对象;
			        const 上锁房间索引 = 上锁房间列表.findIndex(lr => lr.id === 房间.id);
			        if (值 && 上锁房间索引 === -1) { 
			            房间.颜色索引 = 房间.颜色索引 || 0; 
			            上锁房间列表.push({...房间, 颜色索引: 房间.颜色索引});
			        } else if (!值 && 上锁房间索引 !== -1) { 
			            上锁房间列表.splice(上锁房间索引, 1);
			            delete 房间.颜色索引;
			        }
			        房间.门.forEach(门坐标 => {
			            const 门单元格 = 地牢[门坐标.y]?.[门坐标.x];
			            if(门单元格) {
			                门单元格.背景类型 = 值 ? 单元格类型.上锁的门 : 单元格类型.门;
			                if(值) 门单元格.颜色索引 = 房间.颜色索引 || 0;
			                const 门实例 = 门实例列表.get(门单元格.标识);
			                if (门实例) {
			                    门实例.类型 = 值 ? '上锁的门' : '门';
			                    门实例.是否上锁 = 值;
			                }
			                
			            }
			        });
			    } else if (输入框.dataset.parentKey === '挑战状态' && 当前编辑对象.id !== undefined) {
			        
			        if (!isNaN(值) || typeof 值 === 'boolean' || typeof 值 === 'string') {
			            当前编辑对象.挑战状态[键] = 值;
			        }
			    } else if (键 === '颜色索引') {
			        const 整数值 = parseInt(值);
			        if (是房间编辑器) {
			            const 房间 = 当前编辑对象;
			            房间.颜色索引 = 整数值;
			            const 上锁房间索引 = 上锁房间列表.findIndex(lr => lr.id === 房间.id);
			            if(上锁房间索引 !== -1) {
			                上锁房间列表[上锁房间索引].颜色索引 = 整数值;
			            }
			            房间.门.forEach(门坐标 => {
			                const 门单元格 = 地牢[门坐标.y]?.[门坐标.x];
			                if (门单元格 && 门单元格.背景类型 === 单元格类型.上锁的门) {
			                    门单元格.颜色索引 = 整数值;
			                }
			            });
			        } else if (当前编辑对象 instanceof 门) {
			            当前单元格.颜色索引 = 整数值;
			        } else {
			            当前编辑对象[键] = 整数值;
			        }
			    } else if (键 === '关联房间ID' && 当前编辑对象 instanceof 门) {
			        const 新房间ID = 值 === -1 || Number.isNaN(parseInt(值)) ? null : parseInt(值);
			        const 旧房间ID = 当前编辑对象.房间ID;
			        
			        if (旧房间ID !== null && 房间列表[房间列表.findIndex(item=>item?.id==旧房间ID)]) {
			            房间列表[房间列表.findIndex(item=>item?.id==旧房间ID)].门 = 房间列表[房间列表.findIndex(item=>item?.id==旧房间ID)].门.filter(门坐标 => !(门坐标.x === 当前编辑对象.所在位置.x && 门坐标.y === 当前编辑对象.所在位置.y));
			        }
			        
			        当前编辑对象.房间ID = 新房间ID;
			        
			        if (新房间ID !== null && 房间列表[房间列表.findIndex(item=>item?.id==新房间ID)]) {
			            if (!房间列表[房间列表.findIndex(item=>item?.id==新房间ID)].门.some(门坐标 => 门坐标.x === 当前编辑对象.所在位置.x && 门坐标.y === 当前编辑对象.所在位置.y)) {
			                房间列表[房间列表.findIndex(item=>item?.id==新房间ID)].门.push({...当前编辑对象.所在位置});
			            }
			        }
			        房间列表.sort((a,b)=>a.id-b.id)
			    } else if ((键 === '是否上锁' || 键 === 'isOneWay' || 键 === 'oneWayAllowedDirection') && ([单元格类型.门, 单元格类型.上锁的门].includes(当前单元格.背景类型) || 当前编辑对象 instanceof 门)) {
			        const cellToUpdate = 当前编辑对象 instanceof 门 ? 地牢[当前编辑对象.所在位置.y][当前编辑对象.所在位置.x] : 当前编辑对象;
			        const doorInstance = 当前编辑对象 instanceof 门 ? 当前编辑对象 : 门实例列表.get(当前编辑对象.标识);
			        if (键 === '是否上锁' && doorInstance) {
			            doorInstance.是否上锁 = 值;
			            cellToUpdate.背景类型 = 值 ? 单元格类型.上锁的门 : 单元格类型.门;
			            doorInstance.类型 = 值 ? '上锁的门' : '门';
			        } else {
			            cellToUpdate[键] = 值;
			        }
			        const 配对位置 = cellToUpdate.配对单元格位置;
			        if (配对位置) {
			            const 配对单元格 = 地牢[配对位置.y]?.[配对位置.x];
			            if (配对单元格) {
			                    if (键 === '是否上锁' && doorInstance) {
			                    配对单元格.背景类型 = 值 ? 单元格类型.上锁的门 : 单元格类型.门;
			                    } else {
			                    配对单元格[键] = 值;
			                    }
			            }
			        }
			    } else if (键 === 'id' && 是房间编辑器) {
			        const 新ID = parseInt(值);
			        const 旧ID = 当前编辑对象.id;
			        if (新ID !== 旧ID && !Number.isNaN(新ID) && !房间列表.some(item=>item?.id==新ID)) {
			            
			            房间列表.splice(房间列表.indexOf(当前编辑对象),1);
			            房间列表.push(当前编辑对象);
			            房间列表.sort((a,b)=>a.id-b.id)
			            当前编辑对象.id = 新ID;
			            for(let ry = 当前编辑对象.y; ry < 当前编辑对象.y + 当前编辑对象.h; ry++) {
			                for(let rx = 当前编辑对象.x; rx < 当前编辑对象.x + 当前编辑对象.w; rx++) {
			                    if(房间地图[ry]?.[rx] === 旧ID) {
			                        房间地图[ry][rx] = 新ID;
			                    }
			                }
			            }
			            当前编辑对象.门.forEach(门坐标 => {
			                const 门实例 = 门实例列表.get(地牢[门坐标.y][门坐标.x].标识);
			                
			                if (门实例) 门实例.房间ID = 新ID;
			            });
			        } else if (新ID !== 旧ID) {
			            显示通知(`房间ID ${新ID} 已存在或无效！`, '错误');
			        }
			    } else {
			        if (键 === '类型' && 是房间编辑器) {
			            return;
			        }
			        if(键) {
			            当前编辑对象[键] = 值;
			            
			        }
			    }
			}
			if (当前编辑对象 instanceof 巡逻怪物) 当前编辑对象.初始巡逻();
			if (当前编辑对象 instanceof 蜈蚣怪物) {
    const 长度输入框 = 内容.querySelector('input[data-key="长度"]');
    if (长度输入框) {
        const 新长度 = parseInt(长度输入框.value);
        if (!isNaN(新长度) && 新长度 > 0 && 新长度 !== 当前编辑对象.长度) {
            当前编辑对象?.身体部位?.forEach(item=>{item.移除自身(true)});
            当前编辑对象.长度 = 新长度;
            当前编辑对象.身体部位 = []
            当前编辑对象.初始化身体部位();
            显示通知("蜈蚣长度已更新。", "成功");
        }
    }
}
			        });
			if (是房间编辑器) {
			const 房间 = 当前编辑对象;
			const 旧类型 = 房间.类型;
			const 新类型 = 内容.querySelector('select[data-key="类型"]').value;
			
			if (新类型 !== 旧类型) {
			    清空房间内容(房间);
			    房间.类型 = 新类型;
			    
			    delete 房间.棋子数量;
			    
			    switch(新类型) {
			        
			        case '隐藏解谜棋盘':
			            生成解谜棋盘(房间);
			            break;
			        case '隐藏罐子房间':
			            生成罐子房间内容(房间);
			            break;
			        case '隐藏植物房间':
			            生成植物房间内容(房间);
			            break;
			        case '隐藏书库房间':
			            生成书库房间内容(房间);
			            break;
			        case '隐藏药水房间':
			            生成药水房内容(房间);
			            break;
			    }
			}
			
			房间.挑战状态.候选怪物池 = [];
			内容.querySelectorAll('input[type="checkbox"][data-class-name]').forEach(checkbox => {
			    if (checkbox.checked) {
			        房间.挑战状态.候选怪物池.push(checkbox.dataset.className);
			    }
			});
			
			const 是起始房间 = (
			    玩家初始位置.x >= 房间.x && 玩家初始位置.x < 房间.x + 房间.w &&
			    玩家初始位置.y >= 房间.y && 玩家初始位置.y < 房间.y + 房间.h
			);
			const 已探索 = 内容.querySelector('input[data-key="已探索"]').checked;
			if (是起始房间 && !已探索) {
			    
			    房间.已探索 = true; 
			    const 已探索输入框 = 内容.querySelector('input[data-key="已探索"]');
			    if (已探索输入框) 已探索输入框.checked = true;
			} else {
			    房间.已探索 = 已探索;
			}
			        }
			        for (let y = 0; y < 地牢大小; y++) {
			        for (let x = 0; x < 地牢大小; x++) {
			            const cell = 地牢[y][x];
			            if (cell.关联物品 instanceof 神秘商人) {
			                cell.关联物品.生成库存(Math.max(cell.关联物品.自定义数据.get('商品层数'), 0));
			            } else if (cell.关联物品 instanceof 探险家) {
			                cell.关联物品.生成收购需求(cell.关联物品.自定义数据.get('需求层数'));
			            }
			        }
			    }
			        生成墙壁();
			        显示通知('属性已保存', '成功');
			        关闭属性编辑器();
			    };
			    删除按钮.onclick = () => {
			        saveEditorState();
			        if (当前单元格 && (当前单元格.关联物品 === 对象.关联物品 || 当前单元格.关联怪物 === 对象.关联怪物)) {
			重置单元格(横坐标,纵坐标);
			        } else if (对象 instanceof 单元格 && [单元格类型.门, 单元格类型.上锁的门].includes(对象.背景类型)) {
			重置单元格(横坐标, 纵坐标); 
			        } else if (对象.id !== undefined && 房间列表[房间列表.findIndex(item=>item?.id==对象.id)] === 对象) {
			const 房间 = 房间列表[房间列表.findIndex(item=>item?.id==对象.id)];
			for(let ry = 房间.y; ry < 房间.y + 房间.h; ry++){
			        for(let rx = 房间.x; rx < 房间.x + 房间.w; rx++){
			            房间地图[ry][rx] = -1;
			        }
			}
			const 上锁房间索引 = 上锁房间列表.findIndex(lr => lr.id === 房间.id);
			if(上锁房间索引 !== -1) {
			    上锁房间列表.splice(上锁房间索引, 1);
			}
			房间列表.filter(item => item !== 对象);
			生成墙壁();
			        }
			        显示通知('对象已删除', '成功');
			        关闭属性编辑器();
			    };
			
			    关闭按钮.onclick = 关闭属性编辑器;
			    遮罩.style.display = 'block';
			}
			
			function 清空房间内容(房间) {
			    if (!房间) return;
			    
			    for (let 纵坐标 = 房间.y; 纵坐标 < 房间.y + 房间.h; 纵坐标++) {
			        for (let 横坐标 = 房间.x; 横坐标 < 房间.x + 房间.w; 横坐标++) {
			            const 单元格 = 地牢[纵坐标]?.[横坐标];
			            if (单元格) {
			                // 移除物品
			                if (单元格.关联物品) {
			                    // 如果物品在计时器列表中，也一并移除
			                    const 计时器索引 = 所有计时器.findIndex(计时器 => 计时器.唯一标识 === 单元格.关联物品.唯一标识);
			                    if (计时器索引 !== -1) {
			                        所有计时器.splice(计时器索引, 1);
			                    }
			                    单元格.关联物品 = null;
			                }
			                // 移除怪物
			                if (单元格.关联怪物) {
			                    所有怪物 = 所有怪物.filter(怪物 => 怪物 !== 单元格.关联怪物);
			                    单元格.关联怪物 = null;
			                }
			                // 重置单元格类型，但保留背景类型
			                if (单元格.类型 !== null) {
			                    单元格.类型 = null;
			                }
			            }
			        }
			    }
			    绘制();
			}
			function 关闭属性编辑器() {
			    const 遮罩 = document.getElementById('编辑器属性面板遮罩');
			    遮罩.style.display = 'none';
			    编辑器状态.选中实例 = null;
			    绘制小地图();
			}
			
			            function 下载地图文件() {
			    const 地图字符串 = 导出地图();
			    if (!地图字符串) {
			        显示通知('导出地图失败！', '错误');
			        return;
			    }
			    const 数据块 = new Blob([地图字符串], { type: 'application/json' });
			    const 下载链接 = URL.createObjectURL(数据块);
			    const 链接元素 = document.createElement('a');
			    链接元素.href = 下载链接;
			    const 时间戳 = new Date().toISOString().replace(/[:.]/g, "-");
			    链接元素.download = `自定义地图_${时间戳}.json`;
			    document.body.appendChild(链接元素);
			    链接元素.click();
			    document.body.removeChild(链接元素);
			    URL.revokeObjectURL(下载链接);
			    显示通知('地图已导出!', '成功');
			}
			
			function 进入编辑器游玩模式() {
			    处理房间状态();
			    编辑器状态备份 = 导出地图();
			    编辑器玩家 = {...玩家}
			    if(!编辑器状态备份) {
			        显示通知("无法备份地图状态，无法进入游玩模式。", "错误");
			        return;
			    }
			
			    游戏状态 = '编辑器游玩';
			    document.body.classList.remove('地图编辑器模式');
			    document.body.classList.add('编辑器游玩模式');
			    document.body.classList.add('游戏进行中');
			    document.getElementById('编辑器工具栏').style.display = 'none';
			    document.getElementById('笔刷工具容器').style.display = 'none';
			    document.getElementById('返回编辑器按钮').style.display = 'block';
			
			    canvas.removeEventListener('mousedown', 编辑器鼠标按下处理);
			    canvas.removeEventListener('mousemove', 编辑器鼠标移动处理);
			    canvas.removeEventListener('mouseup', 编辑器鼠标抬起处理);
			    canvas.removeEventListener('touchstart', 编辑器触摸开始处理);
			    canvas.removeEventListener('touchmove', 编辑器触摸移动处理);
			    canvas.removeEventListener('touchend', 编辑器触摸结束处理);
			    canvas.removeEventListener('contextmenu', 编辑器右键处理);
			
			    canvas.addEventListener("touchstart", 处理地图点击);
			    canvas.addEventListener("click", 处理地图单击);
			    
			    document.getElementById("背包物品栏").innerHTML = '';
			    玩家背包.clear();
			    const 背包弹窗 = document.querySelector('.背包弹窗');
			    const 背包标题元素 = 背包弹窗.querySelector(':scope > .弹窗头部 > h3');
			    if (背包标题元素) {
			        背包标题元素.innerHTML = `背包 (容量：<span id="当前容量">0</span>/<span id="最大容量">${最大背包容量}</span>)`;
			    }
			    const 互动按钮元素 = document.getElementById('互动按钮');
			    if (互动按钮元素) 互动按钮元素.style.background = '';
			    Object.assign(玩家属性, 自定义全局设置.玩家属性);
			    玩家属性.最大生命值加成 = 自定义全局设置.初始生命值 - 100;
			    初始玩家属性.最大生命值加成 = 自定义全局设置.初始生命值 - 100;
			    初始玩家属性 = {...玩家属性};
			
			    最大背包容量 = 自定义全局设置.初始背包容量;
			    
			    document.querySelector(".health-bar").style.width = "100%";
			    document.querySelector(".power-bar").style.width = "100%";
			    
			    
			    玩家总移动回合数 = 0;
			    玩家总受到伤害 = 0;
			    
			    当前天气效果 = [...自定义全局设置.全局天气];
			    if (当前天气效果.length > 0) {
			        显示通知(`当前天气: ${当前天气效果.join(', ')}`, '信息', true);
			    }
			
			    玩家.x = 玩家初始位置.x;
			    玩家.y = 玩家初始位置.y;
			    玩家属性.允许移动 = 0;
			    
			
			    const 玩家起始房间ID = 房间地图[玩家.y]?.[玩家.x];
			    if (玩家起始房间ID !== -1 && 玩家起始房间ID !== undefined) {
			        已访问房间.add(玩家起始房间ID);
			    }
			    所有怪物.forEach(monster => {
			if (monster instanceof 巡逻怪物) {
			    monster.初始巡逻();
			}
			        });
			        
			    for (let y = 0; y < 地牢大小; y++) {
			        for (let x = 0; x < 地牢大小; x++) {
			            const cell = 地牢[y][x];
			            if (cell?.关联物品?.玩家放置) {
			                if(!所有计时器.some(t => t.唯一标识 === cell.关联物品.唯一标识)) {
			            所有计时器.push(cell.关联物品);
			        }
			                
			            }
			        }
			    }
			    更新装备显示();
			    更新背包显示();
			    更新视口(true);
			    更新光源地图();
			    更新洞穴视野();
			    绘制小地图();
			    更新胜利条件显示();
			    处理沉浸式传送门();
			    绘制();
			
			    显示通知('已进入游玩模式。点击左上角按钮返回。', '信息');
			}
			function 导出地图() {
			    处理房间状态();
			    玩家背包.clear();
			    const 地图存档数据 = 保存游戏状态(); 
			    填充编辑器背包();
			    return 地图存档数据;
			}
			
			function 导入地图(存档字符串) {
			     try {
			        const 地图数据 = JSON.parse(存档字符串);
			        if (!地图数据 || (!地图数据.版本 && !地图数据.编辑器状态数据)) {
			            显示通知("地图或存档数据无效！", "错误");
			            return;
			        }
			
			        if (游戏状态 === '地图编辑器') {
			            if (地图数据.isPublished) {
			                显示通知("编辑器无法加载已发布的创意关卡！", "错误");
			                return;
			            }
			            if (地图数据.版本 && !地图数据.编辑器状态数据) {
			                显示通知("编辑器无法加载游戏存档文件！", "错误");
			                return;
			            }
			        }
			        
			        重置所有游戏状态(); 
			        恢复游戏状态(地图数据);
			
			        游戏状态 = "地图编辑器";
			        最高教程阶段 = 6;
			        document.body.classList.add("地图编辑器模式");
			        document.body.classList.remove("游戏进行中", "编辑器游玩模式");
			        更新编辑器快速访问栏();
			        
			        获取所有可用的定义();
			        填充编辑器背包();
			        
			        玩家.x = 地图数据.玩家.x;
			        玩家.y = 地图数据.玩家.y;
			        
			        更新视口();
			        绘制小地图();
			        
			        显示通知("地图加载成功！", "成功");
			    } catch (错误) {
			        console.error("导入地图失败:", 错误);
			        显示通知("导入地图失败，文件格式错误。", "错误");
			        进入地图编辑器(); 
			    }
			}
			
			
			
			function 序列化单元格(单元格实例, 物品标识映射, 怪物索引映射) {
			    if (!单元格实例) return null;
			    try {
			        const 序列化数据 = {};
			        
			        if (单元格实例.类型 !== 单元格类型.墙壁) 序列化数据.类型 = 单元格实例.类型;
			        if (单元格实例.背景类型 !== 单元格类型.墙壁) 序列化数据.背景类型 = 单元格实例.背景类型;
			        if (单元格实例.是否强制墙壁) 序列化数据.是否强制墙壁 = true;
			        
			        const 墙壁数据 = {};
			        let 有墙 = false;
			        for (const 方向 in 单元格实例.墙壁) {
			            if (单元格实例.墙壁[方向]) {
			                墙壁数据[方向] = true;
			                有墙 = true;
			            }
			        }
			        if (有墙) 序列化数据.墙壁 = 墙壁数据;
			
			        if (单元格实例.钥匙ID !== null) 序列化数据.钥匙ID = 单元格实例.钥匙ID;
			        if (单元格实例.颜色索引 !== 颜色表.length) 序列化数据.颜色索引 = 单元格实例.颜色索引;
			
			        if (单元格实例.类型 === 单元格类型.楼梯下楼 || 单元格实例.类型 === 单元格类型.楼梯上楼) {
			            if (单元格实例.关联物品?.图标) 序列化数据.关联物品图标 = 单元格实例.关联物品.图标;
			        } else if (单元格实例.关联物品) {
			            const 关联物品标识 = 物品标识映射.get(单元格实例.关联物品.唯一标识);
			            if (关联物品标识) {
			                序列化数据.关联物品标识 = 关联物品标识;
			            } else {
			                const serializedItem = 序列化物品(单元格实例.关联物品);
			                if (serializedItem) {
			                    序列化数据.关联物品标识 = serializedItem.唯一标识符串;
			                    if (!物品标识映射.has(单元格实例.关联物品.唯一标识)) {
			                        物品标识映射.set(单元格实例.关联物品.唯一标识, 序列化数据.关联物品标识);
			                    }
			                }
			            }
			        }
			        
			        if (单元格实例.关联怪物) {
			            const 关联怪物索引 = 怪物索引映射.get(单元格实例.关联怪物);
			            if (关联怪物索引 !== undefined) {
			               序列化数据.关联怪物索引 = 关联怪物索引;
			            }
			        }
			
			        if (单元格实例.标识) 序列化数据.标识符串 = 单元格实例.标识.toString();
			        if (单元格实例.配对单元格位置) 序列化数据.配对单元格位置 = { ...单元格实例.配对单元格位置 };
			        if (单元格实例.isOneWay) 序列化数据.isOneWay = true;
			        if (单元格实例.oneWayAllowedDirection) 序列化数据.oneWayAllowedDirection = 单元格实例.oneWayAllowedDirection;
			        if (单元格实例.doorOrientation) 序列化数据.doorOrientation = 单元格实例.doorOrientation;
			        if (单元格实例.阻碍视野) 序列化数据.阻碍视野 = 单元格实例.阻碍视野;
			
			        return 序列化数据;
			    } catch (e) {
			        console.error(`序列化单元格 (${单元格实例.x}, ${单元格实例.y}) 失败:`, e);
			        return null;
			    }
			}
			
function 保存游戏状态() {
			    console.log("开始打包游戏状态...");
			    try {
			        const 全局物品标识映射 = new Map();
			        [...玩家背包.values(), ...玩家装备.values()].forEach(
			            (物品实例) => {
			                if (物品实例) {
			                    全局物品标识映射.set(
			                        物品实例.唯一标识,
			                        物品实例.唯一标识.toString()
			                    );
			                }
			            }
			        );
					当前出战宠物列表.forEach(pet => {
						全局物品标识映射.set(
			                pet.唯一标识,
			                pet.唯一标识.toString()
			            );
});
			        const 当前楼层所有怪物 = 所有地牢层.get(当前层数)?.所有怪物 || [];
			        const 怪物索引映射 = new Map();
			        当前楼层所有怪物.forEach((怪物, 索引) => 怪物索引映射.set(怪物, 索引));
			
			        const 序列化玩家背包 = Array.from(玩家背包.values())
			            .map(序列化物品)
			            .filter((物品数据) => 物品数据 != null);
			
			        const 序列化玩家装备 = Array.from(玩家装备.entries())
			            .map(([槽位, 物品实例]) =>
			                物品实例
			                    ? {
			                          槽位: 槽位,
			                          唯一标识符串: 全局物品标识映射.get(
			                              物品实例.唯一标识
			                          ),
			                      }
			                    : null
			            )
			            .filter((装备数据) => 装备数据 != null);
			
			        const 序列化玩家状态 = 玩家状态
			            .map((状态实例) => {
			                let 来源标识符串 = null;
			                if (状态实例.来源 && 状态实例.来源.唯一标识) {
			                    来源标识符串 = 全局物品标识映射.get(
			                        状态实例.来源.唯一标识
			                    );
			                }
			                return {
			                    类型: 状态实例.类型,
			                    颜色: 状态实例.颜色,
			                    图标: 状态实例.图标,
			                    持续时间: 状态实例.持续时间,
			                    剩余回合: 状态实例.剩余回合,
			                    强度: 状态实例.强度,
			                    来源类名: 状态实例.来源?.constructor.name,
			                    来源标识符串: 来源标识符串,
			                };
			            })
			            .filter((状态数据) => 状态数据 != null);
			
			        const 序列化激活卷轴 = Array.from(当前激活卷轴列表)
			            .map((卷轴实例) =>
			                全局物品标识映射.get(卷轴实例.唯一标识)
			            )
			            .filter((标识符串) => 标识符串 != null);
			
			        const 当前楼层临时数据 = {
			            地牢数组: 地牢,
			            房间列表: 房间列表,
			            上锁房间列表: 上锁房间列表,
			            已访问房间: 已访问房间,
			            房间地图: 房间地图,
			            门实例列表: 门实例列表,
			            所有怪物: 所有怪物,
			            所有计时器: 所有计时器,
			            玩家初始位置: 玩家初始位置,
			            玩家位置: 玩家,
			            当前天气效果: 当前天气效果.length == 0 ? 自定义全局设置.全局天气 : 当前天气效果,
			            已放置配方卷轴:
			                所有地牢层.get(当前层数)?.已放置配方卷轴 || false,
			        };
			
			        const 序列化所有楼层数据 = {};
			        for (const [层号, 楼层数据] of 所有地牢层.entries()) {
			            if (层号 !== 当前层数)
			                序列化所有楼层数据[层号] = 序列化楼层(
			                    层号,
			                    楼层数据,
			                    全局物品标识映射
			                );
			        }
			        if (当前层数 !== null) {
			            序列化所有楼层数据[当前层数] = 序列化楼层(
			                当前层数,
			                当前楼层临时数据,
			                全局物品标识映射
			            );
			        }
			        const 序列化所有传送门 = 所有传送门.map(p => 序列化物品(p)).filter(Boolean);
			
			        const 当前生命值百分比 =
			            parseFloat(
			                document.querySelector(".health-bar")?.style.width
			            ) || 100;
			        const 当前能量值百分比 =
			            parseFloat(
			                document.querySelector(".power-bar")?.style.width
			            ) || 100;

					let 编辑器状态数据 = {};
					if (游戏状态 === '地图编辑器') {
						编辑器状态数据 = {
							玩家位置: { x: 玩家.x, y: 玩家.y },
							相机位置: { x: 当前相机X, y: 当前相机Y },
							模式: 编辑器状态.模式,
							工具栏模式: 编辑器工具栏模式,
							当前选中: null,
							笔刷设置: {
								模式: 编辑器状态.笔刷模式,
								形状: 编辑器状态.笔刷形状,
								半径: 编辑器状态.笔刷半径,
							},
							最近使用列表: 编辑器最近使用列表.map((实例) => {
								const isVirtual = !(实例 instanceof 物品) && !(实例 instanceof 怪物);
								if (isVirtual) {
									return {
										isVirtual: true,
										名称: 实例.名称,
										类型: 实例.类型,
										图标: 实例.图标,
										绘制类型: 实例.绘制类型,
										类: 实例.类?.name
									};
								} else if (实例 instanceof 怪物) {
									return {
										isVirtual: false,
										图鉴类型: "怪物",
										类名: 实例.constructor.name,
									};
								} else {
									return {
										isVirtual: false,
										图鉴类型: "物品",
										类名: 实例.constructor.name,
									};
								}
							}),
						};
						if (编辑器状态.当前选中) {
							const isVirtual = !(编辑器状态.当前选中 instanceof 物品) && !(编辑器状态.当前选中 instanceof 怪物);
							if(isVirtual) {
								编辑器状态数据.当前选中 = {
									isVirtual: true,
									名称: 编辑器状态.当前选中.名称,
									类型: 编辑器状态.当前选中.类型,
									图标: 编辑器状态.当前选中.图标,
									绘制类型: 编辑器状态.当前选中.绘制类型,
									类: 编辑器状态.当前选中.类?.name
								};
							} else if (编辑器状态.当前选中 instanceof 怪物) {
								编辑器状态数据.当前选中 = { isVirtual: false, 图鉴类型: '怪物', 类名: 编辑器状态.当前选中.constructor.name };
							} else {
								编辑器状态数据.当前选中 = { isVirtual: false, 图鉴类型: '物品', 类名: 编辑器状态.当前选中.constructor.name };
							}
						}
					}
			
			        const 存档数据 = {
			            版本: 存档版本,
			            游戏版本: 游戏版本,
			            保存时间: new Date().toISOString(),
			            当前游戏种子: 当前游戏种子 || Date.now().toString(),
			            玩家职业: 玩家职业,
			            所有传送门: 序列化所有传送门,
			            游戏开始时间: 游戏开始时间,
			            红蓝开关状态: 红蓝开关状态,
			            绿紫开关状态: 绿紫开关状态,
			            自定义全局设置: {...自定义全局设置,
			                            全局天气: 自定义全局设置.全局天气.length > 0 ? 自定义全局设置.全局天气 : 当前天气效果},
			            编辑器状态数据: 编辑器状态数据,
			            地图标记: Object.fromEntries(Array.from(地图标记.entries()).map(([k, v]) => [k, v])),
			            当前层数: 当前层数,
			            玩家: {
			                x: 玩家.x,
			                y: 玩家.y,
			                属性: { ...玩家属性 },
			                最大背包容量: 最大背包容量,
			                背包:
			                    游戏状态 !== "地图编辑器"
			                        ? 序列化玩家背包
			                        : [],
			                装备: 序列化玩家装备,
			                状态: 序列化玩家状态,
			                当前生命值百分比: 当前生命值百分比,
			                当前能量值百分比: 当前能量值百分比,
			                最大背包容量: 最大背包容量,
			                最大装备槽数量: 最大装备槽数量,
			            },
			            当前出战宠物列表: 当前出战宠物列表.map(pet => 序列化物品(pet)).filter(Boolean),
			            教程: {
			                阶段: 教程阶段,
			                最高阶段: 最高教程阶段,
			                是否教程层: 是否为教程层,
			            },
			            UI: {
			                hud模式: hud模式,
			                显示模式: 显示模式,
			                激活卷轴列表: 序列化激活卷轴,
			                日志历史:
			                    游戏状态 !== "地图编辑器" ? 日志历史 : [],
			                当前装备页: 当前装备页,
			            },
			            游戏统计: { 
			                已击杀怪物数: 已击杀怪物数,
			                玩家总移动回合数: 玩家总移动回合数,
			                玩家总受到伤害: 玩家总受到伤害
			            },
			            所有地牢层数据: 序列化所有楼层数据,
			            传送点列表: 传送点列表.map((点) => ({ ...点 })),
			            上次死亡地点: 上次死亡地点
			                ? { ...上次死亡地点 }
			                : null,
			            永久Buffs: {
			                ...永久Buffs,
			                已获得效果: Array.from(
			                    永久Buffs.已获得效果 || []
			                ),
			            },
			            生存挑战激活: 生存挑战激活,
			            序列化生存挑战备份单元格: 生存挑战备份单元格.map(
			                (备份) => ({
			                    x: 备份.x,
			                    y: 备份.y,
			                    类型: 备份.类型,
			                    背景类型: 备份.背景类型,
			                    墙壁: { ...备份.墙壁 },
			                    关联物品标识: 备份.关联物品
			                        ? 全局物品标识映射.get(
			                              备份.关联物品.唯一标识
			                          )
			                        : null,
			                    关联怪物索引: 备份.关联怪物
			                        ? 怪物索引映射.get(备份.关联怪物)
			                        : null,
			                    颜色索引: 备份.颜色索引,
			                    标识: 备份.标识 ? 备份.标识.toString() : null,
			                })
			            ),
			            配方信息: {
			                程序生成配方列表: 程序生成配方列表,
			                已发现的程序生成配方: 已发现的程序生成配方,
			            },
			        };
			        const 序列化数据 = JSON.stringify(存档数据, null, 2);
			        console.log("游戏状态打包完成！");
			        return 序列化数据;
			    } catch (错误) {
			        console.error("打包游戏状态失败:", 错误);
			        显示通知("打包游戏状态失败！", "错误");
			        return null;
			    }
			}
			
			function 恢复游戏状态(存档数据, 是否是创意关卡 = false) {
			    if (存档数据.游戏版本 && 存档数据.游戏版本 > 游戏版本) {
			    显示通知(`存档版本 (${存档数据.游戏版本}) 高于当前游戏版本 (${游戏版本})，无法加载！`, "错误");
			    
			    return;
			}
			    console.log("开始恢复游戏状态...");
			    if (!存档数据) {
			        console.error("无效的存档数据，无法恢复。");
			        显示通知("存档数据损坏，无法加载！", "错误");
			        return;
			    }
			    重置所有游戏状态();
			    try {
			        当前层数 = 存档数据.当前层数 ?? 0;
			        地图标记 = new Map(Object.entries(存档数据.地图标记 || {}).map(([k, v]) => [parseInt(k, 10), v]));
			        游戏开始时间 = 存档数据.游戏开始时间 || Date.now();
			        当前游戏种子 = 存档数据.当前游戏种子 || Date.now().toString();
			        初始化随机数生成器(当前游戏种子);
			        自定义全局设置 = 存档数据.自定义全局设置 || {
			    初始生命值: 100,
			    初始能量值: 100,
			    初始背包容量: 12,
			    玩家属性: {
			        移动步数: 1,
			        攻击加成: 0,
			        防御加成: 0,
			    },
			    胜利条件: {
			        回合数限制: 0,
			        伤害限制: 0,
			        生命下限: 0,
			        清除所有怪物: false,
			        死亡次数限制: 0,
			    },
			    全局天气: [],
			    禁用传送菜单: false,
			    诡魅天气怪物层级: 1,
			    奖励物品层级: 1,
			};
			        
			        教程阶段 = 存档数据.教程?.阶段 ?? 0;
			        玩家职业 = 存档数据.玩家职业 || null;
			        最高教程阶段 = 存档数据.教程?.最高阶段 ?? 0;
			        是否为教程层 = 存档数据.教程?.是否教程层 ?? false;
			        hud模式 = 存档数据.UI?.hud模式 ?? "默认";
			        显示模式 = 存档数据.UI?.显示模式 ?? "装备";
			        日志历史 = 存档数据.UI?.日志历史 || [];
			        最大装备槽数量 = 存档数据.玩家?.最大装备槽数量 ?? 8;
			        红蓝开关状态 = 存档数据?.红蓝开关状态 ?? '红';
			        绿紫开关状态 = 存档数据?.绿紫开关状态 ?? '绿';
			        当前装备页 = 存档数据.UI?.当前装备页 ?? 0;
			        上次死亡地点 = 存档数据.上次死亡地点 || null;
			        程序生成配方列表 =
			            存档数据.配方信息?.程序生成配方列表 || [];
			        已发现的程序生成配方 =
			            存档数据.配方信息?.已发现的程序生成配方 || [];
			
			        已发现的程序生成配方.forEach((discoveredRecipe) => {
			            if (
			                !融合配方列表.some(
			                    (r) => r.说明 === discoveredRecipe.说明
			                )
			            ) {
			                融合配方列表.push(discoveredRecipe);
			            }
			        });
			
			        日志历史.forEach((log) => 添加日志(log.内容, log.类型));
			        
			        const 全局物品实例映射 = new Map();
			        const 全局物品标识映射 = new Map();
			        
			        当前天气效果 = null;
			
			        if (是否是创意关卡) {
			            玩家属性 = { ...初始玩家属性, ...自定义全局设置.玩家属性 };
			            初始玩家属性 = {...玩家属性};
			            玩家属性.最大生命值加成 = 自定义全局设置.初始生命值 - 100;
			            初始玩家属性.最大生命值加成 = 自定义全局设置.初始生命值 - 100;
			            当前天气效果 = 自定义全局设置.全局天气
			            最大背包容量 = 自定义全局设置.初始背包容量;
			            玩家背包 = new Map();
			            玩家装备 = new Map();
			            玩家状态 = [];
			            当前激活卷轴列表 = new Set();
			        } else {
			            玩家属性 = { ...初始玩家属性, ...(存档数据.玩家?.属性 || {}) };
			            最大背包容量 = 存档数据.玩家?.最大背包容量 ?? 12;
			            已击杀怪物数 = 存档数据.游戏统计?.已击杀怪物数 ?? 0;
			            玩家总移动回合数 = 存档数据.游戏统计?.玩家总移动回合数 ?? 0;
			            玩家总受到伤害 = 存档数据.游戏统计?.玩家总受到伤害 ?? 0;
			            击杀提示.更新({ 内容: `已击杀怪物: ${已击杀怪物数}` });
			
			            玩家背包 = new Map();
			            if (存档数据.玩家?.背包) {
			                存档数据.玩家.背包.forEach((物品数据) => {
			                    const 实例 = 恢复物品(物品数据, 全局物品标识映射);
			                    if (实例) {
			                        玩家背包.set(实例.唯一标识, 实例);
			                        全局物品实例映射.set(物品数据.唯一标识符串, 实例);
			                    }
			                });
			            }
			
			            玩家装备 = new Map();
			            if (存档数据.玩家?.装备) {
			                存档数据.玩家.装备.forEach((装备数据) => {
			                    const 实例 = 全局物品实例映射.get(装备数据.唯一标识符串);
			                    if (实例) {
			                        实例.已装备 = true;
			                        实例.装备槽位 = 装备数据.槽位;
			                        玩家装备.set(实例.装备槽位, 实例);
			                    }
			                });
			            }
			            
			            玩家状态 = [];
			            if (存档数据.玩家?.状态) {
			                存档数据.玩家.状态.forEach((状态数据) => {
			                    let 来源实例 = null;
			                    if (状态数据.来源标识符串) {
			                        来源实例 = 全局物品实例映射.get(状态数据.来源标识符串);
			                    }
			                    new 状态效果(状态数据.类型, 状态数据.颜色, 状态数据.图标, 状态数据.持续时间, 状态数据.剩余回合, 来源实例, null, 状态数据.强度);
			                });
			            }
			
			            当前激活卷轴列表 = new Set();
			            if (存档数据.UI?.激活卷轴列表) {
			                存档数据.UI.激活卷轴列表.forEach((标识符串) => {
			                    const 实例 = 全局物品实例映射.get(标识符串);
			                    if (实例 instanceof 卷轴类) {
			                        当前激活卷轴列表.add(实例);
			                        实例.使用();
			                    }
			                });
			            }
			        }
			
			        当前出战宠物列表 = [];
if (存档数据.当前出战宠物列表) {
    存档数据.当前出战宠物列表.forEach(petData => {
        const petInstance = 恢复物品(petData, 全局物品标识映射);
        if (petInstance) {
            当前出战宠物列表.push(petInstance);
            if (!全局物品实例映射.has(petData.唯一标识符串)) {
                 全局物品实例映射.set(petData.唯一标识符串, petInstance);
            }
        }
    });
}
			
			        所有地牢层 = new Map();
			        if (存档数据.所有地牢层数据) {
			            for (const [层号Str, 楼层存档] of Object.entries(存档数据.所有地牢层数据)) {
			                const 层号 = parseInt(层号Str);
			                if (!isNaN(层号) && 楼层存档) {
			                    const 恢复后楼层 = 恢复楼层(层号, 楼层存档, 全局物品实例映射, 全局物品标识映射);
			                    if (恢复后楼层) {
			                        所有地牢层.set(层号, 恢复后楼层);
			                    }
			                }
			            }
			        }
			        生存挑战激活 = 存档数据.生存挑战激活 || false;
			        生存挑战备份单元格 = [];
			        if (存档数据.序列化生存挑战备份单元格 && 生存挑战激活) {
			            const 当前楼层数据 = 所有地牢层.get(当前层数);
			            if (当前楼层数据) {
			                存档数据.序列化生存挑战备份单元格.forEach(序列化备份 => {
			                    const 恢复的备份 = {
			                        x: 序列化备份.x,
			                        y: 序列化备份.y,
			                        类型: 序列化备份.类型,
			                        背景类型: 序列化备份.背景类型,
			                        墙壁: { ...序列化备份.墙壁 },
			                        颜色索引: 序列化备份.颜色索引,
			                        标识: 序列化备份.标识 ? Symbol(序列化备份.标识.slice(7, -1)) : null,
			                        关联物品: null,
			                        关联怪物: null,
			                    };
			
			                    if (序列化备份.关联物品标识) {
			                        恢复的备份.关联物品 = 全局物品实例映射.get(序列化备份.关联物品标识) || null;
			                    }
			                    if (序列化备份.关联怪物索引 !== null) {
			                        恢复的备份.关联怪物 = 当前楼层数据.所有怪物[序列化备份.关联怪物索引] || null;
			                    }
			                    生存挑战备份单元格.push(恢复的备份);
			                });
			            }
			        }
			
			        传送点列表 = 存档数据.传送点列表 || [];
			        if (所有地牢层.has(当前层数)) {
			            const 当前楼层数据 = 所有地牢层.get(当前层数);
			            地牢 = 当前楼层数据.地牢数组;
			            地牢大小 = 地牢.length;
			            房间列表 = 当前楼层数据.房间列表;
			            上锁房间列表 = 当前楼层数据.上锁房间列表;
			            已访问房间 = 当前楼层数据.已访问房间;
			            房间地图 = 当前楼层数据.房间地图;
			            门实例列表 = 当前楼层数据.门实例列表;
			            所有怪物 = 当前楼层数据.所有怪物;
			            所有计时器 = 当前楼层数据.所有计时器;
			            玩家初始位置 = 当前楼层数据.玩家初始位置;
			            当前天气效果 = 当前楼层数据.当前天气效果;
			            地牢生成方式 = 当前楼层数据.地牢生成方式;
			            已揭示洞穴格子 = 当前楼层数据.已揭示洞穴格子;
			            
			            if (是否是创意关卡) {
			                玩家.x = 玩家初始位置.x;
			                玩家.y = 玩家初始位置.y;
			            } else {
			                玩家.x = 存档数据.玩家?.x ?? 当前楼层数据.玩家位置?.x ?? 玩家初始位置.x;
			                玩家.y = 存档数据.玩家?.y ?? 当前楼层数据.玩家位置?.y ?? 玩家初始位置.y;
			            }
			
			            怪物状态表 = new WeakMap();
			            所有怪物.forEach((怪物) => {
			                const 怪物存档数据 = 存档数据.所有地牢层数据[当前层数]?.序列化怪物列表?.find((m) => 怪物.x === m.配置.x && 怪物.y === m.配置.y);
			                if (怪物存档数据?.状态效果) {
			                    new 状态效果(怪物存档数据.状态效果.类型, 怪物存档数据.状态效果.颜色, 怪物存档数据.状态效果.图标, 怪物存档数据.状态效果.持续时间, 怪物存档数据.状态效果.剩余回合, null, 怪物, 怪物存档数据.状态效果.强度);
			                }
			            });
			        } else {
			            console.warn(`存档中未找到当前层 ${当前层数} 的数据，将重新生成！`);
			            房间列表 = [];
			            上锁房间列表 = [];
			            所有怪物 = [];
			            所有计时器 = [];
			            已访问房间 = new Set();
			            门实例列表 = new Map();
			            房间地图 = Array(地牢大小).fill().map(() => Array(地牢大小).fill(-1));
			            生成地牢();
			            更新洞穴视野();
			            生成并放置随机配方卷轴(当前层数);
			            玩家.x = 玩家初始位置.x;
			            玩家.y = 玩家初始位置.y;
			            if (房间列表.length > 0) 已访问房间.add(房间列表[房间列表.findIndex(item=>item?.id==0)].id);
			        }
			
			        if (存档数据.永久Buffs) {
			            永久Buffs = { ...存档数据.永久Buffs };
			            永久Buffs.已获得效果 = new Set(存档数据.永久Buffs.已获得效果 || []);
			        } else {
			            永久Buffs = { 已获得效果: new Set() };
			        }
			        应用永久Buffs();
			
			        const healthBar = document.querySelector(".health-bar");
			        const powerBar = document.querySelector(".power-bar");
			
			        if (是否是创意关卡) {
			            if (healthBar) healthBar.style.width = "100%";
			            if (powerBar) powerBar.style.width = `100%`;
			        } else {
			            const 保存的生命百分比 = 存档数据.玩家?.当前生命值百分比 ?? 100;
			            const 保存的能量百分比 = 存档数据.玩家?.当前能量值百分比 ?? 100;
			            if (healthBar) {
			                healthBar.style.width = `${Math.max(0, Math.min(100, 保存的生命百分比))}%`;
			                if (保存的生命百分比 <= 20) healthBar.classList.add("低数值警告");
			                else healthBar.classList.remove("低数值警告");
			            }
			            if (powerBar) {
			                powerBar.style.width = `${Math.max(0, Math.min(100, 保存的能量百分比))}%`;
			                if (保存的能量百分比 <= 20) powerBar.classList.add("低数值警告");
			                else powerBar.classList.remove("低数值警告");
			            }
			        }
			        所有传送门 = [];
			        if (存档数据.所有传送门) {
			            存档数据.所有传送门.forEach(传送门数据 => {
			                const 实例 = 全局物品实例映射.get(传送门数据.唯一标识符串);
			                if (实例) {
			                    所有传送门.push(实例);
			                    
			                }
			            });
			        }
			        地牢大小 = 地牢.length;
			        应用职业效果(玩家职业);

					if (存档数据.编辑器状态数据 && Object.keys(存档数据.编辑器状态数据).length > 0) {
						玩家.x = 存档数据.编辑器状态数据.玩家位置.x;
						玩家.y = 存档数据.编辑器状态数据.玩家位置.y;
						当前相机X = 存档数据.编辑器状态数据.相机位置.x;
						当前相机Y = 存档数据.编辑器状态数据.相机位置.y;
						相机目标X = 当前相机X;
						相机目标Y = 当前相机Y;
						编辑器状态.模式 = 存档数据.编辑器状态数据.模式;
						编辑器工具栏模式 = 存档数据.编辑器状态数据.工具栏模式;
						
						if(存档数据.编辑器状态数据.笔刷设置){
							编辑器状态.笔刷模式 = 存档数据.编辑器状态数据.笔刷设置.模式;
							编辑器状态.笔刷形状 = 存档数据.编辑器状态数据.笔刷设置.形状;
							编辑器状态.笔刷半径 = 存档数据.编辑器状态数据.笔刷设置.半径;
						}
						
						if (存档数据.编辑器状态数据.当前选中) {
							const 选中数据 = 存档数据.编辑器状态数据.当前选中;
							if (选中数据.isVirtual) {
								编辑器状态.当前选中 = 选中数据;
							} else {
								const { items, monsters } = 获取所有可用的定义();
								const 集合 = 选中数据.图鉴类型 === '物品' ? items : monsters;
								const 定义 = 集合.find(def => def.类.name === 选中数据.类名);
								if (定义) 编辑器状态.当前选中 = new 定义.类({});
							}
							}

						编辑器最近使用列表 = (存档数据.编辑器状态数据.最近使用列表 || []).map(itemData => {
							if (itemData.isVirtual) {
								return itemData;
							} else {
								const { items, monsters } = 获取所有可用的定义();
								const collection = itemData.图鉴类型 === '物品' ? items : monsters;
								const definition = collection.find(def => def.类.name === itemData.类名);
								return definition ? new definition.类({}) : null;
							}
						}).filter(Boolean);
					}
			
			        console.log("游戏状态恢复完成！");
			    } catch (错误) {
			        console.error("恢复游戏状态时发生严重错误:", 错误);
			        显示通知("加载存档时发生严重错误，将开始新游戏。", "错误");
			        显示主菜单();
			    }
			}
			
			function 恢复单元格(
			    单元格数据,
			    x,
			    y,
			    全局物品实例映射,
			    怪物实例映射,
			    门实例映射
			) {
			    const 单元格实例 = new 单元格(x, y);
			    if (!单元格数据) return 单元格实例;
			    
			    单元格实例.是否强制墙壁 = 单元格数据.是否强制墙壁 || false;
			    单元格实例.类型 = 单元格数据.类型 ?? 单元格类型.墙壁;
			    单元格实例.背景类型 = 单元格数据.背景类型 ?? 单元格实例.类型;
			    单元格实例.墙壁 = {上: false, 右: false, 下: false, 左: false, ...单元格数据.墙壁};
			    单元格实例.钥匙ID = 单元格数据.钥匙ID ?? null;
			    单元格实例.颜色索引 = 单元格数据.颜色索引 ?? 颜色表.length;
			    单元格实例.阻碍视野 = 单元格数据.阻碍视野 ?? false;
			
			    单元格实例.关联物品 = null;
			    单元格实例.关联怪物 = null;
			
			    if (
			        单元格实例.类型 === 单元格类型.楼梯下楼 ||
			        单元格实例.类型 === 单元格类型.楼梯上楼
			    ) {
			        const 图标 =
			            单元格数据.关联物品图标 ||
			            (单元格实例.类型 === 单元格类型.楼梯下楼
			                ? 楼梯图标.下楼
			                : 楼梯图标.上楼);
			        单元格实例.关联物品 = {
			            类型: "楼梯",
			            图标: 图标,
			            显示图标: 图标,
			            颜色索引: 颜色表.length,
			            唯一标识: Symbol(`楼梯_${单元格实例.类型}`),
			            获取名称: () =>
			                单元格实例.类型 === 单元格类型.楼梯下楼
			                    ? "下楼楼梯"
			                    : "上楼楼梯",
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
			            使用: () => {
			                const 目标层数 =
			                    单元格实例.类型 === 单元格类型.楼梯下楼
			                        ? 当前层数 + 1
			                        : 当前层数 - 1;
			                切换楼层(目标层数, false, null, true);
			            },
			        };
			    }
			    else if (单元格数据.关联物品标识) {
			        const 物品实例 = 全局物品实例映射.get(
			            单元格数据.关联物品标识
			        );
			        if (物品实例) {
			            单元格实例.关联物品 = 物品实例;
			            物品实例.x = x;
			            物品实例.y = y;
			        } else {
			            console.warn(
			                `单元格 (${x},${y}) 关联物品标识 ${单元格数据.关联物品标识} 未找到对应实例`
			            );
			        }
			    }
			
			    if (
			        单元格数据.关联怪物索引 !== null &&
			        单元格数据.关联怪物索引 !== undefined
			    ) {
			        单元格实例.关联怪物 = 单元格数据.关联怪物索引;
			    }
			
			    if (单元格数据.标识符串) {
			        const 门实例 = 门实例映射.get(单元格数据.标识符串);
			        if (门实例) {
			            单元格实例.标识 = 门实例.唯一标识;
			        } else {
			            单元格实例.临时门标识符串 = 单元格数据.标识符串;
			        }
			    }
			    单元格实例.配对单元格位置 = 单元格数据.配对单元格位置 || null;
			    
			    单元格实例.isOneWay = 单元格数据.isOneWay || false;
			    单元格实例.oneWayAllowedDirection = 单元格数据.oneWayAllowedDirection || null;
			    单元格实例.doorOrientation = 单元格数据.doorOrientation || null;
			
			    return 单元格实例;
			}
			/**
			 * 序列化单个物品实例
			 * @param {物品} 物品实例
			 * @returns {object | null} 可序列化的物品数据，如果物品无效则返回 null
			 */
			function 序列化物品(物品实例) {
			    if (!物品实例 || !物品实例.constructor) {
			        console.warn("尝试序列化无效物品", 物品实例);
			        return null;
			    }
			    try {
			        const 类名 = 物品实例.constructor.name;
			        const 配置 = {
			类型: 物品实例.类型,
			名称: 物品实例.名称,
			图标: 物品实例.图标,
			品质: 物品实例.品质,
			数量: 物品实例.堆叠数量,
			最大堆叠数量: 物品实例.最大堆叠数量,
			颜色索引: 物品实例.颜色索引,
			强化: 物品实例.强化,
			能否拾起: 物品实例.能否拾起,
			是否正常物品: 物品实例.是否正常物品,
			是否隐藏: 物品实例.是否隐藏,
			是否为隐藏物品: 物品实例.是否为隐藏物品,
			效果描述: 物品实例.效果描述,
			已装备: 物品实例.已装备,
			装备槽位: 物品实例.装备槽位,
			x: 物品实例.x,
			y: 物品实例.y,
			是否被丢弃: 物品实例.是否被丢弃 || false,
			阻碍怪物: 物品实例.阻碍怪物,
			材质: 物品实例.材质,
			玩家放置: 物品实例.玩家放置,
			数据: 物品实例.自定义数据
			    ? Object.fromEntries(物品实例.自定义数据)
			    : null,
			        };
			        if (物品实例 instanceof 刷怪笼) {
			const spawnedList = 配置.数据.当前生成物列表 || [];
			配置.数据.当前生成物标识列表 = spawnedList.map(instance => {
			    if (instance instanceof 怪物) {
			        const index = 所有怪物.findIndex(m => m === instance);
			        return index !== -1 ? `怪物_${index}` : null;
			    } else if (instance instanceof 物品) {
			        return instance.唯一标识.toString();
			    }
			    return null;
			}).filter(id => id !== null);
			delete 配置.数据.当前生成物列表;
			        }
			
			        if (物品实例 instanceof 武器类) {
			配置.数据.冷却剩余 = 物品实例.自定义数据.get("冷却剩余") ?? 0;
			        }
			        if (物品实例 instanceof 宠物) {
			配置.是否已放置 = 物品实例.是否已放置 ?? false;
			配置.层数=物品实例.层数
			        }
			
			        if (物品实例 instanceof 附魔卷轴) {
			配置.数据.可用次数 = 物品实例.可用次数;
			const 效果索引 = 物品实例.附魔池.findIndex(
			    (func) => func === 物品实例.附魔效果
			);
			if (效果索引 !== -1) {
			    配置.数据.附魔效果名 = 物品实例.效果名[效果索引];
			} else {
			    console.warn("无法找到附魔卷轴的效果名:", 物品实例);
			}
			        }
			
			        if (
			物品实例 instanceof 神秘商人 ||
			物品实例 instanceof 物品祭坛
			        ) {
			配置.数据.库存序列化 = (
			    物品实例.自定义数据.get("库存") || []
			)
			    .map(序列化物品)
			    .filter((item) => item !== null);
			delete 配置.数据.库存;
			        }
			
			        if (物品实例 instanceof 宠物) {
			const 宠物装备 = 物品实例.自定义数据.get("装备") || {};
			配置.数据.装备标识 = {};
			for (const 槽位 in 宠物装备) {
			    if (宠物装备[槽位] && 宠物装备[槽位].唯一标识) {
			        配置.数据.装备标识[槽位] =
			            宠物装备[槽位].唯一标识.toString();
			    } else {
			        配置.数据.装备标识[槽位] = null;
			    }
			}
			配置.数据.技能 = JSON.parse(
			    JSON.stringify(
			        物品实例.自定义数据.get("技能") || []
			    )
			);
			delete 配置.数据.装备;
			        }
			
			        if (物品实例 instanceof 折跃门) {
			const 目标房间 = 物品实例.自定义数据.get("目标房间");
			配置.数据.目标房间ID = 目标房间 ? 目标房间.id : null;
			        }
			
			        return {
			类名: 类名,
			唯一标识符串: 物品实例.唯一标识.toString(),
			配置: 配置,
			        };
			    } catch (e) {
			        console.error(
			`序列化物品 ${物品实例?.名称} (${物品实例?.constructor?.name}) 失败:`,
			e
			        );
			        return null;
			    }
			}
			
			/**
			 * 序列化单个怪物实例 - 扩展版
			 * @param {怪物} 怪物实例
			 * @param {number} 怪物索引
			 * @param {Array<怪物>} 当前楼层所有怪物列表 - 用于查找引用索引
			 * @returns {object | null} 可序列化的怪物数据
			 */
			function 序列化怪物(怪物实例, 怪物索引, 当前楼层所有怪物列表) {
			    if (!怪物实例 || !怪物实例.constructor) {
			        console.warn("尝试序列化无效怪物", 怪物实例);
			        return null;
			    }
			    const 类名 = 怪物实例.constructor.name;
			    try {
			        let 仇恨目标标识 = null;
			        if (怪物实例.仇恨 === 玩家) {
			仇恨目标标识 = "玩家";
			        } else if (怪物实例.仇恨 instanceof 怪物) {
			const 仇恨索引 = 当前楼层所有怪物列表.findIndex(
			    (m) => m === 怪物实例.仇恨
			);
			if (仇恨索引 !== -1) {
			    仇恨目标标识 = `怪物_${仇恨索引}`;
			} else {
			    console.warn(
			        `怪物 ${怪物索引} 的仇恨目标未在当前楼层找到:`,
			        怪物实例.仇恨
			    );
			}
			        }
			
			        const 状态效果数据 = 怪物状态表.get(怪物实例);
			        let 序列化状态 = null;
			        if (状态效果数据) {
			序列化状态 = {
			    类型: 状态效果数据.类型,
			    颜色: 状态效果数据.颜色,
			    图标: 状态效果数据.图标,
			    持续时间: 状态效果数据.持续时间,
			    剩余回合: 状态效果数据.剩余回合,
			    强度: 状态效果数据.强度,
			};
			        }
			
			        const 配置 = {
			x: 怪物实例.x,
			y: 怪物实例.y,
			图标: 怪物实例.图标,
			房间ID: 怪物实例.房间ID,
			当前生命值: 怪物实例.当前生命值,
			状态: 怪物实例.状态,
			强化: 怪物实例.强化,
			攻击冷却剩余: 怪物实例.攻击冷却回合剩余,
			受伤冻结回合剩余: 怪物实例.受伤冻结回合剩余,
			仇恨目标标识: 仇恨目标标识,
			基础攻击力: 怪物实例.基础攻击力,
			基础生命值: 怪物实例.基础生命值,
			移动率: 怪物实例.移动率,
			基础移动距离: 怪物实例.基础移动距离,
			基础攻击范围: 怪物实例.基础攻击范围,
			跟踪距离: 怪物实例.跟踪距离,
			攻击冷却: 怪物实例.攻击冷却,
			受伤冻结回合: 怪物实例.受伤冻结回合,
			掉落概率: 怪物实例.掉落概率,
			当前格: 怪物实例.当前格,
			始终追踪玩家: 怪物实例.始终追踪玩家,
			携带药水: 怪物实例.携带药水 ? { ...怪物实例.携带药水 } : null,
			永久增益: [...怪物实例.永久增益],
			残血逃跑: 怪物实例.残血逃跑,
			        };
			
			        if (怪物实例 instanceof 王座守护者) {
			配置.当前阶段 = 怪物实例.当前阶段;
			配置.技能冷却剩余 = { ...怪物实例.技能冷却剩余 };
			配置.无敌 = 怪物实例.无敌;
			配置.无敌次数 = 怪物实例.无敌次数;
			配置.皇家守卫索引列表 = 怪物实例.皇家守卫列表
			    .map(guard => 当前楼层所有怪物列表.findIndex(m => m === guard))
			    .filter(index => index !== -1);
			配置.激活的墓碑索引列表 = 怪物实例.激活的墓碑列表
			    .map(tombstone => 当前楼层所有怪物列表.findIndex(m => m === tombstone))
			    .filter(index => index !== -1);
			        }
			        if (怪物实例 instanceof 蜈蚣怪物 || 怪物实例 instanceof 蜈蚣部位) {
    怪物实例.存档ID = 怪物实例.存档ID || `centipede_${prng()}`;
    配置.存档ID = 怪物实例.存档ID;
}
if (怪物实例 instanceof 蜈蚣怪物) {
    配置.身体部位ID列表 = 怪物实例.身体部位.map(p => {
        p.存档ID = p.存档ID || `centipede_${prng()}`;
        return p.存档ID;
    });
    配置.长度 = 怪物实例.长度;
    配置.朝向 = 怪物实例.朝向;
}
if (怪物实例 instanceof 蜈蚣部位) {
    配置.主体ID = 怪物实例.主体?.存档ID;
    配置.跟随ID = 怪物实例.跟随?.存档ID;
    配置.基础颜色 = 怪物实例.基础颜色;
}
if (怪物实例 instanceof 骷髅仆从) {
    配置.生命周期 = 怪物实例.生命周期;
}
			        if (怪物实例 instanceof 腐蚀怪物) {
			配置.腐蚀强度 = 怪物实例.腐蚀强度;
			配置.腐蚀持续 = 怪物实例.腐蚀持续;
			        }
			        if (怪物实例 instanceof 盗贼怪物) {
			配置.偷窃几率 = 怪物实例.偷窃几率;
			配置.偷窃武器几率 = 怪物实例.偷窃武器几率;
			配置.偷到的金币 = 怪物实例.偷到的金币;
			配置.偷到的武器列表序列化 = 怪物实例.偷到的武器列表
			    .map(序列化物品)
			    .filter((i) => i != null);
			        }
			        if (怪物实例 instanceof 吸能怪物) {
			配置.吸能比例 = 怪物实例.吸能比例;
			配置.最小吸能 = 怪物实例.最小吸能;
			        }
			        if (怪物实例 instanceof 剧毒云雾怪物) {
			配置.毒云范围 = 怪物实例.毒云范围;
			配置.毒云持续 = 怪物实例.毒云持续;
			配置.毒云强度 = 怪物实例.毒云强度;
			        }
			        if (怪物实例 instanceof 召唤师怪物) {
			配置.召唤冷却剩余 = 怪物实例.召唤冷却剩余;
			配置.最大召唤物数量 = 怪物实例.最大召唤物数量;
			配置.召唤物类名 = 怪物实例.召唤物类.name;
			配置.当前召唤物索引列表 = 怪物实例.当前召唤物列表
			    .map((仆从) =>
			        当前楼层所有怪物列表.findIndex(
			            (m) => m === 仆从
			        )
			    )
			    .filter((index) => index !== -1);
			        }
			        if (怪物实例 instanceof 幽灵仆从) {
			配置.生命周期 = 怪物实例.生命周期;
			const 召唤者索引 = 当前楼层所有怪物列表.findIndex(
			    (m) => m === 怪物实例.召唤者
			);
			配置.召唤者索引 = 召唤者索引 !== -1 ? 召唤者索引 : null;
			        }
			        if (怪物实例 instanceof 萨满怪物) {
			配置.治疗冷却剩余 = 怪物实例.治疗冷却剩余;
			        }
			        if (怪物实例 instanceof 大史莱姆怪物) {
			        }
			        if (怪物实例 instanceof 瞬移怪物) {
			配置.瞬移几率 = 怪物实例.瞬移几率;
			配置.受击瞬移几率 = 怪物实例.受击瞬移几率;
			        }
			        if (怪物实例 instanceof 伪装怪物) {
			配置.伪装状态 = 怪物实例.伪装状态;
			        }
			        if (怪物实例 instanceof 炸弹怪物) {
			配置.携带炸弹 = 怪物实例.携带炸弹;
			        }
			        if (怪物实例 instanceof 大魔法师) {
			配置.技能冷却 = 怪物实例.技能冷却;
			配置.隐身中 = 怪物实例.隐身中;
			配置.isClone = 怪物实例.isClone;
			const 分身索引 = 怪物实例.分身
			    ? 当前楼层所有怪物列表.findIndex(
			            (m) => m === 怪物实例.分身
			        )
			    : -1;
			配置.分身索引 = 分身索引 !== -1 ? 分身索引 : null;
			        }
			        if (怪物实例 instanceof 旋风怪物) {
			配置.召唤冷却剩余 = 怪物实例.召唤冷却剩余;
			配置.最大召唤物数量 = 怪物实例.最大召唤物数量;
			配置.当前召唤物索引列表 = 怪物实例.当前召唤物列表
			    .map((旋) =>
			        当前楼层所有怪物列表.findIndex((m) => m === 旋)
			    )
			    .filter((index) => index !== -1);
			        }
			        if (怪物实例 instanceof 旋风) {
			配置.生命周期 = 怪物实例.生命周期;
			        }
			        if (怪物实例 instanceof 超速怪物) {
			配置.加速范围 = 怪物实例.加速范围 ?? 10;
			配置.加速回合数 = 怪物实例.加速回合数 ?? 2;
			        }
			        if (怪物实例 instanceof 巡逻怪物) {
			            配置.随机游走 = 怪物实例.随机游走;
			            配置.巡逻方向 = 怪物实例.巡逻方向;
			            配置.随机游走方向 = 怪物实例.随机游走方向;
			        }
			
			        const 掉落物序列化 = 怪物实例.掉落物
			? 序列化物品(怪物实例.掉落物)
			: null;
			
			        return {
			类名: 类名,
			怪物索引: 怪物索引,
			配置: 配置,
			掉落物: 掉落物序列化,
			状态效果: 序列化状态,
			        };
			    } catch (e) {
			        console.error(
			`序列化怪物 ${怪物实例?.类型} (${类名}) 失败:`,
			e
			        );
			        return null;
			    }
			}
			
			function 序列化楼层(层号, 楼层原始数据, 全局物品标识映射) {
			    console.log(`开始序列化楼层 ${层号}`);
			    if (!楼层原始数据) {
			        console.warn(`楼层 ${层号} 数据不存在，跳过序列化`);
			        return null;
			    }
			    try {
			        const {
			地牢数组 = [],
			房间列表 = [],
			上锁房间列表 = [],
			已访问房间 = new Set(),
			房间地图 = [],
			门实例列表 = new Map(),
			所有怪物 = [],
			所有计时器 = [],
			玩家初始位置 = { x: 0, y: 0 },
			玩家位置 = 玩家位置,
			当前天气效果 = [],
			        } = 楼层原始数据;
			
			        const 地上物品列表 = [];
			        for (let y = 0; y < 地牢数组.length; y++) {
			for (let x = 0; x < 地牢数组[y]?.length; x++) {
			    const 物品 = 地牢数组[y][x]?.关联物品;
			    if (物品) {
			        地上物品列表.push(物品);
			        if (!全局物品标识映射.has(物品.唯一标识)) {
			            全局物品标识映射.set(
			                物品.唯一标识,
			                物品.唯一标识.toString()
			            );
			        }
			    }
			}
			        }
			        const 序列化地上物品 = 地上物品列表
			.map(序列化物品)
			.filter((i) => i != null);
			
			        const 怪物索引映射 = new Map();
			        const 序列化怪物列表 = 所有怪物
			.map((怪物, 索引) => {
			    怪物索引映射.set(怪物, 索引);
			    return 序列化怪物(怪物, 索引, 所有怪物);
			})
			.filter((m) => m != null);
			
			        const 序列化地牢格子 = 地牢数组.map((行) =>
			行
			    .map((单元格) =>
			        序列化单元格(
			            单元格,
			            全局物品标识映射,
			            怪物索引映射
			        )
			    )
			    .filter((g) => g != null)
			        );
			
			        const 序列化物品列表 = 所有计时器
			.map(序列化物品)
			.filter((b) => b != null);
			        序列化物品列表.forEach((炸弹数据) => {
			if (炸弹数据) {
			    const 符号 = Symbol(
			        炸弹数据.唯一标识符串.slice(7, -1)
			    );
			    if (!全局物品标识映射.has(符号)) {
			        全局物品标识映射.set(
			            符号,
			            炸弹数据.唯一标识符串
			        );
			    }
			}
			        });
			
			        const 序列化门实例 = Array.from(门实例列表.values()).map(
			(门) => ({
			    唯一标识符串: 门.唯一标识.toString(),
			    类型: 门.类型,
			    是否上锁: 门.是否上锁,
			    房间ID: 门.房间ID,
			    所在位置: { ...门.所在位置 },
			})
			        );
			        const 序列化挑战房间状态 = (楼层原始数据.房间列表 || [])
			.filter((r) => r.类型 === "挑战房间" && r.挑战状态)
			.map((r) => {
			    const 挑战状态 = r.挑战状态;
			    const 挑战状态拷贝 = {
			        进行中: 挑战状态.进行中,
			        已完成: 挑战状态.已完成,
			        当前波次: 挑战状态.当前波次,
			        总波次: 挑战状态.总波次,
			        波次最大回合数: 挑战状态.波次最大回合数,
			        波次当前回合数: 挑战状态.波次当前回合数,
			        挑战怪物层级: 挑战状态.挑战怪物层级,
			        候选怪物池: 挑战状态.候选怪物池,
			        波次内怪物: [],
			        原始门数据: [],
			    };
			
			    if (
			        挑战状态.波次内怪物 &&
			        Array.isArray(挑战状态.波次内怪物)
			    ) {
			        挑战状态拷贝.波次内怪物 =
			            挑战状态.波次内怪物
			                .map((怪实例) => {
			                    const 索引 = (
			                        楼层原始数据.所有怪物 || []
			                    ).findIndex((m) => m === 怪实例);
			                    return 索引 !== -1
			                        ? `怪物_${索引}`
			                        : null;
			                })
			                .filter((id) => id !== null);
			    }
			
			    if (
			        挑战状态.原始门数据 &&
			        Array.isArray(挑战状态.原始门数据)
			    ) {
			        挑战状态拷贝.原始门数据 =
			            挑战状态.原始门数据.map((门数据) => ({
			                ...门数据,
			                原标识: 门数据.原标识
			                    ? 门数据.原标识.toString()
			                    : null,
			            }));
			    }
			
			    return {
			        id: r.id,
			        状态: 挑战状态拷贝,
			    };
			});
			        console.log(`楼层 ${层号} 序列化完成`);
			        return {
			玩家位置: 玩家位置,
			地牢生成方式: 地牢生成方式,
    已揭示洞穴格子: Array.from(已揭示洞穴格子|| new Set()),
			玩家初始位置: (玩家初始位置 && 玩家初始位置.x !== undefined) ? { ...玩家初始位置 } : { x: 50, y: 50 },
			房间列表: 房间列表.map((r) => {
			    const { 挑战状态, ...restOfRoom } = r;
			    return {
			        ...restOfRoom,
			        门: r.门 ? [...r.门] : [],
			    };
			}),
			上锁房间列表: 上锁房间列表.map((r) => {
			    const { 挑战状态, ...restOfRoom } = r;
			    return {
			        ...restOfRoom,
			        门: r.门 ? [...r.门] : [],
			    };
			}),
			已访问房间数组: Array.from(已访问房间 || new Set()),
			房间地图: 房间地图.map((row) => [...row]),
			挑战状态列表: 序列化挑战房间状态,
			序列化地上物品: 序列化地上物品,
			序列化怪物列表: 序列化怪物列表,
			序列化物品列表: 序列化物品列表,
			序列化地牢格子: 序列化地牢格子,
			序列化门实例: 序列化门实例,
			序列化玩家仆从索引: 玩家仆从列表
    .map(仆从 => 所有怪物.findIndex(m => m === 仆从))
    .filter(index => index !== -1 && 所有怪物[index].层数 === 层号),
			当前天气效果: [...当前天气效果],
			        };
			    } catch (e) {
			        console.error(`序列化楼层 ${层号} 失败:`, e);
			        return null;
			    }
			}
			
			/**
			 * 恢复单个物品实例
			 * @param {object} 物品数据
			 * @param {Map<string, Symbol>} 全局物品标识映射 - string -> symbol
			 * @returns {物品 | null}
			 */
			function 恢复物品(物品数据, 全局物品标识映射) {
			    if (!物品数据 || !物品数据.类名) return null;
			    const 类构造器 = window[物品数据.类名];
			    if (!类构造器 || typeof 类构造器 !== "function") {
			        console.warn(`未找到物品类构造器: ${物品数据.类名}`);
			        return null;
			    }
			    try {
			        const 配置 = { ...物品数据.配置 };
			        const 标识符串 = 物品数据.唯一标识符串;
			        let 唯一标识 = 全局物品标识映射.get(标识符串);
			
			        if (!唯一标识) {
			if (物品数据.类名 === "钥匙") {
			    配置.对应门ID = 配置.数据?.对应门ID;
			    配置.地牢层数 = 配置.数据?.地牢层数;
			    if (
			        配置.对应门ID !== undefined &&
			        配置.地牢层数 !== undefined
			    ) {
			        唯一标识 = Symbol.for(
			            `${配置.地牢层数}层${配置.对应门ID}`
			        );
			    } else {
			        console.warn(
			            "钥匙缺少门ID或层数信息，无法恢复Symbol.for:",
			            配置
			        );
			        唯一标识 = Symbol(标识符串);
			    }
			} else if (标识符串 && 标识符串.startsWith("Symbol(")) {
			    const description = 标识符串.slice(7, -1);
			    唯一标识 = Symbol(description);
			} else {
			    console.warn(
			        "物品缺少有效唯一标识符串，生成新Symbol:",
			        物品数据
			    );
			    唯一标识 = Symbol(
			        `恢复_${物品数据.类名}_${Date.now()}`
			    );
			}
			全局物品标识映射.set(标识符串, 唯一标识);
			        }
			
			        if (配置.数据) {
			配置.数据 = new Map(Object.entries(配置.数据));
			        } else {
			配置.数据 = new Map();
			        }
			
			        const 实例 = new 类构造器({ ...配置, 唯一标识: 唯一标识 });
			        
			        实例.自定义数据 = 配置.数据;
			        实例.是否隐藏 = 配置.是否隐藏;
			        实例.堆叠数量 = 配置.数量;
			        实例.图标 = 配置.图标;
			        实例.材质=配置.材质
			
			        if (实例 instanceof 武器类) {
			实例.自定义数据.set(
			    "冷却剩余",
			    配置.数据.get("冷却剩余") ?? 0
			);
			        }
			if (实例.名称 && 图标映射[实例.名称]) {
			            实例.图标 = 图标映射[实例.名称];
			        }
			        if (实例 instanceof 药水类) {
			                实例.图标 = 图标映射.药水;
			            } else if (实例 instanceof 祭坛类) {
			                实例.图标 = 图标映射.祭坛;
			            }
			        if (实例 instanceof 附魔卷轴) {
			实例.可用次数 = 配置.数据.get("可用次数") ?? 1;
			const 效果名 = 配置.数据.get("附魔效果名");
			const 效果索引 = 实例.效果名.indexOf(效果名);
			if (效果索引 !== -1) {
			    实例.附魔效果 = 实例.附魔池[效果索引];
			} else {
			    console.warn(`无法恢复附魔卷轴效果: ${效果名}`);
			}
			        }
			        
			        if (实例 instanceof 刷怪笼) {
			实例.临时生成物标识列表 = 配置.数据.get('当前生成物标识列表') || [];
			        }
			        if (实例 instanceof 隐形毒气陷阱){
			            实例.自定义数据.set('激活后图标',图标映射.毒气);
			        }			
			        实例.x = 配置.x ?? null;
			        实例.y = 配置.y ?? null;
			        实例.是否被丢弃 = 配置.是否被丢弃 ?? false;
			
			        实例.已装备 = false;
			        实例.装备槽位 = null;
			
			        return 实例;
			    } catch (e) {
			        console.error(`恢复物品 ${物品数据.类名} 失败:`, e);
			        return null;
			    }
			}
			
			/**
			 * 恢复单个怪物实例
			 * @param {object} 怪物数据
			 * @param {Map<string, 物品>} 全局物品实例映射
			 * @param {Map<number, 怪物>} 当前楼层怪物映射 (用于存储恢复的实例)
			 * @returns {怪物 | null}
			 */
			
			function 恢复怪物(怪物数据, 全局物品实例映射, 当前楼层怪物映射) {
			    if (!怪物数据 || !怪物数据.类名) return null;
			    const 类构造器 = window[怪物数据.类名];
			    if (!类构造器 || typeof 类构造器 !== "function") {
			        console.warn(`未找到怪物类构造器: ${怪物数据.类名}`);
			        return null;
			    }
			    try {
			        const 配置 = { ...怪物数据.配置 };
			
			        let 掉落物实例 = null;
			        if (怪物数据.掉落物) {
			const 临时物品标识映射 = new Map();
			掉落物实例 = 恢复物品(
			    怪物数据.掉落物,
			    临时物品标识映射
			);
			if (掉落物实例) {
			    const 全局实例 = 全局物品实例映射.get(
			        怪物数据.掉落物.唯一标识符串
			    );
			    if (全局实例) 掉落物实例 = 全局实例;
			    else
			        全局物品实例映射.set(
			            怪物数据.掉落物.唯一标识符串,
			            掉落物实例.唯一标识
			        );
			}
			        }
			        
			        delete 配置.掉落物;
			
			        const 实例 = new 类构造器(配置);
			        
			
			        实例.掉落物 = 掉落物实例;
			
			        实例.图标 = 配置.图标 ?? 实例.图标;
			        实例.基础生命值 = 配置.基础生命值 ?? 实例.生命值;
			        实例.基础攻击力 = 配置.基础攻击力 ?? 实例.生命值;
			        实例.当前生命值 = 配置.当前生命值 ?? 实例.生命值;
			        实例.状态 = 配置.状态 ?? 怪物状态.休眠;
			        实例.攻击冷却回合剩余 = 配置.攻击冷却回合剩余 ?? 0;
			        实例.受伤冻结回合剩余 = 配置.受伤冻结回合剩余 ?? 0;
			        实例.移动率 = 配置.移动率 ?? 实例.移动率;
			        实例.基础移动距离 = 配置.基础移动距离 ?? 实例.基础移动距离;
			        实例.基础攻击范围 = 配置.基础攻击范围 ?? 实例.基础攻击范围;
			        实例.跟踪距离 = 配置.跟踪距离 ?? 实例.跟踪距离;
			        实例.攻击冷却 = 配置.攻击冷却 ?? 实例.攻击冷却;
			        实例.受伤冻结回合 = 配置.受伤冻结回合 ?? 实例.受伤冻结回合;
			        实例.掉落概率 = 配置.掉落概率 ?? 实例.掉落概率;
			        实例.始终追踪玩家 = 配置.始终追踪玩家 ?? 实例.始终追踪玩家;
			        if (实例.类型 && 图标映射[实例.类型]) {
			            实例.图标 = 图标映射[实例.类型];
			        }
			        if (实例 instanceof 王座守护者) {
			实例.当前阶段 = 配置.当前阶段 || 1;
			实例.技能冷却剩余 = 配置.技能冷却剩余 || { ...实例.技能冷却 };
			实例.无敌 = 配置.无敌 || false;
			实例.无敌次数 = 配置.无敌次数 || 0;
			实例.临时守卫索引列表 = 配置.皇家守卫索引列表 || [];
			实例.临时墓碑索引列表 = 配置.激活的墓碑索引列表 || [];
			        }
			        if (配置.存档ID) {
    实例.存档ID = 配置.存档ID;
}
if (实例 instanceof 蜈蚣怪物) {
    实例.临时身体部位ID列表 = 配置.身体部位ID列表 || [];
    实例.朝向 = 配置.朝向 || 'W'
}
if (实例 instanceof 蜈蚣部位) {
    实例.临时主体ID = 配置.主体ID;
    实例.临时跟随ID = 配置.跟随ID;
    实例.基础颜色 = 配置.基础颜色;
}
if (实例 instanceof 骷髅仆从) {
    实例.生命周期 = 配置.生命周期 ?? 30;
    实例.主人 = 玩家;
}
			        if (实例 instanceof 腐蚀怪物) {
			实例.腐蚀强度 = 配置.腐蚀强度 ?? 1;
			实例.腐蚀持续 = 配置.腐蚀持续 ?? 4;
			        }
			        if (实例 instanceof 盗贼怪物) {
			实例.偷窃几率 = 配置.偷窃几率 ?? 0.5;
			实例.偷窃武器几率 = 配置.偷窃武器几率 ?? 0.15;
			实例.偷到的金币 = 配置.偷到的金币 ?? 0;
			实例.偷到的武器列表 = (配置.偷到的武器列表序列化 || [])
			    .map((wData) => 恢复物品(wData, 全局物品实例映射))
			    .filter((w) => w != null);
			        }
			        if (实例 instanceof 吸能怪物) {
			实例.吸能比例 = 配置.吸能比例 ?? 0.3;
			实例.最小吸能 = 配置.最小吸能 ?? 5;
			        }
			        if (实例 instanceof 剧毒云雾怪物) {
			实例.毒云范围 = 配置.毒云范围 ?? 1;
			实例.毒云持续 = 配置.毒云持续 ?? 3;
			实例.毒云强度 = 配置.毒云强度 ?? 2;
			        }
			        if (实例 instanceof 召唤师怪物) {
			实例.召唤冷却剩余 = 配置.召唤冷却剩余 ?? 0;
			实例.最大召唤物数量 = 配置.最大召唤物数量 ?? 2;
			实例.召唤物类 = window[配置.召唤物类名] || 幽灵仆从;
			实例.临时召唤物索引列表 = 配置.当前召唤物索引列表 || [];
			        }
			        if (实例 instanceof 幽灵仆从) {
			实例.生命周期 = 配置.生命周期 ?? 8;
			实例.临时召唤者索引 = 配置.召唤者索引;
			        }
			        if (实例 instanceof 萨满怪物) {
			实例.治疗冷却剩余 = 配置.治疗冷却剩余 ?? 0;
			        }
			        if (实例 instanceof 瞬移怪物) {
			实例.瞬移几率 = 配置.瞬移几率 ?? 0.6;
			实例.受击瞬移几率 = 配置.受击瞬移几率 ?? 0.4;
			        }
			        if (实例 instanceof 伪装怪物) {
			实例.伪装状态 = 配置.伪装状态 ?? false; 
			        }
			        if (实例 instanceof 炸弹怪物) {
			实例.携带炸弹 = 配置.携带炸弹 ?? true;
			        }
			        if (实例 instanceof 大魔法师) {
			实例.技能冷却 = 配置.技能冷却 ?? {
			    隐身术: 0,
			    分身术: 0,
			    火球术: 0,
			    冰冻术: 0,
			    传送术: 0,
			    召唤术: 0,
			};
			实例.隐身中 = 配置.隐身中 ?? false;
			实例.isClone = 配置.isClone ?? false;
			实例.临时分身索引 = 配置.分身索引;
			        }
			        if (实例 instanceof 旋风怪物) {
			实例.召唤冷却剩余 = 配置.召唤冷却剩余 ?? 0;
			实例.最大召唤物数量 = 配置.最大召唤物数量 ?? 1;
			实例.临时召唤物索引列表 = 配置.当前召唤物索引列表 || [];
			        }
			        if (实例 instanceof 旋风) {
			实例.生命周期 = 配置.生命周期 ?? 10;
			        }
			        if (实例 instanceof 超速怪物) {
			实例.加速范围 = 配置.加速范围 ?? 10;
			实例.加速回合数 = 配置.加速回合数 ?? 2;
			        }
			        
			        if (实例 instanceof 巡逻怪物) {
			 实例.随机游走 = 配置.随机游走 ?? false;
			 实例.随机游走方向 = 配置.随机游走方向 || '';
			 实例.巡逻方向 = 配置.巡逻方向 || 'E';
			        }
			        
			        if (怪物数据.怪物索引 !== undefined) {
			当前楼层怪物映射.set(怪物数据.怪物索引, 实例);
			        }
			
			        if (怪物数据.状态效果) {
			const 效果 = new 状态效果(
			    怪物数据.状态效果.类型,
			    怪物数据.状态效果.颜色,
			    怪物数据.状态效果.图标,
			    怪物数据.状态效果.持续时间,
			    怪物数据.状态效果.剩余回合,
			    null,
			    实例,
			    怪物数据.状态效果.强度
			);
			        }
			        实例.临时状态效果 = 怪物数据.状态效果;
			
			        实例.临时仇恨目标标识 = 配置.仇恨目标标识;
			
			        return 实例;
			    } catch (e) {
			        console.error(`恢复怪物 ${怪物数据.类名} 失败:`, e);
			        return null;
			    }
			}
			
			function 恢复楼层(
			    层号,
			    楼层存档数据,
			    全局物品实例映射,
			    全局物品标识映射
			) {
			    console.log(`开始恢复楼层 ${层号}`);
			    if (!楼层存档数据) {
			        console.warn(`楼层 ${层号} 存档数据无效，跳过恢复`);
			        return null;
			    }
			    try {
			        const 楼层数据 = {
			玩家位置: 楼层存档数据.玩家位置,
			玩家初始位置: (楼层存档数据.玩家初始位置 && 楼层存档数据.玩家初始位置.x !== undefined && 楼层存档数据.玩家初始位置.y !== undefined) 
			        ? { ...楼层存档数据.玩家初始位置 } 
			        : { x: 50, y: 50 },
			房间列表: [...(楼层存档数据.房间列表 || [])],
			上锁房间列表: [...(楼层存档数据.上锁房间列表 || [])],
			已访问房间: new Set(楼层存档数据.已访问房间数组 || []),
			房间地图: [...(楼层存档数据.房间地图 || [])],
			地牢数组: [],
			所有怪物: [],
			所有计时器: [],
			门实例列表: new Map(),
			地牢生成方式: 楼层存档数据.地牢生成方式 || 'default',
			已揭示洞穴格子: 楼层存档数据.已揭示洞穴格子 || new Set(),
			当前天气效果: [...(楼层存档数据.当前天气效果 || [])],
			        };
			    if (楼层数据.地牢生成方式 === 'cave' && 楼层数据.已揭示洞穴格子) {
        楼层数据.已揭示洞穴格子 = new Set(楼层数据.已揭示洞穴格子);
    }
			        const 地上物品实例映射 = new Map();
			        if (楼层存档数据.序列化地上物品) {
			楼层存档数据.序列化地上物品.forEach((物品数据) => {
			    let 实例 = 全局物品实例映射.get(
			        物品数据.唯一标识符串
			    );
			    if (!实例) {
			        实例 = 恢复物品(物品数据, 全局物品标识映射);
			        if (实例) {
			            全局物品实例映射.set(
			                物品数据.唯一标识符串,
			                实例
			            );
			        }
			    }
			    if (实例) {
			        地上物品实例映射.set(
			            物品数据.唯一标识符串,
			            实例
			        );
			        实例.x = 物品数据.配置?.x ?? null;
			        实例.y = 物品数据.配置?.y ?? null;
			    }
			});
			        }
			
			        const 门实例映射 = new Map();
			        if (楼层存档数据.序列化门实例) {
			楼层存档数据.序列化门实例.forEach((门数据) => {
			    let 唯一标识;
			    const 现有符号 = 全局物品标识映射.get(
			        门数据.唯一标识符串
			    );
			    if (现有符号) {
			        唯一标识 = 现有符号;
			    } else {
			        唯一标识 = Symbol(
			            门数据.唯一标识符串.slice(7, -1)
			        );
			        全局物品标识映射.set(
			            门数据.唯一标识符串,
			            唯一标识
			        );
			    }
			
			    const 实例 = new 门({
			        关联房间ID: 门数据.房间ID,
			        位置: { ...门数据.所在位置 },
			    });
			    实例.唯一标识 = 唯一标识;
			    实例.类型 = 门数据.类型;
			    实例.是否上锁 = 门数据.是否上锁;
			    楼层数据.门实例列表.set(唯一标识, 实例);
			    门实例映射.set(门数据.唯一标识符串, 实例);
			});
			        }
			
			        楼层数据.地牢数组 = Array(地牢大小)
			.fill()
			.map((_, y) =>
			    Array(地牢大小)
			        .fill()
			        .map((_, x) => {
			            const 单元格数据 =
			                楼层存档数据.序列化地牢格子?.[y]?.[x];
			            return 恢复单元格(
			                单元格数据,
			                x,
			                y,
			                全局物品实例映射,
			                new Map(),
			                门实例映射
			            );
			        })
			);
			        for (let y = 0; y < 地牢大小; y++) {
			for (let x = 0; x < 地牢大小; x++) {
			    const 单元格 = 楼层数据.地牢数组[y][x];
			    if (单元格.临时门标识符串) {
			        const 门实例 = 门实例映射.get(
			            单元格.临时门标识符串
			        );
			        if (门实例) {
			            单元格.标识 = 门实例.唯一标识;
			        }
			        delete 单元格.临时门标识符串;
			    }
			}
			        }
			
			        const 当前楼层怪物映射 = new Map();
			        if (楼层存档数据.序列化怪物列表) {
			楼层数据.所有怪物 = 楼层存档数据.序列化怪物列表
			    .map((怪物数据) =>
			        恢复怪物(
			            怪物数据,
			            全局物品实例映射,
			            当前楼层怪物映射
			        )
			    )
			    .filter((m) => m != null);
			        }
			
			        楼层数据.所有怪物.forEach((怪物实例, 索引) => {
			if (怪物实例.x !== null && 怪物实例.y !== null) {
			    const 单元格 =
			        楼层数据.地牢数组[怪物实例.y]?.[怪物实例.x];
			    if (单元格) {
			        if (!(单元格.关联怪物 instanceof 怪物)) {
			            单元格.关联怪物 = 怪物实例;
			            单元格.类型 = 单元格类型.怪物;
			        }
			    }
			}
			if (怪物实例.临时仇恨目标标识) {
			    const 标识 = 怪物实例.临时仇恨目标标识;
			    if (标识 === "玩家") {
			        怪物实例.仇恨 = 玩家;
			    } else if (标识.startsWith("怪物_")) {
			        const 仇恨索引 = parseInt(标识.split("_")[1]);
			        怪物实例.仇恨 =
			            当前楼层怪物映射.get(仇恨索引) || null;
			    }
			    delete 怪物实例.临时仇恨目标标识;
			}
			if (
			    怪物实例 instanceof 召唤师怪物 &&
			    怪物实例.临时召唤物索引列表
			) {
			    怪物实例.当前召唤物列表 =
			        怪物实例.临时召唤物索引列表
			            .map((召唤索引) =>
			                当前楼层怪物映射.get(召唤索引)
			            )
			            .filter((仆从) => 仆从 != null);
			    delete 怪物实例.临时召唤物索引列表;
			}
			if (
			    怪物实例 instanceof 幽灵仆从 &&
			    怪物实例.临时召唤者索引 !== undefined
			) {
			    怪物实例.召唤者 =
			        当前楼层怪物映射.get(怪物实例.临时召唤者索引) ||
			        null;
			    delete 怪物实例.临时召唤者索引;
			}
			if (
			    怪物实例 instanceof 大魔法师 &&
			    怪物实例.临时分身索引 !== undefined
			) {
			    怪物实例.分身 =
			        当前楼层怪物映射.get(怪物实例.临时分身索引) ||
			        null;
			    delete 怪物实例.临时分身索引;
			}
			if (
			    怪物实例 instanceof 旋风怪物 &&
			    怪物实例.临时召唤物索引列表
			) {
			    怪物实例.当前召唤物列表 =
			        怪物实例.临时召唤物索引列表
			            .map((召唤索引) =>
			                当前楼层怪物映射.get(召唤索引)
			            )
			            .filter((旋) => 旋 instanceof 旋风);
			    delete 怪物实例.临时召唤物索引列表;
			}
			if (怪物实例.临时状态效果) {
			    const 状态数据 = 怪物实例.临时状态效果;
			    new 状态效果(
			        状态数据.类型,
			        状态数据.颜色,
			        状态数据.图标,
			        状态数据.持续时间,
			        状态数据.剩余回合,
			        null,
			        怪物实例,
			        状态数据.强度
			    );
			    delete 怪物实例.临时状态效果;
			}
			        });
			        const 蜈蚣部分映射 = new Map();
楼层数据.所有怪物.forEach(m => {
    if (m.存档ID) {
        蜈蚣部分映射.set(m.存档ID, m);
    }
});

楼层数据.所有怪物.forEach(m => {
    if (m instanceof 蜈蚣怪物 && m.临时身体部位ID列表) {
        m.身体部位 = m.临时身体部位ID列表.map(id => 蜈蚣部分映射.get(id)).filter(Boolean);
        delete m.临时身体部位ID列表;
    }
    if (m instanceof 蜈蚣部位) {
        if (m.临时主体ID) {
            m.主体 = 蜈蚣部分映射.get(m.临时主体ID);
            delete m.临时主体ID;
        }
        if (m.临时跟随ID) {
            m.跟随 = 蜈蚣部分映射.get(m.临时跟随ID);
            delete m.临时跟随ID;
        }
    }
});
			
			        if (楼层存档数据.序列化物品列表) {
			楼层数据.所有计时器 = 楼层存档数据.序列化物品列表
			    .map((物品数据) => {
			        let 实例 = 全局物品实例映射.get(
			            物品数据.唯一标识符串
			        );
			        if (!实例) {
			            实例 = 恢复物品(物品数据, 全局物品标识映射);
			            if (实例)
			                全局物品实例映射.set(
			                    物品数据.唯一标识符串,
			                    实例
			                );
			        }
			        return 实例;
			    })
			    .filter((b) => b != null);
			        }
			
			        for (const 物品实例 of 全局物品实例映射.values()) {
			if (物品实例 instanceof 宠物) {
			    const 装备标识 =
			        物品实例.自定义数据.get("装备标识") || {};
			    const 恢复后装备 = {};
			    for (const 槽位 in 装备标识) {
			        const 标识符串 = 装备标识[槽位];
			        if (标识符串) {
			            const 装备物品实例 =
			                全局物品实例映射.get(标识符串);
			            if (
			                装备物品实例 &&
			                ((槽位 === "武器" &&
			                    装备物品实例 instanceof 武器类) ||
			                    (槽位 === "防具" &&
			                        装备物品实例 instanceof
			                            防御装备类))
			            ) {
			                恢复后装备[槽位] = 装备物品实例;
			            }
			        } else {
			            恢复后装备[槽位] = null;
			        }
			    }
			    物品实例.自定义数据.set("装备", 恢复后装备);
			} else if (物品实例 instanceof 折跃门) {
			    const 目标房间ID =
			        物品实例.自定义数据.get("目标房间");
			    if (
			        目标房间ID !== null &&
			        目标房间ID !== undefined
			    ) {
			        const 目标房间 = 楼层数据.房间列表.find(
			            (r) => r.id === 目标房间ID.id
			        );
			        if (目标房间) {
			            物品实例.自定义数据.set(
			                "目标房间",
			                目标房间
			            );
			        }
			    } else {
			        物品实例.自定义数据.set("目标房间", null);
			    }
			} else if (
			    物品实例 instanceof 神秘商人 ||
			    物品实例 instanceof 物品祭坛
			) {
			    const 库存序列化 =
			        物品实例.自定义数据.get("库存序列化") || [];
			    const 恢复后库存 = [];
			    库存序列化.forEach((物品数据) => {
			        let 库存物品实例 = 全局物品实例映射.get(
			            物品数据.唯一标识符串
			        );
			        if (!库存物品实例) {
			            库存物品实例 = 恢复物品(
			                物品数据,
			                全局物品标识映射
			            );
			            if (库存物品实例)
			                全局物品实例映射.set(
			                    物品数据.唯一标识符串,
			                    库存物品实例
			                );
			        }
			        if (库存物品实例) {
			            恢复后库存.push(库存物品实例);
			        }
			    });
			    物品实例.自定义数据.set("库存", 恢复后库存);
			}
			        }
			        if (
			楼层存档数据.挑战状态列表 &&
			Array.isArray(楼层存档数据.挑战状态列表)
			        ) {
			楼层存档数据.挑战状态列表.forEach((存档的挑战状态) => {
			    const 对应房间 = 楼层数据.房间列表.find(
			        (r) => r.id === 存档的挑战状态.id
			    );
			    if (对应房间 && 存档的挑战状态.状态) {
			        对应房间.类型 = "挑战房间";
			        对应房间.挑战状态 = JSON.parse(
			            JSON.stringify(存档的挑战状态.状态)
			        );
			
			        if (
			            对应房间.挑战状态.波次内怪物 &&
			            Array.isArray(对应房间.挑战状态.波次内怪物)
			        ) {
			            对应房间.挑战状态.波次内怪物 =
			                对应房间.挑战状态.波次内怪物
			                    .map((怪物标识符) => {
			                        if (
			                            typeof 怪物标识符 ===
			                                "string" &&
			                            怪物标识符.startsWith(
			                                "怪物_"
			                            )
			                        ) {
			                            const 索引 = parseInt(
			                                怪物标识符.split("_")[1]
			                            );
			                            return (
			                                楼层数据.所有怪物[
			                                    索引
			                                ] || null
			                            );
			                        }
			                        return null;
			                    })
			                    .filter((m) => m !== null);
			        }
			
			        if (
			            对应房间.挑战状态.原始门数据 &&
			            Array.isArray(对应房间.挑战状态.原始门数据)
			        ) {
			            对应房间.挑战状态.原始门数据.forEach(
			                (门数据) => {
			                    if (
			                        门数据.原标识 &&
			                        typeof 门数据.原标识 ===
			                            "string"
			                    ) {
			                        let 门符号 =
			                            全局物品标识映射.get(
			                                门数据.原标识
			                            );
			                        if (
			                            !门符号 &&
			                            门数据.原标识.startsWith(
			                                "Symbol("
			                            )
			                        ) {
			                            const description =
			                                门数据.原标识.slice(
			                                    7,
			                                    -1
			                                );
			                            门符号 =
			                                Symbol(description);
			                            全局物品标识映射.set(
			                                门数据.原标识,
			                                门符号
			                            );
			                        }
			                        门数据.原标识 =
			                            门符号 || 门数据.原标识;
			                    }
			                }
			            );
			        }
			    }
			});
			        }
			        if (楼层存档数据.序列化玩家仆从索引) {
    楼层存档数据.序列化玩家仆从索引.forEach(索引 => {
        const 仆从 = 楼层数据.所有怪物[索引];
        if (仆从 instanceof 骷髅仆从 && !玩家仆从列表.includes(仆从)) {
            玩家仆从列表.push(仆从);
        }
    });
}
			        
			        楼层数据.所有怪物.forEach(monster => {
			if (monster instanceof 王座守护者) {
			    monster.皇家守卫列表 = (monster.临时守卫索引列表 || []).map(index => 楼层数据.所有怪物[index]).filter(Boolean);
			    monster.激活的墓碑列表 = (monster.临时墓碑索引列表 || []).map(index => 楼层数据.所有怪物[index]).filter(Boolean);
			    delete monster.临时守卫索引列表;
			    delete monster.临时墓碑索引列表;
			}
			        });
			        
			        const allFloorItems = [...(楼层数据.所有计时器 || []), ...(地上物品实例映射.values() || [])];
			        allFloorItems.forEach(item => {
			if (item instanceof 刷怪笼 && item.临时生成物标识列表) {
			    item.自定义数据.set('当前生成物列表', item.临时生成物标识列表.map(id => {
			        if (typeof id === 'string' && id.startsWith('怪物_')) {
			            const index = parseInt(id.split('_')[1]);
			            return 楼层数据.所有怪物[index] || null;
			        }
			        return 全局物品实例映射.get(id) || null;
			    }).filter(Boolean));
			    delete item.临时生成物标识列表;
			}
			        });
			
			        console.log(`楼层 ${层号} 恢复完成`);
			        return 楼层数据;
			    } catch (e) {
			        console.error(`恢复楼层 ${层号} 失败:`, e);
			        return null;
			    }
			}
			function 导出存档() {
			    if (是否为教程层) {
			        显示通知("不支持在教程关卡导出存档", "错误");
			        return;
			    }
			    if (游戏状态 === "图鉴") {
			        显示通知("不支持在图鉴导出存档", "错误");
			        return;
			    }
			    if (是否是自定义关卡) {
			        显示通知("不支持在创意关卡导出存档", "错误");
			        return;
			    }
			    if (游戏状态 === "地图编辑器" || 游戏状态 === "编辑器游玩") {
			    显示通知("不支持在地图编辑器导出存档", "错误");
			        return;
			    }
			    if (游戏状态 === "地图编辑器" || 游戏状态 === "死亡界面" || 游戏状态==="胜利"||游戏状态==="图鉴选择") return;
			    玩家属性.允许移动 -= 1;
			
			    const 存档字符串 = 保存游戏状态(); // 调用只返回字符串的版本
			    玩家属性.允许移动 += 1;
			    if (存档字符串) {
			        const 数据块 = new Blob([存档字符串], {
			            type: "application/json",
			        });
			        const 下载链接 = URL.createObjectURL(数据块);
			        const 链接元素 = document.createElement("a");
			        链接元素.href = 下载链接;
			        // 文件名包含日期和时间戳
			        const 时间戳 = new Date()
			            .toISOString()
			            .replace(/[:.]/g, "-");
			        链接元素.download = `中文地牢存档_${时间戳}.json`;
			        document.body.appendChild(链接元素);
			        链接元素.click(); // 模拟点击下载
			        document.body.removeChild(链接元素); // 清理 DOM
			        URL.revokeObjectURL(下载链接); // 释放对象 URL
			        显示通知("存档已导出为文件。", "成功"); // 导出成功提示
			    } else {
			        显示通知("导出存档失败！", "错误"); // 保存失败时提示
			    }
			}
			
			function 导入存档(存档字符串) {
			    try {
			        const 存档数据 = JSON.parse(存档字符串);
					if (!开发者模式) {
			
			        if (存档数据.isPublished) {
			            显示通知("无法通过此按钮加载已发布的创意关卡！", "错误");
			            return;
			        }
			
			        if (Object.keys(存档数据.编辑器状态数据).length!==0) {
			            显示通知("无法通过此按钮加载地图编辑器文件！", "错误");
			            return;
			        }
				}
			
			        if (存档数据 && 存档数据.版本) {
			            if (存档数据.版本 === 存档版本) {
			                启动游戏(存档数据);
			                if(已初始化 > 0) 初始化装备系统()
			                if(已初始化 > 0) 初始化背包事件监听()
			                if(已初始化 > 0) 动画帧();
			            } else {
			                显示通知("存档版本不匹配！", "错误");
			            }
			        } else {
			            显示通知("存档数据无效或缺少版本信息！", "错误");
			        }
			    } catch (错误) {
			        console.error("导入存档失败:", 错误);
			        显示通知("导入存档失败，数据格式错误或损坏！", "错误");
			    }
			}
			
			读取存档按钮.addEventListener("click", () => {
			    const 文件输入控件 = document.getElementById("存档文件输入");
			    文件输入控件.value = ""; // 清空，确保 change 事件触发
			
			    // 为本次点击设置专属的 onchange 事件
			    文件输入控件.onchange = (事件) => {
			        const 选择的文件 = 事件.target.files[0];
			        if (!选择的文件) return;
			
			        if (!选择的文件.name.toLowerCase().endsWith(".json")) {
			显示通知("请选择有效的 JSON 存档文件！", "错误");
			return;
			        }
			
			        const 文件阅读器 = new FileReader();
			        文件阅读器.onload = (读取事件) => {
			const 存档字符串 = 读取事件.target.result;
			导入存档(存档字符串); // 调用正确的存档加载函数
			        };
			        文件阅读器.onerror = () => 显示通知("读取存档文件失败！", "错误");
			        文件阅读器.readAsText(选择的文件);
			
			        // 清理，防止下次误触发
			        文件输入控件.onchange = null; 
			    };
			
			    文件输入控件.click();
			});
			
			
			
			读凭证按钮.addEventListener("click", () => {
			    const 凭证 = prompt("请输入死亡凭证:");
			    if (凭证) {
			        const parts = 凭证.split("-");
			        if (parts.length === 3) {
			            const L = parseInt(parts[0]);
			            if (!isNaN(L) && 验证死亡凭证(凭证, L)) {
			                alert(`凭证有效！记录最高层数：${L}`);
			            } else {
			                alert("无效的死亡凭证！");
			            }
			        } else {
			            alert("凭证格式错误！");
			        }
			    }
			});
			function 生成图鉴地牢(分区索引 = 0, 每层条目数 = 9) {
			    // 提供默认值
			    
			    地牢 = Array(地牢大小)
			        .fill()
			        .map((_, y) =>
			            Array(地牢大小)
			                .fill()
			                .map((_, x) => new 单元格(x, y))
			        );
			    房间列表 = [];
			    上锁房间列表 = []; 
			    所有怪物 = []; 
			    怪物状态表 = new WeakMap(); 
			    门实例列表 = new Map();
			    房间地图 = Array(地牢大小)
			        .fill()
			        .map(() => Array(地牢大小).fill(-1));
			    已访问房间 = new Set(); 
			
			    
			    const 所有条目定义 = [
			        ...所有物品定义.map((def) => ({
			            ...def,
			            图鉴类型: "物品",
			        })),
			        ...所有怪物定义.map((def) => ({
			            ...def,
			            图鉴类型: "怪物",
			        })),
			    ];
			    const 总条目数 = 所有条目定义.length;
			
			    
			    const 房间尺寸 = 5; 
			    const 间距 = -1; 
			    const 走廊宽度 = 3; 
			    const 中心Y = Math.floor(地牢大小 / 2); 
			
			    
			    const 起始条目索引 = 分区索引 * 每层条目数;
			    const 结束条目索引 = Math.min(
			        起始条目索引 + 每层条目数,
			        总条目数
			    ); 
			    const 当前分区条目数 = 结束条目索引 - 起始条目索引;
			    if (当前分区条目数 <= 0) {
			        console.warn(`图鉴分区 ${分区索引 + 1} 没有条目可显示。`);
			        
			        玩家初始位置.x = Math.floor(地牢大小 / 2);
			        玩家初始位置.y = 中心Y;
			        玩家.x = 玩家初始位置.x;
			        玩家.y = 玩家初始位置.y;
			        更新视口();
			        return; 
			    }
			
			    
			    const 走廊起始X = 5; 
			    const 走廊结束X = Math.min(
			        地牢大小 - 2,
			        走廊起始X + 当前分区条目数 * (房间尺寸 + 间距) + 4
			    );
			    for (let x = 走廊起始X; x <= 走廊结束X; x++) {
			        for (
			            let dy = -Math.ceil(走廊宽度 / 2);
			            dy <= Math.floor(走廊宽度 / 2);
			            dy++
			        ) {
			            const y = 中心Y + dy;
			            if (y >= 0 && y < 地牢大小 && 地牢[y]?.[x]) {
			                
			                地牢[y][x].背景类型 = 单元格类型.走廊;
			            }
			        }
			    }
			
			    
			    let 当前X = 走廊起始X + 4; 
			    let 房间ID计数 = 0;
			    let 实际放置条目计数 = 0; 
			
			    
			    const 放置条目 = (条目定义, 类型) => {
			        
			        const 房间Y偏移 = Math.floor(走廊宽度 / 2) + 2; 
			        const 房间Y =
			            中心Y +
			            (实际放置条目计数 % 2 === 0
			                ? -(房间Y偏移 + 房间尺寸)
			                : 房间Y偏移); 
			        const 房间起始X = 当前X;
			        const 房间起始Y = 房间Y;
			
			        
			        if (
			            房间起始X + 房间尺寸 >= 地牢大小 ||
			            房间起始Y < 0 ||
			            房间起始Y + 房间尺寸 >= 地牢大小
			        ) {
			            console.warn(
			                `图鉴房间 ${房间ID计数} (类型: ${类型}) 在 (${房间起始X}, ${房间起始Y}) 超出边界，跳过。`
			            );
			            当前X += 房间尺寸 + 间距; 
			            
			            return false; 
			        }
			
			        
			        const 新房间 = {
			            x: 房间起始X,
			            y: 房间起始Y,
			            w: 房间尺寸,
			            h: 房间尺寸,
			            id: 房间ID计数,
			            门: [],
			            类型: "图鉴展示", 
			        };
			        房间列表.push(新房间);
			        放置房间(新房间); 
			        房间列表.sort((a,b)=>a.id-b.id)
			
			        
			        let 门X = 房间起始X + Math.floor(房间尺寸 / 2);
			        let 门Y房间侧, 门Y走廊侧;
			        if (实际放置条目计数 % 2 === 0) {
			            
			            门Y房间侧 = 房间起始Y + 房间尺寸 - 1; 
			            门Y走廊侧 = 门Y房间侧 + 1; 
			        } else {
			            
			            门Y房间侧 = 房间起始Y; 
			            门Y走廊侧 = 门Y房间侧 - 1; 
			        }
			
			        
			        if (地牢[门Y房间侧]?.[门X] && 地牢[门Y走廊侧]?.[门X]) {
			            const 门实例 = new 门({
			                关联房间ID: 新房间.id,
			                位置: { x: 门X, y: 门Y房间侧 },
			            }); 
			            地牢[门Y房间侧][门X].背景类型 = 单元格类型.门;
			            地牢[门Y走廊侧][门X].背景类型 = 单元格类型.门;
			            地牢[门Y房间侧][门X].标识 = 门实例.唯一标识; 
			            地牢[门Y走廊侧][门X].标识 = 门实例.唯一标识;
			            门实例列表.set(门实例.唯一标识, 门实例); 
			            新房间.门.push({ x: 门X, y: 门Y房间侧 }); 
			            新房间.门.push({ x: 门X, y: 门Y走廊侧 });
			            
			            地牢[门Y房间侧][门X].墙壁 = {
			                上: false,
			                下: false,
			                左: false,
			                右: false,
			            };
			            地牢[门Y走廊侧][门X].墙壁 = {
			                上: false,
			                下: false,
			                左: false,
			                右: false,
			            };
			            
			            if (地牢[门Y房间侧 + 1]?.[门X])
			                地牢[门Y房间侧 + 1][门X].墙壁.上 = false;
			            if (地牢[门Y房间侧 - 1]?.[门X])
			                地牢[门Y房间侧 - 1][门X].墙壁.下 = false;
			            if (地牢[门Y走廊侧 + 1]?.[门X])
			                地牢[门Y走廊侧 + 1][门X].墙壁.上 = false;
			            if (地牢[门Y走廊侧 - 1]?.[门X])
			                地牢[门Y走廊侧 - 1][门X].墙壁.下 = false;
			        } else {
			            console.warn(
			                `无法为图鉴房间 ${新房间.id} 在 (${门X}, ${门Y房间侧}) 和 (${门X}, ${门Y走廊侧}) 放置门。`
			            );
			        }
			
			        
			        const 放置X = 房间起始X + Math.floor(房间尺寸 / 2);
			        const 放置Y = 房间起始Y + Math.floor(房间尺寸 / 2);
			        if (类型 === "物品") {
			            try {
			                const 实例 = new 条目定义.类({}); 
			                实例.堆叠数量 = 1; 
			                if (实例 instanceof 卷轴类) {
			                    实例.自定义数据.set("已解锁", true);
			                }
			                放置物品到单元格(实例, 放置X, 放置Y); 
			            } catch (错误) {
			                console.error(
			                    `图鉴：无法实例化物品 ${条目定义.类?.name}:`,
			                    错误
			                );
			            }
			        } else if (类型 === "怪物") {
			            try {
			                const 实例 = new 条目定义.类({
			                    x: 放置X,
			                    y: 放置Y,
			                    状态: 怪物状态.休眠,
			                }); 
			                实例.状态 = 怪物状态.休眠; 
			                放置怪物到单元格(实例, 放置X, 放置Y); 
			            } catch (错误) {
			                console.error(
			                    `图鉴：无法实例化怪物 ${条目定义.类?.name}:`,
			                    错误
			                );
			            }
			        }
			
			        
			        当前X += 房间尺寸 + 间距;
			        房间ID计数++;
			        实际放置条目计数++; 
			        return true; 
			    };
			
			    
			    for (let i = 起始条目索引; i < 结束条目索引; i++) {
			        const 当前条目定义 = 所有条目定义[i];
			        放置条目(当前条目定义, 当前条目定义.图鉴类型);
			    }
			
			    
			    玩家初始位置.x = 走廊起始X + 1; 
			    玩家初始位置.y = 中心Y;
			    玩家.x = 玩家初始位置.x;
			    玩家.y = 玩家初始位置.y;
			    const 总分区数 = Math.ceil(总条目数 / 每层条目数);
			    const 楼梯上X = 走廊起始X;
			    const 楼梯上Y = 中心Y;
			    const 楼梯下X = 走廊结束X;
			    const 楼梯下Y = 中心Y;
			
			    
			    if (分区索引 > 0) {
			        
			        const 上楼梯实例 = {
			            图标: 楼梯图标.上楼,
			            显示图标: 楼梯图标.上楼,
			            类型: "楼梯", 
			            使用: () => {
							所有计时器=[];
			                进入图鉴地牢(分区索引 - 1, 每层条目数);
			            },
			            获取名称: () => "上一个分区",
			            唯一标识: Symbol("图鉴上楼梯"), 
			            自定义数据: new Map(),
			            品质: 1,
			            颜色索引: 颜色表.length,
			            堆叠数量: 1,
			            最大堆叠数量: 1,
			            能否拾起: false,
			            是否正常物品: false,
			            是否隐藏: false,
			            是否为隐藏物品: false,
			            效果描述: null,
			            已装备: false,
			            装备槽位: null,
			            颜色表: 颜色表,
			        };
			        
			        if (
			            地牢[楼梯上Y]?.[楼梯上X] &&
			            地牢[楼梯上Y][楼梯上X].背景类型 === 单元格类型.走廊
			        ) {
			            放置物品到单元格(
			                上楼梯实例,
			                楼梯上X,
			                楼梯上Y,
			                单元格类型.楼梯上楼
			            );
			        } else {
			            console.warn(
			                `无法在 (${楼梯上X}, ${楼梯上Y}) 放置上楼梯`
			            );
			        }
			    }
			
			    
			    if (分区索引 < 总分区数 - 1) {
			        
			        const 下楼梯实例 = {
			            图标: 楼梯图标.下楼,
			            显示图标: 楼梯图标.下楼,
			            类型: "楼梯", 
			            使用: () => {
							所有计时器=[];
			                进入图鉴地牢(分区索引 + 1, 每层条目数);
			            },
			            获取名称: () => "下一个分区",
			            唯一标识: Symbol("图鉴下楼梯"), 
			            自定义数据: new Map(),
			            品质: 1,
			            颜色索引: 颜色表.length,
			            堆叠数量: 1,
			            最大堆叠数量: 1,
			            能否拾起: false,
			            是否正常物品: false,
			            是否隐藏: false,
			            是否为隐藏物品: false,
			            效果描述: null,
			            已装备: false,
			            装备槽位: null,
			            颜色表: 颜色表,
			        };
			        
			        if (
			            地牢[楼梯下Y]?.[楼梯下X] &&
			            地牢[楼梯下Y][楼梯下X].背景类型 === 单元格类型.走廊
			        ) {
			            放置物品到单元格(
			                下楼梯实例,
			                楼梯下X,
			                楼梯下Y,
			                单元格类型.楼梯下楼
			            );
			        } else {
			            console.warn(
			                `无法在 (${楼梯下X}, ${楼梯下Y}) 放置下楼梯`
			            );
			        }
			    }
			    const 初始武器 = new 钢制长剑({ 不可破坏: true });
			    放置物品到单元格(初始武器, 玩家.x + 2, 玩家.y);
			    放置物品到单元格(
			        new 迅捷卷轴({
			            数量: 1,
			            已解锁: true,
			            能量消耗: 0,
			        }),
			        玩家.x + 1,
			        玩家.y
			    );
			
			    
			    生成墙壁(); 
			    房间列表.forEach((房间) => 更新房间墙壁(房间)); 
			
			    更新视口(); 
			}
			function 进入图鉴地牢(分区索引, 每层条目数) {
			    
			    当前层数 = -2 - 分区索引; // 用负数区分不同分区
			    最大背包容量 = 24;
			    所有地牢层 = new Map();
			    document.getElementById("logContent").innerHTML = "";
			    document.querySelector(".health-bar").style.width = "100%";
			    document.querySelector(".power-bar").style.width = "100%";
			
			    生成图鉴地牢(分区索引, 每层条目数); // 调用生成函数，传入分区信息
			
			    更新背包显示();
			    更新装备显示();
			    更新界面状态();
			    if(已初始化 > 0) 动画帧(); // 启动动画
			    隐藏主菜单(); // 确保主菜单隐藏
			    是否为教程层 = false;
			    document.getElementById("跳过教程按钮").style.display = "none";
			    最高教程阶段 = 6;
			    游戏状态 = "图鉴";
			    显示通知(`已进入图鉴分区 ${分区索引 + 1}`, "信息");
			}
			function 打开图鉴分区选择() {

			    游戏状态 = "图鉴选择"; 
			    收集所有定义();
			    
			    主菜单容器.style.opacity = 0;
			    主菜单容器.style.pointerEvents = "none";
			    document.body.classList.remove("游戏进行中"); 
			
			    
			    const 物品总数 = 所有物品定义.length;
			    const 怪物总数 = 所有怪物定义.length;
			    const 总条目数 = 物品总数 + 怪物总数;
			    const 房间尺寸 = 5; 
			    const 间距 = -1; 
			    
			    const 可用宽度 = 地牢大小 - 10;
			    const 每侧房间数 = Math.floor(可用宽度 / (房间尺寸 + 间距));
			    const 每层条目数 = Math.max(1, 每侧房间数); 
			    const 总分区数 = Math.ceil(总条目数 / 每层条目数);
			
			    
			    const 遮罩 = document.getElementById("图鉴分区选择遮罩");
			    const 窗口 = document.getElementById("图鉴分区选择窗口");
			    const 列表容器 = document.getElementById("图鉴分区列表容器");
			    const 关闭按钮 = document.getElementById("关闭图鉴选择按钮");
			
			    列表容器.innerHTML = ""; 
			
			    if (总分区数 === 0) {
			        列表容器.innerHTML =
			            "<p style='text-align: center; color: #888;'>图鉴内容为空。</p>";
			    } else {
			        for (let i = 0; i < 总分区数; i++) {
			            const 分区按钮 = document.createElement("button");
			            分区按钮.className = "菜单按钮"; 
			            分区按钮.style.minWidth = "150px"; 
			            分区按钮.textContent = `图鉴分区 ${i + 1}`;
			            分区按钮.onclick = () => {
			                关闭图鉴分区选择(); 
			                初始化canvas();
			                if(已初始化 > 0) 初始化装备系统();
			                if(已初始化 > 0) 初始化背包事件监听();
			                进入图鉴地牢(i, 每层条目数);
			            };
			            列表容器.appendChild(分区按钮);
			        }
			    }
			
			    
			    关闭按钮.onclick = 关闭图鉴分区选择;
			
			    遮罩.style.display = "block";
			    
			    窗口.style.opacity = 0;
			    窗口.style.transform = "translate(-50%, -50%) scale(0.9)";
			    requestAnimationFrame(() => {
			        窗口.style.transition =
			            "opacity 0.3s ease, transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
			        窗口.style.opacity = 1;
			        窗口.style.transform = "translate(-50%, -50%) scale(1)";
			    });
			}
			function 关闭图鉴分区选择() {
			    const 遮罩 = document.getElementById("图鉴分区选择遮罩");
			    const 窗口 = document.getElementById("图鉴分区选择窗口");
			    if (!遮罩 || !窗口 || 遮罩.style.display === "none") return; 
			
			    窗口.style.transition =
			        "opacity 0.3s ease, transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
			    窗口.style.opacity = 0;
			    窗口.style.transform = "translate(-50%, -50%) scale(0.9)";
			    setTimeout(() => {
			        遮罩.style.display = "none";
			        
			        if (游戏状态 === "图鉴选择") {
			            显示主菜单();
			        }
			    }, 300); 
			}
			图鉴按钮.addEventListener("click", () => {
			    打开图鉴分区选择();
			});
			
			//初始化canvas();
			//初始化装备系统();
			if (window.innerWidth < 769) {
			    document.getElementById("小地图容器").classList.add("隐藏");
			}
			function 获取直线格子(x0, y0, x1, y1) {
			    const 格子列表 = [];
			    const ix0 = Math.floor(x0);
			    const iy0 = Math.floor(y0);
			    const ix1 = Math.floor(x1);
			    const iy1 = Math.floor(y1);
			
			    const dx = Math.abs(ix1 - ix0);
			    const dy = -Math.abs(iy1 - iy0);
			    let sx = ix0 < ix1 ? 1 : -1;
			    let sy = iy0 < iy1 ? 1 : -1;
			    let err = dx + dy;
			    let e2;
			
			    let 当前X = ix0;
			    let 当前Y = iy0;
			
			    while (true) {
			        格子列表.push({ x: 当前X, y: 当前Y });
			        if (当前X === ix1 && 当前Y === iy1) break;
			        e2 = 2 * err;
			        if (e2 >= dy) {
			            err += dy;
			            当前X += sx;
			        }
			        if (e2 <= dx) {
			            err += dx;
			            当前Y += sy;
			        }
			    }
			    return 格子列表;
			}
			function 放置怪物到房间(怪物实例, 目标房间) {
			    if (!怪物实例 || !目标房间) {
			        console.error("放置怪物到房间：无效的怪物实例或目标房间。");
			        return false;
			    }
			
			    if (怪物实例 instanceof 巨人怪物) {
			         for (let 尝试计数 = 0; 尝试计数 < 50; 尝试计数++) {
			            const 随机X = 目标房间.x + Math.floor(prng() * (目标房间.w - 2));
			            const 随机Y = 目标房间.y + Math.floor(prng() * (目标房间.h - 2));
			            if (放置巨人(怪物实例, 随机X, 随机Y)) {
			                怪物实例.房间ID = 目标房间.id;
			                return true;
			            }
			        }
			        console.warn(`在房间 ${目标房间.id} 多次尝试后未能放置巨人怪物。`);
			        return false;
			    }
			
			    let 放置成功 = false;
			    const 最大尝试次数 = 目标房间.w * 目标房间.h * 2; 
			
			    for (let 尝试计数 = 0; 尝试计数 < 最大尝试次数; 尝试计数++) {
			        const 随机X =
			            目标房间.x + Math.floor(prng() * 目标房间.w);
			        const 随机Y =
			            目标房间.y + Math.floor(prng() * 目标房间.h);
			
			        if (位置是否可用(随机X, 随机Y, false)) {
			            if (放置怪物到单元格(怪物实例, 随机X, 随机Y)) {
			                怪物实例.房间ID = 目标房间.id; 
			                放置成功 = true;
			                break; 
			            }
			        }
			    }
			
			    if (!放置成功) {
			        console.warn(
			            `在房间 ${目标房间.id} (${
			                目标房间.类型 || "未知类型"
			            }) 中多次尝试后未能放置怪物 ${
			                怪物实例.类型
			            }。房间可能已满或无合适位置。`
			        );
			    }
			    return 放置成功;
			}
			function isObject(value) {
  return typeof value === 'object' && value !== null;
}

/**
 * 深拷贝函数：支持对象、数组、Date、Map、Set 等类型，自动处理循环引用。
 *
 * @param {any} target - 要深拷贝的目标值
 * @returns {any} 返回深拷贝后的新对象
 */
function deepClone(target) {
  // 缓存已拷贝对象，防止循环引用导致栈溢出
  const map = new Map();
  /**
   * 递归克隆函数
   * @param {any} _value - 当前处理的值
   * @returns {any} 拷贝后的值
   */
  function clone(_value) {
    // 如果是已经处理过的对象，直接返回缓存结果（防止循环引用）
    if (map.has(_value)) return map.get(_value);

    // 原始类型（number、string、boolean、null、undefined、symbol）直接返回
    if (!isObject(_value)) return _value;

    // 函数类型不做处理，直接返回引用本身
    if (typeof _value === 'function') {
      map.set(_value, _value);
      return _value;
    }

    let result;

    // Date 类型
    if (_value instanceof Date) {
      result = new Date(_value);
      map.set(_value, result);
      return result;
    }

    // Map 类型
    if (_value instanceof Map) {
      result = new Map();
      map.set(_value, result);
      _value.forEach((val, key) => {
        result.set(key, clone(val));
      });
      return result;
    }

    // Set 类型
    if (_value instanceof Set) {
      result = new Set();
      map.set(_value, result);
      _value.forEach((item) => {
        result.add(clone(item));
      });
      return result;
    }

    // 普通对象或数组
    result = Array.isArray(_value) ? [] : {};
    map.set(_value, result);

    // 递归处理对象自身的可枚举属性（不包括原型链上的）
    for (const key in _value) {
      if (Object.hasOwn(_value, key)) {
        result[key] = clone(_value[key]);
      }
    }

    return result;
  }

  return clone(target);
}
			function 生成沉没的迷宫() {
			    // =================================================
			    // 1. 初始化与重置游戏状态
			    // =================================================
			    console.log("正在生成特殊关卡：沉没的迷宫...");
			    地牢 = Array(地牢大小)
			        .fill()
			        .map((_, y) =>
			            Array(地牢大小)
			                .fill()
			                .map((_, x) => new 单元格(x, y))
			        );
			    房间列表 = [];
			    上锁房间列表 = [];
			    所有怪物 = [];
			    怪物状态表 = new WeakMap();
			    门实例列表 = new Map();
			    房间地图 = Array(地牢大小)
			        .fill()
			        .map(() => Array(地牢大小).fill(-1));
			    已访问房间 = new Set();
			    所有计时器 = [];
			    当前天气效果 = [];
			
			    // =================================================
			    // 2. 定义迷宫的房间布局
			    // =================================================
			    const 房间布局 = [
			        // --- 中央区域 ---
			        {
			            名称: "中央大厅",
			            id: 0,
			            x: 45,
			            y: 45,
			            w: 11,
			            h: 11,
			            门: [],
			        },
			        {
			            名称: "北翼大门",
			            id: 1,
			            x: 48,
			            y: 38,
			            w: 5,
			            h: 5,
			            门: [],
			        },
			        {
			            名称: "东翼大门",
			            id: 2,
			            x: 58,
			            y: 48,
			            w: 5,
			            h: 5,
			            门: [],
			        },
			        {
			            名称: "南翼大门",
			            id: 3,
			            x: 48,
			            y: 58,
			            w: 5,
			            h: 5,
			            门: [],
			        },
			        {
			            名称: "西翼大门",
			            id: 4,
			            x: 38,
			            y: 48,
			            w: 5,
			            h: 5,
			            门: [],
			        },
			
			        // --- 北翼：冰霜主题 ---
			        {
			            名称: "北翼_冰霜回廊",
			            id: 5,
			            x: 46,
			            y: 28,
			            w: 9,
			            h: 7,
			            门: [],
			        },
			        {
			            名称: "北翼_冰封大殿",
			            id: 6,
			            x: 47,
			            y: 15,
			            w: 7,
			            h: 9,
			            门: [],
			        },
			        {
			            名称: "北翼_守卫室",
			            id: 7,
			            x: 40,
			            y: 16,
			            w: 5,
			            h: 5,
			            门: [],
			        },
			        {
			            名称: "北翼_宝库",
			            id: 8,
			            x: 56,
			            y: 16,
			            w: 5,
			            h: 5,
			            门: [],
			        },
			
			        // --- 东翼：火焰与爆炸主题 ---
			        {
			            名称: "东翼_灼热通道",
			            id: 9,
			            x: 66,
			            y: 47,
			            w: 9,
			            h: 7,
			            门: [],
			        },
			        {
			            名称: "东翼_爆裂熔炉",
			            id: 10,
			            x: 79,
			            y: 46,
			            w: 9,
			            h: 9,
			            门: [],
			        },
			        {
			            名称: "东翼_守卫室",
			            id: 11,
			            x: 80,
			            y: 39,
			            w: 5,
			            h: 5,
			            门: [],
			        },
			        {
			            名称: "东翼_宝库",
			            id: 12,
			            x: 80,
			            y: 57,
			            w: 5,
			            h: 5,
			            门: [],
			        },
			
			        // --- 南翼：剧毒与自然主题 ---
			        {
			            名称: "南翼_藤蔓走廊",
			            id: 13,
			            x: 46,
			            y: 66,
			            w: 9,
			            h: 7,
			            门: [],
			        },
			        {
			            名称: "南翼_毒沼之心",
			            id: 14,
			            x: 47,
			            y: 77,
			            w: 7,
			            h: 9,
			            门: [],
			        },
			        {
			            名称: "南翼_守卫室",
			            id: 15,
			            x: 56,
			            y: 78,
			            w: 5,
			            h: 5,
			            门: [],
			        },
			        {
			            名称: "南翼_宝库",
			            id: 16,
			            x: 40,
			            y: 78,
			            w: 5,
			            h: 5,
			            门: [],
			        },
			
			        // --- 西翼：诡诈与敏捷主题 ---
			        {
			            名称: "西翼_幻影之道",
			            id: 17,
			            x: 26,
			            y: 47,
			            w: 9,
			            h: 7,
			            门: [],
			        },
			        {
			            名称: "西翼_诡诈大厅",
			            id: 18,
			            x: 13,
			            y: 46,
			            w: 9,
			            h: 9,
			            门: [],
			        },
			        {
			            名称: "西翼_守卫室",
			            id: 19,
			            x: 14,
			            y: 57,
			            w: 5,
			            h: 5,
			            门: [],
			        },
			        {
			            名称: "西翼_宝库",
			            id: 20,
			            x: 14,
			            y: 39,
			            w: 5,
			            h: 5,
			            门: [],
			        },
			
			        // --- 最终区域 ---
			        {
			            名称: "四色祭坛",
			            id: 21,
			            x: 25,
			            y: 25,
			            w: 9,
			            h: 9,
			            门: [],
			        },
			        {
			            名称: "最终秘室",
			            id: 22,
			            x: 26,
			            y: 13,
			            w: 7,
			            h: 7,
			            门: [],
			        },
			    ];
			
			    const 获取房间 = (名称) =>
			        房间列表.find((r) => r.名称 === 名称);
			
			    房间列表 = 房间布局;
			    房间列表.forEach((房间配置) => {
			        放置房间(房间配置);
			    });
			
			    // =================================================
			    // 3. 连接房间，构建迷宫路径
			    // =================================================
			    let 已连接房间对 = new Set();
			    const 连接并生成走廊 = (房间A, 房间B) => {
			        const 房间对ID = [房间A.id, 房间B.id].sort().join("-");
			        if (已连接房间对.has(房间对ID)) return;
			        const 路径 = 连接房间(房间A, 房间B);
			        if (路径) {
			            生成走廊(路径);
			            已连接房间对.add(房间对ID);
			        } else {
			            console.warn(
			                `无法连接房间 '${房间A.名称}' 和 '${房间B.名称}'`
			            );
			        }
			    };
			
			    // --- 主干道连接 ---
			    连接并生成走廊(获取房间("中央大厅"), 获取房间("北翼大门"));
			    连接并生成走廊(获取房间("中央大厅"), 获取房间("东翼大门"));
			    连接并生成走廊(获取房间("中央大厅"), 获取房间("南翼大门"));
			    连接并生成走廊(获取房间("中央大厅"), 获取房间("西翼大门"));
			
			    // --- 各翼内部连接 ---
			    连接并生成走廊(获取房间("北翼大门"), 获取房间("北翼_冰霜回廊"));
			    连接并生成走廊(
			        获取房间("北翼_冰霜回廊"),
			        获取房间("北翼_冰封大殿")
			    );
			    连接并生成走廊(
			        获取房间("北翼_冰封大殿"),
			        获取房间("北翼_守卫室")
			    );
			    连接并生成走廊(
			        获取房间("北翼_冰封大殿"),
			        获取房间("北翼_宝库")
			    );
			
			    连接并生成走廊(获取房间("东翼大门"), 获取房间("东翼_灼热通道"));
			    连接并生成走廊(
			        获取房间("东翼_灼热通道"),
			        获取房间("东翼_爆裂熔炉")
			    );
			    连接并生成走廊(
			        获取房间("东翼_爆裂熔炉"),
			        获取房间("东翼_守卫室")
			    );
			    连接并生成走廊(
			        获取房间("东翼_爆裂熔炉"),
			        获取房间("东翼_宝库")
			    );
			
			    连接并生成走廊(获取房间("南翼大门"), 获取房间("南翼_藤蔓走廊"));
			    连接并生成走廊(
			        获取房间("南翼_藤蔓走廊"),
			        获取房间("南翼_毒沼之心")
			    );
			    连接并生成走廊(
			        获取房间("南翼_毒沼之心"),
			        获取房间("南翼_守卫室")
			    );
			    连接并生成走廊(
			        获取房间("南翼_毒沼之心"),
			        获取房间("南翼_宝库")
			    );
			
			    连接并生成走廊(获取房间("西翼大门"), 获取房间("西翼_幻影之道"));
			    连接并生成走廊(
			        获取房间("西翼_幻影之道"),
			        获取房间("西翼_诡诈大厅")
			    );
			    连接并生成走廊(
			        获取房间("西翼_诡诈大厅"),
			        获取房间("西翼_守卫室")
			    );
			    连接并生成走廊(
			        获取房间("西翼_诡诈大厅"),
			        获取房间("西翼_宝库")
			    );
			
			    // --- 最终区域连接 ---
			    连接并生成走廊(获取房间("四色祭坛"), 获取房间("最终秘室"));
			
			    // --- 增加迷宫复杂度的额外连接 ---
			    连接并生成走廊(获取房间("北翼_守卫室"), 获取房间("四色祭坛"));
			    连接并生成走廊(获取房间("西翼_宝库"), 获取房间("四色祭坛"));
			    连接并生成走廊(
			        获取房间("东翼_灼热通道"),
			        获取房间("北翼_冰霜回廊")
			    );
			    连接并生成走廊(
			        获取房间("南翼_藤蔓走廊"),
			        获取房间("西翼_幻影之道")
			    );
			
			    // =================================================
			    // 4. 设置门锁与钥匙 (已重构)
			    // =================================================
			    const 锁定房间门 = (房间名称, 颜色索引) => {
			        const 房间 = 获取房间(房间名称);
			        if (!房间) return;
			        上锁房间列表.push({ ...房间, 颜色索引 });
			        房间.门.forEach((门坐标) => {
			            const 门单元格 = 地牢[门坐标.y]?.[门坐标.x];
			            if (门单元格 && 门单元格.背景类型 === 单元格类型.门) {
			                门单元格.背景类型 = 单元格类型.上锁的门;
			                门单元格.钥匙ID = 房间.id;
			                门单元格.颜色索引 = 颜色索引;
			                const 门实例 = 门实例列表.get(门单元格.标识);
			                if (门实例) {
			                    门实例.类型 = "上锁的门";
			                    门实例.是否上锁 = true;
			                }
			            }
			        });
			    };
			
			    // --- 锁定除北翼外的所有区域 ---
			    锁定房间门("东翼大门", 1); // 蓝色
			    锁定房间门("南翼大门", 2); // 黄色
			    锁定房间门("西翼大门", 3); // 品红色
			    锁定房间门("最终秘室", 4); // 红色
			    // 注意：北翼大门现在是默认开启的，不调用锁定函数
			
			    // --- 放置钥匙，形成线性流程 ---
			    // 东翼钥匙（蓝色）放在北翼宝库
			    放置物品到房间(
			        new 钥匙({
			            对应门ID: 获取房间("东翼大门").id,
			            颜色索引: 1,
			            地牢层数: 当前层数,
			        }),
			        获取房间("北翼_宝库")
			    );
			    // 南翼钥匙（黄色）放在东翼宝库
			    放置物品到房间(
			        new 钥匙({
			            对应门ID: 获取房间("南翼大门").id,
			            颜色索引: 2,
			            地牢层数: 当前层数,
			        }),
			        获取房间("东翼_宝库")
			    );
			    // 西翼钥匙（品红色）放在南翼宝库
			    放置物品到房间(
			        new 钥匙({
			            对应门ID: 获取房间("西翼大门").id,
			            颜色索引: 3,
			            地牢层数: 当前层数,
			        }),
			        获取房间("南翼_宝库")
			    );
			    // 最终秘室钥匙（红色）放在西翼宝库
			    放置物品到房间(
			        new 钥匙({
			            对应门ID: 获取房间("最终秘室").id,
			            颜色索引: 4,
			            地牢层数: 当前层数,
			        }),
			        获取房间("西翼_宝库")
			    );
			
			    // =================================================
			    // 5. 填充内容：怪物、物品和特殊NPC
			    // =================================================
			    // --- 中央大厅 ---
			    放置物品到房间(new 探险家({}), 获取房间("中央大厅"));
			    放置物品到房间(new 物品祭坛({}), 获取房间("中央大厅"));
			
			    // --- 北翼 (冰霜) ---
			    放置怪物到房间(
			        new 冰冻怪物({ 强化: true }),
			        获取房间("北翼_冰封大殿")
			    );
			    放置怪物到房间(new 盔甲怪物({}), 获取房间("北翼_冰封大殿"));
			    放置怪物到房间(
			        new 盔甲怪物({ 强化: true }),
			        获取房间("北翼_守卫室")
			    );
			    放置物品到房间(
			        new 冰霜法杖({ 强化: true }),
			        获取房间("北翼_宝库")
			    );
			    放置怪物到房间(new 冰冻怪物({}), 获取房间("北翼_宝库")); // 宝库增加怪物
			
			    // --- 东翼 (火焰) ---
			    放置怪物到房间(
			        new 炸弹怪物({ 强化: true }),
			        获取房间("东翼_爆裂熔炉")
			    );
			    放置物品到房间(
			        new 喷火枪({ 强化: true }),
			        获取房间("东翼_爆裂熔炉")
			    );
			    放置怪物到房间(
			        new 盔甲怪物({ 强化: true }),
			        获取房间("东翼_守卫室")
			    );
			    放置物品到房间(
			        new 炸弹({ 数量: 5, 强化: true }),
			        获取房间("东翼_宝库")
			    );
			    放置怪物到房间(new 炸弹怪物({}), 获取房间("东翼_宝库")); // 宝库增加怪物
			
			    // --- 南翼 (剧毒) ---
			    放置怪物到房间(
			        new 仙人掌怪物({ 强化: true }),
			        获取房间("南翼_毒沼之心")
			    );
			    放置怪物到房间(new 腐蚀怪物({}), 获取房间("南翼_毒沼之心"));
			    放置怪物到房间(
			        new 盔甲怪物({ 强化: true }),
			        获取房间("南翼_守卫室")
			    );
			    放置物品到房间(
			        new 剧毒匕首({ 强化: true }),
			        获取房间("南翼_宝库")
			    );
			    放置怪物到房间(new 腐蚀怪物({}), 获取房间("南翼_宝库")); // 宝库增加怪物
			
			    // --- 西翼 (诡诈) ---
			    放置怪物到房间(
			        new 瞬移怪物({ 强化: true }),
			        获取房间("西翼_诡诈大厅")
			    );
			    放置怪物到房间(new 敏捷怪物({}), 获取房间("西翼_诡诈大厅"));
			    放置怪物到房间(
			        new 盔甲怪物({ 强化: true }),
			        获取房间("西翼_守卫室")
			    );
			    放置物品到房间(
			        new 隐身药水({ 数量: 2 }),
			        获取房间("西翼_宝库")
			    );
			    放置怪物到房间(new 伪装怪物({}), 获取房间("西翼_宝库")); // 宝库增加怪物
