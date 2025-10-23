function 切换日志显示() {
			    日志面板可见 = !日志面板可见;
			    const 按钮 = document.querySelector(
			        "#设置菜单 button:nth-child(1)"
			    ); 
			    if (日志面板可见) {
			        document.querySelector(".日志面板").classList.add("可见");
			        按钮.textContent = "关闭日志界面"; 
			    } else {
			        document
			            .querySelector(".日志面板")
			            .classList.remove("可见");
			        按钮.textContent = "打开日志界面"; 
			    }
			}

