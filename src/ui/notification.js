export function showNotification(content, type = '信息', duration = 3000) {
  const container = document.querySelector('.通知容器') || (() => {
    const c = document.createElement('div');
    c.className = '通知容器';
    document.body.appendChild(c);
    return c;
  })();
  const el = document.createElement('div');
  el.className = `通知条目 ${type}`;
  el.innerHTML = `<span class="通知图标">ℹ️</span><span>${content}</span><button class="关闭按钮">×</button>`;
  container.appendChild(el);
  requestAnimationFrame(() => el.style.opacity = '1');
  el.querySelector('.关闭按钮').onclick = () => el.remove();
  if (duration > 0) setTimeout(() => { el.classList.add('离场'); setTimeout(() => el.remove(), 300); }, duration);
}
export const 显示通知 = showNotification;
