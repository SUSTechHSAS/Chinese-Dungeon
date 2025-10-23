			function handleCanvasTouchStart(e) {
				e.preventDefault();
				const touch = e.touches[0];
				touchStartX = touch.clientX;
				touchStartY = touch.clientY;
				touchCurrentX = touch.clientX;
				touchCurrentY = touch.clientY;
				touchStartTime = Date.now();
				if(游戏状态 !== '地图编辑器') {
					isSwiping = true;

					const rect = canvas.getBoundingClientRect();
					const touchX = touch.clientX - rect.left;
					const touchY = touch.clientY - rect.top;
					const 单元格X = Math.floor(当前相机X + touchX / 单元格大小);
					const 单元格Y = Math.floor(当前相机Y + touchY / 单元格大小);

					if (单元格X === 玩家.x && 单元格Y === 玩家.y) {
						if (等待触摸定时器) clearTimeout(等待触摸定时器);
						等待触摸定时器 = setTimeout(() => {
							if (isSwiping && Math.abs(touchCurrentX - touchStartX) < 10 && Math.abs(touchCurrentY - touchStartY) < 10) {
								玩家等待();
								isSwiping = false; 
								clearTimeout(等待触摸定时器);
								等待触摸定时器 = null;
							}
						}, 700);
					}
				}

				if (swipeMoveInterval) {
					clearInterval(swipeMoveInterval);
					swipeMoveInterval = null;
				}
			}

			function handleCanvasTouchMove(e) {
				e.preventDefault();
				if(等待触摸定时器 && (Math.abs(e.touches[0].clientX - touchStartX) > 10 || Math.abs(e.touches[0].clientY - touchStartY) > 10)){
					clearTimeout(等待触摸定时器);
					等待触摸定时器 = null;
				}
				if (!isSwiping) return;

				const touch = e.touches[0];
				touchCurrentX = touch.clientX;
				touchCurrentY = touch.clientY;

				if (swipeMoveInterval === null) {
					processSwipeMove();
					swipeMoveInterval = setInterval(processSwipeMove, 移动间隔);
				}
			}

			function handleCanvasTouchEnd(e) {
				e.preventDefault();
				if(等待触摸定时器){
					clearTimeout(等待触摸定时器);
					等待触摸定时器 = null;
				}
				if (!isSwiping) return;

				isSwiping = false;
				clearInterval(swipeMoveInterval);
				swipeMoveInterval = null;

				const touch = e.changedTouches[0];
				const touchEndX = touch.clientX;
				const touchEndY = touch.clientY;
				const touchEndTime = Date.now();

				const deltaX = touchEndX - touchStartX;
				const deltaY = touchEndY - touchStartY;
				const duration = touchEndTime - touchStartTime;
				const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

				if (distance < swipeThreshold) {
					处理点击(touchEndX, touchEndY);
				}

				touchStartX = 0;
				touchStartY = 0;
			}

			function processSwipeMove() {
				if (!isSwiping) {
					clearInterval(swipeMoveInterval);
					swipeMoveInterval = null;
					return;
				}

				const deltaX = touchCurrentX - touchStartX;
				const deltaY = touchCurrentY - touchStartY;

				if (Math.abs(deltaX) < swipeThreshold && Math.abs(deltaY) < swipeThreshold) {
					return; // 未达到移动阈值
				}

				let moveDx = 0;
				let moveDy = 0;

				if (Math.abs(deltaX) > Math.abs(deltaY)) {
					moveDx = deltaX > 0 ? 1 : -1;
				} else {
					moveDy = deltaY > 0 ? 1 : -1;
				}

				移动玩家(moveDx * 玩家属性.移动步数, moveDy * 玩家属性.移动步数);
			}

			canvas.addEventListener("touchstart", handleCanvasTouchStart);
			canvas.addEventListener("touchmove", handleCanvasTouchMove);
			canvas.addEventListener("touchend", handleCanvasTouchEnd);
			canvas.addEventListener("touchcancel", handleCanvasTouchEnd); // 处理触摸取消事件
