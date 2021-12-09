const fs = require('fs')
const grid = fs
  .readFileSync('../input.txt', 'utf8')
  .trim()
  .split('\n')
  .map((line) => line.split('').map(Number))

const lowPoints = []

for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    const current = grid[row][col]
    if (
      (row === 0 || current < grid[row - 1][col]) &&
      (row === grid.length - 1 || current < grid[row + 1][col]) &&
      (col === 0 || current < grid[row][col - 1]) &&
      (col === grid[0].length - 1 || current < grid[row][col + 1])
    ) {
      lowPoints.push(current)
    }
  }
}

console.log('Part 1:', lowPoints.reduce((a, b) => a + b) + lowPoints.length)

const dfs = (row, col) => {
  let size = 0
  if (
    row >= 0 &&
    col >= 0 &&
    row < grid.length &&
    col < grid[row].length &&
    grid[row][col] > -1 &&
    grid[row][col] < 9
  ) {
    size += 1
    grid[row][col] = -1
    size += dfs(row + 1, col)
    size += dfs(row - 1, col)
    size += dfs(row, col - 1)
    size += dfs(row, col + 1)
  }
  return size
}

const basins = []

for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[row][col] > -1 && grid[row][col] < 9) {
      basins.push(dfs(row, col))
    }
  }
}

const [a, b, c] = basins.sort((a, b) => b - a)

console.log('Part 2:', a * b * c)
