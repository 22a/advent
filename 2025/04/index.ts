import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

let lines = input.split('\n').map((l) => l.split(''));
let totalMatched = 0;
let matching = 0;
do {
  const snapshot = JSON.parse(JSON.stringify(lines));
  matching = 0;
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      let count = 0;
      let target = lines[y][x];
      if (target !== '@') continue;
      for (let dy = -1; dy <= 1; dy++) {
        let searchY = y + dy;
        if (searchY < 0 || searchY >= lines.length) continue;
        for (let dx = -1; dx <= 1; dx++) {
          let searchX = x + dx;
          if (searchX < 0 || searchX >= lines[y].length || (dy === 0 && dx === 0)) continue;
          if (lines[searchY][searchX] === '@') {
            count++;
          }
        }
      }
      if (count < 4) {
        matching++;
        snapshot[y][x] = 'x';
      }
    }
  }
  if (totalMatched === 0) {
    console.log('Part 1:', matching);
  }
  totalMatched += matching;
  lines = snapshot;
} while (matching);
console.log('Part 2:', totalMatched);
