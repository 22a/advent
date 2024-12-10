import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

type Point = { x: number; y: number };
const map = input.split('\n').map((line) => line.split('').map(Number));
const zeros = map.reduce((acc, row, y) => {
  row.forEach((elevation, x) => {
    if (elevation === 0) {
      acc.push({ x, y });
    }
  });
  return acc;
}, [] as Point[]);

const computeTrailRatings = ({ x, y }: Point, currentElevation: number = 0, seenSummits: Set<string>): number => {
  if (currentElevation === 9) {
    seenSummits.add(`${x},${y}`);
    return 1;
  }
  let score = 0;
  for (let [deltaX, deltaY] of [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]) {
    let searchPosition = { x: x + deltaX, y: y + deltaY };
    if (map[searchPosition.y]?.[searchPosition.x] === currentElevation + 1) {
      score += computeTrailRatings(searchPosition, currentElevation + 1, seenSummits);
    }
  }
  return score;
};

let sumOfScores = 0;
let sumOfRatings = 0;
zeros.forEach((zero) => {
  const seenSummits: Set<string> = new Set();
  sumOfRatings += computeTrailRatings(zero, 0, seenSummits);
  sumOfScores += seenSummits.size;
});
console.log('Part 1:', sumOfScores);
console.log('Part 2:', sumOfRatings);
