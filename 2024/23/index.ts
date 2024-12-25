import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const connections = input.split('\n').map((line) => line.split('-'));
const graph: Record<string, Set<string>> = {};
for (const [a, b] of connections) {
  if (!graph[a]) graph[a] = new Set();
  if (!graph[b]) graph[b] = new Set();
  graph[a].add(b);
  graph[b].add(a);
}
const nodes = Object.keys(graph);
const completeNetworks: string[][] = [];
const buildConnected = (candidates: string[], network: string[]) => {
  if (network.length >= 2) completeNetworks.push([...network]);
  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    if (network.every((node) => graph[candidate]?.has(node))) {
      buildConnected(candidates.slice(i + 1), [...network, candidate]);
    }
  }
};
for (let i = 0; i < nodes.length; i++) {
  buildConnected(nodes.slice(i + 1), [nodes[i]]);
}
const triangles = completeNetworks.filter((network) => network.length === 3);
console.log('Part 1:', triangles.filter((network) => network.some((node) => node.startsWith('t'))).length);
const largestCompleteNetwork = completeNetworks.reduce((a, b) => (a.length > b.length ? a : b), completeNetworks[0]);
console.log('Part 2:', largestCompleteNetwork.sort().join(','));
