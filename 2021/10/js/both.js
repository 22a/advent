const fs = require('fs')
const lines = fs.readFileSync('../input.txt', 'utf8').trim().split('\n')

const parse = (line) => {
  const stack = []
  for (const char of line) {
    switch (char) {
      case '(':
      case '[':
      case '{':
      case '<':
        stack.push(char)
        break
      case ')': {
        const top = stack.pop()
        if (top !== '(') {
          return char
        }
        break
      }
      case ']': {
        const top = stack.pop()
        if (top !== '[') {
          return char
        }
        break
      }
      case '}': {
        const top = stack.pop()
        if (top !== '{') {
          return char
        }
        break
      }
      case '>': {
        const top = stack.pop()
        if (top !== '<') {
          return char
        }
        break
      }
    }
  }
  return stack
}

const errorPoints = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

const parsedLines = lines.map(parse)

const errorTotalForFile = parsedLines
  .filter((line) => !Array.isArray(line))
  .map((errorChar) => errorPoints[errorChar])
  .reduce((a, b) => a + b)

console.log('Part 1:', errorTotalForFile)

const incompleteLines = parsedLines.filter(Array.isArray)

const autocompletePoints = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

const closingStrings = incompleteLines.map((incompleteLine) => {
  const closingChars = []
  for (let i = incompleteLine.length - 1; i >= 0; i--) {
    switch (incompleteLine[i]) {
      case '(':
        closingChars.push(')')
        break
      case '[': {
        closingChars.push(']')
        break
      }
      case '{': {
        closingChars.push('}')
        break
      }
      case '<': {
        closingChars.push('>')
        break
      }
    }
  }
  return closingChars
})

const computeScore = (closingString) =>
  closingString.reduce((acc, char) => acc * 5 + autocompletePoints[char], 0)

const autocompleteScores = closingStrings.map(computeScore)

autocompleteScores.sort((a, b) => a - b)

console.log(
  'Part 2:',
  autocompleteScores[Math.floor(autocompleteScores.length / 2)],
)
