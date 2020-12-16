const fs = require('fs')

const grid = fs.readFileSync('../input.txt', 'utf8').trim().split('\n')

const evaluateSlope = ([dx, dy]) => {
  let x = 0, y = 0, treesEncountered = 0

  while (y < grid.length) {
    if (grid[y][x] === '#') {
      treesEncountered++
    }
    x = (x + dx) % grid[0].length
    y += dy
  }

  return treesEncountered
}

console.log('Part 1:', evaluateSlope([3, 1]))

const searchSlopes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]]
const searchTreesEncountered = searchSlopes.map(evaluateSlope)
const searchTreeProduct = searchTreesEncountered.reduce((acc, i) => acc * i, 1)

console.log('Part 2:', searchTreeProduct)
