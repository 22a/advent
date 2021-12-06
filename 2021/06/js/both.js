const fs = require('fs')
const fish = fs
  .readFileSync('../input.txt', 'utf8')
  .trim()
  .split(',')
  .map(Number)

const calculateProgeny = (timespan, fish) => {
  const lifecycle = {}
  for (let i = 0; i < 10; i++) {
    lifecycle[i] = 0
  }
  for (const f of fish) {
    lifecycle[f] = lifecycle[f] + 1
  }
  for (let day = 0; day < timespan; day++) {
    const newBorns = lifecycle[0]
    for (let i = 1; i < 10; i++) {
      lifecycle[i - 1] = lifecycle[i]
    }
    lifecycle[8] = newBorns
    lifecycle[6] = lifecycle[6] + newBorns
  }
  return Object.values(lifecycle).reduce((acc, n) => acc + n)
}

console.log('Part 1:', calculateProgeny(80, fish))
console.log('Part 1:', calculateProgeny(256, fish))
