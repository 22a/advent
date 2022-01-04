const fs = require('fs')
const crabs = fs
  .readFileSync('../input.txt', 'utf8')
  .trim()
  .split(',')
  .map(Number)

const linearFuelCost = (crabs, point) => {
  return crabs.map((c) => Math.abs(point - c)).reduce((acc, c) => acc + c)
}

const triangularFuelCost = (crabs, point) => {
  return crabs
    .map((c) => {
      const depth = Math.abs(point - c)
      return (depth / 2) * (depth + 1)
    })
    .reduce((acc, c) => acc + c)
}

const low = Math.min(...crabs)
const high = Math.max(...crabs)

const linearCosts = []
const triangularCosts = []

for (let i = low; i < high; i++) {
  linearCosts.push(linearFuelCost(crabs, i))
  triangularCosts.push(triangularFuelCost(crabs, i))
}

console.log('Part 1:', Math.min(...linearCosts))
console.log('Part 2:', Math.min(...triangularCosts))
