const fs = require('fs')
const lines = fs.readFileSync('../input.txt', 'utf8').trim().split('\n')

const octopuses = lines.map((line) => line.split('').map(Number))

let flashes = 0

const energize = (os, row, col, spent) => {
  if (
    spent.has(`${row},${col}`) ||
    row < 0 ||
    row >= os.length ||
    col < 0 ||
    col >= os[0].length
  ) {
    return
  }
  os[row][col] = os[row][col] + 1
  if (os[row][col] > 9) {
    flashes++
    os[row][col] = 0
    spent.add(`${row},${col}`)
    energize(os, row - 1, col, spent)
    energize(os, row - 1, col - 1, spent)
    energize(os, row - 1, col + 1, spent)
    energize(os, row + 1, col, spent)
    energize(os, row + 1, col - 1, spent)
    energize(os, row + 1, col + 1, spent)
    energize(os, row, col - 1, spent)
    energize(os, row, col + 1, spent)
  }
}

for (let i = 0; i < 100; i++) {
  const spent = new Set()
  for (let row = 0; row < octopuses.length; row++) {
    for (let col = 0; col < octopuses[row].length; col++) {
      energize(octopuses, row, col, spent)
    }
  }
}

console.log('Part 1:', flashes)

let i = 0
while (++i) {
  const spent = new Set()
  for (let row = 0; row < octopuses.length; row++) {
    for (let col = 0; col < octopuses[row].length; col++) {
      energize(octopuses, row, col, spent)
    }
  }
  if (spent.size === 100) {
    console.log('Part 2:', i + 100)
    process.exit(0)
  }
}
