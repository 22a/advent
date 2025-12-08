import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

type Coord = { x: number; y: number; z: number };
type Pair = { a: Coord; b: Coord; distance: number };
const boxes = input
  .split('\n')
  .map((line) => line.split(',').map(Number))
  .map(([x, y, z]) => ({ x, y, z }));
const circuits: Coord[][] = boxes.map((b) => [b]);
const pairs: Pair[] = [];
for (let i = 0; i < boxes.length; i++) {
  for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i];
    const b = boxes[j];
    pairs.push({ a, b, distance: Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) });
  }
}
pairs.sort((a, b) => a.distance - b.distance);
let connections = 0;
for (const { a, b } of pairs) {
  const aCircuitIndex = circuits.findIndex((circuit) => circuit.includes(a));
  const bCircuitIndex = circuits.findIndex((circuit) => circuit.includes(b));
  if (aCircuitIndex !== bCircuitIndex) {
    const otherCircuit = circuits.splice(Math.max(aCircuitIndex, bCircuitIndex), 1)[0];
    circuits[Math.min(aCircuitIndex, bCircuitIndex)].push(...otherCircuit);
    if (circuits.length === 1) {
      console.log('Part 2:', a.x * b.x);
      break;
    }
  }
  if (++connections === (process.argv.includes('--example') ? 10 : 1000)) {
    const sizes = circuits.map((s) => s.length).sort((a, b) => b - a);
    console.log('Part 1:', sizes[0] * sizes[1] * sizes[2]);
  }
}
