const fs = require('fs')

const lines = fs.readFileSync('../input.txt', 'utf8').trim().split('\n')
const nums = lines.map(Number)

for (let i = 0; i < nums.length - 1; i++) {
  for (let j = i + 1; j < nums.length; j++) {
    if (nums[i] + nums [j] === 2020) {
      console.log('Part 1:', nums[i] * nums[j]);
    }
  }
}

for (let i = 0; i < nums.length - 2; i++) {
  for (let j = i + 1; j < nums.length - 1; j++) {
    if (nums[i] + nums [j] < 2020) {
      for (let k = j + 1; k < nums.length; k++) {
        if (nums[i] + nums [j] + nums[k] === 2020) {
          console.log('Part 2:', nums[i] * nums[j] * nums[k]);
        }
      }
    }
  }
}
