/**
 * Pathfinding utilities - A*, BFS, Line of Sight
 */

export function bfsDistanceMap(dungeon, startX, startY, isWalkable) {
  const height = dungeon.length;
  const width = height ? dungeon[0].length : 0;
  const dist = Array.from({ length: height }, () => Array(width).fill(Infinity));
  const queue = [[startX, startY, 0]];
  dist[startY][startX] = 0;

  const dirs = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }];

  while (queue.length) {
    const [x, y, d] = queue.shift();
    for (const { dx, dy } of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      if (dist[ny][nx] !== Infinity) continue;
      const cell = dungeon[ny]?.[nx];
      if (!cell) continue;
      if (isWalkable && !isWalkable(cell, nx, ny)) continue;
      dist[ny][nx] = d + 1;
      queue.push([nx, ny, d + 1]);
    }
  }
  return dist;
}

export function backtrackPath(endX, endY, distMap) {
  const path = [];
  let x = endX, y = endY;
  let d = distMap[y][x];
  if (!isFinite(d)) return null;

  const dirs = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }];
  path.push({ x, y });
  while (d > 0) {
    let found = false;
    for (const { dx, dy } of dirs) {
      const nx = x + dx, ny = y + dy;
      if (distMap[ny]?.[nx] === d - 1) {
        x = nx; y = ny; d--;
        path.push({ x, y });
        found = true;
        break;
      }
    }
    if (!found) break;
  }
  return path.reverse();
}

export function aStar(startX, startY, endX, endY, maxSteps, isWalkable, dungeon) {
  const open = [{ x: startX, y: startY, g: 0, h: Math.abs(endX - startX) + Math.abs(endY - startY), parent: null }];
  const closed = new Set();
  const key = (x, y) => `${x},${y}`;

  const dirs = [
    { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
    { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
    { dx: -1, dy: -1 }, { dx: 1, dy: -1 },
    { dx: -1, dy: 1 }, { dx: 1, dy: 1 }
  ];

  let iterations = 0;
  while (open.length && iterations < (maxSteps || 10000)) {
    iterations++;
    open.sort((a, b) => (a.g + a.h) - (b.g + b.h));
    const current = open.shift();
    if (current.x === endX && current.y === endY) {
      const path = [];
      let node = current;
      while (node) {
        path.push({ x: node.x, y: node.y });
        node = node.parent;
      }
      return path.reverse();
    }
    closed.add(key(current.x, current.y));
    for (const { dx, dy } of dirs) {
      const nx = current.x + dx, ny = current.y + dy;
      if (closed.has(key(nx, ny))) continue;
      const cell = dungeon?.[ny]?.[nx];
      if (!cell) continue;
      if (isWalkable && !isWalkable(cell, nx, ny)) continue;
      const g = current.g + (dx === 0 || dy === 0 ? 1 : 1.4);
      const h = Math.abs(endX - nx) + Math.abs(endY - ny);
      const existing = open.find(n => n.x === nx && n.y === ny);
      if (!existing || g < existing.g) {
        if (existing) {
          existing.g = g;
          existing.parent = current;
        } else {
          open.push({ x: nx, y: ny, g, h, parent: current });
        }
      }
    }
  }
  return null;
}

export function checkLineOfSight(x0, y0, x1, y1, isBlocking, maxSteps = Infinity) {
  const cells = [];
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  let x = x0, y = y0;
  let steps = 0;
  while (steps < maxSteps) {
    if (x === x1 && y === y1) return true;
    if (isBlocking && isBlocking(x, y)) return false;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x += sx; }
    if (e2 < dx) { err += dx; y += sy; }
    steps++;
  }
  return false;
}

// Chinese aliases
export const 广度优先搜索路径 = bfsDistanceMap;
export const 回溯路径 = backtrackPath;
export const A星寻路 = aStar;
export const 检查视线 = checkLineOfSight;
