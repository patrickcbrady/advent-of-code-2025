import { readFile } from 'fs/promises'

class Dial {
  points = 100;
  position = 0;

  constructor(pos?: number) {
    if (pos) {
      this.position = pos
    } else {
      this.position = 0
    }
  }

  turn(instruction: string) {
    const direction = instruction.slice(0, 1)
    // ensure magnitude is within range. should be guaranteed by input but adds safety
    const magnitude = Number.parseInt(instruction.slice(1)) % this.points
    const offset = direction === 'R' ? magnitude : -magnitude
    // if the offset is negative, adding this.points brings it back into range
    // if the offset is positive, adding this.points has no effect on the modulo result
    this.position = (this.position + offset + this.points) % this.points
    return this.position
  }

  turn2(instruction: string) {
    const direction = instruction.slice(0, 1)
    const magnitude = Number.parseInt(instruction.slice(1))

    const incrementor = direction === 'R' ? 1 : -1
    let newPos = this.position
    let hits = 0
    for (let i = 0; i < magnitude; i++) {
      newPos += incrementor
      if (newPos < 0) {
        newPos = this.points + newPos
      }
      newPos = newPos % this.points
      if (newPos === 0) {
        hits += 1
      }
    }
    this.position = newPos
    return hits
  }

  getPassword(rotations: string[]) {
    return rotations.reduce((agg: number, curr: string): number => {
      const pos = this.turn(curr)
      if (pos === 0) {
        return agg + 1
      }
      return agg
    }, 0)
  }

  getPassword2(rotations: string[]) {
    return rotations.reduce((agg: number, curr: string): number => {
      return agg + this.turn2(curr)
    }, 0)
  }
}

async function main() {
  const rows = (await readFile('input', 'utf-8')).split('\n')
  const dial = new Dial(50)
  console.log(`The password is ${dial.getPassword(rows)}`)
  const dial2 = new Dial(50)
  console.log(`The new password is ${dial2.getPassword2(rows)}`)
}

void main()