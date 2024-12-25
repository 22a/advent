import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));
const target = process.argv.includes('--example') ? 6 : 70;
const split = process.argv.includes('--example') ? 12 : 1024;

type Point = { x: number; y: number };
type SearchState = {
  pos: Point;
  cost: number;
};

const mem = input.split('\n').map((line) => line.split(',').map(Number));
const memBeforeSplit = mem.slice(0, split);
const memAfterSplit = mem.slice(split);
const walls = new Set<string>();
memBeforeSplit.forEach(([x, y]) => {
  walls.add(`${x},${y}`);
});

const solveMaze = () => {
  const pos: Point = { x: 0, y: 0 };
  const exit: Point = { x: target, y: target };
  const visited: Record<string, number> = {};
  const queue: SearchState[] = [{ pos, cost: 0 }];
  let bestPath: SearchState | undefined = undefined;

  while (queue.length > 0) {
    const current = queue.shift()!;
    const { pos, cost } = current;
    if (pos.x === exit.x && pos.y === exit.y) {
      if (!bestPath || cost < bestPath.cost) {
        bestPath = current;
      }
      continue;
    }
    const positionKey = `${pos.x},${pos.y}`;
    if (visited[positionKey] !== undefined && visited[positionKey] <= cost) {
      continue;
    } else {
      visited[positionKey] = cost;
    }
    for (const [dx, dy] of [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ]) {
      const next = { x: pos.x + dx, y: pos.y + dy };
      if (next.x >= 0 && next.y >= 0 && next.x <= target && next.y <= target && !walls.has(`${next.x},${next.y}`)) {
        queue.push({
          pos: next,
          cost: cost + 1,
        });
      }
    }
  }
  return bestPath?.cost || Infinity;
};

console.log('Part 1:', solveMaze());

while (memAfterSplit.length > 0) {
  const nextMem = memAfterSplit.shift()!;
  const nextMemKey = `${nextMem[0]},${nextMem[1]}`;
  walls.add(nextMemKey);
  if (solveMaze() === Infinity) {
    console.log('Part 2:', nextMemKey);
    break;
  }
}
