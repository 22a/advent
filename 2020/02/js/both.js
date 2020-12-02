const fs = require('fs')

const lines = fs.readFileSync('../input.txt', 'utf8').trim().split('\n')

const passwords = lines.map(line => {
  let [_all, low, high, char, pass] = line.match(/(\d+)-(\d+) (.): (.+)/);
  return {low, high, char, pass};
})

const part1ValidPasswords = passwords.filter(({low, high, char, pass}) => {
  let count = [...pass].reduce((total, c) => total + Number(c === char), 0)
  return count >= low && count <= high
})

console.log('Part 1:', part1ValidPasswords.length)

const part2ValidPasswords = passwords.filter(({low, high, char, pass}) =>
  pass[low - 1] === char ^ pass[high - 1] === char,
)

console.log('Part 2:', part2ValidPasswords.length)
