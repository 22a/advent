import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

type Point = { x: number; y: number };
type Direction = 'north' | 'south' | 'east' | 'west';
type Guy = Point & { direction: Direction };
type SearchState = {
  guy: Guy;
  cost: number;
  steps: string[];
};

const walls = new Set<string>();
const guy: Guy = { x: -1, y: -1, direction: 'east' };
const exit: Point = { x: -1, y: -1 };
input.split('\n').map((line, y) => {
  line.split('').map((char, x) => {
    if (char === '#') {
      walls.add(`${x},${y}`);
    } else if (char === 'S') {
      guy.x = x;
      guy.y = y;
    } else if (char === 'E') {
      exit.x = x;
      exit.y = y;
    }
  });
});

const getNextDirection = (current: Direction, turn: 'left' | 'right'): Direction => {
  if (current === 'north') {
    if (turn === 'left') return 'west';
    return 'east';
  }
  if (current === 'east') {
    if (turn === 'left') return 'north';
    return 'south';
  }
  if (current === 'south') {
    if (turn === 'left') return 'east';
    return 'west';
  }
  if (current === 'west') {
    if (turn === 'left') return 'south';
    return 'north';
  }
  throw new Error('Invalid direction mate');
};

const visited: Record<string, number> = {};
const queue: SearchState[] = [{ guy, cost: 0, steps: [`${guy.x},${guy.y}`] }];
let bestPath: SearchState | undefined = undefined;
let bestPaths: string[][] = [];

while (queue.length > 0) {
  const current = queue.shift()!;
  const { guy, cost, steps } = current;
  if (guy.x === exit.x && guy.y === exit.y) {
    if (!bestPath || cost < bestPath.cost) {
      bestPath = current;
      bestPaths = [steps.filter((step) => !step.startsWith('turn:'))];
    } else if (cost === bestPath.cost) {
      bestPaths.push(steps.filter((step) => !step.startsWith('turn:')));
    }
    continue;
  }
  const positionKey = `${guy.x},${guy.y},${guy.direction}`;
  if (visited[positionKey] !== undefined && visited[positionKey] < cost) {
    continue;
  } else {
    visited[positionKey] = cost;
  }
  const forward = { ...guy };
  if (guy.direction === 'north') {
    forward.y--;
  } else if (guy.direction === 'south') {
    forward.y++;
  } else if (guy.direction === 'east') {
    forward.x++;
  } else if (guy.direction === 'west') {
    forward.x--;
  } else {
    throw new Error('Invalid direction mate');
  }
  if (!walls.has(`${forward.x},${forward.y}`)) {
    queue.push({
      guy: forward,
      cost: cost + 1,
      steps: [...steps, `${forward.x},${forward.y}`],
    });
  }
  queue.push({
    guy: { ...guy, direction: getNextDirection(guy.direction, 'left') },
    cost: cost + 1000,
    steps: [...steps, `turn:left`],
  });
  queue.push({
    guy: { ...guy, direction: getNextDirection(guy.direction, 'right') },
    cost: cost + 1000,
    steps: [...steps, `turn:right`],
  });
}

console.log('Part 1:', bestPath?.cost);
console.log('Part 2:', new Set(bestPaths.flat()).size);
