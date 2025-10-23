function 导出存档() {
			    if (是否为教程层) {
			        显示通知("不支持在教程关卡导出存档", "错误");
			        return;
			    }
			    if (游戏状态 === "图鉴") {
			        显示通知("不支持在图鉴导出存档", "错误");
			        return;
			    }
			    if (是否是自定义关卡) {
			        显示通知("不支持在创意关卡导出存档", "错误");
			        return;
			    }
			    if (游戏状态 === "地图编辑器" || 游戏状态 === "编辑器游玩") {
			    显示通知("不支持在地图编辑器导出存档", "错误");
			        return;
			    }
			    if (游戏状态 === "地图编辑器" || 游戏状态 === "死亡界面" || 游戏状态==="胜利"||游戏状态==="图鉴选择") return;
			    玩家属性.允许移动 -= 1;
			
			    const 存档字符串 = 保存游戏状态(); // 调用只返回字符串的版本
			    玩家属性.允许移动 += 1;
			    if (存档字符串) {
			        const 数据块 = new Blob([存档字符串], {
			            type: "application/json",
			        });
			        const 下载链接 = URL.createObjectURL(数据块);
			        const 链接元素 = document.createElement("a");
			        链接元素.href = 下载链接;
			        // 文件名包含日期和时间戳
			        const 时间戳 = new Date()
			            .toISOString()
			            .replace(/[:.]/g, "-");
			        链接元素.download = `中文地牢存档_${时间戳}.json`;
			        document.body.appendChild(链接元素);
			        链接元素.click(); // 模拟点击下载
			        document.body.removeChild(链接元素); // 清理 DOM
			        URL.revokeObjectURL(下载链接); // 释放对象 URL
			        显示通知("存档已导出为文件。", "成功"); // 导出成功提示
			    } else {
			        显示通知("导出存档失败！", "错误"); // 保存失败时提示
			    }
			}

function 导入存档(存档字符串) {
			    try {
			        const 存档数据 = JSON.parse(存档字符串);
					if (!开发者模式) {
			
			        if (存档数据.isPublished) {
			            显示通知("无法通过此按钮加载已发布的创意关卡！", "错误");
			            return;
			        }
			
			        if (Object.keys(存档数据.编辑器状态数据).length!==0) {
			            显示通知("无法通过此按钮加载地图编辑器文件！", "错误");
			            return;
			        }
				}
			
			        if (存档数据 && 存档数据.版本) {
			            if (存档数据.版本 === 存档版本) {
			                启动游戏(存档数据);
			                if(已初始化 > 0) 初始化装备系统()
			                if(已初始化 > 0) 初始化背包事件监听()
			                if(已初始化 > 0) 动画帧();
			            } else {
			                显示通知("存档版本不匹配！", "错误");
			            }
			        } else {
			            显示通知("存档数据无效或缺少版本信息！", "错误");
			        }
			    } catch (错误) {
			        console.error("导入存档失败:", 错误);
			        显示通知("导入存档失败，数据格式错误或损坏！", "错误");
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

