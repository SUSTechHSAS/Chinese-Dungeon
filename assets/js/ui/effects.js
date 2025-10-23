// Visual effects for grid cells and combat

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

// Export to window
window.计划显示格子特效 = 计划显示格子特效;
window.显示格子特效 = 显示格子特效;
