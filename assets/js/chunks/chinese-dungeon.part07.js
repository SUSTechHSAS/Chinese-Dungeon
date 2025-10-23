			
			    // --- 最终区域 ---
			    放置物品到单元格(
			        new 物品({ 名称: "绿色锁孔", 图标: "🟢", 能否拾起: false }),
			        27,
			        27
			    );
			    放置物品到单元格(
			        new 物品({ 名称: "蓝色锁孔", 图标: "🔵", 能否拾起: false }),
			        31,
			        27
			    );
			    放置物品到单元格(
			        new 物品({ 名称: "黄色锁孔", 图标: "🟡", 能否拾起: false }),
			        27,
			        31
			    );
			    放置物品到单元格(
			        new 物品({ 名称: "品红锁孔", 图标: "🟣", 能否拾起: false }),
			        31,
			        31
			    );
			
			    放置怪物到房间(
			        new 大魔法师({ 强化: true }),
			        获取房间("最终秘室")
			    );
			    放置物品到房间(
			        new 真言卷轴({ 强化: true, 已解锁: true }),
			        获取房间("最终秘室")
			    );
			
			    // =================================================
			    // 6. 最终设置
			    // =================================================
			    生成墙壁();
			    房间列表.forEach((房间) => 更新房间墙壁(房间));
			
			    const 起始房间 = 获取房间("中央大厅");
			    玩家初始位置.x = 起始房间.x + Math.floor(起始房间.w / 2);
			    玩家初始位置.y = 起始房间.y + Math.floor(起始房间.h / 2);
			    玩家.x = 玩家初始位置.x;
			    玩家.y = 玩家初始位置.y;
			    已访问房间.add(起始房间.id);
			
			    放置楼梯(
			        获取房间("最终秘室"),
			        楼梯图标.下楼,
			        单元格类型.楼梯下楼
			    );
			
			    更新视口();
			    更新界面状态()
			}
			
			function 生成迷宫怪物(数量) {
			    const 迷宫尺寸 = 85;
			    const 偏移X = Math.floor((地牢大小 - 迷宫尺寸) / 2);
			    const 偏移Y = Math.floor((地牢大小 - 迷宫尺寸) / 2);
			    const 怪物候选池 = 怪物池["普通房间"].filter(
			        (m) =>
			            m.最小层 <= 5 &&
			            m.类.name !== "米诺陶" &&
			            m.类.name !== "大魔法师"
			    );
			
			    if (怪物候选池.length === 0) return;
			
			    for (let i = 0; i < 数量; i++) {
			        let 放置成功 = false;
			        for (let 尝试 = 0; 尝试 < 50; 尝试++) {
			            const x = 偏移X + Math.floor(prng() * 迷宫尺寸);
			            const y = 偏移Y + Math.floor(prng() * 迷宫尺寸);
			
			            if (
			                地牢[y]?.[x]?.背景类型 === 单元格类型.走廊 &&
			                !地牢[y][x].关联物品 &&
			                !地牢[y][x].关联怪物
			            ) {
			                const 距离玩家 =
			                    Math.abs(x - 玩家.x) + Math.abs(y - 玩家.y);
			                if (距离玩家 > 15) {
			                    const 怪物配置 =
			                        怪物候选池[
			                            Math.floor(
			                                prng() * 怪物候选池.length
			                            )
			                        ];
			                    const 新怪物 = new 怪物配置.类({
			                        强化: prng() < 0.3,
			                    });
			                    if (放置怪物到单元格(新怪物, x, y)) {
			                        新怪物.状态 = 怪物状态.活跃;
			                        新怪物.绘制血条();
			                        放置成功 = true;
			                        break;
			                    }
			                }
			            }
			        }
			    }
			}
			function 生成迷宫关卡() {
			    当前层数 = 5;
			    地牢 = Array(地牢大小)
			        .fill()
			        .map((_, y) =>
			            Array(地牢大小)
			                .fill()
			                .map((_, x) => new 单元格(x, y))
			        );
			    房间列表 = [];
			    上锁房间列表 = [];
			    所有怪物 = [];
			    怪物状态表 = new WeakMap();
			    门实例列表 = new Map();
			    房间地图 = Array(地牢大小)
			        .fill()
			        .map(() => Array(地牢大小).fill(-1));
			    已访问房间 = new Set();
			    所有计时器 = [];
			    当前天气效果 = [];
			
			    const 迷宫网格尺寸 = 43;
			    const 通道宽度 = 2;
			    const 迷宫尺寸 = 迷宫网格尺寸 * 通道宽度;
			    const 迷宫X偏移 = Math.floor((地牢大小 - 迷宫尺寸) / 2);
			    const 迷宫Y偏移 = Math.floor((地牢大小 - 迷宫尺寸) / 2);
			
			    let 迷宫网格 = Array(迷宫网格尺寸)
			        .fill(1)
			        .map(() => Array(迷宫网格尺寸).fill(1));
			    let 堆栈 = [];
			    let 起始格子X = 1,
			        起始格子Y = 1;
			    迷宫网格[起始格子Y][起始格子X] = 0;
			    堆栈.push({ x: 起始格子X, y: 起始格子Y });
			
			    while (堆栈.length > 0) {
			        let 当前节点 = 堆栈.pop();
			        let 邻居列表 = [];
			        const 方向数组 = [
			            [0, 2],
			            [0, -2],
			            [2, 0],
			            [-2, 0],
			        ];
			        方向数组.sort(() => prng() - 0.5);
			
			        for (const [方向X, 方向Y] of 方向数组) {
			            const 新格子X = 当前节点.x + 方向X;
			            const 新格子Y = 当前节点.y + 方向Y;
			            if (
			                新格子X > 0 &&
			                新格子X < 迷宫网格尺寸 - 1 &&
			                新格子Y > 0 &&
			                新格子Y < 迷宫网格尺寸 - 1 &&
			                迷宫网格[新格子Y][新格子X] === 1
			            ) {
			                邻居列表.push({
			                    x: 新格子X,
			                    y: 新格子Y,
			                    墙壁X: 当前节点.x + 方向X / 2,
			                    墙壁Y: 当前节点.y + 方向Y / 2,
			                });
			            }
			        }
			
			        if (邻居列表.length > 0) {
			            堆栈.push(当前节点);
			            let 选定邻居 = 邻居列表[0];
			            迷宫网格[选定邻居.墙壁Y][选定邻居.墙壁X] = 0;
			            迷宫网格[选定邻居.y][选定邻居.x] = 0;
			            堆栈.push({ x: 选定邻居.x, y: 选定邻居.y });
			        }
			    }
			
			    for (let 格子Y = 0; 格子Y < 迷宫网格尺寸; 格子Y++) {
			        for (let 格子X = 0; 格子X < 迷宫网格尺寸; 格子X++) {
			            if (迷宫网格[格子Y][格子X] === 0) {
			                for (let 偏移Y = 0; 偏移Y < 通道宽度; 偏移Y++) {
			                    for (let 偏移X = 0; 偏移X < 通道宽度; 偏移X++) {
			                        const 最终X =
			                            格子X * 通道宽度 + 偏移X + 迷宫X偏移;
			                        const 最终Y =
			                            格子Y * 通道宽度 + 偏移Y + 迷宫Y偏移;
			                        if (地牢[最终Y]?.[最终X]) {
			                            地牢[最终Y][最终X].背景类型 =
			                                单元格类型.走廊;
			                        }
			                    }
			                }
			            }
			        }
			    }
			    生成墙壁();
			
			    玩家初始位置.x = 起始格子X * 通道宽度 + 迷宫X偏移;
			    玩家初始位置.y = 起始格子Y * 通道宽度 + 迷宫Y偏移;
			    玩家.x = 玩家初始位置.x;
			    玩家.y = 玩家初始位置.y;
			    已访问房间.add(-1);
			    放置楼梯(
			        { x: 玩家初始位置.x, y: 玩家初始位置.y, w: 2, h: 2 },
			        楼梯图标.上楼,
			        单元格类型.楼梯上楼
			    );
			    let 首领X, 首领Y;
			    let 首领已放置 = false;
			    for (
			        let 尝试次数 = 0;
			        尝试次数 < 100 && !首领已放置;
			        尝试次数++
			    ) {
			        let 格子X =
			            迷宫网格尺寸 - Math.floor(prng() * 5) - 2;
			        let 格子Y =
			            迷宫网格尺寸 - Math.floor(prng() * 5) - 2;
			        if (
			            格子X > 0 &&
			            格子Y > 0 &&
			            迷宫网格[格子Y][格子X] === 0
			        ) {
			            首领X = 格子X * 通道宽度 + 迷宫X偏移;
			            首领Y = 格子Y * 通道宽度 + 迷宫Y偏移;
			            if (
			                Math.abs(首领X - 玩家初始位置.x) +
			                    Math.abs(首领Y - 玩家初始位置.y) >
			                50
			            ) {
			                首领已放置 = true;
			            }
			        }
			    }
			    if (!首领已放置) {
			        首领X = (迷宫网格尺寸 - 2) * 通道宽度 + 迷宫X偏移;
			        首领Y = (迷宫网格尺寸 - 2) * 通道宽度 + 迷宫Y偏移;
			    }
			
			    const 首领 = new 米诺陶({ 强化: true });
			    放置怪物到单元格(首领, 首领X, 首领Y);
			    首领.状态 = 怪物状态.活跃;
			
			    const 物品数量 = 5 + Math.floor(prng() * 5);
			    const 可用物品池 = Object.values(物品池)
			        .flat()
			        .filter(
			            (i) =>
			                i.最小层 <= 5 &&
			                i.类.name !== "米诺陶" &&
			                i.类.name !== "大魔法师"
			        );
			
			    for (let i = 0; i < 物品数量; i++) {
			        let 物品X, 物品Y;
			        for (let 尝试次数 = 0; 尝试次数 < 50; 尝试次数++) {
			            const 格子X =
			                Math.floor(prng() * (迷宫网格尺寸 - 2)) + 1;
			            const 格子Y =
			                Math.floor(prng() * (迷宫网格尺寸 - 2)) + 1;
			            if (迷宫网格[格子Y][格子X] === 0) {
			                物品X = 格子X * 通道宽度 + 迷宫X偏移;
			                物品Y = 格子Y * 通道宽度 + 迷宫Y偏移;
			                if (位置是否可用(物品X, 物品Y, false)) {
			                    const 物品配置 =
			                        可用物品池[
			                            Math.floor(
			                                prng() * 可用物品池.length
			                            )
			                        ];
			                    if (物品配置.类.name !== "治疗药水") {
			                        放置物品到单元格(
			                            new 物品配置.类({
			                                强化: prng() < 0.2,
			                            }),
			                            物品X,
			                            物品Y
			                        );
			                        break;
			                    }
			                }
			            }
			        }
			    }
			
			    const 药水数量 = 4 + Math.floor(prng() * 3);
			    for (let i = 0; i < 药水数量; i++) {
			        let 药水X, 药水Y;
			        for (let 尝试次数 = 0; 尝试次数 < 50; 尝试次数++) {
			            const 格子X =
			                Math.floor(prng() * (迷宫网格尺寸 - 2)) + 1;
			            const 格子Y =
			                Math.floor(prng() * (迷宫网格尺寸 - 2)) + 1;
			            if (迷宫网格[格子Y][格子X] === 0) {
			                药水X = 格子X * 通道宽度 + 迷宫X偏移;
			                药水Y = 格子Y * 通道宽度 + 迷宫Y偏移;
			                if (位置是否可用(药水X, 药水Y, false)) {
			                    放置物品到单元格(
			                        new 治疗药水({ 强化: true }),
			                        药水X,
			                        药水Y
			                    );
			                    break;
			                }
			            }
			        }
			    }
			
			    生成迷宫怪物(15);
			
			    更新视口();
			    更新界面状态();
			    绘制();
			}
			function 生成迷宫出口(x, y) {
			    const 楼梯 = {
			        类型: "楼梯",
			        图标: 楼梯图标.下楼,
			        显示图标: 楼梯图标.下楼,
			        颜色索引: 颜色表.length,
			        使用: () => {
			            切换楼层(当前层数 + 1, false, null, true);
			        },
			        唯一标识: Symbol(`楼梯_下楼`),
			        获取名称: () => "下楼楼梯",
			        自定义数据: new Map(),
			        品质: 1,
			        能否拾起: false,
			        是否正常物品: false,
			        是否隐藏: false,
			        是否为隐藏物品: false,
			        效果描述: null,
			        已装备: false,
			        装备槽位: null,
			        堆叠数量: 1,
			        最大堆叠数量: 1,
			        颜色表: 颜色表,
			    };
			
			    if (位置是否可用(x, y, false)) {
			        放置物品到单元格(楼梯, x, y, 单元格类型.楼梯下楼);
			    } else {
			        切换楼层(当前层数 + 1, false, null, true);
			    }
			}
			function 检查房间连通性(房间) {
			    const 墙壁类型 = 单元格类型.墙壁;
			    const 地板类型 = 单元格类型.房间;
			
			    const 地板格子 = [];
			    for (let y = 房间.y; y < 房间.y + 房间.h; y++) {
			        for (let x = 房间.x; x < 房间.x + 房间.w; x++) {
			            if (地牢[y]?.[x]?.背景类型 === 地板类型) {
			                地板格子.push({ x, y });
			            }
			        }
			    }
			
			    if (地板格子.length === 0) return true;
			
			    const 起始点 = 地板格子[0];
			    const 队列 = [起始点];
			    const 已访问 = new Set([`${起始点.x},${起始点.y}`]);
			    let 可达计数 = 0;
			
			    while (队列.length > 0) {
			        const 当前 = 队列.shift();
			        可达计数++;
			
			        const 方向 = [
			            [0, 1],
			            [0, -1],
			            [1, 0],
			            [-1, 0],
			        ];
			        for (const [dx, dy] of 方向) {
			            const 邻居X = 当前.x + dx;
			            const 邻居Y = 当前.y + dy;
			            const 邻居键 = `${邻居X},${邻居Y}`;
			
			            if (
			                邻居X >= 房间.x &&
			                邻居X < 房间.x + 房间.w &&
			                邻居Y >= 房间.y &&
			                邻居Y < 房间.y + 房间.h &&
			                地牢[邻居Y]?.[邻居X]?.背景类型 === 地板类型 &&
			                !已访问.has(邻居键)
			            ) {
			                已访问.add(邻居键);
			                队列.push({ x: 邻居X, y: 邻居Y });
			            }
			        }
			    }
			
			    return 可达计数 === 地板格子.length;
			}
			
			function 生成符文圈群组(房间, 数量 = 1) {
			    for (let i = 0; i < 数量; i++) {
			        const 尺寸 = 2 + Math.floor(prng() * 2);
			        const 效果列表 = ["狂暴", "神龟", "缓慢", "中毒"];
			        // 为整个群组确定一个初始效果和周期
			        const 初始效果类型 =
			            效果列表[Math.floor(prng() * 效果列表.length)];
			        const 初始剩余周期 = Math.floor(prng() * 10);
			
			        let 放置成功 = false;
			        for (let 尝试 = 0; 尝试 < 20; 尝试++) {
			            const 起始X =
			                房间.x +
			                Math.floor(prng() * (房间.w - 尺寸));
			            const 起始Y =
			                房间.y +
			                Math.floor(prng() * (房间.h - 尺寸));
			
			            let 可以放置 = true;
			            for (let y = 起始Y; y < 起始Y + 尺寸; y++) {
			                for (let x = 起始X; x < 起始X + 尺寸; x++) {
			                    if (!位置是否可用(x, y, false)) {
			                        可以放置 = false;
			                        break;
			                    }
			                }
			                if (!可以放置) break;
			            }
			
			            if (可以放置) {
			                for (let y = 起始Y; y < 起始Y + 尺寸; y++) {
			                    for (let x = 起始X; x < 起始X + 尺寸; x++) {
			                        // 使用相同的初始效果和周期来创建符文圈
			                        放置物品到单元格(
			                            new 符文圈({
			                                效果类型: 初始效果类型,
			                                周期: 10,
			                                剩余周期: 初始剩余周期,
			                            }),
			                            x,
			                            y
			                        );
			                    }
			                }
			                放置成功 = true;
			                break;
			            }
			        }
			    }
			}
			
			function 生成法师图书馆() {
			    当前层数 = 10;
			
			    地牢 = Array(地牢大小)
			        .fill()
			        .map((_, y) =>
			            Array(地牢大小)
			                .fill()
			                .map((_, x) => new 单元格(x, y))
			        );
			    房间列表 = [];
			    上锁房间列表 = [];
			    所有怪物 = [];
			    怪物状态表 = new WeakMap();
			    门实例列表 = new Map();
			    房间地图 = Array(地牢大小)
			        .fill()
			        .map(() => Array(地牢大小).fill(-1));
			    已访问房间 = new Set();
			    所有计时器 = [];
			    当前天气效果 = [];
			
			    const 房间布局 = [
			        {
			            名称: "中央大厅",
			            id: 0,
			            x: 45,
			            y: 45,
			            w: 11,
			            h: 11,
			            门: [],
			        },
			        {
			            名称: "火焰之径",
			            id: 1,
			            x: 58,
			            y: 48,
			            w: 20,
			            h: 5,
			            门: [],
			        },
			        {
			            名称: "火焰宝库",
			            id: 2,
			            x: 80,
			            y: 48,
			            w: 7,
			            h: 7,
			            门: [],
			        },
			        {
			            名称: "冰霜书库",
			            id: 3,
			            x: 47,
			            y: 15,
			            w: 7,
			            h: 25,
			            门: [],
			        },
			        {
			            名称: "冰霜宝库",
			            id: 4,
			            x: 48,
			            y: 5,
			            w: 7,
			            h: 7,
			            门: [],
			        },
			        {
			            名称: "奥术回廊",
			            id: 5,
			            x: 22,
			            y: 48,
			            w: 21,
			            h: 5,
			            门: [],
			        },
			        {
			            名称: "奥术宝库",
			            id: 6,
			            x: 13,
			            y: 48,
			            w: 7,
			            h: 7,
			            门: [],
			        },
			        {
			            名称: "剧毒档案室",
			            id: 7,
			            x: 48,
			            y: 58,
			            w: 5,
			            h: 11,
			            门: [],
			        },
			        {
			            名称: "剧毒宝库",
			            id: 8,
			            x: 48,
			            y: 71,
			            w: 7,
			            h: 7,
			            门: [],
			        },
			        {
			            名称: "最终秘室",
			            id: 9,
			            x: 60,
			            y: 10,
			            w: 15,
			            h: 15,
			            门: [],
			        },
			    ];
			    房间列表 = 房间布局;
			    房间列表.forEach((房间配置) => 放置房间(房间配置));
			
			    const 获取房间 = (名称) =>
			        房间列表.find((r) => r.名称 === 名称);
			    let 已连接房间对 = new Set();
			    const 连接并生成走廊 = (房A, 房B) => {
			        const 房间A = 获取房间(房A);
			        const 房间B = 获取房间(房B);
			        if (!房间A || !房间B) return;
			        const 房间对ID = [房间A.id, 房间B.id].sort().join("-");
			        if (已连接房间对.has(房间对ID)) return;
			        const 路径 = 连接房间(房间A, 房间B);
			        if (路径) {
			            生成走廊(路径);
			            已连接房间对.add(房间对ID);
			        }
			    };
			
			    连接并生成走廊("中央大厅", "火焰之径");
			    连接并生成走廊("火焰之径", "火焰宝库");
			    连接并生成走廊("中央大厅", "冰霜书库");
			    连接并生成走廊("冰霜书库", "冰霜宝库");
			    连接并生成走廊("中央大厅", "奥术回廊");
			    连接并生成走廊("奥术回廊", "奥术宝库");
			    连接并生成走廊("中央大厅", "剧毒档案室");
			    连接并生成走廊("剧毒档案室", "剧毒宝库");
			    放置楼梯(
			        获取房间("中央大厅"),
			        楼梯图标.上楼,
			        单元格类型.楼梯上楼
			    );
			
			    for (let i = 0; i < 3; i++)
			        放置物品到房间(new 书架({}), 获取房间("中央大厅"));
			    for (let i = 0; i < 3; i++)
			        放置怪物到房间(
			            new 伪装怪物({ 伪装成: "书架" }),
			            获取房间("中央大厅")
			        );
			    for (let i = 0; i < 4; i++)
			        放置物品到房间(new 神秘商人({}), 获取房间("中央大厅"));
			
			    const 火焰房间 = 获取房间("火焰之径");
			    for (let i = 0; i < 15; i++)
			        放置物品到房间(new 火焰物品({ 倒计时: 99999 }), 火焰房间);
			    for (let i = 0; i < 3; i++)
			        放置怪物到房间(new 炸弹怪物({ 强化: true }), 火焰房间);
			    放置物品到房间(
			        new 魔法水晶({
			            水晶ID: "火焰",
			            颜色索引: 4,
			            管辖房间: ["火焰之径", "火焰宝库"],
			        }),
			        获取房间("火焰宝库")
			    );
			
			    const 冰霜房间 = 获取房间("冰霜书库");
			    let 冰霜连通 = false;
			    let 冰霜尝试 = 0;
			    do {
			        for (let y = 冰霜房间.y; y < 冰霜房间.y + 冰霜房间.h; y++) {
			            for (
			                let x = 冰霜房间.x;
			                x < 冰霜房间.x + 冰霜房间.w;
			                x++
			            ) {
			                地牢[y][x].背景类型 = 单元格类型.房间;
			            }
			        }
			        for (let y = 冰霜房间.y; y < 冰霜房间.y + 冰霜房间.h; y++) {
			            for (
			                let x = 冰霜房间.x;
			                x < 冰霜房间.x + 冰霜房间.w;
			                x++
			            ) {
			                if (prng() < 0.3)
			                    地牢[y][x].背景类型 = 单元格类型.墙壁;
			            }
			        }
			        冰霜连通 = 检查房间连通性(冰霜房间);
			        冰霜尝试++;
			    } while (!冰霜连通 && 冰霜尝试 < 1000);
			
			    for (let i = 0; i < 4; i++)
			        放置怪物到房间(new 冰冻怪物({ 强化: true }), 冰霜房间);
			    for (let i = 0; i < 3; i++)
			        放置怪物到房间(new 盗贼怪物({ 强化: true }), 冰霜房间);
			    放置物品到房间(
			        new 魔法水晶({
			            水晶ID: "冰霜",
			            颜色索引: 1,
			            管辖房间: ["冰霜书库", "冰霜宝库"],
			        }),
			        获取房间("冰霜宝库")
			    );
			
			    const 奥术房间 = 获取房间("奥术回廊");
			    放置怪物到房间(new 瞬移怪物({ 强化: true }), 奥术房间);
			    for (let i = 0; i < 3; i++)
			        放置怪物到房间(new 召唤师怪物({ 强化: true }), 奥术房间);
			    放置物品到房间(
			        new 魔法水晶({
			            水晶ID: "奥术",
			            颜色索引: 3,
			            管辖房间: ["奥术回廊", "奥术宝库"],
			        }),
			        获取房间("奥术宝库")
			    );
			
			    const 剧毒房间 = 获取房间("剧毒档案室");
			    for (let i = 0; i < 8; i++)
			        放置物品到房间(new 毒液物品({ 倒计时: 99999 }), 剧毒房间);
			    for (let i = 0; i < 5; i++)
			        放置怪物到房间(new 腐蚀怪物({ 强化: true }), 剧毒房间);
			    放置怪物到房间(new 剧毒云雾怪物({ 强化: true }), 剧毒房间);
			    放置物品到房间(
			        new 魔法水晶({
			            水晶ID: "剧毒",
			            颜色索引: 0,
			            管辖房间: ["剧毒档案室", "剧毒宝库"],
			        }),
			        获取房间("剧毒宝库")
			    );
			
			    const 最终房间 = 获取房间("最终秘室");
			    let boss房连通 = false;
			    let boss房尝试 = 0;
			    do {
			        for (let y = 最终房间.y; y < 最终房间.y + 最终房间.h; y++) {
			            for (
			                let x = 最终房间.x;
			                x < 最终房间.x + 最终房间.w;
			                x++
			            ) {
			                地牢[y][x].背景类型 = 单元格类型.房间;
			            }
			        }
			        const 墙体数量 = 4 + Math.round(prng() * 4);
			        for (let i = 0; i < 墙体数量; i++) {
			            const isHorizontal = prng() < 0.5;
			            const 墙体长度 =
			                2 + Math.floor(prng() * (最终房间.w - 3));
			            if (isHorizontal) {
			                const y =
			                    最终房间.y +
			                    Math.floor(prng() * 最终房间.h);
			                const xStart =
			                    最终房间.x +
			                    Math.floor(
			                        prng() * (最终房间.w - 墙体长度)
			                    );
			                for (let x = xStart; x < xStart + 墙体长度; x++) {
			                    if (地牢[y]?.[x])
			                        地牢[y][x].背景类型 = 单元格类型.墙壁;
			                }
			            } else {
			                const x =
			                    最终房间.x +
			                    Math.floor(prng() * 最终房间.w);
			                const yStart =
			                    最终房间.y +
			                    Math.floor(
			                        prng() * (最终房间.h - 墙体长度)
			                    );
			                for (let y = yStart; y < yStart + 墙体长度; y++) {
			                    if (地牢[y]?.[x])
			                        地牢[y][x].背景类型 = 单元格类型.墙壁;
			                }
			            }
			        }
			        boss房连通 = 检查房间连通性(最终房间);
			        boss房尝试++;
			    } while (!boss房连通 && boss房尝试 < 2000);
			
			    生成墙壁();
			    房间列表.forEach((房间) => 更新房间墙壁(房间));
			
			    生成符文圈群组(最终房间, 3);
			    放置怪物到房间(new 大魔法师({ 强化: true }), 最终房间);
			
			    const 起始房间 = 获取房间("中央大厅");
			    玩家初始位置.x = 起始房间.x + Math.floor(起始房间.w / 2);
			    玩家初始位置.y = 起始房间.y + Math.floor(起始房间.h / 2);
			    玩家.x = 玩家初始位置.x;
			    玩家.y = 玩家初始位置.y;
			    已访问房间.add(起始房间.id);
			
			    更新视口();
			    更新界面状态();
			    绘制();
			}
			
			function 检查所有水晶状态() {
			    let 已摧毁数量 = 0;
			    for (const row of 地牢) {
			        for (const cell of row) {
			            if (
			                cell.关联物品 instanceof 魔法水晶 &&
			                cell.关联物品.自定义数据.get("已摧毁")
			            ) {
			                已摧毁数量++;
			            }
			        }
			    }
			    if (已摧毁数量 >= 4) {
			        生成最终传送门();
			    }
			}
			
			function 生成最终传送门() {
			    const 中心大厅 = 房间列表.find((r) => r.名称 === "中央大厅");
			    const 最终秘室 = 房间列表.find((r) => r.名称 === "最终秘室");
			    if (中心大厅 && 最终秘室) {
			        const 传送门 = new 折跃门({
			            目标房间: 最终秘室,
			            是否为隐藏物品: false,
			        });
			        放置物品到房间(
			            传送门,
			            中心大厅,
			            单元格类型.物品,
			            false,
			            true
			        );
			        显示通知(
			            "一股强大的魔法能量汇聚在中央大厅，开启了一道传送门！",
			            "成功"
			        );
			    }
			}
			function 显示自定义确认对话框(message, onConfirm) {
			    if (document.querySelector('.确认对话框遮罩')) return;
			
			    const 确认遮罩 = document.createElement("div");
			    确认遮罩.className = "确认对话框遮罩";
			    确认遮罩.innerHTML = `
			        <div class="确认对话框">
			            <h3>确认操作</h3>
			            <p>${message.replace(/\n/g, '<br>')}</p>
			            <div class="确认按钮容器">
			                <button class="确认按钮 确认按钮-确认">确认</button>
			                <button class="确认按钮 确认按钮-取消">取消</button>
			            </div>
			        </div>
			    `;
			    document.body.appendChild(确认遮罩);
			
			    const closeDialog = () => {
			        确认遮罩.style.opacity = '0';
			        setTimeout(() => 确认遮罩.remove(), 300);
			    };
			
			    确认遮罩.querySelector(".确认按钮-确认").onclick = () => {
			        closeDialog();
			        if (typeof onConfirm === 'function') {
			            onConfirm();
			        }
			    };
			    确认遮罩.querySelector(".确认按钮-取消").onclick = closeDialog;
			}
			            function 生成最终首领楼层() {
			    地牢 = Array(地牢大小).fill().map((_, y) => Array(地牢大小).fill().map((_, x) => new 单元格(x, y)));
			    房间列表 = [];
			    上锁房间列表 = [];
			    所有怪物 = [];
			    怪物状态表 = new WeakMap();
			    门实例列表 = new Map();
			    房间地图 = Array(地牢大小).fill().map(() => Array(地牢大小).fill(-1));
			    已访问房间 = new Set();
			    所有计时器 = [];
			    当前天气效果 = [];
			
			    const 补给房配置 = [
			        { id: 0, x: 10, y: 48, w: 7, h: 7, 门: [] },
			        { id: 1, x: 20, y: 48, w: 7, h: 7, 门: [] },
			        { id: 2, x: 30, y: 48, w: 7, h: 7, 门: [] },
			    ];
			    补给房配置.forEach(config => {
			        房间列表.push(config);
			        放置房间(config);
			    });
			    房间列表.sort((a,b)=>a.id-b.id)
			
			    let 已连接房间对 = new Set();
			    const 连接并生成走廊 = (房间A, 房间B) => {
			        const 房间对ID = [房间A.id, 房间B.id].sort().join("-");
			        if (已连接房间对.has(房间对ID)) return;
			        const 路径 = 连接房间(房间A, 房间B);
			        if (路径) {
			            生成走廊(路径);
			            已连接房间对.add(房间对ID);
			        }
			    };
			
			    连接并生成走廊(房间列表[0], 房间列表[1]);
			    连接并生成走廊(房间列表[1], 房间列表[2]);
			
			    const 资源池 = [
			        new 嗜血战斧({ 强化: true }),
			        new 大师附魔卷轴({品质: 5}),
			        new 秘银锁甲({ 强化: true }),
			        new 重力锤({ 强化: true }),
			        new 陨石法杖({ 强化: true }),
			        new 充能魔杖({ 强化: true }),
			        new 守卫者盔甲({ 强化: true }),
			        
			        new 磨刀石({数据: {耐久: 10,原耐久:10}}),
			        new 能量药水({ 数量: 5, 强化: true }),
			        new 治疗药水({ 数量: 8, 强化: true }),
			        new 急救绷带({ 数量: 5, 强化: true }),
			        new 神龟药水({ 数量: 3, 强化: true }),
			        new 狂暴药水({ 数量: 3, 强化: true }),
			        new 时间卷轴({ 强化: true }),
			        new 潜行靴子({ 强化: true }),
			        new 金币({数量: 64}),
			    ];
			    资源池.sort(() => prng() - 0.5);
			    const 补给房列表 = [房间列表[0], 房间列表[1], 房间列表[2]];
			    const 放置物品数量 = 8; 
			    
			    for (let i = 0; i < 放置物品数量; i++) {
			        if (资源池.length === 0) break; 
			    
			        const 随机补给房 = 补给房列表[Math.floor(prng() * 补给房列表.length)];
			        const 待放置物品 = 资源池.pop();
			    
			        放置物品到房间(待放置物品, 随机补给房, 单元格类型.物品, false, true);
			    }
			    
			    const 小首领房坐标 = {x: 50, y: 80};
			    const 通往小首领的传送门 = new 传送门({ 数据: { 是否随机: false, 目标X: 小首领房坐标.x, 目标Y: 小首领房坐标.y-3 }});
			    放置物品到房间(通往小首领的传送门, 房间列表[Math.floor(prng()*3)]);
			
			    const 小首领房 = { id: 3, x: 45, y: 75, w: 11, h: 11, 门: [], 名称: "皇家卫队室" };
			    房间列表.push(小首领房);
			    放置房间(小首领房);
			    房间列表.sort((a,b)=>a.id-b.id)
			    const 小首领 = new 皇家守卫({ 强化: true, 基础生命值: 200, 独立:true, 掉落物:null,残血逃跑: false });
			    放置怪物到单元格(小首领, 50, 80);
			    小首领.状态 = 怪物状态.休眠;
			
			    小首领.受伤 = function(伤害, 来源 = null) {
			        const 原始方法 = 皇家守卫.prototype.受伤.bind(this);
			        原始方法(伤害, 来源);
			        if (this.当前生命值 <= 0) {
			            生成通往大首领的传送门(this.x, this.y);
			        }
			    };
			
			    const 大首领房坐标 = {x: 85, y: 50};
			    const 大首领房 = { id: 4, x: 80, y: 45, w: 17, h: 17, 门: [], 名称: "最终秘室" };
			    房间列表.push(大首领房);
			    放置房间(大首领房);
			    房间列表.sort((a,b)=>a.id-b.id)
			    const 大首领 = new 王座守护者({ });
			    放置怪物到单元格(大首领, 85, 50);
			    大首领.状态 = 怪物状态.休眠;
			    
			    
			
			    生成墙壁();
			    房间列表.forEach(房间 => 更新房间墙壁(房间));
			    
			    玩家初始位置.x = 房间列表[0].x + 3;
			    玩家初始位置.y = 房间列表[0].y + 3;
			    玩家.x = 玩家初始位置.x;
			    玩家.y = 玩家初始位置.y;
			    放置楼梯(
			        { x: 玩家初始位置.x, y: 玩家初始位置.y, w: 2, h: 2 },
			        楼梯图标.上楼,
			        单元格类型.楼梯上楼
			    );
			    已访问房间.add(0);
			
			    更新视口();
			    绘制();
			}
			
			function 生成通往大首领的传送门(x, y) {
			    const 传送门实例 = new 传送门({ 数据: { 是否随机: false, 目标X: 85, 目标Y: 47 }});
			    
			    let 放置成功 = false;
			    const 检查位置列表 = [
			        {dx: 0, dy: 0}, 
			        {dx: 0, dy: 1}, {dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: -1, dy: 0}, 
			        {dx: 1, dy: 1}, {dx: 1, dy: -1}, {dx: -1, dy: 1}, {dx: -1, dy: -1} 
			    ];
			
			    for(const 偏移 of 检查位置列表) {
			        const 目标X = x + 偏移.dx;
			        const 目标Y = y + 偏移.dy;
			        if (位置是否可用(目标X, 目标Y, false)) {
			            放置物品到单元格(传送门实例, 目标X, 目标Y);
			            显示通知("一个通往更深处的传送门出现了！", "成功");
			            放置成功 = true;
			            break;
			        }
			    }
			    
			    if (!放置成功) {
			         显示通知("无法生成传送门，周围没有合适的空间！", "错误");
			         玩家.x = 85
			         玩家.y = 47
			         
			    }
			}
			function 加载设置() {
			 const 已保存设置 = localStorage.getItem('ChineseDungeonSettings');
			 if (已保存设置) {
			     try {
			         const parsedSettings = JSON.parse(已保存设置);
			         for (const key in 游戏设置) {
			             if (parsedSettings.hasOwnProperty(key)) {
			                 if (typeof 游戏设置[key] === 'object' && !Array.isArray(游戏设置[key]) && 游戏设置[key] !== null) {
			                     Object.assign(游戏设置[key], parsedSettings[key]);
			                 } else {
			                     游戏设置[key] = parsedSettings[key];
			                 }
			             }
			         }
			     } catch(e) {
			         console.error("加载设置失败:", e);
			         localStorage.removeItem('ChineseDungeonSettings');
			     }
			 }
			 应用所有设置();
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
			         '传送菜单': 打开传送菜单,
			         '装备页上一页': () => 切换装备页(-1),
			         '装备页下一页': () => 切换装备页(1),
			         '自杀': 玩家死亡,
			         '重置关卡': 重置创意关卡,
			         '配方书': 打开配方书,
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
			
			
			const Q字形图案 = [
			 " XXXX ",
			 "X    X",
			 "X    X",
			 "X    X",
			 "X  XX ",
			 " XXX X"
			];
			
			function 检查Q字形彩蛋(丢弃X, 丢弃Y) {
			 if (彩蛋1触发) return;
			
			 for (let 模板行 = 0; 模板行 < Q字形图案.length; 模板行++) {
			     for (let 模板列 = 0; 模板列 < Q字形图案[模板行].length; 模板列++) {
			         if (Q字形图案[模板行][模板列] == 'X') {
			             const 左上角X = 丢弃X - 模板列;
			             const 左上角Y = 丢弃Y - 模板行;
			
			             let 完全匹配 = true;
			             const 匹配的格子 = [];
			
			             for (let r = 0; r < 6; r++) {
			                 for (let c = 0; c < 6; c++) {
			                     const 世界X = 左上角X + c;
			                     const 世界Y = 左上角Y + r;
			
			                     if (世界X < 0 || 世界X >= 地牢大小 || 世界Y < 0 || 世界Y >= 地牢大小) {
			                         完全匹配 = false;
			                         break;
			                     }
			
			                     const 单元格 = 地牢[世界Y]?.[世界X];
			                     const 模板字符 = Q字形图案[r][c];
			                     const 单元格有物品 = 单元格 && 单元格.关联物品 !== null && 单元格.关联物品.能否拾起 !== false;
			
			                     if ((模板字符 === 'X' && !单元格有物品) || (模板字符 === ' ' && 单元格有物品)) {
			                         完全匹配 = false;
			                         break;
			                     }
			                     if(单元格有物品) {
			                         匹配的格子.push({x: 世界X, y: 世界Y});
			                     }
			                 }
			                 if (!完全匹配) break;
			             }
			
			             if (完全匹配) {
			                 触发Q字形彩蛋(匹配的格子);
			                 return; 
			             }
			         }
			     }
			 }
			}
			
			function 触发Q字形彩蛋(格子列表) {
			 彩蛋1触发 = true;
			
			 setTimeout(() => {
			     
			     const 奖励物品 = new 时空罗盘({});
			     if (尝试收集物品(奖励物品, true)) {
			         计划显示格子特效(格子列表, "FFD700", 500);
			         显示通知("难道这是...'Q' for 'Quark'！？", "成功");
			     }
			     
			 }, 1000);
			}
			function 处理燃烧木质卷轴() {
			    const 待烧毁列表 = [];
			    [...玩家背包.values(), ...玩家装备.values()].forEach(物品 => {
			        if (物品 instanceof 卷轴类 && 物品.材质 === 材料.木质) {
			            待烧毁列表.push(物品.唯一标识);
			        }
			    });
			
			    if (待烧毁列表.length > 0) {
			        待烧毁列表.forEach(标识 => {
			            const 物品实例 = 玩家背包.get(标识);
			            if (物品实例) {
			                显示通知(`${物品实例.获取名称()} 被火焰烧毁了！`, "错误");
			                处理销毁物品(标识, true);
			            }
			        });
			        更新背包显示();
			        更新装备显示();
			        return true;
			    }
			    return false;
			}
			function 创建并播放物品移动动画(起始元素, 获取目标元素的函数) {
			if (typeof gsap === 'undefined') return;
			    if (!起始元素 || typeof 获取目标元素的函数 !== 'function') return;
			
			    const 图标元素 = 起始元素.querySelector('.物品图标');
			    if (!图标元素) return;
			
			    const 起始位置 = 图标元素.getBoundingClientRect();
			
			    const 飞行图标 = 图标元素.cloneNode(true);
			    飞行图标.style.cssText = `
			        position: fixed;
			        left: ${起始位置.left}px;
			        top: ${起始位置.top}px;
			        width: ${起始位置.width}px;
			        height: ${起始位置.height}px;
			        color: ${图标元素.style.color};
			        margin: 0;
			        z-index: 10010;
			        pointer-events: none;
			        opacity: 1;
			        transform-origin: center center;
			    `;
			    document.body.appendChild(飞行图标);
			
			    const 目标元素 = 获取目标元素的函数();
			    if (!目标元素) {
			        飞行图标.remove();
			        return;
			    }
			    
			    const 目标位置 = 目标元素.getBoundingClientRect();
			    
			    let 最终缩放比例 = 0.65;
			    const 目标物品元素 = 目标元素.querySelector('.物品条目');
			    if (目标物品元素) {
			         const 样式 = window.getComputedStyle(目标物品元素);
			         const 矩阵 = new DOMMatrixReadOnly(样式.transform);
			         最终缩放比例 = 矩阵.a;
			    }
			
			    const 目标中心X = 目标位置.left + 目标位置.width / 2;
			    const 目标中心Y = 目标位置.top + 目标位置.height / 2;
			
			    const 最终X = 目标中心X - (起始位置.width / 2) + 3;
			    const 最终Y = 目标中心Y - (起始位置.height / 2) + 7;
			
			    gsap.to(飞行图标, {
			        left: 最终X,
			        top: 最终Y,
			        scale: 最终缩放比例,
			        duration: 0.25,
			        ease: "power2.inOut",
			        onComplete: () => {
			gsap.to(飞行图标, {
			    opacity: 0,
			    duration: 0.05,
			    onComplete: () => {
			        飞行图标.remove();
			    }
			});
			        }
			    });
			}
			function 初始化随机数生成器(种子) {
			    let 当前种子 = 哈希字符串(种子.toString());
			    // 什么？你说不安全？
			    prng = () => {
			        当前种子 = (当前种子 * 9301 + 49297) % 233280;
			        return 当前种子 / 233280;
			    };
			}
			function 应用职业效果(职业) {
			    if (!职业) return;
			
			    const 职业数据 = {
			        '战士': {
			            攻击加成: 2,
			            初始物品: new 钢制长剑({ 不可破坏: true }),
			        },
			        '法师': {
			            初始能量加成: 20,
			            初始物品: new 橡木法杖({ 不可破坏: true }),
			        },
			        '忍者': {
			            移动步数: 2,
			            初始物品: new 剧毒匕首({ 不可破坏: true }),
			        },
			        '游侠': {
			            初始物品: new 穿云箭({ 不可破坏: true }),
			            额外效果: () => 初始玩家属性.透视 = true
			        },
			        '骑士': {
			            防御加成: 2,
			            初始物品: new 钢制板甲({ 不可破坏: true }),
			        },
			        '死灵': {
			            初始物品: new 死灵法杖({ 不可破坏: true }),
			        },
			    };
			
			    const 选定职业 = 职业数据[职业];
			    if (选定职业) {
			        if (选定职业.攻击加成) 初始玩家属性.攻击加成 = (初始玩家属性.攻击加成 || 0) + 选定职业.攻击加成;
			        if (选定职业.防御加成) 初始玩家属性.防御加成 = (初始玩家属性.防御加成 || 0) + 选定职业.防御加成;
			        if (选定职业.移动步数) 初始玩家属性.移动步数 = (初始玩家属性.移动步数 || 1) + 选定职业.移动步数 - 1;
			        if (选定职业.初始能量加成) 初始玩家属性.初始能量加成 = (初始玩家属性.初始能量加成 || 0) + 选定职业.初始能量加成;
			
			        if (选定职业.初始物品) {
			            尝试收集物品(选定职业.初始物品, true);
			        }
			        if (typeof 选定职业.额外效果 === 'function') {
			            选定职业.额外效果();
			        }
			
			        玩家属性 = { ...初始玩家属性 };
			    }
			}

			function 显示职业选择界面() {
			    const 遮罩 = document.getElementById("职业选择遮罩");
			    const 窗口 = document.getElementById("职业选择窗口");
			    const 选项容器 = document.getElementById("职业选项容器");
			    const 种子输入 = document.getElementById("游戏种子输入");
			    const 开始按钮 = document.getElementById("开始游戏自定义按钮");
			    const 返回按钮 = document.getElementById("返回模式选择按钮");
			    const 每日挑战按钮 = document.getElementById("每日挑战按钮");
			
			    隐藏游戏模式选择();
			
			    种子输入.value = '';
			    let 已选职业 = '战士';
			
			    const 职业列表 = {
			        '战士': { 图标: 图标映射.战士, 描述: '攻守兼备，勇往直前' },
			        '法师': { 图标: 图标映射.法师, 描述: '掌控元素，智慧超群' },
			        '忍者': { 图标: 图标映射.忍者, 描述: '身法迅捷，一击致命' },
			        '游侠': { 图标: 图标映射.游侠, 描述: '百步穿杨，洞察先机' },
			        '骑士': { 图标: 图标映射.骑士, 描述: '信仰坚定，守护队友' },
			        '死灵': { 图标: 图标映射.死灵, 描述: '驱使亡灵，玩弄生死' }
			    };
			
			    选项容器.innerHTML = '';
			    Object.entries(职业列表).forEach(([名称, 数据]) => {
			        const 按钮 = document.createElement('button');
			        按钮.className = '职业按钮';
			        按钮.dataset.职业 = 名称;
			        按钮.innerHTML = `<span class="职业图标">${数据.图标}</span><span class="职业名称">${名称}</span><small style="display: block; color: #888; margin-top: 5px;">${数据.描述}</small>`;
			        选项容器.appendChild(按钮);
			    });
			
			    const 职业按钮们 = 选项容器.querySelectorAll('.职业按钮');
			    
			    function 更新选中状态() {
			        const 容器中心 = 选项容器.offsetWidth / 2;
			        let 最近的按钮 = null;
			        let 最小距离 = Infinity;
			
			        职业按钮们.forEach(按钮 => {
			            const 按钮中心 = 按钮.offsetLeft - 选项容器.scrollLeft + 按钮.offsetWidth / 2;
			            const 距离 = Math.abs(容器中心 - 按钮中心);
			
			            if (距离 < 最小距离) {
			                最小距离 = 距离;
			                最近的按钮 = 按钮;
			            }
			        });
			
			        if (最近的按钮) {
			            职业按钮们.forEach(btn => btn.classList.remove('active'));
			            最近的按钮.classList.add('active');
			            已选职业 = 最近的按钮.dataset.职业;
			        }
			    }
			    选项容器.addEventListener('scrollend', 更新选中状态);
				let scrollTimeout = null;

选项容器.addEventListener('scroll', () => {
    选项容器.style.pointerEvents = 'none';
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        选项容器.style.pointerEvents = 'auto';
    }, 150);
}, { passive: true });

			
			    职业按钮们.forEach(按钮 => {
			        按钮.onclick = () => {
			            const 容器宽度 = 选项容器.offsetWidth;
			            const 按钮宽度 = 按钮.offsetWidth;
			            const 目标滚动位置 = 按钮.offsetLeft - (容器宽度 / 2) + (按钮宽度 / 2);

							选项容器.scrollTo({
			                left: 目标滚动位置,
							duration: 2,
			                behavior: 'smooth',
			            	});
							setTimeout(()=>{更新选中状态();},150)
						
						
			        };
			    });
			
			    每日挑战按钮.onclick = () => {
			        const 今天 = new Date();
			        const 年 = 今天.getFullYear();
			        const 月 = (今天.getMonth() + 1).toString().padStart(2, '0');
			        const 日 = 今天.getDate().toString().padStart(2, '0');
			        const 日期种子 = `${年}-${月}-${日}`;
			        种子输入.value = 日期种子;
			        if (typeof gsap !== 'undefined') {
			             gsap.fromTo(种子输入, { scale: 1.1, boxShadow: "0 0 15px rgba(76, 175, 80, 0.6)" }, { scale: 1, boxShadow: "0 0 0 rgba(76, 175, 80, 0)", duration: 0.5, ease: "elastic.out(1, 0.5)" });
			        }
			    };
			
			    开始按钮.onclick = () => {
			        const 种子 = 种子输入.value.trim();
			        隐藏职业选择界面(() => 启动游戏(null, false, 种子, 已选职业));
			    };
			
			    返回按钮.onclick = () => {
			        隐藏职业选择界面(显示游戏模式选择);
			    };
			
			    遮罩.style.display = 'flex';
			
			    if (typeof gsap !== 'undefined') {
			        gsap.fromTo(遮罩, {autoAlpha:0},{ autoAlpha: 1, duration: 0.3, ease: 'power2.out' });
			        
			        
			        gsap.fromTo(窗口, 
			            { 
			                y: '50vh', 
			                autoAlpha: 0, 
			                scale: 0.95,
			                duration: 0.1,
			            }, 
			            { 
			                y: '0vh', 
			                autoAlpha: 1, 
			                scale: 1,
			                duration: 0.5, 
			                ease: 'power2.out',
			                onStart: () => {
			                    遮罩.style.pointerEvents = 'auto';
			                    窗口.style.visibility = 'visible';
			                    窗口.style.transform = '';
			                    更新选中状态();
			                },
			                onComplete: () => {
			                    窗口.style.transform = '';
			                    
			                },
			            }
			        );
			    } else {
			        窗口.style.top = '50%';
			        窗口.style.left = '50%';
			        窗口.style.transform = 'translate(-50%, -50%) scale(1)';
			        窗口.style.opacity = '1';
			        窗口.style.visibility = 'visible';
			        遮罩.style.opacity = '1';
			        遮罩.style.pointerEvents = 'auto';
			        更新选中状态();
			    }
			}
			
			function 隐藏职业选择界面(回调函数) {
			    const 遮罩 = document.getElementById("职业选择遮罩");
			    const 窗口 = document.getElementById("职业选择窗口");
			    
			    遮罩.style.pointerEvents = 'none';
			
			    if (typeof gsap !== 'undefined') {
			        gsap.to(窗口, { 
			            y: '15vh', 
			            scale: 0.95, 
			            autoAlpha: 0,
			            duration: 0.3, 
			            ease: 'power2.in' 
			        });
			        gsap.to(遮罩, { 
			            autoAlpha: 0, 
			            duration: 0.2, 
			            ease: 'power2.in',
			            onComplete: () => {
			                遮罩.style.display = 'none';
			                if (typeof 回调函数 === 'function') {
			                    回调函数();
			                }
			            }
			        });
			    } else {
			        窗口.style.transform = 'translate(-50%, -50%) scale(0.95)';
			        窗口.style.opacity = '0';
			        窗口.style.visibility = 'hidden';
			        遮罩.style.opacity = '0';
			        setTimeout(() => {
			            遮罩.style.display = 'none';
			            if (typeof 回调函数 === 'function') {
			                回调函数();
			            }
			        }, 300);
			    }
			}

