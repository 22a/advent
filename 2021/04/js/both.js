const fs = require('fs')
const lines = fs.readFileSync('../input.txt', 'utf8').trim().split('\n')
const numbers = lines[0].trim().split(',').map(Number)

const boards = []
const boardHeight = 6

for (let i = boardHeight; i < lines.length; i += boardHeight) {
  const board = []
  for (let j = 0; j < boardHeight - 1; j++) {
    const inputIndex = i - boardHeight + j + 2
    board.push(
      lines[inputIndex]
        .split(' ')
        .filter((n) => n !== '')
        .map(Number),
    )
  }
  boards.push(board)
}

const sumOfUnmarkedNumbers = (board, pastNumbers) =>
  board
    .flat()
    .filter((n) => !pastNumbers.includes(n))
    .reduce((acc, n) => acc + n, 0)

const boardHasWinner = (board, pastNumbers) => {
  for (const row of board) {
    if (row.every((num) => pastNumbers.includes(num))) {
      return { won: true, winningSum: sumOfUnmarkedNumbers(board, pastNumbers) }
    }
  }
  for (let i = 0; i < board.length; i++) {
    const col = []
    for (let j = 0; j < board[i].length; j++) {
      col.push(board[j][i])
    }
    if (col.every((num) => pastNumbers.includes(num))) {
      return { won: true, winningSum: sumOfUnmarkedNumbers(board, pastNumbers) }
    }
  }
  return { won: false }
}

const pastNumbers = []
const remainingBoards = [...boards]

for (const currentNum of numbers) {
  pastNumbers.push(currentNum)

  for (let i = 0; i < remainingBoards.length; i++) {
    const { won, winningSum } = boardHasWinner(remainingBoards[i], pastNumbers)
    if (won) {
      if (remainingBoards.length === 1) {
        console.log('Part 2:', currentNum * winningSum)
        return
      } else {
        if (remainingBoards.length === boards.length) {
          console.log('Part 1:', currentNum * winningSum)
        }
        remainingBoards.splice(i, 1)
      }
    }
  }
}
