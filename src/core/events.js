export class EventEmitter {
  constructor() { this.listeners = new Map(); }
  on(e, fn) { if (!this.listeners.has(e)) this.listeners.set(e, []); this.listeners.get(e).push(fn); }
  off(e, fn) { if (!this.listeners.has(e)) return; this.listeners.set(e, this.listeners.get(e).filter(f => f !== fn)); }
  emit(e, data) { (this.listeners.get(e) || []).forEach(fn => { try { fn(data); } catch (err) { console.error(err); } }); }
}
export const globalEvents = new EventEmitter();
