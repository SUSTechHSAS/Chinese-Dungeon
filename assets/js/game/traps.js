// Trap classes

class 陷阱基类 extends 物品 {
    constructor(配置 = {}) {
        // 先准备好数据
        const 基础数据 = {
            已触发: false,
            冷却回合: 3 + Math.floor(prng() * 2),
            冷却剩余: 0,
            ...配置.数据,
        };
    
        super({
            类型: "陷阱",
            能否拾起: true,
            是否正常物品: false,
            阻碍怪物: false,
            // 核心修改：在父类构造时就根据数据决定图标
            是否为隐藏物品: true,
            颜色索引:4,
            图标: 配置.激活后图标 || "V",
            ...配置,
            数据: 基础数据,
        });
        
        // 将激活后的图标也存入自定义数据，以便后续使用
        this.自定义数据.set('激活后图标', 配置.激活后图标 || "V");

        if(!所有计时器.some(t => t.唯一标识 === this.唯一标识)) {
        
        if (游戏状态 === '地图编辑器') {
            if (配置?.玩家放置) this.玩家放置=配置?.玩家放置
            return;
                
            }
            所有计时器.push(this);
        }
    }
    
    当被收集(进入者) {
        if (进入者 !== "玩家" || this.自定义数据.get("冷却剩余") > 0 || this.自定义数据.get("已发现")) return false;
        if (玩家.x!==this.x||玩家.y!==this.y) return false;

        
        const 首次触发 = !this.自定义数据.get("已触发");
        if (首次触发) {
            this.自定义数据.set("已触发", true);
            this.是否为隐藏物品 = false;
            this.图标 = this.自定义数据.get('激活后图标'); // 从数据中读取激活后的图标
            显示通知("你触发了一个陷阱！", "警告");
        }
        
        this.触发效果(进入者);
        
        this.自定义数据.set("冷却剩余", this.自定义数据.get("冷却回合"));
        计划显示格子特效([{ x: this.x, y: this.y }], "FF0000");
        绘制();

        return false; 
    }
    
    更新倒计时() {
        let 冷却 = this.自定义数据.get("冷却剩余");
        if (冷却 > 0) {
            this.自定义数据.set("冷却剩余", 冷却 - 1);
        }
    }
    
    触发效果(触发者) {
    }

    使用() { return false; }
}

class 隐形落石陷阱 extends 陷阱基类 {
    constructor(配置 = {}) {
        super({
            名称: "落石陷阱",
            激活后图标: 图标映射.落石,
            原图标: 图标映射.落石,
            品质: 2,
            效果描述: "从上方落下巨石造成伤害。",
            数据: {
                伤害: 15 + (配置.强化 ? 10 : 0),
            },
            ...配置,
        });
    }
    触发效果(触发者) {
        伤害玩家(this.自定义数据.get("伤害"), this.名称);
    }
}

class 隐形地刺陷阱 extends 陷阱基类 {
    constructor(配置 = {}) {
        super({
            名称: "地刺陷阱",
            激活后图标: 图标映射.地刺,
            原图标: 图标映射.地刺,
            品质: 2,
            效果描述: "锋利的地刺从地面穿出，造成伤害并使你减速。",
             数据: {
                伤害: 10 + (配置.强化 ? 5 : 0),
                减速回合: 3 + (配置.强化 ? 2 : 0),
            },
            ...配置,
        });
    }
    触发效果(触发者) {
        伤害玩家(this.自定义数据.get("伤害"), this.名称);
        new 状态效果("缓慢", 效果颜色编号映射[效果名称编号映射.缓慢], "慢", this.自定义数据.get("减速回合"));
    }
}

class 隐形毒气陷阱 extends 物品 {
    constructor(配置 = {}) {
        super({
            类型: "陷阱",
            名称: "隐形毒气陷阱",
            图标: "☠️",
            品质: 2,
            能否拾起: true,
            是否正常物品: false,
            阻碍怪物: false,
            是否为隐藏物品: true, 
            效果描述: "一个隐藏的毒气陷阱。",
            数据: {
                激活后图标: 图标映射.毒气,
                关联陷阱ID: 配置.关联陷阱ID || 0,
                中毒强度: 配置.中毒强度||(2 + (配置.强化 ? 1 : 0)),
                中毒持续: 5,
                强化: 配置.强化 || false,
            },
            
        });
        this.图标="☠️";
    }
    
