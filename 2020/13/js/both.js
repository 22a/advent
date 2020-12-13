const lines = require('fs').readFileSync('../input.txt', 'utf8').trim().split('\n')

const time = Number(lines[0])
const busIds = lines[1].split(',').map(Number).filter(id => !isNaN(id))

const timesToDeparture = busIds.map(id => id - time % id)
const soonestDepature = Math.min(...timesToDeparture)
const soonestDepatureBusId = busIds[timesToDeparture.indexOf(soonestDepature)]

console.log('Part 1:', soonestDepature * soonestDepatureBusId)

const indexedBusIds = lines[1].split(',')
  .map((idStr, i) => ({busId: Number(idStr), index: i}))
  .filter(i => !isNaN(i.busId))

let t = indexedBusIds.shift().busId
let step = t
for (let {busId, index} of indexedBusIds) {
  while ((t + index) % busId) {
    t += step;
  }
  step = step * busId;
}

console.log('Part 2:', t)
