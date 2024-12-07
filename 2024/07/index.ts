import { readInput as s } from '../utils/readInput.ts';
const t = s(import.meta.url, process.argv.includes('--example'));
const r = t.split('\n').map((r) => r.split(': ').flatMap((r) => r.split(' ').map(Number)));
const c = (r: number, t: number, [s, ...n]: number[], e: string[]): boolean => {
  if (s === undefined) return t === r;
  return e.map((p) => Number(p === '|' ? `${t || ''}${s}` : eval(`${t}${p}${s}`))).some((t) => c(r, t, n, e));
};
console.log(`Part 1: ${r.filter(([r, ...t]) => c(r, 0, t, ['+', '*'])).reduce((r, t) => r + t[0], 0)}`);
console.log(`Part 2: ${r.filter(([r, ...t]) => c(r, 0, t, ['+', '*', '|'])).reduce((r, t) => r + t[0], 0)}`);
