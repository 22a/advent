import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export function readInput(importMetaUrl: string, useExample = false) {
  const filename = useExample ? 'example.txt' : 'input.txt';
  if (useExample) {
    console.log('\x1b[43m \x1b[30m ### EXAMPLE ### \x1b[0m');
  }
  return fs.readFileSync(join(dirname(fileURLToPath(importMetaUrl)), filename), 'utf8');
}
