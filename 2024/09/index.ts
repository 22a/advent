import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

type Block = { size: number; id?: number; free?: boolean; moved?: boolean };

const nums = input.split('').map(Number);

let blockId = 0;
const originalBlocks: Block[] = [];
const freeSpaces: number[] = [];
for (let i = 0; i < nums.length; i += 2) {
  originalBlocks.push({ size: nums[i], id: blockId++ });
  if (nums[i + 1] !== undefined) {
    freeSpaces.push(nums[i + 1]);
  }
}

let scratchBlocks: Block[] = [];
while (originalBlocks.length > 0 && freeSpaces.length > 0) {
  scratchBlocks.push(originalBlocks.shift() as Block);
  while (freeSpaces[0]) {
    let rightmostBlock = originalBlocks[originalBlocks.length - 1];
    if (rightmostBlock) {
      if (rightmostBlock.size) {
        scratchBlocks.push({ size: 1, id: rightmostBlock.id });
        freeSpaces[0]--;
        rightmostBlock.size--;
      }
      if (!rightmostBlock.size) {
        originalBlocks.pop();
      }
    } else {
      break;
    }
  }
  freeSpaces.shift();
}

let checksum = 0;
let position = 0;
for (let block of scratchBlocks) {
  for (let offset = 0; offset < block.size; offset++) {
    checksum += (block.id || 0) * position++;
  }
}
console.log('Part 1:', checksum);

blockId = 0;
scratchBlocks = [];
for (let i = 0; i < nums.length; i += 2) {
  scratchBlocks.push({ size: nums[i], id: blockId++ });
  if (nums[i + 1] !== undefined) {
    scratchBlocks.push({ size: nums[i + 1], free: true });
  }
}

for (let i = scratchBlocks.length - 1; i > 0; i--) {
  let rightmostBlock = scratchBlocks[i];
  if (rightmostBlock.moved || rightmostBlock.free) continue;
  for (let j = 0; j < i; j++) {
    let potentialSlot = scratchBlocks[j];
    if (potentialSlot.free && !potentialSlot.moved && rightmostBlock.size <= potentialSlot.size) {
      rightmostBlock.moved = true;
      if (rightmostBlock.size < potentialSlot.size) {
        scratchBlocks.splice(j, 1, rightmostBlock, { size: potentialSlot.size - rightmostBlock.size, free: true });
        i++;
      } else {
        scratchBlocks[j] = rightmostBlock;
      }
      scratchBlocks[i] = { size: rightmostBlock.size, free: true };
      break;
    }
  }
}

checksum = 0;
position = 0;
for (let block of scratchBlocks) {
  for (let offset = 0; offset < block.size; offset++) {
    checksum += (block.id || 0) * position++;
  }
}
console.log('Part 2:', checksum);