function 填充筛选器物品列表() {
    const a = 获取所有可用的定义();
    const allItems = a.items;
    const selectElement = document.getElementById('sifter-item-select');
    selectElement.innerHTML = ''; 

    const uniqueItems = new Map();
    allItems.forEach(itemDef => {
        try {
            const instance = new itemDef.类({});
            
            if (instance.是否正常物品 && !uniqueItems.has(instance.名称) && itemDef.最小层 !== undefined) {
                
                uniqueItems.set(instance.名称, itemDef);
            }
        } catch (e) {}
    });

    
    if (!uniqueItems.has('钥匙')) {
        
        uniqueItems.set('钥匙', { 最小层: 0 });
    }
    
    
    const sortedItems = Array.from(uniqueItems.entries()).sort((a, b) => a[0].localeCompare(b[0], 'zh-Hans-CN'));

    sortedItems.forEach(([name, itemDef]) => {
        const option = document.createElement('option');
        const minLevel = itemDef.最小层; 

        option.value = name;
        
        option.textContent = `${name} (层数 ≥ ${minLevel})`;
        selectElement.appendChild(option);
    });
}


function 打开种子筛选器窗口() {
    const 遮罩 = document.getElementById("种子筛选器遮罩");
    const 窗口 = document.getElementById("种子筛选器窗口");
    
    填充筛选器物品列表();

    document.getElementById('开始筛选按钮').style.display = 'block';
    document.getElementById('取消筛选按钮').style.display = 'none';
    document.getElementById('sifter-status').textContent = '准备就绪。';
    document.getElementById('sifter-level-input').disabled = false;
    document.getElementById('sifter-room-id-input').disabled = false;
    document.getElementById('sifter-item-select').disabled = false;

    遮罩.style.display = 'block';
    
}

