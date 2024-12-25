import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const [initialState, conditionals] = input.split('\n\n').map((block) => block.split('\n'));

const values: Record<string, boolean> = {};
for (const line of initialState) {
  const [key, value] = line.split(': ');
  values[key] = value === '1';
}

const logic = conditionals.map((line) => {
  const [left, operator, right, _arrow, result] = line.split(' ');
  return { left, right, operator, result };
});

let scratchLogic = JSON.parse(JSON.stringify(logic));

while (scratchLogic.length > 0) {
  for (let i = 0; i < scratchLogic.length; i++) {
    const { left, right, operator, result } = scratchLogic[i];
    if (values[left] !== undefined && values[right] !== undefined) {
      if (operator === 'AND') {
        values[result] = values[left] && values[right];
      } else if (operator === 'OR') {
        values[result] = values[left] || values[right];
      } else {
        values[result] = values[left] !== values[right];
      }
      scratchLogic.splice(i, 1);
    }
  }
}
const zs = Object.entries(values)
  .filter(([key, _value]) => key.startsWith('z'))
  .sort(([key1, _value1], [key2, _value2]) => Number(key2.split('z')[1]) - Number(key1.split('z')[1]));

const result = zs.reduce((acc, [key, value]) => acc * 2 + (value ? 1 : 0), 0);
console.log('Part 1:', result);

// I attempted to add all 1s with all 0s, but the resulting zs were very far from all 1s so i moved on
// const newValues = { ...values };
// Object.keys(newValues).forEach((key) => {
//   if (key.startsWith('x')) {
//     newValues[key] = false;
//   } else if (key.startsWith('y')) {
//     newValues[key] = true;
//   }
// });
// scratchLogic = JSON.parse(JSON.stringify(logic));
// while (scratchLogic.length > 0) {
//   for (let i = 0; i < scratchLogic.length; i++) {
//     const { left, right, operator, result } = scratchLogic[i];
//     if (newValues[left] !== undefined && newValues[right] !== undefined) {
//       if (operator === 'AND') {
//         newValues[result] = newValues[left] && newValues[right];
//       } else if (operator === 'OR') {
//         newValues[result] = newValues[left] || newValues[right];
//       } else {
//         newValues[result] = newValues[left] !== newValues[right];
//       }
//       scratchLogic.splice(i, 1);
//     }
//   }
// }
// const newZs = Object.entries(newValues)
//   .filter(([key, _value]) => key.startsWith('z'))
//   .sort(([key1, _value1], [key2, _value2]) => Number(key2.split('z')[1]) - Number(key1.split('z')[1]));
// console.log(newZs);

import fs from 'fs';
import { execSync } from 'child_process';
import { attribute as _, Digraph, Node, Edge, toDot } from 'ts-graphviz';

const generateDotFor = (gateStrings: string[], filename: string) => {
  const logic = gateStrings.map((line) => {
    const [left, operator, right, _arrow, result] = line.split(' ');
    return { left, right, operator, result };
  });
  const graph = new Digraph({
    [_.id]: 'logic',
    [_.rankdir]: 'TB',
    [_.nodesep]: 0.5,
    [_.splines]: 'ortho',
    [_.ordering]: 'out',
    [_.ranksep]: 1.0,
    [_.bgcolor]: 'transparent',
  });
  const nodes = new Set<string>();
  const gates: Record<string, string> = {};
  for (const { left, right, operator, result } of logic) {
    let leftColor = left.startsWith('x') ? 'lightblue' : left.startsWith('y') ? 'lightgreen' : 'lightyellow';
    let rightColor = right.startsWith('x') ? 'lightblue' : right.startsWith('y') ? 'lightgreen' : 'lightyellow';
    if (!nodes.has(left)) {
      graph.addNode(new Node(left, { [_.shape]: 'box', [_.style]: 'filled', [_.fillcolor]: leftColor }));
      nodes.add(left);
    }
    if (!nodes.has(right)) {
      graph.addNode(new Node(right, { [_.shape]: 'box', [_.style]: 'filled', [_.fillcolor]: rightColor }));
      nodes.add(right);
    }
    const gateId = `${left}_${operator}_${right}`;
    graph.addNode(new Node(gateId, { [_.label]: operator, [_.shape]: 'diamond' }));
    gates[result] = gateId;
    if (!nodes.has(result)) {
      if (result.startsWith('z')) {
        graph.addNode(new Node(result, { [_.shape]: 'box', [_.style]: 'filled' }));
      } else {
        graph.addNode(new Node(result, { [_.shape]: 'box', [_.style]: 'filled', [_.fillcolor]: 'lightyellow' }));
      }
      nodes.add(result);
    }
    graph.addEdge(new Edge([new Node(left), new Node(gateId)]));
    graph.addEdge(new Edge([new Node(right), new Node(gateId)]));
    graph.addEdge(new Edge([new Node(gateId), new Node(result)]));
  }

  fs.writeFileSync(new URL(`${filename}.dot`, import.meta.url), toDot(graph));
  execSync(`dot -Tpng 24/${filename}.dot -o 24/${filename}.png`);
};

generateDotFor(conditionals, 'original');

const fmt = (n: number): string => n.toString().padStart(2, '0');
function generateAdderGateString(nBits: number): string[] {
  const gates: string[] = [];
  for (let i = 0; i < nBits; i++) {
    const a = `x${fmt(i)}`;
    const b = `y${fmt(i)}`;

    if (i === 0) {
      gates.push(`${a} XOR ${b} -> z${fmt(i)}`);
      gates.push(`${a} AND ${b} -> carry${fmt(i)}`);
    } else {
      const prevCarry = `carry${fmt(i - 1)}`;
      gates.push(`${a} XOR ${b} -> xor1_${fmt(i)}`);
      gates.push(`xor1_${fmt(i)} XOR ${prevCarry} -> z${fmt(i)}`);
      gates.push(`${a} AND ${b} -> and1_${fmt(i)}`);
      gates.push(`t1_${fmt(i)} AND ${prevCarry} -> and2_${fmt(i)}`);
      gates.push(`and1_${fmt(i)} OR and2_${fmt(i)} -> carry${fmt(i)}`);
    }
  }
  return gates;
}

generateDotFor(generateAdderGateString(44), 'new');
