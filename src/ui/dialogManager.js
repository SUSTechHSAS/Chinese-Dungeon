export class DialogManager {
  constructor() { this.stack = []; }
  open(id) { document.getElementById(id)?.classList.add('显示中'); this.stack.push(id); }
  close(id) { document.getElementById(id)?.classList.remove('显示中'); this.stack = this.stack.filter(x => x !== id); }
  closeAll() { this.stack.forEach(id => document.getElementById(id)?.classList.remove('显示中')); this.stack = []; }
}
