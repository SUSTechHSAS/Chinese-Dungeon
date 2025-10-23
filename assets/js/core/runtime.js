			var canvas = document.getElementById("dungeonCanvas");
			var ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
			window.canvas = canvas;
			window.ctx = ctx;
			var supabase = null;
			var 创意工坊已启用 = false;
			if (typeof window.prng !== 'function') {
				window.prng = Math.random;
			}
