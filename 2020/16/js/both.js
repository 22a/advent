const sections = require('fs').readFileSync('../input.txt', 'utf8').trim()
  .split('\n\n')
  .map(s => s.split('\n'))

const validations = sections[0].map(s => {
  const [field, reqsStr]= s.split(': ')
  const reqs = reqsStr.split(' or ').map(r => {
    const [low, high] = r.split('-').map(Number)
    return {low, high}
  })
  return {field, reqs}
})
const yourTicket = sections[1][1].split(',').map(Number)
const nearbyTickets = sections[2].slice(1).map(t => t.split(',').map(Number))

const checkValidity = t =>
  validations.some(v =>
    v.reqs.some(r => t <= r.high && t >= r.low)
  )

const invalid = [yourTicket, ...nearbyTickets].flat().filter(t => !checkValidity(t))

console.log('Part 1:', invalid.reduce((a, b) => a + b, 0))

const unresolvedIndices = [...yourTicket.keys()]
const validTickets = [yourTicket, ...nearbyTickets].filter(t => t.every(checkValidity))

while (validations.filter(v => v.confirmedIndex === undefined).length) {
  for (const i of unresolvedIndices) {
    const vals = validTickets.flatMap(t => t[i])
    const matchingValidations = validations.filter(f =>
      f.confirmedIndex === undefined &&
      vals.every(v => f.reqs.some(r => v <= r.high && v >= r.low))
    )
    if (matchingValidations.length === 1) {
      matchingValidations[0].confirmedIndex = i
      unresolvedIndices.splice(unresolvedIndices.indexOf(i), 1)
    }
  }
}

const departureValidations = validations.filter(v => v.field.startsWith('departure'))

console.log('Part 2:', departureValidations.reduce((acc, v) => acc * yourTicket[v.confirmedIndex], 1))
