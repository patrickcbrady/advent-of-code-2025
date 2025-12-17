import { getInputs } from "../utils";

function countNeighbors(map: string[][], row: number, col: number) {
  let count = 0
  for (let r = row - 1; r <= row + 1; r++) {
    if (r < 0 || r >= map.length) {
      continue
    }
    for (let c = col - 1; c <= col + 1; c++) {
      if (c < 0 || c >= map[r]!.length || c === col && r === row) {
        continue
      }
      if (['@', 'x'].includes(map[r]![c]!)) {
        count++
      }
    }
  }
  return count
}

function printMap(map: string[][]) {
  for (const row of map) {
    console.log(row.join(''))
  }
}

function markRolls(map: string[][]) {
  let reachableRolls = 0
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r]!.length; c++) {
      if (map[r]![c] === '@' && countNeighbors(map, r, c) < 4) {
        map[r]![c] = 'x'
        reachableRolls++
      }
    }
  }
  console.log(`The number of reachable rolls is ${reachableRolls}`)
  return reachableRolls
}

function removeRolls(map: string[][]) {
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r]!.length; c++) {
      if(map[r]![c] === 'x') {
        map[r]![c] = '.'
      }
    }
  }
}

async function main() {
  const map = (await getInputs('input', '\n')).map(r => Array.from(r))
  let totalRolls = 0
  let reachable = 0
  do {
    reachable = markRolls(map)
    totalRolls += reachable
    removeRolls(map)
  } while(reachable > 0)
  console.log(`Total rolls removed: ${totalRolls}`)
}

void main()