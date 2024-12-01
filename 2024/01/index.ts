import fs from "fs";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const input = fs.readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'input.txt'), 
  "utf8"
);

const lines = input.split("\n");

console.log(lines);
