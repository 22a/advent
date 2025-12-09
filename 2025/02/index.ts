import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));
const ranges = input.split(',').map((pairStr) => pairStr.split('-').map(Number));
const isEcho = (n: string) => n.slice(0, n.length / 2) === n.slice(n.length / 2);
const isRepeatedPattern = (n: string) => Boolean(n.match(/^(.+?)\1+$/));
const countInvalid = ([low, high]: number[], isInvalid: (n: string) => boolean, count: number) => {
  for (let i = low; i <= high; i++) if (isInvalid(i.toString())) count += i;
  return count;
};
console.log(`Part 1: ${ranges.reduce((acc, range) => countInvalid(range, isEcho, acc), 0)}`);
console.log(`Part 2: ${ranges.reduce((acc, range) => countInvalid(range, isRepeatedPattern, acc), 0)}`);
