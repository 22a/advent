import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));
const banks = input.split('\n').map((line) => [...line].map(Number));
const bestNInOrder = (bank: number[], n: number) => {
  let startIndex = 0;
  const best: number[] = [];
  while (best.length < n) {
    const end = bank.length - (n - best.length);
    let bestDigit = -1;
    let bestIndex = -1;
    for (let i = startIndex; i <= end; i++) {
      if (bank[i] > bestDigit) {
        bestDigit = bank[i];
        bestIndex = i;
      }
    }
    best.push(bestDigit);
    startIndex = bestIndex + 1;
  }
  return Number(best.join(''));
};
console.log(`Part 1: ${banks.reduce((acc, bank) => acc + bestNInOrder(bank, 2), 0)}`);
console.log(`Part 2: ${banks.reduce((acc, bank) => acc + bestNInOrder(bank, 12), 0)}`);