function 关闭种子筛选器窗口() {
    isSifting = false; 
    const 遮罩 = document.getElementById("种子筛选器遮罩");
    const 窗口 = document.getElementById("种子筛选器窗口");

    if (!遮罩 || !窗口) return; 


        
        
        窗口.classList.add("关闭中");

        
        setTimeout(() => {
            遮罩.style.display = 'none';
            窗口.classList.remove("关闭中"); 
        }, 300); 
    
}

async function 开始筛选种子() {
    if (isSifting) return;

    const levelInput = document.getElementById('sifter-level-input');
    const roomInput = document.getElementById('sifter-room-id-input');
    const itemSelect = document.getElementById('sifter-item-select');
    const statusDisplay = document.getElementById('sifter-status');
    const startButton = document.getElementById('开始筛选按钮');
    const cancelButton = document.getElementById('取消筛选按钮');

    const criteria = {
        level: parseInt(levelInput.value),
        roomId: parseInt(roomInput.value),
        itemName: itemSelect.value,
    };

    if (isNaN(criteria.level) || isNaN(criteria.roomId) || !criteria.itemName) {
        statusDisplay.textContent = '错误：请输入有效的筛选条件。';
        return;
    }

    isSifting = true;
    let seedsChecked = 0;
    const maxChecks = 50000; 

    levelInput.disabled = true;
    roomInput.disabled = true;
    itemSelect.disabled = true;
    startButton.style.display = 'none';
    cancelButton.style.display = 'block';

    async function siftLoop() {
        if (!isSifting) {
            statusDisplay.textContent = '筛选已取消。';
            levelInput.disabled = false;
            roomInput.disabled = false;
            itemSelect.disabled = false;
            startButton.style.display = 'block';
            cancelButton.style.display = 'none';
            return;
        }

        if (seedsChecked >= maxChecks) {
            isSifting = false;
            statusDisplay.textContent = `已达到最大筛选次数 (${maxChecks})，未找到。`;
            levelInput.disabled = false;
            roomInput.disabled = false;
            itemSelect.disabled = false;
            startButton.style.display = 'block';
            cancelButton.style.display = 'none';
            return;
        }

        seedsChecked++;
        const currentSeed = Date.now().toString() + seedsChecked;
        
    statusDisplay.textContent = `筛选中... 已检查: ${seedsChecked} (种子: ${currentSeed})`;
        const found = await new Promise(resolve => {
            setTimeout(() => {
                resolve(虚拟生成并检查(currentSeed, criteria));
            }, 0);
        });

        if (found) {
            isSifting = false;
            document.getElementById('游戏种子输入').value = currentSeed;
            statusDisplay.innerHTML = `<b>找到种子: <span style="color:#4caf50">${currentSeed}</span></b><br>已自动填入种子输入框。`;
            levelInput.disabled = false;
            roomInput.disabled = false;
            itemSelect.disabled = false;
            startButton.style.display = 'block';
            cancelButton.style.display = 'none';
            setTimeout(关闭种子筛选器窗口, 2000);
        } else {
            siftLoop(); 
        }
    }
    siftLoop();
}

