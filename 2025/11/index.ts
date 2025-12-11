import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

type Device = { name: string; outputs: string[] };
const devicesMap: Record<Device['name'], Device['outputs']> = input
  .split('\n')
  .map((line) => {
    const [name, outsRaw] = line.split(': ');
    return { name, outputs: outsRaw.split(' ') };
  })
  .reduce((acc, device) => ({ ...acc, [device.name]: device.outputs }), {});
let cache: Record<Device['name'], number> = {};
const pathsOut = (deviceName: Device['name']): number => {
  if (deviceName === 'out') return 1;
  if (cache[deviceName] !== undefined) return cache[deviceName];
  let paths = 0;
  devicesMap[deviceName].forEach((output) => (paths += pathsOut(output)));
  cache[deviceName] = paths;
  return paths;
};
console.log('Part 1:', pathsOut('you'));

let pathCache: Record<string, number> = {};
const cacheKey = (deviceName: Device['name'], via: Device['outputs']) =>
  `${deviceName}:${via.includes('fft')}:${via.includes('dac')}}`;
const pathsThrough = (deviceName: Device['name'], via: Device['outputs']): number => {
  if (deviceName === 'out') return Number(via.includes('fft') && via.includes('dac'));
  let key = cacheKey(deviceName, via);
  if (pathCache[key] !== undefined) return pathCache[key];
  let paths = 0;
  devicesMap[deviceName].forEach((output) => (paths += pathsThrough(output, [...via, deviceName])));
  pathCache[key] = paths;
  return paths;
};
console.log('Part 2:', pathsThrough('svr', []));
