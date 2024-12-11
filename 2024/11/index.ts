import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));
const stones = input.split(' ').map(Number);

const expand = (stone: number) => {
  if (stone === 0) {
    return [1];
  } else {
    let stoneStr = stone.toString();
    if (stoneStr.length % 2 === 0) {
      let left = Number(stoneStr.substring(0, stoneStr.length / 2));
      let right = Number(stoneStr.substring(stoneStr.length / 2).replace(/^0+/, ''));
      return [left, right];
    } else {
      return [stone * 2024];
    }
  }
};

const blinkCache: Record<number, Record<number, number>> = {};
const blink = (stone, i) => {
  if (i < 1) return 1;
  if (!blinkCache[stone]?.[i]) {
    blinkCache[stone] ||= {};
    blinkCache[stone][i] = expand(stone)
      .map((s) => blink(s, i - 1))
      .reduce((a, b) => a + b, 0);
  }
  return blinkCache[stone][i];
};

const sizeAfterNBlinks = (blinkCount: number) =>
  stones.map((stone) => blink(stone, blinkCount)).reduce((a, b) => a + b, 0);

console.log('Part 1:', sizeAfterNBlinks(25));
console.log('Part 2:', sizeAfterNBlinks(75));
