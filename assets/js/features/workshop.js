async function 导入创意关卡(存档字符串) {
			    try {
			        const 存档数据 = JSON.parse(存档字符串);
			        if (!存档数据.isPublished) {
			            显示通知("这不是一个已发布的创意关卡文件！", "错误");
			            return false;
			        }
			
			        // --- 验证签名开始 ---
			        const 接收到的签名 = 存档数据.signature;
			        if (!接收到的签名) {
			            显示通知("加载失败：关卡文件缺少签名，可能已损坏或来自旧版本。", "错误");
			            return false;
			        }
			
			        delete 存档数据.signature; // 从数据中移除签名以进行校验
			        const 待验证数据字符串 = JSON.stringify(存档数据);
			        const 预期签名 = await 生成签名(待验证数据字符串);
			
			        if (接收到的签名 !== 预期签名) {
			            显示通知("加载失败：关卡文件已被篡改或已损坏！", "错误");
			            return false;
			        }
			        // --- 验证签名结束 ---
			
			        
			        if (存档数据.游戏版本 && 存档数据.游戏版本 > 游戏版本) {
			    显示通知(`存档版本 (${存档数据.游戏版本}) 高于当前游戏版本 (${游戏版本})，无法加载！`, "错误");
			    显示主菜单();
			    return false;
			}
			        启动游戏(存档数据, true);
			        当前关卡存档数据字符串 = 存档字符串;
			        if (存档数据.关卡标题) {
			            显示通知(`欢迎来到：${存档数据.关卡标题}`, "信息", true, 4000);
			        }
			        return true;
			    } catch (error) {
			        console.error("加载创意关卡时出错:", error);
			        显示通知("加载创意关卡失败，文件格式错误或数据损坏。", "错误");
			        return false;
			    }
			}

async function 初始化创意工坊() {
    try {
        const 创意关卡按钮 = document.getElementById('创意关卡按钮');
        const 文件输入 = document.getElementById('关卡文件输入');
        if (创意关卡按钮) {
            创意关卡按钮.onclick = () => window.显示创意关卡浏览器?.();
        }
        if (文件输入) {
            文件输入.addEventListener('change', async (事件) => {
                const 选择的文件 = 事件.target.files?.[0];
                if (!选择的文件) return;
                const 文件阅读器 = new FileReader();
                文件阅读器.onload = async (读取事件) => {
                    const 存档字符串 = 读取事件.target.result;
                    if (await 导入创意关卡(存档字符串)) { window.隐藏游戏模式选择?.(); }
                };
                文件阅读器.readAsText(选择的文件);
                事件.target.value = '';
            });
        }

        if (!window.supabase) {
            throw new Error('Supabase 客户端库未加载。');
        }
        const supabaseUrl = 'https://xazugujttgmudrtfvwrg.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhenVndWp0dGdtdWRydGZ2d3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NzIyNjksImV4cCI6MjA2ODI0ODI2OX0.ycWl0bdX0heyFTm4BJCL-1YpSYZI9uIiDzYwE5rivi4';
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

        const { error } = await supabase.from('levels').select('id').limit(1);
        if (error) throw new Error('数据库连接测试失败: ' + error.message);

        创意工坊已启用 = true;

        const 绑定 = (id, handler) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', handler);
        };
        绑定('返回游戏模式选择按钮', () => window.隐藏创意关卡浏览器?.());
        绑定('上传关卡按钮', () => window.上传关卡处理函数?.());
        绑定('搜索关卡按钮', () => window.刷新关卡列表?.());
        const 搜索输入 = document.getElementById('搜索关卡输入');
        if (搜索输入) 搜索输入.addEventListener('keypress', (e) => { if (e.key === 'Enter') window.刷新关卡列表?.(); });
        绑定('返回浏览器按钮', () => window.隐藏关卡详情?.());
    } catch (err) {
        创意工坊已启用 = false;
        console.warn('创意工坊初始化失败:', err?.message || err);
        window.显示通知?.('创意工坊功能不可用，已切换为本地模式。', '警告');
        const 创意关卡按钮 = document.getElementById('创意关卡按钮');
        const 文件输入 = document.getElementById('关卡文件输入');
        if (创意关卡按钮 && 文件输入) {
            创意关卡按钮.textContent = '加载本地创意关卡';
            创意关卡按钮.onclick = () => 文件输入.click();
        }
    }
}

