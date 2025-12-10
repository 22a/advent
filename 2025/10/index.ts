import { MinPriorityQueue } from '@datastructures-js/priority-queue';
// @ts-expect-error
import solver from 'javascript-lp-solver';

import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

type Machine = { target: string; buttons: number[][]; joltages: number[] };
const machines = input.split('\n').map((line): Machine => {
  const [targetStr, rest] = line.split(']');
  const target = targetStr.slice(1);
  const [middle, joltagesStr] = rest.split('{');
  const joltages = joltagesStr
    .slice(0, joltagesStr.length - 1)
    .split(',')
    .map(Number);
  const buttons = middle
    .trim()
    .split(' ')
    .map((str) =>
      str
        .slice(1, str.length - 1)
        .split(',')
        .map(Number),
    );
  return { target, buttons, joltages };
});

const pressButton = (affectedLights: Machine['buttons'][0], state: string): string => {
  const newState = [...state];
  for (const lightIndex of affectedLights) {
    newState[lightIndex] = newState[lightIndex] === '.' ? '#' : '.';
  }
  return newState.join('');
};

type State = { cost: number; current: string };
const cheapestButtonSequence = (machine: Machine): number => {
  const startState = Array(machine.target.length).fill('.').join('');
  const queue = new MinPriorityQueue<State>({ compare: (a, b) => a.cost - b.cost });
  for (const button of machine.buttons) {
    queue.push({ cost: 1, current: pressButton(button, startState) });
  }
  while (queue.size()) {
    const next = queue.dequeue()!;
    if (next.current === machine.target) {
      return next.cost;
    }
    for (const button of machine.buttons) {
      queue.push({ cost: next.cost + 1, current: pressButton(button, next.current) });
    }
  }
  return 0;
};

console.log(
  'Part 1:',
  machines.map(cheapestButtonSequence).reduce((a, b) => a + b, 0),
);

function solveMachine(machine: Machine): number {
  const constraints: Record<string, { equal: number }> = {};
  for (let i = 0; i < machine.joltages.length; i++) {
    constraints[`light_${i}`] = { equal: machine.joltages[i] };
  }
  const variables: Record<string, any> = {};
  const ints: Record<string, 1> = {};
  for (let b = 0; b < machine.buttons.length; b++) {
    const name = `button_${b}`;
    let max = Infinity;
    for (const i of machine.buttons[b]) {
      max = Math.min(max, machine.joltages[i]);
    }
    if (!Number.isFinite(max)) max = 0;
    const v: Record<string, number> = {
      presses: 1,
      min: 0,
      max,
    };
    for (const i of machine.buttons[b]) {
      v[`light_${i}`] = 1;
    }
    variables[name] = v;
    ints[name] = 1;
  }
  const model = {
    optimize: 'presses',
    opType: 'min',
    constraints,
    variables,
    ints,
  };
  const result = solver.Solve(model);
  if (!result.feasible && result.status !== 'optimal') {
    throw new Error(`No solution: ${result.status}`);
  }
  return result.result;
}

console.log(
  'Part 2:',
  machines.map(solveMachine).reduce((a, b) => a + b, 0),
);