function 虚拟生成并检查(seed, criteria) {

    try {
        当前层数 = criteria.level
        初始化随机数生成器(seed);
        for (let i=0;i<当前层数;i++) prng()
        
        生成地牢();

        
        const targetRoom = 房间列表[criteria.roomId];
        if (!targetRoom) {
            return false; 
        }

        for (let y = targetRoom.y; y < targetRoom.y + targetRoom.h; y++) {
            for (let x = targetRoom.x; x < targetRoom.x + targetRoom.w; x++) {
                const cell = 地牢[y]?.[x];
                if (cell && cell.关联物品 instanceof window[criteria.itemName]) {
                    return true; 
                }
            }
        }
        
        return false; 

    } catch (e) {
        console.error(`Seed ${seed} generation failed:`, e);
        return false;
    } finally {
        
        地牢 = [];
        房间列表 = [];
        上锁房间列表 = [];
        所有怪物 = [];
        门实例列表 = new Map();
        房间地图 = Array(地牢大小).fill().map(() => Array(地牢大小).fill(-1));
        已访问房间 = new Set();
        所有计时器 = [];
        当前天气效果 = [];
        
    }
}
canvas.addEventListener('mousedown', (事件) => {
    if (事件.button === 1) {
		if (玩家属性.允许移动 > 0 || 死亡界面已显示 || (游戏状态 !== "游戏中" && 游戏状态 !== "编辑器游玩" && 游戏状态 !== "图鉴")) {
        return;
    }
        事件.preventDefault();
        尝试互动();
    }
});
canvas.addEventListener('wheel', (事件) => {
    
    if (玩家属性.允许移动 > 0 || 死亡界面已显示 || (游戏状态 !== "游戏中" && 游戏状态 !== "编辑器游玩" && 游戏状态 !== "图鉴" && 游戏状态 !== "地图编辑器")) {
        return;
    }
    if (游戏状态 === '地图编辑器') {
        事件.preventDefault(); // 阻止页面滚动

        // 仅当笔刷工具激活时才调整大小
        if (编辑器状态.笔刷模式 === '笔刷') {
            const 尺寸滑块 = document.getElementById('笔刷尺寸滑块');
            if (尺寸滑块) {
                // Math.sign(事件.deltaY) 会根据滚轮方向返回 -1 (上) 或 1 (下)
                let newValue = parseInt(尺寸滑块.value) - Math.sign(事件.deltaY);
                
                // 确保新值在滑块的允许范围内
                const min = parseInt(尺寸滑块.min);
                const max = parseInt(尺寸滑块.max);
                newValue = Math.max(min, Math.min(newValue, max));
                
                // 更新滑块值并触发input事件以同步UI和状态
                尺寸滑块.value = newValue;
                尺寸滑块.dispatchEvent(new Event('input'));
            }
        }
        return; // 结束函数，不执行下面的玩家移动逻辑
    }
    事件.preventDefault(); 

    const 画布矩形 = canvas.getBoundingClientRect();
    const 鼠标横坐标 = 事件.clientX - 画布矩形.left;
    const 鼠标纵坐标 = 事件.clientY - 画布矩形.top;
    
    const 目标格子横坐标 = Math.floor(当前相机X + 鼠标横坐标 / 单元格大小);
    const 目标格子纵坐标 = Math.floor(当前相机Y + 鼠标纵坐标 / 单元格大小);
    
    if (目标格子横坐标 === 玩家.x && 目标格子纵坐标 === 玩家.y) {
        return;
    }
    const 目标向量横 = 目标格子横坐标 - 玩家.x;
    const 目标向量纵 = 目标格子纵坐标 - 玩家.y;

    let 移动向量横 = 0;
    let 移动向量纵 = 0;
    if (Math.abs(目标向量纵) > 0) { 
        移动向量纵 = Math.sign(目标向量纵);
        
        if (游戏状态 !== "地图编辑器" && !检查移动可行性(玩家.x, 玩家.y, 玩家.x, 玩家.y + 移动向量纵)) {
             
             if (Math.abs(目标向量横) > 0) {
                 移动向量横 = Math.sign(目标向量横);
                 移动向量纵 = 0; 
             } else {
                 移动向量纵 = 0; 
             }
        }
    } else if (Math.abs(目标向量横) > 0) { 
        移动向量横 = Math.sign(目标向量横);
    }
    
    
    if (事件.deltaY < 0) { 
        移动向量横 = -移动向量横;
        移动向量纵 = -移动向量纵;
    }

    if (移动向量横 !== 0 || 移动向量纵 !== 0) {
        移动玩家(移动向量横, 移动向量纵);
    }
}, { passive: false }); // 设置passive为false以允许preventDefault生效


    const sifterButton = document.getElementById('种子筛选器按钮');
    if (sifterButton) {
        sifterButton.addEventListener('click', 打开种子筛选器窗口);
    }

    const closeSifterButton = document.getElementById('关闭筛选器按钮');
    if (closeSifterButton) {
        closeSifterButton.addEventListener('click', 关闭种子筛选器窗口);
    }

    const startSiftingButton = document.getElementById('开始筛选按钮');
    if (startSiftingButton) {
        startSiftingButton.addEventListener('click', 开始筛选种子);
    }

    const cancelSiftingButton = document.getElementById('取消筛选按钮');
    if (cancelSiftingButton) {
        cancelSiftingButton.addEventListener('click', () => { isSifting = false; });
    }


