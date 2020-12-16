const lines = require('fs').readFileSync('../input.txt', 'utf8').trim().split('\n')

const initialSeatmap = lines.map(line => [...line])

const naiveNeighbourCounts = (seatmap, row, col) => {
  const counts = {};
  for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, seatmap.length - 1); i++) {
    for (let j = Math.max(col - 1, 0); j <= Math.min(col + 1, seatmap[i].length - 1); j++) {
      if (!(i === row && j === col)) {
        counts[seatmap[i][j]] = (counts[seatmap[i][j]] || 0) + 1
      }
    }
  }
  return counts;
}

const naiveReorganiseSeats = seatmap => {
  let changeCount = 0
  const newSeatmap = Array(seatmap.length)
  for (let i = 0; i < seatmap.length; i++) {
    newSeatmap[i] = Array(seatmap[i].length)
    for (let j = 0; j < seatmap[i].length; j++) {
      const neighbours = naiveNeighbourCounts(seatmap, i, j)
      if (seatmap[i][j] === 'L' && !neighbours['#']) {
        newSeatmap[i][j] = '#'
        changeCount++
      } else if (seatmap[i][j] === '#' && neighbours['#'] >= 4) {
        newSeatmap[i][j] = 'L'
        changeCount++
      } else {
        newSeatmap[i][j] = seatmap[i][j]
      }
    }
  }
  return {newSeatmap, changeCount}
}

let stable = false
let scratchMap = initialSeatmap
while (!stable) {
  let updated = naiveReorganiseSeats(scratchMap)
  scratchMap = updated.newSeatmap
  if (updated.changeCount === 0) {
    stable = true
  }
}

const naiveOccupiedCount = scratchMap.flat(1).filter(s => s === '#').length
console.log('Part 1:', naiveOccupiedCount)

const searchInDirection = (seatmap, row, col, dx, dy) => {
  const nextX = col + dx
  const nextY = row + dy
  if (nextX < 0 || nextX >= seatmap.length || nextY < 0 || nextY >= seatmap[0].length) {
    return '.'
  } else {
    const next = seatmap[nextY][nextX]
    if (next === '.') {
      return searchInDirection(seatmap, nextY, nextX, dx, dy)
    } else {
      return next
    }
  }
}

const neighbourCounts = (seatmap, row, col) => {
  const counts = {};
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (!(i === 0 && j === 0)) {
        const res = searchInDirection(seatmap, row, col, j, i)
        counts[res] = (counts[res] || 0) + 1
      }
    }
  }
  return counts;
}

const reorganiseSeats = seatmap => {
  let changeCount = 0
  const newSeatmap = Array(seatmap.length)
  for (let i = 0; i < seatmap.length; i++) {
    newSeatmap[i] = Array(seatmap[i].length)
    for (let j = 0; j < seatmap[i].length; j++) {
      const neighbours = neighbourCounts(seatmap, i, j)
      if (seatmap[i][j] === 'L' && !neighbours['#']) {
        newSeatmap[i][j] = '#'
        changeCount++
      } else if (seatmap[i][j] === '#' && neighbours['#'] >= 5) {
        newSeatmap[i][j] = 'L'
        changeCount++
      } else {
        newSeatmap[i][j] = seatmap[i][j]
      }
    }
  }
  return {newSeatmap, changeCount}
}

stable = false
scratchMap = initialSeatmap
while (!stable) {
  let updated = reorganiseSeats(scratchMap)
  scratchMap = updated.newSeatmap
  if (updated.changeCount === 0) {
    stable = true
  }
}

const occupiedCount = scratchMap.flat(1).filter(s => s === '#').length
console.log('Part 2:', occupiedCount)
