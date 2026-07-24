/**
 * Game log panel
 */

export class LogPanel {
  constructor(containerId = '日志内容') {
    this.container = document.getElementById(containerId);
    this.panel = document.getElementById('日志面板');
    this.maxEntries = 100;
    this.entries = [];
  }

  add(content, type = 'info') {
    const entry = { content, type, time: new Date() };
    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) this.entries.shift();
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    for (const e of this.entries.slice(-20)) {
      const div = document.createElement('div');
      div.className = e.type;
      div.textContent = `[${e.time.toLocaleTimeString()}] ${e.content}`;
      this.container.appendChild(div);
    }
    this.container.scrollTop = this.container.scrollHeight;
  }

  clear() {
    this.entries = [];
    this.render();
  }

  show() { this.panel?.classList.add('可见'); }
  hide() { this.panel?.classList.remove('可见'); }
  toggle() { this.panel?.classList.toggle('可见'); }
}

export const logPanel = new LogPanel();
export const 添加日志 = (c, t) => logPanel.add(c, t);
