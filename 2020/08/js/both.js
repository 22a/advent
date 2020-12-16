const lines = require('fs').readFileSync('../input.txt', 'utf8').trim().split('\n')

const instructions = lines.map(line => {
  const [op, numStr] = line.split(' ')
  return {op, num: Number(numStr)}
})

const detectLoop = instructions => {
  let loopDetected = false
  let pc = 0
  let acc = 0
  let visitedAddresses = new Set()

  while (!loopDetected) {
    const instruction = instructions[pc]
    switch (instruction.op) {
      case 'acc':
        acc += instruction.num
      case 'nop':
        pc++
        break
      case 'jmp':
        pc += instruction.num
        break
    }
    if (visitedAddresses.has(pc)) {
      loopDetected = true
      return {acc, terminated: false}
    } else {
      if (pc === instructions.length) {
        return {acc, terminated: true}
      }
      visitedAddresses.add(pc)
    }
  }
}

console.log('Part 1:', detectLoop(instructions).acc)

instructions.forEach((instruction, i) => {
  if (instruction.op === 'jmp' || instruction.op === 'nop') {
    const scratchInstructions = JSON.parse(JSON.stringify(instructions))
    if (instruction.op === 'jmp') {
      scratchInstructions[i].op = 'nop'
    } else {
      scratchInstructions[i].op = 'jmp'
    }
    const executionResult = detectLoop(scratchInstructions)
    if (executionResult.terminated) {
      console.log('Part 2:', executionResult.acc)
    }
  }
})
