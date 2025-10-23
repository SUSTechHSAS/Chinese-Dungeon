function 初始化背包事件监听() {
			    const 容器 = document.getElementById("背包物品栏");
			
			    const 显示提示框 = (事件, 物品实例) => {
			        const 提示框 = document.getElementById("浮动提示框");
			        提示框.innerHTML = 物品实例.获取提示().replace(/\n/g, "<br>");
			        提示框.style.display = "block";
			
			        const 提示框宽度 = 提示框.offsetWidth;
			        const 提示框高度 = 提示框.offsetHeight;
			        const 视口宽度 = window.innerWidth;
			        const 视口高度 = window.innerHeight;
			        let left = 事件.pageX + 15;
			        let top = 事件.pageY + 15;
			
			        if (left + 提示框宽度 > 视口宽度 - 10) {
			left = 事件.pageX - 提示框宽度 - 15;
			        }
			        if (top + 提示框高度 > 视口高度 - 10) {
			top = 视口高度 - 提示框高度 - 10;
			        }
			        
			        left = Math.max(5, Math.min(left, 视口宽度 - 提示框宽度 - 5));
			        top = Math.max(5, Math.min(top, 视口高度 - 提示框高度 - 5));
			        
			        提示框.style.left = `${left}px`;
			        提示框.style.top = `${top}px`;
			    };
			
			    const 隐藏提示框 = () => {
			        document.getElementById("浮动提示框").style.display = "none";
			    };
			
			    容器.addEventListener('click', (事件) => {
			        const 物品条目 = 事件.target.closest('.物品条目');
			        if (!物品条目) return;
			        
			        const 物品实例 = 物品条目.__物品实例;
			        if (!物品实例) return;
			
			        const 目标按钮 = 事件.target.closest('button');
			
			        if (目标按钮) {
			事件.stopPropagation();
			if (目标按钮.classList.contains('装备按钮')) {
			    const 起始元素 = 物品条目;
			    if (物品实例.已装备) {
			        物品实例.取消装备();
			        显示通知("已卸下", "成功");
			        更新装备显示();
			    } else {
			        if (物品实例.装备()) {
			            显示通知("已装备", "成功");
			            更新背包显示();
			            
			            const 获取目标元素的函数 = () => document.getElementById(`装备槽${((物品实例.装备槽位 - 1) % 装备栏每页装备数) + 1}`);
			            创建并播放物品移动动画(起始元素, 获取目标元素的函数);
			            if (typeof gsap !== 'undefined') {
			                setTimeout(更新装备显示,260);
			            } else {
			                更新装备显示();
			            }
			            
			        } else {
			            显示通知("槽位已满", "错误");
			        }
			    }
			    目标按钮.style.background = 物品实例.已装备 ? "#f44336" : "#FF9800";
			    
			    隐藏提示框();
			} else if (目标按钮.classList.contains('丢弃按钮')) {
			    处理丢弃物品(物品实例.唯一标识);
			} else if (目标按钮.classList.contains('使用按钮')) {
			    使用背包物品(物品实例.唯一标识);
			} else if (目标按钮.classList.contains('上屏按钮')) {
			     添加到融合区(物品实例, 物品条目);
			}
			        } else { 
			const 当前是否已激活 = 物品条目.classList.contains('active');
			document.querySelectorAll('.物品容器 .物品条目.active').forEach(el => el.classList.remove('active'));
			
			if (!当前是否已激活) {
			    物品条目.classList.add('active');
			    显示提示框(事件, 物品实例);
			} else {
			    隐藏提示框();
			}
			        }
			    });
			
			    容器.addEventListener('contextmenu', (e) => {
			        const 物品条目 = e.target.closest('.物品条目');
			        if (!物品条目) return;
			        e.preventDefault();
			        const 物品实例 = 物品条目.__物品实例;
			        if (!物品实例) return;
			
			        const 起始元素 = 物品条目;
			        if (物品实例.已装备) {
			物品实例.取消装备();
			显示通知("已卸下", "成功");
			更新装备显示();
			        } else {
			if (物品实例.装备()) {
			    显示通知("已装备", "成功");
			    更新背包显示();
			    
			    const 获取目标元素的函数 = () => document.getElementById(`装备槽${((物品实例.装备槽位 - 1) % 装备栏每页装备数) + 1}`);
			    创建并播放物品移动动画(起始元素, 获取目标元素的函数);
			    if (typeof gsap !== 'undefined') {
			                setTimeout(更新装备显示,260);
			            } else {
			                更新装备显示();
			            }
			} else {
			    显示通知("槽位已满！", "错误");
			}
			        }
			        const 装备按钮 = 物品条目.querySelector('.装备按钮');
			        if (装备按钮) {
			装备按钮.style.background = 物品实例.已装备 ? '#f44336' : '#FF9800';
			        }
			        
			    });
			    
			    容器.addEventListener('mouseover', (事件) => {
			        if (事件.target.closest('button')) return;
			        const 物品条目 = 事件.target.closest('.物品条目');
			        if (物品条目 && !物品条目.classList.contains('active')) {
			const 物品实例 = 物品条目.__物品实例;
			if (物品实例) {
			    显示提示框(事件, 物品实例);
			}
			        }
			    });
			
			    容器.addEventListener('mouseout', (事件) => {
			        const 物品条目 = 事件.target.closest('.物品条目');
			        if (物品条目 && !物品条目.classList.contains('active')) {
			 隐藏提示框();
			        }
			    });
			    已初始化--;
			}

