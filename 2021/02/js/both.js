const fs = require('fs')
const lines = fs.readFileSync('../input.txt', 'utf8').trim().split('\n')

const movements = lines.map((line) => {
  const [direction, distance] = line.split(' ')
  return {
    direction,
    distance: Number(distance),
  }
})

let x = 0,
  y = 0

movements.forEach((movement) => {
  switch (movement.direction) {
    case 'forward':
      x += movement.distance
      break
    case 'down':
      y += movement.distance
      break
    case 'up':
      y -= movement.distance
      break
  }
})

console.log('Part 1:', x * y)

let aim = 0
x = 0
y = 0

movements.forEach((movement) => {
  switch (movement.direction) {
    case 'forward':
      x += movement.distance
      y += movement.distance * aim
      break
    case 'down':
      aim += movement.distance
      break
    case 'up':
      aim -= movement.distance
      break
  }
})

console.log('Part 2:', x * y)
