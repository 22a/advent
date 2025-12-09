import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

type Coord = [number, number];
const reds = input.split('\n').map((l) => l.split(',').map(Number) as Coord);
const calculateArea = (a: Coord, b: Coord) => {
  const xDist = Math.abs(a[0] - b[0]);
  const yDist = Math.abs(a[1] - b[1]);
  return (xDist + 1) * (yDist + 1);
};
let maxArea = 0;
for (let i = 0; i < reds.length; i++) {
  for (let j = i + 1; j < reds.length; j++) {
    const area = calculateArea(reds[i], reds[j]);
    if (area > maxArea) maxArea = area;
  }
}
console.log('Part 1:', maxArea);

reds.push(reds[0]);
const slices: Record<number, [number, number]> = {};
for (let i = 0; i < reds.length - 1; i++) {
  const [x1, y1] = reds[i];
  const [x2, y2] = reds[i + 1];
  if (x1 === x2) {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      if (!slices[y]) {
        slices[y] = [x1, x1];
      } else {
        slices[y][0] = Math.min(slices[y][0], x1);
        slices[y][1] = Math.max(slices[y][1], x1);
      }
    }
  } else {
    if (!slices[y1]) {
      slices[y1] = [Math.min(x1, x2), Math.max(x1, x2)];
    } else {
      slices[y1][0] = Math.min(slices[y1][0], x1, x2);
      slices[y1][1] = Math.max(slices[y1][1], x1, x2);
    }
  }
}
const isRectangleLegal = (a: Coord, b: Coord) => {
  const minX = Math.min(a[0], b[0]);
  const maxX = Math.max(a[0], b[0]);
  const minY = Math.min(a[1], b[1]);
  const maxY = Math.max(a[1], b[1]);
  for (let y = minY; y <= maxY; y++) {
    if (!slices[y]) return false;
    const [boundMinX, boundMaxX] = slices[y];
    if (minX < boundMinX || maxX > boundMaxX) return false;
  }
  return true;
};
maxArea = 0;
for (let i = 0; i < reds.length - 1; i++) {
  for (let j = i + 1; j < reds.length; j++) {
    const area = calculateArea(reds[i], reds[j]);
    if (area > maxArea && isRectangleLegal(reds[i], reds[j])) {
      maxArea = area;
    }
  }
}
console.log('Part 2:', maxArea);