function 初始化装备系统() {
			    const 装备栏元素 = document.querySelector(".装备栏");
			
			    const 处理装备槽点击 = (槽位, 实际槽位编号) => {
			        const 当前物品 = 玩家装备.get(实际槽位编号);
			        if (!当前物品) return;
			
			        if (当前物品 instanceof 卷轴类) {
			            if (当前激活卷轴列表.has(当前物品)) {
			                当前激活卷轴列表.delete(当前物品);
			                当前物品.卸下();
			                const 物品元素 = 槽位.querySelector(".物品条目");
			                if (物品元素) 物品元素.classList.remove("卷轴闪烁");
			                显示通知("已禁用卷轴", "成功");
			            } else {
			                当前激活卷轴列表.add(当前物品);
			                if (当前物品.使用()) {
			                    显示通知("已启用卷轴", "成功");
			                    const 物品元素 =
			                        槽位.querySelector(".物品条目");
			                    if (物品元素)
			                        物品元素.classList.add("卷轴闪烁");
			                } else {
			                    当前激活卷轴列表.delete(当前物品);
			                }
			                更新装备显示();
			            }
			        } else {
			            使用装备槽物品(实际槽位编号);
			        }
			    };
			
			    if ("ontouchstart" in window && 装备栏元素) {
			        装备栏元素.addEventListener(
			            "touchstart",
			            (e) => {
			                触摸起始X = e.touches[0].clientX;
			                触摸移动X = 触摸起始X;
			                装备栏滑动中 = false;
			            },
			            { passive: true }
			        );
			
			        装备栏元素.addEventListener("touchmove", (e) => {
			            if (!触摸起始X) return;
			            触摸移动X = e.touches[0].clientX;
			            const deltaX = 触摸移动X - 触摸起始X;
			            if (Math.abs(deltaX) > 20) {
			                装备栏滑动中 = true;
			            }
			        });
			
			        装备栏元素.addEventListener("touchend", (e) => {
			            if (!触摸起始X || !装备栏滑动中) {
			                触摸起始X = 0;
			                return;
			            }
			            const deltaX = 触摸移动X - 触摸起始X;
			            const 滑动阈值 = 50;
			            if (deltaX < -滑动阈值) {
			                切换装备页(1);
			            } else if (deltaX > 滑动阈值) {
			                切换装备页(-1);
			            }
			            触摸起始X = 0;
			            触摸移动X = 0;
			            装备栏滑动中 = false;
			        });
			
			        装备栏元素.addEventListener("touchcancel", (e) => {
			            触摸起始X = 0;
			            触摸移动X = 0;
			            装备栏滑动中 = false;
			        });
			    }
			

			
			    document.querySelectorAll(".装备槽").forEach((槽位, index) => {
			        const handleTouchEnd = (e) => {
			            if (装备栏滑动中) return;
			            const 实际槽位编号 =
			                当前装备页 * 装备栏每页装备数 + (index + 1);
			            处理装备槽点击(槽位, 实际槽位编号);
			        };
			
			        槽位.addEventListener("touchend", handleTouchEnd);
			        槽位.addEventListener("touchcancel", handleTouchEnd);
			
			        if (!("ontouchstart" in window)) {
			            槽位.addEventListener("contextmenu", (e) => {
			                e.preventDefault();
			                卸下装备槽物品(
			                    当前装备页 * 装备栏每页装备数 + (index + 1)
			                );
			            });
			            槽位.addEventListener("click", (e) => {
			                const 实际槽位编号 =
			                    当前装备页 * 装备栏每页装备数 + (index + 1);
			                处理装备槽点击(槽位, 实际槽位编号);
			            });
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

