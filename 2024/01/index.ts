import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const input = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'input.txt'), 'utf8');

const lines = input.split('\n');

const left: number[] = [];
const right: number[] = [];
lines.forEach((line) => {
  const [l, r] = line.split(/\s+/);
  left.push(parseInt(l));
  right.push(parseInt(r));
});
left.sort((a, b) => a - b);
right.sort((a, b) => a - b);
const diffSum = left.reduce((acc, i, index) => acc + Math.abs(i - right[index]), 0);
console.log('Part 1:', diffSum);

const occurrences = right.reduce(
  (acc, i) => ({
    ...acc,
    [i]: (acc[i] || 0) + 1,
  }),
  {},
);
const simScore = left.reduce((acc, i) => acc + (i * occurrences[i] || 0), 0);
console.log('Part 2:', simScore);
