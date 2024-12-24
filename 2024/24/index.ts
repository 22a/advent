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

while (logic.length > 0) {
  for (let i = 0; i < logic.length; i++) {
    const { left, right, operator, result } = logic[i];
    if (values[left] !== undefined && values[right] !== undefined) {
      if (operator === 'AND') {
        values[result] = values[left] && values[right];
      } else if (operator === 'OR') {
        values[result] = values[left] || values[right];
      } else {
        values[result] = values[left] !== values[right];
      }
      logic.splice(i, 1);
    }
  }
}
const zs = Object.entries(values)
  .filter(([key, _value]) => key.startsWith('z'))
  .sort(([key1, _value1], [key2, _value2]) => Number(key2.split('z')[1]) - Number(key1.split('z')[1]));

const result = zs.reduce((acc, [key, value]) => acc * 2 + (value ? 1 : 0), 0);
console.log('Part 1:', result);
