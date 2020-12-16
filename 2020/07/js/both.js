const lines = require('fs').readFileSync('../input.txt', 'utf8').trim().split('\n')

const containers = lines.map(line => {
  const [parent, childrenString] = line.split(' bags contain ')
  const children = childrenString.startsWith('no') ? [] :
    childrenString.split(', ').map(child => {
      let [count, adjective, color] = child.split(' ');
      return {count, color: `${adjective} ${color}`}
    })
  return {parent, children}
})

const containerMap = containers.reduce((acc, i) =>
  ({...acc, [i.parent]: i.children}), {})

const canContain = (containerName, target) => {
  const canDirectlyContain = containerMap[containerName]
    .some(child => child.color === target)
  return canDirectlyContain || containerMap[containerName]
    .some(child => canContain(child.color, target))
}

const containersThatCanContainShinyGold = Object.keys(containerMap)
  .filter(parent => canContain(parent, 'shiny gold'))

console.log('Part 1:', containersThatCanContainShinyGold.length)

const transitiveBagTotalCost = containerName => {
  let childCosts = containerMap[containerName].map(child => {
    return child.count * (1 + transitiveBagTotalCost(child.color))
  })
  return childCosts.reduce((acc, i) => acc + i, 0)
}

console.log('Part 2:', transitiveBagTotalCost('shiny gold'))
