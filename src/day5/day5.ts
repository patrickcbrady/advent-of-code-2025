import { getInputs } from "../utils";

class Range {
  start: number
  end: number

  constructor(start: number, end: number) {
    if (start > end) {
      throw Error('Range must be positive and include at least 1 value')
    }
    this.start = start
    this.end = end
  }

  has(x: number) {
    return x >= this.start && x <= this.end
  }

  overlaps(r: Range) {
    return this.start <= r.end && r.start <= this.end
  }

  merge(r: Range) {
    return new Range(Math.min(this.start, r.start), Math.max(this.end, r.end))
  }

  // return total number of numbers in the range
  includes() {
    return this.end - this.start + 1
  }
}

function isFresh(ingId: number, ranges: Range[]) {
  for (const range of ranges) {
    if (range.has(ingId)) {
      return true
    }
  }
  return false
}

function getRanges(rangeStrings: string[]): Range[] {
  return rangeStrings.map((r) => {
    const [start, end] = r.split('-').map(num => Number.parseInt(num))
    if (start && end) {
      return new Range(start, end)
    } else {
      throw Error()
    }
  })
}

function mergeRanges(ranges: Range[]): Range[] {
  const merged: (Range)[] = []
  const sortedRanges = ranges.sort((a, b) => {
    return a.start - b.start
  })
  for (const range of sortedRanges) {
    const lastMerged = merged[merged.length - 1]
    if (lastMerged && range.overlaps(lastMerged)) {
      merged[merged.length - 1] = range.merge(lastMerged)
    } else {
      merged.push(range)
    }
  }
  return merged
}

function countFresh(ingredients: number[], ranges: Range[]) {
  return ingredients.reduce((agg, curr) => {
    return isFresh(curr, ranges) ? agg + 1 : agg
  }, 0)
}

async function main() {
  const [rangeStrings, ingredients] = (await getInputs('input', '\n\n')).map(input => input.split('\n'))
  if (!rangeStrings || !ingredients) {
    throw Error()
  }
  const ranges = getRanges(rangeStrings)

  console.log(`${countFresh(ingredients.map(i => Number.parseInt(i)), ranges)} ingredients are fresh`)
  const mergedRanges = mergeRanges(ranges)
  const totalFreshes = mergedRanges.reduce((agg, curr) => {
    return agg + curr.includes()
  }, 0)
  console.log(`The DB has ${totalFreshes} fresh ingredients`)
}

void main()