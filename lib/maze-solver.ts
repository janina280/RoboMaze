import type { Maze } from "./game-context"

type Point = { x: number; y: number }

function key(p: Point) {
    return `${p.x},${p.y}`
}

export function findShortestPath(maze: Maze): Point[] {
    const queue: Point[] = [maze.start]
    const visited = new Set<string>()
    const cameFrom = new Map<string, Point | null>()

    visited.add(key(maze.start))
    cameFrom.set(key(maze.start), null)

    const directions = [
        { dx: 1, dy: 0 },  // right
        { dx: -1, dy: 0 }, // left
        { dx: 0, dy: 1 },  // down
        { dx: 0, dy: -1 }, // up
    ]

    function canMove(from: Point, to: Point): boolean {
        if (to.x < 0 || to.y < 0 || to.x >= maze.width || to.y >= maze.height) {
            return false
        }

        if (to.x === from.x + 1) return !maze.walls.has(`wall-v-${to.x}-${to.y}`)
        if (to.x === from.x - 1) return !maze.walls.has(`wall-v-${from.x}-${from.y}`)
        if (to.y === from.y + 1) return !maze.walls.has(`wall-h-${to.x}-${to.y}`)
        if (to.y === from.y - 1) return !maze.walls.has(`wall-h-${from.x}-${from.y}`)

        return false
    }

    while (queue.length) {
        const current = queue.shift()!

        if (
            current.x === maze.goal.x &&
            current.y === maze.goal.y
        ) {
            // reconstruire drum
            const path: Point[] = []
            let cur: Point | null = current

            while (cur) {
                path.push(cur)
                cur = cameFrom.get(key(cur)) ?? null
            }

            return path.reverse()
        }

        for (const d of directions) {
            const next = { x: current.x + d.dx, y: current.y + d.dy }

            if (!visited.has(key(next)) && canMove(current, next)) {
                visited.add(key(next))
                cameFrom.set(key(next), current)
                queue.push(next)
            }
        }
    }

    return []
}