    当被收集(进入者) {
        if (进入者 !== "玩家") return false;
        if (this.自定义数据.get('已触发') || 玩家.x!==this.x||玩家.y!==this.y) return false;
        this.自定义数据.set('已触发', true);
        
        const 强度 = this.自定义数据.get('中毒强度');
        const 持续 = this.自定义数据.get('中毒持续');
        new 状态效果("中毒", 效果颜色编号映射[效果名称编号映射.中毒], "☠️", 持续, null, null, null, 强度);
        添加日志("你踩中了隐藏的毒气陷阱！", "错误");
        
        const 陷阱ID = this.自定义数据.get('关联陷阱ID');
        if (陷阱ID!==undefined) {
            揭示并激活陷阱群(陷阱ID, this.自定义数据.get('中毒持续'), this.自定义数据.get('中毒强度'));
        }

        return false;
    }
    
    使用() { return false; }
}

class 隐形失明陷阱 extends 陷阱基类 {
    constructor(配置 = {}) {
        super({
            名称: "失明陷阱",
            激活后图标: 图标映射.失明,
            原图标: 图标映射.失明,
            品质: 3,
            效果描述: "触发后会暂时剥夺你的视野。",
             数据: {
                失明持续: 15 + (配置.强化 ? 10 : 0),
            },
            ...配置,
        });
    }
    触发效果(触发者) {
        new 状态效果("失明", "#333333", "👁️‍🗨️", this.自定义数据.get("失明持续"));
    }
}

class 召唤怪物陷阱 extends 陷阱基类 {
    constructor(配置 = {}) {
        super({
            名称: "召唤陷阱",
            激活后图标: 图标映射.召唤陷阱,
            原图标: 图标映射.召唤陷阱,
            品质: 3,
            效果描述: "一个不稳定的魔法阵，会召唤出地牢生物。",
            数据: {
               召唤数量: 配置.召唤数量 || (3 + (配置.强化 ? 3 : 0)),
               怪物层级: 配置.怪物层级 || 当前层数===-1 ? 3 : 当前层数,
            },
            ...配置,
        });
    }
    触发效果(触发者) {
        let 已召唤数量 = 0;
         for (let i = 0; i < this.自定义数据.get('召唤数量'); i++) {
            
            if (房间地图[this.y][this.x] && 房间地图[this.y][this.x] !== -1) {
                const 候选怪物 = 怪物池["普通房间"].filter(m => this.自定义数据.get('怪物层级') >= m.最小层 && m.类.name !== "大魔法师");
                if(候选怪物.length > 0) {
                   const 选中配置 = 候选怪物[Math.floor(prng() * 候选怪物.length)];
                   const 新怪物 = new 选中配置.类({强化: prng() < 0.2 + 当前层数 * 0.03, 状态: 怪物状态.活跃});
                   if(放置怪物到房间(新怪物, 房间列表.find(t=>t.id==房间地图[this.y][this.x]))) {
                       已召唤数量++;
                   }
                }
            } else {
                const 候选怪物 = 怪物池["普通房间"].filter(m => this.自定义数据.get('怪物层级') >= m.最小层 && m.类.name !== "巨人怪物" && m.类.name !== "蜈蚣怪物");
                if(候选怪物.length > 0) {
                   const 选中配置 = 候选怪物[Math.floor(prng() * 候选怪物.length)];
                   let 放置位置=寻找可放置位置(玩家.x,玩家.y);
                   const 新怪物 = new 选中配置.类({强化: prng() < 0.2 + 当前层数 * 0.03, 状态: 怪物状态.活跃,x:放置位置.x,y:放置位置.y});
                   if(放置怪物到单元格(新怪物,放置位置.x,放置位置.y)) {
                       已召唤数量++;
                   }
                }
            }
        }
         if (已召唤数量 > 0) {
            显示通知(`陷阱召唤了 ${已召唤数量} 只怪物！`, "警告");
        }
    }
}

