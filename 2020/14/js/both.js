const lines = require('fs').readFileSync('../input.txt', 'utf8').trim().split('\n')

let mask;
const mem = {}

for (let line of lines) {
  const [l, r] = line.split(' = ')
  if (l === 'mask') {
    mask = r
    console.log({mask})
  } else {
    const [_, addrStr] = l.match(/\[(\d+)\]/);
    const addr = Number(addrStr)
    let val = Number(r)
    for (let i = mask.length; i > 0; i--) {
      const maskBit = Number(mask[mask.length - i])
      if (!isNaN(maskBit)) {
        maskBitVal = 2 ** (i - 1)
        if (maskBit) {
          if ((val | maskBitVal) !== val) {
            val += maskBitVal
          }
        } else {
          if ((val | maskBitVal) === val) {
            val -= maskBitVal
          }
        }
      }
    }
    mem[addr] = val
  }
}

console.log('Part 1:', Object.values(mem).reduce((a, b) => a + b, 0))
