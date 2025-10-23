function 显示通知(内容, 类型 = "信息", 强制显示 = false, 持续时间 = 1500) {
			添加日志(内容, 类型);
			if (!是否显示通知 && !强制显示) {
			    return;
			}
			
			const 容器 = document.querySelector(".通知容器") || document.createElement("div");
			if (!document.body.contains(容器)) {
			    容器.className = "通知容器";
			    document.body.appendChild(容器);
			}
			
			const 最大通知数 = 2;
			
			// 当通知数量达到或超过上限时，立即移除最旧的通知
			while (容器.children.length >= 最大通知数) {
			    const 待移除通知 = Array.from(容器.children).find(n => !n.classList.contains('持久'));
			    if (待移除通知) {
			        clearTimeout(待移除通知._timer); // 清除其自动消失的计时器
			        待移除通知.remove(); // 立即从DOM中移除
			    } else {
			        // 如果所有通知都是持久性的，则无法添加新通知
			        console.warn("无法显示新通知，因为所有可见通知都是持久性的。");
			        return;
			    }
			}
			
			const 图标表 = {
			    信息: "ℹ️",
			    成功: 图标映射.成功,
			    警告: "⚠️",
			    错误: 图标映射.错误,
			};
			const 通知 = document.createElement("div");
			通知.className = `通知条目 ${类型}`;
			if(强制显示) 通知.classList.add('持久');
			
			通知.innerHTML = `
			    <span class="通知图标">${图标表[类型]}</span>
			    <span class="通知内容">${内容}</span>
			    <button class="关闭按钮">×</button>
			`;//其实这里也可以xss注入...
			
			通知.querySelector('.关闭按钮').addEventListener('click', () => {
			    if (通知._timer) clearTimeout(通知._timer);
			    隐藏通知(通知);
			});
			
			
			    通知._timer = setTimeout(() => 隐藏通知(通知), 持续时间);
			    通知.addEventListener('mouseenter', () => clearTimeout(通知._timer));
			    通知.addEventListener('mouseleave', () => {
			        通知._timer = setTimeout(() => 隐藏通知(通知), 持续时间);
			    });
			
			
			容器.appendChild(通知);
			        }

function 添加日志(内容, 类型 = "信息") {
			    const 时间戳 = new Date().toLocaleTimeString();
			    const 条目 = document.createElement("div");
			    条目.className = `日志条目 ${类型}`;
			    条目.innerHTML = `<span class="日志时间">[${时间戳}]</span> ${内容}`;
			
			    document.getElementById("logContent").appendChild(条目);
			
			    条目.scrollIntoView({ behavior: "smooth" });
			    日志历史.push({ 时间戳, 内容, 类型 });
			}

function 收纳通知() {
			    是否显示通知 = !是否显示通知;
			    let 按钮 = document.querySelector(
			        "#设置菜单 button:nth-child(2)"
			    );
			    if (是否显示通知) {
			        按钮.innerHTML = "收纳通知";
			        显示通知("已重新显示通知", "信息");
			        按钮.textContent = "收纳通知";
			    } else {
			        按钮.innerHTML = "显示通知";
			        显示通知("已将通知收纳入日志中", "信息");
			        按钮.textContent = "显示通知";
			    }
			}

