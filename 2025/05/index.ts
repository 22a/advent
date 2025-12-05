import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const [rangesStr, ingredientsStr] = input.split('\n\n').map((s) => s.split('\n'));
const ranges = rangesStr.map((r) => r.split('-').map(Number));
const ingredients = ingredientsStr.map(Number);
const fresh = ingredients.filter((i) => ranges.some((r) => i <= r[1] && i >= r[0]));
console.log('Part 1:', fresh.length);

ranges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
let old = ranges.shift()!;
const mergedRanges = [old];
ranges.forEach((nu) => {
  if (old[1] < nu[0]) {
    old = nu;
    mergedRanges.push(nu);
  } else if (old[1] < nu[1]) {
    old[1] = nu[1];
  }
});
let sum = mergedRanges.reduce((acc, range) => acc + (range[1] - range[0] + 1), 0);
console.log('Part 2:', sum);
