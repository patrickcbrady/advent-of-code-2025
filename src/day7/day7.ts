import { getInputs } from "../utils";
import * as readline from "node:readline";

function addBeam(map: string[], row: number, col: number) {
  if (map[row]![col]! === '.') {
    map[row]! = map[row]!.slice(0, col) + '|' + map[row]!.slice(col + 1)
  }
}

function mapWalk(map: string[]): string {
  let col = map[0]!.indexOf('S')
  let splitCount = 0
  const seen: Set<string> = new Set()
  const queue: [number, number][] = []
  queue.push([1, col])
  while (queue.length) {
    const coords = queue.shift()
    if (!coords) {
      continue
    }
    const [currRow, currCol] = coords
    const pos = `${currRow},${currCol}`
    if (seen.has(pos)) {
      continue
    }
    const curr = map[currRow]?.[currCol]
    if (!curr) {
      continue
    }
    if (curr === '^') {
      seen.add(pos)
      splitCount++
      addBeam(map, currRow, currCol - 1)
      addBeam(map, currRow, currCol + 1)
      queue.push([currRow + 1, currCol + 1])
      queue.push([currRow + 1, currCol - 1])
    } else {
      addBeam(map, currRow, currCol)
      queue.push([currRow + 1, currCol])
    }
  }
  return `${splitCount} splits`
}

function print(map: string[]) {
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
  process.stdout.write(map.join('\n'))
}

function dfsWalk(map: string[]): number {
  const results: Record<string, number> = {}
  const dfs = (map: string[], row: number, col: number): number => {
    const cacheIndex = `${row},${col}`
    const cachedResult = results[cacheIndex]
    if (cachedResult) {
      return cachedResult
    }
    const node = map[row]?.[col]
    let result = 0
    if (!node) {
      result = 0
    }
    else if (row === map.length - 1) {
      result = 1
    }
    else if (node === '^') {
      result = dfs(map, row + 1, col + 1) + dfs(map, row + 1, col - 1)

    } else {
      result = dfs(map, row + 1, col)
    }
    results[cacheIndex] = result
    return result
  }
  const firstCol = map[0]!.indexOf('S')
  return dfs(map, 0, firstCol)
}

async function main() {
  const input = await getInputs('input', '\n')
  // print(input)
  // const splits = mapWalk(input)
  // console.log()
  // print(input)
  const timelines = dfsWalk(input)
  console.log(timelines)
}

void main()