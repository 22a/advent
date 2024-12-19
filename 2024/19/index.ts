import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const [towelsStr, patternsStr] = input.split('\n\n');
const towels = towelsStr.split(', ');
const patterns = patternsStr.split('\n');
const cache: Record<string, number> = {};
function findPermutations(target: string): number {
  if (cache[target]) return cache[target];
  if (target === '') return 1;
  let count = 0;
  for (const candidate of towels.filter((towel) => target.startsWith(towel))) {
    count += findPermutations(target.slice(candidate.length));
  }
  cache[target] = count;
  return count;
}
const permutations = patterns.map(findPermutations);
console.log('Part 1:', permutations.filter((p) => p > 0).length);
console.log('Part 2:', permutations.reduce((a, b) => a + b, 0));
