const lines = require('fs').readFileSync('../input.txt', 'utf8').trim().split('\n')

const joltages = lines.map(Number).sort((a, b) => a - b)
joltages.push(joltages[joltages.length - 1] + 3)

const diffs = {}
let currentJoltage = 0;
for (let i of joltages) {
  const diff = i - currentJoltage
  diffs[diff] = (diffs[diff] || 0) + 1
  currentJoltage = i
}

console.log('Part 1:', diffs[1] * diffs[3])

const joltagePath = [0, ...joltages]
const memo = [1]
for (let i = 1; i < joltagePath.length; i++) {
  memo[i] = 0
  let j = i - 1
  while (joltagePath[i] - joltagePath[j] <= 3) {
    memo[i] += memo[j--]
  }
}

console.log('Part 2:', memo[memo.length - 1])
