const fs = require('fs')

const requiredKeys = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']

const passportStrings = fs.readFileSync('../input.txt', 'utf8').trim().split('\n\n')

const passports = passportStrings.map(rawString => {
  const propertyStrings = rawString.split('\n').flatMap(sp => sp.split(' '))
  const obj = propertyStrings.reduce((acc, i) => {
    const [key, val] = i.split(':')
    return {
      ...acc,
      [key]: val,
    }
  }, {})
  return obj
})

const initialValidPassports = passports.filter(p =>
  requiredKeys.every(r => p.hasOwnProperty(r))
)

console.log('Part 1:', initialValidPassports.length)

const finalValidPassports = passports.filter(p =>
  requiredKeys.every(r => {
    if (!p.hasOwnProperty(r)) {
      return false
    } else {
      switch (r) {
        case 'byr':
          const byr = Number(p[r])
          return byr >= 1920 && byr <= 2002
        case 'iyr':
          const iyr = Number(p[r])
          return iyr >= 2010 && iyr <= 2020
        case 'eyr':
          const eyr = Number(p[r])
          return eyr >= 2020 && eyr <= 2030
        case 'hgt':
          const hgt = p[r]
          const unit = hgt.substring(hgt.length - 2)
          const val = Number(hgt.substring(0, hgt.length - 2))
          switch (unit) {
            case 'cm':
              return val >= 150 && val <= 193
            case 'in':
              return val >= 59 && val <= 76
          }
        case 'hcl':
          return /^#[0-9A-F]{6}$/i.test(p[r])
        case 'ecl':
          const validEyeColours = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']
          return validEyeColours.includes(p[r])
        case 'pid':
          return !isNaN(Number(p[r])) && p[r].length === 9
      }
    }
  })
)

console.log('Part 2:', finalValidPassports.length)
