import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

let [map, movesStr] = input.split('\n\n').map((block) => block.split('\n'));
let moves = movesStr.join('');

type Point = { x: number; y: number };
let robot: Point = { x: -1, y: -1 };
let walls = new Set<string>();
let boxes = new Set<string>();
for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[0].length; x++) {
    let tile = map[y][x];
    if (tile === '@') {
      robot = { x, y };
    } else if (tile === '#') {
      walls.add(`${x},${y}`);
    } else if (tile === 'O') {
      boxes.add(`${x},${y}`);
    }
  }
}

const attemptMove = (robot: Point, direction: Point) => {
  let next = { x: robot.x + direction.x, y: robot.y + direction.y };
  let nextKey = `${next.x},${next.y}`;
  if (walls.has(nextKey)) {
    return;
  } else if (!boxes.has(nextKey)) {
    robot.x = next.x;
    robot.y = next.y;
    return;
  } else {
    let firstBox = { ...next };
    let firstBoxKey = nextKey;
    do {
      next = { x: next.x + direction.x, y: next.y + direction.y };
      nextKey = `${next.x},${next.y}`;
      if (!walls.has(nextKey) && !boxes.has(nextKey)) {
        boxes.delete(firstBoxKey);
        boxes.add(nextKey);
        robot.x = firstBox.x;
        robot.y = firstBox.y;
        return;
      }
    } while (!walls.has(nextKey));
  }
};

for (let move of moves) {
  let direction: Point;
  if (move === '<') {
    direction = { x: -1, y: 0 };
  } else if (move === '>') {
    direction = { x: 1, y: 0 };
  } else if (move === 'v') {
    direction = { x: 0, y: 1 };
  } else if (move === '^') {
    direction = { x: 0, y: -1 };
  } else {
    throw new Error(`unexpecter movement ${move}`);
  }
  attemptMove(robot, direction);
}

let boxCoordinates = [...boxes].map((boxStr) => {
  let [x, y] = boxStr.split(',').map(Number);
  return y * 100 + x;
});
console.log(
  'Part 1:',
  boxCoordinates.reduce((a, b) => a + b, 0),
);

