import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const rawLines = input.split('\n');
const splitLines = rawLines.map((l) => l.split(/\s+/).filter(Boolean));

let global = 0;
for (let column = 0; column < splitLines[0].length; column++) {
  let operator = splitLines[splitLines.length - 1][column];
  let total = Number(splitLines[0][column]);
  for (let row = 1; row < splitLines.length - 1; row++) {
    let next = Number(splitLines[row][column]);
    if (operator === '+') {
      total += next;
    } else {
      total *= next;
    }
  }
  global += total;
}
console.log('Part 1:', global);

let chunk: { op?: '+' | '*'; nums: number[] } = { nums: [] };
let chunks: (typeof chunk)[] = [];
for (let column = 0; column < rawLines[0].length; column++) {
  let col = '';
  for (let row = 0; row < rawLines.length; row++) {
    col += rawLines[row][column];
  }
  if (col.includes('+')) {
    chunk.op = '+';
    col = col.replace('+', '');
  } else if (col.includes('*')) {
    chunk.op = '*';
    col = col.replace('*', '');
  }
  if (col.trim() === '') {
    chunks.push(chunk);
    chunk = { nums: [] };
  } else {
    chunk.nums.push(Number(col));
  }
}
chunks.push(chunk);
let chunkResults = chunks.reduce(
  (acc, { op, nums }) =>
    acc +
    nums.reduce(
      (a, b) => {
        if (op === '+') {
          return a + b;
        } else if (op === '*') {
          return a * b;
        } else {
          throw new Error('unexpected op');
        }
      },
      op === '*' ? 1 : 0,
    ),
  0,
);
console.log('Part 2:', chunkResults);