function 生成洞穴地牢() {
    //console.log("开始生成洞穴地牢...");
    地牢大小 = 100 + 当前层数 * 2;
    地牢 = Array(地牢大小).fill().map((_, y) => Array(地牢大小).fill().map((_, x) => new 单元格(x, y)));
    房间列表 = [];
    上锁房间列表 = [];
    所有怪物 = [];
    门实例列表 = new Map();
    房间地图 = Array(地牢大小).fill().map(() => Array(地牢大小).fill(-1));
    已访问房间 = new Set();
    所有计时器 = [];
    当前天气效果 = [];

    初始化洞穴地图(0.45+0.05*prng());
    for (let i = 0; i < 5; i++) {
        执行元细胞自动机迭代();
    }

    const { 主洞穴, 所有洞穴 } = 处理洞穴连通性();
    if (!主洞穴) {
        console.error("未能生成有效的洞穴区域，将退回默认生成器。");
        地牢生成方式 = 'default';
        return 生成地牢();
    }

    //console.log("生成评分图并放置出入口...");
    let 评分图 = 生成评分图('entry');
    const { 入口, 出口 } = 放置地牢出入口(评分图, 主洞穴);
    玩家初始位置.x = 入口.x;
		    玩家初始位置.y = 入口.y;
		
		    if (当前层数 > 0) {
		        const 上楼梯位置 = 寻找可放置位置(玩家初始位置.x, 玩家初始位置.y);
		        if (上楼梯位置) {
		            放置物品到单元格(创建楼梯实例('上楼'), 上楼梯位置.x, 上楼梯位置.y, 单元格类型.楼梯上楼);
		        } else {
		            放置物品到单元格(创建楼梯实例('上楼'), 玩家初始位置.x, 玩家初始位置.y, 单元格类型.楼梯上楼);
		        }
		    }
    放置物品到单元格(创建楼梯实例('下楼'), 出口.x, 出口.y, 单元格类型.楼梯下楼);

    //console.log("放置物品...");
    for (let i = 0; i < 10 + 当前层数 * 2; i++) {
        const x = 主洞穴[Math.floor(prng() * 主洞穴.length)].x;
        const y = 主洞穴[Math.floor(prng() * 主洞穴.length)].y;
        if (位置是否可用(x, y, false)) {
            放置物品到单元格(new 金币({ 数量: 1 + Math.floor(prng() * 10) }), x, y);
        }
    }
    评分图 = 生成评分图('corner', { 已放置点: [入口, 出口] });
    使用评分图放置物品(评分图, 主洞穴, '普通物品');
    评分图 = 生成评分图('entry', { 已放置点: [入口, 出口] });
    使用评分图放置物品(评分图, 主洞穴, '特殊物品');

    //console.log("放置怪物和陷阱...");
    评分图 = 生成评分图('monster', { 已放置点: [入口, 出口] });
    使用评分图放置物品(评分图, 主洞穴, '怪物');
    评分图 = 生成评分图('trap', { 已放置点: [入口, 出口, ...所有怪物.map(m => ({x: m.x, y: m.y}))] });
    使用评分图放置物品(评分图, 主洞穴, '陷阱');

    生成并放置洞穴配方卷轴(地牢,当前层数);
    
   
    const fakeRoomForTraps = { id: -1, x: 0, y: 0, w: 100 + 当前层数 * 2, h: 100 + 当前层数 * 2,类型:'房间' };
    let t = Math.ceil(prng()*(当前层数+1)*2)
    for (let i=0;i<t;i++) {
        生成毒气陷阱群(fakeRoomForTraps);
    }
    
    生成墙壁();
    更新视口();
    已访问房间.add(-1);
    更新界面状态();
    //console.log("洞穴地牢生成完毕。");
    return true;
}
function 生成并放置洞穴配方卷轴(洞穴区域, 层数) {
    if (层数 === null || 层数 < 0 || 是否为教程层) {
        return;
    }

    const 卷轴数量 = 1 + Math.floor(prng() * 层数);
    let 成功放置数量 = 0;

    for (let i = 0; i < 卷轴数量; i++) {
        const 新配方 = 生成单个随机融合配方(层数);

        if (新配方) {
            const 配方物品 = new 配方卷轴({
                recipeData: 新配方,
                层数: 层数,
            });

            let 放置成功 = false;
            for (let 尝试 = 0; 尝试 < 50; 尝试++) {
                const x=Math.floor(prng() * (100 + 层数 * 2));
                const y=Math.floor(prng() * (100 + 层数 * 2));

                if (位置是否可用(x, y, false)) {
                    if (放置物品到单元格(配方物品, x, y)) {
                        成功放置数量++;
                        放置成功 = true;
                        break;
                    }
                }
            }
        }
    }

    if (成功放置数量 > 0) {
        //console.log(`在洞穴中成功放置了 ${成功放置数量} 个配方卷轴。`);
    }
}

