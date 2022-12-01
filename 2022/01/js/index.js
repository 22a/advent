const fs = require('fs')

const elves = fs.readFileSync('../input.txt', 'utf8').trim().split('\n\n')
const cals = elves.map(inventory => inventory.split('\n').map(Number))
const totals = cals.map(inventory => inventory.reduce((acc, cal) => acc + cal), 0)
const highestCalTotal = Math.max(...totals)
console.log('Part 1: ', highestCalTotal)

totals.sort((a, b) => b - a)
console.log('Part 2: ', totals[0] + totals[1] + totals[2])
