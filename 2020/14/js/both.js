const lines = require('fs').readFileSync('../input.txt', 'utf8').trim().split('\n')

let mask
let mem = {}

for (let line of lines) {
  const [l, r] = line.split(' = ')
  if (l === 'mask') {
    mask = r
  } else {
    const addr = Number(l.match(/\[(\d+)\]/)[1])
    let val = Number(r)
    for (let i = mask.length; i > 0; i--) {
      const maskBit = mask[mask.length - i]
      if (maskBit !== 'X') {
        maskBitVal = 2 ** (i - 1)
        if (Number(maskBit)) {
          if (maskBitVal > val) {
            val += maskBitVal
          } else {
            const valBitStr = val.toString(2)
            if (!Number(valBitStr[valBitStr.length - i])) {
              val += maskBitVal
            }
          }
        } else {
          if (maskBitVal <= val) {
            const valBitStr = val.toString(2)
            if (Number(valBitStr[valBitStr.length - i])) {
              val -= maskBitVal
            }
          }
        }
      }
    }
    mem[addr] = val
  }
}

console.log('Part 1:', Object.values(mem).reduce((a, b) => a + b, 0))

const generateAddresses = (baseAddr, mask) => {
  const valBitStr = baseAddr.toString(2)
  const masked = [...mask].map((m, i) => {
    const bitPos = mask.length - i
    if (bitPos <= valBitStr.length && m === '0') {
      return valBitStr[valBitStr.length - bitPos]
    }
    return m
  })
  let addrs = [[]]
  for (let b of masked) {
    if (b === 'X') {
      addrs = addrs.flatMap(addr => [[...addr, 0], [...addr, 1]]);
    } else {
      addrs.forEach(addr => addr.push(b));
    }
  }
  return addrs.map(addr => parseInt(addr.join(''), 2))
}

mem = {}

for (let line of lines) {
  const [l, r] = line.split(' = ')
  if (l === 'mask') {
    mask = r
  } else {
    const baseAddr = Number(l.match(/\[(\d+)\]/)[1])
    const addresses = generateAddresses(baseAddr, mask)
    addresses.forEach(addr => {mem[addr] = Number(r)})
  }
}

console.log('Part 2:', Object.values(mem).reduce((a, b) => a + b, 0))