function 初始化洞穴地图(wallChance) {
    for (let y = 0; y < 地牢大小; y++) {
        for (let x = 0; x < 地牢大小; x++) {
            if (x === 0 || x === 地牢大小 - 1 || y === 0 || y === 地牢大小 - 1) {
                地牢[y][x].背景类型 = 单元格类型.墙壁; // 边界总是墙
            } else {
                地牢[y][x].背景类型 = (prng() < wallChance) ? 单元格类型.墙壁 : 单元格类型.走廊;
            }
        }
    }
}


function 执行元细胞自动机迭代() {
    const 新地牢 = 地牢.map(row => row.map(cell => new 单元格(cell.x, cell.y)));

    for (let y = 1; y < 地牢大小 - 1; y++) {
        for (let x = 1; x < 地牢大小 - 1; x++) {
            let 周围墙壁数 = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    if (地牢[y + dy][x + dx].背景类型 === 单元格类型.墙壁) {
                        周围墙壁数++;
                    }
                }
            }

            if (地牢[y][x].背景类型 === 单元格类型.墙壁) {
                
                新地牢[y][x].背景类型 = (周围墙壁数 < 4) ? 单元格类型.走廊 : 单元格类型.墙壁;
            } else {
                新地牢[y][x].背景类型 = (周围墙壁数 >= 5) ? 单元格类型.墙壁 : 单元格类型.走廊;
            }
        }
    }
    地牢 = 新地牢;
}

