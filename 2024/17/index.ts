import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const [registersStr, programStr] = input.split('\n\n');
const registers: Record<string, bigint> = Object.fromEntries(
  registersStr.split('\n').map((line) => {
    const [register, value] = line.split(': ');
    return [register.slice(-1), BigInt(value)];
  }),
);
const program = programStr.split(' ')[1].split(',').map(Number);

const run = (program: number[], a: bigint) => {
  const registers = { A: a, B: 0n, C: 0n };
  const getCombo = (instruction: number) => {
    if (instruction >= 0 && instruction <= 3) {
      return BigInt(instruction);
    } else if (instruction === 4) {
      return registers.A;
    } else if (instruction === 5) {
      return registers.B;
    } else if (instruction === 6) {
      return registers.C;
    } else {
      return null;
    }
  };
  const outputBuffer: number[] = [];
  let pc = 0;
  while (pc < program.length) {
    const instruction = program[pc];
    const operand = program[pc + 1];
    const combo = getCombo(operand);
    if (instruction === 0) {
      if (combo === null) return [];
      registers.A /= 2n ** combo;
      pc += 2;
    } else if (instruction === 1) {
      registers.B ^= BigInt(operand);
      pc += 2;
    } else if (instruction === 2) {
      if (combo === null) return [];
      registers.B = combo % 8n;
      pc += 2;
    } else if (instruction === 3) {
      if (registers.A !== 0n) {
        pc = operand;
      } else {
        pc += 2;
      }
    } else if (instruction === 4) {
      registers.B ^= registers.C;
      pc += 2;
    } else if (instruction === 5) {
      if (combo === null) return [];
      outputBuffer.push(Number(combo % 8n));
      pc += 2;
    } else if (instruction === 6) {
      if (combo === null) return [];
      registers.B = registers.A / 2n ** combo;
      pc += 2;
    } else if (instruction === 7) {
      if (combo === null) return [];
      registers.C = registers.A / 2n ** combo;
      pc += 2;
    } else {
      throw new Error(`fucked instruction mate: ${program[pc]}`);
    }
  }
  return outputBuffer;
};

console.log('Part 1:', run(program, registers.A).join(','));

// given Program: 0,1,5,4,3,0
// 3,0 at the end will let us yeet off the tape, (if reg.A === 0)
// 5, 4 needs to be hit enough times to print the right answer
// at every stey its combo operand is 4 so register A, but my input is 5 so register B
// i want to ignore all bits of the program until this point (rather, use them to make my registers correct)
// let's work this puppy out manually
// 0,1 is div A by 2
// 5,4 is puts(reg.A % 8) <- we want to hit this 6 times with:
//   - in reverse order [0, 1, 5, 4, 3, 0]
//   - which required reg.A to be [0, 1, 10, 20, ...? ]
// 0,3 if reg.A is >0 then jump to reg.A % 8

// 117440 / 2 = 58720
// 58720 % 8 = 0
// 58720 / 2 = 29360
// 29360 % 8 = 0

// lmao wrong example

// given Program: 0,3,5,4,3,0
// 0,3 is div A by 2^3 (8)
// 5,4 is puts(reg.A % 8) <- we want to hit this 6 times with:
//   - in reverse order [0, 1, 5, 4, 3, 0]
//   - which required reg.A to be [0, 1, 10, 20, ...? ]
// 0,3 if reg.A is >0 then jump to reg.A % 8

// 117440 / 8 = 14680
//  -> 14680 % 8 = 0
// 14680 / 8 = 1835
//  -> 1835 % 8 = 3
// 1835 / 8 = 229
//  -> 229 % 8 = 5
// 229 / 8 = 28
//  -> 28 % 8 = 4
// 28 / 8 = 3
//  -> 3 % 8 = 3
// 3 / 8 = 0
//  -> 0 % 8 = 0

// my input is 2,4,1,1,7,5,0,3,1,4,4,0,5,5,3,0

// reg.B and reg.C are both 0, what reg.A satisfies:

// 2,4 is reg.B = reg.A % 8
// 1,1 is reg.B = reg.B ^ 1
// 7,5 is reg.C = reg.A / 2^reg.B
// 0,3 is reg.A = reg.A / 8
// 1,4 is reg.B = reg.B ^ reg.A
// 4,0 is reg.B = reg.B ^ reg.C
// 5,5 is puts(reg.B % 8) <- we want to hit this 16 times: 2,4,1,1,7,5,0,3,1,4,4,0,5,5,3,0
// 3,0 is reg.A > 0 ? pc = 0 : end

// need some N that can be divided 16 times
// and at every step, the resulting value in reg.B is the desired output after % 8

// lmao this didn't work lmao lmao lamo ^^^^ :)

const arrayEquals = (a: number[], b: number[]) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const target = [...program];
let soFar: number[] = [];
let a = 0n;
while (!arrayEquals(soFar, program)) {
  soFar.unshift(target.pop()!);
  let resultOfRun = run(program, a);
  while (!arrayEquals(resultOfRun, soFar)) {
    a++;
    resultOfRun = run(program, a);
  }
  if (soFar.length !== program.length) {
    a *= 8n;
  }
}

console.log('Part 2:', a);
