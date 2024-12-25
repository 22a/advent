import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const blocks = input.split('\n\n').map((block) => block.split('\n'));
const locks: number[][] = [];
const keys: number[][] = [];
blocks.forEach((block) => {
  if (block[0] === '#####' && block[block.length - 1] === '.....') {
    let lock: number[] = [];
    for (let col = 0; col < block[0].length; col++) {
      let lockDepth = 0;
      for (let row = 1; row < block.length; row++) {
        if (block[row][col] === '#') {
          lockDepth++;
        } else {
          break;
        }
      }
      lock.push(lockDepth);
    }
    locks.push(lock);
  } else if (block[0] === '.....' && block[block.length - 1] === '#####') {
    let key: number[] = [];
    for (let col = 0; col < block[0].length; col++) {
      let keyHeight = 0;
      for (let row = block.length - 2; row >= 0; row--) {
        if (block[row][col] === '#') {
          keyHeight++;
        } else {
          break;
        }
      }
      key.push(keyHeight);
    }
    keys.push(key);
  } else {
    throw new Error(`no idea what this is, m8: ${block}`);
  }
});

const willCollide = (lock: number[], key: number[]) => {
  for (let i = 0; i < lock.length; i++) {
    if (lock[i] + key[i] > blocks[0].length - 2) {
      return true;
    }
  }
  return false;
};

let okPairs = 0;
for (let lock of locks) {
  for (let key of keys) {
    if (!willCollide(lock, key)) {
      okPairs++;
    }
  }
}
console.log('Part 1:', okPairs);
