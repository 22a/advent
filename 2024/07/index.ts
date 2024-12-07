import { readInput as a } from '../utils/readInput.ts';
const s = a(import.meta.url, process.argv.includes('--example'));
const n = s.split('\n').map((r) => r.split(': ').flatMap((c) => c.split(' ').map(Number)));
const c = (r: number, t: number, [s, ...n]: number[], e: string[]): boolean => {
  if (s === undefined) return t === r;
  return e.map((p) => Number(p === '|' ? `${t || ''}${s}` : eval(`${t}${p}${s}`))).some((t) => c(r, t, n, e));
};
console.log(`Part 1: ${n.filter(([r, ...t]) => c(r, 0, t, ['+', '*'])).reduce((r, t) => r + t[0], 0)}`);
console.log(`Part 2: ${n.filter(([r, ...t]) => c(r, 0, t, ['+', '*', '|'])).reduce((r, t) => r + t[0], 0)}`);
