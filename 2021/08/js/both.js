const fs = require('fs')
const lines = fs.readFileSync('../input.txt', 'utf8').trim().split('\n')

const inputs = lines.map((line) => {
  const [left, right] = line.split(' | ')
  return {
    signalPatterns: left.split(' ').map((s) => [...s].sort().join('')),
    outputValueDigits: right.split(' ').map((s) => [...s].sort().join('')),
  }
})

const uniqueSegmentUsages = inputs
  .map((input) => {
    return input.outputValueDigits.filter((v) =>
      [2, 3, 4, 7].includes(v.length),
    ).length
  })
  .reduce((a, b) => a + b)

console.log('Part 1:', uniqueSegmentUsages)

let total = 0

for (const input of inputs) {
  const solved = []
  const unsolved = []

  for (const pattern of input.signalPatterns) {
    if (pattern.length === 2) {
      solved[1] = pattern
    } else if (pattern.length === 3) {
      solved[7] = pattern
    } else if (pattern.length === 4) {
      solved[4] = pattern
    } else if (pattern.length === 7) {
      solved[8] = pattern
    } else {
      unsolved[pattern.length] = unsolved[pattern.length] || []
      unsolved[pattern.length].push(pattern)
    }
  }

  for (const fiveLengthPattern of unsolved[5]) {
    if (
      [...solved[1]].filter((l) => fiveLengthPattern.includes(l)).length == 2
    ) {
      solved[3] = fiveLengthPattern
    } else if (
      [...solved[4]].filter((l) => fiveLengthPattern.includes(l)).length == 2
    ) {
      solved[2] = fiveLengthPattern
    } else {
      solved[5] = fiveLengthPattern
    }
  }

  for (const sixLengthPattern of unsolved[6]) {
    if (
      [...solved[5]].filter((l) => sixLengthPattern.includes(l)).length !== 5
    ) {
      solved[0] = sixLengthPattern
    } else if (
      [...solved[1]].filter((l) => sixLengthPattern.includes(l)).length === 2
    ) {
      solved[9] = sixLengthPattern
    } else {
      solved[6] = sixLengthPattern
    }
  }

  const lut = solved.reduce((acc, signal, i) => ({ ...acc, [signal]: i }), {})

  let value = ''
  for (const digit of input.outputValueDigits) {
    value += lut[digit]
  }
  total += Number(value)
}

console.log('Part 2:', total)
