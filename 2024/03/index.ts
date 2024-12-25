import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example')).replace(/\n/g, '');

const part1 = (input: string) =>
  [...input.matchAll(/mul\((\d+),(\d+)\)/g)]
    .map((match) => Number(match[1]) * Number(match[2]))
    .reduce((acc, v) => acc + v, 0);

console.log('Part 1:', part1(input));
const inputStripped = input.replace(/don't\(\).*?(do\(\)|$)/g, '');
console.log('Part 2:', part1(inputStripped));
