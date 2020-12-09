const lines = require('fs').readFileSync('../input.txt', 'utf8').trim().split('\n')

const nums = lines.map(Number)
const preambleLength = 25
let invalidMatch

for (let i = preambleLength; i < nums.length; i++) {
  let matchFound = false
  for (let j = i - preambleLength; j < i; j++) {
    for (let k = i - preambleLength; k < i; k++) {
      if (nums[j] !== nums[k] && nums[i] === nums[j] + nums[k]) {
        matchFound = true
      }
    }
  }
  if (!matchFound) {
    invalidMatch = nums[i]
    console.log('Part 1:', invalidMatch)
  }
}

for (let i = 0; i < nums.length; i++) {
  let j = i, sum = 0
  let range = []
  while(sum < invalidMatch) {
    const next = nums[j++]
    sum += next
    range.push(next)
  }
  if (sum === invalidMatch) {
    console.log('Part 2:', Math.min(...range) + Math.max(...range))
    break
  }
}
