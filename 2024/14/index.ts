import { readInput } from '../utils/readInput.ts';
const isExampleInput = process.argv.includes('--example');
const mapWidth = isExampleInput ? 11 : 101;
const mapHeight = isExampleInput ? 7 : 103;
const input = readInput(import.meta.url, isExampleInput);

type Roomba = { x: number; y: number; dx: number; dy: number };
const lines = input.split('\n');
let roombas: Roomba[] = lines.map((line) => {
  let [left, right] = line.split(' ');
  let [x, y] = left.substring(2).split(',').map(Number);
  let [dx, dy] = right.substring(2).split(',').map(Number);
  return { x, y, dx, dy };
});

const move = (roomba: Roomba): void => {
  roomba.x = (roomba.x + roomba.dx) % mapWidth;
  roomba.y = (roomba.y + roomba.dy) % mapHeight;
  if (roomba.x < 0) {
    roomba.x = mapWidth + roomba.x;
  }
  if (roomba.y < 0) {
    roomba.y = mapHeight + roomba.y;
  }
};

for (let i = 0; i < 100; i++) {
  roombas.map(move);
}

let tl = 0;
let tr = 0;
let bl = 0;
let br = 0;

roombas.forEach((roomba) => {
  let isTop = roomba.y > Math.floor(mapHeight / 2);
  let isBottom = roomba.y < Math.floor(mapHeight / 2);
  let isLeft = roomba.x < Math.floor(mapWidth / 2);
  let isRight = roomba.x > Math.floor(mapWidth / 2);
  tl += Number(isTop && isLeft);
  tr += Number(isTop && isRight);
  bl += Number(isBottom && isLeft);
  br += Number(isBottom && isRight);
});

console.log('Part 1:', tl * tr * bl * br);

const printMap = (roombas: Roomba[], second: number): void => {
  let counts: string[] = [];
  let maybeGood = false;
  for (let y = 0; y < mapHeight; y++) {
    let line: string = '';
    for (let x = 0; x < mapWidth; x++) {
      line += roombas.filter((roomba) => roomba.x === x && roomba.y === y).length ? '#' : ' ';
    }
    if (line.includes('############')) {
      maybeGood = true;
    }
    counts.push(line);
  }
  if (maybeGood) {
    console.log('Part 2(potentially): ', second);
    counts.map((c) => console.log(c));
  }
};

for (let i = 100; i < 10000; i++) {
  printMap(roombas, i);
  roombas.map(move);
}
