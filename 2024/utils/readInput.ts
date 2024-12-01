import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export function readInput(importMetaUrl: string, useExample = false) {
  const filename = useExample ? 'example.txt' : 'input.txt';
  return fs.readFileSync(join(dirname(fileURLToPath(importMetaUrl)), filename), 'utf8');
}
