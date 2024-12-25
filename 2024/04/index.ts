import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const grid = input.split('\n').map((line) => line.split(''));
let hits = 0;
const checkNeighborsFor = (x: number, y: number, target: string, direction: { deltaX: number; deltaY: number }) => {
  const { deltaX, deltaY } = direction;
  if (grid[y + deltaY]?.[x + deltaX] === target[0]) {
    return target.length === 1 || checkNeighborsFor(x + deltaX, y + deltaY, target.slice(1), direction);
  }
  return false;
};
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === 'X') {
      for (let deltaX = -1; deltaX <= 1; deltaX++) {
        for (let deltaY = -1; deltaY <= 1; deltaY++) {
          if (checkNeighborsFor(x, y, 'MAS', { deltaX, deltaY })) {
            hits++;
          }
        }
      }
    }
  }
}
console.log('Part 1:', hits);

hits = 0;
const targets = new Set(['M', 'S']);
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (
      grid[y][x] === 'A' &&
      new Set([grid[y + 1]?.[x + 1], grid[y - 1]?.[x - 1]]).isSupersetOf(targets) &&
      new Set([grid[y - 1]?.[x + 1], grid[y + 1]?.[x - 1]]).isSupersetOf(targets)
    ) {
      hits++;
    }
  }
}
console.log('Part 2:', hits);
