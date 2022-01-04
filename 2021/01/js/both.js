const fs = require('fs')
const lines = fs.readFileSync('../input.txt', 'utf8').trim().split('\n')
const numbers = lines.map(Number)

let increases = 0

for (let i = 1; i < numbers.length; i++) {
  if (numbers[i] > numbers[i - 1]) {
    increases++
  }
}

console.log('Part 1:', increases)

const windowSize = 3
let lastWindowSum = Infinity
increases = 0

for (let i = windowSize - 1; i < numbers.length; i++) {
  let windowSum = 0
  for (let j = 0; j < windowSize; j++) {
    windowSum += numbers[i - j]
  }
  if (windowSum > lastWindowSum) {
    increases++
  }
  lastWindowSum = windowSum
}

console.log('Part 2:', increases)
