const fs = require('fs')
const lines = fs.readFileSync('../input.txt', 'utf8').trim().split('\n')

let maxX = 0
let maxY = 0

const clouds = lines.map((line) => {
  const [start, end] = line.split(' -> ')
  const [startX, startY] = start.split(',').map(Number)
  const [endX, endY] = end.split(',').map(Number)
  maxX = Math.max(maxX, startX, endX)
  maxY = Math.max(maxY, startY, endY)
  return { startX, startY, endX, endY }
})

const map = new Array(maxY + 1)
for (let i = 0; i < map.length; i++) {
  map[i] = new Array(maxX + 1).fill(0)
}

for (const cloud of clouds) {
  const cloudIsHorizontal = cloud.startY === cloud.endY
  const cloudIsVertical = cloud.startX === cloud.endX
  if (cloudIsHorizontal || cloudIsVertical) {
    if (cloudIsHorizontal) {
      for (
        let i = Math.min(cloud.startX, cloud.endX);
        i <= Math.max(cloud.startX, cloud.endX);
        i++
      ) {
        map[cloud.startY][i] = map[cloud.startY][i] + 1
      }
    } else {
      for (
        let i = Math.min(cloud.startY, cloud.endY);
        i <= Math.max(cloud.startY, cloud.endY);
        i++
      ) {
        map[i][cloud.startX] = map[i][cloud.startX] + 1
      }
    }
  }
}

let numBadOverlaps = map.flat().filter((n) => n > 1).length
console.log('Part 1:', numBadOverlaps)

for (const cloud of clouds) {
  const cloudIsHorizontal = cloud.startY === cloud.endY
  const cloudIsVertical = cloud.startX === cloud.endX
  if (!cloudIsHorizontal && !cloudIsVertical) {
    const decreasingX = cloud.endX < cloud.startX
    const decreasingY = cloud.endY < cloud.startY
    for (let i = 0; i <= Math.abs(cloud.startX - cloud.endX); i++) {
      const x = cloud.startX + i * (decreasingX ? -1 : 1)
      const y = cloud.startY + i * (decreasingY ? -1 : 1)
      map[y][x] = map[y][x] + 1
    }
  }
}

// const printMap = (m) => {
//   for (const row of m) {
//     console.log(row.join(' '))
//   }
// }
// printMap(map)

numBadOverlaps = map.flat().filter((n) => n > 1).length
console.log('Part 2:', numBadOverlaps)
