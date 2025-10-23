function 打开游戏内设置() {
    const 菜单 = document.getElementById("设置菜单");
    if (菜单.classList.contains("显示")) {
        关闭设置菜单();
    }

    打开设置窗口();

    玩家属性.允许移动++; 
}

function 打开设置窗口() {
	 const 遮罩 = document.getElementById("设置窗口遮罩");
	 遮罩.style.display = "flex";
	 requestAnimationFrame(() => 遮罩.classList.add('显示'));
	
	 document.getElementById('方向键大小滑块').value = 游戏设置.方向键大小;
	 document.getElementById('方向键大小值').textContent = `${游戏设置.方向键大小}vmin`;
	 document.getElementById('显示方向键切换').classList.toggle('active', 游戏设置.显示方向键);
	 document.getElementById('手机模式切换').classList.toggle('active', 游戏设置.手机模式);
	 document.getElementById('移动速度滑块').value = 游戏设置.移动速度;
	 document.getElementById('移动速度值').textContent = `${游戏设置.移动速度}ms`;
	 document.getElementById('相机视野滑块').value = 相机显示边长;
	 document.getElementById('相机视野值').textContent = 相机显示边长;
	 document.getElementById('小地图大小滑块').value = 游戏设置.小地图大小;
	 document.getElementById('小地图大小值').textContent = 游戏设置.小地图大小 > 0 ? `${游戏设置.小地图大小}px` : '隐藏';
	 document.getElementById('动画模式切换').classList.toggle('active', 游戏设置.动画模式);
	 document.getElementById('文本模式切换').classList.toggle('active', 游戏设置.文本模式);
	 document.getElementById('禁用点击寻路切换').classList.toggle('active', 游戏设置.禁用点击移动);
	 document.getElementById('受伤击退切换').classList.toggle('active', 游戏设置.受伤时击退);

	 const 热键容器 = document.getElementById("热键绑定容器");
	 热键容器.innerHTML = '';

	 let capturingInput = null;
	 let originalKeybindings = { ...游戏设置.热键绑定 };

	 const captureHandler = (e) => {
	     e.preventDefault();
	     e.stopPropagation();
	     if (!capturingInput) return;

	     const newKey = e.key;
		 const displayKey = newKey === ' ' ? 'Space' : newKey;
	     const action = capturingInput.dataset.action;
	     const tempKeybindings = {};
	     热键容器.querySelectorAll('.热键输入').forEach(input => {
	         tempKeybindings[input.dataset.action] = input.value === 'Space' ? ' ' : input.value;
	     });

	     for (const [otherAction, assignedKey] of Object.entries(tempKeybindings)) {
	         if (otherAction !== action && assignedKey.toLowerCase() === newKey.toLowerCase()) {
	             显示通知(`按键 '${displayKey}' 已被 '${热键绑定描述[otherAction]}' 使用！`, "错误");
	             capturingInput.value = originalKeybindings[action] === ' ' ? 'Space' : originalKeybindings[action];
	             capturingInput.classList.remove('capturing');
	             capturingInput = null;
	             document.removeEventListener('keydown', captureHandler, true);
	             document.removeEventListener('mousedown', cancelCapture, true);
	             return;
	         }
	     }

	     capturingInput.value = displayKey;
	     capturingInput.classList.remove('capturing');
	     capturingInput = null;
	     document.removeEventListener('keydown', captureHandler, true);
	     document.removeEventListener('mousedown', cancelCapture, true);
	 };

	 const cancelCapture = (e) => {
	     if (capturingInput && !capturingInput.contains(e.target)) {
			 const originalKey = originalKeybindings[capturingInput.dataset.action];
	         capturingInput.value = originalKey === ' ' ? 'Space' : originalKey;
	         capturingInput.classList.remove('capturing');
	         capturingInput = null;
	         document.removeEventListener('keydown', captureHandler, true);
	         document.removeEventListener('mousedown', cancelCapture, true);
	     }
	 };

	 Object.entries(游戏设置.热键绑定).forEach(([action, key]) => {
	     const 条目 = document.createElement('div');
	     条目.className = '热键绑定条目';
	     const 标签 = document.createElement('span');
	     标签.textContent = 热键绑定描述[action] || action;
	     const 输入框 = document.createElement('input');
	     输入框.type = 'text';
	     输入框.className = '热键输入';
	     输入框.value = key === ' ' ? 'Space' : key;
	     输入框.dataset.action = action;
	     输入框.readOnly = true;

	     输入框.addEventListener('click', function(e) {
	         e.stopPropagation();
	         if (capturingInput && capturingInput !== this) {
				 const originalKey = originalKeybindings[capturingInput.dataset.action];
	             capturingInput.value = originalKey === ' ' ? 'Space' : originalKey;
	             capturingInput.classList.remove('capturing');
	         }
	         if (capturingInput === this) return;

	         this.value = '...';
	         this.classList.add('capturing');
	         capturingInput = this;
	         
	         document.removeEventListener('keydown', captureHandler, true);
	         document.removeEventListener('mousedown', cancelCapture, true);
	         document.addEventListener('keydown', captureHandler, true);
	         document.addEventListener('mousedown', cancelCapture, true);
	     });

	     条目.appendChild(标签);
	     条目.appendChild(输入框);
	     热键容器.appendChild(条目);
	 });

	 document.getElementById('方向键大小滑块').oninput = function() { document.getElementById('方向键大小值').textContent = `${this.value}vmin`; };
	 document.getElementById('移动速度滑块').oninput = function() { document.getElementById('移动速度值').textContent = `${this.value}ms`; };
	 document.getElementById('相机视野滑块').oninput = function() { document.getElementById('相机视野值').textContent = this.value; };
	 document.getElementById('小地图大小滑块').oninput = function() { document.getElementById('小地图大小值').textContent = this.value > 0 ? `${this.value}px` : '隐藏'; };
	 document.getElementById('显示方向键切换').onclick = function() { this.classList.toggle('active'); };
	 document.getElementById('手机模式切换').onclick = function() { this.classList.toggle('active'); };
	 document.getElementById('动画模式切换').onclick = function() { document.getElementById('受伤击退切换').classList.toggle('active',!this.classList.contains('active'));
	 this.classList.toggle('active'); }
	 document.getElementById('文本模式切换').onclick = function() { this.classList.toggle('active'); };
	 document.getElementById('受伤击退切换').onclick = function() { this.classList.toggle('active'); };
	 document.getElementById('禁用点击寻路切换').onclick = function() { this.classList.toggle('active'); };
}

