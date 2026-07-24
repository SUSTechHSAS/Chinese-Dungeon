export class AudioManager {
  constructor() {
    this.volume = 1.0;
    this.sounds = new Map();
    this.enabled = true;
  }
  setVolume(v) { this.volume = v; }
  play(name) {
    if (!this.enabled || this.volume === 0) return;
    // placeholder - real audio via Web Audio API
    console.debug(`[Audio] play ${name}`);
  }
  load(name, url) {
    // load audio
    this.sounds.set(name, url);
  }
}
export const audioManager = new AudioManager();
export const 音效管理器 = audioManager;