const wideInput = input.replace(/\./g, '..').replace(/#/g, '##').replace(/O/g, '[]').replace(/@/g, '@.');
const wideMap = wideInput.split('\n\n')[0].split('\n');

robot = { x: -1, y: -1 };
walls = new Set<string>();
const boxStarts = new Set<string>();
const boxEnds = new Set<string>();
for (let y = 0; y < wideMap.length; y++) {
  for (let x = 0; x < wideMap[0].length; x++) {
    let tile = wideMap[y][x];
    if (tile === '@') {
      robot = { x, y };
    } else if (tile === '#') {
      walls.add(`${x},${y}`);
    } else if (tile === '[') {
      boxStarts.add(`${x},${y}`);
    } else if (tile === ']') {
      boxEnds.add(`${x},${y}`);
    }
  }
}

const hasFreeSpace = (boxPart: Point, direction: Point) => {
  let next = { x: boxPart.x + direction.x, y: boxPart.y + direction.y };
  let nextKey = `${next.x},${next.y}`;
  return !walls.has(nextKey) && !boxStarts.has(nextKey) && !boxEnds.has(nextKey);
};
const willHitWall = (boxPart: Point, direction: Point) => {
  let next = { x: boxPart.x + direction.x, y: boxPart.y + direction.y };
  let nextKey = `${next.x},${next.y}`;
  return walls.has(nextKey);
};

const getBoxParts = (position: Point, direction: Point): Point[] => {
  let next = { x: position.x + direction.x, y: position.y + direction.y };
  let nextKey = `${next.x},${next.y}`;
  let nextIsBoxStart = boxStarts.has(nextKey);
  let nextIsBoxEnd = boxEnds.has(nextKey);
  if (!nextIsBoxStart && !nextIsBoxEnd) {
    // we're not part of a box, nothing to do
    return [];
  }
  let boxCounterpart = nextIsBoxStart ? { x: next.x + 1, y: next.y } : { x: next.x - 1, y: next.y };
  if (nextIsBoxStart) {
    return [next, boxCounterpart];
  } else {
    return [boxCounterpart, next];
  }
};

const boxTreeCanBePushed = (robot: Point, direction: Point, visited: Point[]): boolean => {
  let boxParts = getBoxParts(robot, direction);
  if (!boxParts) {
    return true;
  }
  if (boxParts.some((boxPart) => willHitWall(boxPart, direction))) {
    return false;
  }
  visited.push(...boxParts);
  if (boxParts.every((boxPart) => hasFreeSpace(boxPart, direction))) {
    return true;
  }
  return boxParts.every((boxPart) => boxTreeCanBePushed(boxPart, direction, visited));
};

const pushBoxTree = (direction: Point, visited: Point[]): void => {
  let newStarts = visited
    .filter((point) => boxStarts.has(`${point.x},${point.y}`))
    .map((point) => ({ x: point.x + direction.x, y: point.y + direction.y }));
  let newEnds = visited
    .filter((point) => boxEnds.has(`${point.x},${point.y}`))
    .map((point) => ({ x: point.x + direction.x, y: point.y + direction.y }));
  visited.forEach((point) => {
    boxStarts.delete(`${point.x},${point.y}`);
    boxEnds.delete(`${point.x},${point.y}`);
  });
  newStarts.forEach((entry) => {
    boxStarts.add(`${entry.x},${entry.y}`);
  });
  newEnds.forEach((entry) => {
    boxEnds.add(`${entry.x},${entry.y}`);
  });
};

const attemptWideMove = (robot: Point, direction: Point) => {
  let next = { x: robot.x + direction.x, y: robot.y + direction.y };
  let nextKey = `${next.x},${next.y}`;
  if (walls.has(nextKey)) {
    return;
  } else if (!boxStarts.has(nextKey) && !boxEnds.has(nextKey)) {
    robot.x = next.x;
    robot.y = next.y;
    return;
  } else {
    if (direction.y) {
      let visited: Point[] = [];
      if (boxTreeCanBePushed(robot, direction, visited)) {
        pushBoxTree(direction, visited);
        robot.x = next.x;
        robot.y = next.y;
      }
    } else {
      let firstBoxSlot = { ...next };
      let firstBoxSlotKey = `${firstBoxSlot.x},${firstBoxSlot.y}`;
      let affectedBoxPositions: string[] = [firstBoxSlotKey];
      do {
        next = { x: next.x + direction.x, y: next.y };
        nextKey = `${next.x},${next.y}`;
        if (!walls.has(nextKey) && !boxStarts.has(nextKey) && !boxEnds.has(nextKey)) {
          robot.x = firstBoxSlot.x;
          robot.y = firstBoxSlot.y;
          affectedBoxPositions.forEach((boxPositionStr) => {
            if (boxPositionStr === firstBoxSlotKey) {
              boxStarts.delete(boxPositionStr);
              boxEnds.delete(boxPositionStr);
            } else {
              if (boxStarts.has(boxPositionStr)) {
                boxStarts.delete(boxPositionStr);
                boxEnds.add(boxPositionStr);
              } else {
                boxEnds.delete(boxPositionStr);
                boxStarts.add(boxPositionStr);
              }
            }
          });
          if (direction.x === 1) {
            boxEnds.add(nextKey);
          } else {
            boxStarts.add(nextKey);
          }
          return;
        }
        affectedBoxPositions.push(nextKey);
      } while (!walls.has(nextKey));
    }
  }
};

// const printState = () => {
//   for (let y = 0; y < wideMap.length; y++) {
//     for (let x = 0; x < wideMap[0].length; x++) {
//       let tileStr = `${x},${y}`;
//       if (robot.x === x && robot.y === y) {
//         process.stdout.write('@');
//       } else if (boxStarts.has(tileStr)) {
//         process.stdout.write('[');
//       } else if (boxEnds.has(tileStr)) {
//         process.stdout.write(']');
//       } else if (walls.has(tileStr)) {
//         process.stdout.write('#');
//       } else {
//         process.stdout.write(' ');
//       }
//     }
//     process.stdout.write('\n');
//   }
// };

for (let move of moves) {
  let direction: Point;
  if (move === '<') {
    direction = { x: -1, y: 0 };
  } else if (move === '>') {
    direction = { x: 1, y: 0 };
  } else if (move === 'v') {
    direction = { x: 0, y: 1 };
  } else if (move === '^') {
    direction = { x: 0, y: -1 };
  } else {
    throw new Error(`unexpecter movement ${move}`);
  }
  attemptWideMove(robot, direction);
}

boxCoordinates = [...boxStarts].map((boxStartStr) => {
  let [x, y] = boxStartStr.split(',').map(Number);
  return y * 100 + x;
});
console.log(
  'Part 2:',
  boxCoordinates.reduce((a, b) => a + b, 0),
);
