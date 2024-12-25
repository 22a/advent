import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

type Point = { x: number; y: number };

const machines = input.split('\n\n').map((machineStr) => {
  let [buttonA, buttonB, prize]: Point[] = machineStr.split('\n').map((line) => {
    let [rest, y] = line.split(/, Y=?/);
    let [_guff, x] = rest.split(/ X=?/);
    return { x: Number(x), y: Number(y) };
  });
  return { buttonA, buttonB, prize };
});

function solve(prize: Point, buttonA: Point, buttonB: Point): { a: number; b: number } | null {
  // aX * a + bX * b = pX
  // aY * a + bY * b = pY
  // aX aY bX bY pX pY known, solving for a and b
  const denominator = buttonA.x * buttonB.y - buttonA.y * buttonB.x;
  if (denominator === 0) {
    return null;
  }
  const a = (prize.x * buttonB.y - prize.y * buttonB.x) / denominator;
  const b = (prize.x - buttonA.x * a) / buttonB.x;
  if (a % 1 !== 0 || b % 1 !== 0) {
    return null;
  }
  return { a, b };
}

let costs = 0;
for (let machine of machines) {
  const coefficients = solve(machine.prize, machine.buttonA, machine.buttonB);
  if (coefficients) {
    costs += coefficients.a * 3 + coefficients.b;
  }
}
console.log('Part 1:', costs);

costs = 0;
for (let machine of machines) {
  const prizeOffset = 10_000_000_000_000;
  machine.prize = { x: machine.prize.x + prizeOffset, y: machine.prize.y + prizeOffset };
  const coefficients = solve(machine.prize, machine.buttonA, machine.buttonB);
  if (coefficients) {
    costs += coefficients.a * 3 + coefficients.b;
  }
}
console.log('Part 2:', costs);
