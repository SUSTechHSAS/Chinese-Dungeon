// Pathfinding algorithms and related functions

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

// Export to window
window.获取直线路径 = 获取直线路径;
window.从终点回溯路径 = 从终点回溯路径;
window.广度优先搜索路径 = 广度优先搜索路径;
window.A星寻路 = A星寻路;
window.检查视线 = 检查视线;
window.快速直线检查 = 快速直线检查;
window.获取移动方向 = 获取移动方向;