class 烈焰触发陷阱 extends 陷阱基类 {
    constructor(配置 = {}) {
        super({
            名称: "烈焰陷阱",
            激活后图标: 图标映射.烈焰陷阱,
            原图标: 图标映射.烈焰陷阱,
            品质: 4,
            效果描述: "一个高温的符文，触发后会引燃整个房间。",
             数据: {
                引燃比例: 0.4 + (配置.强化 ? 0.2 : 0),
            },
            ...配置,
        });
    }
    触发效果(触发者) {
        const 房间ID = 房间地图[this.y]?.[this.x];
        
        let 房间 = 房间列表.find(t=>t.id==房间ID);
        if (!房间) {
            房间 = { id: -1, x: 玩家.x - 4, y: 玩家.y - 4, w: 8, h: 8, 类型:'房间'};
        }
        const 地板格子 = [];
        for(let y = 房间.y; y < 房间.y + 房间.h; y++){
            for(let x = 房间.x; x < 房间.x + 房间.w; x++){
                if(位置是否可用(x, y, false)) {
                    地板格子.push({x, y});
                }
            }
        }
        
        const 燃烧数量 = Math.floor(地板格子.length * this.自定义数据.get('引燃比例'));
        地板格子.sort(() => prng() - 0.5);
        
        for(let i=0; i < Math.min(燃烧数量, 地板格子.length); i++){
            const {x, y} = 地板格子[i];
            const 火焰 = new 火焰物品({强化: this.自定义数据.get('强化'),倒计时:9999});
            放置物品到单元格(火焰, x, y);
        }
        显示通知("周围燃起了熊熊大火！", "错误");
    }
}

class 隐形虫洞陷阱 extends 陷阱基类 {
    constructor(配置 = {}) {
        super({
            名称: "虫洞陷阱",
            激活后图标: 图标映射.虫洞,
            原图标: 图标映射.虫洞,
            品质: 4,
            效果描述: "不稳定的空间裂隙，会将你传送到一个固定的未知时空。",
            ...配置,
        });
    }
    
    触发效果(触发者) {
        // 检查陷阱是否已经决定了传送目标
        if (生存挑战激活) {
            return false;
        }
        if (!this.自定义数据.has('目标层数')) {
            // 第一次触发：决定目标楼层并保存
            let 可选层数 = 当前层数%5===4?[]:[当前层数 + 1]; 
            for (let i = 0; i < 当前层数; i++) {
                if (所有地牢层.has(i)) {
                    可选层数.push(i);
                }
            }
            const 目标层 = 可选层数[Math.floor(prng() * 可选层数.length)];
            this.自定义数据.set('目标层数', 目标层);
            // 此时不决定坐标，坐标将在楼层切换后决定
        }

        const 目标层数 = this.自定义数据.get('目标层数');
        let 目标坐标 = this.自定义数据.get('目标坐标'); // 可能是 null 或已保存的坐标

        if (目标层数 === undefined) {
            显示通知("虫洞的目标不稳定，传送失败！", "错误");
            this.自定义数据.set("冷却剩余", this.自定义数据.get("冷却回合"));
            return;
        }

        显示通知(`你被吸入了不稳定的虫洞！即将前往第 ${目标层数} 层...`, "警告", true);
        
        const 传送回调 = () => {
            let 最终目标坐标 = this.自定义数据.get('目标坐标');
            if (!最终目标坐标) {
                // 如果坐标未定（说明是第一次传送到新层）
                最终目标坐标 = this.寻找随机合法坐标(目标层数);
                this.自定义数据.set('目标坐标', 最终目标坐标);
            }
            // 手动修改玩家坐标
            玩家.x = 最终目标坐标.x;
            玩家.y = 最终目标坐标.y;

            // 更新视觉和逻辑
            更新视口();
            绘制();
            处理玩家着陆效果(玩家.x, 玩家.y, 玩家.x, 玩家.y);
        };
        
        setTimeout(() => {
            切换楼层(目标层数, false, null, false, 传送回调);
        }, 500);
    }

    寻找随机合法坐标(目标层数) {
        
        const 可用房间 = 房间列表.filter(r => r.类型 === '房间');
        
        if (可用房间.length > 0) {
            for (let 尝试 = 0; 尝试 < 50; 尝试++) {
                const 随机房间 = 可用房间[Math.floor(prng() * 可用房间.length)];
                if(!随机房间 || 上锁房间列表.some(r => r.id === 随机房间?.id)) continue;
                const x = 随机房间.x + Math.floor(prng() * 随机房间.w);
                const y = 随机房间.y + Math.floor(prng() * 随机房间.h);
                if (地牢[y]?.[x] && [单元格类型.房间, 单元格类型.走廊].includes(地牢[y][x].背景类型)) {
                    return { x, y };
                }
            }
        }

        for (let 尝试 = 0; 尝试 < 200; 尝试++) {
            const x = Math.floor(prng() * 地牢大小);
            const y = Math.floor(prng() * 地牢大小);
            if (地牢[y]?.[x] && [单元格类型.房间, 单元格类型.走廊].includes(地牢[y][x].背景类型)) {
                return {x, y};
            }
        }
        
        return { x: 玩家初始位置.x, y: 玩家初始位置.y };
    }

