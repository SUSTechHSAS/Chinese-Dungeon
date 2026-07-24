/**
 * Seeded pseudo-random number generator
 * Extracted and modernized from legacy global functions
 */

function hashString(str) {
  if (!str || str.length === 0) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export class PRNG {
  constructor(seed = Date.now().toString()) {
    this.state = hashString(seed.toString());
  }

  seed(seed) {
    this.state = hashString(seed.toString());
  }

  next() {
    this.state = (this.state * 9301 + 49297) % 233280;
    return this.state / 233280;
  }

  // Alias for compatibility
  random() {
    return this.next();
  }

  range(min, max) {
    return min + this.next() * (max - min);
  }

  int(min, max) {
    // inclusive min, exclusive max
    return Math.floor(this.range(min, max));
  }

  choice(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[this.int(0, arr.length)];
  }

  shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.int(0, i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  chance(probability) {
    return this.next() < probability;
  }
}

// Singleton instance for global usage (legacy compat)
export const globalPRNG = new PRNG();

// Legacy global functions for backward compatibility during migration
export function initRandom(种子) {
  globalPRNG.seed(种子);
}

export function prng() {
  return globalPRNG.next();
}

export function 初始化随机数生成器(种子) {
  initRandom(种子);
}

export { hashString as 哈希字符串 };
