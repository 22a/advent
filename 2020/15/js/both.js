const startingSeq = require('fs').readFileSync('../input.txt', 'utf8').trim().split(',').map(Number)

const solve = targetTurn => {
  const history = {}
  let turn = 0
  let previous

  const say = num => {
    previous = num
    history[num] = {
      last: ++turn,
      penultimate: history[num] && history[num].last
    }
  }

  startingSeq.forEach(say);

  while (turn < targetTurn) {
    const {last, penultimate} = history[previous]
    say(last - (penultimate || last))
  }

  return previous
}

console.log('Part 1:', solve(2020))
console.log('Part 2:', solve(30000000))
