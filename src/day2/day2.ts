import { getInputs } from "../utils";

function checkRanges(ranges: string[]) {
  let total = 0
  for (const range of ranges) {
    const [start, end] = range.split('-').map(v => Number.parseInt(v))
    if(start && end) {
      total += checkRange2(start, end)
    }
  }
  return total
}

function checkRange(start: number, end: number) {
  let invalidTotal = 0
  for (let i = start; i <= end; i++) {
    const str = `${i}`
    if (str.slice(0, str.length / 2) === str.slice(str.length / 2)) {
      invalidTotal += i
    }
  }
  return invalidTotal
}

function hasPattern(s: string) {
  for (let i = 1; i <= (s.length / 2); i++) {
    const chunks = s.match(new RegExp(`.{1,${i}}`, 'g')) ?? []
    if (chunks.every(c => c === chunks[0])) {
      return true
    }
  }
  return false
}

function checkRange2(start: number, end: number) {
  let invalidTotal = 0
  for (let i = start; i <= end; i++) {
    const str = `${i}`
    if (hasPattern(str)) {
      invalidTotal += i
    }
  }
  return invalidTotal
}

async function main() {
  const input = await getInputs('input', ',')
  // console.log(hasPattern('1111'))
  console.log(checkRanges(input))
}

void main()

