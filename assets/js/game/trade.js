function 关闭收购窗口() {
			    const 窗口 = document.getElementById("收购窗口");
			    窗口.classList.add("关闭中");
			    setTimeout(() => {
			        窗口.style.display = "none";
			        窗口.classList.remove("关闭中");
			        玩家属性.允许移动 -= 1;
			    }, 300);
			    NPC互动中 = false; // 结束互动
			    当前NPC = null;
			}

function 打开交易窗口(npc) {
			    if (npc.自定义数据.get("刷新次数") === 0) {
			        显示通知("货物已告罄", "信息");
			        return;
			    }
			    玩家属性.允许移动 += 1;
			
			    当前NPC = npc;
			    const 窗口 = document.getElementById("交易窗口");
			    窗口.querySelector("#交易次数").textContent =
			        npc.自定义数据.get("刷新次数");
			    窗口.querySelector("#当前金币").textContent = [
			        ...玩家背包.values(),
			    ]
			        .filter((i) => i instanceof 金币)
			        .reduce((sum, i) => sum + i.堆叠数量, 0);
			
			    const 库存容器 = 窗口.querySelector(".库存列表");
			    库存容器.innerHTML = "";
			
			    npc.自定义数据.get("库存").forEach((物品) => {
			        let 价格 = npc.获取价格(物品);
			        const 元素 = document.createElement("div");
			        元素.className = "交易物品条目";
			        元素.innerHTML = `
			<div class="物品头">
			    <span style="color:${
			        物品.颜色表[物品.颜色索引]
			    }; font-family: color-emoji">${物品.图标}</span>
			    ${物品.获取名称()}
			    <span class="物品价格">${价格} 金币</span>
			</div>
			<div class="物品描述">${物品.效果描述 || "神秘物品"}</div>
			        `;
			
			        元素.addEventListener("click", () => 尝试购买(物品, 价格));
			        库存容器.appendChild(元素);
			    });
			
			    窗口.style.display = "block";
			    窗口.classList.remove("关闭中");
			    document.body.appendChild(窗口);
			}

function 关闭交易窗口() {
			    document.getElementById("交易窗口").classList.add("关闭中");
			    setTimeout(() => {
			        document.getElementById("交易窗口").style.display = "none";
			        玩家属性.允许移动 -= 1;
			    }, 300);
			
			    当前NPC = null;
			    NPC互动中 = false;
			}

