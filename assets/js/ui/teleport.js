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

