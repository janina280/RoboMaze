import type { Maze } from "./game-context"

type Cell = { x: number; y: number }

class UnionFind {
    parent = new Map<string, string>()

    find(x: string): string {
        if (this.parent.get(x) !== x) {
            this.parent.set(x, this.find(this.parent.get(x)!))
        }
        return this.parent.get(x)!
    }

    union(a: string, b: string) {
        const ra = this.find(a)
        const rb = this.find(b)
        if (ra !== rb) this.parent.set(rb, ra)
    }
}

export function generateMazeKruskal(width: number, height: number): Maze {
    const walls = new Set<string>()
    const uf = new UnionFind()
    const edges: { a: Cell; b: Cell; wall: string }[] = []

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const key = `${x},${y}`
            uf.parent.set(key, key)

            // pereți inițiali
            walls.add(`wall-h-${x}-${y}`)
            walls.add(`wall-v-${x}-${y}`)

            if (y === height - 1) walls.add(`wall-h-${x}-${y + 1}`)
            if (x === width - 1) walls.add(`wall-v-${x + 1}-${y}`)

            if (x < width - 1) {
                edges.push({
                    a: { x, y },
                    b: { x: x + 1, y },
                    wall: `wall-v-${x + 1}-${y}`,
                })
            }

            if (y < height - 1) {
                edges.push({
                    a: { x, y },
                    b: { x, y: y + 1 },
                    wall: `wall-h-${x}-${y + 1}`,
                })
            }
        }
    }

    edges.sort(() => Math.random() - 0.5)

    for (const { a, b, wall } of edges) {
        const ca = `${a.x},${a.y}`
        const cb = `${b.x},${b.y}`

        if (uf.find(ca) !== uf.find(cb)) {
            uf.union(ca, cb)
            walls.delete(wall)
        }
    }

    return {
        width,
        height,
        start: { x: 0, y: 0 },
        goal: { x: width - 1, y: height - 1 },
        walls,
    }
}