    获取提示() {
        let baseTip = super.获取提示();
        if (this.自定义数据.get("已触发")) {
             if (this.自定义数据.has('目标层数')) {
                const targetFloor = this.自定义数据.get('目标层数');
                baseTip += `\\n它似乎连接着第 ${targetFloor} 层。`;
            } else {
                baseTip += `\\n一个未知的空间连接。`;
            }
        }
        return baseTip;
    }
}

class 远射陷阱 extends 怪物 {
     constructor(配置 = {}) {
        if (prng()<0.15) 配置.强化 = true;
        super({
            图标: 图标映射.远射陷阱,
            类型: "远射陷阱",
            基础生命值: 80 + (配置.强化 ? 40 : 0),
            基础攻击力: 3 + (配置.强化 ? 3 : 0),
            移动率: 0, 
            掉落概率: 0,
            基础攻击范围: 8,
            跟踪距离: 12,
            攻击冷却: 3 + (配置.强化 ? 1 : 0),
            ...配置,
        });
        this.状态 = 怪物状态.活跃; 
    }
    
    尝试移动() { return; }

                
    尝试攻击() {
        if (this.攻击冷却回合剩余 > 0) {
            this.攻击冷却回合剩余--;
            return false;
        }
        if (!已访问房间.has(房间地图[this.y][this.x]) && 房间地图[this.y][this.x]!==-1) {
            return false;
        }
        if(快速直线检查(this.x, this.y, 玩家.x, 玩家.y, this.攻击范围)) {
            const 路径 = 获取直线路径(this.x, this.y, 玩家.x, 玩家.y);
            if(路径 && 路径.length > 1) {
                计划显示格子特效(路径.slice(1), "FF8C00");
                伤害玩家(this.攻击力, this.类型);
                this.攻击冷却回合剩余 = this.攻击冷却;


                const 击退距离 = 1 + (this.强化 ? 1 : 0);
                const dx = 玩家.x - this.x;
                const dy = 玩家.y - this.y;
                let 方向DX = 0, 方向DY = 0;

                if(Math.abs(dx) > Math.abs(dy)){
                    方向DX = Math.sign(dx);
                } else {
                    方向DY = Math.sign(dy);
                }

                if (方向DX !== 0 || 方向DY !== 0) {
                    let 最终X = 玩家.x;
                    let 最终Y = 玩家.y;

                    for(let i=1; i <= 击退距离; i++) {
                        const 尝试X = 玩家.x + 方向DX * i;
                        const 尝试Y = 玩家.y + 方向DY * i;
                        if(检查移动可行性(最终X, 最终Y, 尝试X, 尝试Y, true)) {
                            最终X = 尝试X;
                            最终Y = 尝试Y;
                        } else {
                            break;
                        }
                    }

                    if(最终X !== 玩家.x || 最终Y !== 玩家.y) {
                        const 旧玩家X = 玩家.x;
                        const 旧玩家Y = 玩家.y;
                        玩家.x = 最终X;
                        玩家.y = 最终Y;
                        处理玩家着陆效果(旧玩家X, 旧玩家Y, 玩家.x, 玩家.y);

                        添加日志(`你被 ${this.类型} 击退了！`, "警告");
                        绘制();
                    }
                }


                return true;
            }
        }
        return false;
    }
}

// Export to window
if (typeof window !== 'undefined') {
    window.陷阱基类 = 陷阱基类;
    window.隐形落石陷阱 = 隐形落石陷阱;
    window.隐形地刺陷阱 = 隐形地刺陷阱;
    window.隐形毒气陷阱 = 隐形毒气陷阱;
    window.隐形失明陷阱 = 隐形失明陷阱;
    window.召唤怪物陷阱 = 召唤怪物陷阱;
    window.烈焰触发陷阱 = 烈焰触发陷阱;
    window.隐形虫洞陷阱 = 隐形虫洞陷阱;
    window.远射陷阱 = 远射陷阱;
}
