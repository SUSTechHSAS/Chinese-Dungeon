// Utility helper functions

function 哈希字符串(str) {
    let hash = 0;
    if (!str || str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return Math.abs(hash);
}

function 种子伪随机数(seed) {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
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

// Export to window
if (typeof window !== 'undefined') {
    window.哈希字符串 = 哈希字符串;
    window.种子伪随机数 = 种子伪随机数;
    window.初始化随机数生成器 = 初始化随机数生成器;
    window.应用职业效果 = 应用职业效果;
}
