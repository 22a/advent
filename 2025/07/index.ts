import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const lines = input.split('\n');
const countCache: Record<string, number> = {};
let splits = 0;
const countSignals = (row: number, col: number): number => {
  if (row === lines.length - 1) return 1;
  const cached = countCache[`${row},${col}`];
  if (cached) return cached;
  const splitters = [...lines[row]].map((char, i) => (char === '^' ? i : -1)).filter((i) => i !== -1);
  let signalCount: number;
  if (splitters.includes(col)) {
    splits++;
    signalCount = countSignals(row + 1, col - 1) + countSignals(row + 1, col + 1);
  } else {
    signalCount = countSignals(row + 1, col);
  }
  countCache[`${row},${col}`] = signalCount;
  return signalCount;
};
const timelines = countSignals(0, lines.shift()!.indexOf('S'));
console.log('Part 1:', splits);
console.log('Part 2:', timelines);
