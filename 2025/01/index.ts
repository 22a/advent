import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));
const lines = input.split('\n');

let dial = 50;
let finishedOnZero = 0;
let touchedZero = 0;
lines.forEach((line) => {
  const dir = line[0] === 'R' ? 1 : -1;
  const num = Number(line.slice(1));
  for (let i = 0; i < num; i++) {
    dial += dir;
    if (dial === 100) {
      dial = 0;
    } else if (dial === -1) {
      dial = 99;
    }
    if (dial === 0) {
      touchedZero++;
    }
  }
  if (dial === 0) {
    finishedOnZero++;
  }
});
console.log('Part 1:', finishedOnZero);
console.log('Part 2:', touchedZero);
