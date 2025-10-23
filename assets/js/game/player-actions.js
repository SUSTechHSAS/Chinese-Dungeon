// Player action functions (waiting, resting, inventory)

function 玩家等待(是否由休息调用 = false) {
	if (玩家属性.允许移动 > 0 || 死亡界面已显示) {
		if (是否由休息调用) 停止休息();
		return;
	}
	if (!是否由休息调用) {
		移动历史.push('等待');
	}
	处理回合逻辑();
	更新视口();
	//绘制();
}

function 开始休息() {
	if (玩家正在休息 || 玩家属性.允许移动 > 0 || 死亡界面已显示) return;
	玩家正在休息 = true;
	显示通知("开始休息...", "信息");

	const 休息逻辑 = () => {
		if (!玩家正在休息) return;
		玩家等待(true);
		休息定时器 = setTimeout(休息逻辑, 移动间隔);
	};

	休息逻辑();
}

function 停止休息() {
	if (休息定时器) {
		clearTimeout(休息定时器);
		休息定时器 = null;
	}
	玩家正在休息 = false;
}

function 整理背包() {
	const 物品数组 = [...玩家背包.values()].filter(item => !item.是否隐藏);
	
	物品数组.sort((a, b) => {
		if (b.品质 !== a.品质) {
			return b.品质 - a.品质;
		}
		return 0; 
	});

	const 隐藏物品 = [...玩家背包.values()].filter(item => item.是否隐藏);

	玩家背包.clear();
	更新背包显示();

	物品数组.forEach(item => 玩家背包.set(item.唯一标识, item));
	隐藏物品.forEach(item => 玩家背包.set(item.唯一标识, item));
	更新背包显示()
	显示通知("背包已整理！", "成功");
}

// Export to window
window.玩家等待 = 玩家等待;
window.开始休息 = 开始休息;
window.停止休息 = 停止休息;
window.整理背包 = 整理背包;
