import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const map = input.split('\n').map((line) => line.split(''));
const antennae: Record<string, { x: number; y: number }[]> = map.reduce((acc, line, y) => {
  return line.reduce((lineAcc, char, x) => {
    if (char !== '.') {
      lineAcc[char] = [...(lineAcc[char] || []), { x, y }];
    }
    return lineAcc;
  }, acc);
}, {});

const countAntinodes = ({ part2 }: { part2?: boolean } = {}) => {
  let antinodes: Record<string, { x: number; y: number }[]> = {};
  Object.entries(antennae).forEach(([frequency, antennaeForFrequency]) => {
    antennaeForFrequency.forEach((antenna1) => {
      antennaeForFrequency.forEach((antenna2) => {
        if (antenna1.x === antenna2.x && antenna1.y === antenna2.y) return;
        const deltaX = antenna2.x - antenna1.x;
        const deltaY = antenna2.y - antenna1.y;
        let potentialAntinode = {
          x: (part2 ? antenna1 : antenna2).x + deltaX,
          y: (part2 ? antenna1 : antenna2).y + deltaY,
        };
        while (
          potentialAntinode.x >= 0 &&
          potentialAntinode.y >= 0 &&
          potentialAntinode.x < map[0].length &&
          potentialAntinode.y < map.length
        ) {
          if (!antinodes[frequency]) antinodes[frequency] = [];
          antinodes[frequency].push(potentialAntinode);
          potentialAntinode = {
            x: potentialAntinode.x + deltaX,
            y: potentialAntinode.y + deltaY,
          };
          if (!part2) {
            break;
          }
        }
      });
    });
  });
  return new Set(
    Object.values(antinodes)
      .flat()
      .map((antinode) => `${antinode.x},${antinode.y}`),
  ).size;
};

console.log('Part 1:', countAntinodes());
console.log('Part 2:', countAntinodes({ part2: true }));
