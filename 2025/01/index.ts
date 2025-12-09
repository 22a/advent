import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));
const lines = input.split('\n');

let dial = 50;
let finishedOnZero = 0;
let touchedZero = 0;
lines.forEach((line) => {
  const startedAtZero = dial === 0;
  const dir = line[0] === 'R' ? 1 : -1;
  const num = Number(line.slice(1));
  touchedZero += Math.floor(num / 100);
  dial += dir * (num % 100);
  if (dial >= 100) {
    dial %= 100;
    touchedZero++;
  } else if (dial < 0) {
    dial += 100;
    if (!startedAtZero) {
      touchedZero++;
    }
  } else if (dial === 0) {
    touchedZero++;
  }
  if (dial === 0) {
    finishedOnZero++;
  }
});
console.log('Part 1:', finishedOnZero);
console.log('Part 2:', touchedZero);