function 保存并应用设置() {
	 document.querySelectorAll('.热键输入').forEach(input => {
		 let valueToSave = input.value;
		 if (valueToSave.toLowerCase() === 'space') {
			 valueToSave = ' ';
		 }
	     游戏设置.热键绑定[input.dataset.action] = valueToSave;
	 });
	
	 游戏设置.方向键大小 = parseInt(document.getElementById('方向键大小滑块').value);
	 游戏设置.移动速度 = parseInt(document.getElementById('移动速度滑块').value);
	 游戏设置.相机视野大小 = parseInt(document.getElementById('相机视野滑块').value);
	 游戏设置.小地图大小 = parseInt(document.getElementById('小地图大小滑块').value);
	 
	 游戏设置.显示方向键 = document.getElementById('显示方向键切换').classList.contains('active');
	 游戏设置.禁用点击移动 = document.getElementById('禁用点击寻路切换').classList.contains('active');
	 游戏设置.手机模式 = document.getElementById('手机模式切换').classList.contains('active');
	 游戏设置.动画模式 = document.getElementById('动画模式切换').classList.contains('active');
	 游戏设置.文本模式 = document.getElementById('文本模式切换').classList.contains('active');
	 游戏设置.受伤时击退 = document.getElementById('受伤击退切换').classList.contains('active');
	
	 localStorage.setItem('ChineseDungeonSettings', JSON.stringify(游戏设置));
	 
	 应用所有设置();
	
	 显示通知("设置已保存！", "成功");
	 关闭设置窗口();
}

