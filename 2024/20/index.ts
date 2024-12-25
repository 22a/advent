import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));
const lines = input.split('\n');

type Point = { x: number; y: number };
let start: Point = { x: -Infinity, y: -Infinity };
let walls: Set<string> = new Set();
let steps: Set<string> = new Set();
for (let y = 0; y < lines.length; y++) {
  for (let x = 0; x < lines[y].length; x++) {
    if (lines[y][x] === '#') {
      walls.add(`${x},${y}`);
    } else if (lines[y][x] === 'S') {
      start = { x, y };
    } else {
      steps.add(`${x},${y}`);
    }
  }
}

let path: Point[] = [start];
let next: Point = { ...start };
let seen: Set<string> = new Set();
do {
  seen.add(`${next.x},${next.y}`);
  const directions = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
  ];
  const nextPoint = directions
    .map((dir) => ({ x: next.x + dir.x, y: next.y + dir.y }))
    .find((point) => {
      const key = `${point.x},${point.y}`;
      return steps.has(key) && !seen.has(key);
    });
  if (!nextPoint) break;
  next = nextPoint;
  path.push(next);
} while (steps.has(`${next.x},${next.y}`));

const cheat = ({ maxCheatLength, minSaving }: { maxCheatLength: number; minSaving: number }) => {
  let verySpeedyBois: Set<string> = new Set();
  for (let i = 0; i < path.length - 1; i++) {
    for (let dx = -maxCheatLength; dx <= maxCheatLength; dx++) {
      for (let dy = -maxCheatLength; dy <= maxCheatLength; dy++) {
        const timeSpentCheating = Math.abs(dx) + Math.abs(dy);
        if (timeSpentCheating <= maxCheatLength) {
          let landing = { x: path[i].x + dx, y: path[i].y + dy };
          let cheatKey = `${path[i].x},${path[i].y}->${landing.x},${landing.y}`;
          if (
            !verySpeedyBois.has(cheatKey) &&
            steps.has(`${landing.x},${landing.y}`) &&
            path.findIndex((p) => p.x === landing.x && p.y === landing.y) - i - timeSpentCheating >= minSaving
          ) {
            verySpeedyBois.add(cheatKey);
          }
        }
      }
    }
  }
  return verySpeedyBois.size;
};
console.log('Part 1:', cheat({ maxCheatLength: 2, minSaving: 100 }));
console.log('Part 2:', cheat({ maxCheatLength: 20, minSaving: 100 }));
