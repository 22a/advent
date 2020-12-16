const lines = require('fs').readFileSync('../input.txt', 'utf8').trim().split('\n')

const movements = lines.map(line =>
  ({op: line[0], val: Number(line.substring(1))})
)

// north: 0, east: 90, south: 180, west: 270
let heading = 90;
let x = 0
let y = 0

for (let movement of movements) {
  switch (movement.op) {
    case 'N':
      y += movement.val
      break
    case 'S':
      y -= movement.val
      break
    case 'E':
      x += movement.val
      break
    case 'W':
      x -= movement.val
      break
    case 'R':
      heading = (heading + movement.val) % 360
      break
    case 'L':
      let d = (heading - movement.val)
      if (d < 0) {
        d = 360 + d
      }
      heading = d % 360
      break
    case 'F':
      switch (heading) {
        case 0:
          y += movement.val
          break
        case 90:
          x += movement.val
          break
        case 180:
          y -= movement.val
          break
        case 270:
          x -= movement.val
          break
      }
      break
  }
}

console.log('Part 1:', Math.abs(x) + Math.abs(y))

const rotateAroundOrigin = (x, y, theta) => {
  let rads = Math.PI / 180 * theta
  let cos = Math.cos(rads)
  let sin = Math.sin(rads)
  return [cos * x + sin * y, cos * y - sin * x];
}

x = 0
y = 0
dx = 10
dy = 1

for (let movement of movements) {
  switch (movement.op) {
    case 'N':
      dy += movement.val
      break
    case 'S':
      dy -= movement.val
      break
    case 'E':
      dx += movement.val
      break
    case 'W':
      dx -= movement.val
      break
    case 'R':
      [dx, dy] = rotateAroundOrigin(dx, dy, movement.val)
      break
    case 'L':
      [dx, dy] = rotateAroundOrigin(dx, dy, -movement.val)
      break
    case 'F':
      x += movement.val * dx
      y += movement.val * dy
      break
  }
}

console.log('Part 2:', Math.abs(x) + Math.abs(y))
