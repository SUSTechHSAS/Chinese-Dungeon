export function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
export function randInt(min, max, prng) { return Math.floor((prng?.next() || Math.random()) * (max - min)) + min; }