function 处理洞穴连通性() {
    const 所有洞穴 = 寻找所有连通区域(单元格类型.走廊);
    const 所有墙壁区域 = 寻找所有连通区域(单元格类型.墙壁);

    // 填充过小的空洞
    所有洞穴.forEach(洞穴 => {
        if (洞穴.length < 20) { // 小于20格的空洞直接填成墙
            洞穴.forEach(点 => {
                地牢[点.y][点.x].背景类型 = 单元格类型.墙壁;
            });
        }
    });
    
    // 重新寻找洞穴
    const 最终洞穴 = 寻找所有连通区域(单元格类型.走廊);
    if (最终洞穴.length === 0) return { 主洞穴: null, 所有洞穴: [] };

    最终洞穴.sort((a, b) => b.length - a.length);
    const 主洞穴 = 最终洞穴[0];

    // 连接次级洞穴到主洞穴
    for (let i = 1; i < 最终洞穴.length; i++) {
        连接两个洞穴(主洞穴, 最终洞穴[i]);
    }
    
    return { 主洞穴, 所有洞穴: 最终洞穴 };
}


function 寻找所有连通区域(目标类型) {
    const 区域列表 = [];
    const 已访问 = new Set();

    for (let y = 0; y < 地牢大小; y++) {
        for (let x = 0; x < 地牢大小; x++) {
            if (!已访问.has(`${x},${y}`) && 地牢[y][x].背景类型 === 目标类型) {
                const 新区域 = [];
                const 队列 = [{ x, y }];
                已访问.add(`${x},${y}`);

                while (队列.length > 0) {
                    const 当前 = 队列.shift();
                    新区域.push(当前);

                    const 方向 = [[0, 1], [0, -1], [1, 0], [-1, 0]];
                    for (const [dx, dy] of 方向) {
                        const 邻居X = 当前.x + dx;
                        const 邻居Y = 当前.y + dy;
                        const 邻居键 = `${邻居X},${邻居Y}`;

                        if (邻居X >= 0 && 邻居X < 地牢大小 && 邻居Y >= 0 && 邻居Y < 地牢大小 &&
                            !已访问.has(邻居键) && 地牢[邻居Y][邻居X].背景类型 === 目标类型) {
                            已访问.add(邻居键);
                            队列.push({ x: 邻居X, y: 邻居Y });
                        }
                    }
                }
                区域列表.push(新区域);
            }
        }
    }
    return 区域列表;
}

function 连接两个洞穴(洞穴A, 洞穴B) {
    let 最近点A = null, 最近点B = null;
    let 最短距离 = Infinity;

    // 暴力查找，对于生成阶段性能足够
    for (const 点A of 洞穴A) {
        for (const 点B of 洞穴B) {
            const 距离 = Math.pow(点A.x - 点B.x, 2) + Math.pow(点A.y - 点B.y, 2);
            if (距离 < 最短距离) {
                最短距离 = 距离;
                最近点A = 点A;
                最近点B = 点B;
            }
        }
    }

    if (最近点A && 最近点B) {
        const 路径 = 获取直线格子(最近点A.x, 最近点A.y, 最近点B.x, 最近点B.y);
        路径.forEach(点 => {
            // 挖出一条较粗的通道
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const tunnelX = 点.x + dx;
                    const tunnelY = 点.y + dy;
                    if (tunnelX >= 0 && tunnelX < 地牢大小 && tunnelY >= 0 && tunnelY < 地牢大小) {
                        地牢[tunnelY][tunnelX].背景类型 = 单元格类型.走廊;
                    }
                }
            }
        });
    }
}

