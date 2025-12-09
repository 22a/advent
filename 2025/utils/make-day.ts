import fs from 'fs';
import path from 'path';

const day = process.argv[2];
if (!day) {
  console.error('Please provide a day number (e.g., \`pnpm make-day 02\`)');
  process.exit(1);
}

const dirPath = path.join(process.cwd(), day);

try {
  fs.mkdirSync(dirPath);
  const indexContent = `
import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const lines = input.split('\\n');
console.log(lines);
`.trim();
  fs.writeFileSync(path.join(dirPath, 'index.ts'), indexContent);
  fs.writeFileSync(path.join(dirPath, 'input.txt'), '');
  fs.writeFileSync(path.join(dirPath, 'example.txt'), '');
} catch (error) {
  console.error('Error scaffolding day:', error);
  process.exit(1);
}
