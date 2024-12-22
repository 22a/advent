import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const secrets = input.split('\n').map(BigInt);
const evolve = (seed: bigint, iterations: number) => {
  const steps: bigint[] = [seed];
  let current = seed;
  for (let i = 0; i < iterations; i++) {
    for (let op of [(x: bigint) => x * 64n, (x: bigint) => x / 32n, (x: bigint) => x * 2048n]) {
      let temp = op(current);
      current ^= temp;
      current %= 16777216n;
    }
    steps.push(current);
  }
  return steps;
};
const sequences = secrets.map((secret) => evolve(secret, 2000));
console.log(
  'Part 1:',
  sequences.reduce((a, b) => a + b[b.length - 1], 0n),
);

const deltaSequences = sequences.map((secret, i) => {
  let last = secret[0];
  let deltas: number[] = [];
  for (let j = 1; j < secret.length; j++) {
    let current = secret[j];
    let delta = Number(current % 10n) - Number(last % 10n);
    deltas.push(delta);
    last = current;
  }
  return deltas;
});
const overallYields: Record<string, number> = {};
for (let j = 0; j < deltaSequences.length; j++) {
  const deltaSequence = deltaSequences[j];
  const sequenceYields: Record<string, number> = {};
  for (let i = 4; i < deltaSequence.length; i++) {
    let sequence = deltaSequence.slice(i - 4, i);
    let key = sequence.join(',');
    if (sequenceYields[key] === undefined) {
      sequenceYields[key] = Number(sequences[j][i] % 10n);
    }
  }
  Object.entries(sequenceYields).forEach(([key, value]) => {
    overallYields[key] = (overallYields[key] || 0) + value;
  });
}
console.log(
  'Part 2:',
  Object.entries(overallYields).reduce((a, b) => (a[1] > b[1] ? a : b)),
);
