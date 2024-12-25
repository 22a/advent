import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const lines = input.split('\n');
const reports = lines.map((line) => line.split(' ').map(Number));

const numMatchingReports = (reports: number[][], { acceptableBadness = 0 }: { acceptableBadness?: number } = {}) => {
  const matchingReports = reports.filter((report) => {
    let badness = 0;
    let direction: 'inc' | 'dec' | null = null;
    for (let i = 0; i < report.length - 1; i++) {
      if (report[i] > report[i + 1]) {
        if (direction === 'inc') {
          badness++;
          continue;
        }
        direction = 'dec';
      } else {
        if (direction === 'dec') {
          badness++;
          continue;
        }
        direction = 'inc';
      }
      const delta = Math.abs(report[i] - report[i + 1]);
      if (delta > 3 || delta < 1) {
        badness++;
        continue;
      }
    }
    return badness <= acceptableBadness;
  });
  return matchingReports.length;
};

console.log('Part 1:', numMatchingReports(reports));
console.log('Part 2:', numMatchingReports(reports, { acceptableBadness: 1 }));
