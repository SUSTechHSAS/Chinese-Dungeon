// Editor brush and fill functions

function 油漆桶填充(x, y, 新背景类型) {
	if (x < 0 || x >= 地牢大小 || y < 0 || y >= 地牢大小) return;

	const 原始背景类型 = 地牢[y][x].背景类型;
	if (原始背景类型 === 新背景类型) return;
	saveEditorState();

	const 队列 = [{x, y}];
	const 已访问 = new Set([`${x},${y}`]);

	while (队列.length > 0) {
		const 当前 = 队列.shift();
		
		if(新背景类型===单元格类型.墙壁) 重置单元格(当前.x, 当前.y);
		地牢[当前.y][当前.x].背景类型 = 新背景类型;
		

		const 方向 = [{dx: 0, dy: -1}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 1, dy: 0}];
		for (const {dx, dy} of 方向) {
			const 邻居X = 当前.x + dx;
			const 邻居Y = 当前.y + dy;
			const 邻居键 = `${邻居X},${邻居Y}`;
			if (邻居X >= 0 && 邻居X < 地牢大小 && 邻居Y >= 0 && 邻居Y < 地牢大小 &&
				地牢[邻居Y][邻居X].背景类型 === 原始背景类型 && !已访问.has(邻居键)) {
				已访问.add(邻居键);
				队列.push({x: 邻居X, y: 邻居Y});
			}
		}
	}
	生成墙壁();
	//绘制();
	
}

function 笔刷绘制(中心X, 中心Y) {
	if (!编辑器状态.当前选中 || 编辑器状态.当前选中.类型 !== '背景') return;
	//saveEditorState();

	const 尺寸 = 编辑器状态.笔刷半径;
	const 形状 = 编辑器状态.笔刷形状;
	const 新背景类型 = 编辑器状态.当前选中.绘制类型;

	const 左 = 中心X - 尺寸 + 1;
	const 右 = 中心X + 尺寸 - 1;
	const 上 = 中心Y - 尺寸 + 1;
	const 下 = 中心Y + 尺寸 - 1;

	for (let y = 上; y <= 下; y++) {
		for (let x = 左; x <= 右; x++) {
			if (x < 0 || x >= 地牢大小 || y < 0 || y >= 地牢大小) continue;

			let 在范围内 = false;
			if (形状 === '圆形') {
				const dx = x - 中心X;
				const dy = y - 中心Y;
				if (dx * dx + dy * dy < 尺寸 * 尺寸) {
					在范围内 = true;
				}
			} else {
				在范围内 = true;
			}
			
			if (在范围内) {
				if(新背景类型===单元格类型.墙壁) 重置单元格(x, y);
				地牢[y][x].背景类型 = 新背景类型;
				
			}
		}
	}

	//生成墙壁();
	//绘制();
}

// Export to window
window.油漆桶填充 = 油漆桶填充;
window.笔刷绘制 = 笔刷绘制;