function 生成评分图(criteria, options = {}) {
    const 评分图 = Array(地牢大小).fill().map(() => Array(地牢大小).fill(0));
    const { 已放置点 = [] } = options;

    for (let y = 0; y < 地牢大小; y++) {
        for (let x = 0; x < 地牢大小; x++) {
            if (地牢[y][x].背景类型 === 单元格类型.墙壁) continue;

            let score = 0;
            if (criteria === 'entry') {
                const radius = 4;
                for (let dy = -radius; dy <= radius; dy++) {
                    for (let dx = -radius; dx <= radius; dx++) {
                        if (地牢[y + dy]?.[x + dx]?.背景类型 === 单元格类型.墙壁) {
                            score++;
                        }
                    }
                }
            } else if (criteria === 'corner') {
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        if (地牢[y + dy]?.[x + dx]?.背景类型 === 单元格类型.墙壁) {
                            score++;
                        }
                    }
                }
            } else if (criteria === 'monster') {
                score = 10; // 基础分
                let openSpace = 0;
                for (let dy = -2; dy <= 2; dy++) {
                    for (let dx = -2; dx <= 2; dx++) {
                        if (地牢[y + dy]?.[x + dx]?.背景类型 !== 单元格类型.墙壁) {
                            openSpace++;
                        }
                    }
                }
                score += openSpace; // 越开阔分数越高
            } else if (criteria === 'trap') {
                let wallCount = 0, floorCount = 0;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (地牢[y + dy]?.[x + dx]?.背景类型 === 单元格类型.墙壁) wallCount++;
                        else floorCount++;
                    }
                }
                if (wallCount > 2 && wallCount < 7) score = 20; // 通道区域分数高
            }
            评分图[y][x] = score;
        }
    }

    // 降低已放置点周围的分数
    已放置点.forEach(点 => {
        for (let dy = -5; dy <= 5; dy++) {
            for (let dx = -5; dx <= 5; dx++) {
                if (评分图[点.y + dy]?.[点.x + dx]) {
                    评分图[点.y + dy][点.x + dx] = 0;
                }
            }
        }
    });
    return 评分图;
}

function 放置地牢出入口(评分图, 可用区域) {
    const 查找最高分点 = (图) => {
        let 最高分 = -1;
        let 候选点 = [];
        可用区域.forEach(点 => {
            const score = 图[点.y][点.x];
            if (score > 最高分) {
                最高分 = score;
                候选点 = [点];
            } else if (score === 最高分) {
                候选点.push(点);
            }
        });
        return 候选点[Math.floor(prng() * 候选点.length)];
    };

    const 入口 = 查找最高分点(评分图);
    
    // 清除入口周围分数
    for (let dy = -10; dy <= 10; dy++) {
        for (let dx = -10; dx <= 10; dx++) {
            if (评分图[入口.y + dy]?.[入口.x + dx]) {
                评分图[入口.y + dy][入口.x + dx] = 0;
            }
        }
    }

    // 寻找离入口最远的最高分点作为出口
    let 最高分 = -1;
    let 候选出口 = [];
    可用区域.forEach(点 => {
        const score = 评分图[点.y][点.x];
        if (score > 最高分) {
            最高分 = score;
            候选出口 = [点];
        } else if (score === 最高分) {
            候选出口.push(点);
        }
    });

    let 出口 = null;
    let 最大距离 = -1;
    候选出口.forEach(点 => {
        const 距离 = Math.pow(点.x - 入口.x, 2) + Math.pow(点.y - 入口.y, 2);
        if (距离 > 最大距离) {
            最大距离 = 距离;
            出口 = 点;
        }
    });

    return { 入口, 出口: 出口 || 候选出口[0] };
}
function 创建楼梯实例(类型) {
    const isDown = 类型 === '下楼';
    return {
        类型: "楼梯",
        图标: isDown ? 楼梯图标.下楼 : 楼梯图标.上楼,
        显示图标: isDown ? 楼梯图标.下楼 : 楼梯图标.上楼,
        颜色索引: 颜色表.length,
        使用: () => {
            切换楼层(当前层数 + (isDown ? 1 : -1), false, null, true);
        },
        唯一标识: Symbol(`楼梯_${类型}`),
        获取名称: () => isDown ? "下楼楼梯" : "上楼楼梯",
        自定义数据: new Map(),
        品质: 1, 能否拾起: false, 是否正常物品: false, 是否隐藏: false, 是否为隐藏物品: false,
        效果描述: null, 已装备: false, 装备槽位: null, 堆叠数量: 1, 最大堆叠数量: 1, 颜色表: 颜色表,
    };
}

function 使用评分图放置物品(评分图, 可用区域, 类型) {
    const 当前怪物池 = [];
    for (let i = 0; i <= 当前层数; i++) {
        if (怪物引入计划.has(i)) {
            怪物引入计划.get(i).forEach(怪物定义 => {
                if (!当前怪物池.some(m => m.类.name === 怪物定义.类.name)) {
                    当前怪物池.push(怪物定义);
                }
            });
        }
    }

    const 当前物品池 = Object.values(物品池).flat().filter(item => 当前层数 >= item.最小层);
    
    let 候选池 = [];
    let 放置数量 = 0;
    
    if (类型 === '特殊物品') {
        const 特殊物品池 = [物品祭坛, 耐久祭坛, 背包扩容祭坛, 神龛, 洗身砚, 重铸台, 神秘商人, 探险家];
        候选池 = 特殊物品池.map(cls => ({ 类: cls }));
        放置数量 = 3 + Math.floor(当前层数 / 3);
    } else if (类型 === '怪物') {
        候选池 = 当前怪物池.filter(m => m.类.name !== "大魔法师" && m.类.name !== "米诺陶");
        
        候选池.push({ 类: 巡逻怪物, 权重: 8 });
        
        放置数量 = 20 + 当前层数 * 3;
    } else if (类型 === '陷阱') {
         const 陷阱池 = [隐形落石陷阱, 隐形地刺陷阱, 召唤怪物陷阱, 隐形失明陷阱, 烈焰触发陷阱, 隐形虫洞陷阱];
         候选池 = 陷阱池.map(cls => ({ 类: cls }));
         放置数量 = 10 + 当前层数;
    } else if (类型 === '普通物品') {
        候选池 = 当前物品池.filter(item => {
            const temp = new item.类({});
            return temp.是否正常物品 && temp.类型 !== '工具' && temp.类型 !== 'NPC' && temp.类型 !== '祭坛';
        });
        放置数量 = 10 + Math.floor(当前层数 / 2);
    } else {
        return;
    }

    if (候选池.length === 0) return;

    for (let i = 0; i < 放置数量; i++) {
        let 最高分 = -1;
        let 候选点 = [];
        可用区域.forEach(点 => {
            const score = 评分图[点.y][点.x];
            if (score > 最高分) {
                最高分 = score;
                候选点 = [点];
            } else if (score === 最高分) {
                候选点.push(点);
            }
        });
        
        if (候选点.length === 0) break;

        const 放置点 = 候选点[Math.floor(prng() * 候选点.length)];
        
        const 选中配置 = 候选池[Math.floor(prng() * 候选池.length)];
        const 强化 = prng() < 0.1 + 当前层数 * 0.03;
        
        let 放置成功 = false;
        if (类型 === '怪物') {
            const 新怪物 = new 选中配置.类({ 强化:强化, 随机游走: (选中配置.类 === 巡逻怪物), x:放置点.x,y:放置点.y });
            if (当前层数 > 7 && prng() < 0.15 + (当前层数 - 7) * 0.1) {
                const 药水池 = [
                    { 类型: '一次性治疗', 值: 50 },
                    { 类型: '永久隐身'},
                    { 类型: '永久速度', 值: 1, 图标: 图标映射.飞毛腿 },
                    { 类型: '永久抗火', 图标: 图标映射.永久抗火 },
                    { 类型: '永久力量', 值: 5, 图标: 图标映射.永久力量 },
                    { 类型: '永久强化', 值: 10 },
                    { 类型: '永久抗毒', 图标: 图标映射.永久抗毒 },
                    { 类型: '永久解冻', 图标: 图标映射.永久解冻 },
                    { 类型: '自爆', 图标: 图标映射.炸弹 }
                ];
                新怪物.携带药水 = 药水池[Math.floor(prng() * 药水池.length)];
                if (新怪物.携带药水.类型 === '自爆') 新怪物.永久增益.push(新怪物.携带药水);
            }
            放置成功 = 放置怪物到单元格(新怪物, 放置点.x, 放置点.y);
            if(放置成功) 新怪物.状态 = 怪物状态.活跃;
        } else {
            const 实例 = new 选中配置.类({ 强化:强化, 随机游走: (选中配置.类 === 巡逻怪物), x:放置点.x,y:放置点.y });
            放置成功 = 放置物品到单元格(实例, 放置点.x, 放置点.y);
        }

        if (放置成功) {
            const 清除半径 = (类型 === '特殊物品' || 类型 === '陷阱') ? 8 : 4;
            for (let dy = -清除半径; dy <= 清除半径; dy++) {
                for (let dx = -清除半径; dx <= 清除半径; dx++) {
                    if (评分图[放置点.y + dy]?.[放置点.x + dx]) {
                        评分图[放置点.y + dy][放置点.x + dx] = 0;
                    }
                }
            }
        }
    }
}
			const 设置按钮_主菜单 = document.getElementById("设置按钮_主菜单");
			设置按钮_主菜单.addEventListener("click", 打开设置窗口);
			
			document.getElementById("关闭设置窗口按钮").addEventListener("click", 关闭设置窗口);
			document.getElementById("保存设置按钮").addEventListener("click", 保存并应用设置);
			加载设置();
			当前层数 = null;
			显示主菜单();
			注册全局类();
			setTimeout(() =>{初始化创意工坊()},500);
			document.getElementById("版本信息").textContent = `v${游戏版本}`;
			//进入教程层();
			//切换楼层(0);
			//更新背包显示();
			//更新界面状态();
			//动画帧(); // 启动动画循环
		
