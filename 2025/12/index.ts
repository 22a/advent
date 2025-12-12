import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const requirementsStr = input.split('\n\n').pop()!;
const requirements = requirementsStr.split('\n').map((line) => {
  const [sizeStr, countsStr] = line.split(': ');
  const [width, height] = sizeStr.split('x').map(Number);
  const counts = countsStr.split(' ').map(Number);
  return { width, height, counts };
});
const shapeCountsFit = ({ width, height, counts }: (typeof requirements)[number]): boolean =>
  width * height >= counts.reduce((acc, count) => acc + count * 9, 0);
console.log('Part 1:', requirements.filter(shapeCountsFit).length);