function 应用所有设置() {
	 Object.keys(功能键映射).forEach(key => delete 功能键映射[key]);
	 Object.entries(游戏设置.热键绑定).forEach(([action, key]) => {
	     const actionMap = {
	         '装备槽1': () => 使用装备槽物品(当前装备页 * 装备栏每页装备数 + 1),
	         '装备槽2': () => 使用装备槽物品(当前装备页 * 装备栏每页装备数 + 2),
	         '装备槽3': () => 使用装备槽物品(当前装备页 * 装备栏每页装备数 + 3),
	         '装备槽4': () => 使用装备槽物品(当前装备页 * 装备栏每页装备数 + 4),
	         '装备槽5': () => 使用装备槽物品(当前装备页 * 装备栏每页装备数 + 5),
	         '装备槽6': () => 使用装备槽物品(当前装备页 * 装备栏每页装备数 + 6),
	         '装备槽7': () => 使用装备槽物品(当前装备页 * 装备栏每页装备数 + 7),
	         '切换HUD': () => 处理HUD切换按钮点击(),
	         '背包': () => { 界面可见性.背包 = !界面可见性.背包; 切换背包显示(); },
	         '日志': 切换日志显示,
	         '互动': 尝试互动,
	         '导出存档': 导出存档,
'传送菜单': () => 打开传送菜单(),
	         '装备页上一页': () => 切换装备页(-1),
	         '装备页下一页': () => 切换装备页(1),
	         '自杀': 玩家死亡,
	         '重置关卡': 重置创意关卡,
'配方书': () => 打开配方书(),
	     };
	     if (actionMap[action]) {
	         功能键映射[key.toLowerCase()] = actionMap[action];
	     }
	 });
	document.body.classList.toggle('手机模式启用', 游戏设置.手机模式);
	document.body.classList.toggle('方向键隐藏', !游戏设置.显示方向键);
	 document.querySelectorAll('.directional-btn').forEach(btn => {
	 btn.style.width = `${游戏设置.方向键大小}vmin`;
	 btn.style.height = `${游戏设置.方向键大小}vmin`;
	 btn.style.borderRadius = `${游戏设置.方向键大小 / 4}vmin`;
	 btn.style.fontSize = `${游戏设置.方向键大小 / 3}vmin`;
	});
	 
	 const 小地图容器 = document.getElementById('小地图容器');
	 const 小地图 = document.getElementById('小地图');
	 if (游戏设置.小地图大小 > 0) {
	     小地图容器.style.display = 'block';
	     小地图.style.width = `${游戏设置.小地图大小}px`;
	     小地图.style.height = `${游戏设置.小地图大小}px`;
	 } else {
	     小地图容器.style.display = 'none';
	 }
	
	 切换动画 = 游戏设置.动画模式;
	
	 if (中文模式 !== 游戏设置.文本模式) {
	     切换中文模式();
	 }
	 
	 相机显示边长 = 游戏设置.相机视野大小;
	 移动间隔 = 游戏设置.移动速度;
	
	 初始化canvas();
	 更新视口();
	 绘制小地图();
	 绘制();
}

function 关闭设置窗口() {
	 document.querySelectorAll('.热键输入.capturing').forEach(input => {
	     input.value = 游戏设置.热键绑定[input.dataset.action];
	     input.classList.remove('capturing');
	 });
	 const 遮罩 = document.getElementById("设置窗口遮罩");
	 遮罩.classList.remove('显示');
	 setTimeout(() => {
	     遮罩.style.display = "none";
	 }, 300);
	 if (游戏状态 === "游戏中" || 游戏状态 === "编辑器游玩" || 游戏状态 === "图鉴" || 游戏状态 === "地图编辑器") {
        玩家属性.允许移动--;
        玩家属性.允许移动 = Math.max(0, 玩家属性.允许移动);
    }
}

