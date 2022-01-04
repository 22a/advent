const fs = require('fs')
const lines = fs.readFileSync('../input.txt', 'utf8').trim().split('\n')
const numDigits = lines[0].length

const bitTotals = lines.reduce((acc, line) => {
  for (let i = 0; i < line.length; i++) {
    acc[i] = acc[i] + Number(line[i])
  }
  return acc
}, new Array(lines[0].length).fill(0))

const mostCommonDigitsStr = bitTotals.reduce((acc, i) => {
  return acc + Number(i >= lines.length / 2)
}, '')

const gamma = parseInt(mostCommonDigitsStr, 2)
// i'm too lazy to figure out how to invert the gamma bits with a mask in JS
// properly, so instead we're very expensively inverting the bit string
const epsilon = parseInt(
  mostCommonDigitsStr
    .replaceAll('0', 'X')
    .replaceAll('1', '0')
    .replaceAll('X', '1'),
  2,
)

console.log('Part 1:', gamma * epsilon)

const findRating = ({ targetIsHigh }) => {
  let remainingLines = lines
  for (let i = 0; i < numDigits; i++) {
    const zeroesAndOnes = [[], []]
    for (const line of remainingLines) {
      zeroesAndOnes[Number(line[i])].push(line)
    }
    remainingLines =
      zeroesAndOnes[0].length > zeroesAndOnes[1].length
        ? zeroesAndOnes[targetIsHigh ? 0 : 1]
        : zeroesAndOnes[targetIsHigh ? 1 : 0]
    if (remainingLines.length === 1) {
      return parseInt(remainingLines[0], 2)
    }
  }
}

console.log(
  'Part 2:',
  findRating({ targetIsHigh: true }) * findRating({ targetIsHigh: false }),
)
