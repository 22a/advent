import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

type GuardDirection = { deltaY: -1 | 0 | 1; deltaX: -1 | 0 | 1 };
type Guard = { y: number; x: number; direction: GuardDirection };

const map = input.split('\n').map((line) => line.split(''));
const seen = new Set<string>();
const guard: Guard = {
  y: map.findIndex((line) => line.includes('^')),
  x: map.find((line) => line.includes('^'))!.findIndex((char) => char === '^'),
  direction: { deltaY: -1, deltaX: 0 },
};

const rotate = (direction: GuardDirection): GuardDirection => {
  if (direction.deltaY === -1) return { deltaY: 0, deltaX: 1 };
  if (direction.deltaX === 1) return { deltaY: 1, deltaX: 0 };
  if (direction.deltaY === 1) return { deltaY: 0, deltaX: -1 };
  return { deltaY: -1, deltaX: 0 };
};

const moveGuard = (guard: Guard, newObstacleX?: number, newObstacleY?: number) => {
  guard.x += guard.direction.deltaX;
  guard.y += guard.direction.deltaY;
  if (
    map[guard.y]?.[guard.x] === '#' ||
    (newObstacleX !== undefined && newObstacleY !== undefined && guard.y === newObstacleY && guard.x === newObstacleX)
  ) {
    guard.x -= guard.direction.deltaX;
    guard.y -= guard.direction.deltaY;
    guard.direction = rotate(guard.direction);
  }
};

while (guard.y >= 0 && guard.y < map.length && guard.x >= 0 && guard.x < map[guard.y].length) {
  seen.add(`${guard.y},${guard.x}`);
  moveGuard(guard);
}

console.log('Part 1:', seen.size);

const willCycle = (newObstacleX: number, newObstacleY: number) => {
  const slowGuard: Guard = {
    y: map.findIndex((line) => line.includes('^')),
    x: map.find((line) => line.includes('^'))!.findIndex((char) => char === '^'),
    direction: { deltaY: -1, deltaX: 0 },
  };
  const fastGuard: Guard = { ...slowGuard };

  while (
    // slowGuard is in bounds
    slowGuard.y >= 0 &&
    slowGuard.y < map.length &&
    slowGuard.x >= 0 &&
    slowGuard.x < map[slowGuard.y].length &&
    // fastGuard is in bounds
    fastGuard.y >= 0 &&
    fastGuard.y < map.length &&
    fastGuard.x >= 0 &&
    fastGuard.x < map[fastGuard.y].length
  ) {
    moveGuard(slowGuard, newObstacleX, newObstacleY);
    moveGuard(fastGuard, newObstacleX, newObstacleY);
    moveGuard(fastGuard, newObstacleX, newObstacleY);
    if (
      slowGuard.y === fastGuard.y &&
      slowGuard.x === fastGuard.x &&
      slowGuard.direction.deltaY === fastGuard.direction.deltaY &&
      slowGuard.direction.deltaX === fastGuard.direction.deltaX
    ) {
      return true;
    }
  }
  return false;
};

const cycleCausingObstacles: { x: number; y: number }[] = [];

for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    if (map[y][x] === '.' && willCycle(x, y)) {
      cycleCausingObstacles.push({ x, y });
    }
  }
}

console.log('Part 2:', cycleCausingObstacles.length);
