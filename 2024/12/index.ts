import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const map = input.split('\n').map((line) => line.split(''));

const scan = (x, y, searchTarget, garden) => {
  if (map[y]?.[x] === searchTarget) {
    garden.area.add(`${x},${y}`);
    map[y][x] = '';
    scan(x + 1, y, searchTarget, garden);
    scan(x - 1, y, searchTarget, garden);
    scan(x, y + 1, searchTarget, garden);
    scan(x, y - 1, searchTarget, garden);
  } else if (!garden.area.has(`${x},${y}`)) {
    garden.perimeter.push(`${x},${y}`);
  }
};

type Garden = { name: string; area: Set<string>; perimeter: string[]; corners?: number };
const gardens: Garden[] = [];

for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    let letter = map[y]?.[x];
    if (letter) {
      let garden: Garden = { name: letter, area: new Set(), perimeter: [] };
      scan(x, y, letter, garden);
      gardens.push(garden);
    }
  }
}

const requiredFenceCost = gardens.map((g) => g.area.size * g.perimeter.length).reduce((a, b) => a + b, 0);
console.log('Part 1:', requiredFenceCost);

const countCorners = (region: Set<string>) => {
  return [...region].reduce((acc, coord) => {
    let [x, y] = coord.split(',').map(Number);
    let left = `${x - 1},${y}`;
    let right = `${x + 1},${y}`;
    let up = `${x},${y - 1}`;
    let down = `${x},${y + 1}`;
    let topLeft = `${x - 1},${y - 1}`;
    let topRight = `${x + 1},${y - 1}`;
    let bottomLeft = `${x - 1},${y + 1}`;
    let bottomRight = `${x + 1},${y + 1}`;
    let isTopLeftCorner = !region.has(left) && !region.has(up);
    let isTopRightCorner = !region.has(right) && !region.has(up);
    let isBottomLeftCorner = !region.has(left) && !region.has(down);
    let isBottomRightCorner = !region.has(right) && !region.has(down);
    let isTopLeftX = region.has(left) && region.has(up) && !region.has(topLeft);
    let isTopRightX = region.has(right) && region.has(up) && !region.has(topRight);
    let isBottomLeftX = region.has(left) && region.has(down) && !region.has(bottomLeft);
    let isBottomRightX = region.has(right) && region.has(down) && !region.has(bottomRight);
    return (
      acc +
      [
        isTopLeftCorner || isTopLeftX,
        isTopRightCorner || isTopRightX,
        isBottomLeftCorner || isBottomLeftX,
        isBottomRightCorner || isBottomRightX,
      ]
        .map(Number)
        .reduce((a, b) => a + b, 0)
    );
  }, 0);
};

const discountedFenceCost = gardens
  .map((garden) => garden.area.size * countCorners(garden.area))
  .reduce((a, b) => a + b, 0);
console.log('Part 2:', discountedFenceCost);
