const fs = require('fs')
const lines = fs.readFileSync('../input.txt', 'utf8').trim().split('\n')

const binSearch = directions => {
  let low = 0
  let high = 2 ** directions.length
  ;[...directions].forEach((c, i) => {
    let adjustment = Math.ceil(2 ** (directions.length - i - 1))
    if (c === 'F' || c === 'L') {
      high -= adjustment
    } else {
      low += adjustment
    }
    if (i === directions.length - 1) {
      high = low;
    }
  })
  return high
}


const boardingPassToSeatCoord = boardingPass => {
  const rowDirs = boardingPass.substring(0, 7)
  const colDirs = boardingPass.substring(7)
  return {row: binSearch(rowDirs), col: binSearch(colDirs)};
}

const seatCoordToSeatId = ({row, col}) => row * 8 + col

const seatCoords = lines.map(boardingPassToSeatCoord)
const seatIds = seatCoords.map(seatCoordToSeatId)

console.log('Part 1:', Math.max(...seatIds))

const seatMap = seatCoords.reduce((acc, {row, col}) => {
  if (!acc[row]) {
    acc[row] = Array(8).fill('X')
  }
  acc[row][col] = '.'
  return acc;
}, [])

seatMap.forEach((row, i) => {
  row.forEach((col, j) => {
    if (i > 20 && i !== seatMap.length - 1 && col === 'X') {
      console.log('Part 2:', seatCoordToSeatId({row: i, col: j}))
    }
  })
})
