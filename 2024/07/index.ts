import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const calibrations = input.split('\n').map((line) => {
  const [result, rest] = line.split(': ');
  const operands = rest.split(' ').map(Number);
  return { result: Number(result), operands };
});

const OPERATORS = {
  '+': (a: number, b: number) => a + b,
  '*': (a: number, b: number) => a * b,
  '||': (a: number, b: number) => Number(`${a}${b}`),
};

const hasValidCalibration = (
  targetResult: number,
  partialResult: number,
  remainingOperands: number[],
  operators: ((a: number, b: number) => number)[],
) => {
  if (remainingOperands.length === 0) return partialResult === targetResult;
  const [current, ...rest] = remainingOperands;
  const resultsAfterOperators = operators.map((operator) => operator(partialResult, current));
  return resultsAfterOperators.some((tempResult) => hasValidCalibration(targetResult, tempResult, rest, operators));
};

let validCalibrations = calibrations.filter(({ result, operands }) =>
  hasValidCalibration(result, 0, operands, [OPERATORS['+'], OPERATORS['*']]),
);
let sumOfValidCalibrations = validCalibrations.reduce((acc, i) => acc + i.result, 0);
console.log('Part 1:', sumOfValidCalibrations);

validCalibrations = calibrations.filter(({ result, operands }) =>
  hasValidCalibration(result, 0, operands, [OPERATORS['+'], OPERATORS['*'], OPERATORS['||']]),
);
sumOfValidCalibrations = validCalibrations.reduce((acc, i) => acc + i.result, 0);
console.log('Part 2:', sumOfValidCalibrations);
