import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const codes = input.split('\n');

type DoorCode = 'A' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0';
type DirectionCode = 'A' | '<' | '>' | '^' | 'v';

const doorCodeSequence = (current: DoorCode, target: DoorCode): string => {
  // +---+---+---+
  // | 7 | 8 | 9 |
  // +---+---+---+
  // | 4 | 5 | 6 |
  // +---+---+---+
  // | 1 | 2 | 3 |
  // +---+---+---+
  //     | 0 | A |
  //     +---+---+
  const paths = {
    '7': {
      '1': 'vv',
      '2': 'vv>',
      '3': 'vv>>',
      '4': 'v',
      '5': 'v>',
      '6': 'v>>',
      '8': '>',
      '9': '>>',
      '0': '>vvv',
      A: '>>vvv',
    },
    '8': {
      '1': '<vv',
      '2': 'vv',
      '3': 'vv>',
      '4': '<v',
      '5': 'v',
      '6': 'v>',
      '7': '<',
      '9': '>',
      '0': 'vvv',
      A: 'vvv>',
    },
    '9': {
      '1': '<<vv',
      '2': '<vv',
      '3': 'vv',
      '4': '<<v',
      '5': '<v',
      '6': 'v',
      '7': '<<',
      '8': '<',
      '0': '<vv',
      A: 'vvv',
    },
    '4': {
      '1': 'v',
      '2': 'v>',
      '3': 'v>>',
      '5': '>',
      '6': '>>',
      '7': '^',
      '8': '^>',
      '9': '^>>',
      '0': '>vv',
      A: '>>vv',
    },
    '5': {
      '1': '<v',
      '2': 'v',
      '3': 'v>',
      '4': '<',
      '6': '>',
      '7': '<^',
      '8': '^',
      '9': '^>',
      '0': 'vv',
      A: 'vv>',
    },
    '6': {
      '1': '<<v',
      '2': '<v',
      '3': 'v',
      '4': '<<',
      '5': '<',
      '7': '<<^',
      '8': '<^',
      '9': '^',
      '0': '<vv',
      A: 'vv',
    },
    '1': {
      '2': '>',
      '3': '>>',
      '4': '^',
      '5': '^>',
      '6': '^>>',
      '7': '^^',
      '8': '^^>',
      '9': '^^>>',
      '0': '>v',
      A: '>>v',
    },
    '2': {
      '1': '<',
      '3': '>',
      '4': '<^',
      '5': '^',
      '6': '^>',
      '7': '<^^',
      '8': '^^',
      '9': '^^>',
      '0': 'v',
      A: 'v>',
    },
    '3': {
      '1': '<<',
      '2': '<',
      '4': '<<^',
      '5': '<^',
      '6': '^',
      '7': '<<^^',
      '8': '<^^',
      '9': '^^',
      '0': '<v',
      A: 'v',
    },
    '0': {
      '1': '^<',
      '2': '^',
      '3': '^>',
      '4': '^^<',
      '5': '^^',
      '6': '^^>',
      '7': '^^^<',
      '8': '^^^',
      '9': '^^^>',
      A: '>',
    },
    A: {
      '1': '^<<',
      '2': '^<',
      '3': '^',
      '4': '^^<<',
      '5': '^^<',
      '6': '^^',
      '7': '^^^<<',
      '8': '^^^<',
      '9': '^^^',
      '0': '<',
    },
  } as const;
  return paths[current][target] || '';
};

const directionSequence = (current: DirectionCode, target: DirectionCode): string => {
  //     +---+---+
  //     | ^ | A |
  // +---+---+---+
  // | < | v | > |
  // +---+---+---+
  const paths = {
    '^': {
      A: '>',
      v: 'v',
      '>': 'v>',
      '<': 'v<',
    },
    A: {
      '^': '<',
      '>': 'v',
      v: '<v', // <--- I lost 3hours debugging this when it was 'v<' :)
      '<': 'v<<',
    },
    '>': {
      A: '^',
      v: '<',
      '<': '<<',
      '^': '<^',
    },
    v: {
      A: '^>',
      '>': '>',
      '^': '^',
      '<': '<',
    },
    '<': {
      v: '>',
      '>': '>>',
      '^': '>^',
      A: '>>^',
    },
  } as const;
  return paths[current][target] || '';
};

type Robots = {
  human: DirectionCode;
  intermediates: DirectionCode[];
  door: DoorCode;
};

let robots: Robots;
let intermediateCache: Record<string, bigint> = {};

const resetRobots = (intermediateSteps: number) => {
  robots = {
    human: 'A',
    intermediates: new Array(intermediateSteps).fill('A'),
    door: 'A',
  };
  intermediateCache = {};
};

const createIntermediateControlSequence = (code: DirectionCode, intermediateSteps: number, layer: number) => {
  let sequenceLength = 0n;
  const dir = directionSequence(robots.intermediates[layer - 1], code) + 'A';
  const cacheKey = `${code}-${dir}-${layer}`;
  if (intermediateCache[cacheKey]) {
    sequenceLength = intermediateCache[cacheKey];
  } else {
    for (const letter of dir) {
      if (layer < intermediateSteps) {
        sequenceLength += createIntermediateControlSequence(letter as DirectionCode, intermediateSteps, layer + 1);
      } else {
        sequenceLength += BigInt((directionSequence(robots.human, letter as DirectionCode) + 'A').length);
        robots.human = letter as DirectionCode;
      }
    }
    intermediateCache[cacheKey] = sequenceLength;
  }
  robots.intermediates[layer - 1] = code;
  return sequenceLength;
};

const enterDoorCode = (code: string, intermediateSteps: number = 2) => {
  let sequenceLength = 0n;
  for (const letter of code) {
    const dir = doorCodeSequence(robots.door, letter as DoorCode) + 'A';
    for (const l of dir) {
      sequenceLength += createIntermediateControlSequence(l as DirectionCode, intermediateSteps, 1);
    }
    robots.door = letter as DoorCode;
  }
  const numericCode = BigInt(parseInt(code));
  return sequenceLength * numericCode;
};

resetRobots(1);
console.log(
  'Part 1:',
  codes.map((code) => enterDoorCode(code, 1)).reduce((a, b) => a + b, 0n),
);
resetRobots(24);
console.log(
  'Part 2:',
  codes.map((code) => enterDoorCode(code, 24)).reduce((a, b) => a + b, 0n),
);
