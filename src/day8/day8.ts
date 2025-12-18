import { getInputs } from "../utils";

class UnionFind<T> {
  // Map to store parent of each element
  private parent: Map<T, T> = new Map();
  // Map to store sizes (upper bound on tree depth)
  private sizes: Map<T, number> = new Map();
  // Track total number of disjoint sets
  private count: number = 0;

  /**
   * Adds a new element as a singleton set.
   * @param x The element to add.
   */
  add(x: T): void {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.sizes.set(x, 1);
      this.count++;
    }
  }

  /**
   * Finds the representative (root) of the set containing x.
   * Implements Path Compression.
   * @param x The element to find.
   * @returns The root element, or null if not found.
   */
  find(x: T): T | null {
    if (!this.parent.has(x)) return null;

    const parentX = this.parent.get(x)!;
    if (parentX !== x) {
      // Path Compression: directly link current node to the root
      const root = this.find(parentX)!;
      this.parent.set(x, root);
      return root;
    }
    return x;
  }

  /**
   * Merges the sets containing x and y.
   * Implements Union by Rank.
   * @returns True if sets were merged, false if already in same set.
   */
  union(x: T, y: T): boolean {
    this.add(x);
    this.add(y);

    const rootX = this.find(x)!;
    const rootY = this.find(y)!;

    if (rootX === rootY) return false;

    const sizeX = this.sizes.get(rootX)!;
    const sizeY = this.sizes.get(rootY)!;

    // Union by Size: attach smaller tree under larger tree
    if (sizeX < sizeY) {
      this.parent.set(rootX, rootY);
      this.sizes.set(rootY, sizeX + sizeY);
      this.sizes.delete(rootX)
    } else {
      this.parent.set(rootY, rootX);
      this.sizes.set(rootX, sizeX + sizeY);
      this.sizes.delete(rootY)
    }

    this.count--;
    return true;
  }

  /**
   * Checks if two elements are in the same set.
   */
  connected(x: T, y: T): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);
    return rootX !== null && rootY !== null && rootX === rootY;
  }

  /**
   * Returns the current number of disjoint sets.
   */
  get numSets(): number {
    return this.count;
  }

  /**
  * Returns sizes of sets in descending order
  */
  getSortedSizes(): number[] {
    return Array.from(this.sizes.values()).sort((a, b) => b - a)
  }
}

class Coord {
  x: number
  y: number
  z: number
  circuit: Set<string> | null

  constructor(coords: string) {
    const [x, y, z] = coords.split(',').map((num) => Number.parseInt(num))
    if (!x || !y || !z) {
      throw new Error()
    }
    this.x = x
    this.y = y
    this.z = z
    this.circuit = null
  }

  distTo(coord: Coord) {
    return Math.sqrt(Math.pow(this.x - coord.x, 2) + Math.pow(this.y - coord.y, 2) + Math.pow(this.z - coord.z, 2))
  }

  toString() {
    return `${this.x},${this.y},${this.z}`
  }

  equals(coord: Coord) {
    return this.x === coord.x && this.y === coord.y && this.z === coord.z
  }

}

function connectBoxes(boxes: Coord[]) {
  const circuits = new UnionFind<Coord>()
  for (const box of boxes) {
    circuits.add(box)
  }
  const distToPairs: Map<number, Set<string>> = new Map()
  for (const [idxA, boxA] of boxes.entries()) {
    for (let i = idxA + 1; i < boxes.length; i++) {
      const boxB = boxes[i]!
      const dist = boxA.distTo(boxB)
      if (!distToPairs.get(dist)) {
        distToPairs.set(dist, new Set())
      }
      const indices: [number, number] = [idxA, i]
      distToPairs.get(dist)!.add(indices.sort().join(','))
    }
  }
  const distances = [...distToPairs.keys()].sort((a, b) => a - b)
  let i = 0
  let lastBoxes: [Coord, Coord] = [boxes[0]!, boxes[1]!]
  while (circuits.numSets > 1 && i < distances.length) {
    const dist = distances[i]!
    const boxSet= distToPairs.get(dist)!
    for (const box of [...boxSet]) {
      const [idxA, idxB] = box.split(',').map(n => Number.parseInt(n))
      const [boxA, boxB] = [boxes[idxA!]!, boxes[idxB!]!]
      if (!circuits.connected(boxA, boxB)) {
        circuits.union(boxA, boxB)
        lastBoxes = [boxA, boxB]
      }
    }
    i++
  }
  const circuitSizes = circuits.getSortedSizes()
  console.log(circuitSizes.slice(0, 3).reduce((agg, curr) => agg * curr, 1))
  const [lastBoxA, lastBoxB] = lastBoxes
  console.log(`${lastBoxA.x * lastBoxB.x}`)
}



async function main() {
  const input = (await getInputs('input', '\n')).map((row) => new Coord(row))
  // console.log(input)
  connectBoxes(input)
}

void main()