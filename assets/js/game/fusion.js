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

